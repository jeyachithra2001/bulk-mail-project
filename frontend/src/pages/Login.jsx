import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LockKeyhole } from "lucide-react";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("bulkMailToken", data.token);
      localStorage.setItem("bulkMailAdmin", data.admin.email);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to log in. Check the backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-icon"><Mail size={28} /></div>
        <p className="eyebrow">ADMIN PORTAL</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your bulk email campaigns.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>Admin email</label>
          <div className="input-wrap"><Mail size={18} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@example.com" required /></div>
          <label>Password</label>
          <div className="input-wrap"><LockKeyhole size={18} /><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" required /></div>
          {error && <div className="alert error">{error}</div>}
          <button className="primary-btn" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>
        <p className="login-foot">Use the ADMIN_EMAIL and ADMIN_PASSWORD from backend/.env</p>
      </section>
    </main>
  );
}
