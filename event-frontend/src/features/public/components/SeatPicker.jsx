import React, { useState } from "react";

export default function SeatPicker({ event }) {
  const [selected, setSelected] = useState(null);
  const theme = event.theme;
  const total = event.booking?.capacity || 40;
  const bookedCount = event.booking?.seatsBooked || 0;

  const seats = Array.from({ length: total }, (_, i) => ({
    id: i + 1,
    isBooked: i < bookedCount
  }));

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
         <div style={{ width: '100%', height: '4px', background: '#334155', marginBottom: '10px', borderRadius: '10px' }}></div>
         <span style={{ fontSize: '0.7rem', color: '#64748b' }}>FRONT / STAGE</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {seats.map(s => (
          <div
            key={s.id}
            onClick={() => !s.isBooked && setSelected(s.id)}
            style={{
              height: '50px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              cursor: s.isBooked ? 'not-allowed' : 'pointer',
              backgroundColor: s.isBooked ? '#ef4444' : selected === s.id ? theme.primaryColor : '#1e293b',
              color: s.isBooked ? 'rgba(255,255,255,0.3)' : '#fff',
              border: selected === s.id ? '2px solid white' : '1px solid rgba(255,255,255,0.1)',
              transition: '0.2s'
            }}
          >
            {s.id}
          </div>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '15px', textAlign: 'center' }}>
          <p>Selected Seat: <strong style={{color: theme.primaryColor}}>{selected}</strong></p>
          <button style={{ background: theme.primaryColor, color: '#fff', border: 'none', width: '100%', padding: '15px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer' }}>
            CONFIRM BOOKING
          </button>
        </div>
      )}
    </div>
  );
}