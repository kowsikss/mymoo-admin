// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
// import "../styles/dashboard.css";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
//   PieChart, Pie, Cell, Legend, CartesianGrid,
// } from "recharts";

// const COLORS = [
//   "#a8d55a", "#e8a84c", "#5bbfaa", "#e86b5a",
//   "#5a9de8", "#b87fe8", "#e87ab8", "#f0d060",
// ];

// const CHART_STYLE = {
//   background: "var(--bg-card)",
//   border: "1px solid var(--border)",
//   borderRadius: "14px",
//   padding: "20px 16px 10px",
// };

// const CHART_TITLE = {
//   fontFamily: "Playfair Display, serif",
//   fontSize: "15px",
//   fontWeight: "600",
//   color: "var(--text-primary)",
//   marginBottom: "14px",
// };

// const DarkTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div style={{
//       background: "var(--bg-surface)",
//       border: "1px solid var(--border-accent)",
//       borderRadius: "8px",
//       padding: "10px 14px",
//       fontSize: "13px",
//       color: "var(--text-primary)",
//     }}>
//       <p style={{ fontWeight: 700, marginBottom: 4 }}>{label}</p>
//       {payload.map((p, i) => (
//         <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
//       ))}
//     </div>
//   );
// };

// function Dashboard() {
//   const navigate = useNavigate();

//   // ── Count states ──────────────────────────────────────────────
//   const [counts, setCounts] = useState({
//     cows: 0, bulls: 0, deworming: 0, vaccination: 0,
//     immunization: 0, reproduction: 0, rescued: 0,
//     inventory: 0, cattle: 0, livedata: 0,
//   });
//   const [liveData, setLiveData] = useState([]);
//   const [alerts,   setAlerts]   = useState([]);

//   // ── Cattle chart states ───────────────────────────────────────
//   const [monthlyInsemination, setMonthlyInsemination] = useState([]);
//   const [pregnancyByBreed,    setPregnancyByBreed]    = useState([]);
//   const [gestationByBreed,    setGestationByBreed]    = useState([]);
//   const [trialByBreed,        setTrialByBreed]        = useState([]);
//   const [calfStatus,          setCalfStatus]          = useState([]);
//   const [milkByBreed,         setMilkByBreed]         = useState([]);

//   // ── Rescued chart states ──────────────────────────────────────
//   const [rescuedBySex,    setRescuedBySex]    = useState([]);
//   const [rescuedByBreed,  setRescuedByBreed]  = useState([]);
//   const [rescuedByReason, setRescuedByReason] = useState([]);

//   // ✅ Inventory chart states — INSIDE the function (was the bug)
//   const [feedByMonth,     setFeedByMonth]     = useState([]);
//   const [medicineByMonth, setMedicineByMonth] = useState([]);
//   const [semenByMonth,    setSemenByMonth]    = useState([]);

//   useEffect(() => {
//     fetchCounts();
//     fetchLiveData();
//     fetchAlerts();
//     fetchChartData();
//     fetchInventoryCharts();
//   }, []);

//   const fetchCounts = async () => {
//     const kosalaId = localStorage.getItem("kosalaId");
//     try {
//       const [cowsRes, dew, vac, imm, rescued, inventory, repro, cattle] =
//         await Promise.all([
//           axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
//           axios.get("http://localhost:5000/api/deworming"),
//           axios.get("http://localhost:5000/api/vaccination"),
//           axios.get("http://localhost:5000/api/immunization"),
//           axios.get(`http://localhost:5000/api/rescued/kosala/${kosalaId}`),
//           axios.get(`http://localhost:5000/api/inventory/kosala/${kosalaId}`),
//           axios.get(`http://localhost:5000/api/reproduction/kosala/${kosalaId}`),
//           axios.get(`http://localhost:5000/api/cattle/kosala/${kosalaId}`),
//         ]);
//       const cowIds    = new Set(cowsRes.data.map((c) => c.cowId || c._id));
//       const cowCount  = cowsRes.data.filter((c) => c.type === "cow").length;
//       const bullCount = cowsRes.data.filter((c) => c.type === "bull").length;
//       setCounts({
//         cows: cowCount, bulls: bullCount,
//         deworming:    dew.data.filter((i) => cowIds.has(i.cowId)).length,
//         vaccination:  vac.data.filter((i) => cowIds.has(i.cowId)).length,
//         immunization: imm.data.filter((i) => cowIds.has(i.cowId)).length,
//         reproduction: repro.data.length,
//         rescued:      rescued.data.length,
//         inventory:    inventory.data.length,
//         cattle:       cattle.data.length,
//         livedata:     0,
//       });
//     } catch (err) { console.error("Error fetching counts:", err); }
//   };

