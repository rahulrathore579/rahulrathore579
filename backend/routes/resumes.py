from flask import Blueprint, request, jsonify, send_file
from bson import ObjectId
from datetime import datetime
from werkzeug.utils import secure_filename
import io

from utils.db import resumes_collection, db
from utils.helpers import serialize_doc, validate_object_id
from utils.file_parser import parse_resume_file, validate_file_size, validate_file_type
from models.resume import Resume
from middleware.auth_middleware import token_required
from services.gemini_service import gemini_service

resumes_bp = Blueprint('resumes', __name__)

# GridFS for file storage
from gridfs import GridFS
fs = GridFS(db.db)

@resumes_bp.route('', methods=['GET'])
@token_required
def get_resumes(current_user_id):
    try:
        resumes = list(resumes_collection.find({'user_id': ObjectId(current_user_id)}).sort('created_at', -1))
        return jsonify({'resumes': serialize_doc(resumes)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get resumes', 'error': str(e)}), 500

@resumes_bp.route('/upload', methods=['POST'])
@token_required
def upload_resume(current_user_id):
    try:
        if 'file' not in request.files:
            return jsonify({'message': 'No file provided'}), 400
        
        file = request.files['file']
        job_role = request.form.get('job_role', 'General')
        
        if file.filename == '':
            return jsonify({'message': 'No file selected'}), 400
        
        # Validate file type
        if not validate_file_type(file.filename):
            return jsonify({'message': 'Invalid file type. Only PDF and DOCX are allowed'}), 400
        
        # Read file
        file_bytes = file.read()
        file_size = len(file_bytes)
        
        # Validate file size (5MB limit)
        if not validate_file_size(file_size, max_size_mb=5):
            return jsonify({'message': 'File too large. Maximum size is 5MB'}), 400
        
        # Parse resume text
        try:
            extracted_text = parse_resume_file(file_bytes, file.filename)
        except Exception as e:
            return jsonify({'message': f'Failed to parse file: {str(e)}'}), 400
        
        # Store file in GridFS
        filename = secure_filename(file.filename)
        file_id = fs.put(
            file_bytes,
            filename=filename,
            content_type=file.content_type,
            user_id=str(current_user_id)
        )
        
        # Score resume with AI
        ai_score = None
        try:
            score_data = gemini_service.score_resume(extracted_text, job_role)
            if score_data:
                ai_score = {
                    'overall': score_data.get('overall', 0),
                    'ats_score': score_data.get('ats_score', 0),
                    'keyword_score': score_data.get('keyword_score', 0),
                    'structure_score': score_data.get('structure_score', 0),
                    'content_score': score_data.get('content_score', 0),
                    'feedback': score_data.get('feedback', ''),
                    'scored_at': datetime.utcnow()
                }
        except Exception as e:
            print(f"Scoring error: {str(e)}")
            # Continue without score
        
        # Create resume document
        resume_doc = {
            'user_id': ObjectId(current_user_id),
            'job_role': job_role,
            'summary': '',
            'skills': [],
            'file_id': file_id,
            'filename': filename,
            'file_size': file_size,
            'file_type': filename.split('.')[-1].lower(),
            'extracted_text': extracted_text[:5000],  # Store first 5000 chars
            'ai_score': ai_score,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = resumes_collection.insert_one(resume_doc)
        resume = resumes_collection.find_one({'_id': result.inserted_id})
        
        return jsonify({
            'message': 'Resume uploaded successfully',
            'resume': serialize_doc(resume)
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Failed to upload resume', 'error': str(e)}), 500

@resumes_bp.route('/<resume_id>/download', methods=['GET'])
@token_required
def download_resume(current_user_id, resume_id):
    try:
        if not validate_object_id(resume_id):
            return jsonify({'message': 'Invalid resume ID'}), 400
        
        resume = resumes_collection.find_one({
            '_id': ObjectId(resume_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not resume:
            return jsonify({'message': 'Resume not found'}), 404
        
        if 'file_id' not in resume:
            return jsonify({'message': 'No file associated with this resume'}), 404
        
        # Get file from GridFS
        file_data = fs.get(resume['file_id'])
        
        return send_file(
            io.BytesIO(file_data.read()),
            mimetype=file_data.content_type,
            as_attachment=True,
            download_name=resume['filename']
        )
        
    except Exception as e:
        return jsonify({'message': 'Failed to download resume', 'error': str(e)}), 500

@resumes_bp.route('/<resume_id>/score', methods=['POST'])
@token_required
def score_resume(current_user_id, resume_id):
    try:
        if not validate_object_id(resume_id):
            return jsonify({'message': 'Invalid resume ID'}), 400
        
        resume = resumes_collection.find_one({
            '_id': ObjectId(resume_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not resume:
            return jsonify({'message': 'Resume not found'}), 404
        
        if 'extracted_text' not in resume:
            return jsonify({'message': 'No text content to score'}), 400
        
        # Score with AI
        score_data = gemini_service.score_resume(
            resume['extracted_text'],
            resume.get('job_role', 'General')
        )
        
        if not score_data:
            return jsonify({'message': 'Failed to generate score'}), 500
        
        ai_score = {
            'overall': score_data.get('overall', 0),
            'ats_score': score_data.get('ats_score', 0),
            'keyword_score': score_data.get('keyword_score', 0),
            'structure_score': score_data.get('structure_score', 0),
            'content_score': score_data.get('content_score', 0),
            'feedback': score_data.get('feedback', ''),
            'scored_at': datetime.utcnow()
        }
        
        # Update resume
        resumes_collection.update_one(
            {'_id': ObjectId(resume_id)},
            {'$set': {'ai_score': ai_score, 'updated_at': datetime.utcnow()}}
        )
        
        return jsonify({
            'message': 'Resume scored successfully',
            'score': ai_score
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to score resume', 'error': str(e)}), 500

@resumes_bp.route('', methods=['POST'])
@token_required
def create_resume(current_user_id):
    try:
        data = request.get_json()
        if not data.get('job_role'):
            return jsonify({'message': 'Job role is required'}), 400
        
        resume_doc = Resume.create(
            user_id=current_user_id,
            job_role=data['job_role'],
            summary=data.get('summary', ''),
            skills=data.get('skills', []),
            projects=data.get('projects', []),
            experience=data.get('experience', []),
            education=data.get('education', [])
        )
        
        result = resumes_collection.insert_one(resume_doc)
        resume = resumes_collection.find_one({'_id': result.inserted_id})
        
        return jsonify({'message': 'Resume created', 'resume': serialize_doc(resume)}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create resume', 'error': str(e)}), 500

@resumes_bp.route('/<resume_id>', methods=['GET'])
@token_required
def get_resume(current_user_id, resume_id):
    try:
        if not validate_object_id(resume_id):
            return jsonify({'message': 'Invalid resume ID'}), 400
        
        resume = resumes_collection.find_one({
            '_id': ObjectId(resume_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not resume:
            return jsonify({'message': 'Resume not found'}), 404
        
        return jsonify({'resume': serialize_doc(resume)}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get resume', 'error': str(e)}), 500

@resumes_bp.route('/<resume_id>', methods=['DELETE'])
@token_required
def delete_resume(current_user_id, resume_id):
    try:
        if not validate_object_id(resume_id):
            return jsonify({'message': 'Invalid resume ID'}), 400
        
        resume = resumes_collection.find_one({
            '_id': ObjectId(resume_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not resume:
            return jsonify({'message': 'Resume not found'}), 404
        
        # Delete file from GridFS if exists
        if 'file_id' in resume:
            try:
                fs.delete(resume['file_id'])
            except:
                pass
        
        # Delete resume document
        resumes_collection.delete_one({'_id': ObjectId(resume_id)})
        
        return jsonify({'message': 'Resume deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete resume', 'error': str(e)}), 500

@resumes_bp.route('/<resume_id>/improve', methods=['POST'])
@token_required
def improve_resume(current_user_id, resume_id):
    try:
        if not validate_object_id(resume_id):
            return jsonify({'message': 'Invalid resume ID'}), 400
        
        resume = resumes_collection.find_one({
            '_id': ObjectId(resume_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not resume:
            return jsonify({'message': 'Resume not found'}), 404
        
        suggestions = gemini_service.improve_resume(resume, resume['job_role'])
        
        return jsonify({'message': 'Suggestions generated', 'suggestions': suggestions}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to improve resume', 'error': str(e)}), 500
