from django.urls import path
from .views import *

urlpatterns = [
    path("jobs/", FetchRunnerJobAPIView.as_view()),
    path("", RetrieveRunnerAPIView.as_view()),
]
