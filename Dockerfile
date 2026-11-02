FROM php:8.3-fpm-alpine

# Install system dependencies & extensions needed by Laravel & SQLite
RUN apk add --no-cache \
    bash \
    curl \
    git \
    nginx \
    sqlite \
    sqlite-dev \
    libzip-dev \
    libpng-dev \
    oniguruma-dev \
    && docker-php-ext-install pdo pdo_sqlite mbstring zip bcmath

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy backend project files
COPY SOT-Hambatan-Belajar-SDIT-Ummul-Quro-Bogor/backend .

# Install PHP dependencies without dev
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set permissions
RUN chmod -R 775 storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Expose port (Render sets $PORT dynamically, default 8000)
ENV PORT=8000
EXPOSE 8000

# Start script
RUN chmod +x run.sh
CMD ["bash", "run.sh"]
