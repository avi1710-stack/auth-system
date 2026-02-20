import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api/config";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || `Server error: ${res.status}`);
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard", { replace: true });
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network or server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-page">
      <div className="auth-layout">
        <div className="auth-card">
          <h1>Sign in</h1>
          <p className="subtitle">Enter your credentials to access your account.</p>

          <form onSubmit={handleLogin}>
            {error && <div className="alert-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="loading-spinner" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="auth-footer">
            Don’t have an account? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
