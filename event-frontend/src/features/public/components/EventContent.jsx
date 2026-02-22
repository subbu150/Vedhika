export default function EventContent({ event }) {
  return (
    <div className="event-content">

      <h3>About Event</h3>
      <p>{event.description}</p>

      {event.mode === "booking" && (
        <p>
          Seats: {event.booking?.seatsBooked}/
          {event.booking?.capacity}
        </p>
      )}

    </div>
  );
}
