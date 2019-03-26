
from django.db import models
from django.contrib.auth.models import User


class JsonData(models.Model):
    title = models.CharField(max_length=100, help_text="Ob'ekt Nomini kiriting...", blank=True)
    phone = models.CharField(max_length=15, help_text='Telefon nomerini iriting...', blank=True)
    data = models.FileField(upload_to='json_data', help_text='JSON файлни танланг...')
    created = models.DateTimeField(auto_now_add=True)
    perm_users = models.ManyToManyField(User, related_name='json_dates', blank=True)

    def __str__(self):
        return self.data.name

    class Meta:
        ordering = ('-created', )


class WaveData(models.Model):
    json_data = models.ForeignKey('JsonData', on_delete=models.CASCADE, related_name='waves')
    data = models.FileField(upload_to='wave_data')
    created = models.DateField(auto_now_add=True)

