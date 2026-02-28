import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const styles = `
  .marketplace-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 108px 20px 40px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .marketplace-header {
    margin-bottom: 32px;
  }

  .marketplace-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    color: #00356B;
    margin-bottom: 16px;
  }

  .search-bar {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
  }

  .search-input {
    flex: 1;
    padding: 12px 16px;
    font-size: 16px;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .search-input:focus {
    outline: none;
    border-color: #00356B;
  }

  .search-button {
    padding: 12px 24px;
    background: #00356B;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
  }

  .search-button:hover {
    background: #002347;
  }

  .category-filters {
    display: flex;
    gap: 12px;
    margin-bottom: 32px;
    flex-wrap: wrap;
  }

  .category-button {
    padding: 10px 20px;
    background: white;
    color: #00356B;
    border: 2px solid #e0e0e0;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }

  .category-button:hover {
    border-color: #00356B;
  }

  .category-button.active {
    background: #00356B;
    color: white;
    border-color: #00356B;
  }

  .listings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
  }

  .listing-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    overflow: hidden;
    transition: transform 0.2s;
    cursor: pointer;
  }

  .listing-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }

  .listing-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: #f0f0f0;
  }

  .no-image-placeholder {
    width: 100%;
    height: 200px;
    background: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 14px;
  }

  .listing-info {
    padding: 16px;
  }

  .listing-title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
  }

  .listing-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .listing-bid {
    font-size: 14px;
    color: #d6ae6b;
    font-weight: 600;
  }

  .listing-seller {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }

  .no-listings {
    text-align: center;
    padding: 60px 20px;
    color: #666;
  }

  .loading {
    text-align: center;
    padding: 60px 20px;
    font-size: 18px;
    color: #666;
  }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 16px;
    border-radius: 4px;
    margin-bottom: 20px;
  }
`;

const CATEGORIES = [
  "Clothing",
  "Accessories",
  "Furniture & Decor",
  "Class Materials",
  "Event Tickets"
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('tab') || '');

  useEffect(() => {
    // Parse category from URL on mount
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setSelectedCategory(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchListings();
  }, [selectedCategory]);

  const fetchListings = async (search = '') => {
    try {
      setLoading(true);
      let url = 'http://localhost:8000/api/listings?';

      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      url += params.toString();

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }

      const data = await response.json();
      setListings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchListings(searchTerm);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchTerm('');
    // Update URL
    if (category) {
      setSearchParams({ tab: category });
    } else {
      setSearchParams({});
    }
  };

  const handleCardClick = (listingId) => {
    navigate(`/listing/${listingId}`);
  };

  if (loading && listings.length === 0) {
    return (
      <>
        <Navbar />
        <style>{styles}</style>
        <div className="loading">Loading listings...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <style>{styles}</style>
      <div className="marketplace-container">
        <div className="marketplace-header">
          <h1 className="marketplace-title">Marketplace</h1>

          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-button">
              Search
            </button>
          </form>

          <div className="category-filters">
            <button
              className={`category-button ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryClick('')}
            >
              All
            </button>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {listings.length === 0 ? (
          <div className="no-listings">
            <p>No listings found.</p>
          </div>
        ) : (
          <div className="listings-grid">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="listing-card"
                onClick={() => handleCardClick(listing.id)}
              >
                {listing.image_url ? (
                  <img
                    src={`http://localhost:8000${listing.image_url}`}
                    alt={listing.title}
                    className="listing-image"
                  />
                ) : (
                  <div className="no-image-placeholder">No Image</div>
                )}

                <div className="listing-info">
                  <h3 className="listing-title">{listing.title}</h3>
                  <p className="listing-description">{listing.description}</p>

                  {listing.highest_bid ? (
                    <div className="listing-bid">
                      Current Bid: ${listing.highest_bid.toFixed(2)}
                    </div>
                  ) : (
                    <div className="listing-bid">No bids yet</div>
                  )}

                  {listing.seller && (
                    <div className="listing-seller">
                      Seller: {listing.seller.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
