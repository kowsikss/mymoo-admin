import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import { API_BASE_URL } from "../api/client";

function AdminKosalaDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cows, setCows] = useState([]);
  const [kosala, setKosala] = useState(null);
  const [editingCow, setEditingCow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  if (localStorage.getItem("role") !== "admin") {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    try {
      const [cowsRes, kosalaRes] = await Promise.all([
        apiClient.get(`/api/cows/kosala/${id}`),
        apiClient.get(`/api/kosala/${id}`),
      ]);
      setCows(cowsRes.data);
      setKosala(kosalaRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cowId) => {
    if (window.confirm("Delete this cow?")) {
      try {
        await apiClient.delete(`/api/cows/${cowId}`);
        fetchData();
      } catch (err) {
        console.error("Error deleting cow:", err);
      }
    }
  };

  const handleEditClick = (cow) => {
    setEditingCow({ ...cow });
  };

  const handleChange = (e) => {
    setEditingCow({ ...editingCow, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await apiClient.put(
        `/api/cows/${editingCow._id}`,
        editingCow
      );
      setEditingCow(null);
      fetchData();
    } catch (err) {
      console.error("Error updating cow:", err);
    }
  };

  const cowCount  = cows.filter((c) => c.type === "cow").length;
  const bullCount = cows.filter((c) => c.type === "bull").length;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <div>
            <h2 style={{ marginBottom: "4px" }}>
              {kosala ? kosala.name : "Gaushala"} — Dashboard
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px" }}>
              Kosala ID: {id}
            </p>
          </div>
          <button
            onClick={() => navigate(`/admin/kosala/${id}/add-cow`)}
            style={{ background: "var(--accent-green)", color: "#0f1410" }}
          >
            + Add Cow
          </button>
        </div>

        {/* SUMMARY CARDS */}
        <div className="card-container" style={{ marginBottom: "32px" }}>
          <div className="card red">
            <h3>Total Cows 🐄</h3>
            <p>{cowCount}</p>
          </div>
          <div className="card orange">
            <h3>Total Bulls 🐂</h3>
            <p>{bullCount}</p>
          </div>
          <div className="card blue">
            <h3>Total Animals</h3>
            <p>{cows.length}</p>
          </div>
        </div>

        {/* COW TABLE */}
        <h3 className="section-title">Registered Animals</h3>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Cow ID</th>
                  <th>Type</th>
                  <th>Breed</th>
                  <th>Age</th>
                  <th>Weight (kg)</th>
                  <th>Bloodline</th>
                  <th>Signs</th>
                  <th>Height</th>
                  <th>Cage</th>
                  <th>Born Place</th>
                  <th>Owner</th>
                  <th>Reg. Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cows.length === 0 ? (
                  <tr>
                    <td colSpan="15" style={{ textAlign: "center" }}>
                      No animals registered yet
                    </td>
                  </tr>
                ) : (
                  cows.map((cow, index) => (
                    <tr key={cow._id}>
                      <td>{index + 1}</td>

                      {/* IMAGE */}
                      <td>
                        {cow.frontImage || cow.image ? (
                          <img
                            src={`${API_BASE_URL}/uploads/${
                              cow.frontImage || cow.image
                            }`}
                            alt="cow"
                            className="cow-thumb"
                            onClick={() =>
                              window.open(
                                `${API_BASE_URL}/uploads/${
                                  cow.frontImage || cow.image
                                }`,
                                "_blank"
                              )
                            }
                          />
                        ) : (
                          <span className="no-img">No Image</span>
                        )}
                      </td>

                      <td>{cow.cowId}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {cow.type || "-"}
                      </td>
                      <td>{cow.breed || "-"}</td>
                      <td>{cow.age || "-"}</td>
                      <td>{cow.weight || "-"}</td>
                      <td>{cow.bloodline || "-"}</td>
                      <td>{cow.signs || "-"}</td>
                      <td>{cow.height || "-"}</td>
                      <td>{cow.cage || "-"}</td>
                      <td>{cow.bornPlace || "-"}</td>
                      <td>{cow.owner || "-"}</td>
                      <td>{cow.registrationDate || "-"}</td>

                      <td>
                        <button onClick={() => handleEditClick(cow)}>✏️</button>
                        <button onClick={() => handleDelete(cow._id)}>❌</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* EDIT PANEL */}
        {editingCow && (
          <div className="edit-panel">
            <h3>Edit Cow Details</h3>

            <label>Cow ID</label>
            <input value={editingCow.cowId || ""} disabled />

            <label>Type</label>
            <select
              name="type"
              value={editingCow.type || ""}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="cow">Cow</option>
              <option value="bull">Bull</option>
            </select>

            <label>Breed</label>
            <input
              name="breed"
              value={editingCow.breed || ""}
              onChange={handleChange}
              placeholder="Breed"
            />

            <label>Age</label>
            <input
              name="age"
              type="number"
              value={editingCow.age || ""}
              onChange={handleChange}
              placeholder="Age"
            />

            <label>Weight (kg)</label>
            <input
              name="weight"
              type="number"
              value={editingCow.weight || ""}
              onChange={handleChange}
              placeholder="Weight"
            />

            <label>Bloodline</label>
            <input
              name="bloodline"
              value={editingCow.bloodline || ""}
              onChange={handleChange}
              placeholder="Bloodline"
            />

            <label>Signs</label>
            <textarea
              name="signs"
              value={editingCow.signs || ""}
              onChange={handleChange}
              placeholder="Signs"
            />

            <label>Height</label>
            <input
              name="height"
              value={editingCow.height || ""}
              onChange={handleChange}
              placeholder="Height"
            />

            <label>Cage</label>
            <input
              name="cage"
              value={editingCow.cage || ""}
              onChange={handleChange}
              placeholder="Cage"
            />

            <label>Born Place</label>
            <input
              name="bornPlace"
              value={editingCow.bornPlace || ""}
              onChange={handleChange}
              placeholder="Born Place"
            />

            <label>Owner</label>
            <input
              name="owner"
              value={editingCow.owner || ""}
              onChange={handleChange}
              placeholder="Owner"
            />

            <label>Registration Date</label>
            <input
              type="date"
              name="registrationDate"
              value={editingCow.registrationDate || ""}
              onChange={handleChange}
            />

            <div style={{ marginTop: "10px" }}>
              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditingCow(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default AdminKosalaDashboard;