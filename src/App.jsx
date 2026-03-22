import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// LOGIN
import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import AddRescuedAnimal from "./pages/AddRescuedAnimal";

import ManageCattleInfo from "./pages/ManageCattleInfo";
import AddInventory from "./pages/AddInventory";
import ManageInventory from "./pages/ManageInventory";

import GaushalasList from "./pages/GaushalasList";
import GaushalaInfo from "./pages/GaushalaInfo";
import DoctorsList from "./pages/DoctorsList";
import DoctorInfo from "./pages/DoctorInfo";


import ManageRescuedAnimal from "./pages/ManageRescuedAnimal";
import RescuedAnimalDetail from "./pages/RescuedAnimalDetail";

// ADMIN
import AdminDashboard from "./pages/AdminDashboard";
import AddGaushala from "./pages/AddGaushala";
import AddDoctor from "./pages/AddDoctor";
import AdminKosalaDashboard from "./pages/AdminkosalaDashboard";
import AdminAddCow from "./pages/AdminAddCow";
import ManageCow from "./pages/ManageCow"; // ✅ was missing

// DOCTOR
import Dashboard from "./pages/Dashboard";
import AddDeworming from "./pages/AddDeworming";
import ManageDeworming from "./pages/ManageDeworming";
import AddVaccination from "./pages/AddVaccination";
import ManageVaccination from "./pages/ManageVaccination";
import AddImmunization from "./pages/AddImmunization";
import ManageImmunization from "./pages/ManageImmunization";
import AddReproduction from "./pages/AddReproduction";
import ManageReproduction from "./pages/ManageReproduction"; // ✅ was missing
import AddCattleInfo from "./pages/AddCattleInfo";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= LOGIN ================= */}
        <Route path="/" element={<AdminLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/gaushalas-list" element={<ProtectedRoute role="admin"><GaushalasList /></ProtectedRoute>} />
<Route path="/gaushala-info/:id" element={<ProtectedRoute role="admin"><GaushalaInfo /></ProtectedRoute>} />
<Route path="/doctors-list" element={<ProtectedRoute role="admin"><DoctorsList /></ProtectedRoute>} />
<Route path="/doctor-info/:id" element={<ProtectedRoute role="admin"><DoctorInfo /></ProtectedRoute>} />

        <Route
          path="/add-gaushala"
          element={
            <ProtectedRoute role="admin">
              <AddGaushala />
            </ProtectedRoute>
          }
        />
        <Route
  path="/manage-cattle-info"
  element={
    <ProtectedRoute role="doctor">
      <ManageCattleInfo />
    </ProtectedRoute>
  }
/>

        <Route
          path="/add-doctor"
          element={
            <ProtectedRoute role="admin">
              <AddDoctor />
            </ProtectedRoute>
          }
        />
        

        {/* ADMIN → KOSALA DASHBOARD */}
        <Route
          path="/admin/kosala/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminKosalaDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ FIXED: matches /admin/kosala/:id/add-cow */}
        <Route
          path="/admin/kosala/:id/add-cow"
          element={
            <ProtectedRoute role="admin">
              <AdminAddCow />
            </ProtectedRoute>
          }
        />

        {/* ADMIN → MANAGE COW */}
        <Route
          path="/manage-cow"
          element={
            <ProtectedRoute role="admin">
              <ManageCow />
            </ProtectedRoute>
          }
        />

        {/* ================= DOCTOR ================= */}
        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute role="doctor">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* DEWORMING */}
        <Route
          path="/add-deworming"
          element={
            <ProtectedRoute role="doctor">
              <AddDeworming />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-deworming"
          element={
            <ProtectedRoute role="doctor">
              <ManageDeworming />
            </ProtectedRoute>
          }
        />

        <Route path="/add-inventory" element={<ProtectedRoute role="doctor"><AddInventory /></ProtectedRoute>} />
<Route path="/manage-inventory" element={<ProtectedRoute role="doctor"><ManageInventory /></ProtectedRoute>} />

        {/* VACCINATION */}
        <Route
          path="/add-vaccination"
          element={
            <ProtectedRoute role="doctor">
              <AddVaccination />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-vaccination"
          element={
            <ProtectedRoute role="doctor">
              <ManageVaccination />
            </ProtectedRoute>
          }
        />

<Route
  path="/add-rescued-animal"
  element={
    <ProtectedRoute role="doctor">
      <AddRescuedAnimal />
    </ProtectedRoute>
  }
/>
        {/* IMMUNIZATION */}
        <Route
          path="/add-immunization"
          element={
            <ProtectedRoute role="doctor">
              <AddImmunization />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-immunization"
          element={
            <ProtectedRoute role="doctor">
              <ManageImmunization />
            </ProtectedRoute>
          }
        />

        {/* REPRODUCTION */}
        <Route
          path="/add-reproduction"
          element={
            <ProtectedRoute role="doctor">
              <AddReproduction />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-reproduction"
          element={
            <ProtectedRoute role="doctor">
              <ManageReproduction />
            </ProtectedRoute>
          }
        />

        {/* CATTLE INFO */}
        <Route
          path="/add-cattle-info"
          element={
            <ProtectedRoute role="doctor">
              <AddCattleInfo />
            </ProtectedRoute>
          }
        />



       <Route
  path="/manage-rescued-animal"
  element={
    <ProtectedRoute role="doctor">
      <ManageRescuedAnimal />
    </ProtectedRoute>
  }
/>
<Route
  path="/rescued-animal-detail/:id"
  element={
    <ProtectedRoute role="doctor">
      <RescuedAnimalDetail />
    </ProtectedRoute>
  }
/>



<Route
  path="/manage-rescued-animal"
  element={
    <ProtectedRoute role="doctor">
      <ManageRescuedAnimal />
    </ProtectedRoute>
  }
/>
<Route
  path="/rescued-animal-detail/:id"
  element={
    <ProtectedRoute role="doctor">
      <RescuedAnimalDetail />
    </ProtectedRoute>
  }
/>




      </Routes>
    </BrowserRouter>
  );
}

export default App;