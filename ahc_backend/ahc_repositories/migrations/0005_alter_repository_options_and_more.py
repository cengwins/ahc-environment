# Generated by Django 4.0 on 2022-01-11 16:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("ahc_repositories", "0004_alter_repository_upstream_type_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="repository",
            options={"ordering": ("-created_at",)},
        ),
        migrations.AlterModelOptions(
            name="repositoryenvvariable",
            options={"ordering": ("name",)},
        ),
    ]
