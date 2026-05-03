# ── Stage 1: Build with Vite ──
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production=false
COPY . .
RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Cloud Run uses PORT env variable
EXPOSE 8080

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
