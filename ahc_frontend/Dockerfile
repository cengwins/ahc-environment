FROM node:14-alpine as builder

WORKDIR /usr/local/src/app

ENV PATH /app/node_modules/.bin:$PATH

RUN apk add --update --no-cache build-base python bash

COPY package.json yarn.lock .
COPY yarn.lock ./

RUN yarn install --silent --production=false --check-files --non-interactive --no-cache

COPY . .

RUN yarn run build


FROM nginx:1.19-alpine

COPY --from=builder /usr/local/src/app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

