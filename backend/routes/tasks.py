from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from utils.db import tasks_collection
from utils.helpers import serialize_doc, validate_object_id
from models.task import Task
from middleware.auth_middleware import token_required

tasks_bp = Blueprint('tasks', __name__)

@tasks_bp.route('', methods=['GET'])
@token_required
def get_tasks(current_user_id):
    try:
        status = request.args.get('status')
        priority = request.args.get('priority')
        
        query = {'user_id': ObjectId(current_user_id)}
        if status:
            query['status'] = status
        if priority:
            query['priority'] = priority
        
        tasks = list(tasks_collection.find(query).sort('created_at', -1))
        tasks_data = serialize_doc(tasks)
        
        return jsonify({'tasks': tasks_data}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get tasks', 'error': str(e)}), 500

@tasks_bp.route('', methods=['POST'])
@token_required
def create_task(current_user_id):
    try:
        data = request.get_json()
        if not data.get('title'):
            return jsonify({'message': 'Title is required'}), 400
        
        due_date = None
        if data.get('due_date'):
            try:
                due_date = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
            except:
                return jsonify({'message': 'Invalid due_date format'}), 400
        
        task_doc = Task.create(
            user_id=current_user_id,
            title=data['title'],
            description=data.get('description', ''),
            priority=data.get('priority', 'medium'),
            due_date=due_date,
            status=data.get('status', 'pending')
        )
        
        result = tasks_collection.insert_one(task_doc)
        task = tasks_collection.find_one({'_id': result.inserted_id})
        task_data = serialize_doc(task)
        
        return jsonify({'message': 'Task created', 'task': task_data}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create task', 'error': str(e)}), 500

@tasks_bp.route('/<task_id>', methods=['PUT'])
@token_required
def update_task(current_user_id, task_id):
    try:
        if not validate_object_id(task_id):
            return jsonify({'message': 'Invalid task ID'}), 400
        
        data = request.get_json()
        task = tasks_collection.find_one({
            '_id': ObjectId(task_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not task:
            return jsonify({'message': 'Task not found'}), 404
        
        updates = {}
        for field in ['title', 'description', 'priority', 'status']:
            if field in data:
                updates[field] = data[field]
        
        if 'due_date' in data:
            try:
                updates['due_date'] = datetime.fromisoformat(data['due_date'].replace('Z', '+00:00'))
            except:
                pass
        
        update_doc = Task.update(updates)
        tasks_collection.update_one({'_id': ObjectId(task_id)}, {'$set': update_doc})
        
        updated_task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        return jsonify({'message': 'Task updated', 'task': serialize_doc(updated_task)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to update task', 'error': str(e)}), 500

@tasks_bp.route('/<task_id>', methods=['DELETE'])
@token_required
def delete_task(current_user_id, task_id):
    try:
        if not validate_object_id(task_id):
            return jsonify({'message': 'Invalid task ID'}), 400
        
        result = tasks_collection.delete_one({
            '_id': ObjectId(task_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Task not found'}), 404
        
        return jsonify({'message': 'Task deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete task', 'error': str(e)}), 500

@tasks_bp.route('/<task_id>/status', methods=['PATCH'])
@token_required
def update_task_status(current_user_id, task_id):
    try:
        if not validate_object_id(task_id):
            return jsonify({'message': 'Invalid task ID'}), 400
        
        data = request.get_json()
        if not data.get('status'):
            return jsonify({'message': 'Status is required'}), 400
        
        task = tasks_collection.find_one({
            '_id': ObjectId(task_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not task:
            return jsonify({'message': 'Task not found'}), 404
        
        tasks_collection.update_one(
            {'_id': ObjectId(task_id)},
            {'$set': {'status': data['status'], 'updated_at': datetime.utcnow()}}
        )
        
        updated_task = tasks_collection.find_one({'_id': ObjectId(task_id)})
        return jsonify({'message': 'Task status updated', 'task': serialize_doc(updated_task)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to update task status', 'error': str(e)}), 500
