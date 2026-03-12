import bcrypt
from utils.db import users_collection
from models.user import User
import sys
import os

# Add the current directory to sys.path so we can import local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def seed_specific_user(email, password, name):
    try:
        # Check if user already exists
        email = email.lower()
        existing_user = users_collection.find_one({'email': email})
        
        if existing_user:
            print(f"User with email {email} already exists. Updating password...")
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
            users_collection.update_one(
                {'_id': existing_user['_id']},
                {'$set': {'password': password_hash}}
            )
            print("Password updated successfully.")
            return

        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        
        # Create user document
        user_doc = User.create(email, password_hash, name)
        
        # Insert into database
        result = users_collection.insert_one(user_doc)
        print(f"User created successfully with ID: {result.inserted_id}")
        print(f"Login ID: {email}")
        print(f"Password: {password}")

    except Exception as e:
        print(f"Error seeding user: {str(e)}")

if __name__ == "__main__":
    EMAIL = "rahulrathore39769@gmail.com"
    PASSWORD = "rathore@1"
    NAME = "Rahul Rathore"
    
    seed_specific_user(EMAIL, PASSWORD, NAME)
