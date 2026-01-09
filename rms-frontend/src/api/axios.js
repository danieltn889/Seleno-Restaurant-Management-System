// src/api/axios.js
import axios from "axios";
import { API_BASE_URL } from "./config.js";

const api = axios.create({
  baseURL: API_BASE_URL, // Seleno Restaurant Management System API
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout to catch hanging requests
  withCredentials: true, // Enable sending cookies for session-based auth
});

// Automatically attach token if it exists
api.interceptors.request.use(
  (config) => {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: global response interceptor for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Axios error:", error);
    
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Clear user data and redirect to login
      localStorage.removeItem("authUser");
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;
