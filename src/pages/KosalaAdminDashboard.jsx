import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";

import apiClient from "../api/client";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";


// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom green marker
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:  [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

const selfIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize:  [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
});

function KosalaAdminDashboard() {
  const navigate  = useNavigate();
  const kosalaId  = localStorage.getItem("kosalaId");
  const adminName = localStorage.getItem("kosalaAdminName") || "Admin";

  const [counts,    setCounts]    = useState({ cows: 0, bulls: 0, rescued: 0, inventory: 0 });
  const [gaushalas, setGaushalas] = useState([]);
  const [myGaushala, setMyGaushala] = useState(null);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const [cowsRes, rescuedRes, inventoryRes, cattleRes, breedsRes] =
        await Promise.all([
          apiClient.get(`/api/cows/kosala/${kosalaId}`),
          apiClient.get(`/api/rescued/kosala/${kosalaId}`),
          apiClient.get(`/api/inventory/kosala/${kosalaId}`),
          apiClient.get(`/api/cattle/kosala/${kosalaId}`),
          apiClient.get("/api/breeds"),
        ]);

      const cows = cowsRes.data;
      const breeds = breedsRes.data;
      const breedMap = {};
      breeds.forEach((b) => { breedMap[b._id] = b.name; });

      setCounts({
        cows:      cowsRes.data.filter(c => c.type === "cow").length,
        bulls:     cowsRes.data.filter(c => c.type === "bull").length,
        rescued:   rescuedRes.data.length,
        inventory: inventoryRes.data.length,
      });

      setMyGaushala(gaushalaRes.data);

      // Filter gaushalas that have lat/lon
      const withCoords = allRes.data.filter(g => g.lat && g.lon);
      setGaushalas(withCoords);
    } catch (err) {

      console.error("Error fetching dashboard:", err);
    }

    // Alerts
    try {
      const res = await apiClient.get(`/api/alerts/kosala/${kosalaId}`);
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching alerts:", err);

    }
  };

  const cards = [
    { label: "Total Cows 🐄",     val: counts.cows,      color: "red",   path: "/kosala-admin/manage-cow" },
    { label: "Total Bulls 🐂",    val: counts.bulls,     color: "orange",path: "/kosala-admin/manage-cow" },
    { label: "Rescued Animals 🏥",val: counts.rescued,   color: "green", path: "/kosala-admin/rescued-animals" },
    { label: "Inventory 📦",      val: counts.inventory, color: "blue",  path: "/kosala-admin/manage-inventory" },
  ];

  // Map center — use my gaushala's coords or India center
  const mapCenter = myGaushala?.lat
    ? [myGaushala.lat, myGaushala.lon]
    : [20.5937, 78.9629];

  return (
    <div className="layout">
      <KosalaAdminSidebar />
      <div className="main">
        <Navbar />

        <h2>Welcome, {adminName} 🌿</h2>
        <p style={{ color: "var(--text-secondary)", marginTop: "-12px", marginBottom: "24px", fontSize: "13px" }}>
          {myGaushala?.name || "Kosala Admin Dashboard"}
        </p>

        {/* COUNT CARDS */}
        <div className="card-container" style={{ marginBottom: "32px" }}>
          {cards.map((card, i) => (
            <div
              key={i}
              className={`card ${card.color} clickable`}
              onClick={() => navigate(card.path)}
            >
              <h3>{card.label}</h3>
              <p>{card.val}</p>
            </div>
          ))}
        </div>

        {/* LEAFLET MAP */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "32px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <h3 style={{ margin: 0 }}>🗺️ Gaushala Network Map</h3>
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
              — Click a marker to see Gaushala details
            </span>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "12px", fontSize: "12px", color: "var(--text-secondary)" }}>
            <span>🔴 Your Gaushala</span>
            <span>🟢 Other Gaushalas</span>
          </div>

          {loading ? (
            <div style={{ height: "420px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)" }}>
              Loading map...
            </div>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={myGaushala?.lat ? 10 : 5}
              style={{ height: "420px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* All gaushalas */}
              {gaushalas.map(g => {
                const isMe = g._id?.toString() === kosalaId?.toString();
                return (
                  <Marker
                    key={g._id}
                    position={[g.lat, g.lon]}
                    icon={isMe ? selfIcon : greenIcon}
                  >
                    <Tooltip direction="top" offset={[0, -38]} opacity={0.95}>
                      <strong>{g.name}</strong>
                      {isMe && " (Your Gaushala)"}
                    </Tooltip>
                    <Popup minWidth={220}>
                      <div style={{ fontFamily: "sans-serif" }}>
                        <strong style={{ fontSize: "14px", color: "#1a4731" }}>
                          {isMe ? "🔴 " : "🟢 "}{g.name}
                          {isMe && <span style={{ color: "#b45309", fontSize: "11px" }}> (You)</span>}
                        </strong>
                        <hr style={{ margin: "8px 0", borderColor: "#e5e7eb" }} />
                        <p style={{ margin: "4px 0", fontSize: "12px" }}>📍 {g.address}</p>
                        <p style={{ margin: "4px 0", fontSize: "12px" }}>📮 Pincode: {g.pincode}</p>
                        {g.email && <p style={{ margin: "4px 0", fontSize: "12px" }}>✉️ {g.email}</p>}
                        {g.doctor?.name && <p style={{ margin: "4px 0", fontSize: "12px" }}>🩺 Dr. {g.doctor.name}</p>}
                        <p style={{ margin: "4px 0", fontSize: "12px" }}>🐄 Total Cows: {g.totalCows || 0}</p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* If my gaushala has no coords yet */}
              {myGaushala?.lat && !gaushalas.find(g => g._id?.toString() === kosalaId?.toString()) && (
                <Marker position={[myGaushala.lat, myGaushala.lon]} icon={selfIcon}>
                  <Popup>
                    <strong>🔴 {myGaushala.name} (You)</strong>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}>📍 {myGaushala.address}</p>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}>📮 {myGaushala.pincode}</p>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          )}

          {gaushalas.length === 0 && !loading && (
            <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "13px", marginTop: "8px" }}>
              ℹ️ Map markers appear once Gaushalas have coordinates. Coordinates are auto-fetched from pincode on approval.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

export default KosalaAdminDashboard;