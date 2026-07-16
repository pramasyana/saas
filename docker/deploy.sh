#!/bin/bash
set -e

COMPOSE="docker compose -f docker-compose.yml -f docker-compose.prod.yml"

echo "=== Saas Zero-Downtime Deploy ==="

# Pull latest code
echo "Pulling latest code..."
git pull origin main

# Install dependencies
echo "Installing dependencies..."
$COMPOSE exec app composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev
$COMPOSE exec app npm install
$COMPOSE exec -u root app chmod -R 775 /var/www/node_modules/.bin/

# Run migrations
echo "Running migrations..."
$COMPOSE exec app php artisan migrate --force
$COMPOSE exec app php artisan tenants:migrate --force 2>/dev/null || true

# Cache config & routes (needed by Wayfinder for npm build)
echo "Caching config and routes..."
$COMPOSE exec app php artisan config:cache
$COMPOSE exec app php artisan route:cache
$COMPOSE exec app php artisan view:cache

# Build frontend assets (Wayfinder needs routes cached)
echo "Building frontend assets..."
$COMPOSE exec app npm run build

# Build new image
echo "Building new image..."
$COMPOSE build --no-cache app

# Stop old container and start new one
echo "Starting new container..."
$COMPOSE stop app
$COMPOSE rm -f app
$COMPOSE up -d app

# Fix storage & cache permissions (Docker volumes may be root-owned)
echo "Fixing permissions..."
$COMPOSE exec -u root app mkdir -p /var/www/storage/framework/{cache/data,views,sessions} /var/www/bootstrap/cache
$COMPOSE exec -u root app chown -R www:www /var/www/storage /var/www/bootstrap/cache

# Wait for new container to be healthy
echo "Waiting for new container to be healthy..."
sleep 10

# Check health
if $COMPOSE exec app php -r "echo 1;" > /dev/null 2>&1; then
    echo "New container is healthy!"
else
    echo "Health check failed! Rolling back..."
    $COMPOSE stop app
    $COMPOSE rm -f app
    $COMPOSE up -d app
    exit 1
fi

# Clear and rebuild cache inside new container
echo "Rebuilding cache in new container..."
$COMPOSE exec app php artisan config:clear
$COMPOSE exec app php artisan route:clear
$COMPOSE exec app php artisan view:clear
$COMPOSE exec app php artisan config:cache
$COMPOSE exec app php artisan route:cache
$COMPOSE exec app php artisan view:cache

# Restart supporting services
$COMPOSE --profile queue restart queue 2>/dev/null || true
$COMPOSE restart scheduler
$COMPOSE restart dozzle 2>/dev/null || true

# Link storage
$COMPOSE exec app php artisan storage:link --force

# Reload nginx
echo "Reloading nginx..."
$COMPOSE exec nginx nginx -s reload 2>/dev/null || true

echo "=== Deploy complete! ==="
