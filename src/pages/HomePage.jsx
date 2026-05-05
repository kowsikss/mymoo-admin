import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const roles = [
  {
    title: "Super Admin",
    subtitle: "Platform Management",
    description: "Oversee all Gaushalas, manage doctors, and monitor the entire network from one place.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <circle cx="20" cy="13" r="6" stroke="currentColor" strokeWidth="2.2" />
        <path d="M6 34c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M28 8l2 2 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    path: "/admin-login",
    accent: "#b45309",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(180,83,9,0.25)",
  },
  {
    title: "Gaushala Admin",
    subtitle: "Gaushala Operations",
    description: "Manage your Gaushala's cattle, rescued animals, inventory, and medical staff with ease.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <path d="M8 30c0-2 1-4 3-5l3-2v-4c-2-1-3-3-3-5 0-4 4-8 9-8s9 4 9 8c0 2-1 4-3 5v4l3 2c2 1 3 3 3 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M14 14c0 0-2-2-2-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 14c0 0 2-2 2-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    path: "/kosala-admin-login",
    accent: "#166534",
    bg: "rgba(74,222,128,0.07)",
    border: "rgba(22,101,52,0.25)",
  },
  {
    title: "Doctor",
    subtitle: "Veterinary Care",
    description: "Record vaccinations, deworming, immunizations, and reproductive health for every animal.",
    icon: (
      <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="40" height="40">
        <rect x="17" y="7" width="6" height="26" rx="3" stroke="currentColor" strokeWidth="2.2" />
        <rect x="7" y="17" width="26" height="6" rx="3" stroke="currentColor" strokeWidth="2.2" />
      </svg>
    ),
    path: "/doctor-login",
    accent: "#1e40af",
    bg: "rgba(96,165,250,0.07)",
    border: "rgba(30,64,175,0.25)",
  },
];

