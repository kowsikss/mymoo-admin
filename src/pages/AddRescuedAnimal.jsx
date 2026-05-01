import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function AddRescuedAnimal() {
  const [breeds, setBreeds] = useState([]);
  const [form, setForm] = useState({
    dateOfRescued: "",
    sex: "",
    breed: "",
    age: "",
    ownerName: "",
    ownerAddress: "",
    ownerMobile: "",
    ownerAadhar: "",
    reasonOfAdoption: "",
    tagNumber: "",
  });
  const [animalPhoto, setAnimalPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const role = localStorage.getItem("role");

  // ✅ FIX 1: Define fetchBreeds BEFORE useEffect
  const fetchBreeds = async () => {
    try {
      const res = await apiClient.get("/api/breeds");
      setBreeds(res.data);
    } catch (err) {
      console.error("Error fetching breeds:", err);
    }
  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  // ✅ FIX 2: Role check AFTER all hooks, and allow both roles
  if (role !== "doctor" && role !== "kosala-admin") {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.dateOfRescued ||
      !form.sex ||
      !form.breed ||
      !form.age ||
      !form.ownerName ||
      !form.ownerAddress ||
      !form.ownerMobile ||
      !form.ownerAadhar ||
      !form.tagNumber
    ) {
      alert("Please fill all mandatory fields");
      return;
    }

    try {
      setLoading(true);

      const kosalaId = localStorage.getItem("kosalaId");
      const formData = new FormData();

      Object.keys(form).forEach((key) => formData.append(key, form[key]));
      formData.append("kosalaId", kosalaId);

      if (animalPhoto) formData.append("animalPhoto", animalPhoto);

      await apiClient.post("/api/rescued", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Rescued Animal Record Added Successfully!");

      setForm({
        dateOfRescued: "",
        sex: "",
        breed: "",
        age: "",
        ownerName: "",
        ownerAddress: "",
        ownerMobile: "",
        ownerAadhar: "",
        reasonOfAdoption: "",
        tagNumber: "",
      });
      setAnimalPhoto(null);
    } catch (err) {
      console.error("Error saving record:", err);
      alert("Error saving record");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      {/* ✅ FIX 3: Show correct sidebar per role */}
      {role === "kosala-admin" ? <KosalaAdminSidebar /> : <Sidebar />}
      <div className="main">
        <Navbar />

        <h2>RESCUED ANIMALS MODULE</h2>

        <form className="form-box" onSubmit={handleSubmit}>

          <label>Date of Rescued <span style={{ color: "red" }}>*</span></label>
          <input
            type="date"
            name="dateOfRescued"
            value={form.dateOfRescued}
            onChange={handleChange}
            required
          />

          <label>Sex of the Cattle <span style={{ color: "red" }}>*</span></label>
          <select name="sex" value={form.sex} onChange={handleChange} required>
            <option value="">Select Sex</option>
            <option value="Cow">Cow</option>
            <option value="Bull">Bull</option>
          </select>

          <label>Breed of the Rescued Cattle <span style={{ color: "red" }}>*</span></label>
          <select name="breed" value={form.breed} onChange={handleChange} required>
            <option value="">Select Breed</option>
            {breeds.length === 0 ? (
              <option disabled>Loading breeds...</option>
            ) : (
              breeds.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))
            )}
          </select>

          <label>Age <span style={{ color: "red" }}>*</span></label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            placeholder="Enter age (whole number)"
            min="0"
            required
          />

          <h3 style={{ marginTop: "16px" }}>Owner Details</h3>

          <label>Owner Name <span style={{ color: "red" }}>*</span></label>
          <input
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            placeholder="Enter owner name"
            required
          />

          <label>Owner Address <span style={{ color: "red" }}>*</span></label>
          <textarea
            name="ownerAddress"
            value={form.ownerAddress}
            onChange={handleChange}
            placeholder="Enter owner address"
            required
          />

          <label>Mobile Number <span style={{ color: "red" }}>*</span></label>
          <input
            name="ownerMobile"
            value={form.ownerMobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
            maxLength={10}
            required
          />

          <label>Aadhar Number <span style={{ color: "red" }}>*</span></label>
          <input
            name="ownerAadhar"
            value={form.ownerAadhar}
            onChange={handleChange}
            placeholder="Enter Aadhar number"
            maxLength={12}
            required
          />

          <label>Animal Photograph</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAnimalPhoto(e.target.files[0])}
          />

          <label>Reason of Adoption</label>
          <select
            name="reasonOfAdoption"
            value={form.reasonOfAdoption}
            onChange={handleChange}
          >
            <option value="">Select Reason</option>
            <option value="Abandoned">Abandoned</option>
            <option value="Illness">Illness</option>
            <option value="Donation">Donation</option>
            <option value="Fracture">Fracture</option>
          </select>

          <label>New Tag Number (RFID) <span style={{ color: "red" }}>*</span></label>
          <input
            name="tagNumber"
            value={form.tagNumber}
            onChange={handleChange}
            placeholder="Enter RFID tag number"
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddRescuedAnimal;