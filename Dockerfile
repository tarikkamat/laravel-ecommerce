FROM php:8.2-fpm-alpine AS base

WORKDIR /var/www

RUN apk add --no-cache \
    bash \
    git \
    icu-dev \
    libzip-dev \
    oniguruma-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        bcmath \
        exif \
        intl \
        pdo_mysql \
        zip \
        gd

FROM composer:2 AS composer_deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --ignore-platform-reqs --no-scripts

FROM node:22-alpine AS node_build
WORKDIR /app
RUN apk add --no-cache php-cli php-phar php-mbstring php-json
COPY package.json package-lock.json ./
RUN npm ci
COPY resources resources
COPY public public
COPY vite.config.ts tsconfig.json ./
COPY composer.json composer.lock ./
COPY artisan artisan
COPY routes routes
COPY app app
COPY config config
COPY bootstrap bootstrap
COPY database database
COPY --from=composer_deps /app/vendor /app/vendor
RUN mkdir -p storage/framework/cache storage/framework/views storage/framework/sessions bootstrap/cache
RUN APP_ENV=production APP_KEY=base64:AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA= php artisan wayfinder:generate --with-form
RUN npm run build

FROM base AS app
WORKDIR /var/www

COPY --from=composer_deps /app/vendor ./vendor
COPY --from=node_build /app/public/build ./public/build

COPY . .

RUN addgroup -g 1000 -S www && adduser -u 1000 -S www -G www \
    && chown -R www:www /var/www \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

USER www

EXPOSE 9000

CMD ["php-fpm"]
