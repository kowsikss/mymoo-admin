import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

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

  const [animalPhoto, setAnimalPhoto] =
    useState(null);

  const [preview, setPreview] =
    useState("");

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

      console.error(
        "Error fetching breeds:",
        err
      );

    }

  };

  useEffect(() => {
    fetchBreeds();
  }, []);

  // ROLE CHECK

  if (
    role !== "doctor" &&
    role !== "kosala-admin"
  ) {

    return <Navigate to="/" />;

  }

  // FORM CHANGE

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // IMAGE CHANGE

  const handleImageChange = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setAnimalPhoto(file);

    setPreview(
      URL.createObjectURL(file)
    );

  };

  // SUBMIT

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

      alert(
        "Please fill all mandatory fields"
      );

      return;

    }

    try {

      setLoading(true);

      const kosalaId =
        localStorage.getItem(
          "kosalaId"
        );

      // FINAL IMAGE URL

      let uploadedImageUrl = "";

      // ======================
      // R2 IMAGE UPLOAD
      // ======================

      if (animalPhoto) {

        // GET PRESIGNED URL

        const presignedRes =
          await apiClient.get(
            `/api/upload/presigned-url?fileType=${animalPhoto.type}`
          );

        const {
          uploadUrl,
          fileUrl,
        } = presignedRes.data;

        // UPLOAD TO R2

        const uploadResponse = await fetch(uploadUrl, {

  method: "PUT",

  headers: {
    "Content-Type": animalPhoto.type,
  },

  body: animalPhoto,

});

if (!uploadResponse.ok) {

  throw new Error(
    "Failed to upload image to R2"
  );

}
        // SAVE FINAL URL

        uploadedImageUrl =
          fileUrl;

      }

      // ======================
      // SAVE TO DATABASE
      // ======================

      const payload = {

        ...form,

        kosalaId,

        animalPhoto:
          uploadedImageUrl,

      };

      await apiClient.post(
        "/api/rescued",
        payload
      );

      alert(
        "Rescued Animal Record Added Successfully!"
      );

      // RESET

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

      setPreview("");

    } catch (err) {

      console.error(
        "Error saving record:",
        err
      );

      alert(
        "Error saving record"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="layout">

      {/* SIDEBAR */}

      {role ===
      "kosala-admin" ? (
        <KosalaAdminSidebar />
      ) : (
        <Sidebar />
      )}

      <div className="main">

        <Navbar />

        <h2>
          RESCUED ANIMALS MODULE
        </h2>

        <form
          className="form-box"
          onSubmit={handleSubmit}
        >

          {/* DATE */}

          <label>
            Date of Rescued
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

          <input
            type="date"
            name="dateOfRescued"
            value={
              form.dateOfRescued
            }
            onChange={
              handleChange
            }
            required
          />

          {/* SEX */}

          <label>
            Sex of the Cattle
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

          <select
            name="sex"
            value={form.sex}
            onChange={
              handleChange
            }
            required
          >

            <option value="">
              Select Sex
            </option>

            <option value="Cow">
              Cow
            </option>

            <option value="Bull">
              Bull
            </option>

          </select>

          {/* BREED */}

          <label>
            Breed of the Rescued Cattle
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

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

            {breeds.length ===
            0 ? (

              <option disabled>
                Loading breeds...
              </option>

            ) : (

              breeds.map((b) => (

                <option
                  key={b._id}
                  value={b._id}
                >
                  {b.name}
                </option>

              ))

            )}

          </select>

          {/* AGE */}

          <label>
            Age
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

          <input
            type="number"
            name="age"
            value={form.age}
            onChange={
              handleChange
            }
            placeholder="Enter age"
            min="0"
            required
          />

          {/* OWNER DETAILS */}

          <h3
            style={{
              marginTop: "16px",
            }}
          >
            Owner Details
          </h3>

          <label>
            Owner Name
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

          <input
            name="ownerName"
            value={
              form.ownerName
            }
            onChange={
              handleChange
            }
            placeholder="Enter owner name"
            required
          />

          <label>
            Owner Address
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

          <textarea
            name="ownerAddress"
            value={
              form.ownerAddress
            }
            onChange={
              handleChange
            }
            placeholder="Enter owner address"
            required
          />

          <label>
            Mobile Number
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

          <input
            name="ownerMobile"
            value={
              form.ownerMobile
            }
            onChange={
              handleChange
            }
            placeholder="Enter mobile number"
            maxLength={10}
            required
          />

          <label>
            Aadhar Number
            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>
          </label>

          <input
            name="ownerAadhar"
            value={
              form.ownerAadhar
            }
            onChange={
              handleChange
            }
            placeholder="Enter Aadhar number"
            maxLength={12}
            required
          />

          {/* IMAGE */}

          <label>
            Animal Photograph
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

          {/* PREVIEW */}

          {preview && (

            <img
              src={preview}
              alt="preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "12px",
                marginTop: "10px",
              }}
            />

          )}

          {/* REASON */}

          <label>
            Reason of Adoption
          </label>

          <select
            name="reasonOfAdoption"
            value={
              form.reasonOfAdoption
            }
            onChange={
              handleChange
            }
          >

            <option value="">
              Select Reason
            </option>

            <option value="Abandoned">
              Abandoned
            </option>

            <option value="Illness">
              Illness
            </option>

            <option value="Donation">
              Donation
            </option>

            <option value="Fracture">
              Fracture
            </option>

          </select>

          {/* TAG */}

          <label>
            New Tag Number (RFID)

            <span
              style={{
                color: "red",
              }}
            >
              *
            </span>

          </label>

          <input
            name="tagNumber"
            value={
              form.tagNumber
            }
            onChange={
              handleChange
            }
            placeholder="Enter RFID tag number"
            required
          />

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Submit"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default AddRescuedAnimal;