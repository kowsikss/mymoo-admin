import React, {
  useEffect,
  useState,
} from "react";
import axios from "axios";

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
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/money/${localStorage.getItem(
        "kosalaId"
      )}`
    );

    setData(res.data);
  };

  const monthlyData = {};

  data.forEach((item) => {
    const month =
      new Date(item.date)
        .toLocaleString("default", {
          month: "short",
          year: "numeric",
        });

    monthlyData[month] =
      (monthlyData[month] || 0) +
      item.totalAmount;
  });

  const monthlyChart =
    Object.keys(monthlyData).map(
      (month) => ({
        month,
        amount:
          monthlyData[month],
      })
    );

  const yearlyData = {};

  data.forEach((item) => {
    const year =
      new Date(item.date).getFullYear();

    yearlyData[year] =
      (yearlyData[year] || 0) +
      item.totalAmount;
  });

  const yearlyChart =
    Object.keys(yearlyData).map(
      (year) => ({
        year,
        amount:
          yearlyData[year],
      })
    );

  return (
    <div className="dashboard-container">
      <KosalaAdminSidebar />

      <div className="content">

        <h2>💰 Money Management</h2>

        <table
          border="1"
          cellPadding="10"
          width="100%"
        >
          <thead>
            <tr>
              <th>S.No</th>
              <th>Date</th>
              <th>Milk Yield</th>
              <th>Amount/L</th>
              <th>Total Amount</th>
            </tr>
          </thead>

          <tbody>
            {data.map(
              (item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>

                  <td>
                    {new Date(
                      item.date
                    ).toLocaleDateString()}
                  </td>

                  <td>
                    {item.milkYield} L
                  </td>

                  <td>
                    ₹
                    {
                      item.amountPerLitre
                    }
                  </td>

                  <td>
                    ₹
                    {
                      item.totalAmount
                    }
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>

        <br />

        <h3>Monthly Income</h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={monthlyChart}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>

        <br />

        <h3>Yearly Income</h3>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={yearlyChart}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
}

export default ManageMoney;