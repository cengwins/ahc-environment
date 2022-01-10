from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string


from .models import UserConfirmationCode


@receiver(post_save, sender=UserConfirmationCode)
def on_user_save(sender, instance: UserConfirmationCode, created: bool, **kwargs):
    if created:
        content = render_to_string("welcome.html", {"code": instance.code})

        send_mail(
            "Welcome to AHC!",
            content,
            "ahc@ceng.metu.edu.tr",
            [instance.user.email],
            fail_silently=False,
        )
