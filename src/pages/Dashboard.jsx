import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";

// ── Colour palette for charts ──────────────────────────────────
const COLORS = [
  "#a8d55a", "#e8a84c", "#5bbfaa", "#e86b5a",
  "#5a9de8", "#b87fe8", "#e87ab8", "#f0d060",
];

const CHART_STYLE = {
  background: "var(--bg-card)",
  border: "1px solid var(--border)",
  borderRadius: "14px",
  padding: "20px 16px 10px",
};

const CHART_TITLE = {
  fontFamily: "Playfair Display, serif",
  fontSize: "15px",
  fontWeight: "600",
  color: "var(--text-primary)",
  marginBottom: "14px",
};

// Custom dark tooltip
const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg-surface)",
      border: "1px solid var(--border-accent)",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "13px",
      color: "var(--text-primary)",
    }}>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    cows: 0, bulls: 0, deworming: 0, vaccination: 0,
    immunization: 0, reproduction: 0, rescued: 0,
    inventory: 0, cattle: 0, livedata: 0,
  });

  const [liveData,  setLiveData]  = useState([]);
  const [alerts,    setAlerts]    = useState([]);

  // Chart data states
  const [monthlyInsemination, setMonthlyInsemination] = useState([]);
  const [pregnancyByBreed,    setPregnancyByBreed]    = useState([]);
  const [gestationByBreed,    setGestationByBreed]    = useState([]);
  const [trialByBreed,        setTrialByBreed]        = useState([]);
  const [calfStatus,          setCalfStatus]          = useState([]);
  const [milkByBreed,         setMilkByBreed]         = useState([]);

  useEffect(() => {
    fetchCounts();
    fetchLiveData();
    fetchAlerts();
    fetchChartData();
  }, []);

  // ── Counts ────────────────────────────────────────────────────
  const fetchCounts = async () => {
    const kosalaId = localStorage.getItem("kosalaId");
    try {
      const [cowsRes, dew, vac, imm, rescued, inventory, repro, cattle] =
        await Promise.all([
          axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
          axios.get("http://localhost:5000/api/deworming"),
          axios.get("http://localhost:5000/api/vaccination"),
          axios.get("http://localhost:5000/api/immunization"),
          axios.get(`http://localhost:5000/api/rescued/kosala/${kosalaId}`),
          axios.get(`http://localhost:5000/api/inventory/kosala/${kosalaId}`),
          axios.get(`http://localhost:5000/api/reproduction/kosala/${kosalaId}`),
          axios.get(`http://localhost:5000/api/cattle/kosala/${kosalaId}`),
        ]);

      const cowIds   = new Set(cowsRes.data.map((c) => c.cowId || c._id));
      const cowCount = cowsRes.data.filter((c) => c.type === "cow").length;
      const bullCount= cowsRes.data.filter((c) => c.type === "bull").length;

      setCounts({
        cows:         cowCount,
        bulls:        bullCount,
        deworming:    dew.data.filter((i) => cowIds.has(i.cowId)).length,
        vaccination:  vac.data.filter((i) => cowIds.has(i.cowId)).length,
        immunization: imm.data.filter((i) => cowIds.has(i.cowId)).length,
        reproduction: repro.data.length,
        rescued:      rescued.data.length,
        inventory:    inventory.data.length,
        cattle:       cattle.data.length,
        livedata:     0,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  // ── Alerts ────────────────────────────────────────────────────
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

  // ── Chart Data ────────────────────────────────────────────────
  const fetchChartData = async () => {
    const kosalaId = localStorage.getItem("kosalaId");
    try {
      const [cattleRes, cowsRes, breedsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/cattle/kosala/${kosalaId}`),
        axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
        axios.get("http://localhost:5000/api/breeds"),
      ]);

      const cattleRecords = cattleRes.data;
      const cows          = cowsRes.data;
      const breeds        = breedsRes.data;

      // Map breedId → breed name
      const breedMap = {};
      breeds.forEach((b) => { breedMap[b._id] = b.name; });

      // Map cowId → breed name
      const cowBreedMap = {};
      cows.forEach((c) => {
        cowBreedMap[c.cowId] =
          breedMap[c.breed] || breedMap[c.breed?._id] || "Unknown";
      });

      // ── 1. Monthly Insemination ───────────────────────────────
      const monthCounts = {};
      cattleRecords.forEach((r) => {
        if (!r.inseminationDate) return;
        const month = new Date(r.inseminationDate).toLocaleString("default", {
          month: "short", year: "2-digit",
        });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
      setMonthlyInsemination(
        Object.entries(monthCounts).map(([month, count]) => ({ month, count }))
      );

      // ── 2. Pregnancy by Breed ─────────────────────────────────
      const pregBreed = {};
      cattleRecords
        .filter((r) => r.pregnancyStatus === "Yes")
        .forEach((r) => {
          const breed = cowBreedMap[r.cowId] || "Unknown";
          pregBreed[breed] = (pregBreed[breed] || 0) + 1;
        });
      setPregnancyByBreed(
        Object.entries(pregBreed).map(([breed, count]) => ({ breed, count }))
      );

      // ── 3. Gestation by Breed (61–220 days from insemination) ─
      const gestBreed = {};
      const today = new Date();
      cattleRecords.forEach((r) => {
        if (!r.inseminationDate) return;
        const days = Math.floor(
          (today - new Date(r.inseminationDate)) / (1000 * 60 * 60 * 24)
        );
        if (days >= 61 && days <= 220) {
          const breed = cowBreedMap[r.cowId] || "Unknown";
          gestBreed[breed] = (gestBreed[breed] || 0) + 1;
        }
      });
      setGestationByBreed(
        Object.entries(gestBreed).map(([breed, count]) => ({ breed, count }))
      );

      // ── 4. Trial Techniques by Breed ─────────────────────────
      const trialBreed = {};
      cattleRecords.forEach((r) => {
        if (!r.trialCount) return;
        const breed = cowBreedMap[r.cowId] || "Unknown";
        trialBreed[breed] = (trialBreed[breed] || 0) + Number(r.trialCount);
      });
      setTrialByBreed(
        Object.entries(trialBreed).map(([breed, trials]) => ({ breed, trials }))
      );

      // ── 5. Calf Birth Status ──────────────────────────────────
      let alive = 0, dead = 0;
      cattleRecords.forEach((r) => {
        if (r.calfStatus === "Alive") alive++;
        if (r.calfStatus === "Dead")  dead++;
      });
      setCalfStatus([
        { name: "Alive", value: alive },
        { name: "Dead",  value: dead  },
      ]);

      // ── 6. Milk Yield by Breed ────────────────────────────────
      const milkBreed = {};
      cattleRecords.forEach((r) => {
        if (!r.milkYield) return;
        const breed = cowBreedMap[r.cowId] || "Unknown";
        milkBreed[breed] = (milkBreed[breed] || 0) + Number(r.milkYield);
      });
      setMilkByBreed(
        Object.entries(milkBreed).map(([breed, litres]) => ({ breed, litres }))
      );

    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  // ── Live Data ─────────────────────────────────────────────────
  const fetchLiveData = async () => {
    const kosalaId = localStorage.getItem("kosalaId");
    try {
      const [cowsRes, res] = await Promise.all([
        axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
        axios.get("http://localhost:5000/api/livedata"),
      ]);
      const cowIds = new Set(cowsRes.data.map((c) => c.cowId || c._id));
      const filtered = res.data.filter((i) => cowIds.has(i.cowId));
      setLiveData(filtered);
      setCounts((prev) => ({ ...prev, livedata: filtered.length }));
    } catch {
      setLiveData([{
        cowId: "Cow-1001", temp: 99.9, ax: 1024, ay: 1024,
        az: 1024, humidity: 99.99, lat: 77.96455, lon: 404.4846,
        status: "Normal",
      }]);
    }
  };

  // ── Alert colours ─────────────────────────────────────────────
  const alertStyle = {
    warning: { bg: "rgba(232,168,76,0.12)", border: "var(--accent-amber)", icon: "⚠️" },
    info:    { bg: "rgba(91,191,170,0.12)",  border: "var(--accent-teal)",  icon: "ℹ️" },
    danger:  { bg: "rgba(232,107,90,0.12)",  border: "var(--accent-red)",   icon: "🚨" },
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />

        <h2 className="page-title">Dashboard Overview</h2>

        {/* ── ACTIVE ALERTS ──────────────────────────────────── */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h3 className="section-title">
              Active Alerts ({alerts.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {alerts.map((alert, i) => {
                const s = alertStyle[alert.level] || alertStyle.info;
                return (
                  <div key={i} style={{
                    background: s.bg,
                    border: `1px solid ${s.border}`,
                    borderRadius: "var(--radius-md)",
                    padding: "14px 18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}>
                    <span style={{ fontSize: "20px" }}>{s.icon}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                        {alert.message}
                      </p>
                      <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>
                        Cow: {alert.cowId} — Day {alert.days}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── COUNT CARDS ────────────────────────────────────── */}
        <div className="card-container">
          {[
            { label: "Total Cows",           val: counts.cows,         color: "red",    path: "/manage-cow" },
            { label: "Total Bulls",           val: counts.bulls,        color: "orange", path: "/manage-cow" },
            { label: "Deworming Records",     val: counts.deworming,    color: "blue",   path: "/manage-deworming" },
            { label: "Vaccinations",          val: counts.vaccination,  color: "green",  path: "/manage-vaccination" },
            { label: "Immunizations",         val: counts.immunization, color: "yellow", path: "/manage-immunization" },
            { label: "Reproduction Records",  val: counts.reproduction, color: "purple", path: "/manage-reproduction" },
            { label: "Rescued Animals",       val: counts.rescued,      color: "pink",   path: "/manage-rescued-animal" },
            { label: "Inventory Records",     val: counts.inventory,    color: "teal",   path: "/manage-inventory" },
            { label: "Cattle Info Records",   val: counts.cattle,       color: "orange", path: "/manage-cattle-info" },
            { label: "Live Data Streams",     val: counts.livedata,     color: "dark",   path: null },
          ].map((card, i) => (
            <div
              key={i}
              className={`card ${card.color}${card.path ? " clickable" : ""}`}
              onClick={() => card.path && navigate(card.path)}
            >
              <h3>{card.label}</h3>
              <p>{card.val}</p>
            </div>
          ))}
        </div>

        {/* ── ANALYTICS CHARTS ───────────────────────────────── */}
        <h3 className="section-title" style={{ marginTop: "40px" }}>
          Cattle Analytics
        </h3>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}>

          {/* 1. Monthly Insemination */}
          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Monthly Insemination Count</p>
            {monthlyInsemination.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyInsemination}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" fill="#a8d55a" radius={[4, 4, 0, 0]} name="Inseminations" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 2. Pregnancy by Breed */}
          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Pregnant Cows — Breed Wise</p>
            {pregnancyByBreed.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pregnancyByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Pregnant">
                    {pregnancyByBreed.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 3. Gestation by Breed */}
          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Cows in Gestation Period — Breed Wise</p>
            {gestationByBreed.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gestationByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="In Gestation">
                    {gestationByBreed.map((_, i) => (
                      <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 4. Trial Techniques by Breed */}
          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Trial Techniques — Breed Wise</p>
            {trialByBreed.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trialByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="trials" radius={[4, 4, 0, 0]} name="Trials">
                    {trialByBreed.map((_, i) => (
                      <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 5. Calf Birth Status — Pie */}
          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Calf Birth Status</p>
            {calfStatus.every((c) => c.value === 0) ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={calfStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    <Cell fill="#a8d55a" />
                    <Cell fill="#e86b5a" />
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend
                    formatter={(val) => (
                      <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 6. Milk Yield by Breed */}
          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Milk Yield Per Lactation — Breed Wise (Litres)</p>
            {milkByBreed.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={milkByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="litres" radius={[4, 4, 0, 0]} name="Litres">
                    {milkByBreed.map((_, i) => (
                      <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* ── LIVE DATA TABLE ─────────────────────────────────── */}
        <h3 className="section-title">Live Cow Health Monitoring</h3>
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>#</th><th>Cow ID</th><th>Temp</th><th>Ax</th>
                <th>Ay</th><th>Az</th><th>Humidity</th>
                <th>Latitude</th><th>Longitude</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {liveData.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: "center" }}>
                    No live data available
                  </td>
                </tr>
              ) : (
                liveData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.cowId}</td>
                    <td>{data.temp}</td>
                    <td>{data.ax}</td>
                    <td>{data.ay}</td>
                    <td>{data.az}</td>
                    <td>{data.humidity}</td>
                    <td>{data.lat}</td>
                    <td>{data.lon}</td>
                    <td>
                      <span className={`status ${data.status === "Normal" ? "ok" : "alert"}`}>
                        {data.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;