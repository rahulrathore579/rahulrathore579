from datetime import datetime
from bson import ObjectId

class Habit:
    @staticmethod
    def create(user_id, title, description='', color='#3b82f6'):
        """Create a new habit document"""
        return {
            'user_id': ObjectId(user_id),
            'title': title,
            'description': description,
            'color': color,  # For visual distinction in UI
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    
    @staticmethod
    def update(updates):
        """Update habit document"""
        updates['updated_at'] = datetime.utcnow()
        return updates

class HabitLog:
    @staticmethod
    def create(habit_id, user_id, date, completed=True):
        """Create or update a habit log entry for a specific date"""
        return {
            'habit_id': ObjectId(habit_id),
            'user_id': ObjectId(user_id),
            'date': date,  # Store as string YYYY-MM-DD for easy querying
            'completed': completed,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    
    @staticmethod
    def toggle(completed):
        """Toggle completion status"""
        return {
            'completed': completed,
            'updated_at': datetime.utcnow()
        }
