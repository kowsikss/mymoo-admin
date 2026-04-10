import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";

const COLORS = ["#a8d55a","#e8a84c","#5bbfaa","#e86b5a","#5a9de8","#b87fe8","#e87ab8","#f0d060"];

const CHART_STYLE = {
  background: "var(--bg-card)", border: "1px solid var(--border)",
  borderRadius: "14px", padding: "20px 16px 10px",
};

const CHART_TITLE = {
  fontFamily: "Playfair Display, serif", fontSize: "15px",
  fontWeight: "600", color: "var(--text-primary)", marginBottom: "14px",
};

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "var(--bg-surface)", border: "1px solid var(--border-accent)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-primary)" }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>)}
    </div>
  );
};

function KosalaAdminDashboard() {
  const navigate = useNavigate();
  const kosalaId = localStorage.getItem("kosalaId");

  const [counts, setCounts] = useState({
    cows: 0, bulls: 0, rescued: 0, inventory: 0, cattle: 0,
  });
  const [alerts, setAlerts]   = useState([]);
  const [feedByMonth, setFeedByMonth] = useState([]);
  const [medicineByMonth, setMedicineByMonth] = useState([]);
  const [semenByMonth, setSemenByMonth] = useState([]);
  const [cowsByBreed, setCowsByBreed] = useState([]);
  const [calfStatusData, setCalfStatusData] = useState([]);

  if (localStorage.getItem("role") !== "kosala-admin") {
    return <Navigate to="/kosala-admin-login" />;
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [cowsRes, rescuedRes, inventoryRes, cattleRes, breedsRes] =
        await Promise.all([
          axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
          axios.get(`http://localhost:5000/api/rescued/kosala/${kosalaId}`),
          axios.get(`http://localhost:5000/api/inventory/kosala/${kosalaId}`),
          axios.get(`http://localhost:5000/api/cattle/kosala/${kosalaId}`),
          axios.get("http://localhost:5000/api/breeds"),
        ]);

      const cows = cowsRes.data;
      const breeds = breedsRes.data;
      const breedMap = {};
      breeds.forEach((b) => { breedMap[b._id] = b.name; });

      setCounts({
        cows:      cows.filter((c) => c.type === "cow").length,
        bulls:     cows.filter((c) => c.type === "bull").length,
        rescued:   rescuedRes.data.length,
        inventory: inventoryRes.data.length,
        cattle:    cattleRes.data.length,
      });

      // Cows by breed
      const breedCount = {};
      cows.forEach((c) => {
        const breed = breedMap[c.breed] || breedMap[c.breed?._id] || "Unknown";
        breedCount[breed] = (breedCount[breed] || 0) + 1;
      });
      setCowsByBreed(Object.entries(breedCount).map(([breed, count]) => ({ breed, count })));

      // Calf status
      let alive = 0, dead = 0;
      cattleRes.data.forEach((r) => {
        if (r.calfStatus === "Alive") alive++;
        if (r.calfStatus === "Dead")  dead++;
      });
      setCalfStatusData([{ name: "Alive", value: alive }, { name: "Dead", value: dead }]);

      // Inventory charts
      const inv = inventoryRes.data;
      const groupByMonth = (items, key) => {
        const map = {};
        items.forEach((r) => {
          if (!r.date) return;
          const month = new Date(r.date).toLocaleString("default", { month: "short", year: "2-digit" });
          map[month] = (map[month] || 0) + (Number(r[key]) || 0);
        });
        return Object.entries(map).map(([month, value]) => ({ month, value }));
      };
      setFeedByMonth(groupByMonth(inv.filter((r) => r.type === "feed"), "gunnyBags"));
      setMedicineByMonth(groupByMonth(inv.filter((r) => r.type === "medicine"), "quantity"));
      setSemenByMonth(groupByMonth(inv.filter((r) => r.type === "semen"), "strawCount"));

    } catch (err) {
      console.error("Error fetching dashboard:", err);
    }

    // Alerts
    try {
      const res = await axios.get(`http://localhost:5000/api/alerts/kosala/${kosalaId}`);
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  const alertStyle = {
    warning: { bg: "rgba(232,168,76,0.12)", border: "var(--accent-amber)", icon: "⚠️" },
    info:    { bg: "rgba(91,191,170,0.12)", border: "var(--accent-teal)",  icon: "ℹ️" },
    danger:  { bg: "rgba(232,107,90,0.12)", border: "var(--accent-red)",   icon: "🚨" },
  };

  const noDataMsg = <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>;

  return (
    <div className="layout">
      <KosalaAdminSidebar />
      <div className="main">
        <Navbar />
        <h2 className="page-title">Kosala Dashboard</h2>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h3 className="section-title">Active Alerts ({alerts.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {alerts.map((alert, i) => {
                const s = alertStyle[alert.level] || alertStyle.info;
                return (
                  <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "var(--radius-md)", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "20px" }}>{s.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>{alert.message}</p>
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>{alert.cowId} — Day {alert.days}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COUNT CARDS */}
        <div className="card-container">
          {[
            { label: "Total Cows",    val: counts.cows,      color: "red",    path: "/kosala-admin/cow-info" },
            { label: "Total Bulls",   val: counts.bulls,     color: "orange", path: "/kosala-admin/cow-info" },
            { label: "Rescued",       val: counts.rescued,   color: "pink",   path: "/kosala-admin/rescued-animals" },
            { label: "Inventory",     val: counts.inventory, color: "teal",   path: "/kosala-admin/manage-inventory" },
            { label: "Cattle Info",   val: counts.cattle,    color: "purple", path: "/kosala-admin/manage-cattle-info" },
          ].map((card, i) => (
            <div key={i} className={`card ${card.color} clickable`} onClick={() => navigate(card.path)}>
              <h3>{card.label}</h3>
              <p>{card.val}</p>
            </div>
          ))}
        </div>

        {/* CHARTS */}
        <h3 className="section-title" style={{ marginTop: "40px" }}>Analytics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", marginBottom: "40px" }}>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Cows — Breed Wise</p>
            {cowsByBreed.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={cowsByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[4,4,0,0]} name="Cows">
                    {cowsByBreed.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Calf Birth Status</p>
            {calfStatusData.every((c) => c.value === 0) ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={calfStatusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    <Cell fill="#a8d55a" /><Cell fill="#e86b5a" />
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend formatter={(val) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Feed Stock — Month Wise (Gunny Bags)</p>
            {feedByMonth.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={feedByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="value" radius={[4,4,0,0]} name="Bags">
                    {feedByMonth.map((entry, i) => <Cell key={i} fill={entry.value < 100 ? "#e86b5a" : "#a8d55a"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>* Red = below 100 bags</p>
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Medicine Stock — Month Wise</p>
            {medicineByMonth.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={medicineByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="value" radius={[4,4,0,0]} name="Quantity">
                    {medicineByMonth.map((_, i) => <Cell key={i} fill={COLORS[(i+2) % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Semen Straw Stock — Month Wise</p>
            {semenByMonth.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={semenByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="value" radius={[4,4,0,0]} name="Straws">
                    {semenByMonth.map((entry, i) => <Cell key={i} fill={entry.value < 20 ? "#e86b5a" : "#b87fe8"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>* Red = below 20 straws</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default KosalaAdminDashboard;