from pymongo import MongoClient
from config import Config

class Database:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Database, cls).__new__(cls)
            cls._instance.client = MongoClient(Config.MONGODB_URI)
            cls._instance.db = cls._instance.client.get_default_database()
        return cls._instance
    
    def get_collection(self, collection_name):
        return self.db[collection_name]

# Initialize database
db = Database()

# Collections
users_collection = db.get_collection('users')
tasks_collection = db.get_collection('tasks')
notes_collection = db.get_collection('notes')
resumes_collection = db.get_collection('resumes')
job_practice_collection = db.get_collection('job_practice')
applications_collection = db.get_collection('applications')
