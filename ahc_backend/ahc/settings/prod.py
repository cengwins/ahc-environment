import os

from .base import *

DEBUG = False

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "glx_fpdnw5jenca*1-8ygabfpdnw5jenc4k")

ALLOWED_HOSTS = map(lambda s: s.strip(), os.environ.get("ALLOWED_HOSTS").split(","))

CORS_ALLOWED_ORIGINS = map(
    lambda s: s.strip(), os.environ.get("CORS_ALLOWED_ORIGINS").split(",")
)

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("DB_NAME", "ahc"),
        "USER": os.environ.get("DB_USER", "ahc"),
        "PASSWORD": os.environ.get("DB_PASS", "ahc"),
        "HOST": os.environ.get("DB_HOST", "postgres"),
    }
}


CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.environ.get("REDIS_URL", "redis://localhost/0"),
    },
    "celery-cache": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": os.environ.get("REDIS_URL", "redis://localhost/1"),
    },
}


CELERY_CACHE_BACKEND = "celery-cache"
CELERY_RESULT_BACKEND = os.environ.get("REDIS_URL", "redis://localhost/2")
