#!/usr/bin/env bash
# One-time server setup for HEMORA on Ubuntu 22.04/24.04. Safe to re-run.
# Usage (on the server, as the ubuntu user):  bash bootstrap-server.sh
set -euo pipefail

APP_DIR=/opt/hemora
DEPLOY_USER="${SUDO_USER:-$USER}"

echo "==> Installing base packages"
sudo apt-get update -y
sudo apt-get install -y ca-certificates curl gnupg ufw unattended-upgrades

echo "==> Installing Docker Engine + Compose plugin (official repository)"
if ! command -v docker >/dev/null 2>&1; then
  sudo install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor --yes -o /etc/apt/keyrings/docker.gpg
  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu ${VERSION_CODENAME} stable" \
    | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  sudo apt-get update -y
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
fi
sudo systemctl enable --now docker
sudo usermod -aG docker "$DEPLOY_USER"

echo "==> Log rotation for containers"
sudo tee /etc/docker/daemon.json >/dev/null <<'JSON'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
JSON
sudo systemctl restart docker

echo "==> Swap (2 GB) if the machine has none"
if ! swapon --show | grep -q .; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

echo "==> Firewall: SSH, HTTP, HTTPS"
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp
sudo ufw --force enable

echo "==> Automatic security updates"
sudo dpkg-reconfigure -f noninteractive unattended-upgrades

echo "==> App directory $APP_DIR"
sudo mkdir -p "$APP_DIR"
sudo chown "$DEPLOY_USER":"$DEPLOY_USER" "$APP_DIR"
if [ ! -f "$APP_DIR/.env" ]; then
  printf 'SITE_ADDRESS=:80\n' > "$APP_DIR/.env"
fi

echo
echo "Done. Log out and back in (or run 'newgrp docker') so '$DEPLOY_USER' can use docker without sudo."
