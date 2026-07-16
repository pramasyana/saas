#!/bin/bash
set -e

echo "=== Saas Zero-Downtime Deploy ==="

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
docker compose exec app composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
docker compose exec app npm install

# Run migrations
echo "Running migrations..."
docker compose exec app php artisan migrate --force
docker compose exec app php artisan tenants:migrate --force 2>/dev/null || true

# Cache config & routes (needed by Wayfinder for npm build)
echo "Caching config and routes..."
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache

# Build frontend assets (Wayfinder needs routes cached)
echo "Building frontend assets..."
docker compose exec app npm run build

# Build new image
echo "Building new image..."
docker compose build --no-cache app

# Start new app container
echo "Starting new container..."
docker compose up -d --no-deps app

# Fix storage & cache permissions (Docker volumes may be root-owned)
echo "Fixing permissions..."
docker compose exec -u root app mkdir -p /var/www/storage/framework/{cache/data,views,sessions} /var/www/bootstrap/cache
docker compose exec -u root app chown -R www:www /var/www/storage /var/www/bootstrap/cache

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

# Clear and rebuild cache inside new container
echo "Rebuilding cache in new container..."
docker compose exec app php artisan config:clear
docker compose exec app php artisan route:clear
docker compose exec app php artisan view:clear
docker compose exec app php artisan config:cache
docker compose exec app php artisan route:cache
docker compose exec app php artisan view:cache

# Restart supporting services
docker compose --profile queue restart queue 2>/dev/null || true
docker compose restart scheduler

# Link storage
docker compose exec app php artisan storage:link --force

# Reload nginx
echo "Reloading nginx..."
docker compose exec nginx nginx -s reload 2>/dev/null || true

echo "=== Deploy complete! ==="
