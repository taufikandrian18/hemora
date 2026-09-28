# Deploying HEMORA

| What | URL |
|---|---|
| Website (Next.js) | https://website.taufikandrian.my.id/hemora |
| WordPress admin (headless CMS) | https://website.taufikandrian.my.id/hemora/wp-admin |

The server is shared. Ports 80/443 belong to an existing Caddy container (`n8n-caddy-1`) that
already serves `website.taufikandrian.my.id` and other sites, so HEMORA publishes no ports:

```
GitHub push to main
  └─ Actions: lint + typecheck + tests
      └─ build image with NEXT_PUBLIC_BASE_PATH=/hemora → ghcr.io/taufikandrian18/hemora:sha-<commit>
          └─ SSH → /opt/hemora: docker compose pull web && up -d → health check

n8n-caddy-1 (website.taufikandrian.my.id block, HEMORA routes inserted at the top)
  ├─ /hemora/wp-admin, wp-login.php, wp-json, wp-content, wp-includes → hemora-wp:80 (WordPress)
  └─ /hemora, /hemora/*                                              → hemora-web:3000 (Next.js)
  everything else on the domain → unchanged
WordPress ↔ MariaDB on a private network (not reachable from outside)
```

Files: `Dockerfile`, `deploy/docker-compose.yml`, `deploy/Caddyfile.routes`,
`deploy/attach-to-proxy.sh`, `deploy/wordpress/{htaccess,uploads.ini}`,
`.github/workflows/deploy.yml`. `deploy/bootstrap-server.sh` is only for a fresh server.

## 1. Server secrets (once, on the server)

```bash
sudo mkdir -p /opt/hemora/wordpress && sudo chown -R ubuntu:ubuntu /opt/hemora
cd /opt/hemora
grep -q '^WP_URL=' .env 2>/dev/null || cat >> .env <<EOF
WP_URL=https://website.taufikandrian.my.id/hemora
WP_DB_PASSWORD=$(openssl rand -hex 24)
WP_DB_ROOT_PASSWORD=$(openssl rand -hex 24)
EOF
grep -q '^REVALIDATE_SECRET=' .env || echo "REVALIDATE_SECRET=$(openssl rand -hex 24)" >> .env
chmod 600 .env
```

`.env` never leaves the server. Keep a copy of the passwords in your password manager.

## 2. Route the domain to HEMORA (once, from your laptop in the repo)

```bash
scp deploy/Caddyfile.routes deploy/attach-to-proxy.sh ubuntu@<SERVER_IP>:/opt/hemora/
ssh -t ubuntu@<SERVER_IP> 'bash /opt/hemora/attach-to-proxy.sh website.taufikandrian.my.id'
```

The script prints the proxy network, the Caddyfile path and a **diff of the exact change**, then
asks before applying. It writes `PROXY_NETWORK` to `.env`, backs up the Caddyfile, inserts the
HEMORA routes between `# BEGIN HEMORA` / `# END HEMORA` at the top of the domain's site block
(and removes any earlier HEMORA block, e.g. the sslip.io one), validates and reloads Caddy
gracefully. If validation fails, the backup is restored. If it prints a `WARNING` about
`try_files` / `rewrite` / `redir` directives, stop and review: those run before HEMORA's routes.

## 3. GitHub secrets

Settings → Secrets and variables → Actions (repository secrets, or secrets of an environment
named exactly `production`):

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | server IP |
| `DEPLOY_USER` | `ubuntu` |
| `DEPLOY_SSH_KEY` | private deploy key (`~/.ssh/hemora_deploy`, including BEGIN/END lines) |
| `DEPLOY_KNOWN_HOSTS` | output of `ssh-keyscan -H <SERVER_IP>` |

Deploy key, if you do not have one yet:

```bash
ssh-keygen -t ed25519 -C "hemora-deploy" -f ~/.ssh/hemora_deploy -N ""
ssh-copy-id -i ~/.ssh/hemora_deploy.pub ubuntu@<SERVER_IP>
```

## 4. Deploy

Merge to `main` (or **Actions → Deploy → Run workflow**). The deploy job refuses to run until
`PROXY_NETWORK`, `WP_URL`, `WP_DB_PASSWORD`, `WP_DB_ROOT_PASSWORD` and `REVALIDATE_SECRET` exist in
`/opt/hemora/.env`.
The first run also starts WordPress and MariaDB.

## 5. Install WordPress (once, right after the first deploy)

The web installer (`wp-admin/install.php`) is deliberately blocked at the proxy so nobody can
claim the fresh install. Install from the server with WP-CLI instead:

```bash
cd /opt/hemora
docker compose run --rm wpcli wp core install \
  --url="https://website.taufikandrian.my.id/hemora" \
  --title="HEMORA" \
  --admin_user="<choose a username, not 'admin'>" \
  --admin_email="<your email>" \
  --skip-email --prompt=admin_password     # asks for the password, keeps it out of shell history
docker compose run --rm wpcli wp rewrite structure '/%postname%/'
```

Then sign in at https://website.taufikandrian.my.id/hemora/wp-admin.

## 6. Content management (once, after WordPress is installed)

```bash
cd /opt/hemora
docker compose run --rm wpcli wp plugin install advanced-custom-fields --activate
docker compose run --rm wpcli wp hemora seed --source=http://hemora-web:3000/hemora/api/content/defaults
```

This creates **HEMORA Properties → Lereng Senja / Sriti Palu** in wp-admin and pre-fills every field
(text, offers, chapters, contact) with the live copy; images and videos are imported into the Media
Library (takes a minute or two). `--force` re-imports over existing entries.

How it works:

- Content model: `deploy/wordpress/mu-plugins/hemora-content.php` (must-use plugin, versioned here,
  mounted read-only). Fields are grouped in tabs: Hero & home, Story, Offers, Stay, Dining, Wellness,
  Journal, Guest note & booking, Contact.
- The site reads `/wp/v2/hemora-properties` over the internal Docker network (`app/cms.ts`).
  **An empty field falls back to the built-in copy**, and if WordPress is down the site keeps serving
  the built-in content.
- Saving a property calls `/hemora/api/revalidate` (shared `REVALIDATE_SECRET`) and re-visits the
  pages, so the change is live within seconds; pages also refresh on their own every 5 minutes.

## Operations

```bash
cd /opt/hemora
docker compose ps                        # status + health of web, wordpress, db
docker compose logs -f --tail=100 web    # Next.js logs
docker compose logs -f --tail=100 wordpress
docker compose run --rm wpcli wp plugin list

# Roll back the website to an earlier release (tags: sha-<7 char commit>, see GitHub → Packages)
sed -i 's#^WEB_IMAGE=.*#WEB_IMAGE=ghcr.io/taufikandrian18/hemora:sha-XXXXXXX#' .env
docker compose up -d web

# Database backup (store it off the server)
docker compose exec -T db sh -c 'mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" hemora' | gzip > ~/hemora-db-$(date +%F).sql.gz
```

Remove HEMORA from the proxy: delete the lines between `# BEGIN HEMORA` and `# END HEMORA` in
the proxy Caddyfile, then `docker exec n8n-caddy-1 caddy reload --config /etc/caddy/Caddyfile`.

## Local checks before pushing

```bash
npm run lint && npx tsc --noEmit -p . && npm test
docker build --build-arg NEXT_PUBLIC_BASE_PATH=/hemora -t hemora:local .
docker run --rm -p 3000:3000 hemora:local   # then open http://localhost:3000/hemora
```
