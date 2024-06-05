from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DebtViewSet, UploadedFileViewSet, FileUploadView, FileListView

# Sets up routing for debt and file endpoints.
router = DefaultRouter()
router.register(r'debts', DebtViewSet)
router.register(r'uploaded_files', UploadedFileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/', FileListView.as_view(), name='file-list'),
]
