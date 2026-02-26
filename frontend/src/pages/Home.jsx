//from Home_v1.jsx
import { useState, useEffect } from "react";

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
  .btn-nav-icon { position: relative; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; text-decoration: none; }
  .btn-nav-icon:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-icon svg { width: 16px; height: 16px; stroke: white; fill: none; }
  .chat-badge { position: absolute; top: -3px; right: -3px; width: 16px; height: 16px; background: var(--tan); border-radius: 50%; border: 2px solid var(--yale-blue); display: flex; align-items: center; justify-content: center; font-family: var(--font-ui); font-size: 0.5rem; font-weight: 700; color: var(--yale-blue); line-height: 1; }
  .btn-nav-profile { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
  .btn-nav-profile:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-profile svg { width: 16px; height: 16px; stroke: white; fill: none; }

  /* HERO */
  .hero { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden; background: var(--yale-blue); padding: 68px 48px 0; }
  .hero-bg-text { display: none; }
  .hero-eyebrow { font-family: var(--font-ui); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tan); margin-bottom: 24px; opacity: 0; animation: fadeUp 0.8s ease forwards 0.2s; }
  .hero-title { font-family: var(--font-display); font-size: clamp(80px, 14vw, 160px); font-weight: 700; color: var(--white); text-align: center; line-height: 1; letter-spacing: -0.03em; margin-bottom: 48px; opacity: 0; animation: fadeUp 0.8s ease forwards 0.35s; }
  .hero-title-tan { color: var(--tan); }
  .hero-actions { display: flex; gap: 16px; opacity: 0; animation: fadeUp 0.8s ease forwards 0.5s; }

  /* BUTTONS */
  .btn-primary { display: flex; align-items: center; gap: 10px; padding: 16px 36px; background: var(--white); color: var(--yale-blue); font-family: var(--font-ui); font-size: 0.875rem; font-weight: 500; letter-spacing: 0.01em; border: none; cursor: pointer; transition: all 0.25s ease; text-decoration: none; }
  .btn-primary:hover { background: var(--tan-light); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,0,0,0.2); }
  .btn-primary svg { width: 16px; height: 16px; stroke: var(--yale-blue); fill: none; transition: transform 0.25s; }
  .btn-primary:hover svg { transform: translateX(3px); }
  .btn-secondary { display: flex; align-items: center; gap: 10px; padding: 16px 36px; background: transparent; color: var(--white); font-family: var(--font-ui); font-size: 0.875rem; font-weight: 500; letter-spacing: 0.01em; border: 1px solid rgba(255,255,255,0.3); cursor: pointer; transition: all 0.25s ease; text-decoration: none; }
  .btn-secondary:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.6); transform: translateY(-2px); }
  .btn-secondary svg { width: 16px; height: 16px; stroke: white; fill: none; transition: transform 0.25s; }
  .btn-secondary:hover svg { transform: translateX(3px); }

  /* MARQUEE */
  .category-strip { background: var(--tan); padding: 14px 0; overflow: hidden; white-space: nowrap; }
  .category-strip-inner { display: inline-flex; animation: marquee 20s linear infinite; }
  .category-strip-item { font-family: var(--font-ui); font-size: 0.7rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: var(--yale-blue); padding: 0 32px; }
  .category-strip-dot { color: var(--yale-blue-dark); opacity: 0.4; }

  /* CATEGORIES */
  .section { padding: 96px 48px; background: var(--off-white); }
  .section-label { font-family: var(--font-ui); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tan-dark); margin-bottom: 16px; }
  .section-title { font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px); font-weight: 600; color: var(--yale-blue); line-height: 1.1; letter-spacing: -0.01em; margin-bottom: 56px; }
  .section-title em { font-style: italic; color: var(--tan-dark); }
  .categories-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2px; }
  .category-card-5 { background: #0a3560; }
  .category-card { position: relative; overflow: hidden; cursor: pointer; aspect-ratio: 3/4; display: flex; flex-direction: column; justify-content: flex-end; padding: 28px 24px; transition: all 0.35s ease; text-decoration: none; }
  .category-card:hover { transform: scale(1.02); z-index: 2; }
  .category-card-1 { background: var(--yale-blue); }
  .category-card-2 { background: #1a4a7a; }
  .category-card-3 { background: var(--yale-blue-dark); }
  .category-card-4 { background: #0d3d6e; }
  .category-card-bg { position: absolute; inset: 0; opacity: 0.12; transition: opacity 0.35s; font-family: var(--font-display); font-size: 140px; font-weight: 700; color: white; display: flex; align-items: center; justify-content: center; user-select: none; }
  .category-card:hover .category-card-bg { opacity: 0.2; }
  .category-card-label { font-family: var(--font-ui); font-size: 0.62rem; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--tan); margin-bottom: 6px; position: relative; z-index: 1; }
  .category-card-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 600; color: var(--white); line-height: 1.1; position: relative; z-index: 1; margin-bottom: 16px; }
  .category-card-arrow { width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; transition: all 0.25s; }
  .category-card:hover .category-card-arrow { background: var(--tan); border-color: var(--tan); }
  .category-card-arrow svg { width: 14px; height: 14px; stroke: white; fill: none; transition: stroke 0.25s; }
  .category-card:hover .category-card-arrow svg { stroke: var(--yale-blue); }

  /* HOW IT WORKS */
  .how-section { padding: 96px 48px; background: var(--tan-light); }
  .how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .how-steps { display: flex; flex-direction: column; gap: 36px; margin-top: 48px; }
  .how-step { display: flex; gap: 20px; align-items: flex-start; }
  .how-step-num { font-family: var(--font-display); font-size: 2.5rem; font-weight: 700; color: var(--tan); line-height: 1; min-width: 48px; }
  .how-step-content h3 { font-family: var(--font-display); font-size: 1.1rem; font-weight: 600; color: var(--yale-blue); margin-bottom: 6px; }
  .how-step-content p { font-family: var(--font-ui); font-size: 0.875rem; color: var(--text-mid); line-height: 1.6; font-weight: 300; }
  .how-visual { background: var(--yale-blue); aspect-ratio: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .how-visual-inner { font-family: var(--font-display); font-size: clamp(64px, 10vw, 120px); font-weight: 700; font-style: italic; color: rgba(255,255,255,0.08); user-select: none; text-align: center; line-height: 1; }
  .how-visual-badge { position: absolute; bottom: 32px; right: 32px; background: var(--tan); padding: 12px 20px; }
  .how-visual-badge p { font-family: var(--font-ui); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: var(--yale-blue); }

  /* CTA */
  .cta-section { padding: 96px 48px; background: var(--yale-blue); display: flex; flex-direction: column; align-items: center; text-align: center; position: relative; overflow: hidden; }
  .cta-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: clamp(80px, 15vw, 200px); font-weight: 700; color: rgba(255,255,255,0.03); user-select: none; letter-spacing: -0.02em; }
  .cta-section .section-label { color: var(--tan); }
  .cta-title { font-family: var(--font-display); font-size: clamp(36px, 5vw, 64px); font-weight: 700; color: var(--white); line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 16px; position: relative; z-index: 1; }
  .cta-title em { font-style: italic; color: var(--tan); }
  .cta-sub { font-family: var(--font-ui); font-size: 0.95rem; font-weight: 300; color: rgba(255,255,255,0.5); margin-bottom: 40px; position: relative; z-index: 1; }
  .cta-actions { display: flex; gap: 12px; position: relative; z-index: 1; }

  /* FOOTER */
  .footer { padding: 32px 48px; background: var(--yale-blue-dark); display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.06); }
  .footer-logo { font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: rgba(255,255,255,0.5); }
  .footer-logo span { color: var(--tan); }
  .footer-note { font-family: var(--font-ui); font-size: 0.75rem; color: rgba(255,255,255,0.3); letter-spacing: 0.02em; }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

  @media (max-width: 900px) {
    .categories-grid { grid-template-columns: repeat(3, 1fr); }
    .how-grid { grid-template-columns: 1fr; }
    .how-visual { display: none; }
    .navbar { padding: 0 24px; }
    .section, .how-section, .cta-section { padding: 64px 24px; }
    .hero { padding: 68px 24px 0; }
  }
