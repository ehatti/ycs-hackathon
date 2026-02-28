from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User, SessionToken
from passlib.hash import bcrypt
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

def derive_name_from_email(email):
    """Derive display name from email (e.g., first.last@yale.edu -> First Last)"""
    try:
        username = email.split('@')[0]
        parts = username.split('.')
        name = ' '.join(part.capitalize() for part in parts)
        return name
    except:
        return email.split('@')[0]

@auth_bp.route('/signup', methods=['POST'])
def signup():
    db = get_db()
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        # Check if user exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            return jsonify({'error': 'User already exists'}), 400

        # Create user
        password_hash = bcrypt.hash(password)
        user = User(email=email, password_hash=password_hash)
        db.add(user)
        db.commit()
        db.refresh(user)

        # Create session token
        token = SessionToken.generate_token()
        session = SessionToken(
            token=token,
            user_id=user.id,
            expires_at=SessionToken.get_expiry_time()
        )
        db.add(session)
        db.commit()

        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': derive_name_from_email(user.email)
            }
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@auth_bp.route('/login', methods=['POST'])
def login():
    db = get_db()
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password required'}), 400

        # Find user
        user = db.query(User).filter(User.email == email).first()
        if not user or not bcrypt.verify(password, user.password_hash):
            return jsonify({'error': 'Invalid credentials'}), 401

        # Create session token
        token = SessionToken.generate_token()
        session = SessionToken(
            token=token,
            user_id=user.id,
            expires_at=SessionToken.get_expiry_time()
        )
        db.add(session)
        db.commit()

        return jsonify({
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': derive_name_from_email(user.email)
            }
        }), 200

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@auth_bp.route('/logout', methods=['POST'])
def logout():
    db = get_db()
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401

        token = auth_header.split(' ')[1]

        # Delete session token
        session = db.query(SessionToken).filter(SessionToken.token == token).first()
        if session:
            db.delete(session)
            db.commit()

        return jsonify({'message': 'Logged out successfully'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    db = get_db()
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401

        token = auth_header.split(' ')[1]

        # Find session
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

        return jsonify({
            'id': user.id,
            'email': user.email,
            'name': derive_name_from_email(user.email)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
