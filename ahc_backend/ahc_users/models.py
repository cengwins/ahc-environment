import uuid
import datetime
from django.contrib import admin

from functools import cached_property

from django.contrib.auth.models import User
from django.db import models
from django.db.models.query_utils import Q
from stdimage import StdImageField

from .custom_storage import ImageStorage


def generate_uuid():
    return uuid.uuid4().hex


class UserConfirmationCode(models.Model):
    user = models.OneToOneField(
        User, unique=True, related_name="confirmation_code", on_delete=models.CASCADE
    )

    code = models.CharField(
        default=generate_uuid, max_length=40, editable=False, unique=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.get_full_name()

class UserProfile(models.Model):
    user = models.OneToOneField(
        User, unique=True, related_name="profile", on_delete=models.CASCADE
    )
    profile_image = StdImageField(
        null=True,
        blank=True,
        variations={
            "thumbnail_40": {"width": 40, "height": 40},
            "thumbnail_32": {"width": 32, "height": 32},
            "large": {"width": 400, "height": 400},
        },
        delete_orphans=True,
        storage=ImageStorage()
    )

    last_login = models.DateTimeField(null=True, blank=True)
    is_email_confirmed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.get_full_name()

    def _username(self):
        return self.user.username

    def _email(self):
        return self.user.email

    def _first_name(self):
        return self.user.first_name

    def _last_name(self):
        return self.user.last_name

    @admin.display(boolean=True)
    def _is_active(self):
        return self.user.is_active

    def _is_superuser(self):
        return self.user.is_superuser


    @staticmethod
    def find_username_or_email(alias: str):
        return (
            UserProfile.objects.filter(is_email_confirmed=True, user__is_active=True)
                .filter(Q(user__username__iexact=alias) | Q(user__email__iexact=alias))
                .first()
        )


class UserPasswordReset(models.Model):
    user = models.ForeignKey(
        User, related_name="password_resets", on_delete=models.CASCADE
    )

    code = models.CharField(
        default=generate_uuid, max_length=40, editable=False, unique=True
    )

    is_used = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @cached_property
    def valid_until(self):
        return self.created_at + datetime.timedelta(days=1)

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.code}"
