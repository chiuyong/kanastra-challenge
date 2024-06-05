from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException

# Exception Handling to handle errors
class DebtProcessingError(APIException):
    status_code = 400
    default_detail = 'Error processing debt.'
    default_code = 'debt_processing_error'

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data['status_code'] = response.status_code
    return response
