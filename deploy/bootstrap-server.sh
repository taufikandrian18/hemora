#!/usr/bin/env bash
# One-time server setup for HEMORA on Ubuntu 22.04/24.04. Safe to re-run, and safe on a
# server that already hosts other projects: it never overwrites existing Docker config,
# never restarts Docker while containers are running, and never turns on a firewall that is off.
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
if [ -f /etc/docker/daemon.json ]; then
  echo "    /etc/docker/daemon.json already exists - left untouched (HEMORA's compose file sets its own log limits)."
elif [ -n "$(sudo docker ps -q)" ]; then
  echo "    Other containers are running - not restarting Docker (HEMORA's compose file sets its own log limits)."
else
  sudo tee /etc/docker/daemon.json >/dev/null <<'JSON'
{ "log-driver": "json-file", "log-opts": { "max-size": "10m", "max-file": "3" } }
JSON
  sudo systemctl restart docker
fi

echo "==> Swap (2 GB) if the machine has none"
if ! swapon --show | grep -q .; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

echo "==> Firewall"
if sudo ufw status | grep -q "Status: active"; then
  sudo ufw allow OpenSSH
  sudo ufw allow 80/tcp
  sudo ufw allow 443/tcp
  sudo ufw allow 443/udp
else
  echo "    ufw is inactive - leaving it off so other services on this server keep their ports."
  echo "    The cloud security group still controls inbound traffic."
fi

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
