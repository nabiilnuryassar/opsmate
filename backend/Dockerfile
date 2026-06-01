# OpsMate AI backend — development image
# Provides PHP 8.4 with the PostgreSQL PDO driver that the host (herd-lite) lacks.
FROM php:8.4-cli-alpine

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

EXPOSE 8000

# Default: run the API dev server. Overridden by compose for the queue worker.
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
