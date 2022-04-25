import nested_admin
from django.contrib import admin, auth
from django.contrib.auth.models import Group
from django.http import HttpResponseRedirect
from django.shortcuts import render

from .forms import UserGroupsForm
from .models import *
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from django.contrib.auth.admin import GroupAdmin


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


@admin.action(description="Assign groups to selected users")
def add_users_to_group(_modeladmin, _request, queryset):
    if 'apply' in _request.POST:
        group_ids = _request.POST.getlist('groups')
        user_profile_ids = _request.POST.getlist('_selected_action')
        for user_profile_id in user_profile_ids:
            user_profile = UserProfile.objects.get(pk=user_profile_id)
            for group_id in group_ids:
                group = Group.objects.get(pk=group_id)
                user_profile.user.groups.add(group)
        return HttpResponseRedirect(_request.get_full_path())
    groups = Group.objects.all()
    form = UserGroupsForm(initial={'_selected_action': queryset.values_list('pk', flat=True)})
    return render(_request, 'group_actions.html',
                  {'groups': groups, 'form': form, 'queryset': queryset, 'action': 'add_users_to_group'})


@admin.action(description="Remove groups from selected users")
def remove_users_from_group(_modeladmin, _request, queryset):
    if 'apply' in _request.POST:
        group_ids = _request.POST.getlist('groups')
        user_profile_ids = _request.POST.getlist('_selected_action')
        for user_profile_id in user_profile_ids:
            user_profile = UserProfile.objects.get(pk=user_profile_id)
            for group_id in group_ids:
                group = Group.objects.get(pk=group_id)
                user_profile.user.groups.remove(group)
        return HttpResponseRedirect(_request.get_full_path())
    """find only the related groups and show them (that selected users are in)"""
    groups = Group.objects.filter(user__in=queryset.values_list('user', flat=True)).distinct()
    form = UserGroupsForm(initial={'_selected_action': queryset.values_list('pk', flat=True)})
    """update the group queryset of the form to be rendered"""
    form.fields['groups'].queryset = groups
    return render(_request, 'group_actions.html',
                  {'groups': groups, 'form': form, 'queryset': queryset, 'action': 'remove_users_from_group'})


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
        "_notes"
    )
    list_filter = ("last_login", "created_at", "is_email_confirmed", "user__groups")
    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
        "user__groups__name"
    )
    actions = [activate_users_action, deactivate_users_action, add_users_to_group, remove_users_from_group]


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


class StudentResource(resources.ModelResource):
    class Meta:
        model = StudentGroup


class StudentGroupAdmin(ImportExportModelAdmin):
    resource_class = StudentResource
    list_display = ("name", "created_at", "updated_at")
    list_filter = ("created_at", "updated_at")
    search_fields = (
        "name",
    )


class StudentGroupInline(nested_admin.NestedTabularInline):
    model = StudentGroup
    extra = 0


class GroupAdmin(nested_admin.NestedModelAdmin, ImportExportModelAdmin, GroupAdmin):
    search_fields = (
        "name", "notes"
    )
    list_display = ("name", "notes", "updated_at", "created_at")
    list_filter = ("student_group__created_at", "student_group__updated_at")
    inlines = [StudentGroupInline]


admin.site.unregister(Group)
admin.site.register(Group, GroupAdmin)