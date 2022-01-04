FROM python:3-alpine

WORKDIR /app

ENV LIBRARY_PATH="/lib:/usr/lib" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    POETRY_VIRTUALENVS_CREATE=false \
    POETRY_VIRTUALENVS_IN_PROJECT=false \
    POETRY_HOME="/opt/poetry" \
    PATH="/opt/poetry/bin:$PATH"

RUN apk add --no-cache --update \
    build-base \
    libffi-dev \
    postgresql-dev \
    jpeg-dev \
    zlib-dev \
    curl \
    bash \
    zip \
    unzip \
    git

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python3 -

RUN cd /usr/local/bin && \
    git clone https://github.com/oznakn/docker-scripts && \
    mv docker-scripts/*.sh . && \
    rm -rf docker-scripts && \
    chmod a+x backup-data.sh restore-data.sh docker-wait-for-it.sh

COPY poetry.lock pyproject.toml ./

RUN poetry install --no-interaction --no-ansi --no-dev

COPY . .

ENV DJANGO_SETTINGS_MODULE ahc.settings.docker

CMD /bin/sh -c "gunicorn --bind 0.0.0.0 ahc.wsgi --capture-output --log-level debug"
