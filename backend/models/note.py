from datetime import datetime
from bson import ObjectId

class Note:
    @staticmethod
    def create(user_id, title, content, tags=None, linked_task_id=None, linked_job_role=None):
        """Create a new note document"""
        return {
            'user_id': ObjectId(user_id),
            'title': title,
            'content': content,
            'tags': tags or [],
            'linked_task_id': ObjectId(linked_task_id) if linked_task_id else None,
            'linked_job_role': linked_job_role,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    
    @staticmethod
    def update(updates):
        """Update note document"""
        if 'linked_task_id' in updates and updates['linked_task_id']:
            updates['linked_task_id'] = ObjectId(updates['linked_task_id'])
        updates['updated_at'] = datetime.utcnow()
        return updates
