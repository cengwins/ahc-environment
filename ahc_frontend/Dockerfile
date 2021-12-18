FROM node:14-alpine as builder

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

RUN apk add --update --no-cache build-base python3

COPY package.json yarn.lock ./

RUN yarn install --silent --production=false --check-files --non-interactive --no-cache

COPY . .

RUN yarn run build


FROM nginx:1.19-alpine

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

