import datetime
import uuid
import pytest
from rest_framework.test import APIClient
from backend.invoice_service.tasks import generate_invoices
from debt_service.models import Debt, UploadedFile
from unittest.mock import patch

# Contains integration tests for invoice generation and file upload.
@pytest.mark.django_db
def test_invoice_generation():
    debt = Debt.objects.create(
        name="Test User",
        government_id="123456789",
        email="testuser@example.com",
        debt_amount=500.0,
        debt_due_date=datetime.date.today() + datetime.timedelta(days=9),
        debt_id=uuid.uuid4()
    )
    with patch('invoice_service.tasks.send_invoice_email.delay') as mock_send_email:
        generate_invoices()
        assert mock_send_email.called

@pytest.mark.django_db
def test_file_upload():
    client = APIClient()
    with open('path_to_test_file.csv', 'rb') as file:
        response = client.post('/api/upload/', {'file': file})
    assert response.status_code == 201
    assert UploadedFile.objects.count() == 1

@pytest.mark.django_db
def test_file_processing():
    client = APIClient()
    with open('path_to_test_file.csv', 'rb') as file:
        response = client.post('/api/upload/', {'file': file})
    assert response.status_code == 201
    uploaded_file = UploadedFile.objects.first()
    assert uploaded_file
    # Simulate processing file
    from debt_service.tasks import process_uploaded_file
    process_uploaded_file(uploaded_file.file_path)
    assert Debt.objects.count() > 0
