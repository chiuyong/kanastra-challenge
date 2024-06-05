# debt_service/tests.py
import pytest
from rest_framework.test import APIClient
from backend.debt_service.services import DebtService
from .models import Debt, UploadedFile

#Contains unit tests for debt creation, file upload, and file listing.
@pytest.mark.django_db
def test_create_debt():
    data = {
        'name': 'Test User',
        'government_id': '123456789',
        'email': 'testuser@example.com',
        'debt_amount': 100.00,
        'debt_due_date': '2024-01-01',
        'debt_id': 'test-uuid'
    }
    debt = DebtService.create_debt(data)
    assert Debt.objects.count() == 1
    assert debt.name == 'Test User'

@pytest.mark.django_db
def test_list_debts():
    data = {
        'name': 'Test User',
        'government_id': '123456789',
        'email': 'testuser@example.com',
        'debt_amount': 100.00,
        'debt_due_date': '2024-01-01',
        'debt_id': 'test-uuid'
    }
    DebtService.create_debt(data)
    debts = DebtService.list_debts()
    assert debts.count() == 1

@pytest.mark.django_db
def test_file_upload():
    client = APIClient()
    with open('path_to_test_file.csv', 'rb') as file:
        response = client.post('/api/upload/', {'file': file})
    assert response.status_code == 201
    assert UploadedFile.objects.count() == 1

@pytest.mark.django_db
def test_list_files():
    client = APIClient()
    with open('path_to_test_file.csv', 'rb') as file:
        client.post('/api/upload/', {'file': file})
    response = client.get('/api/files/')
    assert response.status_code == 200
    files = response.json()
    assert len(files) > 0
    assert 'name' in files[0]
    assert 'type' in files[0]
    assert 'size' in files[0]
    assert 'download_link' in files[0]
