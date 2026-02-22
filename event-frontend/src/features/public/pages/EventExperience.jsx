
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEventRequest, getEventShowcaseRequest } from "../../event/api";

// Import custom components/hooks
import AnimationRenderer from "../../../../themes/AnimationRenderer";
import useEventTheme from "../../../../themes/useEventTheme";
import "../../../../themes/ThemeStyles.css";

export default function EventExperience() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventRequest(id),
    enabled: !!id
  });

  const { data: submissions, isLoading: subsLoading } = useQuery({
    queryKey: ["showcase", id],
    queryFn: () => getEventShowcaseRequest(id),
    enabled: !!id
  });

  const { layoutClass, animationType, styleVars } = useEventTheme(event?.theme);

  if (eventLoading) return <div className="loader-portal"><div className="pulse"></div></div>;
  if (!event) return <div className="error-stage">Event not found</div>;

  const primaryColor = event.theme?.primaryColor || "#3b82f6";

  return (
    <div className={`xp-stage ${layoutClass}`} style={styleVars}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;800&display=swap');
        
        .xp-stage { 
          min-height: 100vh; 
          background-color: var(--bg-color); 
          color: var(--text-color); 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          position: relative; 
          overflow-x: hidden; 
        }

        /* Prevent Particles/Fireworks from pushing content */
        canvas {
          position: fixed !important;
          inset: 0;
          pointer-events: none;
          z-index: 1;
        }

        .fixed-backdrop { 
          position: fixed; 
          inset: 0; 
          background: url(${event.theme?.backgroundImage}) center/cover no-repeat; 
          filter: brightness(0.3) blur(8px); 
          z-index: 0; 
        }

        .gradient-mask { 
          position: fixed; 
          inset: 0; 
          background: radial-gradient(circle at top left, var(--primary)15, transparent), 
                      linear-gradient(to bottom, transparent, var(--bg-color)); 
          z-index: 1; 
        }

        .xp-nav { 
          position: fixed; 
          top: 0; 
          width: 100%; 
          z-index: 1000; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          padding: ${scrolled ? '12px 5%' : '20px 5%'}; 
          background: ${scrolled ? 'rgba(0,0,0,0.85)' : 'transparent'}; 
          backdrop-filter: blur(12px); 
          transition: 0.4s;
          border-bottom: 1px solid ${scrolled ? 'rgba(255,255,255,0.1)' : 'transparent'};
        }

        .content-wrap { 
          position: relative; 
          z-index: 10; 
          padding: 100px 5% 60px; 
          max-width: 1400px; 
          margin: 0 auto; 
        }

        .hero-head { 
          margin-bottom: 30px; 
          text-align: center; 
        }

        .hero-head h1 {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(to bottom, #fff, #ccc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .showcase-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); 
          gap: 25px; 
        }

        .glass-card { 
          background: rgba(255,255,255,0.03); 
          backdrop-filter: blur(20px); 
          border-radius: 24px; 
          border: 1px solid rgba(255,255,255,0.08); 
          overflow: hidden; 
          transition: 0.3s ease; 
        }

        .glass-card:hover { 
          transform: translateY(-8px); 
          border-color: var(--primary); 
          background: rgba(255,255,255,0.05);
        }

        .img-preview { 
          width: 100%; 
          height: 220px; 
          object-fit: cover; 
          background: #111; 
          cursor: pointer;
        }

        .card-body { padding: 20px; }
        
        .badge-pill { 
          font-size: 10px; 
          font-weight: 800; 
          color: var(--primary); 
          letter-spacing: 1px; 
          margin-bottom: 8px; 
          display: flex; 
          align-items: center; 
          gap: 6px; 
          text-transform: uppercase;
        }

        .dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 8px var(--primary); }

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.95);
          z-index: 9999; display: flex; flex-direction: column;
          align-items: center; justify-content: center; padding: 20px;
        }

        .modal-img {
          max-width: 90%; max-height: 75vh; border-radius: 12px;
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .modal-actions { margin-top: 24px; display: flex; gap: 12px; }

        .action-btn {
          background: var(--primary); color: white; border: none;
          padding: 12px 24px; border-radius: 12px; font-weight: 700;
          cursor: pointer; transition: 0.2s;
        }

        .action-btn.secondary { background: rgba(255,255,255,0.1); }
      `}</style>

      <div className="fixed-backdrop" />
      <div className="gradient-mask" />
      
      {/* Handled via external renderer */}
      <AnimationRenderer type={animationType} primaryColor={primaryColor} />

      <nav className="xp-nav">
        <div className="brand-box" style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          {event.theme?.logo && <img src={event.theme.logo} alt="logo" style={{height: '32px', borderRadius: '6px'}} />}
          <h2 style={{fontWeight: 800, margin: 0, fontSize: '1.2rem'}}>{event.title}</h2>
        </div>
        <button onClick={() => navigate(`/events/${id}`)} style={{background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", padding: "8px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: '0.9rem'}}>
          Back to Details
        </button>
      </nav>

      <main className="content-wrap">
        <div className="hero-head">
          <h1>
            {event.mode === "booking" ? "Confirmed Attendees" : "Experience Showcase"}
          </h1>
          <p style={{opacity: 0.5, fontSize: '0.9rem'}}>{submissions?.length || 0} participants joined</p>
        </div>

        {subsLoading ? (
          <div style={{textAlign: 'center', padding: '50px', opacity: 0.5}}>Loading Experience...</div>
        ) : (
          <div className="showcase-grid">
            {submissions?.map((sub) => {
              // Extract image from files or from answers (supporting form URLs)
              const displayImg = sub.files?.[0] || 
                                (Array.isArray(sub.answers) && sub.answers.find(a => typeof a.value === "string" && (a.value.startsWith("http") || a.value.includes("cloudinary")))?.value);

              return (
                <div key={sub._id} className="glass-card">
                  {displayImg && (
                    <img 
                      src={displayImg} 
                      className="img-preview" 
                      alt="entry" 
                      onClick={() => setSelectedImage(displayImg)}
                      loading="lazy"
                    />
                  )}
                  <div className="card-body">
                    <div className="badge-pill">
                      <span className="dot"></span>
                      {event.mode === "booking" ? "Attendee" : "Community Entry"}
                    </div>
                    <h3 style={{margin: 0, fontSize: '1.1rem', fontWeight: 700}}>
                      {sub.user?.name || "Anonymous User"}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} className="modal-img" alt="Full Preview" />
          <div className="modal-actions" onClick={e => e.stopPropagation()}>
            <button className="action-btn" onClick={() => window.open(selectedImage, '_blank')}>
              View Original
            </button>
            <button className="action-btn secondary" onClick={() => setSelectedImage(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}