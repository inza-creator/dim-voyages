#!/usr/bin/env bash
#
# Déploiement de DIM VOYAGES sur le serveur partagé (Caddy ORIA, port 443).
#
#   bash deploiement/deployer.sh
#
# Première fois : crée la base, charge le contenu initial, démarre.
# Ensuite : reconstruit, migre, redémarre. Ne touche pas aux données.
#
set -euo pipefail

export BUILDKIT_PROGRESS=plain
export COMPOSE_PROGRESS=plain

RACINE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$RACINE"
COMPOSE=(docker compose -f deploiement/docker-compose.prod.yml --env-file deploiement/.env)

if [ ! -f deploiement/.env ]; then
  echo "▸ Première installation : tirage des secrets"
  umask 077
  PG_PASS="$(openssl rand -hex 16)"
  AUTH="$(openssl rand -hex 32)"
  ADMIN_PASS="$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-16)Aa1"
  ADMIN_EMAIL="admin@dimvoyages.ci"
  cat > deploiement/.env <<EOF
POSTGRES_USER=dim
POSTGRES_PASSWORD=${PG_PASS}
POSTGRES_DB=dim_voyages
AUTH_SECRET=${AUTH}
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASS}
NEXT_PUBLIC_SITE_URL=https://dimvoyages.astratechnologie.com
RESEND_API_KEY=
NEWSLETTER_FROM="DIM VOYAGES <info@dimvoyages.com>"
EOF
  cat > deploiement/.credentials <<EOF
URL=https://dimvoyages.astratechnologie.com/admin/login
ADMIN_EMAIL=${ADMIN_EMAIL}
ADMIN_PASSWORD=${ADMIN_PASS}
EOF
  chmod 600 deploiement/.env deploiement/.credentials
  echo "  admin : ${ADMIN_EMAIL} / ${ADMIN_PASS}"
  echo "  (conservé dans deploiement/.credentials)"
fi

docker network inspect oria_publique >/dev/null 2>&1 || docker network create oria_publique

echo "▸ Site Caddy"
mkdir -p /opt/caddy/sites.d
cp deploiement/Caddyfile.dimvoyages /opt/caddy/sites.d/dimvoyages.caddy

echo "▸ Construction des images"
"${COMPOSE[@]}" --profile outils build

echo "▸ Démarrage de la base"
"${COMPOSE[@]}" up -d db
until "${COMPOSE[@]}" exec -T db pg_isready -U dim -d dim_voyages >/dev/null 2>&1; do
  sleep 1
done

echo "▸ Migrations"
"${COMPOSE[@]}" --profile outils run --rm migrate

TABLES="$("${COMPOSE[@]}" exec -T db psql -U dim -d dim_voyages -tAc \
  "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User'" | tr -d '[:space:]')"
USERS=0
if [ "${TABLES:-0}" != "0" ]; then
  USERS="$("${COMPOSE[@]}" exec -T db psql -U dim -d dim_voyages -tAc \
    'SELECT count(*) FROM "User"' | tr -d '[:space:]')"
fi

if [ "${USERS:-0}" = "0" ]; then
  echo "▸ Contenu initial"
  "${COMPOSE[@]}" --profile outils run --rm seed
else
  echo "▸ Base déjà peuplée, seed ignoré"
fi

echo "▸ Démarrage du site"
"${COMPOSE[@]}" up -d web

echo "▸ Rechargement de Caddy"
if docker ps --format '{{.Names}}' | grep -qx oria-caddy-1; then
  docker exec oria-caddy-1 caddy reload --config /etc/caddy/Caddyfile
else
  echo "  (oria-caddy-1 introuvable — le certificat ne sera pas servi)"
fi

echo "▸ Vérification interne"
ok=0
for i in $(seq 1 30); do
  if "${COMPOSE[@]}" exec -T web node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"; then
    ok=1
    break
  fi
  sleep 2
done

if [ "$ok" = "1" ]; then
  echo "Déploiement terminé — https://dimvoyages.astratechnologie.com"
else
  echo "Le site ne répond pas. Journaux :"
  "${COMPOSE[@]}" logs --tail=80 web
  exit 1
fi
