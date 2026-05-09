import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// LOGIN
import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import AddRescuedAnimal from "./pages/AddRescuedAnimal";

import KosalaAdminLogin      from "./pages/KosalaAdminLogin";
import KosalaAdminDashboard  from "./pages/KosalaAdminDashboard";
import CowInfo               from "./pages/CowInfo";


import MortalityDetails from "./pages/MortalityDetails";
import BullCalfDetails  from "./pages/BullCalfDetails";
import HeiferDetails    from "./pages/HeiferDetails";

import KosalaAdminAddDoctor   from "./pages/KosalaAdminAddDoctor";
import KosalaAdminDoctorsList from "./pages/KosalaAdminDoctorsList";

import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";

import DoctorManageCow from "./pages/DoctorManageCow";


import ManageCattleInfo from "./pages/ManageCattleInfo";
import AddInventory from "./pages/AddInventory";
import ManageInventory from "./pages/ManageInventory";

import GaushalasList from "./pages/GaushalasList";
import GaushalaInfo from "./pages/GaushalaInfo";
import DoctorsList from "./pages/DoctorsList";
import DoctorInfo from "./pages/DoctorInfo";
import ForgotPassword from "./pages/ForgotPassword";

import ManageRescuedAnimal from "./pages/ManageRescuedAnimal";
import RescuedAnimalDetail from "./pages/RescuedAnimalDetail";

// ADMIN
import AdminDashboard from "./pages/AdminDashboard";
import AddGaushala from "./pages/AddGaushala";
import EditGaushala from "./pages/EditGaushala";
import AddDoctor from "./pages/AddDoctor";
import AdminKosalaDashboard from "./pages/AdminkosalaDashboard";
import AdminAddCow from "./pages/AdminAddCow";
import ManageCow from "./pages/ManageCow"; // ✅ was missing

import ResetPassword from "./pages/ResetPassword";
import HomePage from "./pages/HomePage";
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
import ApplyGaushala       from "./pages/ApplyGaushala";
import DonationPage        from "./pages/DonationPage";

function App() {
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/apply-gaushala" element={<ApplyGaushala />} />
<Route path="/donate"         element={<DonationPage />} />

        <Route
  path="/doctor-manage-cow"
  element={<ProtectedRoute role="doctor"><DoctorManageCow /></ProtectedRoute>}
/>

        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/mortality-details" element={<ProtectedRoute role="doctor"><MortalityDetails /></ProtectedRoute>} />
<Route path="/bull-calf-details" element={<ProtectedRoute role="doctor"><BullCalfDetails /></ProtectedRoute>} />
<Route path="/heifer-details"    element={<ProtectedRoute role="doctor"><HeiferDetails /></ProtectedRoute>} />



        <Route
  path="/kosala-admin/add-doctor"
  element={
    <ProtectedRoute role="kosala-admin">
      <KosalaAdminAddDoctor />
    </ProtectedRoute>
  }
/>
<Route
  path="/kosala-admin/doctors-list"
  element={
    <ProtectedRoute role="kosala-admin">
      <KosalaAdminDoctorsList />
    </ProtectedRoute>
  }
/>
<Route path="/edit-profile" element={<EditProfile />} />
<Route path="/change-password" element={<ChangePassword />} />



        <Route path="/kosala-admin-login" element={<KosalaAdminLogin />} />

<Route path="/kosala-admin-dashboard"
  element={<ProtectedRoute role="kosala-admin"><KosalaAdminDashboard /></ProtectedRoute>} />

<Route path="/kosala-admin/cow-info"
  element={<ProtectedRoute role="kosala-admin"><CowInfo /></ProtectedRoute>} />

<Route path="/kosala-admin/add-cow"
  element={<ProtectedRoute role="kosala-admin"><AdminAddCow /></ProtectedRoute>} />

<Route path="/kosala-admin/manage-cow"
  element={<ProtectedRoute role="kosala-admin"><ManageCow /></ProtectedRoute>} />

<Route path="/kosala-admin/rescued-animals"
  element={<ProtectedRoute role="kosala-admin"><ManageRescuedAnimal /></ProtectedRoute>} />

<Route path="/kosala-admin/add-inventory"
  element={<ProtectedRoute role="kosala-admin"><AddInventory /></ProtectedRoute>} />

{/* ✅ ADDED: Missing manage-inventory route for kosala-admin */}
<Route path="/kosala-admin/manage-inventory"
  element={<ProtectedRoute role="kosala-admin"><ManageInventory /></ProtectedRoute>} />

<Route path="/kosala-admin/add-cattle-info"
  element={<ProtectedRoute role="kosala-admin"><AddCattleInfo /></ProtectedRoute>} />

<Route path="/kosala-admin/manage-cattle-info"
  element={<ProtectedRoute role="kosala-admin"><ManageCattleInfo /></ProtectedRoute>} />

        {/* ================= LOGIN ================= */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/" element={<HomePage />} />
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

{/* ✅ ADDED: Missing edit-gaushala route */}
<Route path="/edit-gaushala/:id" element={<ProtectedRoute role="admin"><EditGaushala /></ProtectedRoute>} />

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
  path="/kosala-admin/add-rescued-animal"
  element={
    <ProtectedRoute role="kosala-admin">
      <AddRescuedAnimal />
    </ProtectedRoute>
  }
/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
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