//   const fetchAlerts = async () => {
//     try {
//       const kosalaId = localStorage.getItem("kosalaId");
//       const res = await axios.get(`http://localhost:5000/api/alerts/kosala/${kosalaId}`);
//       setAlerts(res.data);
//     } catch (err) { console.error("Error fetching alerts:", err); }
//   };

//   const fetchInventoryCharts = async () => {
//     const kosalaId = localStorage.getItem("kosalaId");
//     try {
//       const res = await axios.get(`http://localhost:5000/api/inventory/kosala/${kosalaId}`);
//       const records = res.data;
//       const groupByMonth = (items, valueKey) => {
//         const monthMap = {};
//         items.forEach((r) => {
//           if (!r.date) return;
//           const month = new Date(r.date).toLocaleString("default", { month: "short", year: "2-digit" });
//           monthMap[month] = (monthMap[month] || 0) + (Number(r[valueKey]) || 0);
//         });
//         return Object.entries(monthMap).map(([month, value]) => ({ month, value }));
//       };
//       setFeedByMonth(groupByMonth(records.filter((r) => r.type === "feed"), "gunnyBags"));
//       setMedicineByMonth(groupByMonth(records.filter((r) => r.type === "medicine"), "quantity"));
//       setSemenByMonth(groupByMonth(records.filter((r) => r.type === "semen"), "strawCount"));
//     } catch (err) { console.error("Error fetching inventory charts:", err); }
//   };

//   const fetchChartData = async () => {
//     const kosalaId = localStorage.getItem("kosalaId");
//     try {
//       const [cattleRes, cowsRes, breedsRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/cattle/kosala/${kosalaId}`),
//         axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
//         axios.get("http://localhost:5000/api/breeds"),
//       ]);
//       const cattleRecords = cattleRes.data;
//       const cows = cowsRes.data;
//       const breeds = breedsRes.data;
//       const breedMap = {};
//       breeds.forEach((b) => { breedMap[b._id] = b.name; });
//       const cowBreedMap = {};
//       cows.forEach((c) => { cowBreedMap[c.cowId] = breedMap[c.breed] || breedMap[c.breed?._id] || "Unknown"; });

//       const monthCounts = {};
//       cattleRecords.forEach((r) => {
//         if (!r.inseminationDate) return;
//         const month = new Date(r.inseminationDate).toLocaleString("default", { month: "short", year: "2-digit" });
//         monthCounts[month] = (monthCounts[month] || 0) + 1;
//       });
//       setMonthlyInsemination(Object.entries(monthCounts).map(([month, count]) => ({ month, count })));

//       const pregBreed = {};
//       cattleRecords.filter((r) => r.pregnancyStatus === "Yes").forEach((r) => {
//         const breed = cowBreedMap[r.cowId] || "Unknown";
//         pregBreed[breed] = (pregBreed[breed] || 0) + 1;
//       });
//       setPregnancyByBreed(Object.entries(pregBreed).map(([breed, count]) => ({ breed, count })));

//       const gestBreed = {};
//       const today = new Date();
//       cattleRecords.forEach((r) => {
//         if (!r.inseminationDate) return;
//         const days = Math.floor((today - new Date(r.inseminationDate)) / (1000 * 60 * 60 * 24));
//         if (days >= 61 && days <= 220) {
//           const breed = cowBreedMap[r.cowId] || "Unknown";
//           gestBreed[breed] = (gestBreed[breed] || 0) + 1;
//         }
//       });
//       setGestationByBreed(Object.entries(gestBreed).map(([breed, count]) => ({ breed, count })));

//       const trialBreed = {};
//       cattleRecords.forEach((r) => {
//         if (!r.trialCount) return;
//         const breed = cowBreedMap[r.cowId] || "Unknown";
//         trialBreed[breed] = (trialBreed[breed] || 0) + Number(r.trialCount);
//       });
//       setTrialByBreed(Object.entries(trialBreed).map(([breed, trials]) => ({ breed, trials })));

//       let alive = 0, dead = 0;
//       cattleRecords.forEach((r) => { if (r.calfStatus === "Alive") alive++; if (r.calfStatus === "Dead") dead++; });
//       setCalfStatus([{ name: "Alive", value: alive }, { name: "Dead", value: dead }]);

