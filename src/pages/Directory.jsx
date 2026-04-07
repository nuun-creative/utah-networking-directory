import { useState, useMemo, useEffect } from "react";
import { fetchEvents, subscribe, getSubscriberCount } from "../lib/supabase.js";

const categoryColors = {
  "Chamber": { bg: "#1a3a2a", text: "#6ee7a0", border: "#2d5a3f" },
  "Conference": { bg: "#2a1a3a", text: "#c084fc", border: "#3f2d5a" },
  "Networking Mixer": { bg: "#1a2a3a", text: "#7dd3fc", border: "#2d3f5a" },
  "Professional Development": { bg: "#3a2a1a", text: "#fbbf24", border: "#5a3f2d" },
  "Speaker Event": { bg: "#3a1a2a", text: "#f9a8d4", border: "#5a2d3f" },
  "Workshop": { bg: "#2a3a1a", text: "#a3e635", border: "#3f5a2d" },
};

function Badge({ label, type }) {
  const colors = type === "category"
    ? (categoryColors[label] || { bg: "#2a2a2a", text: "#aaa", border: "#3a3a3a" })
    : type === "cost"
      ? label === "Free" ? { bg: "#0a2e1a", text: "#34d399", border: "#166534" }
        : label === "Members Only" ? { bg: "#2e1a0a", text: "#fb923c", border: "#653416" }
        : { bg: "#1a1a2e", text: "#a5b4fc", border: "#16165a" }
      : { bg: "#1e1e1e", text: "#999", border: "#333" };
  return (
    <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.03em", background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, textTransform: "uppercase", whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function FilterPill({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, background: active ? "#e2e8f0" : "transparent", color: active ? "#0f172a" : "#94a3b8", border: active ? "1px solid #cbd5e1" : "1px solid #334155", cursor: "pointer", transition: "all 0.15s ease", whiteSpace: "nowrap" }}>
      {label} {active && "✕"}
    </button>
  );
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr + "T00:00:00") - now) / 86400000);
}

function EventCard({ event, index }) {
  const [expanded, setExpanded] = useState(false);
  const days = daysUntil(event.date);
  const isPast = days < 0;
  return (
    <div onClick={() => setExpanded(!expanded)} style={{ background: isPast ? "#0d0d10" : "#111118", border: "1px solid #1e1e2a", borderRadius: "12px", padding: "20px 24px", cursor: "pointer", transition: "all 0.2s ease", opacity: isPast ? 0.5 : 1, animation: `fadeSlideIn 0.4s ease ${index * 0.03}s both`, position: "relative", overflow: "hidden" }}
      onMouseEnter={e => { if (!isPast) { e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e2a"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#f1f5f9", lineHeight: 1.3 }}>{event.title}</h3>
          <p style={{ margin: "4px 0 0", fontSize: "13px", color: "#64748b" }}>{event.organizer}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: 500 }}>{formatDate(event.date)}</div>
          <div style={{ fontSize: "12px", color: days <= 7 && days >= 0 ? "#fbbf24" : "#64748b", marginTop: 2 }}>
            {isPast ? "Past" : days === 0 ? "Today!" : days === 1 ? "Tomorrow" : `${days} days away`}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Badge label={event.category} type="category" />
        <Badge label={event.cost} type="cost" />
        <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: "11px" }}>📍</span> {event.location}
        </span>
        {event.recurring && (
          <span style={{ fontSize: "11px", color: "#4ade80", fontStyle: "italic", display: "inline-flex", alignItems: "center", gap: 3 }}>
            <span style={{ fontSize: "13px", fontStyle: "normal" }}>↻</span> {event.recurrence_note}
          </span>
        )}
      </div>
      {expanded && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #1e1e2a", animation: "fadeIn 0.2s ease" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", lineHeight: 1.6 }}>{event.description}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 14 }}>
            <div><span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Venue</span><p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.venue}</p></div>
            <div><span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Time</span><p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.time}</p></div>
            <div><span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry</span><p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.industry}</p></div>
            <div><span style={{ fontSize: "11px", color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Region</span><p style={{ margin: "2px 0 0", fontSize: "13px", color: "#cbd5e1" }}>{event.region}</p></div>
          </div>
          {event.source === "eventbrite" && event.image_url && (
            <img src={event.image_url} alt="" style={{ marginTop: 12, borderRadius: 8, maxWidth: "100%", maxHeight: 160, objectFit: "cover" }} />
          )}
          <a href={event.url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
            style={{ display: "inline-block", marginTop: 14, padding: "8px 20px", borderRadius: "8px", background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontSize: "12px", fontWeight: 600, textDecoration: "none", letterSpacing: "0.02em" }}>
            Visit Event Page →
          </a>
        </div>
      )}
    </div>
  );
}

