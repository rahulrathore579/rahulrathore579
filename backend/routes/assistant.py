from flask import Blueprint, request, jsonify
from bson import ObjectId

from utils.db import tasks_collection, notes_collection, resumes_collection
from utils.helpers import serialize_doc
from middleware.auth_middleware import token_required
from services.gemini_service import gemini_service

assistant_bp = Blueprint('assistant', __name__)

@assistant_bp.route('/chat', methods=['POST'])
@token_required
def chat(current_user_id):
    try:
        data = request.get_json()
        if not data.get('message'):
            return jsonify({'message': 'Message is required'}), 400
        
        user_message = data['message']
        context = {}
        
        if data.get('include_tasks', True):
            tasks = list(tasks_collection.find({
                'user_id': ObjectId(current_user_id),
                'status': {'$ne': 'completed'}
            }).limit(5))
            if tasks:
                context['tasks'] = '\n'.join([f"- {t['title']} ({t['status']})" for t in tasks])
        
        response = gemini_service.get_assistant_response(user_message, context)
        
        return jsonify({
            'message': 'Response generated',
            'response': response,
            'context_used': list(context.keys())
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get response', 'error': str(e)}), 500

@assistant_bp.route('/interview-practice', methods=['POST'])
@token_required
def interview_practice(current_user_id):
    try:
        data = request.get_json()
        if not data.get('question') or not data.get('answer'):
            return jsonify({'message': 'Question and answer are required'}), 400
        
        feedback = gemini_service.simulate_interview(
            question=data['question'],
            user_answer=data['answer'],
            job_role=data.get('job_role', 'Software Developer'),
            question_type=data.get('question_type', 'technical')
        )
        
        return jsonify({'message': 'Feedback generated', 'feedback': feedback}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to generate feedback', 'error': str(e)}), 500

@assistant_bp.route('/improve-communication', methods=['POST'])
@token_required
def improve_communication(current_user_id):
    try:
        data = request.get_json()
        if not data.get('text') or not data.get('type'):
            return jsonify({'message': 'Text and type are required'}), 400
        
        improvement = gemini_service.improve_communication(
            text_type=data['type'],
            user_text=data['text']
        )
        
        return jsonify({'message': 'Improvement generated', 'improvement': improvement}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to improve communication', 'error': str(e)}), 500

@assistant_bp.route('/generate-questions', methods=['POST'])
@token_required
def generate_questions(current_user_id):
    try:
        data = request.get_json()
        if not data.get('job_role'):
            return jsonify({'message': 'Job role is required'}), 400
        
        questions = gemini_service.generate_practice_questions(
            job_role=data['job_role'],
            question_type=data.get('question_type', 'technical'),
            count=data.get('count', 5)
        )
        
        return jsonify({'message': 'Questions generated', 'questions': questions}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to generate questions', 'error': str(e)}), 500
