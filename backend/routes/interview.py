from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime

from utils.db import db
from utils.helpers import serialize_doc, validate_object_id
from middleware.auth_middleware import token_required
from services.gemini_service import gemini_service
from data.companies import get_company_info, get_all_companies, DIFFICULTY_LEVELS, INTERVIEW_TYPES

interview_bp = Blueprint('interview', __name__)
interview_sessions_collection = db.get_collection('interview_sessions')

@interview_bp.route('/companies', methods=['GET'])
def get_companies():
    """Get list of all companies"""
    try:
        companies = get_all_companies()
        return jsonify({'companies': companies}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get companies', 'error': str(e)}), 500

@interview_bp.route('/start', methods=['POST'])
@token_required
def start_interview(current_user_id):
    """Start a new interview session"""
    try:
        data = request.get_json()
        
        company = data.get('company', 'General')
        job_role = data.get('job_role', 'Software Engineer')
        difficulty = data.get('difficulty', 'intermediate')
        interview_type = data.get('interview_type', 'hr')
        
        # Get company info
        company_info = get_company_info(company)
        
        # Generate first question
        first_question = gemini_service.generate_interview_question(
            company=company,
            company_info=company_info,
            job_role=job_role,
            difficulty=difficulty,
            interview_type=interview_type,
            question_number=1
        )
        
        # Create session
        session_doc = {
            'user_id': ObjectId(current_user_id),
            'company': company,
            'job_role': job_role,
            'difficulty': difficulty,
            'interview_type': interview_type,
            'questions': [{
                'question_id': '1',
                'question_text': first_question,
                'user_answer': '',
                'ai_feedback': '',
                'score': 0,
                'time_taken': 0,
                'corrections': []
            }],
            'current_question_index': 0,
            'status': 'in_progress',
            'started_at': datetime.utcnow(),
            'performance_report': None
        }
        
        result = interview_sessions_collection.insert_one(session_doc)
        session = interview_sessions_collection.find_one({'_id': result.inserted_id})
        
        return jsonify({
            'message': 'Interview started',
            'session': serialize_doc(session),
            'question': first_question
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Failed to start interview', 'error': str(e)}), 500

@interview_bp.route('/<session_id>/feedback', methods=['POST'])
@token_required
def get_realtime_feedback(current_user_id, session_id):
    """Get real-time feedback on partial answer"""
    try:
        if not validate_object_id(session_id):
            return jsonify({'message': 'Invalid session ID'}), 400
        
        data = request.get_json()
        partial_answer = data.get('answer', '')
        
        session = interview_sessions_collection.find_one({
            '_id': ObjectId(session_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not session:
            return jsonify({'message': 'Session not found'}), 404
        
        current_q_index = session['current_question_index']
        current_question = session['questions'][current_q_index]['question_text']
        
        # Get real-time feedback
        feedback = gemini_service.provide_realtime_feedback(
            question=current_question,
            partial_answer=partial_answer,
            company=session['company']
        )
        
        return jsonify({
            'feedback': feedback
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get feedback', 'error': str(e)}), 500

@interview_bp.route('/<session_id>/answer', methods=['POST'])
@token_required
def submit_answer(current_user_id, session_id):
    """Submit answer and get next question"""
    try:
        if not validate_object_id(session_id):
            return jsonify({'message': 'Invalid session ID'}), 400
        
        data = request.get_json()
        answer = data.get('answer', '')
        time_taken = data.get('time_taken', 0)
        
        session = interview_sessions_collection.find_one({
            '_id': ObjectId(session_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not session:
            return jsonify({'message': 'Session not found'}), 404
        
        current_q_index = session['current_question_index']
        current_question = session['questions'][current_q_index]
        
        # Get AI feedback and score
        feedback_data = gemini_service.evaluate_interview_answer(
            question=current_question['question_text'],
            answer=answer,
            company=session['company'],
            job_role=session['job_role'],
            interview_type=session['interview_type']
        )
        
        # Update current question
        session['questions'][current_q_index]['user_answer'] = answer
        session['questions'][current_q_index]['ai_feedback'] = feedback_data.get('feedback', '')
        session['questions'][current_q_index]['score'] = feedback_data.get('score', 0)
        session['questions'][current_q_index]['time_taken'] = time_taken
        session['questions'][current_q_index]['corrections'] = feedback_data.get('corrections', [])
        
        # Check if more questions needed
        max_questions = DIFFICULTY_LEVELS[session['difficulty']]['question_count']
        next_question = None
        
        if current_q_index + 1 < max_questions:
            # Generate next question
            next_question_text = gemini_service.generate_interview_question(
                company=session['company'],
                company_info=get_company_info(session['company']),
                job_role=session['job_role'],
                difficulty=session['difficulty'],
                interview_type=session['interview_type'],
                question_number=current_q_index + 2
            )
            
            session['questions'].append({
                'question_id': str(current_q_index + 2),
                'question_text': next_question_text,
                'user_answer': '',
                'ai_feedback': '',
                'score': 0,
                'time_taken': 0,
                'corrections': []
            })
            
            session['current_question_index'] = current_q_index + 1
            next_question = next_question_text
        
        # Update session
        interview_sessions_collection.update_one(
            {'_id': ObjectId(session_id)},
            {'$set': session}
        )
        
        return jsonify({
            'message': 'Answer submitted',
            'feedback': feedback_data,
            'next_question': next_question,
            'is_complete': next_question is None
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to submit answer', 'error': str(e)}), 500

@interview_bp.route('/<session_id>/complete', methods=['POST'])
@token_required
def complete_interview(current_user_id, session_id):
    """Complete interview and generate performance report"""
    try:
        if not validate_object_id(session_id):
            return jsonify({'message': 'Invalid session ID'}), 400
        
        session = interview_sessions_collection.find_one({
            '_id': ObjectId(session_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not session:
            return jsonify({'message': 'Session not found'}), 404
        
        # Generate performance report
        report = gemini_service.generate_performance_report(session)
        
        # Update session
        interview_sessions_collection.update_one(
            {'_id': ObjectId(session_id)},
            {'$set': {
                'status': 'completed',
                'completed_at': datetime.utcnow(),
                'performance_report': report
            }}
        )
        
        return jsonify({
            'message': 'Interview completed',
            'report': report
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to complete interview', 'error': str(e)}), 500

@interview_bp.route('/sessions', methods=['GET'])
@token_required
def get_sessions(current_user_id):
    """Get user's interview sessions"""
    try:
        sessions = list(interview_sessions_collection.find({
            'user_id': ObjectId(current_user_id)
        }).sort('started_at', -1).limit(20))
        
        return jsonify({'sessions': serialize_doc(sessions)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get sessions', 'error': str(e)}), 500

@interview_bp.route('/<session_id>/report', methods=['GET'])
@token_required
def get_report(current_user_id, session_id):
    """Get performance report for a session"""
    try:
        if not validate_object_id(session_id):
            return jsonify({'message': 'Invalid session ID'}), 400
        
        session = interview_sessions_collection.find_one({
            '_id': ObjectId(session_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not session:
            return jsonify({'message': 'Session not found'}), 404
        
        return jsonify({
            'session': serialize_doc(session),
            'report': session.get('performance_report')
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get report', 'error': str(e)}), 500