//       const milkBreed = {};
//       cattleRecords.forEach((r) => {
//         if (!r.milkYield) return;
//         const breed = cowBreedMap[r.cowId] || "Unknown";
//         milkBreed[breed] = (milkBreed[breed] || 0) + Number(r.milkYield);
//       });
//       setMilkByBreed(Object.entries(milkBreed).map(([breed, litres]) => ({ breed, litres })));

//     } catch (err) { console.error("Error fetching cattle charts:", err); }

//     try {
//       const [rescuedRes, breedsRes] = await Promise.all([
//         axios.get(`http://localhost:5000/api/rescued/kosala/${localStorage.getItem("kosalaId")}`),
//         axios.get("http://localhost:5000/api/breeds"),
//       ]);
//       const rescued = rescuedRes.data;
//       const breedMap = {};
//       breedsRes.data.forEach((b) => { breedMap[b._id] = b.name; });

//       let rCow = 0, rBull = 0;
//       rescued.forEach((r) => { if (r.sex === "Cow") rCow++; if (r.sex === "Bull") rBull++; });
//       setRescuedBySex([{ name: "Cow", value: rCow }, { name: "Bull", value: rBull }]);

//       const rBreed = {};
//       rescued.forEach((r) => {
//         const breed = breedMap[r.breed] || breedMap[String(r.breed)] || r.breed || "Unknown";
//         rBreed[breed] = (rBreed[breed] || 0) + 1;
//       });
//       setRescuedByBreed(Object.entries(rBreed).map(([breed, count]) => ({ breed, count })));

//       const rReason = {};
//       rescued.forEach((r) => {
//         const reason = r.reasonOfAdoption || "Not Specified";
//         rReason[reason] = (rReason[reason] || 0) + 1;
//       });
//       setRescuedByReason(Object.entries(rReason).map(([reason, count]) => ({ reason, count })));

//     } catch (err) { console.error("Error fetching rescued charts:", err); }
//   };

//   const fetchLiveData = async () => {
//     const kosalaId = localStorage.getItem("kosalaId");
//     try {
//       const [cowsRes, res] = await Promise.all([
//         axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
//         axios.get("http://localhost:5000/api/livedata"),
//       ]);
//       const cowIds = new Set(cowsRes.data.map((c) => c.cowId || c._id));
//       const filtered = res.data.filter((i) => cowIds.has(i.cowId));
//       setLiveData(filtered);
//       setCounts((prev) => ({ ...prev, livedata: filtered.length }));
//     } catch {
//       setLiveData([{ cowId: "Cow-1001", temp: 99.9, ax: 1024, ay: 1024, az: 1024, humidity: 99.99, lat: 77.96455, lon: 404.4846, status: "Normal" }]);
//     }
//   };

//   const alertStyle = {
//     warning: { bg: "rgba(232,168,76,0.12)",  border: "var(--accent-amber)", icon: "⚠️" },
//     info:    { bg: "rgba(91,191,170,0.12)",   border: "var(--accent-teal)",  icon: "ℹ️" },
//     danger:  { bg: "rgba(232,107,90,0.12)",   border: "var(--accent-red)",   icon: "🚨" },
//   };

//   const noDataMsg = <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>;

//   const cards = [
//     { label: "Total Cows",          val: counts.cows,         color: "red",    path: "/manage-cow" },
//     { label: "Total Bulls",         val: counts.bulls,        color: "orange", path: "/manage-cow" },
//     { label: "Deworming Records",   val: counts.deworming,    color: "blue",   path: "/manage-deworming" },
//     { label: "Vaccinations",        val: counts.vaccination,  color: "green",  path: "/manage-vaccination" },
//     { label: "Immunizations",       val: counts.immunization, color: "yellow", path: "/manage-immunization" },
//     { label: "Reproduction",        val: counts.reproduction, color: "purple", path: "/manage-reproduction" },
//     { label: "Rescued Animals",     val: counts.rescued,      color: "pink",   path: "/manage-rescued-animal" },
//     { label: "Inventory Records",   val: counts.inventory,    color: "teal",   path: "/manage-inventory" },
//     { label: "Cattle Info Records", val: counts.cattle,       color: "orange", path: "/manage-cattle-info" },
//     { label: "Live Data Streams",   val: counts.livedata,     color: "dark",   path: null },
//   ];

//   return (
//     <div className="layout">
//       <Sidebar />
//       <div className="main">
//         <Navbar />
//         <h2 className="page-title">Dashboard Overview</h2>

