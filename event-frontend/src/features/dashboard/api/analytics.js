import api from "../../../api/client";

/* ALL EVENTS COUNT */
export const getEventsRequest = async () => {
  const res = await api.get("/events");
  return res.data;
};

/* EVENT ANALYTICS */
export const getEventAnalyticsRequest = async (eventId) => {
    console.log("Fetching analytics for event ID:", eventId);
  const res = await api.get(`/events/${eventId}/analytics`);
  console.log("Analytics response:", res.data);
  return res.data;
};

/* TIMELINE */
export const getEventTimelineRequest = async (eventId) => {
  const res = await api.get(`/events/${eventId}/timeline`);
  return res.data;
};
