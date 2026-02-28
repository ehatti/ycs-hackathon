from flask import Blueprint, request, jsonify
from sqlalchemy import func
from database import SessionLocal
from models import Bid, Listing
from auth_middleware import require_auth

bids_bp = Blueprint('bids', __name__)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

@bids_bp.route('/listings/<int:listing_id>/bids', methods=['POST'])
@require_auth
def place_bid(current_user, listing_id):
    """Place a bid on a listing (requires auth)"""
    db = get_db()
    try:
        # Check if listing exists
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        # Can't bid on own listing
        if listing.seller_id == current_user.id:
            return jsonify({'error': 'Cannot bid on your own listing'}), 400

        data = request.json
        amount = data.get('amount')

        if not amount or amount <= 0:
            return jsonify({'error': 'Valid bid amount required'}), 400

        # Get current highest bid
        highest_bid = db.query(func.max(Bid.amount)).filter(Bid.listing_id == listing_id).scalar()

        if highest_bid and amount <= highest_bid:
            return jsonify({'error': f'Bid must be higher than current highest bid of ${highest_bid}'}), 400

        # Create bid
        bid = Bid(
            listing_id=listing_id,
            user_id=current_user.id,
            amount=amount
        )

        db.add(bid)
        db.commit()
        db.refresh(bid)

        return jsonify({
            'id': bid.id,
            'listing_id': bid.listing_id,
            'user_id': bid.user_id,
            'amount': bid.amount,
            'created_at': bid.created_at.isoformat()
        }), 201

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@bids_bp.route('/listings/<int:listing_id>/bids', methods=['GET'])
def get_bids(listing_id):
    """Get all bids for a listing"""
    db = get_db()
    try:
        # Check if listing exists
        listing = db.query(Listing).filter(Listing.id == listing_id).first()
        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        # Get all bids ordered by amount (highest first)
        bids = db.query(Bid).filter(Bid.listing_id == listing_id).order_by(Bid.amount.desc()).all()

        return jsonify([{
            'id': bid.id,
            'listing_id': bid.listing_id,
            'user_id': bid.user_id,
            'amount': bid.amount,
            'created_at': bid.created_at.isoformat()
        } for bid in bids]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
