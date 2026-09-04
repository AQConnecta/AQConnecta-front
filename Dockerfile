# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM node:22.12.0-alpine AS build
WORKDIR /app
ENV HUSKY=0

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
ARG VITE_BASE_URL=""
ARG VITE_ENV=production
ENV VITE_BASE_URL=$VITE_BASE_URL \
    VITE_ENV=$VITE_ENV \
    NODE_ENV=production
RUN yarn build

# ---- Runtime stage ----
FROM nginx:1.27.3-alpine

RUN apk -U upgrade --no-cache && \
    apk add --no-cache curl tini gettext

# Substitui os arquivos base do nginx
RUN rm -f /etc/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.main.conf /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Permissões para o user nginx em paths que AINDA usamos em read-only
RUN chown -R nginx:nginx /var/log/nginx /etc/nginx/templates

COPY --from=build --chown=nginx:nginx /app/dist /usr/share/nginx/html

USER nginx

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost:8080/healthz || exit 1

ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
