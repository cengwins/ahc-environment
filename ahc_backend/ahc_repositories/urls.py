from django.urls import path

from .views import *

urlpatterns = [
    path("", ListCreateRepositoriesAPIView.as_view()),
    path(
        "<int:repository_id>/",
        RetrieveUpdateDestroyRepositoriesAPIView.as_view(),
    ),
    path(
        "<int:repository_id>/members/",
        ListCreateRepositoryUsersAPIView.as_view(),
    ),
    path(
        "<int:repository_id>/members/<int:member_id>/",
        RetrieveDestroyRepositoryUsersAPIView.as_view(),
    ),
]
