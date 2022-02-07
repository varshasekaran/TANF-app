# Generated by Django 3.2.10 on 2022-01-24 16:56

import django.db.models.deletion
from django.db import migrations, models


def add_location(apps, schema_editor):
    User=apps.get_model('users','User')
    Region=apps.get_model('stts','Region')
    STT=apps.get_model('stts','STT')
    Group=apps.get_model('auth', 'Group')

    ContentType=apps.get_model("contenttypes", "ContentType")

    region_content_type=ContentType.objects.get_for_model(Region).pk
    stt_content_type=ContentType.objects.get_for_model(STT).pk

    regional_staff_role=Group.objects.get(name='OFA Regional Staff').id
    analyst_role=Group.objects.get(name='Data Analyst').id

    regional_users=User.objects.filter(groups=regional_staff_role)

    analyst_users=User.objects.filter(groups=analyst_role)

    for user in regional_users:
        if user.region:
            user.location_id = user.region.id
            user.location_type = region_content_type

    for user in analyst_users:
        if user.stt:
            user.location_id = user.stt.id
            user.location_type = stt_content_type

class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('users', '0027_user_hhs_id'),
    ]

    operations = [

        migrations.AddField(
            model_name='user',
            name='location_id',
            field=models.PositiveIntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='user',
            name='location_type',
            field=models.ForeignKey(
                blank=True,
                limit_choices_to=models.Q(
                    models.Q(('app_label', 'stts'), ('model', 'stt')),
                    models.Q(('app_label', 'stts'), ('model', 'region')),
                    _connector='OR'
                ),
                null=True,
                on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'
            ),
        ),
        migrations.RunPython(add_location),
        migrations.RemoveField(
            model_name='user',
            name='region',
        ),
        migrations.RemoveField(
            model_name='user',
            name='stt',
        ),
    ]
