import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const styles = `
  .create-listing-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 108px 20px 40px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .create-listing-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: #00356B;
    margin-bottom: 32px;
  }

  .create-form {
    background: white;
    padding: 32px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .form-group {
    margin-bottom: 24px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .form-input, .form-textarea, .form-select {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-sizing: border-box;
  }

  .form-input:focus, .form-textarea:focus, .form-select:focus {
    outline: none;
    border-color: #00356B;
  }

  .form-textarea {
    min-height: 120px;
    resize: vertical;
  }

  .image-upload-area {
    border-radius: 8px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
  }

  .image-upload-area:hover {
  }

  .image-upload-area.has-image {
  }

  .upload-icon {
    font-size: 48px;
    color: #ccc;
    margin-bottom: 16px;
  }

  .upload-text {
    color: #666;
    font-size: 14px;
  }

  .image-preview {
    max-width: 100%;
    max-height: 300px;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .change-image-btn {
    padding: 8px 16px;
    background: #666;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
  }

  .change-image-btn:hover {
    background: #555;
  }

  .file-input {
    display: none;
  }

  .submit-button {
    width: 100%;
    padding: 14px;
    background: #00356B;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 8px;
  }

  .submit-button:hover {
    background: #002347;
  }

  .submit-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .success-message {
    background: #e8f5e9;
    color: #2e7d32;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 14px;
  }
`;

const CATEGORIES = [
  "Clothing",
  "Accessories",
  "Furniture & Decor",
  "Class Materials",
  "Event Tickets"
];

export default function CreateListing() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('session_token='))
        ?.split('=')[1];

      if (!token) {
        setError('Please log in to create a listing');
        navigate('/login');
        return;
      }

      let imageUrl = '';

      // Upload image if provided
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadResponse = await fetch('http://localhost:8000/api/upload-image', {
          method: 'POST',
          body: formData
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.image_url;
      }

      // Create listing
      const response = await fetch('http://localhost:8000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          category,
          image_url: imageUrl
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create listing');
      }

      // Redirect to profile
      navigate('/profile');

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="create-listing-container">
        <h1 className="create-listing-title">Create a Listing</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Vintage Yale T-Shirt"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item in detail..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category *</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Photo (optional)</label>
            <input
              type="file"
              id="image-upload"
              className="file-input"
              accept="image/*"
              onChange={handleImageChange}
            />
            {!imagePreview ? (
              <label htmlFor="image-upload" className="image-upload-area">
                <div className="upload-icon">📷</div>
                <div className="upload-text">Click to upload a photo</div>
              </label>
            ) : (
              <div className="image-upload-area has-image">
                <img src={imagePreview} alt="Preview" className="image-preview" />
                <label htmlFor="image-upload">
                  <button
                    type="button"
                    className="change-image-btn"
                    onClick={() => document.getElementById('image-upload').click()}
                  >
                    Change Photo
                  </button>
                </label>
              </div>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </>
  );
}
