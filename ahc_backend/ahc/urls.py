from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from django.conf import settings

from ahc_users.views import *
from ahc_github.views import *
from ahc_repositories.views import *
from ahc_experiments.views import *

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/login/", LoginAPIView.as_view()),
    path("api/auth/register/", RegisterAPIView.as_view()),
    path("api/auth/profile/", GetUserProfileAPIView.as_view()),
    path("api/user/password_reset/", PasswordResetAPIView.as_view()),
    path("api/user/activate/", ActivateUserAPIView.as_view()),
    path("api/github/repositories/", ListGithubRepositoriesAPIView.as_view()),
    path(
        "api/github/repositories/<str:owner>/<str:repo>/branches/",
        GetBranchesOfTheRepositoryAPIView.as_view(),
    ),
    path("api/github/profile/", GithubProfileAPIView.as_view()),
    path("api/repositories/", ListCreateRepositoriesAPIView.as_view()),
    path(
        "api/repositories/<int:repository_id>/",
        RetrieveUpdateDestroyRepositoriesAPIView.as_view(),
    ),
    path(
        "api/repositories/<int:repository_id>/members/",
        ListCreateRepositoryUsersAPIView.as_view(),
    ),
    path(
        "api/repositories/<int:repository_id>/members/<int:member_id>/",
        RetrieveDestroyRepositoryUsersAPIView.as_view(),
    ),
    path(
        "api/repositories/<int:repository_id>/experiments/",
        ListCreateExperimentsAPIView.as_view(),
    ),
    path(
        "api/repositories/<int:repository_id>/experiments/<int:experiment_id>/",
        RetrieveExperimentAPIView.as_view(),
    ),
    path(
        "api/repositories/<int:repository_id>/experiments/<int:experiment_id>/runs/",
        ListExperimentRunsAPIView.as_view(),
    ),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
