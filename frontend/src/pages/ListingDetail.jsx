import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const styles = `
  .listing-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 108px 20px 40px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .back-button {
    background: none;
    border: none;
    color: #00356B;
    font-size: 16px;
    cursor: pointer;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .listing-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 20px;
  }

  .image-section {
    width: 100%;
  }

  .listing-image {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .no-image {
    width: 100%;
    height: 500px;
    background: #f0f0f0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
  }

  .details-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .listing-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: #00356B;
    margin: 0;
  }

  .category-badge {
    display: inline-block;
    padding: 6px 14px;
    background: #f0f0f0;
    color: #00356B;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .listing-description {
    font-size: 16px;
    line-height: 1.6;
    color: #333;
  }

  .seller-info {
    padding: 16px;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .seller-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
  }

  .seller-name {
    font-size: 18px;
    font-weight: 600;
    color: #00356B;
  }

  .bid-section {
    border-top: 1px solid #e0e0e0;
    padding-top: 20px;
  }

  .current-bid {
    margin-bottom: 20px;
  }

  .bid-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 4px;
  }

  .bid-amount {
    font-size: 32px;
    font-weight: 700;
    color: #d6ae6b;
  }

  .no-bids {
    font-size: 16px;
    color: #999;
  }

  .bid-form {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .bid-input {
    flex: 1;
    padding: 12px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
  }

  .bid-button {
    padding: 12px 24px;
    background: #00356B;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .bid-button:hover {
    background: #002347;
  }

  .bid-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .error-message {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 8px;
  }

  .success-message {
    color: #2e7d32;
    font-size: 14px;
    margin-top: 8px;
  }

  .loading {
    text-align: center;
    padding: 60px 20px;
    font-size: 18px;
    color: #666;
  }

  .not-found {
    text-align: center;
    padding: 60px 20px;
  }

  @media (max-width: 768px) {
    .listing-content {
      grid-template-columns: 1fr;
    }
  }

  .tryon-button {
    margin-top: 16px;
    width: 100%;
    padding: 12px 24px;
    background: #d6ae6b;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .tryon-button:hover {
    background: #c49d5a;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 32px;
    border-radius: 12px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .modal-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px;
    color: #00356B;
    margin: 0;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-button:hover {
    color: #000;
  }

  .upload-section {
    margin-bottom: 24px;
  }

  .upload-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }

  .file-input-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .file-input {
    width: 100%;
    padding: 12px;
    border: 2px dashed #d6ae6b;
    border-radius: 4px;
    background: #f9f9f9;
    cursor: pointer;
  }

  .preview-image {
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
    margin-top: 12px;
    border: 1px solid #e0e0e0;
  }

  .generate-button {
    width: 100%;
    padding: 14px;
    background: #00356B;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 16px;
  }

  .generate-button:hover {
    background: #002347;
  }

  .generate-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .result-section {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 2px solid #e0e0e0;
  }

  .result-title {
    font-size: 18px;
    font-weight: 600;
    color: #00356B;
    margin-bottom: 12px;
  }

  .result-image {
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .download-button {
    width: 100%;
    padding: 12px;
    background: #d6ae6b;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 12px;
  }

  .download-button:hover {
    background: #c49d5a;
  }

  .loading-spinner {
    text-align: center;
    padding: 24px;
    color: #666;
  }

  .info-text {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
    line-height: 1.5;
  }
`;

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');

  // Virtual try-on state
  const [showTryonModal, setShowTryonModal] = useState(false);
  const [referenceImage, setReferenceImage] = useState(null);
  const [referencePreview, setReferencePreview] = useState('');
  const [tryonLoading, setTryonLoading] = useState(false);
  const [tryonResult, setTryonResult] = useState('');
  const [tryonError, setTryonError] = useState('');

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/listings/${id}`);
      if (!response.ok) {
        throw new Error('Listing not found');
      }
      const data = await response.json();
      setListing(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError('');
    setBidSuccess('');

    const amount = parseFloat(bidAmount);
    if (!amount || amount <= 0) {
      setBidError('Please enter a valid bid amount');
      return;
    }

    if (listing.highest_bid && amount <= listing.highest_bid) {
      setBidError(`Bid must be higher than current highest bid of $${listing.highest_bid}`);
      return;
    }

    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('session_token='))
        ?.split('=')[1];

      if (!token) {
        setBidError('Please log in to place a bid');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/listings/${id}/bids`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to place bid');
      }

      setBidSuccess('Bid placed successfully!');
      setBidAmount('');
      // Refresh listing to get updated highest bid
      fetchListing();
    } catch (err) {
      setBidError(err.message);
    }
  };

  const handleReferenceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReferenceImage(file);
      setTryonError('');

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTryon = async () => {
    if (!referenceImage) {
      setTryonError('Please upload a reference image');
      return;
    }

    setTryonLoading(true);
    setTryonError('');
    setTryonResult('');

    try {
      const formData = new FormData();
      formData.append('reference_image', referenceImage);

      const response = await fetch(`http://localhost:8000/api/listings/${id}/virtual-tryon`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate virtual try-on');
      }

      if (data.success) {
        setTryonResult(data.image_base64);
      } else {
        throw new Error(data.error || 'Failed to generate image');
      }
    } catch (err) {
      setTryonError(err.message);
    } finally {
      setTryonLoading(false);
    }
  };

  const handleDownloadResult = () => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${tryonResult}`;
    link.download = `virtual-tryon-${listing.title}.png`;
    link.click();
  };

  const handleCloseTryonModal = () => {
    setShowTryonModal(false);
    setReferenceImage(null);
    setReferencePreview('');
    setTryonResult('');
    setTryonError('');
  };

  const isTryonSupported = () => {
    return listing && (listing.category === 'Clothing' || listing.category === 'Furniture & Decor');
  };

  const getTryonButtonText = () => {
    if (listing?.category === 'Clothing') {
      return 'Try It On';
    } else if (listing?.category === 'Furniture & Decor') {
      return 'Visualize in Your Space';
    }
    return 'Virtual Try-On';
  };

  const getTryonInfoText = () => {
    if (listing?.category === 'Clothing') {
      return 'Upload a photo of yourself to see how this item would look on you.';
    } else if (listing?.category === 'Furniture & Decor') {
      return 'Upload a photo of your room or space to see how this item would look in it.';
    }
    return 'Upload a reference photo to visualize this item.';
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <style>{styles}</style>
        <div className="loading">Loading...</div>
      </>
    );
  }

  if (error || !listing) {
    return (
      <>
        <Navbar />
        <style>{styles}</style>
        <div className="not-found">
          <h2>Listing Not Found</h2>
          <p>{error}</p>
          <button className="back-button" onClick={() => navigate('/marketplace')}>
            ← Back to Marketplace
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="listing-detail-container">
        <button className="back-button" onClick={() => navigate('/marketplace')}>
          ← Back to Marketplace
        </button>

        <div className="listing-content">
          <div className="image-section">
            {listing.image_url ? (
              <img
                src={`http://localhost:8000${listing.image_url}`}
                alt={listing.title}
                className="listing-image"
              />
            ) : (
              <div className="no-image">No Image</div>
            )}

            {isTryonSupported() && listing.image_url && (
              <button
                className="tryon-button"
                onClick={() => setShowTryonModal(true)}
              >
                {getTryonButtonText()}
              </button>
            )}
          </div>

          <div className="details-section">
            <h1 className="listing-title">{listing.title}</h1>
            {listing.category && (
              <div className="category-badge">{listing.category}</div>
            )}
            <p className="listing-description">{listing.description}</p>

            {listing.seller && (
              <div className="seller-info">
                <div className="seller-label">Seller</div>
                <div className="seller-name">{listing.seller.name}</div>
              </div>
            )}

            <div className="bid-section">
              <div className="current-bid">
                <div className="bid-label">Current Highest Bid</div>
                {listing.highest_bid ? (
                  <div className="bid-amount">${listing.highest_bid.toFixed(2)}</div>
                ) : (
                  <div className="no-bids">No bids yet</div>
                )}
              </div>

              <form onSubmit={handlePlaceBid} className="bid-form">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter your bid amount"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="bid-input"
                />
                <button type="submit" className="bid-button">
                  Place Bid
                </button>
              </form>

              {bidError && <div className="error-message">{bidError}</div>}
              {bidSuccess && <div className="success-message">{bidSuccess}</div>}
            </div>
          </div>
        </div>

        {showTryonModal && (
          <div className="modal-overlay" onClick={handleCloseTryonModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2 className="modal-title">{getTryonButtonText()}</h2>
                <button className="close-button" onClick={handleCloseTryonModal}>
                  ×
                </button>
              </div>

              <p className="info-text">{getTryonInfoText()}</p>

              <div className="upload-section">
                <label className="upload-label">
                  {listing.category === 'Clothing' ? 'Your Photo' : 'Your Space Photo'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleReferenceImageChange}
                  className="file-input"
                />
                {referencePreview && (
                  <img
                    src={referencePreview}
                    alt="Reference preview"
                    className="preview-image"
                  />
                )}
              </div>

              <button
                className="generate-button"
                onClick={handleGenerateTryon}
                disabled={!referenceImage || tryonLoading}
              >
                {tryonLoading ? 'Generating...' : 'Generate Virtual Try-On'}
              </button>

              {tryonError && <div className="error-message">{tryonError}</div>}

              {tryonLoading && (
                <div className="loading-spinner">
                  Generating your virtual try-on image... This may take up to 60 seconds.
                </div>
              )}

              {tryonResult && (
                <div className="result-section">
                  <h3 className="result-title">Result</h3>
                  <img
                    src={`data:image/png;base64,${tryonResult}`}
                    alt="Virtual try-on result"
                    className="result-image"
                  />
                  <button className="download-button" onClick={handleDownloadResult}>
                    Download Image
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
