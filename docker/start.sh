#!/bin/bash
set -e

echo "Starting Saas..."

# Wait for MariaDB
echo "Waiting for MariaDB..."
until php -r "new PDO('mysql:host=${DB_HOST:-mariadb};port=${DB_PORT:-3306}', '${DB_USERNAME:-saas}', '${DB_PASSWORD:-secret}');" 2>/dev/null; do
    sleep 2
done
echo "MariaDB is ready."

# Install PHP dependencies (vendor/ is gitignored, not in image)
echo "Installing dependencies..."
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Install & build frontend assets if public/build doesn't exist
if [ ! -d "public/build" ]; then
    echo "Building frontend assets..."
    npm ci --prefer-offline && npm run build
fi

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Run tenant migrations
echo "Running tenant migrations..."
php artisan tenants:migrate --force 2>/dev/null || echo "No tenant to migrate, skipping."

# Link storage
php artisan storage:link --force

# Clear and cache config
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "Application ready."

# Start PHP-FPM
exec php-fpm
