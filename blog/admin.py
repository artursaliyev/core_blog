from django.contrib import admin
from .models import JsonData, WaveData
from django.utils.translation import ugettext_lazy
from django.contrib.admin import AdminSite


admin.site.register((JsonData, WaveData), )


# AdminSite.site_title = ugettext_lazy('DATA BASE ADMINISTRATION')

AdminSite.site_header = ugettext_lazy('Система')

# AdminSite.index_title = ugettext_lazy('DATA BASE ADMINISTRATION')

