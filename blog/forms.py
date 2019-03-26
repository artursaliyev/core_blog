
from django import forms
from django.contrib.auth.models import User
from django.forms import CheckboxSelectMultiple

from .models import JsonData


class JsonDataForm(forms.ModelForm):
    """Form for JsonData model"""

    class Meta:
        """Meta class"""
        model = JsonData
        fields = ('data', 'perm_users', )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["perm_users"].widget = CheckboxSelectMultiple()
        self.fields["perm_users"].queryset = User.objects.all()


