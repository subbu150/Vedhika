import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser } from "../../dashboard/api/userApi";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUser(id);
        setUser(data);
      } catch (err) {
        console.error("Navigation error at sea:", err);
      }
    };
    load();
  }, [id]);

  if (!user) return (
    <div className="anchor-loading">
      <div className="spinner"></div>
      <p>Consulting the Charts...</p>
    </div>
  );

  return (
    <div className="naval-container">
      <style>{`
        .naval-container {
          padding: 40px 20px;
          min-height: 100vh;
          background-color: #0a192f; /* Deep Trench Blue */
          display: flex;
          justify-content: center;
          align-items: flex-start;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .dossier-card {
          background: #ffffff;
          width: 100%;
          max-width: 600px;
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.3);
          border-top: 10px solid #1a365d; /* Navy Header */
        }

        /* Maritime Accent Strip */
        .dossier-card::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 80px;
          background: linear-gradient(45deg, transparent 50%, #c5a059 50%); /* Compass Gold */
        }

        .dossier-header {
          padding: 30px;
          background: #1a365d;
          color: white;
          text-align: center;
        }

        .dossier-header h2 {
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 3px;
          font-size: 1.4rem;
        }

        .rank-badge {
          display: inline-block;
          margin-top: 10px;
          padding: 4px 15px;
          background: #c5a059;
          color: #1a365d;
          font-weight: bold;
          font-size: 0.8rem;
          border-radius: 20px;
          text-transform: uppercase;
        }

        .dossier-body {
          padding: 40px;
          color: #334155;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px dashed #cbd5e1;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .label {
          font-weight: 700;
          color: #1e293b;
          text-transform: uppercase;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
        }

        .label::before {
          content: "⚓";
          margin-right: 8px;
          font-size: 1rem;
        }

        .value {
          color: #475569;
          font-family: 'Courier New', monospace; /* Logbook style */
        }

        .footer-actions {
          padding: 20px 40px 40px;
          text-align: center;
        }

        .btn-back {
          background: transparent;
          border: 2px solid #1a365d;
          color: #1a365d;
          padding: 10px 25px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease;
        }

        .btn-back:hover {
          background: #1a365d;
          color: white;
        }

        .anchor-loading {
          height: 100vh;
          background: #0a192f;
          color: #c5a059;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        @media (max-width: 480px) {
          .info-row {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>

      <div className="dossier-card">
        <div className="dossier-header">
          <h2>Partcipant</h2>
          <div className="rank-badge">{user.role}</div>
        </div>

        <div className="dossier-body">
          <div className="info-row">
            <span className="label">Full Name</span>
            <span className="value">{user.name}</span>
          </div>

          <div className="info-row">
            <span className="label">(Email)</span>
            <span className="value">{user.email}</span>
          </div>

          <div className="info-row">
            <span className="label">Date</span>
            <span className="value">{new Date(user.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="info-row">
            <span className="label">User_ID</span>
            <span className="value">{user._id}</span>
          </div>
        </div>

        <div className="footer-actions">
          <button className="btn-back" onClick={() => navigate(-1)}>
            RETURN TO FLEET
          </button>
        </div>
      </div>
    </div>
  );
}