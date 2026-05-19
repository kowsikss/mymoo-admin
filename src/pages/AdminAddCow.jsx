import { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate, Link } from "react-router-dom";
import RoleSidebar from "../components/RoleSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

function AdminAddCow() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "",
    breed: "",
    age: "",
    ageUnit: "years",
    weight: "",
    registrationDate: "",
    calfStatus: "",
    tagNumber: "",
    vaccinationDate: "",
    dewormingDate: "",
    insuranceStatus: "",
    healthStatus: "",
    monthlyAmountSpent: "",
    hasDisease: "",
    diseaseName: "",
    diseaseDate: "",
    treatmentDate: "",
    feedType: "",
    feedAmountKg: "",
  });

  const [breeds, setBreeds] = useState([]);

  const [images, setImages] = useState({
    front: null,
    side: null,
    back: null,
  });

  const [insuranceCert, setInsuranceCert] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const role =
    localStorage.getItem("role");

  // FETCH BREEDS

  const fetchBreeds = async () => {

    try {

      const res =
        await apiClient.get(
          "/api/breeds"
        );

      setBreeds(res.data);

    } catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  if (
    role !== "admin" &&
    role !== "kosala-admin"
  ) {

    return <Navigate to="/" />;

  }

  // CHANGE

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // =========================
  // R2 IMAGE UPLOAD
  // =========================

  const uploadImageToR2 = async (
    file
  ) => {

    try {

      const response =
        await apiClient.get(
          "/api/upload/presigned-url",
          {
            params: {
              fileType:
                file.type,
            },
          }
        );

      const {
        uploadUrl,
        fileUrl,
      } = response.data;

      const uploadResponse =
        await fetch(uploadUrl, {

          method: "PUT",

          headers: {
            "Content-Type":
              file.type,
          },

          body: file,

        });

      if (
        !uploadResponse.ok
      ) {

        throw new Error(
          "Failed to upload image to R2"
        );

      }

      return fileUrl;

    } catch (error) {

      console.error(
        "R2 Upload Error:",
        error
      );

      throw error;

    }

  };

  // SUBMIT

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setLoading(true);

      const kosalaId =
        id ||
        localStorage.getItem(
          "kosalaId"
        );

      // =====================
      // UPLOAD IMAGES
      // =====================

      let frontImageUrl = "";
      let sideImageUrl = "";
      let backImageUrl = "";
      let insuranceCertUrl = "";

      if (images.front) {

        frontImageUrl =
          await uploadImageToR2(
            images.front
          );

      }

      if (images.side) {

        sideImageUrl =
          await uploadImageToR2(
            images.side
          );

      }

      if (images.back) {

        backImageUrl =
          await uploadImageToR2(
            images.back
          );

      }

      if (insuranceCert) {

        insuranceCertUrl =
          await uploadImageToR2(
            insuranceCert
          );

      }

      // =====================
      // FINAL PAYLOAD
      // =====================

      const payload = {

        ...form,

        kosalaId,

        front:
          frontImageUrl,

        side:
          sideImageUrl,

        back:
          backImageUrl,

        insuranceCert:
          insuranceCertUrl,

      };

      await apiClient.post(
        "/api/cows",
        payload
      );

      alert(
        "Cow Added Successfully!"
      );

      navigate(
        "/manage-cows"
      );

    } catch (err) {

      console.error(err);

      alert(
        err.message ||
          "Error adding cow"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="layout">

      <RoleSidebar />

      <div className="main">

        <Navbar />

        <h2>ADD COW</h2>

        <form
          className="form-box"
          onSubmit={handleSubmit}
        >

          <label>Type</label>

          <select
            name="type"
            value={form.type}
            onChange={
              handleChange
            }
            required
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

          <label>Breed</label>

          <select
            name="breed"
            value={form.breed}
            onChange={
              handleChange
            }
            required
          >

            <option value="">
              Select Breed
            </option>

            {breeds.map((b) => (

              <option
                key={b._id}
                value={b._id}
              >
                {b.name}
              </option>

            ))}

          </select>

          <label>Age</label>

          <input
            type="number"
            name="age"
            value={form.age}
            onChange={
              handleChange
            }
          />

          <label>Weight</label>

          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={
              handleChange
            }
          />

          <label>
            Front Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImages({
                ...images,
                front:
                  e.target.files[0],
              })
            }
          />

          <label>
            Side Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImages({
                ...images,
                side:
                  e.target.files[0],
              })
            }
          />

          <label>
            Back Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImages({
                ...images,
                back:
                  e.target.files[0],
              })
            }
          />

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Uploading..."
              : "Submit"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default AdminAddCow;