from datetime import datetime
from bson import ObjectId

class Task:
    @staticmethod
    def create(user_id, title, description='', priority='medium', due_date=None, status='pending'):
        """Create a new task document"""
        return {
            'user_id': ObjectId(user_id),
            'title': title,
            'description': description,
            'priority': priority,  # low, medium, high
            'due_date': due_date,
            'status': status,  # pending, in_progress, completed
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    
    @staticmethod
    def update(updates):
        """Update task document"""
        updates['updated_at'] = datetime.utcnow()
        return updates
