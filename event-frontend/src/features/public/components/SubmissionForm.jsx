import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { submitEventRequest, updateSubmissionRequest } from "../../event/api";

export default function SubmissionForm({ event, existingData, isEdit, onDone }) {
  const theme = event?.theme || {};
  const primaryColor = theme.primaryColor || "#3b82f6";

  const [selectedSeat, setSelectedSeat] = useState(existingData?.bookedSeat || null);
  const { register, handleSubmit, reset } = useForm({ defaultValues: existingData || {} });

  const { mutate, isPending } = useMutation({
    mutationFn: (fd) => isEdit ? updateSubmissionRequest(event?._id, fd) : submitEventRequest(event?._id, fd),
    onSuccess: () => { reset(); onDone?.(); }
  });

  const onSubmit = (data) => {
    if (event?.mode === 'booking' && !selectedSeat) return alert("Please select a seat.");
    const fd = new FormData();
    const answers = { ...data };
    const files = [];

    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof FileList && value.length > 0) {
        files.push(value[0]);
      } else {
        answers[key] = value;
      }
    });

    if (event?.mode === 'booking') answers.bookedSeat = selectedSeat;
    fd.append("answers", JSON.stringify(answers));
    files.forEach(file => fd.append("files", file));
    mutate(fd);
  };

  const renderField = (field) => {
    const commonProps = {
      ...register(field.name, { required: field.required }),
      className: "form-control"
    };

    if (field.type === "file") {
      return (
        <div className="file-upload-wrapper">
          <input type="file" {...commonProps} id={`file-${field.name}`} />
          <label htmlFor={`file-${field.name}`} className="file-label">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>{field.label}</span>
          </label>
        </div>
      );
    }
    return <input type={field.type} {...commonProps} placeholder={`Enter ${field.label}`} />;
  };

  if (!event) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="interactive-form">
      <style>{`
        .interactive-form { 
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          padding: 8px; /* Reduced padding for tiny screens */
          overflow-x: hidden; /* Prevent horizontal scroll */
        }

        .field-row { 
          width: 100%;
          margin-bottom: 1rem; 
          display: flex;
          flex-direction: column;
        }

        .field-row label { 
          font-size: clamp(0.65rem, 2vw, 0.75rem); 
          font-weight: 700; 
          color: #94a3b8; 
          text-transform: uppercase; 
          margin-bottom: 4px; 
        }
        
        .form-control { 
          width: 100%; 
          padding: 10px 12px; 
          background: #070b14; 
          border: 1px solid #334155; 
          border-radius: 8px; 
          color: white; 
          font-size: 16px; /* Mandatory for iOS zoom prevention */
          box-sizing: border-box;
        }

        /* ULTRA-SMALL SEAT GRID (Less than 350px) */
        .booking-grid { 
          display: grid; 
          /* This allows seats to get as small as 32px to fit 5-6 across on a 280px screen */
          grid-template-columns: repeat(auto-fill, minmax(32px, 1fr)); 
          gap: 6px; 
          background: #0f172a; 
          padding: 8px; 
          border-radius: 8px; 
          border: 1px solid #334155;
          max-height: 300px;
          overflow-y: auto;
        }

        .seat-btn { 
          aspect-ratio: 1 / 1; 
          border-radius: 6px; 
          border: none; 
          font-weight: 700; 
          font-size: 0.75rem; 
          background: #1e293b; 
          color: white;
          display: flex; 
          align-items: center; 
          justify-content: center;
          padding: 0;
          min-width: 0; /* Allows shrinking in flex/grid contexts */
        }

        .seat-btn.active { background: ${primaryColor}; box-shadow: 0 0 8px ${primaryColor}88; }
        .seat-btn.taken { background: #ef444415; color: #ef4444; opacity: 0.5; }
        
        .main-submit { 
          width: 100%; 
          padding: 14px; 
          border-radius: 10px; 
          border: none; 
          color: white; 
          font-weight: 700; 
          font-size: 0.95rem; 
          margin-top: 10px;
          background: ${primaryColor};
          cursor: pointer;
        }

        /* File Label compact mode */
        .file-label { 
          display: flex; 
          align-items: center; 
          justify-content: center;
          gap: 8px;
          padding: 16px 10px; 
          border: 2px dashed #334155; 
          border-radius: 8px; 
          background: #0f172a;
          color: #94a3b8;
          font-size: 0.85rem;
        }

        /* Hide icon on extremely small screens to save space */
        @media (max-width: 320px) {
          .file-label i { display: none; }
          .booking-grid { gap: 4px; padding: 4px; }
          .seat-btn { font-size: 0.65rem; }
        }
      `}</style>

      {event?.fields?.map((field) => (
        <div key={field.name} className="field-row">
          <label>{field.label} {field.required && '*'}</label>
          {renderField(field)}
        </div>
      ))}

      {event?.mode === 'booking' && (
        <div className="field-row">
          <label>Select Seat</label>
          <div className="booking-grid">
            {Array.from({ length: event?.booking?.capacity || 20 }).map((_, i) => {
              const sid = `S-${i + 1}`;
              const booked = i < (event?.booking?.seatsBooked || 0);
              return (
                <button
                  key={sid} type="button" disabled={booked}
                  className={`seat-btn ${booked ? 'taken' : ''} ${selectedSeat === sid ? 'active' : ''}`}
                  onClick={() => setSelectedSeat(sid)}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button type="submit" className="main-submit" disabled={isPending}>
        {isPending ? "Wait..." : isEdit ? "Update" : "Confirm"}
      </button>
    </form>
  );
}