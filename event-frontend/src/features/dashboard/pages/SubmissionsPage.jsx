import React, { useState, useEffect, useMemo } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  searchEventsRequest,
  getSubmissionsRequest,
  updateSubmissionStatusRequest,
} from "../../submissions/api";

export default function SubmissionsPage() {
  const qc = useQueryClient();
  
  // State Management
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewSubmission, setViewSubmission] = useState(null);
  const [isMobile, setIsMobile] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Responsive logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch Events
  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ["events"],
    queryFn: () => searchEventsRequest(""),
  });

  // Fetch Submissions for selected event
  const { data: result = {}, isLoading: loadingSubmissions } = useQuery({
    queryKey: ["submissions", selectedEvent?._id],
    queryFn: () => getSubmissionsRequest(selectedEvent._id, { page: 1, limit: 1000 }),
    enabled: !!selectedEvent,
  });

  const submissions = result?.submissions || [];

  // --- CLIENT SIDE SEARCH LOGIC ---
  const filteredSubmissions = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return submissions;

    return submissions.filter((s) => {
      const userName = s.user?.name?.toLowerCase() || "";
      const userEmail = s.user?.email?.toLowerCase() || "";
      const seat = s.seatNumber?.toString().toLowerCase() || "";
      
      return userName.includes(query) || userEmail.includes(query) || seat.includes(query);
    });
  }, [submissions, searchQuery]);

  // Update Status Mutation
  const { mutate } = useMutation({
    mutationFn: updateSubmissionStatusRequest,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["submissions", selectedEvent?._id] }),
  });

  const theme = {
    bg: "#020617",
    card: "#0f172a",
    accent: "#38bdf8",
    textMain: "#f8fafc",
    textMuted: "#94a3b8",
    border: "rgba(255,255,255,0.08)",
    success: "#22c55e",
    danger: "#ef4444",
    ghost: "rgba(255,255,255,0.03)"
  };

  const styles = {
    wrapper: { backgroundColor: theme.bg, color: theme.textMain, minHeight: "100vh", padding: isMobile ? "16px" : "40px", fontFamily: "'Inter', system-ui, sans-serif" },
    container: { width: "100%", maxWidth: "800px", margin: "0 auto" },
    card: { background: theme.card, borderRadius: "16px", padding: "20px", marginBottom: "12px", border: `1px solid ${theme.border}`, transition: "transform 0.2s" },
    searchInput: {
      width: "100%", padding: "14px 20px", borderRadius: "12px", border: `1px solid ${theme.border}`,
      backgroundColor: theme.ghost, color: theme.textMain, fontSize: "15px", marginBottom: "20px", outline: "none"
    },
    badge: (status) => ({
      padding: "4px 10px", borderRadius: "8px", fontSize: "11px", fontWeight: "700",
      backgroundColor: status === "approved" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
      color: status === "approved" ? theme.success : theme.danger,
      textTransform: "uppercase", letterSpacing: "0.5px"
    }),
    btnSecondary: { 
      flex: 1, padding: "10px", borderRadius: "8px", border: `1px solid ${theme.border}`, 
      backgroundColor: "transparent", color: theme.textMain, fontWeight: "600", cursor: "pointer", fontSize: "13px" 
    }
  };

  const renderDetailRow = (label, value) => (
    <div style={{ marginBottom: "16px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
      <label style={{ display: "block", fontSize: "10px", color: theme.textMuted, fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>{label}</label>
      <div style={{ fontSize: "15px", color: theme.textMain }}>{value || "—"}</div>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        
        {/* Header */}
        <header style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px", color: theme.textMain }}>
            Portal<span style={{ color: theme.accent }}>.</span>admin
          </h1>
          <p style={{ color: theme.textMuted, fontSize: "14px", marginTop: "4px" }}>Manage Participant Data</p>
        </header>

        {!selectedEvent ? (
          <div style={{ animation: "fadeIn 0.4s ease" }}>
            <h2 style={{ fontSize: "18px", marginBottom: "20px", fontWeight: "600" }}>Select Active Event</h2>
            {loadingEvents ? <p style={{ color: theme.textMuted }}>Initializing events...</p> : events.map(e => (
              <div key={e._id} style={{ ...styles.card, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }} 
                   onClick={() => setSelectedEvent(e)}
                   onMouseOver={(e) => e.currentTarget.style.borderColor = theme.accent}
                   onMouseOut={(e) => e.currentTarget.style.borderColor = theme.border}>
                <span style={{ fontWeight: "600" }}>{e.title}</span>
                <span style={{ color: theme.accent, fontSize: "20px" }}>→</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <button onClick={() => { setSelectedEvent(null); setSearchQuery(""); }} 
                        style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>
                ← Back to Events
                </button>
                <div style={{ fontSize: "12px", color: theme.textMuted, backgroundColor: theme.ghost, padding: "4px 12px", borderRadius: "20px" }}>
                    {filteredSubmissions.length} Participants
                </div>
            </div>

            <h2 style={{ fontSize: "22px", marginBottom: "24px", fontWeight: "700" }}>{selectedEvent.title}</h2>

            {/* SEARCH INPUT */}
            <input 
              type="text"
              placeholder="Search by name, email or seat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />

            {loadingSubmissions ? <p style={{ textAlign: "center", color: theme.textMuted }}>Fetching records...</p> : (
              <div>
                {filteredSubmissions.length > 0 ? filteredSubmissions.map(s => (
                  <div key={s._id} style={styles.card}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: theme.accent, color: theme.bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900" }}>
                        {(s.user?.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: "700", color: theme.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {s.user?.name || "Unnamed User"}
                        </div>
                        <div style={{ fontSize: "12px", color: theme.textMuted }}>{s.user?.email}</div>
                      </div>
                      <div style={styles.badge(s.status)}>{s.status}</div>
                    </div>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => setViewSubmission(s)} style={styles.btnSecondary}>Details</button>
                      <button 
                        onClick={() => mutate({ eventId: selectedEvent._id, submissionId: s._id, status: s.status === "approved" ? "rejected" : "approved" })}
                        style={{ 
                          ...styles.btnSecondary, 
                          borderColor: s.status === "approved" ? theme.danger : theme.success,
                          color: s.status === "approved" ? theme.danger : theme.success 
                        }}
                      >
                        {s.status === "approved" ? "Reject" : "Approve"}
                      </button>
                    </div>
                  </div>
                )) : (
                    <div style={{ textAlign: "center", padding: "60px 20px", color: theme.textMuted }}>
                        <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔍</div>
                        <p>No records found matching your search.</p>
                    </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PROFILE MODAL */}
      {viewSubmission && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.9)", display: "flex", alignItems: isMobile ? "flex-end" : "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}>
          <div style={{ 
            background: theme.card, width: "100%", maxWidth: "500px", maxHeight: "90vh",
            borderRadius: isMobile ? "24px 24px 0 0" : "20px", padding: "30px", overflowY: "auto",
            border: `1px solid ${theme.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Participant Details</h3>
              <button onClick={() => setViewSubmission(null)} style={{ background: "none", border: "none", color: theme.textMuted, fontSize: "24px", cursor: "pointer" }}>&times;</button>
            </div>

            {renderDetailRow("Full Name", viewSubmission.user?.name)}
            {renderDetailRow("Email Address", viewSubmission.user?.email)}
            {renderDetailRow("Seat Number", viewSubmission.seatNumber)}
            {renderDetailRow("Submission ID", viewSubmission._id)}

            {viewSubmission.files?.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <label style={{ display: "block", fontSize: "10px", color: theme.textMuted, fontWeight: "800", marginBottom: "12px" }}>ATTACHED ASSETS</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "12px" }}>
                  {viewSubmission.files.map((file, i) => (
                    <a key={i} href={file} target="_blank" rel="noreferrer" style={{ aspectRatio: "1/1", borderRadius: "10px", overflow: "hidden", border: `1px solid ${theme.border}` }}>
                      <img src={file} alt="asset" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </a>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setViewSubmission(null)} style={{ 
              width: "100%", padding: "14px", borderRadius: "12px", border: "none", 
              backgroundColor: theme.accent, color: theme.bg, fontWeight: "800", marginTop: "30px", cursor: "pointer" 
            }}>
              Close Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}