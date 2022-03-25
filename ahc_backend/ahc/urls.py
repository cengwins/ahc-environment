from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.views.static import serve as static_serve

urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        f"{settings.MEDIA_URL[1:]}<path:path>",
        static_serve,
        {"document_root": settings.MEDIA_ROOT},
    ),
    path(
        f"{settings.STATIC_URL[1:]}<path:path>",
        static_serve,
        {"document_root": settings.STATIC_ROOT},
    ),
    # Login, register, user profile etc.
    path("api/auth/", include("ahc_users.urls")),
    # GitHub integration, tokens.
    path("api/github/", include("ahc_github.urls")),
    # The user's available repositories.
    path("api/repositories/", include("ahc_repositories.urls")),
    # A repository's experiments.
    path("api/repositories/<int:repository_id>", include("ahc_experiments.urls")),
]
