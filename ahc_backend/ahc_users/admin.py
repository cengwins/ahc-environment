from django.contrib import admin

from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin


def _set_user_is_activated(queryset, is_activated: bool) -> int:
    """Given a UserProfile queryset, updates is_activated fields.

    Returns the number of rows updated.
    """
    return queryset.update(is_activated=is_activated)


@admin.action(description="Mark selected users as activated.")
def activate_users_action(_modeladmin, _request, queryset):
    return _set_user_is_activated(queryset, True)


@admin.action(description="Mark selected users as inactivated.")
def deactivate_users_action(_modeladmin, _request, queryset):
    return _set_user_is_activated(queryset, False)


class UserProfileResource(resources.ModelResource):
    class Meta:
        model = UserProfile


class UserProfileAdmin(ImportExportModelAdmin):
    resource_class = UserProfileResource
    list_display = (
        "_username",
        "_email",
        "_first_name",
        "_last_name",
        "last_login",
        "is_activated",
        "is_email_confirmed",
        "_groups",
    )
    list_filter = ("last_login", "created_at", "is_email_confirmed")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )
    actions = [activate_users_action, deactivate_users_action]


class UserConfirmationCodeResource(resources.ModelResource):
    class Meta:
        model = UserConfirmationCode


class UserConfirmationCodeAdmin(ImportExportModelAdmin):
    resource_class = UserConfirmationCodeResource
    list_display = ("user", "code", "created_at", "updated_at")
    list_filter = ("created_at", "updated_at")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )


class UserPasswordResetResource(resources.ModelResource):
    class Meta:
        model = UserPasswordReset


class UserPasswordResetAdmin(ImportExportModelAdmin):
    resource_class = UserPasswordResetResource
    list_display = ("user", "code", "created_at", "updated_at", "is_used")
    list_filter = ("created_at", "updated_at", "is_used")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )


admin.site.register(UserProfile, UserProfileAdmin)