const features = [
  { icon: "🐄", label: "Cattle Registry", desc: "Full health & history records for every animal" },
  { icon: "💉", label: "Medical Tracking", desc: "Vaccinations, deworming & immunizations" },
  { icon: "🏥", label: "Rescue Management", desc: "Track and care for rescued animals" },
  { icon: "📦", label: "Inventory Control", desc: "Medicines and supplies, always in check" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const { left, top, width, height } = el.getBoundingClientRect();
      const x = ((e.clientX - left) / width - 0.5) * 20;
      const y = ((e.clientY - top) / height - 0.5) * 12;
      el.style.setProperty("--rx", `${y}deg`);
      el.style.setProperty("--ry", `${x}deg`);
    };
    el.addEventListener("mousemove", handleMove);
    return () => el.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #faf7f2; }

        .hp-root {
          min-height: 100vh;
          background: #faf7f2;
          font-family: 'DM Sans', sans-serif;
          color: #1c1917;
          overflow-x: hidden;
        }

        /* ── NAV ── */
        .hp-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 3rem;
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(250,247,242,0.85);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .hp-logo {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .hp-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #92400e, #d97706);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.15rem;
        }
        .hp-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 1.35rem;
          font-weight: 700;
          color: #78350f;
          letter-spacing: -0.02em;
        }
        .hp-nav-tag {
          font-size: 0.75rem;
          font-weight: 500;
          color: #92400e;
          background: rgba(180,83,9,0.1);
          padding: 0.3rem 0.85rem;
          border-radius: 999px;
          letter-spacing: 0.04em;
        }

        /* ── HERO ── */
        .hp-hero {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          padding: 5rem 3rem 4rem;
          max-width: 1200px;
          margin: 0 auto;
          align-items: center;
        }
        .hp-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(22,101,52,0.08);
          border: 1px solid rgba(22,101,52,0.2);
          color: #166534;
          font-size: 0.78rem;
          font-weight: 500;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }
        .hp-hero-badge::before { content: "●"; font-size: 0.5rem; }
        .hp-hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.8rem, 5vw, 4.2rem);
          font-weight: 900;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #1c1917;
          margin-bottom: 1.5rem;
        }
        .hp-hero-title span {
          color: #b45309;
          position: relative;
          display: inline-block;
        }
        .hp-hero-title span::after {
          content: '';
          position: absolute;
          bottom: 2px; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #d97706, #b45309);
          border-radius: 2px;
        }
        .hp-hero-desc {
          font-size: 1.05rem;
          line-height: 1.75;
          color: #57534e;
          font-weight: 300;
          max-width: 480px;
          margin-bottom: 2.5rem;
        }
        .hp-hero-stats {
          display: flex;
          gap: 2rem;
        }
        .hp-stat {
          display: flex;
          flex-direction: column;
        }
        .hp-stat-num {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: #92400e;
          line-height: 1;
        }
        .hp-stat-label {
          font-size: 0.75rem;
          color: #a8a29e;
          font-weight: 400;
          margin-top: 0.2rem;
          letter-spacing: 0.04em;
        }

        /* ── HERO VISUAL ── */
        .hp-hero-visual {
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 800px;
        }
        .hp-hero-card {
          width: 340px;
          background: white;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 32px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06);
          transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
          transition: transform 0.15s ease;
          transform-style: preserve-3d;
          animation: floatCard 5s ease-in-out infinite;
        }
        @keyframes floatCard {
          0%, 100% { translate: 0 0px; }
          50% { translate: 0 -10px; }
        }
        .hp-hero-card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .hp-hero-cow-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
        }
        .hp-hero-card-title {
          font-family: 'Playfair Display', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1c1917;
        }
        .hp-hero-card-id {
          font-size: 0.72rem;
          color: #a8a29e;
        }
        .hp-hero-card-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.65rem 0;
          border-bottom: 1px solid #f5f5f4;
          font-size: 0.82rem;
        }
        .hp-hero-card-row:last-child { border-bottom: none; }
        .hp-hero-card-key { color: #78716c; font-weight: 400; }
        .hp-hero-card-val { font-weight: 500; color: #1c1917; }
        .hp-status-dot {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          color: #15803d;
          font-weight: 500;
        }
        .hp-status-dot::before {
          content: ''; width: 7px; height: 7px;
          background: #22c55e; border-radius: 50%;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        /* ── DIVIDER ── */
        .hp-divider {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 3rem;
          border-top: 1px solid #e7e5e4;
        }

        /* ── FEATURES ── */
        .hp-features {
          max-width: 1200px;
          margin: 0 auto;
          padding: 4rem 3rem;
        }
        .hp-section-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: #a8a29e;
          text-transform: uppercase;
          margin-bottom: 2rem;
        }
        .hp-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }
        .hp-feature-card {
          background: white;
          border: 1px solid #e7e5e4;
          border-radius: 16px;
          padding: 1.5rem;
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .hp-feature-card:hover {
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
          transform: translateY(-3px);
        }
        .hp-feature-emoji {
          font-size: 1.75rem;
          margin-bottom: 0.85rem;
          display: block;
        }
        .hp-feature-label {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1c1917;
          margin-bottom: 0.3rem;
        }
        .hp-feature-desc {
          font-size: 0.78rem;
          color: #78716c;
          line-height: 1.6;
          font-weight: 300;
        }

        /* ── LOGIN SECTION ── */
        .hp-login-section {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 3rem 6rem;
        }
        .hp-login-heading {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          color: #1c1917;
          margin-bottom: 0.5rem;
        }
        .hp-login-sub {
          font-size: 0.9rem;
          color: #78716c;
          margin-bottom: 2.5rem;
          font-weight: 300;
        }
        .hp-roles-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        .hp-role-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          border: 1.5px solid;
          cursor: pointer;
          transition: all 0.22s ease;
          position: relative;
          overflow: hidden;
        }
        .hp-role-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.22s;
          border-radius: 20px;
        }
        .hp-role-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.10);
        }
        .hp-role-card:hover::before { opacity: 1; }
        .hp-role-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.25rem;
        }
        .hp-role-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1c1917;
          margin-bottom: 0.2rem;
        }
        .hp-role-subtitle {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.85rem;
        }
        .hp-role-desc {
          font-size: 0.83rem;
          color: #78716c;
          line-height: 1.65;
          font-weight: 300;
          margin-bottom: 1.75rem;
        }
        .hp-role-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.65rem 1.3rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: all 0.18s;
          font-family: 'DM Sans', sans-serif;
        }
        .hp-role-btn svg {
          transition: transform 0.18s;
        }
        .hp-role-btn:hover svg {
          transform: translateX(3px);
        }

        /* ── FOOTER ── */
        .hp-footer {
          border-top: 1px solid #e7e5e4;
          padding: 1.5rem 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: white;
        }
        .hp-footer-copy {
          font-size: 0.78rem;
          color: #a8a29e;
        }
        .hp-footer-brand {
          font-family: 'Playfair Display', serif;
          font-size: 0.85rem;
          color: #78350f;
          font-weight: 700;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hp-hero { grid-template-columns: 1fr; padding: 3rem 1.5rem 2rem; }
          .hp-hero-visual { display: none; }
          .hp-features-grid { grid-template-columns: repeat(2, 1fr); }
          .hp-roles-grid { grid-template-columns: 1fr; }
          .hp-nav { padding: 1rem 1.5rem; }
          .hp-features, .hp-login-section { padding-left: 1.5rem; padding-right: 1.5rem; }
          .hp-divider { padding: 0 1.5rem; }
        }
        @media (max-width: 560px) {
          .hp-features-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="hp-root">
        {/* NAV */}
        <nav className="hp-nav">
          <div className="hp-logo">
            <div className="hp-logo-icon">🐄</div>
            <span className="hp-logo-name">Gaushala</span>
          </div>
          <span className="hp-nav-tag">GAUSHALA MANAGEMENT SYSTEM</span>
        </nav>

        {/* HERO */}
        <section className="hp-hero" ref={heroRef}>
          <div>
            <div className="hp-hero-badge">Trusted Cattle Care Platform</div>
            <h1 className="hp-hero-title">
              Caring for every<br />
              <span>Sacred Life</span><br />
              with precision
            </h1>
            <p className="hp-hero-desc">
              A unified platform for Gaushalas to manage cattle health, rescued
              animals, vaccinations, and operations — from a single dashboard.
            </p>
            <div className="hp-hero-stats">
              <div className="hp-stat">
                <span className="hp-stat-num">360°</span>
                <span className="hp-stat-label">CATTLE VISIBILITY</span>
              </div>
              <div className="hp-stat">
                <span className="hp-stat-num">3</span>
                <span className="hp-stat-label">ROLE LEVELS</span>
              </div>
              <div className="hp-stat">
                <span className="hp-stat-num">∞</span>
                <span className="hp-stat-label">GAUSHALAS</span>
              </div>
            </div>
          </div>

          <div className="hp-hero-visual">
            <div className="hp-hero-card">
              <div className="hp-hero-card-header">
                <div className="hp-hero-cow-icon">🐄</div>
                <div>
                  <div className="hp-hero-card-title">Nandini #KSL-042</div>
                  <div className="hp-hero-card-id">Gaushala · Cow ID 042</div>
                </div>
              </div>
              {[
                { key: "Breed", val: "Gir Cow" },
                { key: "Age", val: "4 Years" },
                { key: "Last Vaccine", val: "FMD · 12 Jan" },
                { key: "Deworming", val: "15 Feb" },
                { key: "Health", val: <span className="hp-status-dot">Healthy</span> },
              ].map(({ key, val }) => (
                <div className="hp-hero-card-row" key={key}>
                  <span className="hp-hero-card-key">{key}</span>
                  <span className="hp-hero-card-val">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="hp-divider" />

        {/* FEATURES */}
        <section className="hp-features">
          <p className="hp-section-label">Platform Capabilities</p>
          <div className="hp-features-grid">
            {features.map((f) => (
              <div className="hp-feature-card" key={f.label}>
                <span className="hp-feature-emoji">{f.icon}</span>
                <div className="hp-feature-label">{f.label}</div>
                <div className="hp-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* LOGIN SECTION */}
        <section className="hp-login-section">
          <h2 className="hp-login-heading">Access your portal</h2>
          <p className="hp-login-sub">Select your role to continue to the login page.</p>
          <div className="hp-roles-grid">
            {roles.map((role) => (
              <div
                key={role.title}
                className="hp-role-card"
                style={{ borderColor: role.border, background: role.bg }}
                onClick={() => navigate(role.path)}
              >
                <div
                  className="hp-role-icon"
                  style={{ background: role.bg, border: `1px solid ${role.border}`, color: role.accent }}
                >
                  {role.icon}
                </div>
                <div className="hp-role-title">{role.title}</div>
                <div className="hp-role-subtitle" style={{ color: role.accent }}>{role.subtitle}</div>
                <div className="hp-role-desc">{role.description}</div>
                <button
                  className="hp-role-btn"
                  style={{ background: role.accent, color: "white" }}
                >
                  Login as {role.title}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
        {/* ── APPLY GAUSHALA SECTION ── */}
<section style={{
  background: "linear-gradient(135deg, #1a4731, #2d6a4f)",
  padding: "4rem 3rem",
  maxWidth: "100%",
}}>
  <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
    <div>
      <p style={{ fontSize: "0.72rem", color: "#a8d5b5", letterSpacing: "0.1em", marginBottom: "1rem", textTransform: "uppercase" }}>
        Join the Network
      </p>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: "white", fontWeight: "700", lineHeight: "1.2", marginBottom: "1rem" }}>
        Register Your<br />Gaushala with Us
      </h2>
      <p style={{ color: "#a8d5b5", fontSize: "14px", lineHeight: "1.8", marginBottom: "2rem" }}>
        Is your Gaushala not yet on the platform? Apply now. Fill in basic details and our Super Admin will review and approve your registration — giving you full access to manage cattle, health records, and more.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "2rem" }}>
        {["Submit basic Gaushala details", "Super Admin reviews and approves", "Get your Gaushala Admin login instantly", "Start managing cattle & operations"].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "24px", height: "24px", background: "#7b4f2e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "white", flexShrink: 0 }}>{i + 1}</span>
            <span style={{ color: "white", fontSize: "13px" }}>{step}</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate("/apply-gaushala")}
        style={{ padding: "14px 32px", background: "#7b4f2e", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
      >
        Apply Now — It's Free 🏛️
      </button>
    </div>
    <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: "20px", padding: "32px", border: "1px solid rgba(255,255,255,0.12)" }}>
      <h3 style={{ fontFamily: "'Playfair Display', serif", color: "white", fontSize: "1.1rem", marginBottom: "20px" }}>What you'll need:</h3>
      {[
        { icon: "🏛️", label: "Gaushala Name" },
        { icon: "📍", label: "Location & Pincode" },
        { icon: "📧", label: "Email Address" },
        { icon: "👤", label: "Admin Name & Password" },
      ].map(f => (
        <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: "22px" }}>{f.icon}</span>
          <span style={{ color: "white", fontSize: "13px", fontWeight: "500" }}>{f.label}</span>
        </div>
      ))}
    </div>
  </div>
</section>

{/* ── DONATION SECTION ── */}
<section style={{ background: "#fef9f0", padding: "4rem 3rem" }}>
  <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
    <p style={{ fontSize: "0.72rem", color: "#92400e", letterSpacing: "0.1em", marginBottom: "1rem", textTransform: "uppercase" }}>
      Support Sacred Lives
    </p>
    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", color: "#1c1917", fontWeight: "700", marginBottom: "1rem" }}>
      Donate to a <span style={{ color: "#b45309" }}>Gaushala</span>
    </h2>
    <p style={{ color: "#78716c", fontSize: "14px", maxWidth: "560px", margin: "0 auto 2.5rem", lineHeight: "1.8" }}>
      Your donation provides food, medicine, and shelter to rescued and resident cattle. Choose a Gaushala near you and contribute directly.
    </p>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "2.5rem" }}>
      {[
        { icon: "🌾", label: "₹100", desc: "Feeds a cow for a day" },
        { icon: "💊", label: "₹501", desc: "Medicine for a sick animal" },
        { icon: "🏥", label: "₹1001", desc: "Sponsors rescue care" },
      ].map(d => (
        <div key={d.label} style={{ background: "white", borderRadius: "16px", padding: "24px", border: "1px solid #e7e5e4" }}>
          <span style={{ fontSize: "2rem", display: "block", marginBottom: "8px" }}>{d.icon}</span>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: "700", color: "#b45309", margin: "0 0 4px" }}>{d.label}</p>
          <p style={{ color: "#78716c", fontSize: "12px", margin: 0 }}>{d.desc}</p>
        </div>
      ))}
    </div>
    <button
      onClick={() => navigate("/donate")}
      style={{ padding: "14px 40px", background: "#b45309", color: "white", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" }}
    >
      Donate Now 🐄
    </button>
  </div>
</section>

        {/* FOOTER */}
        <footer className="hp-footer">
          <span className="hp-footer-copy">© 2025 Gaushala. All rights reserved.</span>
          <span className="hp-footer-brand"> Gaushala Management</span>
        </footer>
      </div>
    </>
  );
}
