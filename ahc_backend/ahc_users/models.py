import uuid
import datetime

from functools import cached_property

from django.contrib.auth.models import User
from django.db import models


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
    profile_image = models.ImageField(blank=True, null=True)

    is_email_confirmed = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.get_full_name()


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
