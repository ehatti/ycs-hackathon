//from CreateListing_v1.jsx
import { useState } from "react";

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
    --border-focus: #00356B;
    --error: #c0392b;
    --error-bg: #fdf0ee;
    --text-dark: #1a1a1a;
    --text-mid: #4a4a4a;
    --text-light: #9a9a9a;
    --font-display: 'Playfair Display', serif;
    --font-ui: 'Plus Jakarta Sans', sans-serif;
  }

  body { font-family: var(--font-ui); background: var(--off-white); color: var(--text-dark); }

  /* NAVBAR */
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 68px; background: var(--yale-blue); border-bottom: 1px solid rgba(255,255,255,0.08); }
  .navbar-logo { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; color: var(--white); letter-spacing: -0.01em; text-decoration: none; }
  .navbar-logo span { color: var(--tan); }
  .navbar-links { display: flex; align-items: center; gap: 36px; list-style: none; }
  .navbar-links a { font-family: var(--font-ui); font-size: 0.875rem; font-weight: 400; color: rgba(255,255,255,0.75); text-decoration: none; letter-spacing: 0.02em; transition: color 0.2s; }
  .navbar-links a:hover { color: var(--white); }
  .navbar-links a.active { color: var(--white); border-bottom: 1px solid var(--tan); padding-bottom: 2px; }
  .navbar-right { display: flex; align-items: center; gap: 16px; }
  .btn-login { font-family: var(--font-ui); font-size: 0.875rem; color: rgba(255,255,255,0.75); background: none; border: none; cursor: pointer; transition: color 0.2s; }
  .btn-login:hover { color: var(--white); }
  .btn-nav-icon { position: relative; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; text-decoration: none; }
  .btn-nav-icon:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-icon svg { width: 16px; height: 16px; stroke: white; fill: none; }
  .chat-badge { position: absolute; top: -3px; right: -3px; width: 16px; height: 16px; background: var(--tan); border-radius: 50%; border: 2px solid var(--yale-blue); display: flex; align-items: center; justify-content: center; font-family: var(--font-ui); font-size: 0.5rem; font-weight: 700; color: var(--yale-blue); }
  .btn-nav-profile { width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
  .btn-nav-profile:hover { background: rgba(255,255,255,0.25); }
  .btn-nav-profile svg { width: 16px; height: 16px; stroke: white; fill: none; }

  /* PAGE */
  .page { padding-top: 68px; min-height: 100vh; background: var(--off-white); }

  .page-header {
    background: var(--white);
    border-bottom: 1px solid var(--border);
    padding: 32px 48px;
  }

  .page-header-eyebrow {
    font-family: var(--font-ui);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--tan-dark);
    margin-bottom: 6px;
  }

  .page-header-title {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 700;
    color: var(--yale-blue);
    letter-spacing: -0.01em;
  }

  .page-header-title em { font-style: italic; color: var(--tan); }

  /* TWO COLUMN LAYOUT */
  .create-layout {
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 0;
    min-height: calc(100vh - 68px - 97px);
    align-items: start;
  }

  /* LEFT — PHOTO UPLOAD */
  .photo-panel {
    background: var(--white);
    border-right: 1px solid var(--border);
    padding: 40px 36px;
    position: sticky;
    top: calc(68px + 97px);
    height: calc(100vh - 68px - 97px);
    overflow-y: auto;
  }

  .photo-panel-title {
    font-family: var(--font-ui);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 16px;
  }

  .photo-main-upload {
    width: 100%;
    aspect-ratio: 1;
    border: 2px dashed var(--border);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--light-gray);
    position: relative;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .photo-main-upload:hover { border-color: var(--yale-blue); background: #eef2f7; }
  .photo-main-upload.has-image { border-style: solid; border-color: var(--border); }

  .photo-main-upload input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
  }

  .photo-main-upload img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    inset: 0;
  }

  .photo-upload-prompt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    z-index: 1;
  }

  .photo-upload-prompt svg { width: 32px; height: 32px; stroke: var(--text-light); fill: none; }
  .photo-upload-prompt p { font-family: var(--font-ui); font-size: 0.8rem; color: var(--text-light); font-weight: 500; }
  .photo-upload-prompt span { font-family: var(--font-ui); font-size: 0.7rem; color: var(--text-light); font-weight: 300; }

  .photo-thumbs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  .photo-thumb {
    aspect-ratio: 1;
    border: 1.5px dashed var(--border);
    background: var(--light-gray);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: border-color 0.2s;
    position: relative;
    overflow: hidden;
  }

  .photo-thumb:hover { border-color: var(--yale-blue); }
  .photo-thumb input[type="file"] { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .photo-thumb img { width: 100%; height: 100%; object-fit: cover; position: absolute; inset: 0; }
  .photo-thumb svg { width: 18px; height: 18px; stroke: var(--text-light); fill: none; pointer-events: none; }

  .photo-hint {
    font-family: var(--font-ui);
    font-size: 0.72rem;
    color: var(--text-light);
    margin-top: 12px;
    line-height: 1.5;
  }

  /* RIGHT — FORM */
  .form-panel { padding: 40px 48px; }

  /* SELL / RENT TOGGLE */
  .toggle-wrap { display: flex; gap: 0; margin-bottom: 32px; }

  .toggle-btn {
    flex: 1;
    padding: 12px 0;
    font-family: var(--font-ui);
    font-size: 0.875rem;
    font-weight: 500;
    border: 1.5px solid var(--border);
    background: var(--white);
    color: var(--text-light);
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.02em;
  }

  .toggle-btn:first-child { border-right: none; }
  .toggle-btn.active-sell { background: var(--yale-blue); color: var(--white); border-color: var(--yale-blue); }
  .toggle-btn.active-rent { background: var(--tan); color: var(--yale-blue); border-color: var(--tan); }

  /* FORM SECTIONS */
  .form-section { margin-bottom: 36px; }

  .form-section-title {
    font-family: var(--font-ui);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--text-light);
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  .form-row { margin-bottom: 20px; }
  .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }

  .form-label {
    display: block;
    font-family: var(--font-ui);
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 6px;
  }

  .form-label span { color: var(--error); margin-left: 2px; }

  .form-input {
    width: 100%;
    padding: 11px 14px;
    font-family: var(--font-ui);
    font-size: 0.875rem;
    color: var(--text-dark);
    background: var(--white);
    border: 1.5px solid var(--border);
    outline: none;
    transition: border-color 0.2s;
  }

  .form-input:focus { border-color: var(--border-focus); }
  .form-input.has-error { border-color: var(--error); background: var(--error-bg); }
  .form-input::placeholder { color: var(--text-light); }

  .form-textarea {
    width: 100%;
    padding: 11px 14px;
    font-family: var(--font-ui);
    font-size: 0.875rem;
    color: var(--text-dark);
    background: var(--white);
    border: 1.5px solid var(--border);
    outline: none;
    transition: border-color 0.2s;
    resize: vertical;
    min-height: 100px;
  }

  .form-textarea:focus { border-color: var(--border-focus); }
  .form-textarea.has-error { border-color: var(--error); background: var(--error-bg); }
  .form-textarea::placeholder { color: var(--text-light); }

  .form-select {
    width: 100%;
    padding: 11px 14px;
    font-family: var(--font-ui);
    font-size: 0.875rem;
    color: var(--text-dark);
    background: var(--white);
    border: 1.5px solid var(--border);
    outline: none;
    transition: border-color 0.2s;
    appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239a9a9a' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  .form-select:focus { border-color: var(--border-focus); }
  .form-select.has-error { border-color: var(--error); background-color: var(--error-bg); }

  .inline-error {
    font-family: var(--font-ui);
    font-size: 0.72rem;
    color: var(--error);
    margin-top: 5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* CONDITION PILLS */
  .pill-group { display: flex; gap: 8px; flex-wrap: wrap; }

  .pill {
    padding: 7px 16px;
    font-family: var(--font-ui);
    font-size: 0.78rem;
    font-weight: 500;
    border: 1.5px solid var(--border);
    background: var(--white);
    color: var(--text-mid);
    cursor: pointer;
    transition: all 0.2s;
  }

  .pill:hover { border-color: var(--yale-blue); color: var(--yale-blue); }
  .pill.active { background: var(--yale-blue); color: var(--white); border-color: var(--yale-blue); }

  /* AVAILABILITY CHECKBOXES */
  .avail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

  .avail-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1.5px solid var(--border);
    cursor: pointer;
    transition: border-color 0.2s;
    background: var(--white);
  }

  .avail-option:hover { border-color: var(--yale-blue); }
  .avail-option.checked { border-color: var(--yale-blue); background: #eef2f7; }
  .avail-option input { accent-color: var(--yale-blue); width: 14px; height: 14px; cursor: pointer; }
  .avail-option label { font-family: var(--font-ui); font-size: 0.78rem; color: var(--text-mid); cursor: pointer; }

  /* PRICE */
  .price-wrap { position: relative; }
  .price-wrap .currency { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-family: var(--font-ui); font-size: 0.875rem; color: var(--text-light); pointer-events: none; }
  .price-wrap .form-input { padding-left: 28px; }
  .price-suffix { font-family: var(--font-ui); font-size: 0.72rem; color: var(--text-light); margin-top: 5px; }

  /* SUBMIT */
  .form-submit-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    margin-top: 8px;
  }

  .form-submit-note {
    font-family: var(--font-ui);
    font-size: 0.75rem;
    color: var(--text-light);
    max-width: 280px;
    line-height: 1.5;
  }

  .btn-submit {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 40px;
    background: var(--yale-blue);
    color: var(--white);
    font-family: var(--font-ui);
    font-size: 0.875rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.25s;
    letter-spacing: 0.02em;
  }

  .btn-submit:hover { background: var(--yale-blue-dark); transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,53,107,0.25); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
  .btn-submit svg { width: 16px; height: 16px; stroke: white; fill: none; transition: transform 0.2s; }
  .btn-submit:hover svg { transform: translateX(3px); }

  .submit-error {
    font-family: var(--font-ui);
    font-size: 0.8rem;
    color: var(--error);
    background: var(--error-bg);
    border: 1px solid #f5c6c0;
    padding: 12px 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 1000px) {
    .create-layout { grid-template-columns: 1fr; }
    .photo-panel { position: static; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
    .navbar { padding: 0 24px; }
    .page-header { padding: 24px; }
    .form-panel { padding: 32px 24px; }
  }
`;

// ── Icons ──────────────────────────────────────────────
const UploadIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

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

// ── Data ───────────────────────────────────────────────
const CATEGORIES = ["Clothing", "Accessories", "Furniture & Decor", "Class Materials", "Event Tickets"];

const SUBCATEGORIES = {
  Clothing:           ["Formalwear", "Business Casual", "Going Out", "Loungewear", "Yale Merch", "Outerwear"],
  Accessories:        ["Bags", "Jewelry", "Shoes", "Other"],
  "Furniture & Decor": ["Dorm", "Common Room", "Bathroom", "Other"],
  "Class Materials":  ["STEM", "Humanities", "Social Sciences", "Arts"],
  "Event Tickets":    ["Yale Events", "Outside Yale"],
};

const RESIDENTIAL_COLLEGES = [
  "Berkeley", "Branford", "Davenport", "Ezra Stiles", "Franklin",
  "Grace Hopper", "Jonathan Edwards", "Morse", "Old Campus", "Pauli Murray",
  "Pierson", "Saybrook", "Silliman", "Timothy Dwight", "Trumbull",
  "Off Campus"
];

const AVAILABILITY = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Weekends"];

const REQUIRED = ["title", "description", "category", "condition", "price", "pickup_location"];

// ── Main component ─────────────────────────────────────
export default function CreateListing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // form state
  const [form, setForm] = useState({
    listing_type: "sell",
    title: "",
    description: "",
    category: "",
    subcategory: "",
    size: "",
    gender: "",
    format: "",
    condition: "",
    price: "",
    pickup_location: "",
    availability: [],
  });

  // photo state
  const [mainPhoto, setMainPhoto]       = useState(null);   // preview URL
  const [mainPhotoUrl, setMainPhotoUrl] = useState(null);   // permanent backend URL
  const [thumbPhotos, setThumbPhotos]   = useState([null, null, null]);     // preview URLs
  const [thumbPhotoUrls, setThumbPhotoUrls] = useState([null, null, null]); // permanent URLs
  const [photoUploading, setPhotoUploading] = useState(false);

  // validation errors
  const [errors, setErrors] = useState({});

  // ── Handlers ────────────────────────────────────────
  const set = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }));
  };

  const toggleAvailability = (slot) => {
    setForm(f => ({
      ...f,
      availability: f.availability.includes(slot)
        ? f.availability.filter(s => s !== slot)
        : [...f.availability, slot]
    }));
  };

  const uploadPhoto = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8000/upload-image", {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json();
    return data.image_url; // permanent Supabase URL
  };

  const handleMainPhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainPhoto(URL.createObjectURL(file)); // show preview immediately
    if (errors.photo) setErrors(err => ({ ...err, photo: null }));
    try {
      setPhotoUploading(true);
      const url = await uploadPhoto(file);
      setMainPhotoUrl(url);
    } catch {
      setErrors(err => ({ ...err, photo: "Photo upload failed — please try again" }));
      setMainPhoto(null);
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleThumbPhoto = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const updated = [...thumbPhotos];
    updated[index] = URL.createObjectURL(file);
    setThumbPhotos(updated);
    try {
      const url = await uploadPhoto(file);
      const updatedUrls = [...thumbPhotoUrls];
      updatedUrls[index] = url;
      setThumbPhotoUrls(updatedUrls);
    } catch {
      // thumbnail upload failure is non-blocking
      console.error("Thumbnail upload failed");
    }
  };

  // ── Validation ──────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!mainPhotoUrl)        newErrors.photo       = "Please upload at least one photo";
    if (photoUploading)       newErrors.photo       = "Please wait for photo to finish uploading";
    if (!form.title.trim())   newErrors.title       = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.category)       newErrors.category    = "Please select a category";
    if (!form.condition)      newErrors.condition   = "Please select a condition";
    if (!form.price)          newErrors.price       = "Please enter a price";
    else if (isNaN(form.price) || Number(form.price) <= 0) newErrors.price = "Please enter a valid price";
    if (!form.pickup_location) newErrors.pickup_location = "Please select a pickup location";
    return newErrors;
  };

  // ── Submit ──────────────────────────────────────────
  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // scroll to first error
      const firstError = document.querySelector(".has-error, .photo-error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("http://localhost:8000/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image_url: mainPhotoUrl,
          extra_images: thumbPhotoUrls.filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error("Failed to create listing");
      // redirect to profile page
      window.location.href = "/profile";
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  const subcategoryOptions = SUBCATEGORIES[form.category] || [];

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <a href="/" className="navbar-logo">Yale<span>Bay</span></a>
        <ul className="navbar-links">
          <li><a href="/marketplace">Browse</a></li>
          <li><a href="/create-listing" className="active">Sell</a></li>
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
        {/* PAGE HEADER */}
        <div className="page-header">
          <p className="page-header-eyebrow">Seller Hub</p>
          <h1 className="page-header-title">Create a <em>Listing</em></h1>
        </div>

        <div className="create-layout">

          {/* LEFT — PHOTO UPLOAD */}
          <div className="photo-panel">
            <p className="photo-panel-title">Photos</p>

            {/* main photo */}
            <div className={`photo-main-upload ${mainPhoto ? "has-image" : ""}`}>
              <input type="file" accept="image/*" onChange={handleMainPhoto} />
              {mainPhoto
                ? <img src={mainPhoto} alt="Main listing" />
                : <div className="photo-upload-prompt">
                    <UploadIcon />
                    <p>Upload main photo</p>
                    <span>Click to browse</span>
                  </div>
              }
              {photoUploading && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,53,107,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "white", fontWeight: 500 }}>Uploading...</p>
                </div>
              )}
            </div>
            {errors.photo && <p className="inline-error photo-error">⚠ {errors.photo}</p>}

            {/* thumbnails */}
            <div className="photo-thumbs">
              {thumbPhotos.map((photo, i) => (
                <div key={i} className="photo-thumb">
                  <input type="file" accept="image/*" onChange={e => handleThumbPhoto(i, e)} />
                  {photo ? <img src={photo} alt={`Photo ${i + 2}`} /> : <PlusIcon />}
                </div>
              ))}
            </div>
            <p className="photo-hint">Upload up to 4 photos. Clear, well-lit photos get more responses. First photo will be the cover.</p>
          </div>

          {/* RIGHT — FORM */}
          <div className="form-panel">

            {/* SELL / RENT TOGGLE */}
            <div className="toggle-wrap">
              <button
                className={`toggle-btn ${form.listing_type === "sell" ? "active-sell" : ""}`}
                onClick={() => set("listing_type", "sell")}
              >
                Sell
              </button>
              <button
                className={`toggle-btn ${form.listing_type === "rent" ? "active-rent" : ""}`}
                onClick={() => set("listing_type", "rent")}
              >
                Rent Out
              </button>
            </div>

            {/* BASICS */}
            <div className="form-section">
              <p className="form-section-title">Basic Info</p>

              <div className="form-row">
                <label className="form-label">Title <span>*</span></label>
                <input
                  className={`form-input ${errors.title ? "has-error" : ""}`}
                  placeholder="e.g. Navy Blazer, IKEA Desk Lamp, Org Chem Textbook"
                  value={form.title}
                  onChange={e => set("title", e.target.value)}
                />
                {errors.title && <p className="inline-error">⚠ {errors.title}</p>}
              </div>

              <div className="form-row">
                <label className="form-label">Description <span>*</span></label>
                <textarea
                  className={`form-textarea ${errors.description ? "has-error" : ""}`}
                  placeholder="Describe your item — size, brand, any wear or damage, reason for selling..."
                  value={form.description}
                  onChange={e => set("description", e.target.value)}
                />
                {errors.description && <p className="inline-error">⚠ {errors.description}</p>}
              </div>
            </div>

            {/* CATEGORIZATION */}
            <div className="form-section">
              <p className="form-section-title">Category</p>

              <div className="form-row-2">
                <div>
                  <label className="form-label">Category <span>*</span></label>
                  <select
                    className={`form-select ${errors.category ? "has-error" : ""}`}
                    value={form.category}
                    onChange={e => { set("category", e.target.value); set("subcategory", ""); set("size", ""); set("gender", ""); set("format", ""); }}
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="inline-error">⚠ {errors.category}</p>}
                </div>
                <div>
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    value={form.subcategory}
                    onChange={e => set("subcategory", e.target.value)}
                    disabled={!form.category}
                  >
                    <option value="">Select type</option>
                    {subcategoryOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* SIZE + GENDER — only for Clothing */}
              {form.category === "Clothing" && (
                <div className="form-row-2">
                  <div>
                    <label className="form-label">Size</label>
                    <div className="pill-group">
                      {["XS", "S", "M", "L", "XL"].map(s => (
                        <button key={s} className={`pill ${form.size === s ? "active" : ""}`} onClick={() => set("size", s)}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <div className="pill-group">
                      {["Men", "Women", "Unisex"].map(g => (
                        <button key={g} className={`pill ${form.gender === g ? "active" : ""}`} onClick={() => set("gender", g)}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* FORMAT — only for Class Materials */}
              {form.category === "Class Materials" && (
                <div className="form-row">
                  <label className="form-label">Format</label>
                  <div className="pill-group">
                    {["Physical", "Digital"].map(f => (
                      <button key={f} className={`pill ${form.format === f ? "active" : ""}`} onClick={() => set("format", f)}>{f}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-row">
                <label className="form-label">Condition <span>*</span></label>
                <div className="pill-group">
                  {(form.category === "Event Tickets"
                    ? ["New", "Resale"]
                    : ["New", "Like New", "Good", "Fair"]
                  ).map(c => (
                    <button
                      key={c}
                      className={`pill ${form.condition === c ? "active" : ""}`}
                      onClick={() => set("condition", c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                {errors.condition && <p className="inline-error">⚠ {errors.condition}</p>}
              </div>
            </div>

            {/* PRICING */}
            <div className="form-section">
              <p className="form-section-title">Pricing</p>
              <div className="form-row">
                <label className="form-label">
                  {form.listing_type === "rent" ? "Rental Price" : "Asking Price"} <span>*</span>
                </label>
                <div className="price-wrap">
                  <span className="currency">$</span>
                  <input
                    className={`form-input ${errors.price ? "has-error" : ""}`}
                    placeholder="0.00"
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={e => set("price", e.target.value)}
                  />
                </div>
                {form.listing_type === "rent" && <p className="price-suffix">Per day — you can clarify terms in the description</p>}
                {errors.price && <p className="inline-error">⚠ {errors.price}</p>}
              </div>
            </div>

            {/* PICKUP */}
            <div className="form-section">
              <p className="form-section-title">Pickup Details</p>

              <div className="form-row">
                <label className="form-label">Residential College / Location <span>*</span></label>
                <select
                  className={`form-select ${errors.pickup_location ? "has-error" : ""}`}
                  value={form.pickup_location}
                  onChange={e => set("pickup_location", e.target.value)}
                >
                  <option value="">Select location</option>
                  {RESIDENTIAL_COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.pickup_location && <p className="inline-error">⚠ {errors.pickup_location}</p>}
              </div>

              <div className="form-row">
                <label className="form-label">Availability</label>
                <div className="avail-grid">
                  {AVAILABILITY.map(slot => (
                    <div
                      key={slot}
                      className={`avail-option ${form.availability.includes(slot) ? "checked" : ""}`}
                      onClick={() => toggleAvailability(slot)}
                    >
                      <input
                        type="checkbox"
                        checked={form.availability.includes(slot)}
                        onChange={() => toggleAvailability(slot)}
                      />
                      <label>{slot}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            {submitError && <div className="submit-error">⚠ {submitError} — please try again.</div>}
            <div className="form-submit-row">
              <p className="form-submit-note">Your listing will be visible to all Yale students once submitted.</p>
              <button className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Posting..." : "Post Listing"}
                {!submitting && <ArrowRight />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

