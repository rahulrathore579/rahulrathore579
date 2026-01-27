from flask import Blueprint, request, jsonify
from bson import ObjectId

from utils.db import notes_collection
from utils.helpers import serialize_doc, validate_object_id
from models.note import Note
from middleware.auth_middleware import token_required

notes_bp = Blueprint('notes', __name__)

@notes_bp.route('', methods=['GET'])
@token_required
def get_notes(current_user_id):
    try:
        tag = request.args.get('tag')
        query = {'user_id': ObjectId(current_user_id)}
        if tag:
            query['tags'] = tag
        
        notes = list(notes_collection.find(query).sort('created_at', -1))
        return jsonify({'notes': serialize_doc(notes)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get notes', 'error': str(e)}), 500

@notes_bp.route('', methods=['POST'])
@token_required
def create_note(current_user_id):
    try:
        data = request.get_json()
        if not data.get('title') or not data.get('content'):
            return jsonify({'message': 'Title and content are required'}), 400
        
        note_doc = Note.create(
            user_id=current_user_id,
            title=data['title'],
            content=data['content'],
            tags=data.get('tags', [])
        )
        
        result = notes_collection.insert_one(note_doc)
        note = notes_collection.find_one({'_id': result.inserted_id})
        
        return jsonify({'message': 'Note created', 'note': serialize_doc(note)}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create note', 'error': str(e)}), 500

@notes_bp.route('/<note_id>', methods=['PUT'])
@token_required
def update_note(current_user_id, note_id):
    try:
        if not validate_object_id(note_id):
            return jsonify({'message': 'Invalid note ID'}), 400
        
        data = request.get_json()
        note = notes_collection.find_one({
            '_id': ObjectId(note_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not note:
            return jsonify({'message': 'Note not found'}), 404
        
        updates = {}
        for field in ['title', 'content', 'tags']:
            if field in data:
                updates[field] = data[field]
        
        update_doc = Note.update(updates)
        notes_collection.update_one({'_id': ObjectId(note_id)}, {'$set': update_doc})
        
        updated_note = notes_collection.find_one({'_id': ObjectId(note_id)})
        return jsonify({'message': 'Note updated', 'note': serialize_doc(updated_note)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to update note', 'error': str(e)}), 500

@notes_bp.route('/<note_id>', methods=['DELETE'])
@token_required
def delete_note(current_user_id, note_id):
    try:
        if not validate_object_id(note_id):
            return jsonify({'message': 'Invalid note ID'}), 400
        
        result = notes_collection.delete_one({
            '_id': ObjectId(note_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Note not found'}), 404
        
        return jsonify({'message': 'Note deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete note', 'error': str(e)}), 500
