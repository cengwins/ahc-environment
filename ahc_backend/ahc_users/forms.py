from django import forms
from django.contrib.auth.models import Group


class UserGroupsForm(forms.Form):
    _selected_action = forms.CharField(widget=forms.MultipleHiddenInput)
    groups = forms.ModelMultipleChoiceField(Group.objects.all())
