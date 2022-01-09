"""ahc URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.views.static import serve as static_serve
from django.urls import path
from django.conf import settings

from ahc_users.views import *
from ahc_repositories.views import *

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
    path("api/auth/login/", LoginAPIView.as_view()),
    path("api/auth/register/", RegisterAPIView.as_view()),
    path("api/auth/profile/", GetUserProfileAPIView.as_view()),
    path("api/user/password_reset/", PasswordResetAPIView.as_view()),
    path("api/user/activate/", ActivateUserAPIView.as_view()),
    path("api/repositories", GetRepositoriesAPIView.as_view()),
    path("api/repositories/<int:id>", GetOrDeleteRepositoryAPIView.as_view()),
    path("api/repositories/<int:id>/members", AuthMembersOfRepositoryAPIView.as_view()),
    path("api/repositories/<int:id>/members/<int:memberID>", AuthMemberOfRepositoryAPIView.as_view()),
]
