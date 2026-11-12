import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LockKeyhole } from "lucide-react";
import api from "../api";

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isRegister) {
        const { data } = await api.post("/api/auth/register", { email, password });
        setSuccess(data.message);
        setIsRegister(false);
        setPassword("");
      } else {
        const { data } = await api.post("/api/auth/login", { email, password });
        localStorage.setItem("bulkMailToken", data.token);
        localStorage.setItem("bulkMailAdmin", data.user.email);
        navigate("/");
      }
    } catch (err) {
      console.log("Login error:", err)
      if (!err.response) {
        setError("Server is waking up (free hosting). Please wait 30-60 seconds and try again.");
      }
      else {
        setError(err.response?.data?.message || "Something went wrong. Please try again")
      }
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setIsRegister(value => !value);
    setError("");
    setSuccess("");
    setPassword("");
  }

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="brand-icon"><Mail size={28} /></div>
        <p className="eyebrow">BULK MAIL PORTAL</p>
        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {isRegister
            ? "Register with your own email and password to access the dashboard."
            : "Sign in to manage your bulk email campaigns."}
        </p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>Email address</label>
          <div className="input-wrap">
            <Mail size={18} />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>
          <label>Password</label>
          <div className="input-wrap">
            <LockKeyhole size={18} />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isRegister ? "Create a password (min. 6 characters)" : "Enter your password"}
              autoComplete={isRegister ? "new-password" : "current-password"}
              minLength={isRegister ? 6 : undefined}
              required
            />
          </div>
          {error && <div className="alert error">{error}</div>}
          {success && <div className="alert success">{success}</div>}
          <button className="primary-btn" disabled={loading}>
            {loading
              ? (isRegister ? "Creating account..." : "Signing in...")
              : (isRegister ? "Create account" : "Sign in")}
          </button>
        </form>
        <p className="login-foot">
          {isRegister ? "Already have an account?" : "New User?"}{" "}
          <button type="button" className="text-btn" onClick={switchMode}>
            {isRegister ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}
