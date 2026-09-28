#!/usr/bin/env bash
# Route https://<domain>/hemora (Next.js) and /hemora/wp-* (WordPress) through an existing
# Caddy container that already owns ports 80/443 and serves <domain>.
#
#   bash attach-to-proxy.sh <domain> [caddy container]
#   e.g. bash attach-to-proxy.sh website.taufikandrian.my.id
#
# Shows the exact change and asks before touching anything. Then: writes PROXY_NETWORK to
# /opt/hemora/.env, backs up the Caddyfile, inserts the HEMORA routes inside the domain's
# existing site block (or creates the block), validates inside the container and reloads
# Caddy gracefully. On validation failure the backup is restored. Re-running replaces the
# previous HEMORA routes (including the older standalone "# BEGIN HEMORA" site block).
set -euo pipefail

DOMAIN="${1:?Usage: attach-to-proxy.sh <domain> [caddy container]}"
CADDY="${2:-n8n-caddy-1}"
APP_DIR=/opt/hemora
HERE="$(cd "$(dirname "$0")" && pwd)"
ROUTES="$HERE/Caddyfile.routes"
[ -f "$ROUTES" ] || ROUTES="$APP_DIR/Caddyfile.routes"
[ -f "$ROUTES" ] || { echo "Caddyfile.routes not found next to this script or in $APP_DIR." >&2; exit 1; }

docker inspect "$CADDY" >/dev/null 2>&1 || { echo "Container '$CADDY' not found." >&2; exit 1; }

NETWORK="$(docker inspect "$CADDY" --format '{{range $name, $_ := .NetworkSettings.Networks}}{{$name}}{{"\n"}}{{end}}' | grep -v '^bridge$' | head -n1)"
[ -n "$NETWORK" ] || { echo "Could not find a user-defined network on '$CADDY'." >&2; exit 1; }

CADDYFILE="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy/Caddyfile"}}{{.Source}}{{end}}{{end}}')"
if [ -z "$CADDYFILE" ]; then
  DIR="$(docker inspect "$CADDY" --format '{{range .Mounts}}{{if eq .Destination "/etc/caddy"}}{{.Source}}{{end}}{{end}}')"
  [ -n "$DIR" ] && CADDYFILE="$DIR/Caddyfile"
fi
{ [ -n "$CADDYFILE" ] && sudo test -f "$CADDYFILE"; } || { echo "Could not locate the Caddyfile mounted into '$CADDY'." >&2; exit 1; }

WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
sudo cat "$CADDYFILE" > "$WORK/current"

# Build the new Caddyfile with Python (brace-aware), report what it did.
python3 - "$WORK/current" "$ROUTES" "$DOMAIN" "$WORK/new" "$WORK/report" <<'PY'
import re, sys
current_path, routes_path, domain, new_path, report_path = sys.argv[1:]
text = open(current_path).read()
routes = open(routes_path).read().rstrip("\n") + "\n"
report = []

# 1. Drop any earlier HEMORA content (inline routes or the old standalone site block).
lines = text.splitlines(keepends=True)
out, skipping = [], False
for line in lines:
    if line.strip() == "# BEGIN HEMORA":
        skipping = True
        report.append("removed previous HEMORA routes")
        continue
    if skipping:
        if line.strip() == "# END HEMORA":
            skipping = False
        continue
    out.append(line)
lines = out

# 2. Find the top-level site block whose address list contains the domain.
def addresses(line):
    head = line.split("{")[0]
    return [a.strip() for a in re.split(r"[,\s]+", head) if a.strip()]

def matches(addr):
    addr = re.sub(r"^https?://", "", addr)
    addr = addr.split("/")[0].split(":")[0]
    return addr == domain

depth, target = 0, None
for i, line in enumerate(lines):
    stripped = line.strip()
    if depth == 0 and stripped.endswith("{") and not stripped.startswith("#") and not stripped.startswith("("):
        if any(matches(a) for a in addresses(stripped)):
            target = i
            break
    depth += line.count("{") - line.count("}")

if target is None:
    lines.append("\n%s {\n%s}\n" % (domain, routes))
    report.append("no site block for %s found - created a new one" % domain)
else:
    lines.insert(target + 1, routes)
    report.append("inserted HEMORA routes at the top of the existing '%s' block (line %d)" % (lines[target].strip(), target + 1))
    # Warn about directives that run before `handle` and could swallow /hemora requests.
    depth, body = 1, []
    for line in lines[target + 2:]:
        depth += line.count("{") - line.count("}")
        if depth <= 0:
            break
        body.append(line.strip())
    risky = [b for b in body if re.match(r"^(try_files|rewrite|uri|redir|handle_path)\b", b)]
    if risky:
        report.append("WARNING: this block has directives that run before HEMORA's routes and may intercept /hemora: " + "; ".join(risky))

open(new_path, "w").write("".join(lines))
open(report_path, "w").write("\n".join(report) + "\n")
PY

echo "Caddy container : $CADDY"
echo "Proxy network   : $NETWORK"
echo "Caddyfile       : $CADDYFILE"
echo "Domain          : $DOMAIN  ->  https://$DOMAIN/hemora"
sed 's/^/Plan            : /' "$WORK/report"
echo "----- change -----"
diff -u "$WORK/current" "$WORK/new" || true
echo "------------------"
read -r -p "Apply this change and reload Caddy? [y/N] " answer
[ "$answer" = "y" ] || [ "$answer" = "Y" ] || { echo "Aborted - nothing changed."; exit 1; }

touch "$APP_DIR/.env"
sed -i '/^PROXY_NETWORK=/d' "$APP_DIR/.env"
echo "PROXY_NETWORK=$NETWORK" >> "$APP_DIR/.env"

BACKUP="$CADDYFILE.bak-hemora-$(date +%Y%m%d%H%M%S)"
sudo cp -p "$CADDYFILE" "$BACKUP"
echo "Backup          : $BACKUP"

# Write IN PLACE: a single-file bind mount keeps pointing at the original inode.
sudo sh -c "cat '$WORK/new' > '$CADDYFILE'"

if docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile >/dev/null 2>&1; then
  docker exec "$CADDY" caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
  echo "Caddy reloaded. HEMORA: https://$DOMAIN/hemora   WordPress: https://$DOMAIN/hemora/wp-admin"
else
  echo "Validation failed - restoring the previous Caddyfile:" >&2
  docker exec "$CADDY" caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile 2>&1 | tail -5 >&2 || true
  sudo sh -c "cat '$BACKUP' > '$CADDYFILE'"
  exit 1
fi
