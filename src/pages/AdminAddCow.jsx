// import { useEffect, useState } from "react";
// import { useParams, useNavigate, Navigate } from "react-router-dom";
// import RoleSidebar from "../components/RoleSidebar";
// import Navbar from "../components/Navbar";
// import axios from "axios";

// function AdminAddCow() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     type: "",
//     breed: "",
//     age: "",
//     ageUnit: "years",
//     weight: "",
//     registrationDate: "",
//     calfStatus: "",
//     tagNumber: "",
//     vaccinationDate: "",
//     dewormingDate: "",
//     insuranceStatus: "",
//     healthStatus: "",
//     monthlyAmountSpent: "",
//     hasDisease: "",
//     diseaseName: "",
//     diseaseDate: "",
//     treatmentDate: "",
//     feedType: "",
//     feedAmountKg: "",
//   });

//   const [breeds,        setBreeds]        = useState([]);
//   const [images,        setImages]        = useState({ front: null, side: null, back: null });
//   const [insuranceCert, setInsuranceCert] = useState(null);
//   const [loading,       setLoading]       = useState(false);

//   // ✅ fetchBreeds BEFORE useEffect
//   const fetchBreeds = async () => {
//     try {
//       const res = await apiClient.get("/api/breeds");
//       setBreeds(res.data);
//     } catch (err) {
//       console.error("Error fetching breeds:", err);
//     }
//   };

//   // ✅ useEffect AFTER fetchBreeds
//   useEffect(() => {
//     fetchBreeds();
//   }, []);

