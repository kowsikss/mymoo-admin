import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "./KosalaAdminSidebar";

function AddMoney() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    date: "",
    milkYield: "",
    amountPerLitre: "",
  });

  const totalAmount =
    Number(form.milkYield || 0) *
    Number(form.amountPerLitre || 0);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API =
        process.env.REACT_APP_API_URL ||
        "https://api.ecowshala.com";

      await axios.post(`${API}/api/money/add`, {
        kosalaId: localStorage.getItem("kosalaId"),
        ...form,
      });

      alert("Money entry added successfully");

      setForm({
        date: "",
        milkYield: "",
        amountPerLitre: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add entry");
    }
  };

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
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            padding: "30px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            maxWidth: "700px",
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

          <h2
            style={{
              marginBottom: "25px",
              color: "#2d3748",
            }}
          >
            💰 Add Money Entry
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Milk Yield (Litres)
              </label>

              <input
                type="number"
                name="milkYield"
                value={form.milkYield}
                onChange={handleChange}
                placeholder="Enter milk yield"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "600",
                }}
              >
                Amount Per Litre (₹)
              </label>

              <input
                type="number"
                name="amountPerLitre"
                value={form.amountPerLitre}
                onChange={handleChange}
                placeholder="Enter amount per litre"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
            </div>

            <div
              style={{
                background: "#f8f9fa",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              Total Amount : ₹{totalAmount}
            </div>

            <button
              type="submit"
              style={{
                background: "#28a745",
                color: "#fff",
                border: "none",
                padding: "12px 25px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              Save Entry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMoney;