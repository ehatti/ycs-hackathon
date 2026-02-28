import { useState, useEffect } from 'react';

const styles = `
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 48px;
    height: 68px;
    background: #00356B;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }

  .navbar-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    font-weight: 700;
    color: white;
    letter-spacing: -0.01em;
    text-decoration: none;
  }

  .navbar-logo span {
    color: #d6ae6b;
  }

  .navbar-links {
    display: flex;
    align-items: center;
    gap: 36px;
    list-style: none;
  }

  .navbar-links a {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    color: rgba(255,255,255,0.75);
    text-decoration: none;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }

  .navbar-links a:hover {
    color: white;
  }

  .navbar-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .btn-login {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    color: rgba(255,255,255,0.75);
    letter-spacing: 0.02em;
    transition: color 0.2s;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
  }

  .btn-login:hover {
    color: white;
  }

  .btn-nav-icon {
    position: relative;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.2s;
    text-decoration: none;
  }

  .btn-nav-icon:hover {
    background: rgba(255,255,255,0.25);
  }

  .btn-nav-icon svg {
    width: 16px;
    height: 16px;
    stroke: white;
    fill: none;
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 0 24px;
    }

    .navbar-links {
      gap: 20px;
    }
  }
`;

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in by checking for session token in cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('session_token='))
      ?.split('=')[1];

    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('session_token='))
        ?.split('=')[1];

      if (token) {
        // Call logout endpoint
        await fetch('http://localhost:8000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      // Clear cookie
      document.cookie = 'session_token=; path=/; max-age=0';

      // Update state
      setIsLoggedIn(false);

      // Redirect to home
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      // Clear cookie anyway
      document.cookie = 'session_token=; path=/; max-age=0';
      setIsLoggedIn(false);
      window.location.href = '/';
    }
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar">
        <a href="/" className="navbar-logo">Yale<span>Bay</span></a>
        <ul className="navbar-links">
          <li><a href="/marketplace">Browse</a></li>
          <li><a href="/create-listing">Sell</a></li>
        </ul>
        <div className="navbar-right">
          {isLoggedIn ? (
            <>
              <a href="/profile" className="btn-nav-icon" title="Profile">
                <ProfileIcon />
              </a>
              <button className="btn-login" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <a href="/login" className="btn-login">Log in</a>
              <a href="/signup" className="btn-login">Sign up</a>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
