import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { API_BASE_URL } from "../api/client";
import GaushalaMap from "../components/GaushalaMap";
import "../components/GaushalaMap.css";
import "./DonorDashboard.css";

const emptyForm = {
  donorName: "",
  donorEmail: "",
  donorPhone: "",
  amount: "",
  message: "",
};

const getCowImageUrl = (cow) => {
  const image = cow.frontImage || cow.image || cow.frontImageUrl;
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${API_BASE_URL}${image.startsWith("/") ? image : `/uploads/${image}`}`;
};

const geocodePincode = async (pincode) => {
  if (!pincode) return null;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&country=India&postalcode=${encodeURIComponent(pincode)}`
    );
    const places = await response.json();
    if (!places[0]) return null;

    return {
      lat: Number(places[0].lat),
      lon: Number(places[0].lon),
    };
  } catch (error) {
    console.warn(`Could not locate pincode ${pincode}:`, error);
    return null;
  }
};

function DonorDashboard() {
  const navigate = useNavigate();
  const [gaushalas, setGaushalas] = useState([]);
  const [selectedGaushala, setSelectedGaushala] = useState(null);
  const [cows, setCows] = useState([]);
  const [selectedCow, setSelectedCow] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [cowsLoading, setCowsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchGaushalas = async () => {
      try {
        const response = await apiClient.get("/api/kosala/full");
        const registeredGaushalas = response.data;
        const locatedGaushalas = [];

        for (const gaushala of registeredGaushalas) {
          if (gaushala.lat && gaushala.lon) {
            locatedGaushalas.push(gaushala);
            continue;
          }

          const location = await geocodePincode(gaushala.pincode);
          locatedGaushalas.push({ ...gaushala, ...location });
        }

        setGaushalas(locatedGaushalas);
      } catch (error) {
        console.error("Unable to load registered Gaushalas:", error);
        setNotice({ type: "error", text: "We could not load the Gaushala network right now." });
      } finally {
        setLoading(false);
      }
    };

    fetchGaushalas();
  }, []);

  const selectGaushala = async (gaushala) => {
    setSelectedGaushala(gaushala);
    setSelectedCow(null);
    setNotice({ type: "", text: "" });
    setCowsLoading(true);

    try {
      const response = await apiClient.get(`/api/cows/kosala/${gaushala._id}`);
      setCows(response.data);
    } catch (error) {
      console.error("Unable to load Gaushala cows:", error);
      setCows([]);
      setNotice({ type: "error", text: "The cow records could not be loaded." });
    } finally {
      setCowsLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const selectCow = (cow) => {
    setSelectedCow(cow);
    setNotice({ type: "", text: "" });
    window.setTimeout(() => {
      document.querySelector(".donor-cow-side")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  };

  const handleDonate = async (event) => {
    event.preventDefault();
    setNotice({ type: "", text: "" });

    if (!selectedGaushala || !selectedCow) {
      setNotice({ type: "error", text: "Choose a cow before donating." });
      return;
    }

    if (!form.amount || Number(form.amount) < 1) {
      setNotice({ type: "error", text: "Enter a valid donation amount." });
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post("/api/donations", {
        kosalaId: selectedGaushala._id,
        kosalaName: selectedGaushala.name,
        cowId: selectedCow.cowId || selectedCow._id,
        cowName: selectedCow.name || selectedCow.cowId || "Selected cow",
        ...form,
        amount: Number(form.amount),
      });
      setNotice({ type: "success", text: `Thank you. Your donation is supporting ${selectedCow.cowId || "this cow"}.` });
      setForm(emptyForm);
    } catch (error) {
      console.error("Donation failed:", error);
      setNotice({ type: "error", text: error.response?.data?.message || "Donation failed. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="donor-page">
      <nav className="donor-nav">
        <button type="button" className="donor-brand" onClick={() => navigate("/")}>
          <span className="donor-brand__mark">🐄</span>
          <span>Gaushala Network</span>
        </button>
        <button type="button" className="donor-back" onClick={() => navigate("/")}>Back to home</button>
      </nav>

      <header className="donor-hero">
        <div>
          <p className="donor-eyebrow">Open to every kind heart</p>
          <h1>Find a Gaushala.<br /><span>Care for one cow.</span></h1>
          <p className="donor-lead">Explore registered Gaushalas across the network, meet the animals in their care, and make a donation where it matters most.</p>
        </div>
        <div className="donor-hero__stat">
          <strong>{gaushalas.length}</strong>
          <span>registered Gaushalas</span>
        </div>
      </header>

      {notice.text && <p className={`donor-notice donor-notice--${notice.type}`}>{notice.text}</p>}

      <section className="donor-map-section">
        {loading ? <div className="donor-loading">Loading the Gaushala network...</div> : <GaushalaMap gaushalas={gaushalas} onGaushalaSelect={selectGaushala} />}
      </section>

      <section className="donor-network">
        <div className="donor-section-heading">
          <div>
            <p className="donor-eyebrow">The network</p>
            <h2>Registered Gaushalas</h2>
          </div>
          <span>{gaushalas.length} locations</span>
        </div>

        {gaushalas.length === 0 && !loading ? (
          <p className="donor-empty">No registered Gaushalas are available yet.</p>
        ) : (
          <div className="donor-gaushala-grid">
            {gaushalas.map((gaushala) => (
              <button
                type="button"
                className={`donor-gaushala-card ${selectedGaushala?._id === gaushala._id ? "is-selected" : ""}`}
                key={gaushala._id}
                onClick={() => selectGaushala(gaushala)}
              >
                <span className="donor-gaushala-card__icon">🏛️</span>
                <span className="donor-gaushala-card__body">
                  <strong>{gaushala.name}</strong>
                  <small>{gaushala.address || "Location details unavailable"}</small>
                  <small>{gaushala.totalCows || 0} cows in care</small>
                </span>
                <span className="donor-gaushala-card__arrow">→</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {selectedGaushala && (
        <section className="donor-detail" aria-live="polite">
          <div className="donor-section-heading">
            <div>
              <p className="donor-eyebrow">Gaushala profile</p>
              <h2>{selectedGaushala.name}</h2>
              <p className="donor-detail__address">{selectedGaushala.address || "Registered Gaushala"}</p>
            </div>
            <div className="donor-detail__count"><strong>{selectedGaushala.totalCows || cows.length}</strong><span>cows in care</span></div>
          </div>

          {cowsLoading ? <div className="donor-loading">Loading cows...</div> : (
            <div className="donor-cow-layout">
              <div className="donor-cow-list">
                <div className="donor-list-label">Choose a cow to support</div>
                {cows.length === 0 ? <p className="donor-empty">No cow records are available for this Gaushala.</p> : cows.map((cow) => (
                  <button
                    type="button"
                    className={`donor-cow-row ${selectedCow?._id === cow._id ? "is-selected" : ""}`}
                    key={cow._id}
                    onClick={() => selectCow(cow)}
                  >
                    {getCowImageUrl(cow) ? (
                      <img className="donor-cow-row__image" src={getCowImageUrl(cow)} alt="" />
                    ) : (
                      <span className="donor-cow-row__avatar">🐄</span>
                    )}
                    <span><strong>{cow.cowId || cow._id}</strong><small>{cow.breed?.name || cow.breed || "Breed not listed"} · {cow.age ? `${cow.age} ${cow.ageUnit || "yrs"}` : "Age not listed"}</small></span>
                    <span className="donor-cow-row__arrow">→</span>
                  </button>
                ))}
              </div>

              <div className="donor-cow-side">
                {selectedCow && (
                  <article className="donor-cow-profile">
                    <div className="donor-cow-profile__photo">
                      {getCowImageUrl(selectedCow) ? (
                        <img src={getCowImageUrl(selectedCow)} alt={`${selectedCow.cowId || "Cow"} profile`} />
                      ) : (
                        <span>🐄</span>
                      )}
                    </div>
                    <div className="donor-cow-profile__content">
                      <p className="donor-eyebrow">Cow profile</p>
                      <h3>{selectedCow.cowId || "Registered cow"}</h3>
                      <div className="donor-cow-facts">
                        <span><small>Breed</small><strong>{selectedCow.breed?.name || selectedCow.breed || "Not listed"}</strong></span>
                        <span><small>Age</small><strong>{selectedCow.age ? `${selectedCow.age} ${selectedCow.ageUnit || "yrs"}` : "Not listed"}</strong></span>
                        <span><small>Weight</small><strong>{selectedCow.weight ? `${selectedCow.weight} kg` : "Not listed"}</strong></span>
                        <span><small>Tag no.</small><strong>{selectedCow.tagNumber || "Not listed"}</strong></span>
                        <span><small>Health</small><strong>{selectedCow.healthStatus || "Not listed"}</strong></span>
                      </div>
                    </div>
                  </article>
                )}

                <form className="donor-form" onSubmit={handleDonate}>
                  <p className="donor-eyebrow">Make it personal</p>
                  <h3>{selectedCow ? `Support ${selectedCow.cowId || "this cow"}` : "Select a cow first"}</h3>
                  <div className="donor-quick-amounts">{[100, 251, 501, 1001].map((amount) => <button type="button" key={amount} className={form.amount === String(amount) ? "is-active" : ""} onClick={() => setForm({ ...form, amount: String(amount) })}>₹{amount}</button>)}</div>
                  <label>Amount (₹)<input type="number" name="amount" min="1" value={form.amount} onChange={handleChange} placeholder="Enter amount" required /></label>
                  <label>Your name<input name="donorName" value={form.donorName} onChange={handleChange} placeholder="Full name" required /></label>
                  <label>Email<input type="email" name="donorEmail" value={form.donorEmail} onChange={handleChange} placeholder="you@example.com" required /></label>
                  <label>Phone<input name="donorPhone" value={form.donorPhone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} required /></label>
                  <label>Message <span>(optional)</span><textarea name="message" value={form.message} onChange={handleChange} placeholder="A note for the Gaushala" /></label>
                  <button className="donor-submit" type="submit" disabled={!selectedCow || submitting}>{submitting ? "Recording donation..." : selectedCow ? `Donate to ${selectedCow.cowId || "this cow"}` : "Select a cow to continue"}</button>
                </form>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}

export default DonorDashboard;