//         {/* ALERTS */}
//         {alerts.length > 0 && (
//           <div style={{ marginBottom: "32px" }}>
//             <h3 className="section-title">Active Alerts ({alerts.length})</h3>
//             <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
//               {alerts.map((alert, i) => {
//                 const s = alertStyle[alert.level] || alertStyle.info;
//                 return (
//                   <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: "var(--radius-md)", padding: "14px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
//                     <span style={{ fontSize: "20px" }}>{s.icon}</span>
//                     <div>
//                       <p style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>{alert.message}</p>
//                       <p style={{ margin: "4px 0 0", fontSize: "12px", color: "var(--text-secondary)" }}>{alert.cowId} — Day {alert.days}</p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* COUNT CARDS */}
//         <div className="card-container">
//           {cards.map((card, i) => (
//             <div key={i} className={`card ${card.color}${card.path ? " clickable" : ""}`} onClick={() => card.path && navigate(card.path)}>
//               <h3>{card.label}</h3>
//               <p>{card.val}</p>
//             </div>
//           ))}
//         </div>

//         {/* CATTLE ANALYTICS */}
//         <h3 className="section-title" style={{ marginTop: "40px" }}>Cattle Analytics</h3>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", marginBottom: "40px" }}>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Monthly Insemination Count</p>
//             {monthlyInsemination.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={monthlyInsemination}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="count" fill="#a8d55a" radius={[4, 4, 0, 0]} name="Inseminations" />
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Pregnant Cows — Breed Wise</p>
//             {pregnancyByBreed.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={pregnancyByBreed}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Pregnant">
//                     {pregnancyByBreed.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Cows in Gestation Period — Breed Wise</p>
//             {gestationByBreed.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={gestationByBreed}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="count" radius={[4, 4, 0, 0]} name="In Gestation">
//                     {gestationByBreed.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Trial Techniques — Breed Wise</p>
//             {trialByBreed.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={trialByBreed}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="trials" radius={[4, 4, 0, 0]} name="Trials">
//                     {trialByBreed.map((_, i) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Calf Birth Status</p>
//             {calfStatus.every((c) => c.value === 0) ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <PieChart>
//                   <Pie data={calfStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
//                     <Cell fill="#a8d55a" /><Cell fill="#e86b5a" />
//                   </Pie>
//                   <Tooltip content={<DarkTooltip />} />
//                   <Legend formatter={(val) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{val}</span>} />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Milk Yield Per Lactation — Breed Wise (Litres)</p>
//             {milkByBreed.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={milkByBreed}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="litres" radius={[4, 4, 0, 0]} name="Litres">
//                     {milkByBreed.map((_, i) => <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//         </div>

//         {/* RESCUED ANALYTICS */}
//         <h3 className="section-title" style={{ marginTop: "40px" }}>Rescued Animals Analytics</h3>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", marginBottom: "40px" }}>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Rescued Animals — Cow vs Bull</p>
//             {rescuedBySex.every((c) => c.value === 0) ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <PieChart>
//                   <Pie data={rescuedBySex} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
//                     <Cell fill="#a8d55a" /><Cell fill="#e8a84c" />
//                   </Pie>
//                   <Tooltip content={<DarkTooltip />} />
//                   <Legend formatter={(val) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{val}</span>} />
//                 </PieChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Rescued Animals — Breed Wise</p>
//             {rescuedByBreed.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={rescuedByBreed}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Rescued">
//                     {rescuedByBreed.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Reason of Adoption Breakdown</p>
//             {rescuedByReason.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={rescuedByReason} layout="vertical">
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis type="number" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis type="category" dataKey="reason" width={110} tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Count">
//                     {rescuedByReason.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//         </div>

//         {/* INVENTORY ANALYTICS */}
//         <h3 className="section-title" style={{ marginTop: "40px" }}>Inventory Analytics</h3>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", marginBottom: "40px" }}>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Feed Stock — Month Wise (Gunny Bags)</p>
//             {feedByMonth.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={feedByMonth}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Gunny Bags">
//                     {feedByMonth.map((entry, i) => <Cell key={i} fill={entry.value < 100 ? "#e86b5a" : "#a8d55a"} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//             <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>* Red bars = below 100 bags threshold</p>
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Medicine / Drug Stock — Month Wise (Quantity)</p>
//             {medicineByMonth.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={medicineByMonth}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Quantity">
//                     {medicineByMonth.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//           </div>

