from .base import *

ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://localhost/0",
    },
    "celery-cache": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://localhost/1",
    },
}

CELERY_CACHE_BACKEND = "celery-cache"
CELERY_BROKER_URL = "redis://localhost/2"
CELERY_RESULT_BACKEND = "redis://localhost/3"
