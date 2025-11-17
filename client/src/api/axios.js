import axios from "axios";

// Backend base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
  timeout: 15000,
});

// Request Interceptor (attach token)
API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("rr_token");

    if (token) {
      // 🔥 remove hidden chars (this avoids your Postman issue forever)
      token = token.trim().replace(/[\r\n]+/gm, "");

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (auto-logout on token failure)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403
    ) {
      localStorage.removeItem("rr_token");
      window.dispatchEvent(new Event("rr-logout")); // broadcast logout
    }
    return Promise.reject(error);
  }
);

export default API;
