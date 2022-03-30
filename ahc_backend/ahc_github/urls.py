from django.urls import path
from .views import *

urlpatterns = [
    path("repositories/", ListGithubRepositoriesAPIView.as_view()),
    path(
        "repositories/<str:owner>/<str:repo>/branches/",
        GetBranchesOfTheRepositoryAPIView.as_view(),
    ),
    path("profile/", GithubProfileAPIView.as_view()),
]
