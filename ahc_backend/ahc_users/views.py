from django.db.models import Q
from django.core.mail import send_mail
from django.utils import timezone

from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from ahc_utils.helpers import check_fields, bad_request, unauthorized

from .models import *
from .serializers import UserSerializer

REGISTER_API_REQ_FIELDS = [
    "username",
    "email",
    "first_name",
    "last_name",
    "password",
]


class RegisterAPIView(APIView):
    def post(self, request):
        check_fields(request.data, REGISTER_API_REQ_FIELDS)

        if User.objects.filter(username=request.data["username"]).first() is not None:
            return bad_request("username_exists")

        if User.objects.filter(email=request.data["email"]).first() is not None:
            return bad_request("email_exists")

        user = User.objects.create(
            username=request.data["username"],
            email=request.data["email"],
            first_name=request.data["first_name"],
            last_name=request.data["last_name"],
        )
        user.is_active = True  # TODO: disable later, just for testing purposes
        user.set_password(request.data["password"])
        user.save()

        UserProfile.objects.create(
            user=user,
            is_email_confirmed=True,  # TODO: disable later, just for testing purposes
        )
        user_confirmation_code = UserConfirmationCode.objects.create(user=user)

        send_mail(
            "Welcome to AHC!",
            f"Welcome to AHC! Please visit ahc.ceng.metu.edu.tr for further details. \
                Click here to activate your account http://localhost:8000/api/activate/{user_confirmation_code.code}.",
            "noreply@ahc.oznakn.com",
            [user.email],
            fail_silently=False,
        )

        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        )


class ActivateUserAPIView(APIView):
    def get(self, request):
        code = request.query_params.get("code")

        if not code:
            return bad_request("empty_code")

        confirmation_code = UserConfirmationCode.objects.filter(code=code).first()

        if not confirmation_code:
            return bad_request("code_dne")

        user = confirmation_code.user
        user.is_active = True
        user.profile.is_email_confirmed = True
        user.save()

        return Response(
            {
                "success": True,
            }
        )


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


LOGIN_API_REQ_FIELDS = [
    "username",
    "password",
]


class LoginAPIView(APIView):
    def post(self, request):
        check_fields(request.data, LOGIN_API_REQ_FIELDS)

        profile = (
            UserProfile.objects.filter(user__is_active=True, is_email_confirmed=True)
            .filter(
                Q(user__username__iexact=request.data["username"])
                | Q(user__email__iexact=request.data["username"])
            )
            .first()
        )

        if profile is None or not profile.user.check_password(request.data["password"]):
            return unauthorized("wrong_passwd")

        profile.last_login = timezone.now()
        profile.save()

        # Make sures that old devices logs out
        old_tokens = Token.objects.filter(user=profile.user)
        old_tokens.delete()

        new_token = Token.objects.create(
            user=profile.user,
        )

        return Response(
            {
                "token": new_token.key,
            }
        )


class GetUserProfileAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(UserSerializer(request.user).data)
