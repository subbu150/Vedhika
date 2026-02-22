import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEventsRequest,
  deleteEventRequest,
  publishEventRequest,
} from "../../event/api";
import EventModal from "../../event/components/EventModal";

export default function EventsPage() {
  const qc = useQueryClient();

  /* State */
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeId, setActiveId] = useState(null); // For glow reaction

  /* Theme Setup */
  const theme = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#38bdf8",
    textMain: "#f8fafc",
    textMuted: "#94a3b8",
    border: "rgba(255,255,255,0.08)",
    danger: "#ef4444",
    success: "#22c55e",
    ghost: "rgba(255,255,255,0.03)"
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Fetch & Mutate */
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: getEventsRequest,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["events"] });

  const deleteMutation = useMutation({
    mutationFn: deleteEventRequest,
    onSuccess: refresh,
  });

  const publishMutation = useMutation({
    mutationFn: publishEventRequest,
    onSuccess: (_, id) => {
      setActiveId(id);
      refresh();
      setTimeout(() => setActiveId(null), 2000);
    },
  });

  /* Search Logic */
  const filteredEvents = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return events;
    return events.filter(e => e.title?.toLowerCase().includes(query));
  }, [events, searchQuery]);

  /* Handlers */
  const handleCreate = () => { setSelectedEvent(null); setOpen(true); };
  const handleEdit = (event) => { setSelectedEvent(event); setOpen(true); };
  const handleDelete = (id) => { if (confirm("Delete this event permanently?")) deleteMutation.mutate(id); };
  const handlePublish = (id) => publishMutation.mutate(id);

  const styles = {
    wrapper: { backgroundColor: theme.bg, color: theme.textMain, minHeight: "100vh", padding: isMobile ? "20px" : "40px", fontFamily: "'Inter', sans-serif" },
    container: { width: "100%", maxWidth: "1000px", margin: "0 auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" },
    createBtn: { backgroundColor: theme.accent, color: theme.bg, border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "800", cursor: "pointer", transition: "transform 0.2s" },
    searchBar: { width: "100%", padding: "14px 20px", borderRadius: "12px", border: `1px solid ${theme.border}`, backgroundColor: theme.ghost, color: theme.textMain, marginBottom: "30px", outline: "none" },
    eventCard: (id, status) => ({
      background: theme.card, borderRadius: "16px", padding: "20px", marginBottom: "12px",
      border: `1px solid ${activeId === id ? theme.success : theme.border}`,
      boxShadow: activeId === id ? `0 0 20px rgba(34, 197, 94, 0.2)` : "none",
      display: isMobile ? "block" : "grid",
      gridTemplateColumns: "2.5fr 1fr 1fr 1.5fr",
      alignItems: "center", gap: "15px", transition: "all 0.4s ease"
    }),
    badge: (status) => ({
      padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", textTransform: "uppercase",
      backgroundColor: status === "published" ? "rgba(34, 197, 94, 0.1)" : "rgba(148, 163, 184, 0.1)",
      color: status === "published" ? theme.success : theme.textMuted
    }),
    actionBtn: { padding: "8px 14px", borderRadius: "8px", border: `1px solid ${theme.border}`, background: "none", color: theme.textMain, cursor: "pointer", fontSize: "13px", fontWeight: "600" }
  };

  if (isLoading) return <div style={styles.wrapper}>Syncing with Portal...</div>;

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        <header style={styles.header}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "900", margin: 0 }}>Event<span style={{ color: theme.accent }}>.</span>engine</h1>
            <p style={{ color: theme.textMuted, fontSize: "14px" }}>Manage registration and showcase parameters</p>
          </div>
          <button style={styles.createBtn} onClick={handleCreate} onMouseOver={(e) => e.target.style.transform = "scale(1.05)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"}>
            + Create Event
          </button>
        </header>

        <input 
          type="text" 
          placeholder="Filter events by title..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />

        {filteredEvents.length === 0 ? (
          <p style={{ color: theme.textMuted, textAlign: "center", padding: "40px" }}>No events found</p>
        ) : (
          <div>
            {!isMobile && (
              <div style={{ padding: "0 20px 10px", display: "grid", gridTemplateColumns: "2.5fr 1fr 1fr 1.5fr", color: theme.textMuted, fontSize: "11px", fontWeight: "800", textTransform: "uppercase" }}>
                <span>Event Details</span>
                <span>Status</span>
                <span>Configuration</span>
                <span>Actions</span>
              </div>
            )}

            {filteredEvents.map((e) => (
              <div key={e._id} style={styles.eventCard(e._id, e.status)}>
                
                {/* Info */}
                <div>
                  <div style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>{e.title}</div>
                  <div style={{ color: theme.accent, fontSize: "12px", textTransform: "capitalize" }}>{e.mode} Mode</div>
                </div>

                {/* Status */}
                <div>
                  <span style={styles.badge(e.status)}>{e.status}</span>
                </div>

                {/* Fields Count */}
                <div style={{ fontSize: "13px", color: theme.textMuted }}>
                  {e.fields?.length || 0} Dynamic Fields
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", justifyContent: isMobile ? "space-between" : "flex-end" }}>
                  <button style={styles.actionBtn} onClick={() => handleEdit(e)}>Edit</button>
                  
                  {e.status !== "published" && (
                    <button 
                      style={{ ...styles.actionBtn, borderColor: theme.success, color: theme.success }} 
                      onClick={() => handlePublish(e._id)}
                    >
                      Publish
                    </button>
                  )}

                  <button 
                    style={{ ...styles.actionBtn, backgroundColor: "rgba(239, 68, 68, 0.1)", color: theme.danger, border: "none" }} 
                    onClick={() => handleDelete(e._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <EventModal
          event={selectedEvent}
          close={() => setOpen(false)}
        />
      )}
    </div>
  );
}