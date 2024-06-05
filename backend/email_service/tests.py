import pytest
from unittest.mock import patch, mock_open
from email.message import EmailMessage
from email_service.tasks import send_invoice_email
import smtplib

@pytest.mark.django_db
@patch('smtplib.SMTP')
def test_send_invoice_email_success(mock_smtp):
    # Mock SMTP server
    mock_server = mock_smtp.return_value
    mock_server.send_message.return_value = {}

    # Call the task
    with patch('builtins.open', mock_open(read_data="PDF content")) as mock_file:
        send_invoice_email('testuser@example.com', 'path/to/pdf')

    # Assert email was sent
    mock_smtp.assert_called_once_with('localhost')
    mock_server.send_message.assert_called_once()
    assert mock_file.call_count == 1

@pytest.mark.django_db
@patch('smtplib.SMTP')
def test_send_invoice_email_failure(mock_smtp):
    # Mock SMTP server to raise an exception
    mock_smtp.side_effect = smtplib.SMTPException("SMTP error")

    # Call the task and assert exception is raised
    with pytest.raises(smtplib.SMTPException):
        with patch('builtins.open', mock_open(read_data="PDF content")):
            send_invoice_email('testuser@example.com', 'path/to/pdf')

    # Assert email was not sent
    mock_smtp.assert_called_once_with('localhost')

@pytest.mark.django_db
@patch('smtplib.SMTP')
def test_send_invoice_email_no_attachment(mock_smtp):
    # Mock SMTP server
    mock_server = mock_smtp.return_value
    mock_server.send_message.return_value = {}

    # Call the task without an attachment
    with patch('builtins.open', mock_open(read_data="")) as mock_file:
        send_invoice_email('testuser@example.com', 'path/to/pdf')

    # Assert email was sent
    mock_smtp.assert_called_once_with('localhost')
    mock_server.send_message.assert_called_once()
    assert mock_file.call_count == 1

@pytest.mark.django_db
@patch('smtplib.SMTP')
def test_send_invoice_email_invalid_email(mock_smtp):
    # Mock SMTP server
    mock_server = mock_smtp.return_value
    mock_server.send_message.return_value = {}

    # Call the task with an invalid email
    with pytest.raises(ValueError):
        with patch('builtins.open', mock_open(read_data="PDF content")):
            send_invoice_email('invalid-email', 'path/to/pdf')

    # Assert email was not sent
    mock_smtp.assert_not_called()
