import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, signOut, fetchAllEventsAdmin, createEvent, updateEvent, deleteEvent } from "../lib/supabase.js";

const EMPTY_EVENT = {
  title: "", organizer: "", date: "", end_date: "", time: "", location: "", venue: "",
  region: "Salt Lake County", category: "Networking Mixer", industry: "General Business",
  cost: "Free", cost_amount: "", recurring: false, recurrence_note: "", url: "",
  description: "", source: "manual", eventbrite_id: "", image_url: "", is_active: true,
};

const REGIONS = ["Salt Lake County", "Utah County", "Weber County", "Davis County", "Cache County", "Summit County", "Tooele County", "Wasatch County", "Southern Utah", "Utah"];
const CATEGORIES = ["Chamber", "Conference", "Networking Mixer", "Professional Development", "Speaker Event", "Workshop"];
const INDUSTRIES = ["General Business", "Technology", "Healthcare", "Finance & Investment", "Startups & Entrepreneurship", "Small Business", "Real Estate & Development", "Manufacturing", "Education & Training", "Hospitality & Tourism", "Entertainment & Media", "Professional Development"];
const COSTS = ["Free", "Paid", "Members Only"];

const s = {
  page: { minHeight: "100vh", background: "#09090f", color: "#e2e8f0", fontFamily: "'DM Sans', system-ui, sans-serif", padding: "20px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1200, margin: "0 auto 24px", flexWrap: "wrap", gap: 12 },
  h1: { fontSize: 22, fontWeight: 700, margin: 0, color: "#f1f5f9" },
  headerBtns: { display: "flex", gap: 8 },
  btnPrimary: { padding: "8px 18px", borderRadius: 8, border: "none", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  btnSecondary: { padding: "8px 18px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  btnDanger: { padding: "4px 12px", borderRadius: 6, border: "none", background: "#7f1d1d", color: "#fca5a5", fontSize: 11, cursor: "pointer", fontFamily: "inherit" },
  btnSmall: { padding: "4px 12px", borderRadius: 6, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 11, cursor: "pointer", fontFamily: "inherit" },
  table: { width: "100%", borderCollapse: "collapse", maxWidth: 1200, margin: "0 auto" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #1e1e2a" },
  td: { padding: "10px 12px", fontSize: 13, color: "#cbd5e1", borderBottom: "1px solid #111118", verticalAlign: "top" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
  form: { background: "#111118", border: "1px solid #1e1e2a", borderRadius: 16, padding: 28, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto" },
  formTitle: { fontSize: 18, fontWeight: 700, color: "#f1f5f9", margin: "0 0 20px" },
  fieldGroup: { marginBottom: 14 },
  label: { display: "block", fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" },
  input: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #1e1e2a", background: "#09090f", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" },
  select: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #1e1e2a", background: "#09090f", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit" },
  textarea: { width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #1e1e2a", background: "#09090f", color: "#e2e8f0", fontSize: 13, outline: "none", fontFamily: "inherit", minHeight: 80, resize: "vertical" },
  row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  row3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  sourceBadge: (src) => ({
    display: "inline-block", padding: "2px 8px", borderRadius: 12, fontSize: 10, fontWeight: 600,
    background: src === "eventbrite" ? "#1a2a3a" : "#2a3a1a",
    color: src === "eventbrite" ? "#7dd3fc" : "#a3e635",
    border: `1px solid ${src === "eventbrite" ? "#2d3f5a" : "#3f5a2d"}`,
  }),
  activeDot: (active) => ({
    display: "inline-block", width: 8, height: 8, borderRadius: "50%",
    background: active ? "#4ade80" : "#64748b", marginRight: 6,
  }),
  stats: { display: "flex", gap: 16, maxWidth: 1200, margin: "0 auto 20px", flexWrap: "wrap" },
  statCard: { background: "#111118", border: "1px solid #1e1e2a", borderRadius: 10, padding: "12px 18px", flex: "1 1 120px" },
  statNum: { fontSize: 22, fontWeight: 700, color: "#f1f5f9" },
  statLabel: { fontSize: 11, color: "#64748b", textTransform: "uppercase" },
};

function EventForm({ event, onSave, onCancel, isNew }) {
  const [form, setForm] = useState(event);
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async () => {
    if (!form.title || !form.date || !form.url) return alert("Title, Date, and URL are required.");
    setSaving(true);
    try {
      if (isNew) {
        const { id, created_at, updated_at, ...rest } = form;
        await onSave(rest);
      } else {
        const { created_at, updated_at, ...rest } = form;
        await onSave(form.id, rest);
      }
    } catch (err) {
      alert("Error saving: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={s.modal} onClick={onCancel}>
      <div style={s.form} onClick={e => e.stopPropagation()}>
        <h2 style={s.formTitle}>{isNew ? "Add Event" : "Edit Event"}</h2>

        <div style={s.fieldGroup}><label style={s.label}>Title *</label><input style={s.input} value={form.title} onChange={e => set("title", e.target.value)} /></div>
        <div style={s.fieldGroup}><label style={s.label}>Organizer</label><input style={s.input} value={form.organizer || ""} onChange={e => set("organizer", e.target.value)} /></div>

        <div style={s.row3}>
          <div style={s.fieldGroup}><label style={s.label}>Date *</label><input type="date" style={s.input} value={form.date} onChange={e => set("date", e.target.value)} /></div>
          <div style={s.fieldGroup}><label style={s.label}>End Date</label><input type="date" style={s.input} value={form.end_date || ""} onChange={e => set("end_date", e.target.value)} /></div>
          <div style={s.fieldGroup}><label style={s.label}>Time</label><input style={s.input} value={form.time || ""} onChange={e => set("time", e.target.value)} placeholder="9:00 AM – 5:00 PM" /></div>
        </div>

        <div style={s.row2}>
          <div style={s.fieldGroup}><label style={s.label}>Location</label><input style={s.input} value={form.location || ""} onChange={e => set("location", e.target.value)} /></div>
          <div style={s.fieldGroup}><label style={s.label}>Venue</label><input style={s.input} value={form.venue || ""} onChange={e => set("venue", e.target.value)} /></div>
        </div>

        <div style={s.row3}>
          <div style={s.fieldGroup}><label style={s.label}>Region</label><select style={s.select} value={form.region || ""} onChange={e => set("region", e.target.value)}>{REGIONS.map(r => <option key={r}>{r}</option>)}</select></div>
          <div style={s.fieldGroup}><label style={s.label}>Category</label><select style={s.select} value={form.category || ""} onChange={e => set("category", e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>
          <div style={s.fieldGroup}><label style={s.label}>Industry</label><select style={s.select} value={form.industry || ""} onChange={e => set("industry", e.target.value)}>{INDUSTRIES.map(i => <option key={i}>{i}</option>)}</select></div>
        </div>

        <div style={s.row3}>
          <div style={s.fieldGroup}><label style={s.label}>Cost</label><select style={s.select} value={form.cost || ""} onChange={e => set("cost", e.target.value)}>{COSTS.map(c => <option key={c}>{c}</option>)}</select></div>
          <div style={s.fieldGroup}><label style={s.label}>Cost Amount</label><input style={s.input} value={form.cost_amount || ""} onChange={e => set("cost_amount", e.target.value)} placeholder="$99" /></div>
          <div style={s.fieldGroup}><label style={s.label}>Source</label><input style={s.input} value={form.source || "manual"} onChange={e => set("source", e.target.value)} /></div>
        </div>

        <div style={s.fieldGroup}><label style={s.label}>URL *</label><input style={s.input} value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." /></div>
        <div style={s.fieldGroup}><label style={s.label}>Description</label><textarea style={s.textarea} value={form.description || ""} onChange={e => set("description", e.target.value)} /></div>
        <div style={s.fieldGroup}><label style={s.label}>Image URL</label><input style={s.input} value={form.image_url || ""} onChange={e => set("image_url", e.target.value)} /></div>

        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
            <input type="checkbox" checked={form.recurring} onChange={e => set("recurring", e.target.checked)} style={{ accentColor: "#6366f1" }} /> Recurring
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#94a3b8", cursor: "pointer" }}>
            <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} style={{ accentColor: "#4ade80" }} /> Active
          </label>
        </div>
        {form.recurring && (
          <div style={s.fieldGroup}><label style={s.label}>Recurrence Note</label><input style={s.input} value={form.recurrence_note || ""} onChange={e => set("recurrence_note", e.target.value)} placeholder="Every Wednesday" /></div>
        )}

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
          <button onClick={onCancel} style={s.btnSecondary}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{ ...s.btnPrimary, opacity: saving ? 0.6 : 1 }}>{saving ? "Saving..." : isNew ? "Create Event" : "Save Changes"}</button>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getSession().then(s => {
      if (!s) { navigate("/login"); return; }
      setSession(s);
      loadEvents();
    });
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await fetchAllEventsAdmin();
      setEvents(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreate = async (eventData) => {
    await createEvent(eventData);
    setShowForm(false);
    await loadEvents();
  };

  const handleUpdate = async (id, eventData) => {
    await updateEvent(id, eventData);
    setEditingEvent(null);
    await loadEvents();
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteEvent(id);
    await loadEvents();
  };

  const handleToggleActive = async (id, currentActive) => {
    await updateEvent(id, { is_active: !currentActive });
    await loadEvents();
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (!session) return null;

  const filteredEvents = events.filter(e => {
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return [e.title, e.organizer, e.location, e.source].some(f => (f || "").toLowerCase().includes(q));
  });

  const activeCount = events.filter(e => e.is_active).length;
  const eventbriteCount = events.filter(e => e.source === "eventbrite").length;
  const manualCount = events.filter(e => e.source === "manual").length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.h1}>Event Admin</h1>
          <p style={{ color: "#64748b", fontSize: 13, margin: "4px 0 0" }}>Utah Networking Events Directory</p>
        </div>
        <div style={s.headerBtns}>
          <button onClick={() => setShowForm(true)} style={s.btnPrimary}>+ Add Event</button>
          <a href="/" style={{ ...s.btnSecondary, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>View Site</a>
          <button onClick={handleLogout} style={s.btnSecondary}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={s.stats}>
        <div style={s.statCard}><div style={s.statNum}>{events.length}</div><div style={s.statLabel}>Total Events</div></div>
        <div style={s.statCard}><div style={s.statNum}>{activeCount}</div><div style={s.statLabel}>Active</div></div>
        <div style={s.statCard}><div style={s.statNum}>{eventbriteCount}</div><div style={s.statLabel}>From Eventbrite</div></div>
        <div style={s.statCard}><div style={s.statNum}>{manualCount}</div><div style={s.statLabel}>Manual</div></div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 1200, margin: "0 auto 16px" }}>
        <input type="text" value={searchFilter} onChange={e => setSearchFilter(e.target.value)} placeholder="Filter events..."
          style={{ ...s.input, maxWidth: 300 }} />
      </div>

      {/* Table */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#64748b", padding: 40 }}>Loading...</p>
      ) : (
        <div style={{ maxWidth: 1200, margin: "0 auto", overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Status</th>
                <th style={s.th}>Title</th>
                <th style={s.th}>Date</th>
                <th style={s.th}>Location</th>
                <th style={s.th}>Source</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id} style={{ opacity: event.is_active ? 1 : 0.5 }}>
                  <td style={s.td}>
                    <span style={s.activeDot(event.is_active)} />
                    <button onClick={() => handleToggleActive(event.id, event.is_active)} style={{ ...s.btnSmall, fontSize: 10 }}>
                      {event.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td style={s.td}>
                    <div style={{ fontWeight: 600, color: "#f1f5f9" }}>{event.title}</div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{event.organizer}</div>
                  </td>
                  <td style={{ ...s.td, whiteSpace: "nowrap" }}>{event.date}</td>
                  <td style={s.td}>{event.location}</td>
                  <td style={s.td}><span style={s.sourceBadge(event.source)}>{event.source}</span></td>
                  <td style={s.td}>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button onClick={() => setEditingEvent(event)} style={s.btnSmall}>Edit</button>
                      <a href={event.url} target="_blank" rel="noopener noreferrer" style={{ ...s.btnSmall, textDecoration: "none" }}>Link</a>
                      <button onClick={() => handleDelete(event.id, event.title)} style={s.btnDanger}>Del</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Form Modal */}
      {showForm && (
        <EventForm event={EMPTY_EVENT} onSave={handleCreate} onCancel={() => setShowForm(false)} isNew={true} />
      )}

      {/* Edit Form Modal */}
      {editingEvent && (
        <EventForm event={editingEvent} onSave={handleUpdate} onCancel={() => setEditingEvent(null)} isNew={false} />
      )}
    </div>
  );
}
