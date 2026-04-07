import { useState } from "react";
import { supabase } from "../lib/supabase.js";

const s = {
  page: { minHeight: "100vh", background: "#09090f", color: "#e2e8f0", fontFamily: "'DM Sans', system-ui, sans-serif" },
  container: { maxWidth: 600, margin: "0 auto", padding: "40px 20px 60px" },
  backLink: { color: "#6366f1", fontSize: 13, textDecoration: "none", display: "inline-block", marginBottom: 24 },
  h1: { fontFamily: "'Playfair Display', Georgia, serif", fontSize: 28, fontWeight: 800, margin: "0 0 8px", background: "linear-gradient(135deg, #f1f5f9, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { color: "#64748b", fontSize: 14, margin: "0 0 32px", lineHeight: 1.5 },
  card: { background: "#111118", border: "1px solid #1e1e2a", borderRadius: 16, padding: 28 },
  fieldGroup: { marginBottom: 16 },
  label: { display: "block", fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" },
  required: { color: "#f87171" },
  input: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #1e1e2a", background: "#09090f", color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "inherit" },
  textarea: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #1e1e2a", background: "#09090f", color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "inherit", minHeight: 80, resize: "vertical" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  btn: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 8 },
  hint: { fontSize: 11, color: "#475569", marginTop: 4 },
  successBox: { background: "#0a2e1a", border: "1px solid #166534", borderRadius: 12, padding: "24px", textAlign: "center" },
  successTitle: { fontSize: 18, fontWeight: 700, color: "#4ade80", margin: "0 0 8px" },
  successText: { fontSize: 13, color: "#6ee7a0", margin: 0, lineHeight: 1.5 },
};

export default function Submit() {
  const [form, setForm] = useState({
    title: "", organizer: "", date: "", time: "", location: "", venue: "",
    url: "", description: "", cost: "Free", submitter_name: "", submitter_email: "",
  });
  const [status, setStatus] = useState("idle"); // idle, saving, success, error
  const [errorMsg, setErrorMsg] = useState("");

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.url) {
      setErrorMsg("Please fill in the event name, date, and URL.");
      return;
    }
    setStatus("saving");
    setErrorMsg("");

    try {
      const { error } = await supabase
        .from("event_submissions")
        .insert({
          title: form.title,
          organizer: form.organizer || null,
          date: form.date,
          time: form.time || null,
          location: form.location || null,
          venue: form.venue || null,
          url: form.url,
          description: form.description || null,
          cost: form.cost,
          submitter_name: form.submitter_name || null,
          submitter_email: form.submitter_email || null,
          status: "pending",
        });

      if (error) throw error;
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <div style={s.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap');
        ::placeholder { color: #475569; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={s.container}>
        <a href="/" style={s.backLink}>← Back to directory</a>
        <h1 style={s.h1}>Submit an Event</h1>
        <p style={s.subtitle}>
          Know about a Utah business networking event that's not in our directory?
          Submit it here and we'll review it within 24 hours.
        </p>

        {status === "success" ? (
          <div style={s.successBox}>
            <p style={{ fontSize: 32, margin: "0 0 12px" }}>🎉</p>
            <p style={s.successTitle}>Event Submitted!</p>
            <p style={s.successText}>
              Thanks for contributing to the directory. We'll review your submission
              and publish it within 24 hours if it meets our guidelines.
            </p>
            <button onClick={() => { setStatus("idle"); setForm({ title: "", organizer: "", date: "", time: "", location: "", venue: "", url: "", description: "", cost: "Free", submitter_name: "", submitter_email: "" }); }}
              style={{ ...s.btn, maxWidth: 200, margin: "20px auto 0" }}>
              Submit Another
            </button>
          </div>
        ) : (
          <div style={s.card}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Event Name <span style={s.required}>*</span></label>
              <input style={s.input} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. SLC Business Networking Mixer" />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Organizer</label>
              <input style={s.input} value={form.organizer} onChange={e => set("organizer", e.target.value)} placeholder="e.g. Salt Lake Chamber" />
            </div>

            <div style={s.row2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Date <span style={s.required}>*</span></label>
                <input type="date" style={s.input} value={form.date} onChange={e => set("date", e.target.value)} />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Time</label>
                <input style={s.input} value={form.time} onChange={e => set("time", e.target.value)} placeholder="6:00 PM – 8:00 PM" />
              </div>
            </div>

            <div style={s.row2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>City</label>
                <input style={s.input} value={form.location} onChange={e => set("location", e.target.value)} placeholder="e.g. Salt Lake City" />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Venue</label>
                <input style={s.input} value={form.venue} onChange={e => set("venue", e.target.value)} placeholder="e.g. The Grand America Hotel" />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Event URL <span style={s.required}>*</span></label>
              <input style={s.input} value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." />
              <p style={s.hint}>Link to the event page where people can see details and register.</p>
            </div>

            <div style={s.row2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Cost</label>
                <select style={s.input} value={form.cost} onChange={e => set("cost", e.target.value)}>
                  <option>Free</option>
                  <option>Paid</option>
                  <option>Members Only</option>
                </select>
              </div>
              <div />
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Description</label>
              <textarea style={s.textarea} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description of the event..." />
            </div>

            <div style={{ borderTop: "1px solid #1e1e2a", paddingTop: 16, marginTop: 8 }}>
              <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px" }}>Your info (optional — so we can notify you when it's published)</p>
              <div style={s.row2}>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Your Name</label>
                  <input style={s.input} value={form.submitter_name} onChange={e => set("submitter_name", e.target.value)} />
                </div>
                <div style={s.fieldGroup}>
                  <label style={s.label}>Your Email</label>
                  <input type="email" style={s.input} value={form.submitter_email} onChange={e => set("submitter_email", e.target.value)} />
                </div>
              </div>
            </div>

            {errorMsg && <p style={{ color: "#f87171", fontSize: 13, margin: "8px 0 0" }}>{errorMsg}</p>}

            <button onClick={handleSubmit} disabled={status === "saving"}
              style={{ ...s.btn, opacity: status === "saving" ? 0.6 : 1 }}>
              {status === "saving" ? "Submitting..." : "Submit Event for Review"}
            </button>

            <p style={{ ...s.hint, marginTop: 12, textAlign: "center" }}>
              All submissions are reviewed before publishing. We only list events with
              a direct link to the event page and accurate dates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
