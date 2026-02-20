import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

function AdminDashboard() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    fetch(`${API_BASE_URL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }
        if (!res.ok) {
          throw new Error(res.status === 403 ? "Access denied" : `Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        setMessage(data.message || "No message returned");
      })
      .catch((err) => setError(err.message || "Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="app-page">
        <span className="loading-spinner" /> Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-page">
        <div className="auth-layout">
          <div className="auth-card">
            <div className="alert-error">{error}</div>
            <Link to="/dashboard" className="btn btn-primary" style={{ display: "inline-flex", textAlign: "center" }}>
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Admin</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <Link to="/dashboard" className="btn btn-ghost" style={{ width: "auto", marginTop: 0 }}>
            Dashboard
          </Link>
          <button type="button" className="btn btn-ghost" style={{ width: "auto", marginTop: 0 }} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="dashboard-card">
        <h2>Admin message</h2>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

export default AdminDashboard;
