import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
from database import init_db
from endpoints.auth import auth_bp
from endpoints.products import listings_bp
from endpoints.bids import bids_bp
from endpoints.users import users_bp

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(listings_bp, url_prefix='/api/listings')
app.register_blueprint(bids_bp, url_prefix='/api')
app.register_blueprint(users_bp, url_prefix='/api/users')

# Serve static files
@app.route('/static/uploads/<path:filename>')
def serve_upload(filename):
    from flask import send_from_directory
    return send_from_directory(UPLOAD_FOLDER, filename)

# Image upload endpoint
@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Add timestamp to make filename unique
            import time
            timestamp = str(int(time.time()))
            name, ext = os.path.splitext(filename)
            unique_filename = f"{name}_{timestamp}{ext}"

            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(filepath)

            # Return URL to access the image
            image_url = f"/static/uploads/{unique_filename}"
            return jsonify({'image_url': image_url}), 200

        return jsonify({'error': 'Invalid file type'}), 400

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok'}), 200

# Initialize database on startup
@app.before_request
def before_first_request():
    if not hasattr(app, 'db_initialized'):
        init_db()
        app.db_initialized = True

if __name__ == '__main__':
    # Initialize database tables
    init_db()
    # Run the app
    app.run(host='0.0.0.0', port=8000, debug=True)
