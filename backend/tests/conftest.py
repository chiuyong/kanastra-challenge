import os
from dotenv import load_dotenv

load_dotenv()  # This will load environment variables from the .env file

# Set default settings module if not already set
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
