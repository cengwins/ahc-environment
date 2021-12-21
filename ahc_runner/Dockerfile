FROM python:3-alpine

WORKDIR /usr/local/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apk add --no-update --update \
    build-base \
    libffi-dev \
    postgresql-dev \
    libmemcached-dev \
    jpeg-dev \
    zlib-dev \
    bash \
    zip \
    unzip \
    git \
    nano \
    vim

RUN cd /usr/local/bin && \
    git clone https://github.com/oznakn/docker-scripts && \
    mv docker-scripts/*.sh . && \
    rm -rf docker-scripts && \
    chmod a+x backup-data.sh restore-data.sh docker-wait-for-it.sh
