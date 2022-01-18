# Generated by Django 4.0 on 2022-01-11 20:45

import ahc_users.custom_storage
from django.db import migrations
import stdimage.models


class Migration(migrations.Migration):

    dependencies = [
        ('ahc_users', '0006_alter_userprofile_profile_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='profile_image',
            field=stdimage.models.StdImageField(blank=True, null=True, storage=ahc_users.custom_storage.ImageStorage(), upload_to=''),
        ),
    ]
