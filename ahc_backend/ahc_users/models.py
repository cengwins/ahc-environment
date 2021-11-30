from django.contrib.auth.models import User
from django.db import models

import uuid

def generate_uuid():
    return uuid.uuid4().hex

class UserConfirmationCode(models.Model):
    user = models.OneToOneField(
        User, unique=True, related_name="confirmation_code", on_delete=models.CASCADE
    )

    code = models.CharField(default=generate_uuid,  max_length=40, editable=False, unique=True)

    def __str__(self):
        return self.user.get_full_name()

class UserProfile(models.Model):
    user = models.OneToOneField(
        User, unique=True, related_name="profile", on_delete=models.CASCADE
    )
    profile_image = models.ImageField(blank=True, null=True)

    is_email_confirmed = models.BooleanField(default=False)

    def __str__(self):
        return self.user.get_full_name()
