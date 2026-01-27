from datetime import datetime
from bson import ObjectId

class User:
    @staticmethod
    def create(email, password_hash, name):
        """Create a new user document"""
        return {
            'email': email.lower(),
            'password': password_hash,
            'name': name,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'preferences': {
                'theme': 'light',
                'language': 'en',
                'voice_enabled': True
            }
        }
    
    @staticmethod
    def update(user_id, updates):
        """Update user document"""
        updates['updated_at'] = datetime.utcnow()
        return updates
