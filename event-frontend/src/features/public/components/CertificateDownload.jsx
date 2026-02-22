import { useMutation } from "@tanstack/react-query";
import { downloadCertificateRequest } from "../../Certificates/api";

export default function CertificateDownload({
  eventId,
  submissionId,
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: downloadCertificateRequest,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "certificate.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    },
  });

  return (
    <button
      className="btn-primary"
      disabled={isPending}
      onClick={() =>
        mutate({ eventId, submissionId })
      }
    >
      {isPending ? "Preparing..." : "Download Certificate"}
    </button>
  );
}
