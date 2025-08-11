FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_BASE_URL
ARG VITE_ENV=production
ENV VITE_BASE_URL=$VITE_BASE_URL VITE_ENV=$VITE_ENV NODE_ENV=production
RUN npx vite build  # usa só o Vite

FROM nginx:alpine
# opcional: remover o default.conf pra evitar scripts do entrypoint mexendo nele
# RUN rm -f /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
