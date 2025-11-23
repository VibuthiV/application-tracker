import api from "./api";

export const getProfile = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put("/user/me", payload);
  return res.data;
};
