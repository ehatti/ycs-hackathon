from flask import Blueprint, jsonify
from database import SessionLocal
from models import User, Listing
from auth_middleware import require_auth
from endpoints.products import serialize_listing

users_bp = Blueprint('users', __name__)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

@users_bp.route('/me/listings', methods=['GET'])
@require_auth
def get_my_listings(current_user):
    """Get current user's listings (requires auth)"""
    db = get_db()
    try:
        listings = db.query(Listing).filter(Listing.seller_id == current_user.id).order_by(Listing.created_at.desc()).all()

        return jsonify([serialize_listing(listing, db) for listing in listings]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
