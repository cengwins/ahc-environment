FROM node:14-alpine as builder

ARG SERVER_URL=""

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN apk add --update --no-cache build-base python3

COPY package.json yarn.lock ./

RUN yarn install --silent --production=false --check-files --non-interactive --no-cache

COPY . .

ENV REACT_APP_SERVER_URL=${SERVER_URL}

RUN yarn run build


FROM nginx:1.19-alpine

COPY --from=builder /app/build /var/www/html

RUN echo 'server { \
    listen 80; \
    listen [::]:80; \
    root /var/www/html; \
    index index.html; \
    server_name _; \
    location / { try_files $uri /index.html; } \
    }' > /etc/nginx/conf.d/default.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
