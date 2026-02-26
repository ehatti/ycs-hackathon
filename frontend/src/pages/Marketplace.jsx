//from Marketplace_v2.jsx
import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --yale-blue: #00356B;
    --yale-blue-dark: #002654;
    --tan: #d6ae6b;
    --tan-light: #F5EFE6;
    --tan-dark: #A89070;
    --white: #FFFFFF;
    --off-white: #FAFAF8;
    --light-gray: #F0EFED;
    --border: #E5E3DF;
    --text-dark: #1a1a1a;
    --text-mid: #4a4a4a;
    --text-light: #9a9a9a;
    --font-display: 'Playfair Display', serif;
    --font-ui: 'Plus Jakarta Sans', sans-serif;
  }

  body { font-family: var(--font-ui); background: var(--off-white); color: var(--text-dark); }

  /* NAVBAR */
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
  .navbar-links a.active { color: var(--white); border-bottom: 1px solid var(--tan); padding-bottom: 2px; }
  .navbar-right { display: flex; align-items: center; gap: 16px; }
  .btn-login { font-family: var(--font-ui); font-size: 0.875rem; font-weight: 400; color: rgba(255,255,255,0.75); letter-spacing: 0.02em; transition: color 0.2s; background: none; border: none; cursor: pointer; }
  .btn-login:hover { color: var(--white); }
  .btn-nav-icon { position: relative; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; text-decoration: none; }
  .btn-nav-icon:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-icon svg { width: 16px; height: 16px; stroke: white; fill: none; }
  .chat-badge { position: absolute; top: -3px; right: -3px; width: 16px; height: 16px; background: var(--tan); border-radius: 50%; border: 2px solid var(--yale-blue); display: flex; align-items: center; justify-content: center; font-family: var(--font-ui); font-size: 0.5rem; font-weight: 700; color: var(--yale-blue); }
  .btn-nav-profile { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
  .btn-nav-profile:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-profile svg { width: 16px; height: 16px; stroke: white; fill: none; }

  /* PAGE WRAPPER */
  .page { padding-top: 68px; min-height: 100vh; }

  /* SEARCH + TABS BAR */
  .top-bar {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    position: sticky;
    top: 68px;
    z-index: 90;
  }

  .search-row {
    padding: 20px 48px 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .search-wrap {
    position: relative;
    flex: 1;
    max-width: 560px;
  }

  .search-wrap svg {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    stroke: var(--text-light);
    fill: none;
  }

  .search-input {
    width: 100%;
    padding: 10px 16px 10px 40px;
    font-family: var(--font-ui);
    font-size: 0.875rem;
    color: var(--text-dark);
    background: var(--light-gray);
    border: 1px solid var(--border);
    border-radius: 0;
    outline: none;
    transition: border-color 0.2s;
  }

  .search-input:focus { border-color: var(--yale-blue); background: var(--white); }
  .search-input::placeholder { color: var(--text-light); }

  .search-btn {
    padding: 10px 24px;
    background: var(--yale-blue);
    color: var(--white);
    font-family: var(--font-ui);
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }

  .search-btn:hover { background: var(--yale-blue-dark); }

  /* TABS */
  .tabs-row {
    display: flex;
    align-items: flex-end;
    gap: 0;
    padding: 0 48px;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .tabs-row::-webkit-scrollbar { display: none; }

  .tab {
    font-family: var(--font-ui);
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    color: var(--text-light);
    padding: 14px 20px;
    border: none;
    background: none;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .tab:hover { color: var(--text-dark); }

  .tab.active {
    color: var(--yale-blue);
    border-bottom: 2px solid var(--yale-blue);
    font-weight: 600;
  }

  /* MAIN LAYOUT */
  .main-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 0;
    min-height: calc(100vh - 68px - 109px);
  }

  /* SIDEBAR */
  .sidebar {
    background: var(--white);
    border-right: 1px solid var(--border);
    padding: 32px 24px;
    position: sticky;
    top: calc(68px + 109px);
    height: calc(100vh - 68px - 109px);
    overflow-y: auto;
  }

  .sidebar-section { margin-bottom: 32px; }

  .sidebar-section-title {
    font-family: var(--font-ui);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 12px;
  }

  .filter-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 0;
    cursor: pointer;
  }

  .filter-option input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: var(--yale-blue);
    cursor: pointer;
  }

  .filter-option input[type="radio"] {
    width: 14px;
    height: 14px;
    accent-color: var(--yale-blue);
    cursor: pointer;
  }

  .filter-option label {
    font-family: var(--font-ui);
    font-size: 0.82rem;
    color: var(--text-mid);
    cursor: pointer;
    font-weight: 400;
  }

  .price-range {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .price-input {
    width: 80px;
    padding: 7px 10px;
    font-family: var(--font-ui);
    font-size: 0.8rem;
    color: var(--text-dark);
    background: var(--light-gray);
    border: 1px solid var(--border);
    outline: none;
    transition: border-color 0.2s;
  }

  .price-input:focus { border-color: var(--yale-blue); }
  .price-sep { font-size: 0.75rem; color: var(--text-light); }

  .clear-filters {
    font-family: var(--font-ui);
    font-size: 0.78rem;
    font-weight: 500;
    color: var(--tan-dark);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    margin-top: 8px;
  }

  /* LISTINGS AREA */
  .listings-area { padding: 32px 40px; background: var(--off-white); }

  .listings-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .listings-title {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 600;
    color: var(--yale-blue);
    letter-spacing: -0.01em;
  }

  .listings-title em { font-style: italic; color: var(--tan-dark); }

  .listings-count {
    font-family: var(--font-ui);
    font-size: 0.8rem;
    color: var(--text-light);
    font-weight: 400;
  }

  .listings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
  }

  /* LISTING CARD */
  .listing-card {
    background: var(--white);
    border: 1px solid var(--border);
    cursor: pointer;
    transition: all 0.2s ease;
    text-decoration: none;
    display: block;
  }

  .listing-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); border-color: #ccc; }

  .listing-card-img {
    width: 100%;
    aspect-ratio: 1;
    background: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    position: relative;
    overflow: hidden;
  }

  .listing-card-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    padding: 3px 8px;
    font-family: var(--font-ui);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    border-radius: 0;
  }

  .badge-sell { background: var(--yale-blue); color: var(--white); }
  .badge-rent { background: var(--tan); color: var(--yale-blue); }

  .listing-card-body { padding: 14px 16px; }

  .listing-card-title {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .listing-card-sub {
    font-family: var(--font-ui);
    font-size: 0.75rem;
    color: var(--text-light);
    margin-bottom: 10px;
  }

  .listing-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .listing-card-price {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--yale-blue);
  }

  .listing-card-condition {
    font-family: var(--font-ui);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-light);
  }

  .loading-state { grid-column: 1 / -1; display: flex; align-items: center; justify-content: center; padding: 80px 0; font-family: var(--font-display); font-size: 1.1rem; font-style: italic; color: var(--text-light); }
  .error-state { grid-column: 1 / -1; display: flex; align-items: center; justify-content: center; padding: 80px 0; font-family: var(--font-ui); font-size: 0.875rem; color: #c0392b; }

  /* EMPTY STATE */
  .empty-state {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    color: var(--text-light);
  }

  .empty-state p { font-family: var(--font-display); font-size: 1.2rem; font-style: italic; margin-bottom: 8px; color: var(--text-mid); }
  .empty-state span { font-family: var(--font-ui); font-size: 0.8rem; }

  @media (max-width: 900px) {
    .main-layout { grid-template-columns: 1fr; }
    .sidebar { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
    .navbar { padding: 0 24px; }
    .search-row { padding: 16px 24px 0; }
    .tabs-row { padding: 0 24px; }
    .listings-area { padding: 24px; }
  }
`;

// ── Icons ──────────────────────────────────────────────
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

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

// ── Tabs ───────────────────────────────────────────────
const TABS = ["All", "Clothing", "Accessories", "Furniture & Decor", "Class Materials", "Event Tickets"];

// ── Filters per category ───────────────────────────────
const FILTERS = {
  All: [],
  Clothing: [
    { id: "listing_type", label: "Listing Type", type: "radio", options: ["Buy", "Rent"] },
    { id: "condition",    label: "Condition",    type: "radio", options: ["New", "Used"] },
    { id: "size",         label: "Size",         type: "checkbox", options: ["XS", "S", "M", "L", "XL"] },
    { id: "gender",       label: "Gender",       type: "checkbox", options: ["Men", "Women", "Unisex"] },
    { id: "subcategory",  label: "Type",         type: "checkbox", options: ["Formalwear", "Business Casual", "Going Out", "Loungewear", "Yale Merch", "Outerwear"] },
  ],
  Accessories: [
    { id: "listing_type", label: "Listing Type", type: "radio", options: ["Buy", "Rent"] },
    { id: "condition",    label: "Condition",    type: "radio", options: ["New", "Used"] },
    { id: "subcategory",  label: "Type",         type: "checkbox", options: ["Bags", "Jewelry", "Shoes", "Other"] },
  ],
  "Furniture & Decor": [
    { id: "listing_type", label: "Listing Type", type: "radio", options: ["Buy", "Rent"] },
    { id: "condition",    label: "Condition",    type: "radio", options: ["New", "Used"] },
    { id: "subcategory",  label: "Type",         type: "checkbox", options: ["Dorm", "Common Room", "Bathroom", "Other"] },
  ],
  "Class Materials": [
    { id: "listing_type", label: "Listing Type", type: "radio", options: ["Buy", "Rent"] },
    { id: "condition",    label: "Condition",    type: "radio", options: ["New", "Used"] },
    { id: "subcategory",  label: "Subject",      type: "checkbox", options: ["STEM", "Humanities", "Social Sciences", "Arts"] },
    { id: "format",       label: "Format",       type: "radio", options: ["Physical", "Digital"] },
  ],
  "Event Tickets": [
    { id: "subcategory",  label: "Source",       type: "radio", options: ["Yale Events", "Outside Yale"] },
    { id: "condition",    label: "Condition",    type: "radio", options: ["New", "Resale"] },
  ],
};

// ── Sidebar filters component ──────────────────────────
function Sidebar({ activeTab }) {
  const filters = FILTERS[activeTab] || [];

  if (filters.length === 0) {
    return (
      <aside className="sidebar">
        <div className="sidebar-section">
          <p className="sidebar-section-title">Price Range</p>
          <div className="price-range">
            <input className="price-input" placeholder="$0" type="number" />
            <span className="price-sep">—</span>
            <input className="price-input" placeholder="$500" type="number" />
          </div>
        </div>
        <button className="clear-filters">Clear filters</button>
      </aside>
    );
  }

  return (
    <aside className="sidebar">
      {filters.map(f => (
        <div key={f.id} className="sidebar-section">
          <p className="sidebar-section-title">{f.label}</p>
          {f.options.map(opt => (
            <div key={opt} className="filter-option">
              <input type={f.type} name={f.id} id={`${f.id}-${opt}`} />
              <label htmlFor={`${f.id}-${opt}`}>{opt}</label>
            </div>
          ))}
        </div>
      ))}
      <div className="sidebar-section">
        <p className="sidebar-section-title">Price Range</p>
        <div className="price-range">
          <input className="price-input" placeholder="$0" type="number" />
          <span className="price-sep">—</span>
          <input className="price-input" placeholder="$500" type="number" />
        </div>
      </div>
      <button className="clear-filters">Clear filters</button>
    </aside>
  );
}

// ── Main component ─────────────────────────────────────
export default function Marketplace({ initialTab = "All" }) {
  const [activeTab, setActiveTab]     = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn]   = useState(false);
  const [listings, setListings]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch("http://localhost:8000/listings")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch listings");
        return res.json();
      })
      .then(data => {
        setListings(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const visibleListings = listings.filter(l => {
    const matchesTab    = activeTab === "All" || l.category === activeTab;
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.sub.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">Yale<span>Bay</span></a>
        <ul className="navbar-links">
          <li><a href="/marketplace" className="active">Browse</a></li>
          <li><a href="/create-listing">Sell</a></li>
        </ul>
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <a href="/chat" className="btn-nav-icon">
                <ChatIcon />
                <span className="chat-badge">2</span>
              </a>
              <div className="btn-nav-profile"><ProfileIcon /></div>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => setIsLoggedIn(true)}>Log in</button>
              <div className="btn-nav-profile"><ProfileIcon /></div>
            </>
          )}
        </div>
      </nav>

      <div className="page">
        {/* SEARCH + TABS */}
        <div className="top-bar">
          <div className="search-row">
            <div className="search-wrap">
              <SearchIcon />
              <input
                className="search-input"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="search-btn">Search</button>
          </div>
          <div className="tabs-row">
            {TABS.map(tab => (
              <button
                key={tab}
                className={`tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* SIDEBAR + LISTINGS */}
        <div className="main-layout">
          <Sidebar activeTab={activeTab} />

          <div className="listings-area">
            <div className="listings-header">
              <h1 className="listings-title">
                {activeTab === "All" ? <><em>All</em> Listings</> : activeTab}
              </h1>
              <span className="listings-count">{visibleListings.length} item{visibleListings.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="listings-grid">
              {loading ? (
                <div className="loading-state">Loading listings...</div>
              ) : error ? (
                <div className="error-state">Could not load listings — {error}</div>
              ) : visibleListings.length > 0 ? visibleListings.map(listing => (
                <a key={listing.id} href={`/listing/${listing.id}`} className="listing-card">
                  <div className="listing-card-img">
                    {listing.image_url
                      ? <img src={listing.image_url} alt={listing.title} style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}} />
                      : <span style={{fontSize:"2.5rem"}}>📦</span>
                    }
                    <span className={`listing-card-badge ${listing.listing_type === "rent" ? "badge-rent" : "badge-sell"}`}>
                      {listing.listing_type === "rent" ? "Rent" : "Buy"}
                    </span>
                  </div>
                  <div className="listing-card-body">
                    <p className="listing-card-title">{listing.title}</p>
                    <p className="listing-card-sub">{listing.category}{listing.subcategory ? ` · ${listing.subcategory}` : ""}</p>
                    <div className="listing-card-footer">
                      <span className="listing-card-price">${listing.price}</span>
                      <span className="listing-card-condition">{listing.condition}</span>
                    </div>
                  </div>
                </a>
              )) : (
                <div className="empty-state">
                  <p>No listings found</p>
                  <span>Try adjusting your search or filters</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
