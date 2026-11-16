#!/usr/bin/env bash
# Depuis le Mac : copie vers WSL du serveur 4, puis déploiement.
#   bash deploiement/pousser.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
SSH_HOST="${SSH_HOST:-serveur-4}"
WSL='C:\Windows\System32\wsl.exe -d Ubuntu-24.04 -u root --'
DEST=/opt/dimvoyages

if command -v vercel >/dev/null 2>&1; then
  if ! vercel dns ls astratechnologie.com 2>/dev/null | grep -qE '[[:space:]]dimvoyages[[:space:]]+A[[:space:]]+4\.253\.72\.59'; then
    echo "▸ DNS dimvoyages.astratechnologie.com → 4.253.72.59"
    vercel dns add astratechnologie.com dimvoyages A 4.253.72.59 --non-interactive
  else
    echo "▸ DNS dimvoyages.astratechnologie.com déjà en place"
  fi
else
  echo "▸ vercel CLI absent : créer un A dimvoyages → 4.253.72.59 dans le DNS astratechnologie.com"
fi

echo "▸ Attente DNS"
for i in $(seq 1 30); do
  if dig +short dimvoyages.astratechnologie.com A | grep -qx '4.253.72.59'; then
    echo "  4.253.72.59"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "  pas encore visible ici — Let's Encrypt pourra réessayer"
  fi
  sleep 2
done

echo "▸ Copie vers ${SSH_HOST}:${DEST}"
SSH=(ssh -o BatchMode=yes -o ServerAliveInterval=15 -o ServerAliveCountMax=120 "$SSH_HOST")
"${SSH[@]}" "$WSL mkdir -p $DEST"
COPYFILE_DISABLE=1 tar -czf - \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  --exclude=coverage \
  --exclude=.DS_Store \
  --exclude='._*' \
  --exclude=.env \
  --exclude=.env.local \
  --exclude=deploiement/.env \
  --exclude=deploiement/.credentials \
  --exclude=public/uploads \
  . \
| "${SSH[@]}" "$WSL tar -xzf - -C $DEST"

echo "▸ Déploiement"
"${SSH[@]}" "$WSL bash $DEST/deploiement/deployer.sh"
