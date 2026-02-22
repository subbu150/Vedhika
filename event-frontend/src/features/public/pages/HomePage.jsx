import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { getEventsRequests } from "../../event/api";

export default function HomePage() {
  const navigate = useNavigate();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["public-events"],
    queryFn: getEventsRequests,
    // Keep data fresh but avoid unnecessary refetches for UI stability
    staleTime: 1000 * 60 * 5, 
  });

  // Memoize filtered events to prevent recalculation on every render
  const published = useMemo(() => 
    events.filter((e) => e.status === "published"), 
  [events]);

  /* ======================================
      SMOOTH AUTO-REDIRECT
  ====================================== */
  useEffect(() => {
    if (!isLoading && published.length === 1) {
      navigate(`/events/${published[0]._id}`, { replace: true });
    }
  }, [isLoading, published, navigate]);

  if (isLoading) {
    return (
      <div className="portal-loader">
        <div className="spinner"></div>
        <p>Scanning the Horizon...</p>
      </div>
    );
  }

  if (published.length === 0) {
    return (
      <div className="public-home empty-state">
        <div className="empty-icon">📡</div>
        <h2>No Live Signals</h2>
        <p>The event horizon is currently clear. Please check back later.</p>
      </div>
    );
  }

  // If there's only 1 event, we don't want to show the grid for a split second
  if (published.length === 1) return null;

  return (
    <div className="public-home">
      <style>{`
        .public-home {
          padding: 4rem 2rem;
          min-height: 100vh;
          background: #0f172a; /* Deep Navy */
          color: #f8fafc;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .home-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .home-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          background: linear-gradient(to right, #60a5fa, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 1rem;
        }

        .home-subtitle {
          color: #94a3b8;
          font-size: 1.1rem;
        }

        /* Responsive Grid */
        .event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2.5rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Attractive Card Design */
        .event-card {
          background: #1e293b;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .event-card:hover {
          transform: translateY(-12px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          border-color: rgba(96, 165, 250, 0.5);
        }

        .thumb-wrapper {
          height: 200px;
          overflow: hidden;
          position: relative;
        }

        .event-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .event-card:hover .event-thumb {
          transform: scale(1.1);
        }

        .event-info {
          padding: 1.5rem;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
        }

        .event-info h3 {
          font-size: 1.4rem;
          margin: 0 0 0.75rem 0;
          color: #fff;
        }

        .event-info p {
          color: #94a3b8;
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge {
          padding: 0.4rem 1rem;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(96, 165, 250, 0.1);
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.2);
        }

        .arrow-link {
          color: #60a5fa;
          font-size: 1.2rem;
          transition: transform 0.3s ease;
        }

        .event-card:hover .arrow-link {
          transform: translateX(5px);
        }

        /* Empty & Loading States */
        .portal-loader, .empty-state {
          height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .empty-icon { font-size: 4rem; margin-bottom: 1rem; }

        @media (max-width: 640px) {
          .public-home { padding: 2rem 1rem; }
          .event-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <header className="home-header">
        <h1 className="home-title">Active Fleet</h1>
        <p className="home-subtitle">Select an operational event to proceed</p>
      </header>

      <div className="event-grid">
        {published.map((event) => (
          <div
            key={event._id}
            className="event-card"
            onClick={() => navigate(`/events/${event._id}`)}
          >
            <div className="thumb-wrapper">
              <img
                src={event.theme?.bannerImage || "https://via.placeholder.com/600x400?text=Event+Thumbnail"}
                alt=""
                className="event-thumb"
              />
            </div>

            <div className="event-info">
              <h3>{event.title}</h3>
              <p>{event.description || "No mission briefing available for this event."}</p>

              <div className="card-footer">
                <span className="badge">
                  {event.mode}
                </span>
                <span className="arrow-link">→</span>
              </div>
            </div>

            {/* Subtle glow effect using the theme's primary color */}
            <div 
              className="color-accent" 
              style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '4px',
                background: event.theme?.primaryColor || '#60a5fa'
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}