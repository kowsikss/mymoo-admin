import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AdminGaushalaList() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/kosala/full");
    setData(res.data);
  };

  return (
    <div className="main">
      <h2>All Gaushalas</h2>

      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Gaushala Name</th>
            <th>Doctor Assigned</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {data.map((g, i) => (
            <tr key={g._id}>
              <td>{i+1}</td>
              <td>{g.name}</td>
              <td>{g.doctor?.name || "Not Assigned"}</td>
              <td>
                <button onClick={() => navigate(`/admin/kosala/${g._id}`)}>
                  Open Dashboard
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminGaushalaList;