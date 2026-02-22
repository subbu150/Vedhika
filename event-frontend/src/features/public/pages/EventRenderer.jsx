export default function EventRenderer({ event, children }) {
  const { bannerImage, logo } = event;

  return (
    <div className="event-container">

      {logo && (
        <img src={logo} alt="logo" style={{ height: 50, marginBottom: 20 }} />
      )}

      {bannerImage && (
        <img src={bannerImage} alt="banner" className="event-banner" />
      )}

      <h1>{event.title}</h1>
      <p>{event.description}</p>

      {children}
    </div>
  );
}
