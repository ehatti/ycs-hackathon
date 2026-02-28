import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --yale-blue: #00356B;
    --yale-blue-dark: #002654;
    --tan: #d6ae6b;
    --off-white: #FAFAF8;
    --text-dark: #1a1a1a;
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
  .navbar-right { display: flex; align-items: center; gap: 16px; }
  .btn-login { font-family: var(--font-ui); font-size: 0.875rem; font-weight: 400; color: rgba(255,255,255,0.75); letter-spacing: 0.02em; transition: color 0.2s; background: none; border: none; cursor: pointer; }
  .btn-login:hover { color: var(--white); }
  .btn-nav-profile { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
  .btn-nav-profile:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-profile svg { width: 16px; height: 16px; stroke: white; fill: none; }

  /* SECTION */
  .section { padding: 96px 48px; background: var(--off-white); }
  .section-label { font-family: var(--font-ui); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tan); margin-bottom: 16px; }
  .section-title { font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px); font-weight: 600; color: var(--yale-blue); line-height: 1.1; letter-spacing: -0.01em; margin-bottom: 24px; }

  /* AUTH CARD */
  .auth-card { max-width: 400px; margin: 0 auto; background: var(--white); padding: 28px; border-radius: 12px; box-shadow: 0 8px 32px rgba(16,24,40,0.06); }
  .field-label { font-family: var(--font-ui); font-size: 0.9rem; color: var(--yale-blue); font-weight: 600; margin-bottom: 8px; display: block; }
  .field-input { width: 100%; padding: 12px 14px; border-radius: 8px; border: 1px solid #e6e6e6; font-size: 1rem; font-family: var(--font-ui); color: var(--text-dark); margin-bottom: 16px; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: var(--yale-blue); color: var(--white);
    font-family: var(--font-ui); font-size: 0.875rem; font-weight: 500; letter-spacing: 0.01em;
    border: none; cursor: pointer; transition: background 0.25s ease; text-decoration: none;
  }
  .btn-primary:hover { background: var(--yale-blue-dark); }
  .btn-primary:disabled { background: #ccc; cursor: not-allowed; }

  .error-message {
    background: #ffebee;
    color: #c62828;
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  @media (max-width: 900px) {
    .section { padding: 64px 24px; }
    .navbar { padding: 0 24px; }
  }
`;

const ProfileIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      // Store token in cookie
      document.cookie = `session_token=${data.token}; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days

      // Redirect to marketplace
      navigate("/marketplace");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      <nav className="navbar">
        <Link to="/" className="navbar-logo">Yale<span>Bay</span></Link>
        <ul className="navbar-links">
          <li><Link to="/marketplace">Browse</Link></li>
          <li><Link to="/create-listing">Sell</Link></li>
        </ul>
        <div className="navbar-right">
          {isLoggedIn ? (
            <div className="btn-nav-profile"><ProfileIcon /></div>
          ) : (
            <Link to="/login" className="btn-login">Log in</Link>
          )}
        </div>
      </nav>

      <section className="section">
        <p className="section-label">Account</p>
        <h2 className="section-title">Log in to <em>YaleBay</em></h2>

        <div className="auth-card">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="field-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="field-input"
                placeholder="you@yale.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="field-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="field-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p style={{ marginTop: '16px', fontSize: '0.9rem', textAlign: 'center' }}>
            Don't have an account? <Link to="/signup">Sign&nbsp;up</Link>
          </p>
        </div>
      </section>
    </>
  );
}
