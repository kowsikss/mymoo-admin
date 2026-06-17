import React, { useState } from "react";
import axios from "axios";
import KosalaAdminSidebar from "./KosalaAdminSidebar";

function AddMoney() {
  const [form, setForm] = useState({
    date: "",
    milkYield: "",
    amountPerLitre: "",
  });

  const total =
    Number(form.milkYield || 0) *
    Number(form.amountPerLitre || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(
      "http://localhost:5000/api/money/add",
      {
        kosalaId:
          localStorage.getItem("kosalaId"),
        ...form,
      }
    );

    alert("Entry Added");

    setForm({
      date: "",
      milkYield: "",
      amountPerLitre: "",
    });
  };

  return (
    <div className="dashboard-container">
      <KosalaAdminSidebar />

      <div className="content">
        <h2>💰 Add Money Entry</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="date"
            value={form.date}
            onChange={(e) =>
              setForm({
                ...form,
                date: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Milk Yield (L)"
            value={form.milkYield}
            onChange={(e) =>
              setForm({
                ...form,
                milkYield: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Amount Per Litre"
            value={form.amountPerLitre}
            onChange={(e) =>
              setForm({
                ...form,
                amountPerLitre: e.target.value,
              })
            }
          />

          <h3>
            Total Amount : ₹{total}
          </h3>

          <button type="submit">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddMoney;