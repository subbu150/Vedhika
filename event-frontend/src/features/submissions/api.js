import api from "../../api/client";

/* GET ALL SUBMISSIONS */
export const getSubmissionsRequest = async (eventId, params) => {
  const res = await api.get(`/events/${eventId}/submissions`, {
    params,
  });
  console.log(res.data);
  return res.data;
};


/* UPDATE STATUS */
export const updateSubmissionStatusRequest = async ({
  eventId,
  submissionId,
  status,
}) => {
  const res = await api.patch(
    `/events/${eventId}/submissions/${submissionId}/status`,
    { status }
  );

  return res.data;
};
export const searchEventsRequest = async (search) => {
  const res = await api.get(`/events?search=${search}`);
  console.log("Search Results:", res.data);
  return res.data;
};


