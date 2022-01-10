from django.apps import AppConfig


class AhcUsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ahc_users"

    def ready(self) -> None:
        from . import signals

        return super().ready()
