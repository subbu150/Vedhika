export default function EventHero({ theme, title, description }) {
  // Use fallbacks for every property
  const primaryColor = theme?.primaryColor || "#3b82f6";
  const heroType = theme?.heroMediaType || "image";
  const heroUrl = theme?.heroMediaUrl;

  return (
    <section style={{
      position: 'relative',
      height: '50vh',
      minHeight: '350px',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: theme?.textColor || '#fff'
    }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: -1, background: theme?.backgroundColor || '#0f172a' }}>
        {heroUrl ? (
           heroType === 'video' ? (
            <video src={heroUrl} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <img src={heroUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )
        ) : null}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))' }} />
      </div>

      <div style={{ textAlign: 'center', zIndex: 1, padding: '20px' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{title || "Loading..."}</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.8 }}>{description}</p>
      </div>
    </section>
  );
}