export default function Directory() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [industryFilter, setIndustryFilter] = useState(null);
  const [costFilter, setCostFilter] = useState(null);
  const [showRecurringOnly, setShowRecurringOnly] = useState(false);
  const [hidePast, setHidePast] = useState(true);
  const [sortBy, setSortBy] = useState("date");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupStatus, setSignupStatus] = useState("idle");
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [alreadySignedUp, setAlreadySignedUp] = useState(false);

  useEffect(() => {
    fetchEvents()
      .then(data => { setEvents(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
    getSubscriberCount().then(setSubscriberCount);
    if (localStorage.getItem("founder-signup-done")) setAlreadySignedUp(true);
  }, []);

  const handleSignup = async () => {
    if (!signupEmail || !signupEmail.includes("@")) return;
    setSignupStatus("saving");
    try {
      const result = await subscribe(signupEmail, signupName);
      if (result.alreadyExists) {
        setSignupStatus("success"); // still show success
      }
      // Also POST to Formspree as backup
      try {
        await fetch("https://formspree.io/f/xreynbkq", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ name: signupName, email: signupEmail, source: "founder-list" }),
        });
      } catch {} // Formspree failure shouldn't block success
      localStorage.setItem("founder-signup-done", "true");
      setSubscriberCount((c) => (c || 0) + 1);
      setSignupStatus("success");
      setAlreadySignedUp(true);
    } catch {
      setSignupStatus("error");
    }
  };

  const regions = useMemo(() => [...new Set(events.map(e => e.region).filter(Boolean))].sort(), [events]);
  const categories = useMemo(() => [...new Set(events.map(e => e.category).filter(Boolean))].sort(), [events]);
  const industries = useMemo(() => [...new Set(events.map(e => e.industry).filter(Boolean))].sort(), [events]);

  const filtered = useMemo(() => {
    let results = events.filter(e => {
      const q = search.toLowerCase();
      const matchesSearch = !q || [e.title, e.organizer, e.location, e.industry, e.description].some(f => (f || "").toLowerCase().includes(q));
      return matchesSearch
        && (!regionFilter || e.region === regionFilter)
        && (!categoryFilter || e.category === categoryFilter)
        && (!industryFilter || e.industry === industryFilter)
        && (!costFilter || e.cost === costFilter)
        && (!showRecurringOnly || e.recurring)
        && (!hidePast || daysUntil(e.date) >= 0);
    });
    if (sortBy === "date") results.sort((a, b) => new Date(a.date) - new Date(b.date));
    else if (sortBy === "name") results.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === "location") results.sort((a, b) => (a.location || "").localeCompare(b.location || ""));
    return results;
  }, [events, search, regionFilter, categoryFilter, industryFilter, costFilter, showRecurringOnly, hidePast, sortBy]);

  const activeFilterCount = [regionFilter, categoryFilter, industryFilter, costFilter, showRecurringOnly].filter(Boolean).length;
  const clearAll = () => { setRegionFilter(null); setCategoryFilter(null); setIndustryFilter(null); setCostFilter(null); setShowRecurringOnly(false); setSearch(""); };

  return (
    <div style={{ minHeight: "100vh", background: "#09090f", color: "#e2e8f0", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&family=Playfair+Display:wght@700;800&display=swap');
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        ::placeholder { color: #475569; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 3px; }
        * { box-sizing: border-box; }
      `}</style>

      {/* Hero */}
      <div style={{ padding: "48px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.06, background: "radial-gradient(ellipse at 50% 0%, #6366f1, transparent 70%)" }} />
        <p style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: "#6366f1", margin: "0 0 12px" }}>Weekly Curated Directory</p>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, margin: 0, lineHeight: 1.1, background: "linear-gradient(135deg, #f1f5f9, #94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Utah Business<br />Networking Events
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", marginTop: 12, maxWidth: 500, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
          {loading ? "Loading..." : `${events.length} verified events`} from chambers, meetups, conferences & more across the Beehive State. Every link checked. Updated weekly.
        </p>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 60px" }}>

        {/* Founder List Signup */}
        {!alreadySignedUp ? (
          <div style={{ background: "linear-gradient(135deg, #0f1729 0%, #1a1040 100%)", border: "1px solid #2a2560", borderRadius: "16px", padding: "28px 24px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", background: "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", textTransform: "uppercase" }}>Founder Access</span>
                {subscriberCount > 0 && <span style={{ fontSize: "11px", color: "#64748b" }}>{subscriberCount} early adopter{subscriberCount !== 1 ? "s" : ""} joined</span>}
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, margin: "0 0 6px", color: "#f1f5f9" }}>Join the Founder List</h2>
              <p style={{ fontSize: "13px", color: "#94a3b8", margin: "0 0 18px", lineHeight: 1.5, maxWidth: 520 }}>
                Get curated Utah networking events delivered to your inbox every Monday. Founder List members get <span style={{ color: "#a78bfa", fontWeight: 600 }}>free lifetime access</span> when we launch our subscription service next month.
              </p>
              {signupStatus === "success" ? (
                <div style={{ background: "#0a2e1a", border: "1px solid #166534", borderRadius: "10px", padding: "14px 18px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "20px" }}>✓</span>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#4ade80", fontWeight: 600 }}>You're on the Founder List!</p>
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#6ee7a0" }}>Check your inbox Monday. Lifetime access secured.</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <input type="text" value={signupName} onChange={e => setSignupName(e.target.value)} placeholder="First name"
                    style={{ flex: "0 1 140px", padding: "11px 14px", borderRadius: "8px", border: "1px solid #2a2560", background: "#0d0d1a", color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                  <input type="email" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} placeholder="you@email.com" onKeyDown={e => e.key === "Enter" && handleSignup()}
                    style={{ flex: "1 1 200px", padding: "11px 14px", borderRadius: "8px", border: "1px solid #2a2560", background: "#0d0d1a", color: "#e2e8f0", fontSize: "13px", outline: "none", fontFamily: "inherit" }} />
                  <button onClick={handleSignup} disabled={signupStatus === "saving" || !signupEmail}
                    style={{ flex: "0 0 auto", padding: "11px 22px", borderRadius: "8px", border: "none", background: signupStatus === "saving" ? "#334155" : "linear-gradient(135deg, #6366f1, #a855f7)", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: signupStatus === "saving" ? "wait" : "pointer", fontFamily: "inherit", opacity: !signupEmail ? 0.5 : 1 }}>
                    {signupStatus === "saving" ? "Joining..." : "Join Free →"}
                  </button>
                </div>
              )}
              {signupStatus === "error" && <p style={{ margin: "8px 0 0", fontSize: "12px", color: "#f87171" }}>Something went wrong — please try again.</p>}
              <p style={{ margin: "12px 0 0", fontSize: "11px", color: "#475569" }}>No spam, ever. Unsubscribe anytime.</p>
            </div>
          </div>
        ) : (
          <div style={{ background: "#0d1117", border: "1px solid #1e2a3a", borderRadius: "12px", padding: "14px 20px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: "16px" }}>✓</span>
              <span style={{ fontSize: "13px", color: "#4ade80", fontWeight: 500 }}>You're a Founder List member — lifetime access secured</span>
            </div>
          </div>
        )}

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 20 }}>
          <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#475569", pointerEvents: "none" }}>⌕</span>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search events, organizers, locations..."
            style={{ width: "100%", padding: "14px 16px 14px 44px", borderRadius: "12px", border: "1px solid #1e1e2a", background: "#111118", color: "#e2e8f0", fontSize: "14px", outline: "none", fontFamily: "inherit" }} />
        </div>

        {/* Filters */}
        <div style={{ background: "#0d0d14", border: "1px solid #1e1e2a", borderRadius: "12px", padding: "16px 20px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            {activeFilterCount > 0 && <button onClick={clearAll} style={{ background: "none", border: "none", color: "#6366f1", fontSize: "12px", cursor: "pointer", fontFamily: "inherit" }}>Clear all</button>}
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Region:</span>
            <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {regions.map(r => <FilterPill key={r} label={r} active={regionFilter === r} onClick={() => setRegionFilter(regionFilter === r ? null : r)} />)}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Type:</span>
            <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {categories.map(c => <FilterPill key={c} label={c} active={categoryFilter === c} onClick={() => setCategoryFilter(categoryFilter === c ? null : c)} />)}
            </div>
          </div>
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Industry:</span>
            <div style={{ display: "inline-flex", gap: 4, flexWrap: "wrap" }}>
              {industries.map(i => <FilterPill key={i} label={i} active={industryFilter === i} onClick={() => setIndustryFilter(industryFilter === i ? null : i)} />)}
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "11px", color: "#475569", marginRight: 8 }}>Cost:</span>
              {["Free", "Paid", "Members Only"].map(c => <FilterPill key={c} label={c} active={costFilter === c} onClick={() => setCostFilter(costFilter === c ? null : c)} />)}
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "12px", color: "#94a3b8" }}>
              <input type="checkbox" checked={showRecurringOnly} onChange={e => setShowRecurringOnly(e.target.checked)} style={{ accentColor: "#6366f1" }} /> Recurring only
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "12px", color: "#94a3b8" }}>
              <input type="checkbox" checked={hidePast} onChange={e => setHidePast(e.target.checked)} style={{ accentColor: "#6366f1" }} /> Hide past
            </label>
          </div>
        </div>

        {/* Sort + Count */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ fontSize: "13px", color: "#64748b" }}>{filtered.length} event{filtered.length !== 1 ? "s" : ""}</span>
          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
            <span style={{ fontSize: "11px", color: "#475569", marginRight: 4 }}>Sort:</span>
            {["date", "name", "location"].map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{ padding: "4px 10px", borderRadius: "6px", fontSize: "11px", background: sortBy === s ? "#1e293b" : "transparent", color: sortBy === s ? "#e2e8f0" : "#64748b", border: "none", cursor: "pointer", textTransform: "capitalize", fontFamily: "inherit" }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Events */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 48, color: "#475569" }}>Loading events...</div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: 48, color: "#f87171" }}>Error loading events: {error}</div>
          ) : filtered.length > 0 ? filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          )) : (
            <div style={{ textAlign: "center", padding: 48, color: "#475569", border: "1px dashed #1e1e2a", borderRadius: "12px" }}>
              <p style={{ fontSize: "14px", margin: 0 }}>No events match your filters.</p>
              <button onClick={clearAll} style={{ marginTop: 12, padding: "8px 20px", borderRadius: "8px", background: "#1e293b", color: "#e2e8f0", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>Clear filters</button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 40, padding: "20px 0", borderTop: "1px solid #1e1e2a", textAlign: "center" }}>
          <div style={{ marginBottom: 16 }}>
            <a href="/submit" style={{
              display: "inline-block", padding: "10px 24px", borderRadius: 8,
              border: "1px solid #2a2560", color: "#a78bfa", fontSize: 13,
              fontWeight: 600, textDecoration: "none",
            }}>
              📝 Know an event we're missing? Submit it →
            </a>
          </div>
          <p style={{ fontSize: "12px", color: "#475569", margin: 0, lineHeight: 1.6 }}>
            Events sourced from Eventbrite API and manually verified community sources.<br />
            Events may change — always verify on the organizer's website before attending.
          </p>
        </div>
      </div>
    </div>
  );
}
