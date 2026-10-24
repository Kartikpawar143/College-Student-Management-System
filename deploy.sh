
#!/usr/bin/env bash
set -Eeuo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

# ----------------------------------------
# 1. Check environment configuration
# ----------------------------------------
if [[ ! -f .env ]]; then
  echo "Missing .env. Create it with PUBLIC_IP, ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET first." >&2
  exit 1
fi

PUBLIC_IP="$(awk -F= '$1 == "PUBLIC_IP" { print $2; exit }' .env)"

if [[ -z "$PUBLIC_IP" ]]; then
  echo "Missing PUBLIC_IP in .env." >&2
  exit 1
fi

# ----------------------------------------
# 2. Ensure root or sudo privileges
# ----------------------------------------
if [[ "$EUID" -ne 0 ]]; then
  echo "Please run this script with sudo:"
  echo "sudo bash deploy.sh"
  exit 1
fi

# ----------------------------------------
# 3. Check operating system
# ----------------------------------------
if [[ ! -f /etc/os-release ]]; then
  echo "Cannot identify operating system." >&2
  exit 1
fi

source /etc/os-release

if [[ "${ID:-}" != "ubuntu" ]]; then
  echo "This automatic installer currently supports Ubuntu only." >&2
  exit 1
fi

# ----------------------------------------
# 4. Install Docker if missing
# ----------------------------------------
if ! command -v docker >/dev/null 2>&1 ||
   ! docker compose version >/dev/null 2>&1; then

  echo "Installing Docker Engine and Docker Compose..."

  apt-get update
  apt-get install -y ca-certificates curl

  install -m 0755 -d /etc/apt/keyrings

  curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
    -o /etc/apt/keyrings/docker.asc

  chmod a+r /etc/apt/keyrings/docker.asc

  CODENAME="${UBUNTU_CODENAME:-${VERSION_CODENAME:-}}"
  ARCH="$(dpkg --print-architecture)"

  if [[ -z "$CODENAME" ]]; then
    echo "Could not determine Ubuntu release codename." >&2
    exit 1
  fi

  cat > /etc/apt/sources.list.d/docker.sources <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: ${CODENAME}
Components: stable
Architectures: ${ARCH}
Signed-By: /etc/apt/keyrings/docker.asc
EOF

  apt-get update

  apt-get install -y \
    docker-ce \
    docker-ce-cli \
    containerd.io \
    docker-buildx-plugin \
    docker-compose-plugin

  echo "Docker Engine and Compose installed successfully."
else
  echo "Docker Engine and Compose are already installed."
fi

# ----------------------------------------
# 5. Start Docker daemon
# ----------------------------------------
echo "Starting Docker service..."

systemctl enable --now docker

# ----------------------------------------
# 6. Verify Docker is ready
# ----------------------------------------
if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not responding. Check: systemctl status docker" >&2
  exit 1
fi

docker --version
docker compose version

# ----------------------------------------
# 7. Build and deploy application
# ----------------------------------------
echo "Building and starting application..."

docker compose up -d --build

# ----------------------------------------
# 8. Show deployment status
# ----------------------------------------
echo
echo "Deployment command completed."
echo "Frontend: http://${PUBLIC_IP}"
echo "Backend:  http://${PUBLIC_IP}:8001"
echo
docker compose ps

