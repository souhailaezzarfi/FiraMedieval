FROM php:8.3-cli

# Instal·lar dependències del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# Instal·lar extensions de PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath zip

# Obtenir Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establir el directori de treball
WORKDIR /var/www

# Exposar el port 8000
EXPOSE 8000

# Executar el servidor
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]