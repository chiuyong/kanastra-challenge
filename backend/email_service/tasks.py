# email_service/tasks.py
from celery import shared_task
import smtplib
from email.message import EmailMessage

# Ensures that emails are sent asynchronously.
#Sends emails using smtplib.
@shared_task
def send_invoice_email(to_email, pdf_file):
    msg = EmailMessage()
    msg['Subject'] = 'Invoice Notification'
    msg['From'] = 'no-reply@example.com'
    msg['To'] = to_email
    msg.set_content('Please find your invoice attached.')
    with open(pdf_file, 'rb') as f:
        file_data = f.read()
        msg.add_attachment(file_data, maintype='application', subtype='pdf', filename=pdf_file)

    with smtplib.SMTP('localhost') as smtp:
        smtp.send_message(msg)
