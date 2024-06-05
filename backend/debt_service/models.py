from django.db import models
import uuid

# Debt Schema
class Debt(models.Model):
    name = models.CharField(max_length=255)
    government_id = models.CharField(max_length=20)
    email = models.EmailField()
    debt_amount = models.DecimalField(max_digits=10, decimal_places=2)
    debt_due_date = models.DateField()
    debt_id = models.UUIDField()

class UploadedFile(models.Model):
    name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    size = models.BigIntegerField()
    upload_date = models.DateTimeField(auto_now_add=True)
    file_path = models.CharField(max_length=255)
