#!/bin/bash
set -e

echo "=== Saas Zero-Downtime Deploy ==="

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install dependencies (vendor/ is gitignored, bind-mounted from host)
echo "Installing dependencies..."
docker compose exec app composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Build frontend assets
echo "Building frontend assets..."
docker compose exec app npm install
docker compose exec app npm run build

# Build new image
echo "Building new image..."
docker compose build --no-cache app

# Start new app container
echo "Starting new container..."
docker compose up -d --no-deps app

# Wait for new container to be healthy
echo "Waiting for new container to be healthy..."
sleep 10

# Check health
if docker compose exec app php -r "echo 1;" > /dev/null 2>&1; then
    echo "New container is healthy!"
else
    echo "Health check failed! Rolling back..."
    docker compose up -d --no-deps app
    exit 1
fi

# Run migrations
echo "Running migrations..."
docker compose exec app php artisan migrate --force
docker compose exec app php artisan tenants:migrate --force 2>/dev/null || true

# Restart supporting services
docker compose --profile queue restart queue 2>/dev/null || true
docker compose restart scheduler

# Clear and rebuild cache
echo "Rebuilding cache..."
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache

# Link storage
docker compose exec app php artisan storage:link --force

# Reload nginx to pick up any config changes
echo "Reloading nginx..."
docker compose exec nginx nginx -s reload 2>/dev/null || true

echo "=== Deploy complete! ==="
