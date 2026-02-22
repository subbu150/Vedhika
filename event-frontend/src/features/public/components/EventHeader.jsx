// import CertificateDownload from "./CertificateDownload";

// export default function EventHeader({ event, submission, onEdit, onlyDownload = false }) {
//   if (onlyDownload) {
//     return <CertificateDownload eventId={event._id} submissionId={submission?._id} />;
//   }

//   return (
//     <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
//       <div>
//         <h1 style={{ fontSize: '2rem', margin: 0 }}>{event.title}</h1>
//         <p style={{ opacity: 0.6 }}>{event.description}</p>
//       </div>

//       <div className="header-actions" style={{ display: 'flex', gap: '10px' }}>
//         {submission && (
//           <button className="btn-secondary" onClick={onEdit} style={{ width: 'auto' }}>
//             Edit
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
import CertificateDownload from "./CertificateDownload";

import CertificateDownload from "./CertificateDownload";

// This is the component throwing the error
export default function EventHeader({
  event,
  submission,
  onEdit,
}) {
  // CRITICAL FIX: If event is undefined, return null so it doesn't try to read .title
  if (!event) return null;

  return (
    <div className="event-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div className="event-header-left">
        {/* Safe access using optional chaining */}
        <h2 style={{ margin: 0 }}>{event?.title || "Event"}</h2>
      </div>

      <div className="event-header-actions" style={{ display: 'flex', gap: '10px' }}>
        {!submission && (
          <button className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>
            Register
          </button>
        )}

        {submission && (
          <>
            <button
              className="btn-secondary"
              onClick={onEdit}
              style={{ padding: '8px 16px', borderRadius: '8px' }}
            >
              Edit
            </button>

            {/* Ensure event._id exists before passing */}
            {event?._id && (
              <CertificateDownload
                eventId={event._id}
                submissionId={submission?._id}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}