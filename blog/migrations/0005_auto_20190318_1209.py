# Generated by Django 2.1.7 on 2019-03-18 12:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog', '0004_auto_20190318_1124'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='jsondata',
            options={'ordering': ('-created',)},
        ),
        migrations.AlterField(
            model_name='jsondata',
            name='created',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
