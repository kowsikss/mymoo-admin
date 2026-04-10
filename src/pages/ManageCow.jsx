// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import RoleSidebar from "../components/RoleSidebar";
// import Navbar from "../components/Navbar";
// import "../styles/dashboard.css";
// import axios from "axios";

// function ManageCow() {
//   const [cows,       setCows]       = useState([]);
//   const [editingCow, setEditingCow] = useState(null);

//   const API = "http://localhost:5000/api/cows";

//   const fetchCows = async () => {
//     try {
//       const kosalaId = localStorage.getItem("kosalaId");
//       const res = await axios.get(`${API}/kosala/${kosalaId}`);
//       setCows(res.data);
//     } catch (err) {
//       console.error("Error fetching cows:", err);
//     }
//   };

//   useEffect(() => {
//     fetchCows();
//   }, []);

//   const role = localStorage.getItem("role");
//   if (role !== "admin" && role !== "kosala-admin") {
//     return <Navigate to="/" />;
//   }

//   const handleDelete = async (id) => {
//     if (window.confirm("Delete this cow?")) {
//       try {
//         await axios.delete(`${API}/${id}`);
//         fetchCows();
//       } catch (err) {
//         console.error("Error deleting cow:", err);
//       }
//     }
//   };

//   const handleEditClick = (cow) => setEditingCow({ ...cow });

//   const handleChange = (e) => {
//     setEditingCow({ ...editingCow, [e.target.name]: e.target.value });
//   };

//   const handleUpdate = async () => {
//     try {
//       await axios.put(`${API}/${editingCow._id}`, editingCow);
//       setEditingCow(null);
//       fetchCows();
//     } catch (err) {
//       console.error("Error updating cow:", err);
//     }
//   };

//   return (
//     <div className="layout">
//       <RoleSidebar />
//       <div className="main">
//         <Navbar />

//         <h2>MANAGE COWS</h2>

//         {/* SUMMARY CARDS */}
//         <div className="card-container" style={{ marginBottom: "24px" }}>
//           <div className="card red">
//             <h3>Total Cows</h3>
//             <p>{cows.filter((c) => c.type === "cow").length}</p>
//           </div>
//           <div className="card orange">
//             <h3>Total Bulls</h3>
//             <p>{cows.filter((c) => c.type === "bull").length}</p>
//           </div>
//           <div className="card blue">
//             <h3>Total Animals</h3>
//             <p>{cows.length}</p>
//           </div>
//         </div>

//         <div className="table-wrapper">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>#</th>
//                 <th>Image</th>
//                 <th>Cow ID</th>
//                 <th>Type</th>
//                 <th>Breed</th>
//                 <th>Age</th>
//                 <th>Weight (kg)</th>
//                 <th>Tag No</th>
//                 <th>Health Status</th>
//                 <th>Insurance</th>
//                 <th>Reg. Date</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {cows.length === 0 ? (
//                 <tr>
//                   <td colSpan="12" style={{ textAlign: "center" }}>
//                     No cows found
//                   </td>
//                 </tr>
//               ) : (
//                 cows.map((cow, index) => (
//                   <tr key={cow._id}>
//                     <td>{index + 1}</td>
//                     <td>
//                       {cow.frontImage || cow.image ? (
//                         <img
//                           src={`http://localhost:5000/uploads/${cow.frontImage || cow.image}`}
//                           alt="cow"
//                           className="cow-thumb"
//                           onClick={() =>
//                             window.open(
//                               `http://localhost:5000/uploads/${cow.frontImage || cow.image}`,
//                               "_blank"
//                             )
//                           }
//                         />
//                       ) : (
//                         <span className="no-img">No Image</span>
//                       )}
//                     </td>
//                     <td>{cow.cowId}</td>
//                     <td style={{ textTransform: "capitalize" }}>{cow.type || "-"}</td>
//                     <td>{cow.breed || "-"}</td>
//                     <td>{cow.age ? `${cow.age} ${cow.ageUnit || "yrs"}` : "-"}</td>
//                     <td>{cow.weight || "-"}</td>
//                     <td>{cow.tagNumber || "-"}</td>
//                     <td>{cow.healthStatus || "-"}</td>
//                     <td>{cow.insuranceStatus || "-"}</td>
//                     <td>{cow.registrationDate || "-"}</td>
//                     <td>
//                       <button onClick={() => handleEditClick(cow)}>✏️</button>
//                       <button onClick={() => handleDelete(cow._id)}>❌</button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {editingCow && (
//           <div className="edit-panel">
//             <h3>Edit Cow Details</h3>

//             <label>Cow ID</label>
//             <input value={editingCow.cowId || ""} disabled />

//             <label>Type</label>
//             <select name="type" value={editingCow.type || ""} onChange={handleChange}>
//               <option value="">Select Type</option>
//               <option value="cow">Cow</option>
//               <option value="bull">Bull</option>
//             </select>

