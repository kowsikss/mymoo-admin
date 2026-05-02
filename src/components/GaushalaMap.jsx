// src/components/GaushalaMap.jsx
import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// ✅ FIX: Leaflet icon issue in production
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

function FitBounds({ gaushalas }) {
  const map = useMap();

  useEffect(() => {
    const valid = gaushalas.filter((g) => g.lat && g.lon);
    if (valid.length === 0) return;

    const bounds = valid.map((g) => [g.lat, g.lon]);
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 });
  }, [gaushalas, map]);

  return null;
}

function getDotColor(cows) {
  if (!cows || cows === 0) return "#94a3b8";
  if (cows < 50) return "#f97316";
  if (cows < 150) return "#eab308";
  return "#22c55e";
}

export default function GaushalaMap({ gaushalas = [] }) {
  const validGaushalas = gaushalas.filter((g) => g.lat && g.lon);
  const missingCoords = gaushalas.length - validGaushalas.length;

  return (
    <div className="gaushala-map-wrapper">
      <div className="map-header">
        <div className="map-title">
          <span className="map-icon">🗺️</span>
          <div>
            <h3>Gaushala Network — India</h3>
            <p>
              {validGaushalas.length} of {gaushalas.length} locations mapped
            </p>
          </div>
        </div>

        <div className="map-legend">
          {[
            { color: "#22c55e", label: "150+ cows" },
            { color: "#eab308", label: "50–149 cows" },
            { color: "#f97316", label: "1–49 cows" },
            { color: "#94a3b8", label: "No data" },
          ].map(({ color, label }) => (
            <span key={label} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{
          height: "460px",
          width: "100%",
          borderRadius: "0 0 16px 16px",
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitBounds gaushalas={validGaushalas} />

        {validGaushalas.map((g) => (
          <CircleMarker
            key={g._id}
            center={[g.lat, g.lon]}
            radius={9}
            pathOptions={{
              fillColor: getDotColor(g.totalCows),
              fillOpacity: 0.88,
              color: "#fff",
              weight: 2,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <strong>{g.name}</strong>
              <br />🐄 {g.totalCows || 0} cows
            </Tooltip>

            <Popup>
              <div style={{ minWidth: 180 }}>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  🏛️ {g.name}
                </p>
                <p style={{ margin: "2px 0", fontSize: 12 }}>
                  👨‍💼 Admin: {g.admin?.name || "Not Assigned"}
                </p>
                <p style={{ margin: "2px 0", fontSize: 12 }}>
                  🩺 Doctor: {g.doctor?.name || "Not Assigned"}
                </p>
                <p style={{ margin: "2px 0", fontSize: 12 }}>
                  🐄 Total Cows: {g.totalCows || 0}
                </p>
                {g.address && (
                  <p style={{ margin: "2px 0", fontSize: 12 }}>
                    📍 {g.address}
                  </p>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {missingCoords > 0 && (
        <p className="map-warning">
          ⚠️ {missingCoords} gaushala
          {missingCoords > 1 ? "s" : ""} not shown — missing{" "}
          <code>lat</code> / <code>lon</code>.
        </p>
      )}
    </div>
  );
}