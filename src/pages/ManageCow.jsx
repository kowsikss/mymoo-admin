import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";

function ManageCow() {
  const [cows, setCows] = useState([]);
  const [editingCow, setEditingCow] = useState(null);

  const API = "http://localhost:5000/api/cows";

  const fetchCows = async () => {
    const res = await axios.get(API);
    setCows(res.data);
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const handleDelete = async (id) => {
    if (confirm("Delete this cow?")) {
      await axios.delete(`${API}/${id}`);
      fetchCows();
    }
  };

  const handleEditClick = (cow) => {
    setEditingCow({ ...cow });
  };

  const handleChange = (e) => {
    setEditingCow({
      ...editingCow,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    await axios.put(`${API}/${editingCow._id}`, editingCow);
    setEditingCow(null);
    fetchCows();
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>ADMIN | MANAGE COW</h2>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cow ID</th>
              <th>Bloodline</th>
              <th>Signs</th>
              <th>Weight</th>
              <th>Height</th>
              <th>Age</th>
              <th>Cage</th>
              <th>Born Place</th>
              <th>Owner</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cows.map((cow, index) => (
              <tr key={cow._id}>
  <td>{index + 1}</td>

  {/* ✅ IMAGE */}
  <td>
    {cow.image ? (
      <img
        src={`http://localhost:5000/uploads/${cow.image}`}
        alt="cow"
        className="cow-thumb"
        onClick={() =>
          window.open(
            `http://localhost:5000/uploads/${cow.image}`,
            "_blank"
          )
        }
      />
    ) : (
      <span className="no-img">No Image</span>
    )}
  </td>

  <td>{cow.cowId}</td>
  <td>{cow.bloodline}</td>
  <td>{cow.signs}</td>
  <td>{cow.weight}</td>
  <td>{cow.height}</td>
  <td>{cow.age}</td>
  <td>{cow.cage}</td>
  <td>{cow.bornPlace}</td>
  <td>{cow.owner}</td>

  <td>
    <button onClick={() => handleEditClick(cow)}>✏️</button>
    <button onClick={() => handleDelete(cow._id)}>❌</button>
  </td>
</tr>
            ))}
          </tbody>
        </table>

        {/* EDIT PANEL */}
        {editingCow && (
          <div className="edit-panel">
            <h3>Edit Cow Details</h3>

            {/* Cow ID (READ ONLY) */}
            <input
              value={editingCow.cowId || ""}
              disabled
            />

            <input
              name="bloodline"
              value={editingCow.bloodline || ""}
              onChange={handleChange}
              placeholder="Bloodline"
            />

            <textarea
              name="signs"
              value={editingCow.signs || ""}
              onChange={handleChange}
              placeholder="Signs"
            />

            <input
              name="weight"
              value={editingCow.weight || ""}
              onChange={handleChange}
              placeholder="Weight"
            />

            <input
              name="height"
              value={editingCow.height || ""}
              onChange={handleChange}
              placeholder="Height"
            />

            <input
              name="age"
              value={editingCow.age || ""}
              onChange={handleChange}
              placeholder="Age"
            />

            <input
              name="cage"
              value={editingCow.cage || ""}
              onChange={handleChange}
              placeholder="Cage"
            />

            <input
              name="bornPlace"
              value={editingCow.bornPlace || ""}
              onChange={handleChange}
              placeholder="Born Place"
            />

            <input
              name="owner"
              value={editingCow.owner || ""}
              onChange={handleChange}
              placeholder="Owner"
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

export default ManageCow;