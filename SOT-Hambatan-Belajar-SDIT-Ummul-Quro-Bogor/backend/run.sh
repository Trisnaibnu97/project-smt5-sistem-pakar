#!/usr/bin/env bash
set -e

echo "==> Menyiapkan environment Laravel di Render..."

# Buat file database SQLite jika belum ada
mkdir -p database
touch database/database.sqlite

# Clear & cache config
php artisan config:clear
php artisan route:clear

# Jalankan database migration & seeder data demo
echo "==> Menjalankan migrasi dan seeding database..."
php artisan migrate --force
php artisan db:seed --force

# Optimasi konfigurasi untuk production
php artisan config:cache
php artisan route:cache

# Jalankan server HTTP Laravel di port yang disediakan oleh Render
PORT=${PORT:-8000}
echo "==> SiPakar Backend siap melayani request di port $PORT"
exec php artisan serve --host=0.0.0.0 --port=$PORT