//             <label>Age</label>
//             <input type="number" name="age"
//               value={editingCow.age || ""} onChange={handleChange} placeholder="Age" />

//             <label>Weight (kg)</label>
//             <input type="number" name="weight"
//               value={editingCow.weight || ""} onChange={handleChange} placeholder="Weight" />

//             <label>Tag Number</label>
//             <input name="tagNumber"
//               value={editingCow.tagNumber || ""} onChange={handleChange} placeholder="Tag Number" />

//             <label>Health Status</label>
//             <select name="healthStatus" value={editingCow.healthStatus || ""} onChange={handleChange}>
//               <option value="">-- Select --</option>
//               <option value="Healthy">Healthy</option>
//               <option value="Under Treatment">Under Treatment</option>
//               <option value="Calved">Calved</option>
//               <option value="Deceased">Deceased</option>
//             </select>

//             <label>Insurance Status</label>
//             <select name="insuranceStatus" value={editingCow.insuranceStatus || ""} onChange={handleChange}>
//               <option value="">-- Select --</option>
//               <option value="Yes">Yes</option>
//               <option value="No">No</option>
//             </select>

//             <label>Registration Date</label>
//             <input type="date" name="registrationDate"
//               value={editingCow.registrationDate || ""} onChange={handleChange} />

//             <div style={{ marginTop: "10px" }}>
//               <button className="update-btn" onClick={handleUpdate}>Update</button>
//               <button className="cancel-btn" onClick={() => setEditingCow(null)}>Cancel</button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ManageCow;
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import RoleSidebar from "../components/RoleSidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import axios from "axios";

