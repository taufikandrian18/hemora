#!/usr/bin/env bash
# Connect HEMORA to an existing Caddy container that already owns ports 80/443.
#
#   bash attach-to-proxy.sh "<site address>" [caddy container]
#   e.g. bash attach-to-proxy.sh "hemora.43.133.130.148.sslip.io"
#        bash attach-to-proxy.sh "hemora.id, www.hemora.id"
#
# What it does (asks before changing anything):
#   1. finds the Caddy container's Docker network and its mounted Caddyfile
#   2. writes PROXY_NETWORK to /opt/hemora/.env
#   3. backs up the Caddyfile, appends/replaces the HEMORA block, validates it inside the
#      container, and reloads Caddy gracefully; if validation fails, the backup is restored.
set -euo pipefail

SITE_ADDRESS="${1:?Usage: attach-to-proxy.sh \"<site address>\" [caddy container]}"
CADDY="${2:-n8n-caddy-1}"
APP_DIR=/opt/hemora
BLOCK_TEMPLATE="$(dirname "$0")/Caddyfile.site"
[ -f "$BLOCK_TEMPLATE" ] || BLOCK_TEMPLATE="$APP_DIR/Caddyfile.site"

docker inspect "$CADDY" >/dev/null 2>&1 || { echo "Container '$CADDY' not found." >&2; exit 1; }

NETWORK="$(docker inspect "$CADDY" --format '{{range $name, $_ := .NetworkSettings.Networks}}{{$name}}{{"\n"}}{{end}}' | grep -v '^bridge$' | head -n1)"
[ -n "$NETWORK" ] || { echo "Could not find a user-defined network on '$CADDY'." >&2; exit 1; }

CADDYFILE="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')"
if [ -z "$CADDYFILE" ]; then
  DIR="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy"}}{{.Source}}{{end}}{{end}}')"
  [ -n "$DIR" ] && CADDYFILE="$DIR/Caddyfile"
fi
[ -n "$CADDYFILE" ] && sudo test -f "$CADDYFILE" || { echo "Could not locate the Caddyfile mounted into '$CADDY'." >&2; exit 1; }

echo "Caddy container : $CADDY"
echo "Proxy network   : $NETWORK"
echo "Caddyfile       : $CADDYFILE"
echo "Site address    : $SITE_ADDRESS"
read -r -p "Proceed? [y/N] " answer
[ "$answer" = "y" ] || [ "$answer" = "Y" ] || { echo "Aborted."; exit 1; }

touch "$APP_DIR/.env"
sed -i '/^PROXY_NETWORK=/d' "$APP_DIR/.env"
echo "PROXY_NETWORK=$NETWORK" >> "$APP_DIR/.env"

BACKUP="$CADDYFILE.bak-hemora-$(date +%Y%m%d%H%M%S)"
sudo cp -p "$CADDYFILE" "$BACKUP"
echo "Backup          : $BACKUP"

# Build the new file content, then write it back IN PLACE (a single-file bind mount keeps
# pointing at the original inode, so the file must not be replaced by a new one).
NEW_CONTENT="$(sudo sed '/^# BEGIN HEMORA$/,/^# END HEMORA$/d' "$CADDYFILE"; echo; sed -n '/^# BEGIN HEMORA$/,/^# END HEMORA$/p' "$BLOCK_TEMPLATE" | sed "s|__SITE_ADDRESS__|$SITE_ADDRESS|")"
printf '%s\n' "$NEW_CONTENT" | sudo tee "$CADDYFILE" >/dev/null

if docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
  docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
  echo "Caddy reloaded. HEMORA will be served at: $SITE_ADDRESS"
else
  echo "Validation failed - restoring the previous Caddyfile." >&2
  sudo sh -c "cat '$BACKUP' > '$CADDYFILE'"
  docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile || true
  exit 1
fi
