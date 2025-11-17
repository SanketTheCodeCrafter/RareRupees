import API from "./axios";

export const loginAdmin = async (username, password) => {
  const res = await API.post("/auth/login", { username, password });
  return res.data;
};
