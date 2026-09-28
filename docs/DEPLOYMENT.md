# Deploying HEMORA

Production runs on a single Ubuntu server with Docker:

```
GitHub push to main
  └─ Actions: lint + typecheck + tests
      └─ build Docker image → ghcr.io/taufikandrian18/hemora:sha-<commit> (+ :latest)
          └─ SSH to server → /opt/hemora: docker compose pull web && up -d → health check
Server: Caddy (:80/:443, automatic HTTPS) → web (Next.js standalone, :3000)
```

Files: `Dockerfile`, `deploy/docker-compose.yml`, `deploy/Caddyfile`, `deploy/bootstrap-server.sh`,
`.github/workflows/deploy.yml`.

## 1. Open the cloud firewall

In your cloud console's security group for the server, allow inbound **TCP 22, TCP 80, TCP 443, UDP 443**.
(`bootstrap-server.sh` configures the server's own `ufw` firewall, but a cloud security group sits in
front of it and must allow the same ports.)

## 2. Create a deploy key (on your laptop)

```bash
ssh-keygen -t ed25519 -C "hemora-deploy" -f ~/.ssh/hemora_deploy -N ""
ssh-copy-id -i ~/.ssh/hemora_deploy.pub ubuntu@<SERVER_IP>
ssh -i ~/.ssh/hemora_deploy ubuntu@<SERVER_IP> 'echo deploy key works'
```

## 3. Prepare the server (once)

```bash
scp deploy/bootstrap-server.sh ubuntu@<SERVER_IP>:~
ssh ubuntu@<SERVER_IP> 'bash ~/bootstrap-server.sh'
ssh ubuntu@<SERVER_IP> 'docker --version && docker compose version && ls -la /opt/hemora'
```

The script installs Docker Engine + Compose, adds `ubuntu` to the `docker` group, enables `ufw`
(22/80/443), adds 2 GB swap if none exists, turns on unattended security upgrades, and creates
`/opt/hemora/.env`.

## 4. Add GitHub secrets

Repository → Settings → Secrets and variables → Actions → New repository secret:

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
When the run is green, open `http://<SERVER_IP>`.

## 6. Add a domain + HTTPS

1. Create DNS `A` records for the domain (and `www`) pointing to the server IP.
2. On the server:
   ```bash
   cd /opt/hemora
   sed -i 's/^SITE_ADDRESS=.*/SITE_ADDRESS=hemora.id, www.hemora.id/' .env
   docker compose up -d
   docker compose logs -f caddy   # watch the certificate being issued
   ```
Caddy obtains and renews Let's Encrypt certificates automatically.

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
