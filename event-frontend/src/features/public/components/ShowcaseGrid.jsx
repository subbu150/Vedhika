import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEventShowcaseRequest } from "../../event/api";

export default function ShowcaseGrid({ eventId }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["showcase", eventId],
    queryFn: () => getEventShowcaseRequest(eventId),
  });

  const handleDownload = (url) => {
    // Creating an invisible link to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank"; // Safety fallback
    link.download = `showcase-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <div className="loading-text">Loading showcase...</div>;
  if (!submissions.length) return <p className="empty-msg">No entries yet. Be the first!</p>;

  return (
    <section className="showcase-container">
      <style>{`
        .showcase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .showcase-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
        }

        /* Container for image + button */
        .showcase-image-wrapper {
          position: relative;
          width: 100%;
          height: 200px;
          background: #f1f5f9;
          overflow: hidden;
        }

        .showcase-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: filter 0.3s ease;
        }

        /* The Preview Button - Hidden by default */
        .preview-btn-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.3);
          opacity: 0;
          transition: opacity 0.3s ease;
          cursor: pointer;
        }

        .showcase-image-wrapper:hover .preview-btn-overlay {
          opacity: 1;
        }

        .showcase-image-wrapper:hover .showcase-image {
          filter: blur(2px);
        }

        .preview-label {
          background: white;
          color: #1e293b;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.85rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .modal-img {
          max-width: 95%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 4px;
        }

        .modal-controls {
          margin-top: 20px;
          display: flex;
          gap: 15px;
        }

        .btn-download {
          background: #10b981;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
        }

        .btn-close {
          background: #ef4444;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
        }

        .showcase-content { padding: 1.25rem; }
        .answer-label { font-size: 0.7rem; color: #64748b; text-transform: uppercase; font-weight: bold; }
        .answer-value { font-size: 0.9rem; margin-bottom: 8px; color: #334155; }
      `}</style>

      <div className="showcase-grid">
        {submissions.map((s) => (
          <div key={s._id} className="showcase-card">
            {s.files?.[0] && (
              <div className="showcase-image-wrapper">
                <img src={s.files[0]} alt="Entry" className="showcase-image" />
                {/* PREVIEW BUTTON OVERLAY */}
                <div 
                  className="preview-btn-overlay" 
                  onClick={() => setSelectedImage(s.files[0])}
                >
                  <span className="preview-label">👁 Preview</span>
                </div>
              </div>
            )}

            <div className="showcase-content">
              {Object.entries(s.answers || {}).map(([key, value]) => (
                <div key={key}>
                  <div className="answer-label">{key.replace(/_/g, ' ')}</div>
                  <div className="answer-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedImage && (
        <div className="modal-overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Full Preview" className="modal-img" />
          
          <div className="modal-controls" onClick={(e) => e.stopPropagation()}>
            <button className="btn-download" onClick={() => handleDownload(selectedImage)}>
              Download Image
            </button>
            <button className="btn-close" onClick={() => setSelectedImage(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
}