function ManageCow() {
  const [cows,       setCows]       = useState([]);
  const [editingCow, setEditingCow] = useState(null);

  const API = "http://localhost:5000/api/cows";

  const fetchCows = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");
      const res = await axios.get(`${API}/kosala/${kosalaId}`);
      setCows(res.data);
    } catch (err) {
      console.error("Error fetching cows:", err);
    }
  };

  useEffect(() => {
    fetchCows();
  }, []);

  const role = localStorage.getItem("role");
  if (role !== "admin" && role !== "kosala-admin") {
    return <Navigate to="/" />;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Delete this cow?")) {
      try {
        await axios.delete(`${API}/${id}`);
        fetchCows();
      } catch (err) {
        console.error("Error deleting cow:", err);
      }
    }
  };

  const handleEditClick = (cow) => setEditingCow({ ...cow });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingCow((prev) => {
      const updated = { ...prev, [name]: value };
      // ✅ Clear death fields if health status changed away from Deceased
      if (name === "healthStatus" && value !== "Deceased") {
        updated.dateOfDeath  = "";
        updated.causeOfDeath = "";
      }
      return updated;
    });
  };

  const handleUpdate = async () => {
    // ✅ Validate death fields if Deceased is selected
    if (editingCow.healthStatus === "Deceased" && !editingCow.dateOfDeath) {
      alert("Please enter the Date of Death for a deceased animal.");
      return;
    }
    try {
      await axios.put(`${API}/${editingCow._id}`, editingCow);
      setEditingCow(null);
      fetchCows();
    } catch (err) {
      console.error("Error updating cow:", err);
    }
  };

  return (
    <div className="layout">
      <RoleSidebar />
      <div className="main">
        <Navbar />

        <h2>MANAGE COWS</h2>

        {/* SUMMARY CARDS */}
        <div className="card-container" style={{ marginBottom: "24px" }}>
          <div className="card red">
            <h3>Total Cows</h3>
            <p>{cows.filter((c) => c.type === "cow").length}</p>
          </div>
          <div className="card orange">
            <h3>Total Bulls</h3>
            <p>{cows.filter((c) => c.type === "bull").length}</p>
          </div>
          <div className="card blue">
            <h3>Total Animals</h3>
            <p>{cows.length}</p>
          </div>
          {/* ✅ new deceased count card */}
          <div className="card dark">
            <h3>Deceased 💀</h3>
            <p>{cows.filter((c) => c.healthStatus === "Deceased").length}</p>
          </div>
        </div>

        {/* TABLE */}
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
                <th>Tag No</th>
                <th>Health Status</th>
                <th>Insurance</th>
                <th>Reg. Date</th>
                <th>Date of Death</th>   {/* ✅ new column */}
                <th>Cause of Death</th>  {/* ✅ new column */}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cows.length === 0 ? (
                <tr>
                  <td colSpan="14" style={{ textAlign: "center" }}>
                    No cows found
                  </td>
                </tr>
              ) : (
                cows.map((cow, index) => (
                  <tr key={cow._id}>
                    <td>{index + 1}</td>
                    <td>
                      {cow.frontImage || cow.image ? (
                        <img
                          src={`http://localhost:5000/uploads/${cow.frontImage || cow.image}`}
                          alt="cow"
                          className="cow-thumb"
                          onClick={() =>
                            window.open(
                              `http://localhost:5000/uploads/${cow.frontImage || cow.image}`,
                              "_blank"
                            )
                          }
                        />
                      ) : (
                        <span className="no-img">No Image</span>
                      )}
                    </td>
                    <td>{cow.cowId}</td>
                    <td style={{ textTransform: "capitalize" }}>{cow.type || "-"}</td>
                    <td>{cow.breed || "-"}</td>
                    <td>{cow.age ? `${cow.age} ${cow.ageUnit || "yrs"}` : "-"}</td>
                    <td>{cow.weight || "-"}</td>
                    <td>{cow.tagNumber || "-"}</td>
                    <td>
                      {/* ✅ colour-coded health status */}
                      <span style={{
                        fontWeight: 600,
                        fontSize: "13px",
                        color:
                          cow.healthStatus === "Healthy"         ? "var(--accent-green)"  :
                          cow.healthStatus === "Deceased"        ? "var(--accent-red)"    :
                          cow.healthStatus === "Under Treatment" ? "var(--accent-amber)"  :
                          "var(--text-secondary)",
                      }}>
                        {cow.healthStatus || "-"}
                      </span>
                    </td>
                    <td>{cow.insuranceStatus || "-"}</td>
                    <td>{cow.registrationDate || "-"}</td>
                    {/* ✅ death columns */}
                    <td>
                      {cow.healthStatus === "Deceased" && cow.dateOfDeath
                        ? new Date(cow.dateOfDeath).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td>{cow.healthStatus === "Deceased" ? (cow.causeOfDeath || "-") : "-"}</td>
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

        {/* EDIT PANEL */}
        {editingCow && (
          <div className="edit-panel">
            <h3>Edit Cow Details</h3>

            <label>Cow ID</label>
            <input value={editingCow.cowId || ""} disabled />

            <label>Type</label>
            <select name="type" value={editingCow.type || ""} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="cow">Cow</option>
              <option value="bull">Bull</option>
            </select>

            <label>Age</label>
            <input
              type="number"
              name="age"
              value={editingCow.age || ""}
              onChange={handleChange}
              placeholder="Age"
            />

            <label>Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={editingCow.weight || ""}
              onChange={handleChange}
              placeholder="Weight"
            />

            <label>Tag Number</label>
            <input
              name="tagNumber"
              value={editingCow.tagNumber || ""}
              onChange={handleChange}
              placeholder="Tag Number"
            />

            <label>Health Status</label>
            <select
              name="healthStatus"
              value={editingCow.healthStatus || ""}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="Healthy">Healthy</option>
              <option value="Under Treatment">Under Treatment</option>
              <option value="Calved">Calved</option>
              <option value="Deceased">Deceased</option>
            </select>

            {/* ✅ Death fields — only shown when Deceased is selected */}
            {editingCow.healthStatus === "Deceased" && (
              <>
                <div style={{
                  background: "rgba(232,107,90,0.08)",
                  border: "1px solid rgba(232,107,90,0.3)",
                  borderRadius: "10px",
                  padding: "16px",
                  marginTop: "4px",
                  marginBottom: "4px",
                }}>
                  <p style={{
                    color: "var(--accent-red)",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginBottom: "12px",
                  }}>
                    💀 Death Record
                  </p>

                  <label>
                    Date of Death <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfDeath"
                    value={editingCow.dateOfDeath || ""}
                    onChange={handleChange}
                    required
                  />

                  <label>Cause of Death</label>
                  <select
                    name="causeOfDeath"
                    value={editingCow.causeOfDeath || ""}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Cause --</option>
                    <option value="Disease">Disease</option>
                    <option value="Accident">Accident</option>
                    <option value="Old Age">Old Age</option>
                    <option value="Injury">Injury</option>
                    <option value="Poisoning">Poisoning</option>
                    <option value="Complications during calving">
                      Complications during calving
                    </option>
                    <option value="Unknown">Unknown</option>
                    <option value="Other">Other</option>
                  </select>

                  {/* If cause is Other, allow free text */}
                  {editingCow.causeOfDeath === "Other" && (
                    <>
                      <label>Specify Cause</label>
                      <input
                        name="causeOfDeath"
                        value={editingCow.causeOfDeath === "Other" ? "" : editingCow.causeOfDeath}
                        onChange={handleChange}
                        placeholder="Enter cause of death"
                      />
                    </>
                  )}
                </div>
              </>
            )}

            <label>Insurance Status</label>
            <select
              name="insuranceStatus"
              value={editingCow.insuranceStatus || ""}
              onChange={handleChange}
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <label>Registration Date</label>
            <input
              type="date"
              name="registrationDate"
              value={editingCow.registrationDate || ""}
              onChange={handleChange}
            />

            <div style={{ marginTop: "10px" }}>
              <button className="update-btn" onClick={handleUpdate}>Update</button>
              <button className="cancel-btn" onClick={() => setEditingCow(null)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ManageCow;
