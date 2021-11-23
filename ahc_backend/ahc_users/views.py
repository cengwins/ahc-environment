from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Q
from django.utils import timezone

from rest_framework.views import APIView, Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token

from ahc_utils.helpers import check_fields, bad_request, unauthorized

from .models import User, UserProfile
from .serializers import UserProfileSerializer

REGISTER_API_REQ_FIELDS = [
    'username',
    'email',
    'first_name',
    'last_name',
    'password',
]

class RegisterAPIView(APIView):
    def post(self, request):
        check_fields(request.data, REGISTER_API_REQ_FIELDS)

        if User.objects.filter(username=request.data['username']).first() is not None:
            return bad_request('username_exists')

        if User.objects.filter(email=request.data['email']).first() is not None:
            return bad_request('email_exists')

        user = User.objects.create(
            username=request.data['username'],
            email=request.data['email'],
            first_name=request.data['first_name'],
            last_name=request.data['last_name'],
            password=request.data['password'],
        )

        auth_token = Token.objects.create(user=user)

        # TODO: user confirmation

        return Response({
            'token': auth_token.key,
        })


LOGIN_API_REQ_FIELDS = [
    'username',
    'password',
]

class LoginAPIView(APIView):
    def post(self, request):
        check_fields(request.data, LOGIN_API_REQ_FIELDS)

        profile = UserProfile.objects.filter(user__is_active=True, is_mail_confirmed=True).filter(
            Q(user__username__iexact=request.data['username']) | Q(user__email__iexact=request.data['username'])
        ).first()

        if profile is None or not profile.user.check_password(request.data['password']):
            return unauthorized('wrong_passwd')

        # profile.user.last_login = timezone.now()
        # profile.user.save(update_fields=['last_login'])

        auth_token = Token.objects.create(user=profile.user,)

        return Response({
            'token': auth_token.key,
        })


class GetUserProfileAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(UserProfileSerializer(request.user.profile).data)
