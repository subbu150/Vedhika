import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getEventRequest, getMySubmissionRequest } from "../../event/api";
import SubmissionForm from "../components/SubmissionForm";
import CertificateDownload from "../components/CertificateDownload";
import Confetti from "react-confetti";
import Snowfall from "react-snowfall";
import Particles from "react-tsparticles";

/* ===== FONTAWESOME IMPORTS ===== */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faInstagram, 
  faTwitter, 
  faLinkedin, 
  faYoutube, 
  faGithub 
} from "@fortawesome/free-brands-svg-icons";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";

export default function EventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  /* ===== DATA FETCHING ===== */
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventRequest(id),
  });

  const { data: submission, refetch } = useQuery({
    queryKey: ["submission", id],
    queryFn: () => getMySubmissionRequest(id),
  });

  if (isLoading) return <div className="loading-stage"><div className="pulse"></div></div>;
  if (!event) return <div className="error-stage">Event not found</div>;

  /* ===== THEME & SCHEMA CONSTANTS ===== */
  const theme = event?.theme || {};
  const primaryColor = theme.primaryColor || "#3b82f6";
  const bgColor = theme.backgroundColor || "#0a0a0a";
  const layout = theme.layout || "minimal";
  const animation = theme.animation || "none";

  /* ===== DYNAMIC SOCIAL RENDERER ===== */
  const renderSocials = () => {
    const iconMap = {
      instagram: faInstagram,
      twitter: faTwitter,
      x: faTwitter,
      linkedin: faLinkedin,
      youtube: faYoutube,
      github: faGithub,
      website: faGlobe,
      portfolio: faGlobe
    };

    // Pull from fixed Schema (event.socials) and Dynamic Form (submission.answers)
    const organizerSocials = event?.socials || {};
    const userSocials = submission?.answers || {};
    
    // Merge both sources
    const allSocials = { ...organizerSocials, ...userSocials };

    const socialEntries = Object.entries(allSocials).filter(([key, value]) => {
      const platform = key.toLowerCase();
      return iconMap[platform] && typeof value === "string" && value.startsWith("http");
    });

    if (socialEntries.length === 0) return null;

    return (
      <div className="social-links-row">
        {socialEntries.map(([key, value]) => (
          <a 
            key={key} 
            href={value} 
            target="_blank" 
            rel="noreferrer" 
            className="social-pill"
            style={{ "--hover-accent": primaryColor }}
          >
            <FontAwesomeIcon icon={iconMap[key.toLowerCase()]} />
            <span className="tooltip">{key}</span>
          </a>
        ))}
      </div>
    );
  };

  /* ===== ANIMATION RENDERER ===== */
  const renderAnimation = () => {
    switch (animation) {
      case "confetti": return <Confetti recycle numberOfPieces={150} gravity={0.12} />;
      case "snowfall": return <Snowfall snowflakeCount={100} speed={[0.5, 1.0]} radius={[1, 2]} />;
      case "particles":
        return (
          <Particles
            options={{
              particles: {
                number: { value: 50 },
                size: { value: 2 },
                move: { speed: 0.8 },
                opacity: { value: 0.4 },
                links: { enable: true, opacity: 0.1, color: primaryColor }
              }
            }}
          />
        );
      default: return null;
    }
  };

  return (
    <div className={`main-viewport layout-${layout}`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

        .main-viewport {
          min-height: 100vh;
          background: ${bgColor};
          color: #fff;
          font-family: 'Plus Jakarta Sans', sans-serif;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .stage-bg { position: absolute; inset: 0; z-index: 1; }
        .bg-image {
          width: 100%; height: 100%;
          background: url(${theme.bannerImage}) center/cover no-repeat;
          filter: brightness(0.3) saturate(1.2);
        }
        .bg-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(circle at center, transparent 0%, ${bgColor} 95%);
        }

        .content-shell {
          position: relative; z-index: 10;
          width: 100%; max-width: 1200px;
          padding: 40px;
          display: grid;
          grid-template-columns: 1.2fr 420px;
          gap: 80px;
          align-items: center;
        }

        .event-title {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 800;
          line-height: 1.1;
          margin: 20px 0;
          background: linear-gradient(to bottom right, #fff 50%, rgba(255,255,255,0.5));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* ===== SOCIAL PILLS ===== */
        .social-links-row {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .social-pill {
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          color: #fff;
          font-size: 22px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }

        .social-pill:hover {
          background: var(--hover-accent);
          border-color: var(--hover-accent);
          transform: translateY(-8px) rotate(5deg);
          box-shadow: 0 15px 30px -5px var(--hover-accent);
        }

        .tooltip {
          position: absolute;
          top: -40px;
          font-size: 11px;
          background: #fff;
          color: #000;
          padding: 5px 10px;
          border-radius: 6px;
          opacity: 0;
          transform: scale(0.8);
          transition: 0.2s;
          font-weight: 800;
          text-transform: uppercase;
        }

        .social-pill:hover .tooltip { opacity: 1; transform: scale(1); top: -45px; }

        /* ===== ACTION CARD ===== */
        .action-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(25px);
          border-radius: 32px;
          padding: 48px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .p-btn {
          width: 100%; padding: 18px; border-radius: 16px; font-weight: 700;
          cursor: pointer; border: none; transition: 0.3s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }

        .btn-core { background: ${primaryColor}; color: #fff; box-shadow: 0 10px 20px ${primaryColor}33; }
        .btn-sub { background: rgba(255,255,255,0.06); color: #fff; border: 1px solid rgba(255,255,255,0.1); }

        @media (max-width: 1024px) {
          .content-shell { grid-template-columns: 1fr; text-align: center; }
          .social-links-row { justify-content: center; }
        }
      `}</style>

      {renderAnimation()}

      <div className="stage-bg">
        <div className="bg-image" />
        <div className="bg-vignette" />
      </div>

      <div className="content-shell">
        <div className="text-area">
          <div className="event-badge" style={{
            display: 'inline-block', padding: '8px 16px', background: `${primaryColor}22`,
            border: `1px solid ${primaryColor}44`, color: primaryColor, borderRadius: '100px',
            fontSize: '11px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase'
          }}>Exclusive Access</div>
          
          <h1 className="event-title">{event.title}</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '18px', lineHeight: '1.6' }}>
            {event.description}
          </p>

          {/* This renders links from the event schema AND the user's form */}
          {renderSocials()}
        </div>

        <div className="action-card">
          {submission && !isEditing ? (
            <div className="welcome-state">
              <div className="welcome-header" style={{textAlign: 'center', marginBottom: '30px'}}>
                <h2 style={{fontSize: '28px', fontWeight: 800}}>Access Granted</h2>
                <p style={{color: 'rgba(255,255,255,0.5)'}}>Welcome back to the experience.</p>
              </div>
              
              <div className="button-stack" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <button className="p-btn btn-core" onClick={() => navigate(`/events/${id}/experience`)}>
                  ENTER PORTAL Hello
                </button>

                <div className="secondary-actions" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <button className="p-btn btn-sub" onClick={() => setIsEditing(true)}>Edit Profile</button>
                  <CertificateDownload eventId={id} submissionId={submission._id} customClass="p-btn btn-sub" />
                </div>
              </div>
            </div>
          ) : (
            <SubmissionForm
              event={event}
              existingData={submission?.answers}
              isEdit={isEditing}
              onDone={() => { refetch(); setIsEditing(false); }}
            />
          )}
        </div>
      </div>
    </div>
  );
}