import os

from .base import *


ALLOWED_HOSTS = ["*"] + list(
    map(lambda s: s.strip(), os.environ.get("ALLOWED_HOSTS", "").split(","))
)

CORS_ALLOWED_ORIGINS = [
    "https://localhost:8000",
    "http://localhost:8000",
    "https://127.0.0.1:8000",
    "http://127.0.0.1:8000",
] + list(
    map(lambda s: s.strip(), os.environ.get("CORS_ALLOWED_ORIGINS", "").split(","))
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
        "LOCATION": os.environ.get("CELERY_CACHE_URL", "redis://localhost/1"),
    },
}

CELERY_CACHE_BACKEND = "celery-cache"
CELERY_BROKER_URL = os.environ.get("CELERY_BROKER_URL", "redis://localhost/2")
CELERY_RESULT_BACKEND = os.environ.get("CELERY_REDIS_URL", "redis://localhost/3")
