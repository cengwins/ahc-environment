from django.urls import path
from .views import *

urlpatterns = [
    path("login/", LoginAPIView.as_view()),
    path("register/", RegisterAPIView.as_view()),
    path("profile/", GetUserProfileAPIView.as_view()),
    path("password_reset/", PasswordResetAPIView.as_view()),
    path("activate/<str:code>", ActivateUserAPIView.as_view()),
]
