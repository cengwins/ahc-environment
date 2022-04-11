from __future__ import annotations

from functools import partial
from typing import Union, Tuple

from django.contrib import admin
from django.contrib.auth import models as m

from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin


def _set_user_is_active(queryset, is_active: bool) -> int:
    """Given a UserProfile queryset, updates the related Users' is_active field.

    Returns the number of rows updated.
    """
    return User.objects.filter(profile__in=queryset).update(is_active=is_active)


@admin.action(description="Mark selected users as active.")
def activate_users_action(_modeladmin, _request, queryset):
    return _set_user_is_active(queryset, True)


@admin.action(description="Mark selected users as inactive.")
def deactivate_users_action(_modeladmin, _request, queryset):
    return _set_user_is_active(queryset, False)


class UserProfileResource(resources.ModelResource):
    class Meta:
        model = UserProfile


class UserProfileAdmin(ImportExportModelAdmin):
    resource_class = UserProfileResource
    list_display = (
        '_username', '_email', '_first_name', '_last_name', 'last_login', '_is_active', 'is_email_confirmed')
    list_filter = ('last_login', 'created_at', 'is_email_confirmed')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')
    actions = [activate_users_action, deactivate_users_action]


class UserConfirmationCodeResource(resources.ModelResource):
    class Meta:
        model = UserConfirmationCode


class UserConfirmationCodeAdmin(ImportExportModelAdmin):
    resource_class = UserConfirmationCodeResource
    list_display = ('user', 'code', 'created_at', 'updated_at')
    list_filter = ('created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')


class UserPasswordResetResource(resources.ModelResource):
    class Meta:
        model = UserPasswordReset


class UserPasswordResetAdmin(ImportExportModelAdmin):
    resource_class = UserPasswordResetResource
    list_display = ('user', 'code', 'created_at', 'updated_at', 'is_used')
    list_filter = ('created_at', 'updated_at', 'is_used')
    search_fields = ('user__username', 'user__email', 'user__first_name', 'user__last_name')


admin.site.register(UserProfile, UserProfileAdmin)
admin.site.unregister(m.User)
