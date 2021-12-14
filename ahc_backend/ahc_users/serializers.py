from rest_framework.serializers import ModelSerializer, SerializerMethodField

from .models import User, UserProfile


class UserSerializer(ModelSerializer):
    profile_image = SerializerMethodField()

    def get_profile_image(self, obj):
        if obj.profile.profile_image:
            return obj.profile.profile_image

        return None

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "email", "profile_image")


class UserProfileSerializer(ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = ("profile_image", "user")
