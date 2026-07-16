FROM php:8.4-fpm

# System dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libjpeg-dev libfreetype6-dev \
    libonig-dev libxml2-dev libzip-dev libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl opcache \
    && pecl install redis && docker-php-ext-enable redis \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Node.js 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# PHP config.
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY docker/php/php.ini /usr/local/etc/php/conf.d/custom.ini

# Working directory
WORKDIR /var/www

# Non-root user
RUN groupadd -g 1003 www && useradd -u 1003 -ms /bin/bash -g www www
RUN chown -R 1003:1003 /var/www && mkdir -p /tmp && chmod 1777 /tmp

# Ensure cache & storage directories exist with correct ownership
RUN mkdir -p /var/www/storage/framework/{cache/data,views,sessions} /var/www/bootstrap/cache \
    && chown -R 1003:1003 /var/www/storage /var/www/bootstrap/cache

USER www

EXPOSE 9000
CMD ["php-fpm"]
