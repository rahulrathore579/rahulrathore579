from flask import Blueprint, request, jsonify
import bcrypt
import jwt
from datetime import datetime, timedelta
from bson import ObjectId

from config import Config
from utils.db import users_collection
from utils.helpers import serialize_doc
from models.user import User
from middleware.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Register a new user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password') or not data.get('name'):
            return jsonify({'message': 'Email, password, and name are required'}), 400
        
        email = data['email'].lower()
        password = data['password']
        name = data['name']
        
        # Check if user already exists
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            return jsonify({'message': 'User already exists with this email'}), 409
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user
        user_doc = User.create(email, password_hash, name)
        result = users_collection.insert_one(user_doc)
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(result.inserted_id),
            'exp': datetime.utcnow() + timedelta(days=7)
        }, Config.JWT_SECRET, algorithm='HS256')
        
        # Get created user
        user = users_collection.find_one({'_id': result.inserted_id})
        user_data = serialize_doc(user)
        del user_data['password']  # Don't send password hash
        
        return jsonify({
            'message': 'User created successfully',
            'token': token,
            'user': user_data
        }), 201
        
    except Exception as e:
        return jsonify({'message': 'Signup failed', 'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'message': 'Email and password are required'}), 400
        
        email = data['email'].lower()
        password = data['password']
        
        # Find user
        user = users_collection.find_one({'email': email})
        if not user:
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Verify password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Generate JWT token
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.utcnow() + timedelta(days=7)
        }, Config.JWT_SECRET, algorithm='HS256')
        
        # Prepare user data
        user_data = serialize_doc(user)
        del user_data['password']  # Don't send password hash
        
        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user_data
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Login failed', 'error': str(e)}), 500


@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user(current_user_id):
    """Get current authenticated user"""
    try:
        user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user_data = serialize_doc(user)
        del user_data['password']
        
        return jsonify({'user': user_data}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get user', 'error': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
@token_required
def refresh_token(current_user_id):
    """Refresh JWT token"""
    try:
        # Generate new token
        token = jwt.encode({
            'user_id': current_user_id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, Config.JWT_SECRET, algorithm='HS256')
        
        return jsonify({
            'message': 'Token refreshed',
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Token refresh failed', 'error': str(e)}), 500
