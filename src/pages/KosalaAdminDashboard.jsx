import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";
import apiClient from "../api/client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";

// ✅ FIX leaflet icons (important for production)
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url
  ).toString(),
  iconUrl: new URL(
    "leaflet/dist/images/marker-icon.png",
    import.meta.url
  ).toString(),
  shadowUrl: new URL(
    "leaflet/dist/images/marker-shadow.png",
    import.meta.url
  ).toString(),
});

// Custom icons
const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selfIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function KosalaAdminDashboard() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");
  const adminName = localStorage.getItem("kosalaAdminName") || "Admin";

  const [counts, setCounts] = useState({
    cows: 0,
    bulls: 0,
    rescued: 0,
    inventory: 0,
  });

  const [gaushalas, setGaushalas] = useState([]);
  const [myGaushala, setMyGaushala] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [
        cowsRes,
        rescuedRes,
        inventoryRes,
        gaushalaRes,
        allRes,
      ] = await Promise.all([
        apiClient.get(`/api/cows/kosala/${kosalaId}`),
        apiClient.get(`/api/rescued/kosala/${kosalaId}`),
        apiClient.get(`/api/inventory/kosala/${kosalaId}`),
        apiClient.get(`/api/kosala/${kosalaId}`), // my gaushala
        apiClient.get(`/api/kosala`), // all gaushalas
      ]);

      const cows = cowsRes.data;

      setCounts({
        cows: cows.filter((c) => c.type === "cow").length,
        bulls: cows.filter((c) => c.type === "bull").length,
        rescued: rescuedRes.data.length,
        inventory: inventoryRes.data.length,
      });

      setMyGaushala(gaushalaRes.data);

      // only gaushalas with coordinates
      const withCoords = allRes.data.filter((g) => g.lat && g.lon);
      setGaushalas(withCoords);

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { label: "Total Cows 🐄", val: counts.cows, color: "red", path: "/kosala-admin/manage-cow" },
    { label: "Total Bulls 🐂", val: counts.bulls, color: "orange", path: "/kosala-admin/manage-cow" },
    { label: "Rescued 🏥", val: counts.rescued, color: "green", path: "/kosala-admin/rescued-animals" },
    { label: "Inventory 📦", val: counts.inventory, color: "blue", path: "/kosala-admin/manage-inventory" },
  ];

  const mapCenter = myGaushala?.lat
    ? [myGaushala.lat, myGaushala.lon]
    : [20.5937, 78.9629];

  return (
    <div className="layout">
      <KosalaAdminSidebar />
      <div className="main">
        <Navbar />

        <h2>Welcome, {adminName} 🌿</h2>
        <p>{myGaushala?.name || "Dashboard"}</p>

        {/* CARDS */}
        <div className="card-container">
          {cards.map((card, i) => (
            <div key={i} className={`card ${card.color}`} onClick={() => navigate(card.path)}>
              <h3>{card.label}</h3>
              <p>{card.val}</p>
            </div>
          ))}
        </div>

        {/* MAP */}
        <div style={{ marginTop: "30px" }}>
          <h3>🗺️ Gaushala Map</h3>

          {loading ? (
            <p>Loading map...</p>
          ) : (
            <MapContainer
              center={mapCenter}
              zoom={myGaushala?.lat ? 10 : 5}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {gaushalas.map((g) => {
                const isMe = g._id === kosalaId;

                return (
                  <Marker
                    key={g._id}
                    position={[g.lat, g.lon]}
                    icon={isMe ? selfIcon : greenIcon}
                  >
                    <Tooltip>{g.name}</Tooltip>
                    <Popup>
                      <strong>{g.name}</strong>
                      <p>{g.address}</p>
                      <p>🐄 {g.totalCows || 0}</p>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export default KosalaAdminDashboard;