from django.urls import path

from .views import *

urlpatterns = [
    path(
        "",
        ListCreateExperimentsAPIView.as_view(),
    ),
    path(
        "<int:experiment_id>/",
        RetrieveExperimentAPIView.as_view(),
    ),
    path(
        "<int:experiment_id>/runs/",
        ListExperimentRunsAPIView.as_view(),
    ),
    path(
        "<int:experiment_id>/runs/<int:experiment_run_id>/",
        RetrieveExperimentRunsAPIView.as_view(),
    ),
]
