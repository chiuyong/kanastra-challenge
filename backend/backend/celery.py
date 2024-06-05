from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

#Celery Configuration
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'debt_management.settings')

app = Celery('debt_management')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Schedule daily tasks for generating invoices
app.conf.beat_schedule = {
    'generate_invoices': {
        'task': 'invoice_service.tasks.generate_invoices',
        'schedule': crontab(hour=0, minute=0),
    },
}
