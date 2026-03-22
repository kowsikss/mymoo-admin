import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function ManageCattleInfo() {
  const [records, setRecords] = useState([]);
  const [cows, setCows] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const navigate = useNavigate();

  const API = "http://localhost:5000/api/cattle";

  useEffect(() => {
    fetchData();
  }, []);

  if (localStorage.getItem("role") !== "doctor") {
    return <Navigate to="/" />;
  }

  const fetchData = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");

      const cowsRes = await axios.get(
        `http://localhost:5000/api/cows/kosala/${kosalaId}`
      );
      setCows(cowsRes.data);

      const res = await axios.get(`${API}/kosala/${kosalaId}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching cattle info:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchData();
      } catch (err) {
        console.error("Error deleting:", err);
      }
    }
  };

  const handleEdit = (rec) => {
    setEditRecord({ ...rec });
  };

  const handleChange = (e) => {
    setEditRecord({ ...editRecord, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/${editRecord._id}`, editRecord);
      setEditRecord(null);
      fetchData();
    } catch (err) {
      console.error("Error updating:", err);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>MANAGE CATTLE INFO</h2>

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Cow ID</th>
                <th>Insemination Date</th>
                <th>Straw Details</th>
                <th>Pregnancy Date</th>
                <th>Pregnancy Status</th>
                <th>Last Calving</th>
                <th>Gestation Date</th>
                <th>Trial Count</th>
                <th>Calving Time</th>
                <th>Parturition Date</th>
                <th>Calf Status</th>
                <th>Calf Sex</th>
                <th>Milk Yield (L)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="15" style={{ textAlign: "center" }}>
                    No cattle info records found
                  </td>
                </tr>
              ) : (
                records.map((rec, index) => (
                  <tr key={rec._id}>
                    <td>{index + 1}</td>
                    <td>{rec.cowId}</td>
                    <td>{rec.inseminationDate || "-"}</td>
                    <td>{rec.strawDetails || "-"}</td>
                    <td>{rec.pregnancyDate || "-"}</td>
                    <td>{rec.pregnancyStatus || "-"}</td>
                    <td>{rec.lastCalvingDate || "-"}</td>
                    <td>{rec.gestationDate || "-"}</td>
                    <td>{rec.trialCount ?? "-"}</td>
                    <td>{rec.calvingTime || "-"}</td>
                    <td>{rec.parturitionDate || "-"}</td>
                    <td>{rec.calfStatus || "-"}</td>
                    <td>{rec.calfSex || "-"}</td>
                    <td>{rec.milkYield ?? "-"}</td>
                    <td>
                      <button onClick={() => handleEdit(rec)}>✏️</button>
                      <button onClick={() => handleDelete(rec._id)}>❌</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* EDIT PANEL */}
        {editRecord && (
          <div className="edit-panel">
            <h3>Edit Cattle Info</h3>

            <label>Cow ID</label>
            <select
              name="cowId"
              value={editRecord.cowId}
              onChange={handleChange}
            >
              {cows.map((cow) => (
                <option key={cow._id} value={cow.cowId}>
                  {cow.cowId}
                </option>
              ))}
            </select>

            <label>Insemination Date</label>
            <input type="date" name="inseminationDate"
              value={editRecord.inseminationDate || ""} onChange={handleChange} />

            <label>Straw Details</label>
            <input name="strawDetails"
              value={editRecord.strawDetails || ""} onChange={handleChange} />

            <label>Pregnancy Date</label>
            <input type="date" name="pregnancyDate"
              value={editRecord.pregnancyDate || ""} onChange={handleChange} />

            <label>Pregnancy Status</label>
            <select name="pregnancyStatus"
              value={editRecord.pregnancyStatus || ""} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="Aborted">Aborted</option>
            </select>

            <label>Last Calving Date</label>
            <input type="date" name="lastCalvingDate"
              value={editRecord.lastCalvingDate || ""} onChange={handleChange} />

            <label>Gestation Date</label>
            <input type="date" name="gestationDate"
              value={editRecord.gestationDate || ""} onChange={handleChange} />

            <label>Trial Count</label>
            <input type="number" name="trialCount"
              value={editRecord.trialCount || ""} onChange={handleChange} />

            <label>Calving Time</label>
            <input name="calvingTime"
              value={editRecord.calvingTime || ""} onChange={handleChange}
              placeholder="e.g. Morning / 06:00" />

            <label>Parturition Date</label>
            <input type="date" name="parturitionDate"
              value={editRecord.parturitionDate || ""} onChange={handleChange} />

            <label>Calf Status</label>
            <select name="calfStatus"
              value={editRecord.calfStatus || ""} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
            </select>

            <label>Calf Sex</label>
            <select name="calfSex"
              value={editRecord.calfSex || ""} onChange={handleChange}>
              <option value="">-- Select --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <label>Milk Yield (Litres)</label>
            <input type="number" name="milkYield"
              value={editRecord.milkYield || ""} onChange={handleChange} />

            <div style={{ marginTop: "10px" }}>
              <button className="update-btn" onClick={handleUpdate}>
                Update
              </button>
              <button className="cancel-btn" onClick={() => setEditRecord(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageCattleInfo;