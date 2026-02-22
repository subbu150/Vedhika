import CertificateDownload from "./CertificateDownload.jsx";
export default function Status({text,flag,event,data}) {
    return (  
        <> 
        <div className={`thanks-form ${flag ? 'success' : 'error'}`}>
            <h2>{flag ? "Thank you for your submission!" : "Submission failed!"}</h2>
            <p>{text}</p>
        </div>

        
        {flag && data && event &&

    <div className="card">
      <h3>🎉 Submission successful</h3>

      <CertificateDownload
        eventId={event._id}
        submissionId={data._id}
      />
    </div>
}

    
        </>
    );
}