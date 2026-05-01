import { useEffect, useState } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";
import { API_BASE_URL } from "../api/client";

function RescuedAnimalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecord();
  }, []);

  if (localStorage.getItem("role") !== "doctor") {
    return <Navigate to="/" />;
  }

  const fetchRecord = async () => {
    try {
      const res = await apiClient.get(`/api/rescued/${id}`);
      setRecord(res.data);
    } catch (err) {
      console.error("Error fetching record:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!record) return <div>Record not found</div>;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2>RESCUED ANIMAL DETAILS</h2>

        <div className="edit-panel" style={{ maxWidth: "600px" }}>

          {/* PHOTO */}
          {record.animalPhoto && (
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src={`${API_BASE_URL}/uploads/${record.animalPhoto}`}
                alt="animal"
                style={{
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  border: "2px solid #ccc",
                }}
              />
            </div>
          )}

          <table className="table">
            <tbody>
              <tr>
                <td><strong>Tag Number</strong></td>
                <td>{record.tagNumber}</td>
              </tr>
              <tr>
                <td><strong>Date of Rescued</strong></td>
                <td>{record.dateOfRescued}</td>
              </tr>
              <tr>
                <td><strong>Sex</strong></td>
                <td>{record.sex}</td>
              </tr>
              <tr>
                <td><strong>Breed</strong></td>
                <td>{record.breed}</td>
              </tr>
              <tr>
                <td><strong>Age</strong></td>
                <td>{record.age} years</td>
              </tr>
              <tr>
                <td><strong>Reason of Adoption</strong></td>
                <td>{record.reasonOfAdoption || "-"}</td>
              </tr>
              <tr>
                <td><strong>Owner Name</strong></td>
                <td>{record.ownerName}</td>
              </tr>
              <tr>
                <td><strong>Owner Address</strong></td>
                <td>{record.ownerAddress}</td>
              </tr>
              <tr>
                <td><strong>Mobile Number</strong></td>
                <td>{record.ownerMobile}</td>
              </tr>
              <tr>
                <td><strong>Aadhar Number</strong></td>
                <td>{record.ownerAadhar}</td>
              </tr>
            </tbody>
          </table>

          <button
            className="cancel-btn"
            style={{ marginTop: "16px" }}
            onClick={() => navigate("/manage-rescued-animal")}
          >
            ← Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default RescuedAnimalDetail;