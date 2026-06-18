import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import KosalaAdminSidebar from "../components/KosalaAdminSidebar";
import "./styles/MoneyManagement.css";

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

      <div className="dashboard-main">
        <div
          style={{
            width: "100%",
            maxWidth: "760px",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="back-btn"
          >
            ← Back
          </button>

          <div className="add-money-form-container">
            <h2
              style={{
                marginBottom: "25px",
                color: "#2d3748",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              💰 Add Money Entry
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Date
                </label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Milk Yield (Litres)
                </label>

                <input
                  type="number"
                  name="milkYield"
                  value={form.milkYield}
                  onChange={handleChange}
                  placeholder="Enter milk yield"
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Amount Per Litre (₹)
                </label>

                <input
                  type="number"
                  name="amountPerLitre"
                  value={form.amountPerLitre}
                  onChange={handleChange}
                  placeholder="Enter amount per litre"
                  required
                  className="form-input"
                />
              </div>

              <div className="total-amount-box">
                <span className="total-amount-label">
                  Total Amount
                </span>

                <span className="total-amount-value">
                  ₹{totalAmount}
                </span>
              </div>

              <button
                type="submit"
                className="submit-btn"
              >
                💾 Save Entry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMoney;