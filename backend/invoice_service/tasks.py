from celery import shared_task
from pyboleto.bank.itau import BoletoItau
from pyboleto.pdf import BoletoPDF
from debt_service.models import Debt
from email_service.tasks import send_invoice_email
import os
import datetime

#Generates invoices using PyBoleto and sending emails executed by Celery tasks
#Scheduled tasks for generating invoices 10 days before due date.
@shared_task
def generate_invoices():
    today = datetime.date.today()
    upcoming_due_date = today + datetime.timedelta(days=10)  # or configurable days
    debts = Debt.objects.filter(debt_due_date__lte=upcoming_due_date)
    for debt in debts:
        generate_and_send_invoice(debt)

def generate_and_send_invoice(debt):
    boleto = BoletoItau(
        nosso_numero=debt.debt_id,
        numero_documento=debt.debt_id,
        valor_documento=debt.debt_amount,
        data_vencimento=debt.debt_due_date,
        sacado_nome=debt.name,
        sacado_documento=debt.government_id,
        sacado_endereco="Endereço do Sacado"
    )
    pdf_file = f'boleto_{debt.debt_id}.pdf'
    pdf = BoletoPDF(pdf_file)
    pdf.drawBoleto(boleto)
    pdf.save()
    send_invoice_email.delay(debt.email, pdf_file)
    os.remove(pdf_file)
