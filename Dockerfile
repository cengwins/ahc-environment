FROM python:3-alpine

WORKDIR /usr/local/src/app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV LIBRARY_PATH=/lib:/usr/lib
ENV PATH="${PATH}:/root/.poetry/bin"

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

RUN curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/install-poetry.py | python3 -

RUN cd /usr/local/bin && \
  git clone https://github.com/oznakn/docker-scripts && \
	mv docker-scripts/*.sh . && \
	rm -rf docker-scripts && \
  chmod a+x backup-data.sh restore-data.sh docker-wait-for-it.sh

RUN pip install gunicorn

COPY poetry.lock pyproject.toml .

RUN poetry config virtualenvs.create false && \
  poetry install --no-interaction --no-ansi

COPY . .

ENV DJANGO_SETTINGS_MODULE ahc.settings.docker

CMD /bin/sh -c "gunicorn --bind 0.0.0.0 ahc.wsgi --capture-output --log-level debug"
