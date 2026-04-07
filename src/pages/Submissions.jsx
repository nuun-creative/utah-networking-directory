import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase, getSession, createEvent } from "../lib/supabase.js";

const s = {
  page: { minHeight: "100vh", background: "#09090f", color: "#e2e8f0", fontFamily: "'DM Sans', system-ui, sans-serif", padding: 20 },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1000, margin: "0 auto 24px", flexWrap: "wrap", gap: 12 },
  h1: { fontSize: 22, fontWeight: 700, margin: 0, color: "#f1f5f9" },
  tabs: { display: "flex", gap: 4, marginBottom: 20, maxWidth: 1000, margin: "0 auto 20px" },
  tab: (active) => ({ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, border: "none", cursor: "pointer", fontFamily: "inherit", background: active ? "#1e293b" : "transparent", color: active ? "#e2e8f0" : "#64748b" }),
  card: { background: "#111118", border: "1px solid #1e1e2a", borderRadius: 12, padding: 20, marginBottom: 12, maxWidth: 1000, margin: "0 auto 12px" },
  title: { fontSize: 16, fontWeight: 600, color: "#f1f5f9", margin: "0 0 4px" },
  meta: { fontSize: 12, color: "#64748b", margin: "0 0 8px" },
  desc: { fontSize: 13, color: "#94a3b8", margin: "0 0 12px", lineHeight: 1.5 },
  link: { color: "#6366f1", fontSize: 12, wordBreak: "break-all" },
  submitter: { fontSize: 11, color: "#475569", margin: "8px 0 0", padding: "8px 0 0", borderTop: "1px solid #1e1e2a" },
  actions: { display: "flex", gap: 8, marginTop: 12 },
  btnApprove: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#166534", color: "#4ade80", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnReject: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#7f1d1d", color: "#fca5a5", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSecondary: { padding: "8px 18px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontFamily: "inherit", textDecoration: "none" },
  badge: (status) => ({
    display: "inline-block", padding: "2px 10px", borderRadius: 12, fontSize: 10, fontWeight: 600, textTransform: "uppercase",
    background: status === "pending" ? "#3a2a1a" : status === "approved" ? "#0a2e1a" : "#2e0a0a",
    color: status === "pending" ? "#fbbf24" : status === "approved" ? "#4ade80" : "#f87171",
    border: `1px solid ${status === "pending" ? "#5a3f2d" : status === "approved" ? "#166534" : "#7f1d1d"}`,
  }),
  empty: { textAlign: "center", padding: 48, color: "#475569", maxWidth: 1000, margin: "0 auto" },
  count: (n) => ({ display: "inline-block", background: "#1e293b", color: "#e2e8f0", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 600, marginLeft: 6 }),
};

export default function Submissions() {
  const [session, setSession] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processing, setProcessing] = useState(null); // id of submission being processed
  const navigate = useNavigate();

  useEffect(() => {
    getSession().then(s => {
      if (!s) { navigate("/login"); return; }
      setSession(s);
      loadSubmissions();
    });
  }, []);

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("event_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setSubmissions(data || []);
    setLoading(false);
  };

  const handleApprove = async (submission) => {
    setProcessing(submission.id);
    try {
      // Create the event in the events table
      await createEvent({
        title: submission.title,
        organizer: submission.organizer,
        date: submission.date,
        time: submission.time,
        location: submission.location,
        venue: submission.venue,
        url: submission.url,
        description: submission.description,
        cost: submission.cost,
        region: guessRegion(submission.location),
        category: "Networking Mixer",
        industry: "General Business",
        source: "user-submitted",
        is_active: true,
      });

      // Update submission status
      await supabase
        .from("event_submissions")
        .update({ status: "approved" })
        .eq("id", submission.id);

      await loadSubmissions();
    } catch (err) {
      alert("Error approving: " + err.message);
    }
    setProcessing(null);
  };

  const handleReject = async (id) => {
    setProcessing(id);
    await supabase
      .from("event_submissions")
      .update({ status: "rejected" })
      .eq("id", id);
    await loadSubmissions();
    setProcessing(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this submission permanently?")) return;
    await supabase.from("event_submissions").delete().eq("id", id);
    await loadSubmissions();
  };

  const filtered = submissions.filter(s => filter === "all" || s.status === filter);
  const pendingCount = submissions.filter(s => s.status === "pending").length;

  if (!session) return null;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>
            Event Submissions
            {pendingCount > 0 && <span style={s.count(pendingCount)}>{pendingCount}</span>}
          </h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>Review user-submitted events</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/admin" style={s.btnSecondary}>← Events Admin</a>
          <a href="/" style={s.btnSecondary}>View Site</a>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={s.tabs}>
        {["pending", "approved", "rejected", "all"].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={s.tab(filter === f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pendingCount > 0 && <span style={s.count(pendingCount)}>{pendingCount}</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={s.empty}>Loading...</p>
      ) : filtered.length === 0 ? (
        <p style={s.empty}>No {filter === "all" ? "" : filter} submissions.</p>
      ) : (
        filtered.map(sub => (
          <div key={sub.id} style={s.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
              <div>
                <h3 style={s.title}>{sub.title}</h3>
                <p style={s.meta}>
                  {sub.date} {sub.time && `· ${sub.time}`} {sub.location && `· ${sub.location}`}
                  {sub.organizer && ` · by ${sub.organizer}`}
                  {sub.cost && ` · ${sub.cost}`}
                </p>
              </div>
              <span style={s.badge(sub.status)}>{sub.status}</span>
            </div>

            {sub.venue && <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 4px" }}>Venue: {sub.venue}</p>}
            {sub.description && <p style={s.desc}>{sub.description}</p>}
            <a href={sub.url} target="_blank" rel="noopener noreferrer" style={s.link}>{sub.url}</a>

            {(sub.submitter_name || sub.submitter_email) && (
              <p style={s.submitter}>
                Submitted by: {sub.submitter_name || "Anonymous"} {sub.submitter_email && `(${sub.submitter_email})`}
                {" · "}{new Date(sub.created_at).toLocaleDateString()}
              </p>
            )}

            {sub.status === "pending" && (
              <div style={s.actions}>
                <button onClick={() => handleApprove(sub)} disabled={processing === sub.id}
                  style={{ ...s.btnApprove, opacity: processing === sub.id ? 0.5 : 1 }}>
                  {processing === sub.id ? "..." : "✓ Approve & Publish"}
                </button>
                <button onClick={() => handleReject(sub.id)} disabled={processing === sub.id} style={s.btnReject}>
                  ✗ Reject
                </button>
              </div>
            )}

            {sub.status !== "pending" && (
              <div style={s.actions}>
                <button onClick={() => handleDelete(sub.id)} style={{ ...s.btnReject, fontSize: 11, padding: "4px 12px" }}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function guessRegion(location) {
  if (!location) return "Salt Lake County";
  const l = location.toLowerCase();
  if (["provo","orem","lehi"].some(c => l.includes(c))) return "Utah County";
  if (l.includes("ogden")) return "Weber County";
  if (["layton","kaysville","farmington"].some(c => l.includes(c))) return "Davis County";
  if (l.includes("logan")) return "Cache County";
  if (l.includes("park city")) return "Summit County";
  if (["st. george","st george","cedar city"].some(c => l.includes(c))) return "Southern Utah";
  return "Salt Lake County";
}
