import api from "./api";

export const fetchDashboardSummary = async () => {
  const res = await api.get("/dashboard/summary");
  return res.data;
};
