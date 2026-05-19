// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import RoleSidebar from "../components/RoleSidebar";
// import Navbar from "../components/Navbar";
// import "../styles/dashboard.css";
// import axios from "axios";

// function ManageCow() {
//   const [cows,       setCows]       = useState([]);
//   const [editingCow, setEditingCow] = useState(null);

//   const API = "/api/cows";

//   const fetchCows = async () => {
//     try {
//       const kosalaId = localStorage.getItem("kosalaId");
//       const res = await apiClient.get(`${API}/kosala/${kosalaId}`);
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
//         await apiClient.delete(`${API}/${id}`);
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
//       await apiClient.put(`${API}/${editingCow._id}`, editingCow);
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
//                           src={`${API_BASE_URL}/uploads/${cow.frontImage || cow.image}`}
//                           alt="cow"
//                           className="cow-thumb"
//                           onClick={() =>
//                             window.open(
//                               `${API_BASE_URL}/uploads/${cow.frontImage || cow.image}`,
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
import apiClient from "../api/client";

function ManageCow() {

  const [cows, setCows] = useState([]);
  const [editingCow, setEditingCow] = useState(null);

  const API = "/api/cows";

  // FETCH COWS
  const fetchCows = async () => {

    try {

      const kosalaId = localStorage.getItem("kosalaId");

      const res = await apiClient.get(
        `${API}/kosala/${kosalaId}`
      );

      setCows(res.data);

    } catch (err) {

      console.error(
        "Error fetching cows:",
        err
      );

    }

  };

  useEffect(() => {
    fetchCows();
  }, []);

  // ROLE CHECK
  const role = localStorage.getItem("role");

  if (
    role !== "admin" &&
    role !== "kosala-admin"
  ) {
    return <Navigate to="/" />;
  }

  // DELETE
  const handleDelete = async (id) => {

    if (window.confirm("Delete this cow?")) {

      try {

        await apiClient.delete(
          `${API}/${id}`
        );

        fetchCows();

      } catch (err) {

        console.error(
          "Error deleting cow:",
          err
        );

      }

    }

  };

  // EDIT
  const handleEditClick = (cow) => {
    setEditingCow({ ...cow });
  };

  // CHANGE
  const handleChange = (e) => {

    const { name, value } = e.target;

    setEditingCow((prev) => {

      const updated = {
        ...prev,
        [name]: value,
      };

      // CLEAR DEATH FIELDS
      if (
        name === "healthStatus" &&
        value !== "Deceased"
      ) {

        updated.dateOfDeath = "";
        updated.causeOfDeath = "";

      }

      return updated;

    });

  };

  // UPDATE
  const handleUpdate = async () => {

    try {

      await apiClient.put(
        `${API}/${editingCow._id}`,
        editingCow
      );

      setEditingCow(null);

      fetchCows();

    } catch (err) {

      console.error(
        "Error updating cow:",
        err
      );

    }

  };

  return (

    <div className="layout">

      <RoleSidebar />

      <div className="main">

        <Navbar />

        <h2>MANAGE COWS</h2>

        {/* SUMMARY CARDS */}

        <div
          className="card-container"
          style={{ marginBottom: "24px" }}
        >

          <div className="card red">
            <h3>TOTAL COWS</h3>
            <p>
              {
                cows.filter(
                  (c) => c.type === "cow"
                ).length
              }
            </p>
          </div>

          <div className="card orange">
            <h3>TOTAL BULLS</h3>
            <p>
              {
                cows.filter(
                  (c) => c.type === "bull"
                ).length
              }
            </p>
          </div>

          <div className="card blue">
            <h3>TOTAL ANIMALS</h3>
            <p>{cows.length}</p>
          </div>

          <div className="card dark">
            <h3>DECEASED 💀</h3>
            <p>
              {
                cows.filter(
                  (c) =>
                    c.healthStatus ===
                    "Deceased"
                ).length
              }
            </p>
          </div>

        </div>

        {/* TABLE */}

        <div className="table-wrapper">

          <table className="table">

            <thead>

              <tr>

                <th>#</th>
                <th>IMAGE</th>
                <th>COW ID</th>
                <th>TYPE</th>
                <th>BREED</th>
                <th>AGE</th>
                <th>WEIGHT (KG)</th>
                <th>TAG NO</th>
                <th>HEALTH STATUS</th>
                <th>INSURANCE</th>
                <th>REG. DATE</th>
                <th>DATE OF DEATH</th>
                <th>CAUSE OF DEATH</th>
                <th>ACTION</th>

              </tr>

            </thead>

            <tbody>

              {cows.length === 0 ? (

                <tr>

                  <td
                    colSpan="14"
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No cows found
                  </td>

                </tr>

              ) : (

                cows.map((cow, index) => (

                  <tr key={cow._id}>

                    <td>{index + 1}</td>

                    {/* IMAGE */}

                    <td>

                      {cow.frontImage ||
                      cow.image ? (

                        <img
                          src={
                            cow.frontImage ||
                            cow.image
                          }
                          alt="cow"
                          className="cow-thumb"
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "10px",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            window.open(
                              cow.frontImage ||
                                cow.image,
                              "_blank"
                            )
                          }
                        />

                      ) : (

                        <span className="no-img">
                          No Image
                        </span>

                      )}

                    </td>

                    <td>{cow.cowId}</td>

                    <td
                      style={{
                        textTransform:
                          "capitalize",
                      }}
                    >
                      {cow.type || "-"}
                    </td>

                    <td>
                      {cow.breed || "-"}
                    </td>

                    <td>
                      {cow.age
                        ? `${cow.age} ${
                            cow.ageUnit ||
                            "yrs"
                          }`
                        : "-"}
                    </td>

                    <td>
                      {cow.weight || "-"}
                    </td>

                    <td>
                      {cow.tagNumber || "-"}
                    </td>

                    {/* HEALTH STATUS */}

                    <td>

                      <span
                        style={{
                          fontWeight: 600,
                          fontSize: "13px",

                          color:
                            cow.healthStatus ===
                            "Healthy"
                              ? "green"
                              : cow.healthStatus ===
                                "Deceased"
                              ? "red"
                              : cow.healthStatus ===
                                "Under Treatment"
                              ? "orange"
                              : "#666",
                        }}
                      >

                        {cow.healthStatus ||
                          "-"}

                      </span>

                    </td>

                    <td>
                      {cow.insuranceStatus ||
                        "-"}
                    </td>

                    <td>
                      {cow.registrationDate ||
                        "-"}
                    </td>

                    {/* DATE OF DEATH */}

                    <td>

                      {cow.healthStatus ===
                        "Deceased" &&
                      cow.dateOfDeath
                        ? new Date(
                            cow.dateOfDeath
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}

                    </td>

                    {/* CAUSE */}

                    <td>

                      {cow.healthStatus ===
                      "Deceased"
                        ? cow.causeOfDeath ||
                          "-"
                        : "-"}

                    </td>

                    {/* ACTIONS */}

                    <td>

                      <button
                        onClick={() =>
                          handleEditClick(
                            cow
                          )
                        }
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            cow._id
                          )
                        }
                      >
                        ❌
                      </button>

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

            <h3>
              Edit Cow Details
            </h3>

            <label>Cow ID</label>

            <input
              value={
                editingCow.cowId || ""
              }
              disabled
            />

            <label>Type</label>

            <select
              name="type"
              value={
                editingCow.type || ""
              }
              onChange={handleChange}
            >

              <option value="">
                Select Type
              </option>

              <option value="cow">
                Cow
              </option>

              <option value="bull">
                Bull
              </option>

            </select>

            <label>Age</label>

            <input
              type="number"
              name="age"
              value={
                editingCow.age || ""
              }
              onChange={handleChange}
            />

            <label>
              Weight (kg)
            </label>

            <input
              type="number"
              name="weight"
              value={
                editingCow.weight ||
                ""
              }
              onChange={handleChange}
            />

            <label>
              Tag Number
            </label>

            <input
              name="tagNumber"
              value={
                editingCow.tagNumber ||
                ""
              }
              onChange={handleChange}
            />

            <label>
              Health Status
            </label>

            <select
              name="healthStatus"
              value={
                editingCow.healthStatus ||
                ""
              }
              onChange={handleChange}
            >

              <option value="">
                -- Select --
              </option>

              <option value="Healthy">
                Healthy
              </option>

              <option value="Under Treatment">
                Under Treatment
              </option>

              <option value="Calved">
                Calved
              </option>

              <option value="Deceased">
                Deceased
              </option>

            </select>

            {/* DEATH FIELDS */}

            {editingCow.healthStatus ===
              "Deceased" && (

              <>

                <label>
                  Date of Death
                </label>

                <input
                  type="date"
                  name="dateOfDeath"
                  value={
                    editingCow.dateOfDeath ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

                <label>
                  Cause of Death
                </label>

                <input
                  name="causeOfDeath"
                  value={
                    editingCow.causeOfDeath ||
                    ""
                  }
                  onChange={
                    handleChange
                  }
                />

              </>

            )}

            <label>
              Insurance Status
            </label>

            <select
              name="insuranceStatus"
              value={
                editingCow.insuranceStatus ||
                ""
              }
              onChange={handleChange}
            >

              <option value="">
                -- Select --
              </option>

              <option value="Yes">
                Yes
              </option>

              <option value="No">
                No
              </option>

            </select>

            <label>
              Registration Date
            </label>

            <input
              type="date"
              name="registrationDate"
              value={
                editingCow.registrationDate ||
                ""
              }
              onChange={handleChange}
            />

            <div
              style={{
                marginTop: "10px",
              }}
            >

              <button
                className="update-btn"
                onClick={
                  handleUpdate
                }
              >
                Update
              </button>

              <button
                className="cancel-btn"
                onClick={() =>
                  setEditingCow(
                    null
                  )
                }
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