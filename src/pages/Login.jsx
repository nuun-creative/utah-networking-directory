import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../lib/supabase.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const s = {
    page: { minHeight: "100vh", background: "#09090f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" },
    card: { background: "#111118", border: "1px solid #1e1e2a", borderRadius: 16, padding: "40px 32px", width: "100%", maxWidth: 400 },
    title: { color: "#f1f5f9", fontSize: 22, fontWeight: 700, margin: "0 0 4px", textAlign: "center" },
    sub: { color: "#64748b", fontSize: 13, margin: "0 0 24px", textAlign: "center" },
    label: { display: "block", fontSize: 12, color: "#94a3b8", marginBottom: 4, fontWeight: 500 },
    input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #1e1e2a", background: "#09090f", color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "inherit", marginBottom: 16 },
    btn: { width: "100%", padding: "12px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
    err: { color: "#f87171", fontSize: 13, margin: "12px 0 0", textAlign: "center" },
    back: { display: "block", textAlign: "center", marginTop: 16, color: "#6366f1", fontSize: 13, textDecoration: "none" },
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>Admin Login</h1>
        <p style={s.sub}>Utah Networking Events</p>
        <form onSubmit={handleLogin}>
          <label style={s.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={s.input} required />
          <label style={s.label}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={s.input} required />
          <button type="submit" disabled={loading} style={{ ...s.btn, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        {error && <p style={s.err}>{error}</p>}
        <a href="/" style={s.back}>← Back to directory</a>
      </div>
    </div>
  );
}