//   // ✅ Role check AFTER all hooks
//   const role = localStorage.getItem("role");
//   if (role !== "admin" && role !== "kosala-admin") {
//     return <Navigate to="/" />;
//   }

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.type || !form.breed) {
//       alert("Please fill required fields");
//       return;
//     }

//     try {
//       setLoading(true);
//       const formData = new FormData();
//       const kosalaId = id || localStorage.getItem("kosalaId");

//       Object.keys(form).forEach((key) => formData.append(key, form[key]));
//       formData.append("kosalaId", kosalaId);

//       if (images.front)  formData.append("front",         images.front);
//       if (images.side)   formData.append("side",          images.side);
//       if (images.back)   formData.append("back",          images.back);
//       if (insuranceCert) formData.append("insuranceCert", insuranceCert);

//       await apiClient.post("/api/cows", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       alert("Cow Added Successfully!");

//       // ✅ Navigate to correct dashboard based on role
//       if (role === "kosala-admin") {
//         navigate("/kosala-admin-dashboard");
//       } else {
//         navigate(`/admin/kosala/${kosalaId}`);
//       }
//     } catch (err) {
//       console.error("Error adding cow:", err.response?.data || err.message);
//       alert("Error adding cow: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const calfOptions =
//     form.type === "bull"
//       ? [{ val: "Bull Calf", label: "Bull Calf" }]
//       : [
//           { val: "Bull Calf", label: "Bull Calf" },
//           { val: "Heifer",    label: "Heifer"    },
//         ];

//   const healthOptions =
//     form.type === "bull"
//       ? ["Healthy", "Under Treatment", "Deceased"]
//       : ["Healthy", "Under Treatment", "Calved", "Deceased"];

//   const kosalaId = id || localStorage.getItem("kosalaId");

//   return (
//     <div className="layout">
//       <RoleSidebar />
//       <div className="main">
//         <Navbar />

//         <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
//           <button
//             className="cancel-btn"
//             onClick={() =>
//               role === "kosala-admin"
//                 ? navigate("/kosala-admin-dashboard")
//                 : navigate(`/admin/kosala/${kosalaId}`)
//             }
//           >
//             Back
//           </button>
//           <h2 style={{ margin: 0 }}>ADD COW</h2>
//         </div>

//         <form className="form-box" onSubmit={handleSubmit}>

//           {/* BASIC INFO */}
//           <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px" }}>
//             Basic Information
//           </h3>

//           <label>Type <span style={{ color: "red" }}>*</span></label>
//           <select name="type" value={form.type} onChange={handleChange} required>
//             <option value="">Select Type</option>
//             <option value="cow">Cow</option>
//             <option value="bull">Bull</option>
//           </select>

//           <label>Breed <span style={{ color: "red" }}>*</span></label>
//           <select name="breed" value={form.breed} onChange={handleChange} required>
//             <option value="">Select Breed</option>
//             {breeds.length === 0 ? (
//               <option disabled>Loading breeds...</option>
//             ) : (
//               breeds.map((b) => (
//                 <option key={b._id} value={b._id}>{b.name}</option>
//               ))
//             )}
//           </select>

//           <label>Cattle Age <span style={{ color: "red" }}>*</span></label>
//           <div style={{ display: "flex", gap: "10px" }}>
//             <input
//               type="number"
//               name="age"
//               value={form.age}
//               onChange={handleChange}
//               placeholder="Enter age"
//               min="0"
//               style={{ flex: 2 }}
//               required
//             />
//             <select
//               name="ageUnit"
//               value={form.ageUnit}
//               onChange={handleChange}
//               style={{ flex: 1 }}
//             >
//               <option value="years">Years</option>
//               <option value="months">Months (Calf)</option>
//             </select>
//           </div>

//           <label>Cattle Calf Status</label>
//           <select name="calfStatus" value={form.calfStatus} onChange={handleChange}>
//             <option value="">-- Select Calf Status --</option>
//             {calfOptions.map((o) => (
//               <option key={o.val} value={o.val}>{o.label}</option>
//             ))}
//           </select>

//           <label>Cattle Weight (kg) <span style={{ color: "red" }}>*</span></label>
//           <input
//             type="number"
//             name="weight"
//             value={form.weight}
//             onChange={handleChange}
//             placeholder="Enter weight in kg"
//             min="0"
//             required
//           />

//           <label>RFID Tag Number <span style={{ color: "red" }}>*</span></label>
//           <input
//             name="tagNumber"
//             value={form.tagNumber}
//             onChange={handleChange}
//             placeholder="Enter RFID tag number"
//             required
//           />

//           <label>Date of Registration <span style={{ color: "red" }}>*</span></label>
//           <input
//             type="date"
//             name="registrationDate"
//             value={form.registrationDate}
//             onChange={handleChange}
//             required
//           />

//           {/* IMAGES */}
//           <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
//             Cattle Images
//           </h3>

//           <label>Front View Image</label>
//           <input type="file" accept="image/*"
//             onChange={(e) => setImages({ ...images, front: e.target.files[0] })} />

//           <label>Side View Image</label>
//           <input type="file" accept="image/*"
//             onChange={(e) => setImages({ ...images, side: e.target.files[0] })} />

//           <label>Another Side View Image</label>
//           <input type="file" accept="image/*"
//             onChange={(e) => setImages({ ...images, back: e.target.files[0] })} />

//           {/* HEALTH */}
//           <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
//             Health & Treatment
//           </h3>

//           <label>Cattle Health Status <span style={{ color: "red" }}>*</span></label>
//           <select name="healthStatus" value={form.healthStatus} onChange={handleChange} required>
//             <option value="">-- Select Health Status --</option>
//             {healthOptions.map((o) => (
//               <option key={o} value={o}>{o}</option>
//             ))}
//           </select>

//           <label>Monthly Amount Spent (Rs.) <span style={{ color: "red" }}>*</span></label>
//           <input
//             type="number"
//             name="monthlyAmountSpent"
//             value={form.monthlyAmountSpent}
//             onChange={handleChange}
//             placeholder="Rs. Enter monthly amount"
//             min="0"
//             required
//           />

//           <label>Date of Vaccination</label>
//           <input type="date" name="vaccinationDate" value={form.vaccinationDate} onChange={handleChange} />

//           <label>Date of Deworming</label>
//           <input type="date" name="dewormingDate" value={form.dewormingDate} onChange={handleChange} />

//           <label>Cattle Treatment Date</label>
//           <input type="date" name="treatmentDate" value={form.treatmentDate} onChange={handleChange} />

//           <label>Has this Cattle undergone any Disease? <span style={{ color: "red" }}>*</span></label>
//           <select name="hasDisease" value={form.hasDisease} onChange={handleChange} required>
//             <option value="">-- Select --</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>

//           {form.hasDisease === "Yes" && (
//             <>
//               <label>Disease Name</label>
//               <input name="diseaseName" value={form.diseaseName} onChange={handleChange} placeholder="Enter disease name" />
//               <label>Date of Disease</label>
//               <input type="date" name="diseaseDate" value={form.diseaseDate} onChange={handleChange} />
//             </>
//           )}

//           {/* INSURANCE */}
//           <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
//             Insurance
//           </h3>

//           <label>Insurance Status <span style={{ color: "red" }}>*</span></label>
//           <select name="insuranceStatus" value={form.insuranceStatus} onChange={handleChange} required>
//             <option value="">-- Select --</option>
//             <option value="Yes">Yes</option>
//             <option value="No">No</option>
//           </select>

//           {form.insuranceStatus === "Yes" && (
//             <>
//               <label>Upload Insurance Certificate</label>
//               <input type="file" accept="image/*,.pdf"
//                 onChange={(e) => setInsuranceCert(e.target.files[0])} />
//             </>
//           )}

//           {/* FEED */}
//           <h3 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "10px", marginTop: "8px" }}>
//             Cattle Feed Details
//           </h3>

//           <label>Feed Type (Monthly) <span style={{ color: "red" }}>*</span></label>
//           <select name="feedType" value={form.feedType} onChange={handleChange} required>
//             <option value="">-- Select Feed Type --</option>
//             <option value="Green Fodder">Green Fodder</option>
//             <option value="Dry Fodder">Dry Fodder</option>
//             <option value="Silage">Silage</option>
//             <option value="Concentrate">Concentrate</option>
//             <option value="Hay">Hay</option>
//             <option value="Other">Other</option>
//           </select>

//           <label>Monthly Feed Amount (Kg) <span style={{ color: "red" }}>*</span></label>
//           <input
//             type="number"
//             name="feedAmountKg"
//             value={form.feedAmountKg}
//             onChange={handleChange}
//             placeholder="Enter monthly feed in kg"
//             min="0"
//             required
//           />

//           <button type="submit" disabled={loading}>
//             {loading ? "Saving..." : "Submit"}
//           </button>

//         </form>
//       </div>
//     </div>
//   );
// }

// export default AdminAddCow;
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

  const [insuranceCert, setInsuranceCert] = useState(null);

  const [loading, setLoading] = useState(false);

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

  const role = localStorage.getItem("role");

  if (role !== "admin" && role !== "kosala-admin") {
    return <Navigate to="/" />;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ Upload image directly to Cloudflare R2
  const uploadImageToR2 = async (file) => {
    try {
      // STEP 1 → Get presigned URL
      const response = await apiClient.get(
        "/api/upload/presigned-url",
        {
          params: {
            fileType: file.type,
          },
        }
      );

      const { uploadUrl, fileUrl } = response.data;
      console.log("UPLOAD URL:", uploadUrl);
console.log("FILE URL:", fileUrl);

      // STEP 2 → Upload directly to R2
   const uploadResponse = await fetch(uploadUrl, {
  method: "PUT",
  headers: {
    "Content-Type": file.type,
  },
  body: file,
});

if (!uploadResponse.ok) {

  const errorText = await uploadResponse.text();

  console.error("R2 Upload Failed:", errorText);

  throw new Error("R2 Upload Failed");

}

console.log("UPLOAD SUCCESS");

return fileUrl;

      // STEP 3 → Return public image URL
      console.log("UPLOAD SUCCESS");
      return fileUrl;

    } catch (error) {
      console.error("R2 Upload Error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.type || !form.breed) {
      alert("Please fill required fields");
      return;
    }

    try {

      setLoading(true);

      const kosalaId =
        id || localStorage.getItem("kosalaId");

      // ✅ Upload images to R2
      let frontImageUrl = "";
      let sideImageUrl = "";
      let backImageUrl = "";
      let insuranceCertUrl = "";

      if (images.front) {
        frontImageUrl = await uploadImageToR2(images.front);
        console.log("FRONT IMAGE URL:", frontImageUrl);
      }

      if (images.side) {
        sideImageUrl = await uploadImageToR2(images.side);
      }

      if (images.back) {
        backImageUrl = await uploadImageToR2(images.back);
      }

      if (insuranceCert) {
        insuranceCertUrl =
          await uploadImageToR2(insuranceCert);
      }

      // ✅ Send final data to backend
      const payload = {
        ...form,

        kosalaId,

        front: frontImageUrl,
        side: sideImageUrl,
        back: backImageUrl,

        insuranceCert: insuranceCertUrl,
      };
      console.log(
  "FINAL PAYLOAD:",
  JSON.stringify(payload, null, 2)
);
      await apiClient.post("/api/cows", payload);

      alert("Cow Added Successfully!");

      if (role === "kosala-admin") {
        navigate("/kosala-admin-dashboard");
      } else {
        navigate(`/admin/kosala/${kosalaId}`);
      }

    } catch (err) {

      console.error(
        "Error adding cow:",
        err.response?.data || err.message
      );

      alert(
        "Error adding cow: " +
          (err.response?.data?.error || err.message)
      );

    } finally {

      setLoading(false);

    }
  };

  const calfOptions =
    form.type === "bull"
      ? [{ val: "Bull Calf", label: "Bull Calf" }]
      : [
          { val: "Bull Calf", label: "Bull Calf" },
          { val: "Heifer", label: "Heifer" },
        ];

  const healthOptions =
    form.type === "bull"
      ? ["Healthy", "Under Treatment", "Deceased"]
      : ["Healthy", "Under Treatment", "Calved", "Deceased"];

  const kosalaId =
    id || localStorage.getItem("kosalaId");

  return (
    <div className="layout">

      <RoleSidebar />

      <div className="main">

        <Navbar />

        <div
         style={{
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "10px 12px",
  borderRadius: "10px",
  background: "#ffffff",
  border: "1px solid #ececec",
  cursor: "pointer",
  transition: "0.2s",
  lineHeight: "1.5",
  fontSize: "14px",
  fontWeight: "500",
  color: "#556b4f",
}}
        >
          <button
            className="cancel-btn"
            onClick={() =>
              role === "kosala-admin"
                ? navigate("/kosala-admin-dashboard")
                : navigate(`/admin/kosala/${kosalaId}`)
            }
          >
            Back
          </button>

          <h2 style={{ margin: 0 }}>
            ADD COW
          </h2>
        </div>

        <form
          className="form-box"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFO */}

          <h3
            style={{
              borderBottom:
                "1px solid var(--border)",
              paddingBottom: "10px",
            }}
          >
            Basic Information
          </h3>

          <label>
            Type <span style={{ color: "red" }}>*</span>
          </label>

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Type</option>
            <option value="cow">Cow</option>
            <option value="bull">Bull</option>
          </select>

          <label>
            Breed <span style={{ color: "red" }}>*</span>
          </label>

          <select
            name="breed"
            value={form.breed}
            onChange={handleChange}
            required
          >
            <option value="">Select Breed</option>

            {breeds.length === 0 ? (
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

          <div
            style={{
              fontSize: "0.9rem",
              marginTop: "8px",
              marginBottom: "14px",
            }}
          >
            Don&apos;t see your breed?{" "}
            <Link to="/add-breed">
              Add it here
            </Link>
            .
          </div>

          <label>
            Cattle Age{" "}
            <span style={{ color: "red" }}>*</span>
          </label>

          <div
            style={{
              display: "flex",
              gap: "10px",
            }}
          >
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              placeholder="Enter age"
              min="0"
              style={{ flex: 2 }}
              required
            />

            <select
              name="ageUnit"
              value={form.ageUnit}
              onChange={handleChange}
              style={{ flex: 1 }}
            >
              <option value="years">
                Years
              </option>

              <option value="months">
                Months (Calf)
              </option>
            </select>
          </div>

          <label>Cattle Calf Status</label>

          <select
            name="calfStatus"
            value={form.calfStatus}
            onChange={handleChange}
          >
            <option value="">
              -- Select Calf Status --
            </option>

            {calfOptions.map((o) => (
              <option
                key={o.val}
                value={o.val}
              >
                {o.label}
              </option>
            ))}
          </select>

          <label>
            Cattle Weight (kg){" "}
            <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            placeholder="Enter weight in kg"
            min="0"
            required
          />

          <label>
            RFID Tag Number{" "}
            <span style={{ color: "red" }}>*</span>
          </label>

          <input
            name="tagNumber"
            value={form.tagNumber}
            onChange={handleChange}
            placeholder="Enter RFID tag number"
            required
          />

          <label>
            Date of Registration{" "}
            <span style={{ color: "red" }}>*</span>
          </label>

          <input
            type="date"
            name="registrationDate"
            value={form.registrationDate}
            onChange={handleChange}
            required
          />

          {/* IMAGES */}

          <h3
            style={{
              borderBottom:
                "1px solid var(--border)",
              paddingBottom: "10px",
              marginTop: "8px",
            }}
          >
            Cattle Images
          </h3>

          <label>Front View Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImages({
                ...images,
                front: e.target.files[0],
              })
            }
          />

          <label>Side View Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImages({
                ...images,
                side: e.target.files[0],
              })
            }
          />

          <label>Another Side View Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImages({
                ...images,
                back: e.target.files[0],
              })
            }
          />

          {/* HEALTH */}

          <h3
            style={{
              borderBottom:
                "1px solid var(--border)",
              paddingBottom: "10px",
              marginTop: "8px",
            }}
          >
            Health & Treatment
          </h3>

          <label>
            Cattle Health Status{" "}
            <span style={{ color: "red" }}>*</span>
          </label>

          <select
            name="healthStatus"
            value={form.healthStatus}
            onChange={handleChange}
            required
          >
            <option value="">
              -- Select Health Status --
            </option>

            {healthOptions.map((o) => (
              <option
                key={o}
                value={o}
              >
                {o}
              </option>
            ))}
          </select>

          <label>
            Monthly Amount Spent (Rs.)
          </label>

          <input
            type="number"
            name="monthlyAmountSpent"
            value={form.monthlyAmountSpent}
            onChange={handleChange}
            placeholder="Rs. Enter monthly amount"
            min="0"
          />

          <label>Date of Vaccination</label>

          <input
            type="date"
            name="vaccinationDate"
            value={form.vaccinationDate}
            onChange={handleChange}
          />

          <label>Date of Deworming</label>

          <input
            type="date"
            name="dewormingDate"
            value={form.dewormingDate}
            onChange={handleChange}
          />

          <label>Cattle Treatment Date</label>

          <input
            type="date"
            name="treatmentDate"
            value={form.treatmentDate}
            onChange={handleChange}
          />

          <label>
            Has this Cattle undergone any Disease?
          </label>

          <select
            name="hasDisease"
            value={form.hasDisease}
            onChange={handleChange}
          >
            <option value="">-- Select --</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>

         {form.hasDisease === "Yes" && (
  <>

    <label>
      Select Diseases
    </label>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "10px",
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#fafafa",
        maxHeight: "350px",
        overflowY: "auto",
      }}
    >

      {[
        "Actinobacillosis",
        "Actinomycosis",
        "Anaplasmosis",
        "Anthrax",
        "Aujeszky’s disease",

        "Babesiosis",
        "Besnoitiosis",
        "Blackleg",
        "Bluetongue",
        "Botulism",
        "Bovine Ephemeral Fever",
        "Bovine Genital Campylobacteriosis",
        "Bovine Leukosis",
        "Bovine Papular Stomatitis",
        "Bovine Respiratory Syncytial Virus",
        "Bovine Spongiform Encephalopathy",
        "Bovine Viral Diarrhea",
        "Brucellosis",

        "Calf Diphtheria",
        "Calf Scours",
        "Coccidiosis",
        "Contagious Bovine Pleuropneumonia",
        "Cowpox",
        "Cryptosporidiosis",

        "Dermatophilosis",
        "Downer Cow Syndrome",

        "East Coast Fever",
        "Enzootic Bovine Leukosis",
        "Enterotoxemia",
        "Ephemeral Fever",

        "Foot and Mouth Disease",
        "Foot Rot",

        "Haemorrhagic Septicemia",
        "Hardware Disease",
        "Hypomagnesemia",

        "Infectious Bovine Keratoconjunctivitis",
        "Infectious Bovine Rhinotracheitis",
        "Infectious Pustular Vulvovaginitis",

        "Johne’s Disease",

        "Ketosis",

        "Lantana Poisoning",
        "Leptospirosis",
        "Listeriosis",
        "Lumpy Skin Disease",
        "Lungworm",

        "Malignant Catarrhal Fever",
        "Mastitis",
        "Milk Fever",

        "Neosporosis",
        "Nitrate Poisoning",

        "Papillomatosis",
        "Parainfluenza-3",
        "Photosensitization",
        "Pneumonia",

        "Rabies",
        "Rift Valley Fever",
        "Ringworm",
        "Rinderpest",

        "Salmonellosis",
        "Schistosomiasis",
        "Sweet Clover Poisoning",

        "Tetanus",
        "Theileriosis",
        "Tick Fever",
        "Trichomoniasis",
        "Trypanosomiasis",
        "Tuberculosis",
        "Tympany/Bloat",

        "Urea Poisoning",

        "Vesicular Stomatitis",
        "Vibriosis",

        "Wart Virus",
      ].map((disease) => (

        <label
          key={disease}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: " 14px",
          }}
        >

          <input
  type="checkbox"
  style={{
    marginTop: "3px",
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#6b7d52",
    flexShrink: 0,
  }}
            value={disease}
            checked={
              form.diseaseName
                ?.split(",")
                ?.includes(disease)
            }
            onChange={(e) => {

              const selectedDiseases =
                form.diseaseName
                  ? form.diseaseName.split(",")
                  : [];

              if (e.target.checked) {

                selectedDiseases.push(
                  disease
                );

              } else {

                const index =
                  selectedDiseases.indexOf(
                    disease
                  );

                if (index > -1) {

                  selectedDiseases.splice(
                    index,
                    1
                  );

                }

              }

              setForm({
                ...form,
                diseaseName:
                  selectedDiseases.join(","),
              });

            }}
          />

          {disease}

        </label>

      ))}

    </div>

    <label>
      Date of Disease
    </label>

    <input
      type="date"
      name="diseaseDate"
      value={form.diseaseDate}
      onChange={handleChange}
    />

  </>
)}

          {/* INSURANCE */}

          <h3
            style={{
              borderBottom:
                "1px solid var(--border)",
              paddingBottom: "10px",
              marginTop: "8px",
            }}
          >
            Insurance
          </h3>

          <label>Insurance Status</label>

          <select
            name="insuranceStatus"
            value={form.insuranceStatus}
            onChange={handleChange}
          >
            <option value="">
              -- Select --
            </option>

            <option value="Yes">Yes</option>

            <option value="No">No</option>
          </select>

          {form.insuranceStatus === "Yes" && (
            <>
              <label>
                Upload Insurance Certificate
              </label>

              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) =>
                  setInsuranceCert(
                    e.target.files[0]
                  )
                }
              />
            </>
          )}

          {/* FEED */}

          <h3
            style={{
              borderBottom:
                "1px solid var(--border)",
              paddingBottom: "10px",
              marginTop: "8px",
            }}
          >
            Cattle Feed Details
          </h3>

          <label>
            Feed Type (Monthly)
          </label>

          <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "10px",
    marginBottom: "20px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fafafa",
  }}
