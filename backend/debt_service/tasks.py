# debt_service/tasks.py
from backend.debt_service.services import DebtService
from celery import shared_task
import pika
from pyspark.sql import SparkSession

#Use RabbitMQ for asynchronous communication between services.
def send_debt_creation_event(debt_id):
    connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
    channel = connection.channel()
    channel.queue_declare(queue='debt_queue')
    channel.basic_publish(exchange='', routing_key='debt_queue', body=str(debt_id))
    connection.close()

#Processing Data with PySpark
@shared_task
def process_uploaded_file(file_path):
    spark = SparkSession.builder.appName("DebtProcessing").getOrCreate()
    df = spark.read.format("csv").option("header", "true").load(file_path)
     # Process each row
    for row in df.collect():
        debt_data = {
            "name": row.name,
            "government_id": row.governmentId,
            "email": row.email,
            "debt_amount": row.debtAmount,
            "debt_due_date": row.debtDueDate,
            "debt_id": row.debtId
        }
        DebtService.create_debt(debt_data)
    # Further processing
    spark.stop()
