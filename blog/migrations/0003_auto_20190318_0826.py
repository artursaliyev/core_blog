# Generated by Django 2.1.7 on 2019-03-18 08:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0002_auto_20190317_1010'),
    ]

    operations = [
        migrations.AlterField(
            model_name='jsondata',
            name='phone',
            field=models.CharField(blank=True, help_text='Telefon nomerini iriting...', max_length=15),
        ),
        migrations.AlterField(
            model_name='jsondata',
            name='title',
            field=models.CharField(blank=True, help_text="Ob'ekt Nomini kiriting...", max_length=100),
        ),
    ]