`;

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
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


const categories = [
  { id: 1, label: "Category 01", title: "Clothing",          icon: "✦", cardClass: "category-card-1", href: "/marketplace?tab=Clothing" },
  { id: 2, label: "Category 02", title: "Accessories",       icon: "◇", cardClass: "category-card-2", href: "/marketplace?tab=Accessories" },
  { id: 3, label: "Category 03", title: "Furniture & Decor", icon: "◈", cardClass: "category-card-3", href: "/marketplace?tab=Furniture+%26+Decor" },
  { id: 4, label: "Category 04", title: "Class Materials",   icon: "◎", cardClass: "category-card-4", href: "/marketplace?tab=Class+Materials" },
  { id: 5, label: "Category 05", title: "Event Tickets",     icon: "◉", cardClass: "category-card-5", href: "/marketplace?tab=Event+Tickets" },
];

const stripItems = ["Clothing", "Accessories", "Furniture", "Class Materials", "Tickets", "Buy", "Sell", "Rent", "Borrow"];

const steps = [
  { n: "01", h: "Sign in with your Yale NetID", p: "Access is exclusive to Yale students. Your NetID keeps the community trusted and safe." },
  { n: "02", h: "Browse or list an item", p: "Upload what you want to sell or rent, or scroll the marketplace to find what you need." },
  { n: "03", h: "Connect and meet up", p: "Message the seller directly and arrange a pickup on campus. No middleman, no shipping." },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // swap with real auth state later

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
              <a href="/chat" className="btn-nav-icon" title="Messages">
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

      <section className="hero">
        <p className="hero-eyebrow">Yale University · Student Marketplace</p>
        <h1 className="hero-title">Yale<span className="hero-title-tan">Bay</span></h1>
        <div className="hero-actions">
          <a href="/marketplace" className="btn-primary">Browse Listings <ArrowRight /></a>
          <a href="/create-listing" className="btn-secondary">List an Item <ArrowRight /></a>
        </div>
      </section>

      <div className="category-strip">
        <div className="category-strip-inner">
          {[...stripItems, ...stripItems].map((item, i) => (
            <span key={i} className="category-strip-item">{item} <span className="category-strip-dot">·</span></span>
          ))}
        </div>
      </div>

      <section className="section">
        <p className="section-label">Explore</p>
        <h2 className="section-title">Shop by<br /><em>Category</em></h2>
        <div className="categories-grid">
          {categories.map((cat) => (
            <a key={cat.id} href={cat.href} className={`category-card ${cat.cardClass}`}>
              <div className="category-card-bg">{cat.icon}</div>
              <p className="category-card-label">{cat.label}</p>
              <h3 className="category-card-title">{cat.title}</h3>
              <div className="category-card-arrow"><ArrowRight /></div>
            </a>
          ))}
        </div>
      </section>

      <section className="how-section">
        <div className="how-grid">
          <div>
            <p className="section-label">How It Works</p>
            <h2 className="section-title">Simple as<br /><em>three steps</em></h2>
            <div className="how-steps">
              {steps.map(step => (
                <div key={step.n} className="how-step">
                  <span className="how-step-num">{step.n}</span>
                  <div className="how-step-content">
                    <h3>{step.h}</h3>
                    <p>{step.p}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="how-visual">
            <div className="how-visual-inner">Yale<br />Bay</div>
            <div className="how-visual-badge"><p>Yale NetID Required</p></div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-bg">Trade</div>
        <p className="section-label">Get Started</p>
        <h2 className="cta-title">Ready to <em>trade</em><br />with your community?</h2>
        <p className="cta-sub">Join hundreds of Yale students buying and selling on campus.</p>
        <div className="cta-actions">
          <a href="/marketplace" className="btn-primary">Explore Marketplace <ArrowRight /></a>
          <a href="/create-listing" className="btn-secondary">Post a Listing <ArrowRight /></a>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">Yale<span>Bay</span></div>
        <p className="footer-note">For Yale students, by Yale students · {new Date().getFullYear()}</p>
      </footer>
    </>
  );
}
