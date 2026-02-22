import api from "../../api/client";

/* download certificate */
export const downloadCertificateRequest = async ({
  eventId,
  submissionId,
}) => {
  const res = await api.get(
    `/events/${eventId}/certificates/${submissionId}/download`,
    {
      responseType: "blob", 
    }
  );
  console.log("Download response:", res);

  return res.data;
};
