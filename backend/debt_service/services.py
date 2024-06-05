from .models import Debt, UploadedFile
from .tasks import send_debt_creation_event, process_uploaded_file
from django.core.files.storage import default_storage

# Service Layer Pattern
# Encapsulate business logic, promoting separation of concerns
class DebtService:
    @staticmethod
    def create_debt(data):
        debt = Debt.objects.create(**data)
        send_debt_creation_event.delay(debt.id)
        return debt

    @staticmethod
    def list_debts():
        return Debt.objects.all()

    @staticmethod
    def upload_file(file_obj):
        file_path = default_storage.save(file_obj.name, file_obj)
        uploaded_file = UploadedFile.objects.create(
            name=file_obj.name,
            file_type=file_obj.content_type,
            size=file_obj.size,
            file_path=file_path
        )
        process_uploaded_file.delay(uploaded_file.file_path)
        return uploaded_file

    @staticmethod
    def list_files():
        files = UploadedFile.objects.all()
        return [
            {
                'name': file.name,
                'type': file.file_type,
                'size': file.size,
                'download_link': file.file_path
            }
            for file in files
        ]
