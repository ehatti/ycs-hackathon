from flask import Blueprint, request, jsonify
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from database import SessionLocal
from models import Listing, User, Bid
from auth_middleware import require_auth
from endpoints.auth import derive_name_from_email
from minimax import generate_virtual_tryon, create_category_prompt
import os

listings_bp = Blueprint('listings', __name__)

# Valid categories
VALID_CATEGORIES = [
    "Clothing",
    "Accessories",
    "Furniture & Decor",
    "Class Materials",
    "Event Tickets"
]

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        pass

def serialize_listing(listing, db, include_bids=False):
    """Serialize a listing with computed fields"""
    # Get highest bid
    highest_bid = db.query(func.max(Bid.amount)).filter(Bid.listing_id == listing.id).scalar()

    # Get seller info
    seller = db.query(User).filter(User.id == listing.seller_id).first()

    result = {
        'id': listing.id,
        'title': listing.title,
        'description': listing.description,
        'category': listing.category,
        'image_url': listing.image_url,
        'created_at': listing.created_at.isoformat() if listing.created_at else None,
        'seller': {
            'id': seller.id,
            'email': seller.email,
            'name': derive_name_from_email(seller.email)
        } if seller else None,
        'highest_bid': highest_bid
    }

    if include_bids:
        bids = db.query(Bid).filter(Bid.listing_id == listing.id).order_by(Bid.created_at.desc()).all()
        result['bids'] = [{
            'id': bid.id,
            'amount': bid.amount,
            'created_at': bid.created_at.isoformat(),
            'user_id': bid.user_id
        } for bid in bids]

    return result

@listings_bp.route('', methods=['GET'])
def get_listings():
    """Get all listings with optional search and category filters"""
    db = get_db()
    try:
        search = request.args.get('search', '')
        category = request.args.get('category', '')

        query = db.query(Listing)

        # Apply category filter if provided
        if category:
            query = query.filter(Listing.category == category)

        # Apply search filter if provided
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                or_(
                    Listing.title.ilike(search_filter),
                    Listing.description.ilike(search_filter)
                )
            )

        listings = query.order_by(Listing.created_at.desc()).all()

        return jsonify([serialize_listing(listing, db) for listing in listings]), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@listings_bp.route('/<int:listing_id>', methods=['GET'])
def get_listing(listing_id):
    """Get a single listing by ID"""
    db = get_db()
    try:
        listing = db.query(Listing).filter(Listing.id == listing_id).first()

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        return jsonify(serialize_listing(listing, db, include_bids=True)), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@listings_bp.route('', methods=['POST'])
@require_auth
def create_listing(current_user):
    """Create a new listing (requires auth)"""
    db = get_db()
    try:
        data = request.json
        title = data.get('title')
        description = data.get('description')
        category = data.get('category')
        image_url = data.get('image_url')

        if not title or not description:
            return jsonify({'error': 'Title and description required'}), 400

        if not category:
            return jsonify({'error': 'Category required'}), 400

        if category not in VALID_CATEGORIES:
            return jsonify({'error': f'Invalid category. Must be one of: {", ".join(VALID_CATEGORIES)}'}), 400

        listing = Listing(
            seller_id=current_user.id,
            title=title,
            description=description,
            category=category,
            image_url=image_url
        )

        db.add(listing)
        db.commit()
        db.refresh(listing)

        return jsonify(serialize_listing(listing, db)), 201

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@listings_bp.route('/<int:listing_id>', methods=['PUT'])
@require_auth
def update_listing(current_user, listing_id):
    """Update a listing (requires auth and ownership)"""
    db = get_db()
    try:
        listing = db.query(Listing).filter(Listing.id == listing_id).first()

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        if listing.seller_id != current_user.id:
            return jsonify({'error': 'Not authorized to edit this listing'}), 403

        data = request.json

        if 'title' in data:
            listing.title = data['title']
        if 'description' in data:
            listing.description = data['description']
        if 'category' in data:
            if data['category'] not in VALID_CATEGORIES:
                return jsonify({'error': f'Invalid category. Must be one of: {", ".join(VALID_CATEGORIES)}'}), 400
            listing.category = data['category']
        if 'image_url' in data:
            listing.image_url = data['image_url']

        db.commit()
        db.refresh(listing)

        return jsonify(serialize_listing(listing, db)), 200

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()

@listings_bp.route('/<int:listing_id>', methods=['DELETE'])
@require_auth
def delete_listing(current_user, listing_id):
    """Delete a listing (requires auth and ownership)"""
    db = get_db()
    try:
        listing = db.query(Listing).filter(Listing.id == listing_id).first()

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        if listing.seller_id != current_user.id:
            return jsonify({'error': 'Not authorized to delete this listing'}), 403

        db.delete(listing)
        db.commit()

        return jsonify({'message': 'Listing deleted successfully'}), 200

    except Exception as e:
        db.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()


# Categories that support virtual try-on
TRYON_SUPPORTED_CATEGORIES = ["Clothing", "Furniture & Decor"]


@listings_bp.route('/<int:listing_id>/virtual-tryon', methods=['POST'])
def virtual_tryon(listing_id):
    """
    Generate a virtual try-on image for a listing.
    Accepts a reference image upload and returns a generated image.
    """
    db = get_db()
    try:
        # Get the listing
        listing = db.query(Listing).filter(Listing.id == listing_id).first()

        if not listing:
            return jsonify({'error': 'Listing not found'}), 404

        # Check if category supports virtual try-on
        if listing.category not in TRYON_SUPPORTED_CATEGORIES:
            return jsonify({
                'error': f'Virtual try-on not supported for {listing.category}. Only available for: {", ".join(TRYON_SUPPORTED_CATEGORIES)}'
            }), 400

        # Check if listing has an image
        if not listing.image_url:
            return jsonify({'error': 'Listing must have an image for virtual try-on'}), 400

        # Check if user uploaded a reference image
        if 'reference_image' not in request.files:
            return jsonify({'error': 'Reference image is required'}), 400

        reference_file = request.files['reference_image']

        if reference_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        # Save the reference image temporarily
        from werkzeug.utils import secure_filename
        import time

        filename = secure_filename(reference_file.filename)
        timestamp = int(time.time())
        unique_filename = f"{filename.rsplit('.', 1)[0]}_{timestamp}.{filename.rsplit('.', 1)[1]}"

        # Ensure upload directory exists
        upload_dir = os.path.join(os.path.dirname(__file__), '..', 'static', 'uploads')
        os.makedirs(upload_dir, exist_ok=True)

        reference_path = os.path.join(upload_dir, unique_filename)
        reference_file.save(reference_path)

        # Create public URL for the reference image (Minimax needs to access it)
        # Assuming the backend is running on localhost:8000
        base_url = request.host_url.rstrip('/')
        reference_url = f"{base_url}/static/uploads/{unique_filename}"

        # Create the prompt based on category
        prompt = create_category_prompt(listing.category, listing.description)

        # Generate the virtual try-on image
        result = generate_virtual_tryon(
            prompt=prompt,
            subject_image_url=reference_url,
            aspect_ratio="1:1"
        )

        # Clean up the temporary reference image
        try:
            os.remove(reference_path)
        except:
            pass  # Ignore cleanup errors

        if result['success']:
            return jsonify({
                'success': True,
                'image_base64': result['image_base64']
            }), 200
        else:
            return jsonify({
                'success': False,
                'error': result['error']
            }), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        db.close()
