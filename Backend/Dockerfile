FROM php:8.2.4

# Update package lists and install required dependencies
RUN apt-get update && \
    apt-get install -y openssl zip unzip git libpng-dev zlib1g-dev libjpeg-dev && \
    docker-php-ext-configure gd --with-jpeg && \
    docker-php-ext-install pdo_mysql gd && \
    docker-php-ext-install zip && \
    docker-php-ext-enable zip

# Install Xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory and copy Laravel application files
WORKDIR /app
COPY . /app

# Install application dependencies
RUN composer update
RUN composer install --optimize-autoloader --no-dev

# Xdebug configuration
RUN echo "zend_extension=$(find /usr/local/lib/php/extensions/ -name xdebug.so)" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.mode=coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Expose the port and start the PHP server
CMD php artisan serve --host=0.0.0.0 --port=$PORT
EXPOSE $PORT