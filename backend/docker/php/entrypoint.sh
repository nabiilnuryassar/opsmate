#!/bin/sh
# OpsMate AI backend — production container entrypoint.
# Warms Laravel caches and runs migrations before starting the process.
set -e

cd /var/www

# Ensure writable runtime dirs (volumes may override ownership).
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true

# Generate an APP_KEY only if one was not provided via the environment.
if [ -z "${APP_KEY}" ] && ! grep -q "^APP_KEY=base64" .env 2>/dev/null; then
    php artisan key:generate --force || true
fi

# Run migrations (idempotent). Set RUN_MIGRATIONS=0 to skip on worker replicas.
if [ "${RUN_MIGRATIONS:-1}" = "1" ]; then
    php artisan migrate --force || true
fi

# Cache config, routes, views, and events for production performance.
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

exec "$@"
