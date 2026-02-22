import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getEventsRequest,
  getEventAnalyticsRequest,
  getEventTimelineRequest,
} from "../api/analytics";

export default function DashboardHome() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  /* ======================
     ALL EVENTS
  ====================== */
  const { data: events = [] } = useQuery({
    queryKey: ["events"],
    queryFn: getEventsRequest,
  });

  /* ======================
     ANALYTICS
  ====================== */
  const { data: analytics } = useQuery({
    queryKey: ["analytics", selectedEvent?._id],
    queryFn: () => getEventAnalyticsRequest(selectedEvent._id),
    enabled: !!selectedEvent,
  });

  /* ======================
     TIMELINE
  ====================== */
  const { data: timeline = [] } = useQuery({
    queryKey: ["timeline", selectedEvent?._id],
    queryFn: () => getEventTimelineRequest(selectedEvent._id),
    enabled: !!selectedEvent,
  });

  /* ======================
     STATS
  ====================== */
  const stats = [
    { title: "Events", value: events.length },
    { title: "Submissions", value: analytics?.submissions?.total || 0 },
    { title: "Approved", value: analytics?.submissions?.approved || 0 },
    { title: "Rejected", value: analytics?.submissions?.rejected || 0 },
    {
      title: "Approval %",
      value: analytics?.submissions?.approvalRate
        ? analytics.submissions.approvalRate + "%"
        : "0%",
    },
  ];

  const max = Math.max(...timeline.map((d) => d.count), 1);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Dashboard</h2>

      {/* ================= EVENT SELECTOR ================= */}
      <select
        style={styles.select}
        onChange={(e) =>
          setSelectedEvent(events.find((ev) => ev._id === e.target.value))
        }
        defaultValue=""
      >
        <option value="" disabled>
          Select Event
        </option>

        {events.map((e) => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>

      {/* ================= STATS GRID ================= */}
      <div style={styles.grid}>
        {stats.map((s) => (
          <div key={s.title} style={styles.card}>
            <p style={styles.cardTitle}>{s.title}</p>
            <h2 style={styles.cardValue}>{s.value}</h2>
          </div>
        ))}
      </div>

      {/* ================= TIMELINE ================= */}
      {timeline.length > 0 && (
        <div style={styles.timelineWrapper}>
          <h3>📈 Submissions Timeline</h3>

          <svg width="100%" height="220">
            {timeline.map((t, i) => {
              const x =
                (i / (timeline.length - 1 || 1)) * 100; // %
              const y = 200 - (t.count / max) * 160;

              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={y}
                  r="5"
                />
              );
            })}
          </svg>
        </div>
      )}
    </div>
  );
}

/* ======================
   RESPONSIVE STYLES
====================== */
const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
   
  },

  heading: {
    marginBottom: 20,
  },

  select: {
    padding: "10px 14px",
    borderRadius: 8,
    border: "1px solid #ddd",
    width: "100%",
    maxWidth: 300,
  },

  /* 🔥 Auto responsive grid */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginTop: 30,
  },

  card: {
    padding: 20,
    borderRadius: 14,
    background: "#fff",
    border: "1px solid #eee",
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
  },

  cardTitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    
  },

  cardValue: {
    fontSize: 26,
    fontWeight: 700,
    color:'black',
  },

  timelineWrapper: {
    marginTop: 40,
    padding: 20,
    borderRadius: 14,
    border: "1px solid #eee",
    background: "#fff",
  },
};
