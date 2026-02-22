import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEventRequest, updateEventRequest } from "../api";

export default function EventModal({ close, event }) {
  const qc = useQueryClient();
  const isEdit = !!event;

  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: event || {
      title: "",
      description: "",
      mode: "showcase",
      status: "draft",
      fields: [],
      theme: {
        preset: "default",
        primaryColor: "#3b82f6",
        backgroundColor: "#0f172a",
        textColor: "#ffffff",
        animation: "none",
        layout: "minimal",
        bannerImage: "",
        backgroundImage: "",
        logo: "",
        heroMediaType: "image",
        heroMediaUrl: ""
      },
      socials: { website: "", instagram: "", twitter: "", linkedin: "", youtube: "" },
      booking: { capacity: 0, seatsBooked: 0, seatLabels: [] }
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "fields" });

  // Watchers for Real-time Previews
  const selectedMode = watch("mode");
  const bannerPreview = watch("theme.bannerImage");
  const logoPreview = watch("theme.logo");
  const bgPreview = watch("theme.backgroundImage");
  const heroMediaPreview = watch("theme.heroMediaUrl");
  const heroType = watch("theme.heroMediaType");
  const primaryColor = watch("theme.primaryColor");

  const mutation = useMutation({
    mutationFn: (data) => {
      const cleanedFields = (data.fields || [])
        .filter((f) => f.label && f.label.trim() !== "")
        .map((f, index) => {
          const safeName = f.name || f.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
          return {
            ...f,
            label: f.label.trim(),
            name: safeName || `field_${index}`,
            options: typeof f.options === "string" ? f.options.split(",").map((o) => o.trim()) : f.options,
          };
        });

      const formattedData = { ...data, fields: cleanedFields };
      return isEdit ? updateEventRequest({ id: event._id, data: formattedData }) : createEventRequest(formattedData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      close();
    },
  });

  return (
    <>
      <style>{`
        .modal-overlay { 
          position: fixed; inset: 0; background: rgba(7, 11, 20, 0.98); 
          backdrop-filter: blur(12px); display: flex; align-items: center; 
          justify-content: center; z-index: 10000; padding: 0;
        }
        
        .modal-container { 
          background: #111827; width: 100%; max-width: 1300px; height: 100%; 
          display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 40px 80px -15px rgba(0, 0, 0, 0.7);
        }

        @media (min-width: 768px) {
          .modal-container { height: 94vh; border-radius: 28px; border: 1px solid rgba(255, 255, 255, 0.1); }
          .modal-overlay { padding: 20px; }
        }

        .modal-header { 
          padding: 1rem 1.5rem; background: #0f172a; 
          border-bottom: 1px solid #334155; display: flex; 
          justify-content: space-between; align-items: center; 
        }

        .modal-body { 
          flex: 1; overflow-y: auto; display: flex; flex-direction: column; 
          background: #0b0f1a; padding: 1.25rem; gap: 2rem;
        }

        @media (min-width: 1024px) {
          .modal-body { flex-direction: row; padding: 2rem; }
          .pane { flex: 1; min-width: 0; }
          .pane-center { flex: 1.5; border-left: 1px solid #334155; border-right: 1px solid #334155; padding: 0 1.5rem; }
        }

        .section-label { 
          display: block; font-size: 0.65rem; font-weight: 900; color: #3b82f6; 
          text-transform: uppercase; margin-bottom: 0.8rem; letter-spacing: 0.12em; 
        }

        .input-field { 
          width: 100%; background: #070b14; border: 1px solid #334155; 
          border-radius: 10px; padding: 12px; color: white; margin-bottom: 1rem; 
          font-size: 16px; /* Prevents iOS auto-zoom */
          box-sizing: border-box; transition: all 0.2s;
        }
        .input-field:focus { border-color: ${primaryColor}; outline: none; background: #1e293b; }

        .pill-group { 
          display: flex; flex-wrap: wrap; background: #070b14; padding: 4px; 
          border-radius: 10px; margin-bottom: 1.2rem; border: 1px solid #334155; 
        }
        .pill-option { flex: 1; min-width: 80px; position: relative; }
        .pill-option input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
        .pill-text { 
          display: block; padding: 8px 4px; text-align: center; border-radius: 7px; 
          font-size: 0.7rem; color: #94a3b8; transition: 0.2s; 
        }
        .pill-option input:checked + .pill-text { background: ${primaryColor}; color: white; font-weight: 700; }

        .preview-box { 
          background: #000; border: 1px solid #334155; border-radius: 12px; 
          margin-bottom: 0.8rem; display: flex; align-items: center; 
          justify-content: center; overflow: hidden;
        }

        .field-card { 
          background: rgba(30, 41, 59, 0.4); border: 1px solid #334155; 
          border-radius: 14px; padding: 1rem; margin-bottom: 1rem; 
        }

        /* FOOTER & BUTTONS */
        .modal-footer { 
          padding: 1.25rem; background: #0f172a; 
          border-top: 1px solid #334155; display: flex; 
          flex-direction: column; gap: 12px;
        }

        .footer-actions { display: flex; gap: 10px; width: 100%; }

        .btn-primary, .btn-secondary { 
          flex: 1; height: 48px; border-radius: 12px; font-weight: 700; 
          display: flex; align-items: center; justify-content: center; 
          cursor: pointer; transition: 0.2s; font-size: 0.9rem;
        }

        .btn-primary { color: white; border: none; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-secondary { background: transparent; color: #94a3b8; border: 1px solid #334155; }

        @media (min-width: 640px) {
          .modal-footer { flex-direction: row; justify-content: space-between; }
          .footer-actions { width: auto; min-width: 300px; }
          .btn-primary, .btn-secondary { flex: none; padding: 0 30px; }
        }

        @media (max-width: 350px) {
          .footer-actions { flex-direction: column; }
          .btn-primary, .btn-secondary { width: 100%; }
        }

        .grid-half { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      `}</style>

      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="modal-container">
          
          <header className="modal-header">
            <h3 style={{margin:0, color: 'white', fontSize: '1.1rem'}}>{isEdit ? "Update Event" : "Create Event"}</h3>
            <button type="button" onClick={close} className="btn-secondary" style={{padding:'4px 12px', height: '32px'}}>✕</button>
          </header>

          <div className="modal-body">
            
            {/* COLUMN 1: VISUALS */}
            <div className="pane">
              <span className="section-label">Branding</span>
              <div className="preview-box" style={{height:'60px'}}>
                {logoPreview ? <img src={logoPreview} alt="Logo" style={{height:'70%'}} /> : <span style={{fontSize:'10px', color:'#475569'}}>Logo Preview</span>}
              </div>
              <input {...register("theme.logo")} placeholder="Logo URL" className="input-field" />

              <div className="preview-box" style={{height:'100px'}}>
                {bannerPreview ? <img src={bannerPreview} alt="Banner" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'10px', color:'#475569'}}>Banner Preview</span>}
              </div>
              <input {...register("theme.bannerImage")} placeholder="Banner URL" className="input-field" />

              <span className="section-label">Hero Media</span>
              <div className="preview-box" style={{height:'150px'}}>
                {heroMediaPreview ? (
                  heroType === "video" ? (
                    <video src={heroMediaPreview} muted autoPlay loop style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  ) : (
                    <img src={heroMediaPreview} alt="Hero" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  )
                ) : <span style={{fontSize:'10px', color:'#475569'}}>Media Preview</span>}
              </div>
              <div className="pill-group">
                {['image', 'video'].map(t => (
                  <label key={t} className="pill-option">
                    <input type="radio" value={t} {...register("theme.heroMediaType")} />
                    <span className="pill-text">{t.toUpperCase()}</span>
                  </label>
                ))}
              </div>
              <input {...register("theme.heroMediaUrl")} placeholder="Hero URL" className="input-field" />
            </div>

            {/* COLUMN 2: CORE CONTENT */}
            <div className="pane pane-center">
              <span className="section-label">Information</span>
              <input {...register("title")} placeholder="Event Title" className="input-field" style={{fontSize:'1.1rem', fontWeight:800}} />
              <textarea {...register("description")} placeholder="Description..." className="input-field" rows="3" />

              <span className="section-label">Theme Engine</span>
              <div className="grid-half">
                <select {...register("theme.layout")} className="input-field">
                  {["minimal", "glass", "festival", "elegant", "modern", "neon"].map(l => (
                    <option key={l} value={l}>{l.toUpperCase()} LAYOUT</option>
                  ))}
                </select>
                <select {...register("theme.animation")} className="input-field">
                  {["none", "confetti", "snowfall", "particles", "waves"].map(a => (
                    <option key={a} value={a}>{a.toUpperCase()} ANIMATION</option>
                  ))}
                </select>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'8px', marginBottom:'1.5rem'}}>
                 {[{l:'PRIMARY', k:'primaryColor'}, {l:'BG', k:'backgroundColor'}, {l:'TEXT', k:'textColor'}].map(c => (
                   <div key={c.k}>
                     <label style={{fontSize:'0.6rem', color:'#64748b', fontWeight:800}}>{c.l}</label>
                     <input type="color" {...register(`theme.${c.k}`)} style={{width:'100%', height:'35px', borderRadius:'8px', background:'#0f172a', border:'1px solid #334155', cursor:'pointer'}} />
                   </div>
                 ))}
              </div>

              <span className="section-label">Form Builder</span>
              <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                {fields.map((f, i) => (
                  <div key={f.id} className="field-card">
                    <div className="grid-half" style={{marginBottom:'10px'}}>
                      <input {...register(`fields.${i}.label`)} placeholder="Field Label" className="input-field" style={{marginBottom:0}} />
                      <select {...register(`fields.${i}.type`)} className="input-field" style={{marginBottom:0}}>
                        {["text", "textarea", "number", "email", "file", "radio", "select"].map(t => (
                          <option key={t} value={t}>{t.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" onClick={() => remove(i)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontSize:'0.75rem'}}>Remove Field</button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => append({ label: "", type: "text" })} style={{width:'100%', padding:'12px', borderRadius:'12px', border:'2px dashed #334155', background:'transparent', color:'#3b82f6', cursor:'pointer', marginTop:'10px'}}>
                + Add Dynamic Field
              </button>
            </div>

            {/* COLUMN 3: STATUS & SOCIALS */}
            <div className="pane">
              <span className="section-label">Settings</span>
              <div className="pill-group">
                {['draft', 'published', 'closed'].map(s => (
                  <label key={s} className="pill-option">
                    <input type="radio" value={s} {...register("status")} />
                    <span className="pill-text">{s.toUpperCase()}</span>
                  </label>
                ))}
              </div>

              <span className="section-label">Mode</span>
              <div className="pill-group">
                {['showcase', 'submission', 'booking'].map(m => (
                  <label key={m} className="pill-option">
                    <input type="radio" value={m} {...register("mode")} />
                    <span className="pill-text">{m.toUpperCase()}</span>
                  </label>
                ))}
              </div>

              {selectedMode === 'booking' && (
                <div style={{marginBottom:'1.5rem'}}>
                   <span className="section-label">Capacity</span>
                   <input type="number" {...register("booking.capacity")} className="input-field" />
                </div>
              )}

              <span className="section-label">Socials</span>
              <div className="grid-half">
                 <input {...register("socials.website")} placeholder="Web" className="input-field" />
                 <input {...register("socials.instagram")} placeholder="Insta" className="input-field" />
              </div>
              <input {...register("socials.youtube")} placeholder="YouTube Link" className="input-field" />
            </div>

          </div>

          <footer className="modal-footer">
            <div style={{color:'#475569', fontSize:'0.7rem', fontWeight:600, textAlign: 'center'}}>
              {isEdit ? `EDITING: ${event._id.slice(-8)}` : "NEW EVENT ARCHIVE"}
            </div>
            
            <div className="footer-actions">
              <button type="button" onClick={close} className="btn-secondary">Cancel</button>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ backgroundColor: primaryColor, boxShadow: `0 8px 20px ${primaryColor}33` }}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Syncing..." : isEdit ? "Update Event" : "Launch Event"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </>
  );
}