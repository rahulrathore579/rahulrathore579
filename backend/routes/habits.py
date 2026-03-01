from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime, date

from utils.db import habits_collection, habit_logs_collection
from utils.helpers import serialize_doc, validate_object_id
from models.habit import Habit, HabitLog
from middleware.auth_middleware import token_required

habits_bp = Blueprint('habits', __name__)

@habits_bp.route('', methods=['GET'])
@token_required
def get_habits(current_user_id):
    """Get all habits for the current user"""
    try:
        habits = list(habits_collection.find({'user_id': ObjectId(current_user_id)}).sort('created_at', -1))
        habits_data = serialize_doc(habits)
        
        # Get today's logs for each habit
        today = date.today().isoformat()
        for habit in habits_data:
            log = habit_logs_collection.find_one({
                'habit_id': ObjectId(habit['id']),
                'date': today
            })
            habit['completed_today'] = log['completed'] if log else False
        
        return jsonify({'habits': habits_data}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get habits', 'error': str(e)}), 500

@habits_bp.route('', methods=['POST'])
@token_required
def create_habit(current_user_id):
    """Create a new habit"""
    try:
        data = request.get_json()
        if not data.get('title'):
            return jsonify({'message': 'Title is required'}), 400
        
        habit_doc = Habit.create(
            user_id=current_user_id,
            title=data['title'],
            description=data.get('description', ''),
            color=data.get('color', '#3b82f6')
        )
        
        result = habits_collection.insert_one(habit_doc)
        habit = habits_collection.find_one({'_id': result.inserted_id})
        habit_data = serialize_doc(habit)
        habit_data['completed_today'] = False
        
        return jsonify({'message': 'Habit created', 'habit': habit_data}), 201
    except Exception as e:
        return jsonify({'message': 'Failed to create habit', 'error': str(e)}), 500

@habits_bp.route('/<habit_id>', methods=['DELETE'])
@token_required
def delete_habit(current_user_id, habit_id):
    """Delete a habit and all its logs"""
    try:
        if not validate_object_id(habit_id):
            return jsonify({'message': 'Invalid habit ID'}), 400
        
        # Delete the habit
        result = habits_collection.delete_one({
            '_id': ObjectId(habit_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if result.deleted_count == 0:
            return jsonify({'message': 'Habit not found'}), 404
        
        # Delete all logs for this habit
        habit_logs_collection.delete_many({'habit_id': ObjectId(habit_id)})
        
        return jsonify({'message': 'Habit deleted'}), 200
    except Exception as e:
        return jsonify({'message': 'Failed to delete habit', 'error': str(e)}), 500

@habits_bp.route('/<habit_id>/toggle', methods=['POST'])
@token_required
def toggle_habit(current_user_id, habit_id):
    """Toggle habit completion for a specific date (default: today)"""
    try:
        if not validate_object_id(habit_id):
            return jsonify({'message': 'Invalid habit ID'}), 400
        
        # Verify habit belongs to user
        habit = habits_collection.find_one({
            '_id': ObjectId(habit_id),
            'user_id': ObjectId(current_user_id)
        })
        
        if not habit:
            return jsonify({'message': 'Habit not found'}), 404
        
        data = request.get_json() or {}
        target_date = data.get('date', date.today().isoformat())
        
        # Find existing log
        existing_log = habit_logs_collection.find_one({
            'habit_id': ObjectId(habit_id),
            'date': target_date
        })
        
        if existing_log:
            # Toggle the completion status
            new_status = not existing_log['completed']
            habit_logs_collection.update_one(
                {'_id': existing_log['_id']},
                {'$set': HabitLog.toggle(new_status)}
            )
            completed = new_status
        else:
            # Create new log entry
            log_doc = HabitLog.create(
                habit_id=habit_id,
                user_id=current_user_id,
                date=target_date,
                completed=True
            )
            habit_logs_collection.insert_one(log_doc)
            completed = True
        
        return jsonify({
            'message': 'Habit toggled',
            'completed': completed,
            'date': target_date
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to toggle habit', 'error': str(e)}), 500

@habits_bp.route('/stats', methods=['GET'])
@token_required
def get_habit_stats(current_user_id):
    """Get monthly statistics for all habits"""
    try:
        # Get month and year from query params (default: current month)
        month = request.args.get('month', date.today().month)
        year = request.args.get('year', date.today().year)
        
        # Calculate date range for the month
        from calendar import monthrange
        days_in_month = monthrange(int(year), int(month))[1]
        
        # Get all habits
        habits = list(habits_collection.find({'user_id': ObjectId(current_user_id)}))
        
        # Get all logs for this month
        start_date = f"{year}-{str(month).zfill(2)}-01"
        end_date = f"{year}-{str(month).zfill(2)}-{str(days_in_month).zfill(2)}"
        
        logs = list(habit_logs_collection.find({
            'user_id': ObjectId(current_user_id),
            'date': {'$gte': start_date, '$lte': end_date}
        }))
        
        # Calculate daily completion rates
        daily_stats = []
        for day in range(1, days_in_month + 1):
            day_str = f"{year}-{str(month).zfill(2)}-{str(day).zfill(2)}"
            completed_count = sum(1 for log in logs if log['date'] == day_str and log['completed'])
            total_habits = len(habits)
            completion_rate = (completed_count / total_habits * 100) if total_habits > 0 else 0
            
            daily_stats.append({
                'date': day_str,
                'day': day,
                'completed': completed_count,
                'total': total_habits,
                'percentage': round(completion_rate, 1)
            })
        
        # Calculate per-habit stats
        habit_stats = []
        for habit in habits:
            habit_logs = [log for log in logs if log['habit_id'] == habit['_id']]
            completed_days = sum(1 for log in habit_logs if log['completed'])
            
            habit_stats.append({
                'id': str(habit['_id']),
                'title': habit['title'],
                'color': habit.get('color', '#3b82f6'),
                'completed_days': completed_days,
                'total_days': days_in_month,
                'percentage': round((completed_days / days_in_month * 100), 1)
            })
        
        return jsonify({
            'daily_stats': daily_stats,
            'habit_stats': habit_stats,
            'month': int(month),
            'year': int(year)
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get stats', 'error': str(e)}), 500

@habits_bp.route('/calendar', methods=['GET'])
@token_required
def get_calendar_data(current_user_id):
    """Get calendar view data for a specific month"""
    try:
        month = request.args.get('month', date.today().month)
        year = request.args.get('year', date.today().year)
        
        from calendar import monthrange
        days_in_month = monthrange(int(year), int(month))[1]
        
        start_date = f"{year}-{str(month).zfill(2)}-01"
        end_date = f"{year}-{str(month).zfill(2)}-{str(days_in_month).zfill(2)}"
        
        # Get all habits
        habits = list(habits_collection.find({'user_id': ObjectId(current_user_id)}))
        
        # Get all logs for this month
        logs = list(habit_logs_collection.find({
            'user_id': ObjectId(current_user_id),
            'date': {'$gte': start_date, '$lte': end_date}
        }))
        
        # Build calendar data
        calendar_data = []
        for day in range(1, days_in_month + 1):
            day_str = f"{year}-{str(month).zfill(2)}-{str(day).zfill(2)}"
            day_logs = [log for log in logs if log['date'] == day_str]
            
            habit_completions = []
            for habit in habits:
                log = next((l for l in day_logs if l['habit_id'] == habit['_id']), None)
                habit_completions.append({
                    'habit_id': str(habit['_id']),
                    'title': habit['title'],
                    'completed': log['completed'] if log else False
                })
            
            calendar_data.append({
                'date': day_str,
                'day': day,
                'habits': habit_completions
            })
        
        return jsonify({
            'calendar': calendar_data,
            'month': int(month),
            'year': int(year)
        }), 200
    except Exception as e:
        return jsonify({'message': 'Failed to get calendar data', 'error': str(e)}), 500
