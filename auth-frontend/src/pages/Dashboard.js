import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

function Dashboard() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    fetch(`${API_BASE_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;
        if (data.user) setUser(data.user);
        else setError(data.message || "Failed to load profile");
      })
      .catch((err) => setError("Network error: " + err.message))
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
            <button type="button" className="btn btn-primary" onClick={() => navigate("/login")}>
              Back to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {user.role === "admin" && (
            <Link to="/admin" className="btn btn-ghost" style={{ width: "auto", marginTop: 0 }}>
              Admin
            </Link>
          )}
          <button type="button" className="btn btn-ghost" style={{ width: "auto", marginTop: 0 }} onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      <div className="dashboard-card">
        <h2>Profile</h2>
        <div className="profile-row">
          <span className="profile-label">Name</span>
          <span className="profile-value">{user.name}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Email</span>
          <span className="profile-value">{user.email}</span>
        </div>
        <div className="profile-row">
          <span className="profile-label">Role</span>
          <span className="profile-value">{user.role}</span>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
