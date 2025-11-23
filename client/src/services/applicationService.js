import api from "./api";

export const fetchApplications = async (params = {}) => {
  const res = await api.get("/applications", { params });
  return res.data;
};

export const createApplication = async (payload) => {
  const res = await api.post("/applications", payload);
  return res.data;
};

export const updateApplication = async (id, payload) => {
  const res = await api.put(`/applications/${id}`, payload);
  return res.data;
};

export const deleteApplication = async (id) => {
  const res = await api.delete(`/applications/${id}`);
  return res.data;
};

export const addTimelineEntry = (applicationId, payload) =>
  api.post(`/applications/${applicationId}/timeline`, payload);

export const deleteTimelineEntry = (applicationId, eventId) =>
  api.delete(`/applications/${applicationId}/timeline/${eventId}`);