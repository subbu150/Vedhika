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

    // Separate files from text answers
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
            <span>Click to upload {field.label}</span>
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
        .interactive-form { pointer-events: auto; position: relative; z-index: 100; }
        .field-row { margin-bottom: 20px; text-align: left; }
        .field-row label { display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
        
        .form-control { 
          width: 100%; padding: 14px; background: #070b14; border: 1px solid #334155; 
          border-radius: 12px; color: white; font-size: 1rem; outline: none; transition: 0.2s;
        }
        .form-control:focus { border-color: ${primaryColor}; box-shadow: 0 0 0 4px ${primaryColor}22; }

        /* File Upload Styling */
        .file-upload-wrapper { position: relative; width: 100%; }
        .file-upload-wrapper input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; z-index: 2; }
        .file-label { 
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          padding: 20px; border: 2px dashed #334155; border-radius: 12px; background: #0f172a;
          color: #94a3b8; transition: 0.2s; cursor: pointer;
        }
        .file-upload-wrapper:hover .file-label { border-color: ${primaryColor}; color: white; }
        .file-label i { font-size: 1.5rem; margin-bottom: 8px; }

        .booking-grid { 
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; 
          background: #070b14; padding: 15px; border-radius: 16px; border: 1px solid #334155;
        }
        .seat-btn { 
          aspect-ratio: 1; border-radius: 8px; border: none; font-weight: 800; font-size: 0.75rem; 
          cursor: pointer; transition: 0.2s; background: #1e293b; color: white;
        }
        .seat-btn.active { background: ${primaryColor}; transform: scale(1.1); }
        .seat-btn.taken { background: #ef444433; color: #ef4444; cursor: not-allowed; }
        
        .main-submit { 
          width: 100%; padding: 18px; border-radius: 16px; border: none; color: white; 
          font-weight: 800; font-size: 1rem; margin-top: 30px; cursor: pointer; transition: 0.3s;
          background: ${primaryColor};
        }
        .main-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 20px ${primaryColor}44; }
      `}</style>

      {event?.fields?.map((field) => (
        <div key={field.name} className="field-row">
          <label>{field.label} {field.required && '*'}</label>
          {renderField(field)}
        </div>
      ))}

      {event?.mode === 'booking' && (
        <div className="field-row">
          <label>Select Your Seat(Seat Number are only for count first come firs seat)</label>
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
        {isPending ? "Connecting..." : isEdit ? "Update Registration" : "Confirm My Entry"}
      </button>
    </form>
  );
}