# Deploying HEMORA

Production runs on a shared Ubuntu server with Docker. Ports 80/443 there belong to an
existing Caddy container (`n8n-caddy-1`) that fronts several sites, so HEMORA publishes no
ports: its container joins that proxy's Docker network and the proxy routes the HEMORA
domain to it.

```
GitHub push to main
  └─ Actions: lint + typecheck + tests
      └─ build Docker image → ghcr.io/taufikandrian18/hemora:sha-<commit> (+ :latest)
          └─ SSH to server → /opt/hemora: docker compose pull web && up -d → health check
Server: n8n-caddy-1 (:80/:443, automatic HTTPS) → hemora-web:3000 (Next.js standalone)
```

Files: `Dockerfile`, `deploy/docker-compose.yml`, `deploy/Caddyfile.site`,
`deploy/attach-to-proxy.sh`, `deploy/bootstrap-server.sh` (fresh servers only),
`.github/workflows/deploy.yml`.

## 1. Cloud firewall

The shared proxy already serves 80/443, so nothing new needs opening. Keep SSH (22) open
for the deploy job.

## 2. Create a deploy key (on your laptop)

```bash
ssh-keygen -t ed25519 -C "hemora-deploy" -f ~/.ssh/hemora_deploy -N ""
ssh-copy-id -i ~/.ssh/hemora_deploy.pub ubuntu@<SERVER_IP>
ssh -i ~/.ssh/hemora_deploy ubuntu@<SERVER_IP> 'echo deploy key works'
```

## 3. Prepare the server (once)

On a server that already has Docker (like the current one) skip `bootstrap-server.sh`; just make sure
`/opt/hemora` exists and belongs to the deploy user:

```bash
sudo mkdir -p /opt/hemora && sudo chown ubuntu:ubuntu /opt/hemora
```

Then, from your laptop in the repo, copy the proxy files and attach HEMORA to the shared Caddy:

```bash
scp deploy/Caddyfile.site deploy/attach-to-proxy.sh ubuntu@<SERVER_IP>:/opt/hemora/
ssh -t ubuntu@<SERVER_IP> 'bash /opt/hemora/attach-to-proxy.sh "hemora.<SERVER_IP>.sslip.io"'
```

The script finds the proxy's network and Caddyfile, writes `PROXY_NETWORK` to `/opt/hemora/.env`,
backs up the Caddyfile, adds a `# BEGIN HEMORA … # END HEMORA` block, validates it and reloads Caddy
gracefully. If validation fails it restores the backup, so the other sites are never affected.
`hemora.<SERVER_IP>.sslip.io` is a free wildcard DNS name for the server IP, good until a real domain
exists; Caddy still issues an HTTPS certificate for it.

## 4. Add GitHub secrets

Repository → Settings → Secrets and variables → Actions → New repository secret (or as secrets of an
environment named exactly `production`, which the deploy job uses):

| Secret | Value |
|---|---|
| `DEPLOY_HOST` | server IP (or hostname) |
| `DEPLOY_USER` | `ubuntu` |
| `DEPLOY_SSH_KEY` | contents of `~/.ssh/hemora_deploy` (the **private** key, including the BEGIN/END lines) |
| `DEPLOY_KNOWN_HOSTS` | output of `ssh-keyscan -H <SERVER_IP>` |

With the GitHub CLI instead:

```bash
gh secret set DEPLOY_HOST --body "<SERVER_IP>"
gh secret set DEPLOY_USER --body "ubuntu"
gh secret set DEPLOY_SSH_KEY < ~/.ssh/hemora_deploy
ssh-keyscan -H <SERVER_IP> | gh secret set DEPLOY_KNOWN_HOSTS
```

The container image is private on GHCR; the workflow logs the server in with the run's short-lived
`GITHUB_TOKEN` for the pull and logs out afterwards, so no long-lived registry token is stored.

## 5. Deploy

Merge to `main` (or run **Actions → Deploy → Run workflow** once the workflow exists on `main`).
When the run is green, open `https://hemora.<SERVER_IP>.sslip.io`.

## 6. Switch to a real domain

1. Create DNS `A` records for the domain (and `www`) pointing to the server IP.
2. Re-run the attach script with the new address (it replaces the HEMORA block):
   ```bash
   ssh -t ubuntu@<SERVER_IP> 'bash /opt/hemora/attach-to-proxy.sh "hemora.id, www.hemora.id"'
   docker logs -f n8n-caddy-1   # on the server: watch the certificate being issued
   ```

## Operations

```bash
cd /opt/hemora
docker compose ps                     # status + health
docker compose logs -f --tail=100 web # app logs
docker compose restart web

# Roll back to an earlier release (tags are sha-<7 char commit>, see GitHub → Packages):
sed -i 's#^WEB_IMAGE=.*#WEB_IMAGE=ghcr.io/taufikandrian18/hemora:sha-XXXXXXX#' .env
docker compose pull web && docker compose up -d
```

A private image needs a registry login for manual pulls:
`echo <PAT with read:packages> | docker login ghcr.io -u taufikandrian18 --password-stdin`.

## Local checks before pushing

```bash
npm run lint && npx tsc --noEmit -p . && npm test
docker build -t hemora:local . && docker run --rm -p 3000:3000 hemora:local
curl localhost:3000/api/health
```
