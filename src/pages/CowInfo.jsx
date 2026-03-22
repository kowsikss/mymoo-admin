import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function CowInfo() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <Navbar />
        <h2>Cow Information Page</h2>
      </div>
    </div>
  );
}

export default CowInfo;
