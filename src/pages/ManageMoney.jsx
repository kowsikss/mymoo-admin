import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import KosalaAdminSidebar from "./KosalaAdminSidebar";
import "./styles/MoneyManagement.css";

function ManageMoney() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "https://api.ecowshala.com";

  useEffect(() => {
    fetchMoney();
  }, []);

  const fetchMoney = async () => {
    try {
      const kosalaId = localStorage.getItem("kosalaId");

      const res = await axios.get(
        `${API}/api/money/${kosalaId}`
      );

      setData(res.data || []);
    } catch (err) {
      console.error("Money fetch error:", err);
      alert("Unable to load money data");
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = data.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const totalMilkYield = data.reduce(
    (sum, item) => sum + Number(item.milkYield || 0),
    0
  );

  const monthlyMap = {};

  data.forEach((item) => {
    const month = new Date(item.date).toLocaleString(
      "default",
      {
        month: "short",
        year: "numeric",
      }
    );

    monthlyMap[month] =
      (monthlyMap[month] || 0) +
      Number(item.totalAmount || 0);
  });

  const monthlyChart = Object.keys(monthlyMap).map(
    (month) => ({
      month,
      amount: monthlyMap[month],
    })
  );

  const yearlyMap = {};

  data.forEach((item) => {
    const year = new Date(item.date).getFullYear();

    yearlyMap[year] =
      (yearlyMap[year] || 0) +
      Number(item.totalAmount || 0);
  });

  const yearlyChart = Object.keys(yearlyMap).map(
    (year) => ({
      year,
      amount: yearlyMap[year],
    })
  );

  return (
    <div className="dashboard-container">
      <KosalaAdminSidebar />

      <div
        style={{
          flex: 1,
          padding: "25px",
          overflowY: "auto",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          ← Back
        </button>

        <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "700", color: "#2d3748" }}>
          💰 Money Management
        </h2>

        {loading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            {/* Summary Cards */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <div className="card-box">
                <h4>Total Income</h4>
                <h2>
                  ₹{totalIncome.toLocaleString()}
                </h2>
              </div>

              <div className="card-box">
                <h4>Total Milk Yield</h4>
                <h2>{totalMilkYield} L</h2>
              </div>

              <div className="card-box">
                <h4>Total Entries</h4>
                <h2>{data.length}</h2>
              </div>
            </div>

            {/* Table */}

            <div className="transaction-table-container">
              <h3>Transaction History</h3>

              <table className="transaction-table">
                <thead className="table-header">
                  <tr>
                    <th>S.No</th>
                    <th>Date</th>
                    <th>Milk Yield</th>
                    <th>Amount/Litre</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>

                <tbody className="table-body">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>
                          {new Date(
                            item.date
                          ).toLocaleDateString()}
                        </td>
                        <td>{item.milkYield} L</td>
                        <td>₹{item.amountPerLitre}</td>
                        <td>₹{item.totalAmount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-records">
                        No Records Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Monthly Chart */}

            <div className="chart-container">
              <h3>📅 Monthly Income</h3>

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <BarChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Yearly Chart */}

            <div className="chart-container">
              <h3>📊 Yearly Income</h3>

              <ResponsiveContainer
                width="100%"
                height={350}
              >
                <BarChart data={yearlyChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#764ba2" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ManageMoney;