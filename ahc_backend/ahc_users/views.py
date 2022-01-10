from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.generics import CreateAPIView

from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from ahc_utils.helpers import check_fields, unauthorized

from .models import *
from .serializers import (
    AuthTokenSerializer,
    LoginRequestSerializer,
    RegisterRequestSerializer,
    UserSerializer,
)


class RegisterAPIView(CreateAPIView):
    serializer_class = RegisterRequestSerializer
    queryset = User.objects.all()

    def perform_create(self, serializer) -> User:
        user: User = serializer.save()

        user.is_active = True  # TODO: disable later, just for testing purposes
        user.save()

        UserProfile.objects.create(user=user, is_email_confirmed=True)
        UserConfirmationCode.objects.create(user=user)

        return user


class LoginAPIView(APIView):
    """
    Login endpoint for users
    The username field accepts both usernames and emails
    """

    def post(self, request):
        serializer = LoginRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        profile = UserProfile.find_username_or_email(serializer.data["username"])

        if profile is None or not profile.user.check_password(
            serializer.data["password"]
        ):
            raise AuthenticationFailed()

        profile.last_login = timezone.now()
        profile.save()

        try:
            auth_token = Token.objects.get(user=profile.user)
        except:
            auth_token = Token.objects.create(user=profile.user)

        return Response(AuthTokenSerializer(auth_token).data)


class GetUserProfileAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(UserSerializer(request.user).data)


class ActivateUserAPIView(APIView):
    def get(self, request):
        code = request.query_params.get("code")

        if not code:
            return serializers.ValidationError("code should not be empty")

        confirmation_code = UserConfirmationCode.objects.get(code=code)

        user = confirmation_code.user
        user.is_active = True
        user.profile.is_email_confirmed = True
        user.save()

        return Response(
            {
                "success": True,
            }
        )


# TODO: improve these views

PASSWORD_RESET_REQ_FIELDS = [
    "email",
]

PASSWORD_RESET_PATCH_REQ_FIELDS = ["code", "password"]


class PasswordResetAPIView(APIView):
    def post(self, request):
        check_fields(request.data, PASSWORD_RESET_REQ_FIELDS)

        user = User.objects.filter(email=request.data["email"]).first()

        if user is None:
            return unauthorized("user_ne")

        password_reset = UserPasswordReset.objects.create(user=user)

        send_mail(
            "Password Reset Request for AHC!",
            f"Please click here to reset your password. Click here to reset your password {password_reset.code}",
            "noreply@ahc.oznakn.com",
            [user.email],
            fail_silently=False,
        )

        return Response(
            {
                "success": True,
            }
        )

    def patch(self, request):
        check_fields(request.data, PASSWORD_RESET_PATCH_REQ_FIELDS)

        password_reset = UserPasswordReset.objects.filter(
            code=request.data["code"], is_used=False
        ).first()

        if not password_reset:
            return unauthorized("reset_dne")

        password_reset.is_used = True
        password_reset.user.set_password(request.data["password"])
        password_reset.save()

        return Response(
            {
                "success": True,
            }
        )
