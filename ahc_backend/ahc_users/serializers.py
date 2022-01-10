from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import User


class AuthTokenSerializer(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()

    def get_token(self, obj: Token) -> str:
        return obj.key

    class Meta:
        model = Token
        fields = ("token",)


class RegisterRequestSerializer(serializers.ModelSerializer):
    def validate_password(self, password):
        if len(password) < 6:
            raise serializers.ValidationError("length should be at lest 6")

        return password

    def create(self, validated_data):
        user = User.objects.create(**validated_data)
        user.set_password(validated_data["password"])

        user.save()

        return user

    def to_representation(self, instance):
        return UserSerializer(instance).data

    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "email", "password")
        extra_kwargs = {
            "username": {"required": True, "allow_blank": False},
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": True, "allow_blank": False},
            "email": {"required": True, "allow_blank": False},
            "password": {"required": True, "allow_blank": False},
        }


class LoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=True, allow_blank=False)
    password = serializers.CharField(max_length=150, required=True, allow_blank=False)

    def validate_password(self, password):
        if len(password) < 6:
            raise serializers.ValidationError(
                "password field should has length at least 6"
            )

        return password

    class Meta:
        fields = ("username", "password")


class UserSerializer(serializers.ModelSerializer):
    profile_image = serializers.SerializerMethodField()

    def get_profile_image(self, obj: User):
        if obj.profile.profile_image:
            return obj.profile.profile_image

        return None

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "profile_image")
