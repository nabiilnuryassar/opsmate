# OpsMate AI backend — development image
# PHP-FPM with PostgreSQL driver. nginx proxies to this on port 9000.
FROM php:8.4-fpm-alpine

# System libs required to build the PHP extensions we need.
RUN apk add --no-cache \
        postgresql-dev \
        oniguruma-dev \
        libzip-dev \
        icu-dev \
    && docker-php-ext-install -j"$(nproc)" \
        pdo_pgsql \
        pgsql \
        mbstring \
        bcmath \
        pcntl \
        zip \
        intl

# Composer (from the official composer image).
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

EXPOSE 9000

CMD ["php-fpm", "-F"]
