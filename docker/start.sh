#!/bin/bash
set -e

echo "Starting Saas..."

# Wait for MariaDB
echo "Waiting for MariaDB..."
until php -r "new PDO('mysql:host=${DB_HOST:-mariadb};port=${DB_PORT:-3306}', '${DB_USERNAME:-saas}', '${DB_PASSWORD:-secret}');" 2>/dev/null; do
    sleep 2
done
echo "MariaDB is ready."

# Create database if not exists
php -r "
\$host = '${DB_HOST:-mariadb}';
\$port = '${DB_PORT:-3306}';
\$user = '${DB_USERNAME:-saas}';
\$pass = '${DB_PASSWORD:-secret}';
\$db   = '${DB_DATABASE:-saas_accounting}';
try {
    \$pdo = new PDO('mysql:host='.\$host.';port='.\$port, \$user, \$pass);
    \$pdo->exec('CREATE DATABASE IF NOT EXISTS ' . \$db . ' CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    echo \"Database \\\"\\\$db\\\" ensured.\n\";
} catch (PDOException \$e) {
    echo 'Database error: ' . \$e->getMessage() . PHP_EOL;
    exit(1);
"

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
