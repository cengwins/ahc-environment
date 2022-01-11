FROM python:3-alpine

WORKDIR /app

ENV LIBRARY_PATH="/lib:/usr/lib" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

RUN apk add --no-cache --update \
    build-base \
    curl \
    bash \
    git \
    yq

COPY . .

ENTRYPOINT ["entrypoint.sh"]
