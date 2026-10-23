#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

if [[ ! -f .env ]]; then
  echo "Missing .env. Create it with PUBLIC_IP, ADMIN_EMAIL, ADMIN_PASSWORD, and JWT_SECRET first." >&2
  exit 1
fi

PUBLIC_IP="$(awk -F= '$1 == "PUBLIC_IP" { print $2; exit }' .env)"
if [[ -z "$PUBLIC_IP" ]]; then
  echo "Missing PUBLIC_IP in .env." >&2
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required. Install Docker Engine and Compose first." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "Docker is installed, but its daemon is not running or is inaccessible." >&2
  exit 1
fi

docker compose up -d --build

echo "Frontend: http://${PUBLIC_IP}"
echo "Backend:  http://${PUBLIC_IP}:8001"
