import { useEffect, useState } from "react";
import axios from "axios";

function AlertBanner() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");
      const res = await axios.get(
        `http://localhost:5000/api/alerts/kosala/${kosalaId}`
      );
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  if (alerts.length === 0) return null;

  const bgColor = {
    warning: "rgba(232,168,76,0.15)",
    info:    "rgba(91,191,170,0.15)",
    danger:  "rgba(232,107,90,0.15)",
  };

  const borderColor = {
    warning: "var(--accent-amber)",
    info:    "var(--accent-teal)",
    danger:  "var(--accent-red)",
  };

  const icon = {
    warning: "⚠️",
    info:    "ℹ️",
    danger:  "🚨",
  };

  return (
    <div style={{ marginBottom: "28px" }}>
      <h3 className="section-title" style={{ marginBottom: "14px" }}>
        Active Alerts ({alerts.length})
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {alerts.map((alert, i) => (
          <div
            key={i}
            style={{
              background: bgColor[alert.level],
              border: `1px solid ${borderColor[alert.level]}`,
              borderRadius: "var(--radius-md)",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "20px" }}>{icon[alert.level]}</span>
            <div>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-primary)",
                  fontWeight: "600",
                  fontSize: "14px",
                }}
              >
                {alert.message}
              </p>
              <p
                style={{
                  margin: "4px 0 0",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                }}
              >
                Cow: {alert.cowId} — Day {alert.days}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlertBanner;