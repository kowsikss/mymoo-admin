import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";

import apiClient from "../api/client";

function AddRescuedAnimal() {

  const [breeds, setBreeds] =
    useState([]);

  const [form, setForm] =
    useState({

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

  const [animalPhoto,
    setAnimalPhoto] =
    useState(null);

  const [loading,
    setLoading] =
    useState(false);

  const role =
    localStorage.getItem(
      "role"
    );

  // FETCH BREEDS

  const fetchBreeds =
    async () => {

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
    role !== "doctor" &&
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

  const uploadImageToR2 =
    async (file) => {

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
          await fetch(
            uploadUrl,
            {

              method: "PUT",

              headers: {
                "Content-Type":
                  file.type,
              },

              body: file,

            }
          );

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
          error
        );

        throw error;

      }

    };

  // SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const kosalaId =
          localStorage.getItem(
            "kosalaId"
          );

        let uploadedImageUrl =
          "";

        if (animalPhoto) {

          uploadedImageUrl =
            await uploadImageToR2(
              animalPhoto
            );

        }

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
          "Rescued Animal Added Successfully!"
        );

      } catch (err) {

        console.error(err);

        alert(
          err.message ||
            "Error saving record"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div className="layout">

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

          <label>
            Date of Rescued
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

          <label>Sex</label>

          <select
            name="sex"
            value={form.sex}
            onChange={
              handleChange
            }
            required
          >

            <option value="">
              Select
            </option>

            <option value="Cow">
              Cow
            </option>

            <option value="Bull">
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

          <label>
            Animal Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setAnimalPhoto(
                e.target.files[0]
              )
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

export default AddRescuedAnimal;