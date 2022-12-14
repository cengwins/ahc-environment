# Generated by Django 4.0 on 2022-01-10 12:43

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
        (
            "ahc_repositories",
            "0002_alter_repository_created_at_alter_repository_name_and_more",
        ),
    ]

    operations = [
        migrations.AlterField(
            model_name="repository",
            name="name",
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name="repositoryuser",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="repository_users",
                to="auth.user",
            ),
        ),
    ]
