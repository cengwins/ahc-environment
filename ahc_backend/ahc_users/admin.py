from __future__ import annotations

from functools import partial
from typing import Union, Tuple

from django.contrib import admin

from .models import *

admin.site.register(UserConfirmationCode)
admin.site.register(UserPasswordReset)


# ABANDON HOPE, ALL YE WHO ENTER HERE.
# On a serious note, this is the only alternative to the excruciating amount of
# unmaintainable boilerplate that I could come up with.


def user_projections(field_name: Union[str | Tuple[str, bool]]):
    """Given a field_name, projects profile.user.field_name.

    for p: UserProfile, and
    f = user_projections("first_name")
    f(p) returns p.user.first_name.

    Optionally, field_name can be a tuple of form (str, bool). In that case, we set
    f.boolean = field_name[1]. We use this to use true/false/unknown icons in the
    list view of the admin page. See contrib.admin.decorators.display for more details.
    """

    def _user_projections(f_name: str, profile_model_instance):
        # magic happens here
        return profile_model_instance.user.__getattribute__(f_name)

    # ("is_active", True) is rendered as a boolean icon in the list view, meanwhile
    # ("is_active", False) and "is_active" are not.
    if isinstance(field_name, str):
        name = field_name
        boolean = None
    else:
        name, boolean = field_name
    f = partial(_user_projections, name)

    # django/contrib/admin/utils.py:354 disregards partial function application.
    f.__name__ = "<lambda>"
    return admin.display(
        f,
        description=name.replace("_", " "),  # is_active to is active.
        ordering=f"user__" f"{name}",  # order by the related User's field.
        boolean=boolean,  # Icon view for booleans?
    )


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


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """Admin model for UserProfile. Functionally very similar to UserAdmin."""

    change_user_password_template = None
    actions_selection_counter = True

    # See list_display option.
    _user_fields = [
        "username",
        "email",
        "first_name",
        "last_name",
        "last_login",
        ("is_active", True),
    ]

    # The following fields/expressions will be displayed as columns in list view.
    list_display = (
        # Callables projecting related User model instance's fields.
        [user_projections(field) for field in _user_fields]
        # Email confirmation (icon view).
        + ["is_email_confirmed"]
        # The list of groups for a given profile.
        + [
            admin.display(
                lambda p: [g for g in p.user.groups.all()],
                description="groups",
                ordering="user__groups",
            )
        ]
    )

    # Can be filtered by the following fields.
    list_filter = ["user__is_active", "is_email_confirmed", "user__groups"]

    # sortable by all
    sortable_by = list_display

    search_fields = [
        "user__first_name",
        "user__last_name",
        "user__username",
        "user__email",
        "user__groups__name",
    ]

    actions = [activate_users_action, deactivate_users_action]