>
  {[
    "Green Fodder",
    "Dry Fodder",
    "Silage",
    "Concentrate",
    "Hay",
    "Other",
  ].map((feed) => (
    <label
      key={feed}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        cursor: "pointer",
        background: "#fff",
      }}
    >
      <input
        type="checkbox"
        value={feed}
        checked={
          form.feedType
            ?.split(",")
            ?.includes(feed)
        }
        onChange={(e) => {

          const selectedFeeds =
            form.feedType
              ? form.feedType.split(",")
              : [];

          if (e.target.checked) {

            selectedFeeds.push(feed);

          } else {

            const index =
              selectedFeeds.indexOf(feed);

            if (index > -1) {
              selectedFeeds.splice(index, 1);
            }

          }

          setForm({
            ...form,
            feedType:
              selectedFeeds.join(","),
          });

        }}
        style={{
          width: "18px",
          height: "18px",
          cursor: "pointer",
          accentColor: "#6b7d52",
        }}
      />

      {feed}
    </label>
  ))}
</div>

          <label>
            Monthly Feed Amount (Kg)
          </label>

          <input
            type="number"
            name="feedAmountKg"
            value={form.feedAmountKg}
            onChange={handleChange}
            placeholder="Enter monthly feed in kg"
            min="0"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Submit"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default AdminAddCow;