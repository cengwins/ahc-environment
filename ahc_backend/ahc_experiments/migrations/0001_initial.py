# Generated by Django 4.0 on 2022-01-10 13:53

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import re


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('ahc_repositories', '0004_alter_repository_upstream_type_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Experiment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sequence_id', models.PositiveIntegerField()),
                ('commit', models.CharField(max_length=40, validators=[django.core.validators.RegexValidator(regex=re.compile('^[0-9a-zA-Z]{40}$'))])),
                ('reference', models.CharField(max_length=80)),
                ('reference_type', models.CharField(choices=[('TAG', 'Tag'), ('COMMIT', 'Commit'), ('BRANCH', 'Branch')], max_length=6)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('repository', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='experiments', to='ahc_repositories.repository')),
            ],
        ),
        migrations.CreateModel(
            name='ExperimentRun',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sequence_id', models.PositiveIntegerField()),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('finished_at', models.DateTimeField(blank=True, null=True)),
                ('exit_code', models.PositiveIntegerField(blank=True, null=True)),
                ('log_path', models.CharField(blank=True, max_length=4096, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('experiment', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='runs', to='ahc_experiments.experiment')),
            ],
        ),
        migrations.CreateModel(
            name='ExperimentMetric',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40)),
                ('type', models.CharField(choices=[('SYSTEM', 'System'), ('USER', 'User')], max_length=6)),
                ('value_float', models.FloatField(blank=True, null=True)),
                ('value_int', models.IntegerField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('experiment_run', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='metrics', to='ahc_experiments.experimentrun')),
            ],
        ),
    ]