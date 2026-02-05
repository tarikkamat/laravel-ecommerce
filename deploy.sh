#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

if ! command -v git >/dev/null 2>&1; then
  echo "git bulunamadı."
  exit 1
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "docker bulunamadı."
  exit 1
fi

if ! command -v docker compose >/dev/null 2>&1; then
  echo "docker compose bulunamadı."
  exit 1
fi

OLD_REV="$(git rev-parse HEAD)"
git pull --ff-only
NEW_REV="$(git rev-parse HEAD)"

if [[ "$OLD_REV" == "$NEW_REV" ]]; then
  echo "Yeni değişiklik yok."
  exit 0
fi

CHANGED_FILES="$(git diff --name-only "$OLD_REV" "$NEW_REV")"

rebuild_images=false
composer_changed=false
npm_changed=false
nginx_changed=false
env_changed=false
migrations_changed=false
wayfinder_changed=false

if echo "$CHANGED_FILES" | grep -Eq '(^Dockerfile$|^docker-compose\.ya?ml$|^docker/)' ; then
  rebuild_images=true
fi

if echo "$CHANGED_FILES" | grep -Eq '(^composer\.json$|^composer\.lock$)' ; then
  composer_changed=true
fi

if echo "$CHANGED_FILES" | grep -Eq '(^package\.json$|^package-lock\.json$|^vite\.config\.ts$|^tsconfig\.json$|^resources/)' ; then
  npm_changed=true
fi

if echo "$CHANGED_FILES" | grep -Eq '(^routes/|^resources/js/|^app/Http/)' ; then
  wayfinder_changed=true
fi

if echo "$CHANGED_FILES" | grep -Eq '(^docker/nginx/)' ; then
  nginx_changed=true
fi

if echo "$CHANGED_FILES" | grep -Eq '(^\.env$)' ; then
  env_changed=true
fi

if echo "$CHANGED_FILES" | grep -Eq '(^database/migrations/)' ; then
  migrations_changed=true
fi

if [[ "$rebuild_images" == true ]]; then
  docker compose build
fi

docker compose up -d --remove-orphans

if [[ "$composer_changed" == true ]]; then
  docker compose exec -T app composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader
fi

if [[ "$npm_changed" == true ]]; then
  docker run --rm -v "$ROOT_DIR":/app -w /app node:22-alpine sh -c "npm ci && npm run build"
fi

if [[ "$wayfinder_changed" == true ]]; then
  docker compose --profile tools run --rm wayfinder
fi

if [[ "$migrations_changed" == true ]]; then
  docker compose exec -T app php artisan migrate --force
fi

if [[ "$env_changed" == true ]]; then
  docker compose exec -T app php artisan config:clear
fi

if [[ "$nginx_changed" == true ]]; then
  docker compose exec -T web nginx -s reload
fi

echo "Deploy tamamlandı."
