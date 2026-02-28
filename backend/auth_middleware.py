from functools import wraps
from flask import request, jsonify
from database import SessionLocal
from models import SessionToken, User
from datetime import datetime

def require_auth(f):
    """Decorator to require authentication for endpoints"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        db = SessionLocal()
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({'error': 'No token provided'}), 401

            token = auth_header.split(' ')[1]

            # Find valid session
            session = db.query(SessionToken).filter(
                SessionToken.token == token,
                SessionToken.expires_at > datetime.utcnow()
            ).first()

            if not session:
                return jsonify({'error': 'Invalid or expired token'}), 401

            # Get user
            user = db.query(User).filter(User.id == session.user_id).first()
            if not user:
                return jsonify({'error': 'User not found'}), 404

            # Pass user to the endpoint function
            return f(user, *args, **kwargs)

        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            db.close()

    return decorated_function
