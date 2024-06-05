from django.shortcuts import render
from django.core.files.storage import default_storage
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Debt, UploadedFile
from .serializers import DebtSerializer, UploadedFileSerializer
from .tasks import process_uploaded_file, send_debt_creation_event

#Handles file upload, processing debts, storing in the database, and listing received files.
# Use Django REST framework for API endpoints.
class DebtViewSet(viewsets.ModelViewSet):
    queryset = Debt.objects.all()
    serializer_class = DebtSerializer

class UploadedFileViewSet(viewsets.ModelViewSet):
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer

#Endpoint for File Upload
class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES['file']
        file_path = default_storage.save(file_obj.name, file_obj)

        uploaded_file = UploadedFile.objects.create(
            name=file_obj.name,
            file_type=file_obj.content_type,
            size=file_obj.size,
            file_path=file_path
        )
        process_uploaded_file.delay(uploaded_file.file_path)
        return Response(status=status.HTTP_201_CREATED)

#Endpoint for Listing Files
class FileListView(APIView):
    def get(self, request, *args, **kwargs):
        files = UploadedFile.objects.all()
        file_list = [
            {
                'name': file.name,
                'type': file.file_type,
                'size': file.size,
                'download_link': request.build_absolute_uri(file.file_path)
            }
            for file in files
        ]
        return Response(file_list)
