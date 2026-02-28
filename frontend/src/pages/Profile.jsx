import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --yale-blue: #00356B;
    --yale-blue-dark: #002654;
    --yale-blue-mid: #0f4a8a;
    --tan: #d6ae6b;
    --tan-light: #F5EFE6;
    --tan-dark: #A89070;
    --white: #FFFFFF;
    --off-white: #FAFAF8;
    --text-dark: #1a1a1a;
    --text-mid: #4a4a4a;
    --font-display: 'Playfair Display', serif;
    --font-ui: 'Plus Jakarta Sans', sans-serif;
  }

  body { font-family: var(--font-ui); background: var(--off-white); color: var(--text-dark); }

  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 48px; height: 68px;
    background: var(--yale-blue);
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .navbar-logo { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--white); letter-spacing: -0.01em; text-decoration: none; }
  .navbar-logo span { color: var(--tan); }
  .navbar-links { display: flex; align-items: center; gap: 36px; list-style: none; }
  .navbar-links a { font-family: var(--font-ui); font-size: 0.875rem; font-weight: 400; color: rgba(255,255,255,0.75); text-decoration: none; letter-spacing: 0.02em; transition: color 0.2s; }
  .navbar-links a:hover { color: var(--white); }
  .navbar-right { display: flex; align-items: center; gap: 16px; }
  .btn-login { font-family: var(--font-ui); font-size: 0.875rem; font-weight: 400; color: rgba(255,255,255,0.75); letter-spacing: 0.02em; transition: color 0.2s; background: none; border: none; cursor: pointer; }
  .btn-login:hover { color: var(--white); }
  .btn-nav-icon { position: relative; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; text-decoration: none; }
  .btn-nav-icon:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-icon svg { width: 16px; height: 16px; stroke: white; fill: none; }
  .chat-badge { position: absolute; top: -3px; right: -3px; width: 16px; height: 16px; background: var(--tan); border-radius: 50%; border: 2px solid var(--yale-blue); display: flex; align-items: center; justify-content: center; font-family: var(--font-ui); font-size: 0.5rem; font-weight: 700; color: var(--yale-blue); line-height: 1; }
  .btn-nav-profile { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
  .btn-nav-profile:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-profile svg { width: 16px; height: 16px; stroke: white; fill: none; }

  .section { padding: 96px 48px; background: var(--off-white); }
  .section-label { font-family: var(--font-ui); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tan-dark); margin-bottom: 16px; }
  .section-title { font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px); font-weight: 600; color: var(--yale-blue); line-height: 1.1; letter-spacing: -0.01em; margin-bottom: 24px; }

  /* Profile card */
  .profile-card { max-width: 720px; margin: 0 auto 40px; background: var(--white); padding: 28px; border-radius: 12px; box-shadow: 0 8px 32px rgba(16,24,40,0.06); }
  .profile-grid { display: flex; flex-direction: column; gap: 18px; }
  .field-label { font-family: var(--font-ui); font-size: 0.9rem; color: var(--yale-blue); font-weight: 600; margin-bottom: 8px; }
  .field-input { width: 100%; padding: 12px 14px; border-radius: 8px; border: 1px solid #e6e6e6; font-size: 1rem; font-family: var(--font-ui); color: var(--text-dark); }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .btn-save { margin-top: 12px; padding: 12px 18px; background: var(--yale-blue); color: var(--white); border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }

  /* Listings section */
  .listings-section { max-width: 1200px; margin: 0 auto; }
  .listings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-top: 24px;
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
    color: var(--tan-dark);
    font-weight: 600;
  }

  .listing-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .edit-button, .delete-button {
    flex: 1;
    padding: 8px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }

  .edit-button {
    background: var(--yale-blue);
    color: white;
  }

  .edit-button:hover {
    background: var(--yale-blue-dark);
  }

  .delete-button {
    background: #f44336;
    color: white;
  }

  .delete-button:hover {
    background: #d32f2f;
  }

  .no-listings {
    text-align: center;
    padding: 60px 20px;
    color: #666;
  }

  .create-listing-button {
    display: inline-block;
    margin-top: 20px;
    padding: 12px 24px;
    background: var(--yale-blue);
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: 600;
  }

  .create-listing-button:hover {
    background: var(--yale-blue-dark);
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

  @media (max-width: 900px) {
    .profile-card { padding: 20px; }
    .field-row { grid-template-columns: 1fr; }
    .section { padding: 64px 24px; }
    .navbar { padding: 0 24px; }
  }
`;

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    fetchUserAndListings();
  }, []);

  const fetchUserAndListings = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_token="))
        ?.split("=")[1];

      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch current user
      const userResponse = await fetch("http://localhost:8000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        navigate("/login");
        return;
      }

      const userData = await userResponse.json();
      setUser(userData);

      // Fetch user's listings
      const listingsResponse = await fetch(
        "http://localhost:8000/api/users/me/listings",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!listingsResponse.ok) {
        throw new Error("Failed to fetch listings");
      }

      const listingsData = await listingsResponse.json();
      setListings(listingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId, e) => {
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this listing?")) {
      return;
    }

    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("session_token="))
        ?.split("=")[1];

      const response = await fetch(
        `http://localhost:8000/api/listings/${listingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete listing");
      }

      // Remove from list
      setListings(listings.filter((l) => l.id !== listingId));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEditListing = (listingId, e) => {
    e.stopPropagation();
    // Navigate to create page with listing id (to edit)
    navigate(`/create-listing?edit=${listingId}`);
  };

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <nav className="navbar">
          <Link to="/" className="navbar-logo">
            Yale<span>Bay</span>
          </Link>
          <ul className="navbar-links">
            <li>
              <Link to="/marketplace">Browse</Link>
            </li>
            <li>
              <Link to="/create-listing">Sell</Link>
            </li>
          </ul>
          <div className="navbar-right">
            <div className="btn-nav-profile">
              <ProfileIcon />
            </div>
          </div>
        </nav>
        <div className="loading">Loading...</div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <nav className="navbar">
        <Link to="/" className="navbar-logo">
          Yale<span>Bay</span>
        </Link>
        <ul className="navbar-links">
          <li>
            <Link to="/marketplace">Browse</Link>
          </li>
          <li>
            <Link to="/create-listing">Sell</Link>
          </li>
        </ul>
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <Link to="/chat" className="btn-nav-icon" title="Messages">
                <ChatIcon />
                <span className="chat-badge">2</span>
              </Link>
              <div className="btn-nav-profile">
                <ProfileIcon />
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-login">
                Log in
              </Link>
              <div className="btn-nav-profile">
                <ProfileIcon />
              </div>
            </>
          )}
        </div>
      </nav>

      <section className="section">
        <p className="section-label">Account</p>
        <h2 className="section-title">
          Your <em>Profile</em>
        </h2>

        {error && <div className="error-message">{error}</div>}

        <div className="listings-section">
          <h3 style={{ fontSize: '24px', fontWeight: 600, color: 'var(--yale-blue)', marginBottom: '20px' }}>
            My Listings
          </h3>

          {listings.length === 0 ? (
            <div className="no-listings">
              <p>You haven't created any listings yet.</p>
              <Link to="/create-listing" className="create-listing-button">
                Create Your First Listing
              </Link>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="listing-card"
                  onClick={() => navigate(`/listing/${listing.id}`)}
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
                        Highest Bid: ${listing.highest_bid.toFixed(2)}
                      </div>
                    ) : (
                      <div className="listing-bid">No bids yet</div>
                    )}

                    <div className="listing-actions">
                      <button
                        className="edit-button"
                        onClick={(e) => handleEditListing(listing.id, e)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-button"
                        onClick={(e) => handleDeleteListing(listing.id, e)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
