from functools import wraps
from flask import request, jsonify
import jwt
from config import Config

def token_required(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token is missing', 'error': 'unauthorized'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token.split(' ')[1]
            
            # Decode JWT token
            data = jwt.decode(token, Config.JWT_SECRET, algorithms=['HS256'])
            current_user_id = data['user_id']
            
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired', 'error': 'token_expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token is invalid', 'error': 'invalid_token'}), 401
        except Exception as e:
            return jsonify({'message': 'Authentication failed', 'error': str(e)}), 401
        
        # Pass user_id to the route function
        return f(current_user_id, *args, **kwargs)
    
    return decorated
