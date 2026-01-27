from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from utils.db import applications_collection
from utils.helpers import serialize_doc, validate_object_id
from middleware.auth_middleware import token_required

applications_bp = Blueprint('applications', __name__)

@applications_bp.route('', methods=['GET'])
@token_required
def get_applications(current_user_id):
    try:
        status = request.args.get('status')
        query = {'user_id': ObjectId(current_user_id)}
        if status:
            query['status'] = status
        
        applications = list(applications_collection.find(query).sort('applied_date', -1))
        return jsonify({'applications': serialize_doc(applications)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get applications', 'error': str(e)}), 500

@applications_bp.route('', methods=['POST'])
@token_required
def create_application(current_user_id):
    try:
        data = request.get_json()
        if not data.get('company') or not data.get('job_role'):
            return jsonify({'message': 'Company and job role are required'}), 400
        
        app_doc = {
            'user_id': ObjectId(current_user_id),
            'company': data['company'],
            'job_role': data['job_role'],
            'application_url': data.get('application_url'),
            'status': data.get('status', 'applied'),
            'applied_date': datetime.fromisoformat(data.get('applied_date', datetime.utcnow().isoformat()).replace('Z', '+00:00')),
            'notes': data.get('notes', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = applications_collection.insert_one(app_doc)
        application = applications_collection.find_one({'_id': result.inserted_id})
        
        return jsonify({'message': 'Application created', 'application': serialize_doc(application)}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create application', 'error': str(e)}), 500

@applications_bp.route('/<app_id>', methods=['PUT'])
@token_required
def update_application(current_user_id, app_id):
    try:
        if not validate_object_id(app_id):
            return jsonify({'message': 'Invalid application ID'}), 400
        
        data = request.get_json()
        application = applications_collection.find_one({
            '_id': ObjectId(app_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not application:
            return jsonify({'message': 'Application not found'}), 404
        
        updates = {}
        for field in ['company', 'job_role', 'application_url', 'status', 'notes']:
            if field in data:
                updates[field] = data[field]
        
        if 'applied_date' in data:
            updates['applied_date'] = datetime.fromisoformat(data['applied_date'].replace('Z', '+00:00'))
        
        updates['updated_at'] = datetime.utcnow()
        applications_collection.update_one({'_id': ObjectId(app_id)}, {'$set': updates})
        
        updated_app = applications_collection.find_one({'_id': ObjectId(app_id)})
        return jsonify({'message': 'Application updated', 'application': serialize_doc(updated_app)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to update application', 'error': str(e)}), 500

@applications_bp.route('/<app_id>', methods=['DELETE'])
@token_required
def delete_application(current_user_id, app_id):
    try:
        if not validate_object_id(app_id):
            return jsonify({'message': 'Invalid application ID'}), 400
        
        result = applications_collection.delete_one({
            '_id': ObjectId(app_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Application not found'}), 404
        
        return jsonify({'message': 'Application deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete application', 'error': str(e)}), 500
