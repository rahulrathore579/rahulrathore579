import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/personal_assistant')
    JWT_SECRET = os.getenv('JWT_SECRET', 'your-secret-key-change-this')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    PORT = int(os.getenv('PORT', 5000))
    DEBUG = os.getenv('FLASK_ENV') == 'development'
