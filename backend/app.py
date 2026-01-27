from flask import Flask, jsonify
from flask_cors import CORS
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "PATCH"],
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

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
app.register_blueprint(notes_bp, url_prefix='/api/notes')
app.register_blueprint(resumes_bp, url_prefix='/api/resumes')
app.register_blueprint(assistant_bp, url_prefix='/api/assistant')
app.register_blueprint(applications_bp, url_prefix='/api/applications')
app.register_blueprint(interview_bp, url_prefix='/api/interview')

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
