import axios from "axios";

// Backend base URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: false,
  timeout: 40000, // Increased default timeout to 40s
});

// Request Interceptor (attach token & dynamic timeout)
API.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("rr_token");

    if (token) {
      // 🔥 remove hidden chars (this avoids your Postman issue forever)
      token = token.trim().replace(/[\r\n]+/gm, "");

      config.headers.Authorization = `Bearer ${token}`;
    }

    // Dynamic timeout based on payload size (approx 1s per 0.5MB)
    // Only applies if data is FormData (file uploads)
    if (config.data instanceof FormData) {
      let totalSize = 0;
      for (let pair of config.data.entries()) {
        if (pair[1] instanceof File || pair[1] instanceof Blob) {
          totalSize += pair[1].size;
        }
      }

      if (totalSize > 0) {
        const sizeInMB = totalSize / (1024 * 1024);
        // Base 40s + 2s per MB, capped at 90s
        const dynamicTimeout = Math.min(40000 + (sizeInMB * 2000), 90000);
        config.timeout = dynamicTimeout;
      }
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
