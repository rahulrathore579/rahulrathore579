from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
import os

app = Flask(__name__)
app.config.from_object(Config)

# Read allowed origins from env (comma-separated), fallback to wildcard for dev
allowed_origins_str = os.getenv('ALLOWED_ORIGINS', '*')
allowed_origins = [o.strip() for o in allowed_origins_str.split(',')] if allowed_origins_str != '*' else '*'

CORS(app, resources={
    r"/api/*": {
        "origins": allowed_origins,
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Import and register blueprints
from routes.auth import auth_bp
from routes.tasks import tasks_bp
from routes.notes import notes_bp
from routes.resumes import resumes_bp
from routes.assistant import assistant_bp
from routes.applications import applications_bp
from routes.interview import interview_bp
from routes.habits import habits_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(notes_bp, url_prefix='/api/notes')
app.register_blueprint(resumes_bp, url_prefix='/api/resumes')
app.register_blueprint(assistant_bp, url_prefix='/api/assistant')
app.register_blueprint(applications_bp, url_prefix='/api/applications')
app.register_blueprint(interview_bp, url_prefix='/api/interview')
app.register_blueprint(habits_bp, url_prefix='/api/habits')

def seed_initial_user():
    try:
        import bcrypt
        from utils.db import users_collection
        from models.user import User
        
        email = "rahulrathore39769@gmail.com".lower()
        password = "rathore@1"
        name = "Rahul Rathore"
        
        existing_user = users_collection.find_one({'email': email})
        if existing_user:
            print(f"Seed: User {email} already exists. Ensuring password is up to date...")
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            users_collection.update_one(
                {'_id': existing_user['_id']},
                {'$set': {'password': password_hash}}
            )
            return

        print(f"Seed: Creating initial user {email}...")
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_doc = User.create(email, password_hash, name)
        users_collection.insert_one(user_doc)
        print(f"Seed: User created successfully.")
    except Exception as e:
        print(f"Error seeding user: {str(e)}")

# Execute seeding on startup
seed_initial_user()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Personal Assistant API is running'}), 200

@app.route('/', methods=['GET'])
def root():
    return jsonify({'message': 'Personal Assistant API', 'version': '1.0.0'}), 200


if __name__ == '__main__':
    print("Starting Personal Assistant API...")
    print(f"Server running on http://localhost:{Config.PORT}")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
