from django.apps import AppConfig


class AhcExperimentsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "ahc_experiments"

    def ready(self) -> None:
        from . import signals

        return super().ready()
