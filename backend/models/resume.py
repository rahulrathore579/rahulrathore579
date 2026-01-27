from datetime import datetime
from bson import ObjectId

class Resume:
    @staticmethod
    def create(user_id, job_role, summary='', skills=None, projects=None, experience=None, education=None):
        """Create a new resume document"""
        return {
            'user_id': ObjectId(user_id),
            'job_role': job_role,
            'summary': summary,
            'skills': skills or [],
            'projects': projects or [],
            'experience': experience or [],
            'education': education or [],
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
    
    @staticmethod
    def update(updates):
        """Update resume document"""
        updates['updated_at'] = datetime.utcnow()
        return updates
