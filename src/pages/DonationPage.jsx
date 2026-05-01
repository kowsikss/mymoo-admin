import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function DonationPage() {
  const navigate = useNavigate();
  const [gaushalas, setGaushalas] = useState([]);
  const [selected,  setSelected]  = useState(null);
  const [form, setForm] = useState({ donorName: "", donorEmail: "", donorPhone: "", amount: "", message: "" });
  const [loading,  setLoading]  = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [error,    setError]    = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/donations/gaushalas")
      .then(r => setGaushalas(r.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleDonate = async (e) => {
    e.preventDefault();
    setError("");
    if (!selected) { setError("Please select a Gaushala"); return; }
    if (!form.amount || Number(form.amount) < 1) { setError("Enter a valid amount (min ₹1)"); return; }
    try {
      setSubmitting(true);
      await axios.post("http://localhost:5000/api/donations", {
        kosalaId:   selected._id,
        kosalaName: selected.name,
        ...form,
        amount: Number(form.amount),
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Donation failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return (
    <div style={S.page}>
      <div style={S.panel}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{ fontSize: "64px" }}>🙏</div>
          <h2 style={S.h2}>Thank You for Your Donation!</h2>
          <p style={{ color: "#57534e", lineHeight: "1.7", marginBottom: "24px" }}>
            Your generous contribution of <strong>₹{form.amount}</strong> to <strong>{selected?.name}</strong> has been recorded.
            May the sacred cows bless you abundantly.
          </p>
          <button style={S.btnGreen} onClick={() => { setSuccess(false); setForm({ donorName: "", donorEmail: "", donorPhone: "", amount: "", message: "" }); setSelected(null); }}>
            Donate Again
          </button>
          <button style={{ ...S.btnGreen, background: "white", color: "#1a4731", border: "2px solid #1a4731", marginLeft: "12px" }} onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <span style={{ fontSize: "48px" }}>🐄</span>
        <h1 style={{ ...S.h2, fontSize: "2.2rem", marginTop: "12px" }}>Support a Gaushala</h1>
        <p style={{ color: "#78716c", fontSize: "14px", maxWidth: "500px", margin: "8px auto 0" }}>
          Your donation directly supports cattle care, rescued animals, medicines, and fodder for our sacred cows.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", maxWidth: "960px", width: "100%" }}>

        {/* LEFT — Gaushala selection */}
        <div>
          <h3 style={{ ...S.h3, marginBottom: "16px" }}>Choose a Gaushala</h3>
          {loading ? <p>Loading...</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "480px", overflowY: "auto" }}>
              {gaushalas.map(g => (
                <div
                  key={g._id}
                  onClick={() => setSelected(g)}
                  style={{
                    background: selected?._id === g._id ? "#f0fdf4" : "white",
                    border: `2px solid ${selected?._id === g._id ? "#1a4731" : "#e5e7eb"}`,
                    borderRadius: "14px",
                    padding: "16px",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "28px" }}>🏛️</span>
                    <div>
                      <p style={{ fontWeight: "600", color: "#1a4731", margin: 0, fontSize: "14px" }}>{g.name}</p>
                      <p style={{ color: "#78716c", fontSize: "12px", margin: "2px 0 0" }}>{g.address}</p>
                      <p style={{ color: "#a8a29e", fontSize: "11px", margin: "2px 0 0" }}>📮 {g.pincode}</p>
                    </div>
                    {selected?._id === g._id && (
                      <span style={{ marginLeft: "auto", color: "#1a4731", fontSize: "18px" }}>✓</span>
                    )}
                  </div>
                </div>
              ))}
              {gaushalas.length === 0 && <p style={{ color: "#78716c" }}>No Gaushalas available yet.</p>}
            </div>
          )}
        </div>

        {/* RIGHT — Donation form */}
        <div style={{ background: "white", borderRadius: "20px", padding: "28px", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>
          <h3 style={{ ...S.h3, marginBottom: "20px" }}>
            {selected ? `Donate to ${selected.name}` : "Select a Gaushala to Donate"}
          </h3>

          <form onSubmit={handleDonate}>
            {/* Quick amounts */}
            <p style={{ fontSize: "12px", color: "#78716c", marginBottom: "8px" }}>Quick Amount</p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
              {[100, 251, 501, 1001, 2501, 5001].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setForm({ ...form, amount: String(amt) })}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "999px",
                    border: `1.5px solid ${form.amount === String(amt) ? "#1a4731" : "#e5e7eb"}`,
                    background: form.amount === String(amt) ? "#1a4731" : "white",
                    color: form.amount === String(amt) ? "white" : "#374151",
                    fontSize: "12px", fontWeight: "600", cursor: "pointer",
                  }}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <label style={S.lbl}>Amount (₹) *</label>
            <input style={S.inp} type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Enter amount" min="1" required />

            <label style={S.lbl}>Your Name *</label>
            <input style={S.inp} name="donorName" value={form.donorName} onChange={handleChange} placeholder="Full name" required />

            <label style={S.lbl}>Email *</label>
            <input style={S.inp} type="email" name="donorEmail" value={form.donorEmail} onChange={handleChange} placeholder="your@email.com" required />

            <label style={S.lbl}>Phone Number *</label>
            <input style={S.inp} name="donorPhone" value={form.donorPhone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} required />

            <label style={S.lbl}>Message (optional)</label>
            <textarea style={{ ...S.inp, height: "60px", resize: "none" }} name="message" value={form.message} onChange={handleChange} placeholder="A note to the Gaushala..." />

            {error && <p style={{ color: "#dc2626", fontSize: "12px", marginBottom: "10px" }}>{error}</p>}

            <button type="submit" style={S.btnGreen} disabled={submitting || !selected}>
              {submitting ? "Processing..." : `Donate ${form.amount ? `₹${form.amount}` : ""}`}
            </button>
          </form>
        </div>
      </div>

      <p style={{ marginTop: "32px", color: "#a8a29e", fontSize: "12px", cursor: "pointer" }} onClick={() => navigate("/")}>
        ← Back to Home
      </p>
    </div>
  );
}

const S = {
  page:     { minHeight: "100vh", background: "linear-gradient(160deg, #f0fdf4 0%, #fafaf9 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "3rem 1.5rem", fontFamily: "DM Sans, sans-serif" },
  panel:    { background: "white", borderRadius: "20px", maxWidth: "520px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.10)" },
  h2:       { fontFamily: "Playfair Display, serif", fontSize: "1.6rem", fontWeight: "700", color: "#1a4731", margin: "0 0 8px" },
  h3:       { fontFamily: "Playfair Display, serif", fontSize: "1.1rem", fontWeight: "700", color: "#1a4731", margin: 0 },
  btnGreen: { padding: "12px 24px", background: "#1a4731", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "600", cursor: "pointer", width: "100%", fontFamily: "inherit" },
  lbl:      { display: "block", fontSize: "12px", fontWeight: "500", color: "#374151", marginBottom: "5px" },
  inp:      { width: "100%", padding: "9px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", marginBottom: "12px", boxSizing: "border-box", fontFamily: "inherit" },
};

export default DonationPage;