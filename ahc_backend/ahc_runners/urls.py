from django.urls import path
from .views import *

urlpatterns = [
    path("jobs/", FetchRunnerJobAPIView.as_view()),
    path("jobs/<int:job_id>/submit/", SubmitRunnerJobResultAPIView.as_view()),
    path("", RetrieveRunnerAPIView.as_view()),
]
