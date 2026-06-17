import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import KosalaAdminSidebar from "./KosalaAdminSidebar";

function ManageMoney() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const API =
        process.env.REACT_APP_API_URL ||
        "https://api.ecowshala.com";

      const res = await axios.get(
        `${API}/api/money/${localStorage.getItem("kosalaId")}`
      );

      setData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const totalIncome = data.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const totalMilk = data.reduce(
    (sum, item) => sum + Number(item.milkYield || 0),
    0
  );

  const monthlyData = {};

  data.forEach((item) => {
    const month = new Date(item.date).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });

    monthlyData[month] =
      (monthlyData[month] || 0) +
      Number(item.totalAmount);
  });

  const monthlyChart = Object.keys(monthlyData).map((month) => ({
    month,
    amount: monthlyData[month],
  }));

  const yearlyData = {};

  data.forEach((item) => {
    const year = new Date(item.date).getFullYear();

    yearlyData[year] =
      (yearlyData[year] || 0) +
      Number(item.totalAmount);
  });

  const yearlyChart = Object.keys(yearlyData).map((year) => ({
    year,
    amount: yearlyData[year],
  }));

  return (
    <div className="dashboard-container">
      <KosalaAdminSidebar />

      <div
        style={{
          flex: 1,
          padding: "30px",
          overflowY: "auto",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "20px",
            padding: "10px 15px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: "20px" }}>
          💰 Money Management
        </h2>

        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h4>Total Income</h4>
            <h2>₹{totalIncome.toLocaleString()}</h2>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h4>Total Milk Yield</h4>
            <h2>{totalMilk} L</h2>
          </div>

          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <h4>Total Entries</h4>
            <h2>{data.length}</h2>
          </div>
        </div>

        {/* Table */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            marginBottom: "30px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#f5f5f5",
                }}
              >
                <th style={thStyle}>S.No</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Milk Yield</th>
                <th style={thStyle}>Amount/Litre</th>
                <th style={thStyle}>Total Amount</th>
              </tr>
            </thead>

            <tbody>
              {data.map((item, index) => (
                <tr key={item._id}>
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>{item.milkYield} L</td>
                  <td style={tdStyle}>₹{item.amountPerLitre}</td>
                  <td style={tdStyle}>
                    ₹{item.totalAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Monthly Chart */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            marginBottom: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3>📅 Monthly Income</h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Chart */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "20px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <h3>📊 Yearly Income</h3>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={yearlyChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "center",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "center",
};

export default ManageMoney;