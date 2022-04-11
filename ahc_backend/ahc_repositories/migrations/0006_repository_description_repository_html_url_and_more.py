# Generated by Django 4.0 on 2022-04-08 11:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ahc_repositories", "0005_alter_repository_options_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="repository",
            name="description",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name="repository",
            name="html_url",
            field=models.CharField(default="", max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="repository",
            name="private",
            field=models.BooleanField(default=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="repository",
            name="stargazers_count",
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
