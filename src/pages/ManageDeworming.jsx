import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function ManageDeworming() {
  const [records, setRecords] = useState([]);
  const [cows, setCows] = useState([]);
  const [editing, setEditing] = useState(null);

  const API = "http://localhost:5000/api/deworming";

  useEffect(() => {
    fetchRecords();
  }, []);

  if (localStorage.getItem("role") !== "doctor") {
    return <Navigate to="/" />;
  }

  const fetchRecords = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");

      // Step 1: Get all cows for this kosala
      const cowsRes = await axios.get(
        `http://localhost:5000/api/cows/kosala/${kosalaId}`
      );
      const cowData = cowsRes.data;
      setCows(cowData);

      // Step 2: Collect both _id and cowId formats
      const myCowObjectIds = cowData.map((cow) => cow._id);
      const myCowCustomIds = cowData.map((cow) => cow.cowId);

      // Step 3: Get all deworming records
      const dewormRes = await axios.get(API);

      // Step 4: Filter by matching cowId in either format
      const filtered = dewormRes.data.filter(
        (record) =>
          myCowObjectIds.includes(record.cowId) ||
          myCowCustomIds.includes(record.cowId)
      );

      console.log("All deworming records:", dewormRes.data);
      console.log("My cow IDs:", myCowCustomIds);
      console.log("Filtered records:", filtered);

      setRecords(filtered);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchRecords();
      } catch (err) {
        console.error("Error deleting record:", err);
      }
    }
  };

  const handleEditClick = (record) => {
    setEditing({ ...record });
  };

  const handleChange = (e) => {
    setEditing({
      ...editing,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/${editing._id}`, editing);
      setEditing(null);
      fetchRecords();
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>MANAGE DEWORMING</h2>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Cow ID</th>
              <th>Date</th>
              <th>Drug</th>
              <th>Dosage</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No deworming records found
                </td>
              </tr>
            ) : (
              records.map((rec, index) => (
                <tr key={rec._id}>
                  <td>{index + 1}</td>
                  <td>{rec.cowId}</td>
                  <td>{rec.date}</td>
                  <td>{rec.drug}</td>
                  <td>{rec.dosage}</td>
                  <td>{rec.description}</td>
                  <td>
                    <button onClick={() => handleEditClick(rec)}>✏️</button>
                    <button onClick={() => handleDelete(rec._id)}>❌</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {editing && (
          <div className="edit-panel">
            <h3>Edit Deworming</h3>

            <label>Cow ID</label>
            <select
              name="cowId"
              value={editing.cowId}
              onChange={handleChange}
            >
              {cows.map((cow) => (
                <option key={cow._id} value={cow.cowId}>
                  {cow.cowId}
                </option>
              ))}
            </select>

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={editing.date}
              onChange={handleChange}
            />

            <label>Drug</label>
            <input
              name="drug"
              value={editing.drug}
              onChange={handleChange}
            />

            <label>Dosage</label>
            <input
              name="dosage"
              value={editing.dosage}
              onChange={handleChange}
            />

            <label>Description</label>
            <textarea
              name="description"
              value={editing.description}
              onChange={handleChange}
            />

            <div style={{ marginTop: "10px" }}>
              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditing(null)}
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

export default ManageDeworming;