import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

function ManageRescuedAnimal() {
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecords();
  }, []);

  if (localStorage.getItem("role") !== "doctor") {
    return <Navigate to="/" />;
  }

  const fetchRecords = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");
      const res = await axios.get(
        `http://localhost:5000/api/rescued/kosala/${kosalaId}`
      );
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching rescued animals:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await axios.delete(`http://localhost:5000/api/rescued/${id}`);
        fetchRecords();
      } catch (err) {
        console.error("Error deleting record:", err);
      }
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>RESCUED ANIMALS</h2>

        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Tag No</th>
              <th>Sex</th>
              <th>Breed</th>
              <th>Age</th>
              <th>Date Rescued</th>
              <th>Reason</th>
              <th>Owner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No rescued animal records found
                </td>
              </tr>
            ) : (
              records.map((rec, index) => (
                <tr key={rec._id}>
                  <td>{index + 1}</td>
                  <td>
                    {rec.animalPhoto ? (
                      <img
                        src={`http://localhost:5000/uploads/${rec.animalPhoto}`}
                        alt="animal"
                        className="cow-thumb"
                        style={{ width: "50px", height: "50px", objectFit: "cover", cursor: "pointer" }}
                        onClick={() =>
                          window.open(
                            `http://localhost:5000/uploads/${rec.animalPhoto}`,
                            "_blank"
                          )
                        }
                      />
                    ) : (
                      <span className="no-img">No Photo</span>
                    )}
                  </td>
                  <td>{rec.tagNumber}</td>
                  <td>{rec.sex}</td>
                  <td>{rec.breed}</td>
                  <td>{rec.age}</td>
                  <td>{rec.dateOfRescued}</td>
                  <td>{rec.reasonOfAdoption || "-"}</td>
                  <td>{rec.ownerName}</td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(`/rescued-animal-detail/${rec._id}`)
                      }
                    >
                      👁️
                    </button>
                    <button onClick={() => handleDelete(rec._id)}>❌</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageRescuedAnimal;