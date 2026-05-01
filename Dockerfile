FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files
COPY index.html /usr/share/nginx/html/
COPY app.js /usr/share/nginx/html/
COPY style.css /usr/share/nginx/html/
COPY manifest.json /usr/share/nginx/html/
COPY sw.js /usr/share/nginx/html/

# Copy icons
COPY icons/ /usr/share/nginx/html/icons/

# Cloud Run uses PORT env variable
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
