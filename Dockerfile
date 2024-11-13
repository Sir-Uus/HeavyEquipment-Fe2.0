# Stage: Serve the built application with NGINX
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Salin output build dari local ke NGINX
COPY ./dist .

# Salin konfigurasi NGINX
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port default NGINX
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]