//           <div style={CHART_STYLE}>
//             <p style={CHART_TITLE}>Semen Straw Stock — Month Wise (Count)</p>
//             {semenByMonth.length === 0 ? noDataMsg : (
//               <ResponsiveContainer width="100%" height={220}>
//                 <BarChart data={semenByMonth}>
//                   <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
//                   <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
//                   <Tooltip content={<DarkTooltip />} />
//                   <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Straws">
//                     {semenByMonth.map((entry, i) => <Cell key={i} fill={entry.value < 20 ? "#e86b5a" : "#b87fe8"} />)}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             )}
//             <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>* Red bars = below 20 straws threshold</p>
//           </div>

//         </div>

//         {/* LIVE DATA TABLE */}
//         <h3 className="section-title">Live Cow Health Monitoring</h3>
//         <div className="table-wrapper">
//           <table className="table">
//             <thead>
//               <tr>
//                 <th>#</th><th>Cow ID</th><th>Temp</th><th>Ax</th>
//                 <th>Ay</th><th>Az</th><th>Humidity</th>
//                 <th>Latitude</th><th>Longitude</th><th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {liveData.length === 0 ? (
//                 <tr><td colSpan="10" style={{ textAlign: "center" }}>No live data available</td></tr>
//               ) : (
//                 liveData.map((data, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td><td>{data.cowId}</td>
//                     <td>{data.temp}</td><td>{data.ax}</td>
//                     <td>{data.ay}</td><td>{data.az}</td>
//                     <td>{data.humidity}</td><td>{data.lat}</td>
//                     <td>{data.lon}</td>
//                     <td>
//                       <span className={`status ${data.status === "Normal" ? "ok" : "alert"}`}>
//                         {data.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Dashboard;
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
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();

  const [counts, setCounts] = useState({
    cows: 0, bulls: 0,totalCattle: 0, deworming: 0, vaccination: 0,
    immunization: 0, reproduction: 0, rescued: 0,
    inventory: 0, cattle: 0, livedata: 0,
    mortality: 0, bullCalf: 0, heifer: 0,
  });

  const [liveData, setLiveData] = useState([]);
  const [alerts,   setAlerts]   = useState([]);

  const [monthlyInsemination, setMonthlyInsemination] = useState([]);
  const [pregnancyByBreed,    setPregnancyByBreed]    = useState([]);
  const [gestationByBreed,    setGestationByBreed]    = useState([]);
  const [trialByBreed,        setTrialByBreed]        = useState([]);
  const [calfStatus,          setCalfStatus]          = useState([]);
  const [milkByBreed,         setMilkByBreed]         = useState([]);

  const [rescuedBySex,    setRescuedBySex]    = useState([]);
  const [rescuedByBreed,  setRescuedByBreed]  = useState([]);
  const [rescuedByReason, setRescuedByReason] = useState([]);

  const [feedByMonth,     setFeedByMonth]     = useState([]);
  const [medicineByMonth, setMedicineByMonth] = useState([]);
  const [semenByMonth,    setSemenByMonth]    = useState([]);

  useEffect(() => {
    fetchCounts();
    fetchLiveData();
    fetchAlerts();
    fetchChartData();
    fetchInventoryCharts();
  }, []);

  // ── FETCH COUNTS ─────────────────────────────────────────────
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

      const cowIds    = new Set(cowsRes.data.map((c) => c.cowId || c._id));
      const cowCount  = cowsRes.data.filter((c) => c.type === "cow").length;
      const bullCount = cowsRes.data.filter((c) => c.type === "bull").length;

      // ✅ Deceased cows marked in ManageCow
      const deceasedCows = cowsRes.data.filter((c) => c.healthStatus === "Deceased").length;

      // ✅ Dead calves submitted from AddCattleInfo
      const deadCalves = cattle.data.filter((c) => c.calfStatus === "Dead").length;

      // ✅ Total mortality = deceased cows + dead calves
      const mortalityCount = deceasedCows + deadCalves;

      const bullCalfCount = cowsRes.data.filter((c) => c.calfStatus === "Bull Calf").length;
      const heiferCount   = cowsRes.data.filter((c) => c.calfStatus === "Heifer").length;
      const totalCattle   = cowCount + bullCount;
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
        mortality:    mortalityCount,
        bullCalf:     bullCalfCount,
        totalCattle: totalCattle,
        heifer:       heiferCount,
      });
    } catch (err) {
      console.error("Error fetching counts:", err);
    }
  };

  // ── FETCH ALERTS ─────────────────────────────────────────────
  const fetchAlerts = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");
      const res = await axios.get(`http://localhost:5000/api/alerts/kosala/${kosalaId}`);
      setAlerts(res.data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    }
  };

  // ── FETCH INVENTORY CHARTS ────────────────────────────────────
  const fetchInventoryCharts = async () => {
    const kosalaId = localStorage.getItem("kosalaId");
    try {
      const res     = await axios.get(`http://localhost:5000/api/inventory/kosala/${kosalaId}`);
      const records = res.data;

      const groupByMonth = (items, valueKey) => {
        const monthMap = {};
        items.forEach((r) => {
          if (!r.date) return;
          const month = new Date(r.date).toLocaleString("default", { month: "short", year: "2-digit" });
          monthMap[month] = (monthMap[month] || 0) + (Number(r[valueKey]) || 0);
        });
        return Object.entries(monthMap).map(([month, value]) => ({ month, value }));
      };

      setFeedByMonth(groupByMonth(records.filter((r) => r.type === "feed"), "gunnyBags"));
      setMedicineByMonth(groupByMonth(records.filter((r) => r.type === "medicine"), "quantity"));
      setSemenByMonth(groupByMonth(records.filter((r) => r.type === "semen"), "strawCount"));
    } catch (err) {
      console.error("Error fetching inventory charts:", err);
    }
  };

  // ── FETCH CATTLE + RESCUED CHARTS ────────────────────────────
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

      const breedMap = {};
      breeds.forEach((b) => { breedMap[b._id] = b.name; });

      const cowBreedMap = {};
      cows.forEach((c) => {
        cowBreedMap[c.cowId] = breedMap[c.breed] || breedMap[c.breed?._id] || "Unknown";
      });

      // Monthly insemination
      const monthCounts = {};
      cattleRecords.forEach((r) => {
        if (!r.inseminationDate) return;
        const month = new Date(r.inseminationDate).toLocaleString("default", { month: "short", year: "2-digit" });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });
      setMonthlyInsemination(Object.entries(monthCounts).map(([month, count]) => ({ month, count })));

      // Pregnancy by breed
      const pregBreed = {};
      cattleRecords.filter((r) => r.pregnancyStatus === "Yes").forEach((r) => {
        const breed = cowBreedMap[r.cowId] || "Unknown";
        pregBreed[breed] = (pregBreed[breed] || 0) + 1;
      });
      setPregnancyByBreed(Object.entries(pregBreed).map(([breed, count]) => ({ breed, count })));

      // Gestation by breed
      const gestBreed = {};
      const today = new Date();
      cattleRecords.forEach((r) => {
        if (!r.inseminationDate) return;
        const days = Math.floor((today - new Date(r.inseminationDate)) / (1000 * 60 * 60 * 24));
        if (days >= 61 && days <= 220) {
          const breed = cowBreedMap[r.cowId] || "Unknown";
          gestBreed[breed] = (gestBreed[breed] || 0) + 1;
        }
      });
      setGestationByBreed(Object.entries(gestBreed).map(([breed, count]) => ({ breed, count })));

      // Trial by breed
      const trialBreed = {};
      cattleRecords.forEach((r) => {
        if (!r.trialCount) return;
        const breed = cowBreedMap[r.cowId] || "Unknown";
        trialBreed[breed] = (trialBreed[breed] || 0) + Number(r.trialCount);
      });
      setTrialByBreed(Object.entries(trialBreed).map(([breed, trials]) => ({ breed, trials })));

      // Calf status pie
      let alive = 0, dead = 0;
      cattleRecords.forEach((r) => {
        if (r.calfStatus === "Alive") alive++;
        if (r.calfStatus === "Dead")  dead++;
      });
      setCalfStatus([{ name: "Alive", value: alive }, { name: "Dead", value: dead }]);

      // Milk by breed
      const milkBreed = {};
      cattleRecords.forEach((r) => {
        if (!r.milkYield) return;
        const breed = cowBreedMap[r.cowId] || "Unknown";
        milkBreed[breed] = (milkBreed[breed] || 0) + Number(r.milkYield);
      });
      setMilkByBreed(Object.entries(milkBreed).map(([breed, litres]) => ({ breed, litres })));

    } catch (err) {
      console.error("Error fetching cattle charts:", err);
    }

    // Rescued charts
    try {
      const [rescuedRes, breedsRes] = await Promise.all([
        axios.get(`http://localhost:5000/api/rescued/kosala/${localStorage.getItem("kosalaId")}`),
        axios.get("http://localhost:5000/api/breeds"),
      ]);

      const rescued  = rescuedRes.data;
      const breedMap = {};
      breedsRes.data.forEach((b) => { breedMap[b._id] = b.name; });

      let rCow = 0, rBull = 0;
      rescued.forEach((r) => {
        if (r.sex === "Cow")  rCow++;
        if (r.sex === "Bull") rBull++;
      });
      setRescuedBySex([{ name: "Cow", value: rCow }, { name: "Bull", value: rBull }]);

      const rBreed = {};
      rescued.forEach((r) => {
        const breed = breedMap[r.breed] || breedMap[String(r.breed)] || r.breed || "Unknown";
        rBreed[breed] = (rBreed[breed] || 0) + 1;
      });
      setRescuedByBreed(Object.entries(rBreed).map(([breed, count]) => ({ breed, count })));

      const rReason = {};
      rescued.forEach((r) => {
        const reason = r.reasonOfAdoption || "Not Specified";
        rReason[reason] = (rReason[reason] || 0) + 1;
      });
      setRescuedByReason(Object.entries(rReason).map(([reason, count]) => ({ reason, count })));

    } catch (err) {
      console.error("Error fetching rescued charts:", err);
    }
  };

  // ── FETCH LIVE DATA ───────────────────────────────────────────
  const fetchLiveData = async () => {
    const kosalaId = localStorage.getItem("kosalaId");
    try {
      const [cowsRes, res] = await Promise.all([
        axios.get(`http://localhost:5000/api/cows/kosala/${kosalaId}`),
        axios.get("http://localhost:5000/api/livedata"),
      ]);
      const cowIds   = new Set(cowsRes.data.map((c) => c.cowId || c._id));
      const filtered = res.data.filter((i) => cowIds.has(i.cowId));
      setLiveData(filtered);
      setCounts((prev) => ({ ...prev, livedata: filtered.length }));
    } catch {
      setLiveData([{
        cowId: "Cow-1001", temp: 99.9, ax: 1024, ay: 1024, az: 1024,
        humidity: 99.99, lat: 77.96455, lon: 404.4846, status: "Normal",
      }]);
    }
  };

  const alertStyle = {
    warning: { bg: "rgba(232,168,76,0.12)",  border: "var(--accent-amber)", icon: "⚠️" },
    info:    { bg: "rgba(91,191,170,0.12)",   border: "var(--accent-teal)",  icon: "ℹ️" },
    danger:  { bg: "rgba(232,107,90,0.12)",   border: "var(--accent-red)",   icon: "🚨" },
  };

  const noDataMsg = <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No data yet</p>;

  const cards = [
    { label: "Total Cattle 🐄🐂", val: counts.totalCattle, color: "blue",   path: "/manage-cow"            },
    { label: "Total Cows",          val: counts.cows,         color: "red",    path: "/manage-cow"            },
    { label: "Total Bulls",         val: counts.bulls,        color: "orange", path: "/manage-cow"            },
    { label: "Deworming Records",   val: counts.deworming,    color: "blue",   path: "/manage-deworming"      },
    { label: "Vaccinations",        val: counts.vaccination,  color: "green",  path: "/manage-vaccination"    },
    { label: "Immunizations",       val: counts.immunization, color: "yellow", path: "/manage-immunization"   },
    { label: "Reproduction",        val: counts.reproduction, color: "purple", path: "/manage-reproduction"   },
    { label: "Rescued Animals",     val: counts.rescued,      color: "pink",   path: "/manage-rescued-animal" },
    { label: "Inventory Records",   val: counts.inventory,    color: "teal",   path: "/manage-inventory"      },
    { label: "Cattle Info Records", val: counts.cattle,       color: "orange", path: "/manage-cattle-info"    },
    { label: "Live Data Streams",   val: counts.livedata,     color: "dark",   path: null                     },
    { label: "Total Mortality 💀",  val: counts.mortality,    color: "red",    path: "/mortality-details"     },
    { label: "Bull Calf 🐂",        val: counts.bullCalf,     color: "orange", path: "/bull-calf-details"     },
    { label: "Heifer 🐄",           val: counts.heifer,       color: "green",  path: "/heifer-details"        },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2 className="page-title">Dashboard Overview</h2>

        {/* ALERTS */}
        {alerts.length > 0 && (
          <div style={{ marginBottom: "32px" }}>
            <h3 className="section-title">Active Alerts ({alerts.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {alerts.map((alert, i) => {
                const s = alertStyle[alert.level] || alertStyle.info;
                return (
                  <div key={i} style={{
                    background: s.bg, border: `1px solid ${s.border}`,
                    borderRadius: "var(--radius-md)", padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: "12px",
                  }}>
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
          {cards.map((card, i) => (
            <div key={i}
              className={`card ${card.color}${card.path ? " clickable" : ""}`}
              onClick={() => card.path && navigate(card.path)}
              title={card.path ? `View ${card.label}` : ""}
            >
              <h3>{card.label}</h3>
              <p>{card.val}</p>
            </div>
          ))}
        </div>

        {/* ── CATTLE ANALYTICS ─────────────────────────────── */}
        <h3 className="section-title" style={{ marginTop: "40px" }}>Cattle Analytics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", marginBottom: "40px" }}>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Monthly Insemination Count</p>
            {monthlyInsemination.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyInsemination}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" fill="#a8d55a" radius={[4,4,0,0]} name="Inseminations" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Pregnant Cows — Breed Wise</p>
            {pregnancyByBreed.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={pregnancyByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[4,4,0,0]} name="Pregnant">
                    {pregnancyByBreed.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Cows in Gestation Period — Breed Wise</p>
            {gestationByBreed.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={gestationByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[4,4,0,0]} name="In Gestation">
                    {gestationByBreed.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Trial Techniques — Breed Wise</p>
            {trialByBreed.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={trialByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="trials" radius={[4,4,0,0]} name="Trials">
                    {trialByBreed.map((_, i) => <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Calf Birth Status</p>
            {calfStatus.every((c) => c.value === 0) ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={calfStatus} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    <Cell fill="#a8d55a" /><Cell fill="#e86b5a" />
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend formatter={(val) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Milk Yield Per Lactation — Breed Wise (Litres)</p>
            {milkByBreed.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={milkByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="litres" radius={[4,4,0,0]} name="Litres">
                    {milkByBreed.map((_, i) => <Cell key={i} fill={COLORS[(i + 1) % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* ── RESCUED ANALYTICS ────────────────────────────── */}
        <h3 className="section-title" style={{ marginTop: "40px" }}>Rescued Animals Analytics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", marginBottom: "40px" }}>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Rescued Animals — Cow vs Bull</p>
            {rescuedBySex.every((c) => c.value === 0) ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={rescuedBySex} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    <Cell fill="#a8d55a" /><Cell fill="#e8a84c" />
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                  <Legend formatter={(val) => <span style={{ color: "var(--text-secondary)", fontSize: 12 }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Rescued Animals — Breed Wise</p>
            {rescuedByBreed.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={rescuedByBreed}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="breed" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[4,4,0,0]} name="Rescued">
                    {rescuedByBreed.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Reason of Adoption Breakdown</p>
            {rescuedByReason.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={rescuedByReason} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis type="number" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis type="category" dataKey="reason" width={110} tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="count" radius={[0,4,4,0]} name="Count">
                    {rescuedByReason.map((_, i) => <Cell key={i} fill={COLORS[(i + 3) % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

        </div>

        {/* ── INVENTORY ANALYTICS ──────────────────────────── */}
        <h3 className="section-title" style={{ marginTop: "40px" }}>Inventory Analytics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))", gap: "20px", marginBottom: "40px" }}>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Feed Stock — Month Wise (Gunny Bags)</p>
            {feedByMonth.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={feedByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="value" radius={[4,4,0,0]} name="Gunny Bags">
                    {feedByMonth.map((entry, i) => <Cell key={i} fill={entry.value < 100 ? "#e86b5a" : "#a8d55a"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>* Red bars = below 100 bags threshold</p>
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Medicine / Drug Stock — Month Wise (Quantity)</p>
            {medicineByMonth.length === 0 ? noDataMsg : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={medicineByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--text-secondary)", fontSize: 11 }} />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="value" radius={[4,4,0,0]} name="Quantity">
                    {medicineByMonth.map((_, i) => <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div style={CHART_STYLE}>
            <p style={CHART_TITLE}>Semen Straw Stock — Month Wise (Count)</p>
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
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px" }}>* Red bars = below 20 straws threshold</p>
          </div>

        </div>

        {/* ── LIVE DATA TABLE ──────────────────────────────── */}
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
                <tr><td colSpan="10" style={{ textAlign: "center" }}>No live data available</td></tr>
              ) : (
                liveData.map((data, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td><td>{data.cowId}</td>
                    <td>{data.temp}</td><td>{data.ax}</td>
                    <td>{data.ay}</td><td>{data.az}</td>
                    <td>{data.humidity}</td><td>{data.lat}</td><td>{data.lon}</td>
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
