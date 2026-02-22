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
      socials: {
        website: "",
        instagram: "",
        twitter: "",
        linkedin: "",
        youtube: ""
      },
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
        .modal-overlay { position: fixed; inset: 0; background: rgba(10, 15, 25, 0.95); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; }
        .modal-container { background: #1e293b; width: 100%; max-width: 1300px; max-height: 94vh; border-radius: 28px; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: column; box-shadow: 0 40px 80px -15px rgba(0, 0, 0, 0.7); overflow: hidden; animation: modalScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes modalScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        
        .modal-header { padding: 1.2rem 2.5rem; background: #0f172a; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .modal-body { padding: 2rem; overflow-y: auto; display: grid; grid-template-columns: 320px 1fr 320px; gap: 2rem; background: #111827; }
        
        @media (max-width: 1150px) { .modal-body { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 850px) { .modal-body { grid-template-columns: 1fr; } }

        .section-label { display: block; font-size: 0.65rem; font-weight: 900; color: #3b82f6; text-transform: uppercase; margin-bottom: 0.8rem; letter-spacing: 0.12em; }
        .input-field { width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 10px; padding: 10px 14px; color: white; margin-bottom: 1rem; font-size: 0.85rem; transition: all 0.2s; }
        .input-field:focus { border-color: #3b82f6; outline: none; background: #1e293b; }
        
        .pill-group { display: flex; background: #070b14; padding: 4px; border-radius: 10px; margin-bottom: 1.2rem; border: 1px solid #334155; }
        .pill-option { flex: 1; position: relative; }
        .pill-option input { position: absolute; opacity: 0; width: 100%; height: 100%; cursor: pointer; }
        .pill-text { display: block; padding: 6px; text-align: center; border-radius: 7px; font-size: 0.7rem; color: #94a3b8; transition: 0.2s; cursor: pointer; }
        .pill-option input:checked + .pill-text { background: #3b82f6; color: white; font-weight: 700; }

        .preview-box { background: #070b14; border: 1px solid #334155; border-radius: 12px; margin-bottom: 0.8rem; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
        .field-card { background: rgba(30, 41, 59, 0.5); border: 1px solid #334155; border-radius: 14px; padding: 1.2rem; margin-bottom: 1rem; position: relative; }
        
        .modal-footer { padding: 1.2rem 2.5rem; background: #0f172a; border-top: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
        .btn-primary { color: white; border: none; padding: 10px 28px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: transform 0.2s; }
        .btn-primary:active { transform: scale(0.95); }
        .btn-secondary { background: transparent; color: #94a3b8; border: 1px solid #334155; padding: 10px 20px; border-radius: 10px; cursor: pointer; }
      `}</style>

      <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && close()}>
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="modal-container">
          
          <header className="modal-header">
            <h3 style={{margin:0, color: 'white', letterSpacing:'-0.5px'}}>{isEdit ? "Update Event Architecture" : "Draft New Event"}</h3>
            <button type="button" onClick={close} className="btn-secondary" style={{padding:'5px 12px'}}>✕</button>
          </header>

          <div className="modal-body">
            
            {/* COLUMN 1: VISUALS & BRANDING */}
            <div className="pane">
              <span className="section-label">Branding Assets</span>
              
              <div className="preview-box" style={{height:'60px'}}>
                {logoPreview ? <img src={logoPreview} alt="Logo" style={{height:'70%'}} /> : <span style={{fontSize:'10px', color:'#475569'}}>Logo Preview</span>}
              </div>
              <input {...register("theme.logo")} placeholder="Logo URL" className="input-field" />

              <div className="preview-box" style={{height:'100px'}}>
                {bannerPreview ? <img src={bannerPreview} alt="Banner" style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'10px', color:'#475569'}}>Banner Preview</span>}
              </div>
              <input {...register("theme.bannerImage")} placeholder="Banner Image URL" className="input-field" />

              <span className="section-label">Hero Media Preview</span>
              <div className="preview-box" style={{height:'150px', background:'#000'}}>
                {heroMediaPreview ? (
                  heroType === "video" ? (
                    <video src={heroMediaPreview} muted autoPlay loop style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  ) : (
                    <img src={heroMediaPreview} alt="Hero" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                  )
                ) : (
                  <span style={{fontSize:'10px', color:'#475569'}}>Hero {heroType} Preview</span>
                )}
              </div>
              <div className="pill-group">
                {['image', 'video'].map(t => (
                  <label key={t} className="pill-option">
                    <input type="radio" value={t} {...register("theme.heroMediaType")} />
                    <span className="pill-text">{t.toUpperCase()}</span>
                  </label>
                ))}
              </div>
              <input {...register("theme.heroMediaUrl")} placeholder="Hero URL (.mp4 or image link)" className="input-field" />

              <span className="section-label">Global Background</span>
              <div className="preview-box" style={{height:'60px'}}>
                {bgPreview ? <div style={{width:'100%', height:'100%', background:`url(${bgPreview}) center/cover`}} /> : <span style={{fontSize:'10px', color:'#475569'}}>BG Image Preview</span>}
              </div>
              <input {...register("theme.backgroundImage")} placeholder="Background Image URL" className="input-field" />
            </div>

            {/* COLUMN 2: CORE CONTENT & FORM BUILDER */}
            <div className="pane" style={{padding:'0 1rem', borderLeft:'1px solid #334155', borderRight:'1px solid #334155'}}>
              <span className="section-label">Event Essentials</span>
              <input {...register("title")} placeholder="Event Title" className="input-field" style={{fontSize:'1.1rem', fontWeight:800}} />
              <textarea {...register("description")} placeholder="Describe the event experience..." className="input-field" rows="3" />

              <span className="section-label">Theme Engine</span>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <select {...register("theme.layout")} className="input-field">
                  {["minimal", "glass", "festival", "elegant", "playful", "patriotic", "corporate", "modern", "neon", "vintage"].map(l => (
                    <option key={l} value={l}>{l.toUpperCase()} LAYOUT</option>
                  ))}
                </select>
                <select {...register("theme.animation")} className="input-field">
                  {["none", "confetti", "snowfall", "particles", "gradient", "waves", "fireworks"].map(a => (
                    <option key={a} value={a}>{a.toUpperCase()} ANIMATION</option>
                  ))}
                </select>
              </div>

              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'1.5rem'}}>
                 {[{l:'PRIMARY', k:'primaryColor'}, {l:'BG', k:'backgroundColor'}, {l:'TEXT', k:'textColor'}].map(c => (
                   <div key={c.k}>
                     <label style={{fontSize:'0.6rem', color:'#64748b', fontWeight:800}}>{c.l}</label>
                     <input type="color" {...register(`theme.${c.k}`)} style={{width:'100%', height:'35px', borderRadius:'8px', background:'#0f172a', border:'1px solid #334155', cursor:'pointer'}} />
                   </div>
                 ))}
              </div>

              <span className="section-label">Registration Form Builder</span>
              <div style={{maxHeight: '350px', overflowY: 'auto', paddingRight: '5px'}}>
                {fields.map((f, i) => (
                  <div key={f.id} className="field-card">
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px'}}>
                      <input {...register(`fields.${i}.label`)} placeholder="Field Label" className="input-field" style={{marginBottom:0}} />
                      <select {...register(`fields.${i}.type`)} className="input-field" style={{marginBottom:0}}>
                        {["text", "textarea", "number", "email", "file", "radio", "checkbox", "select", "password"].map(t => (
                          <option key={t} value={t}>{t.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>
                    {['radio', 'select', 'checkbox'].includes(watch(`fields.${i}.type`)) && (
                      <input {...register(`fields.${i}.options`)} placeholder="Options: Red, Blue, Green" className="input-field" style={{fontSize:'0.75rem'}} />
                    )}
                    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                       <label style={{fontSize:'0.75rem', color:'#94a3b8'}}><input type="checkbox" {...register(`fields.${i}.required`)} /> Required</label>
                       <button type="button" onClick={() => remove(i)} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer', fontSize:'0.75rem'}}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => append({ label: "", type: "text" })} style={{width:'100%', padding:'12px', borderRadius:'12px', border:'2px dashed #334155', background:'transparent', color:'#3b82f6', cursor:'pointer', marginTop:'10px'}}>
                + Add Dynamic Field
              </button>
            </div>

            {/* COLUMN 3: STATUS, MODE & SOCIALS */}
            <div className="pane">
              <span className="section-label">Lifecycle Status</span>
              <div className="pill-group">
                {['draft', 'published', 'closed'].map(s => (
                  <label key={s} className="pill-option">
                    <input type="radio" value={s} {...register("status")} />
                    <span className="pill-text">{s.toUpperCase()}</span>
                  </label>
                ))}
              </div>

              <span className="section-label">Event Mode</span>
              <div className="pill-group">
                {['showcase', 'submission', 'booking'].map(m => (
                  <label key={m} className="pill-option">
                    <input type="radio" value={m} {...register("mode")} />
                    <span className="pill-text">{m.toUpperCase()}</span>
                  </label>
                ))}
              </div>

              {selectedMode === 'booking' && (
                <div style={{marginBottom:'2rem', padding:'15px', background:'rgba(59, 130, 246, 0.05)', borderRadius:'14px', border: `1px solid ${primaryColor}44`}}>
                   <span className="section-label">Booking Settings</span>
                   <input type="number" {...register("booking.capacity")} placeholder="Max Capacity" className="input-field" />
                </div>
              )}

              <span className="section-label">Social Media Presence</span>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                 <input {...register("socials.website")} placeholder="Website" className="input-field" />
                 <input {...register("socials.instagram")} placeholder="Instagram" className="input-field" />
                 <input {...register("socials.twitter")} placeholder="Twitter" className="input-field" />
                 <input {...register("socials.linkedin")} placeholder="LinkedIn" className="input-field" />
              </div>
              <input {...register("socials.youtube")} placeholder="YouTube Link" className="input-field" />
            </div>

          </div>

          <footer className="modal-footer">
            <div style={{color:'#475569', fontSize:'0.7rem', fontWeight:600}}>
              {isEdit ? `EDITING: ${event._id}` : "NEW EVENT ARCHIVE"}
            </div>
            <div style={{display:'flex', gap:'12px'}}>
              <button type="button" onClick={close} className="btn-secondary">Cancel</button>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ backgroundColor: primaryColor, boxShadow: `0 10px 20px ${primaryColor}44` }}
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