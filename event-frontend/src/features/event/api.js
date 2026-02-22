import api from "../../api/client";

/* ---------------- GET ---------------- */
export const getEventsRequest = async () => {
  const res = await api.get("/events");
  const data = res.data;

  return Array.isArray(data) ? data : [data];
};

/* ---------------- CREATE ---------------- */
export const createEventRequest = async (data) => {
  const res = await api.post("/events", data);
  return res.data;
};

/* ---------------- UPDATE ---------------- */
export const updateEventRequest = async ({ id, data }) => {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
};

/* ---------------- DELETE ---------------- */
export const deleteEventRequest = async (id) => {
  await api.delete(`/events/${id}`);
};

/* ---------------- PUBLISH ---------------- */
export const publishEventRequest = async (id) => {
  const res = await api.patch(`/events/${id}/publish`);
  return res.data;
};
export const getEventRequest = async (id) => {
  const res = await api.get(`/events/${id}`);
  console.log("Requested");
  return res.data;
};
export const submitEventRequest = async (eventId, formData) => {
  const res = await api.post(
    `/events/${eventId}/submissions`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  console.log("Submission response:", res);
 
  return res.data;
};
export const getEventsRequests=async ()=>{
    const res=await api.get("/events");

    return res.data;
}


export const getMySubmissionRequest = async (eventId) => {
  const res = await api.get(`/events/${eventId}/submissions/me`);
  return res.data;
};

export const updateSubmissionRequest = async (eventId, fd) => {
  const res = await api.put(
    `/events/${eventId}/submissions/me`,
    fd,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};



/* delete */
export const deleteSubmissionRequest = async (eventId) => {
  const res = await api.delete(`/events/${eventId}/submissions/me`);
  return res.data;
};

export const getEventShowcaseRequest = (id) =>
  api.get(`/events/${id}/showcase`).then(r => r.data);

