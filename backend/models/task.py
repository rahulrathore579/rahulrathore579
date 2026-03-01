from datetime import datetime
from bson import ObjectId

class Task:
    @staticmethod
    def create(user_id, title, description='', priority='medium', due_date=None, status='pending', 
               is_appointment=False, start_time=None, end_time=None, location=''):
        """Create a new task document"""
        return {
            'user_id': ObjectId(user_id),
            'title': title,
            'description': description,
            'priority': priority,  # low, medium, high
            'due_date': due_date,
            'status': status,  # pending, in_progress, completed
            'is_appointment': is_appointment,  # True for appointments, False for regular tasks
            'start_time': start_time,  # datetime for appointment start
            'end_time': end_time,  # datetime for appointment end
            'location': location,  # location for appointments
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    
    @staticmethod
    def update(updates):
        """Update task document"""
        updates['updated_at'] = datetime.utcnow()
        return updates
