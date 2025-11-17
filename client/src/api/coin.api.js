import API from "./axios";

// GET all coins (public)
export const fetchCoinsAPI = async () => {
  const res = await API.get("/coins");
  return res.data;
};

// GET single coin
export const fetchCoinAPI = async (id) => {
  const res = await API.get(`/coins/${id}`);
  return res.data;
};

// CREATE coin (admin)
export const createCoinAPI = async (formData) => {
  const res = await API.post("/coins", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// UPDATE coin (admin)
export const updateCoinAPI = async (id, formData) => {
  const res = await API.put(`/coins/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE coin (admin)
export const deleteCoinAPI = async (id) => {
  const res = await API.delete(`/coins/${id}`);
  return res.data;
};
