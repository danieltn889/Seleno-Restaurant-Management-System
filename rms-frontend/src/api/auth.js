// src/api/auth.js
import api from "./axios";

/**
 * Login request to Seleno Backend
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>}
 */
export async function loginRequest(email, password) {
  try {
    const response = await api.post("/login", {
      email,
      password
    });
    
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    if (error.response?.data) {
      return error.response.data;
    }
    return { 
      status: "error", 
      message: error.message || "Network error. Please check your connection." 
    };
  }
}

/**
 * Forgot password request
 * @param {string} email
 * @returns {Promise<object>}
 */
export async function forgotPasswordRequest(email) {
  try {
    const response = await api.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", error);
    if (error.response?.data) {
      return error.response.data;
    }
    return { 
      status: "error", 
      message: error.message || "Network error. Please try again." 
    };
  }
}

/**
 * Validate authentication token
 * @param {string} token
 * @returns {Promise<object>}
 */
export async function validateToken(token) {
  try {
    const response = await api.post("/validate-token", {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Token validation error:", error);
    if (error.response?.data) {
      return error.response.data;
    }
    return { 
      status: "error", 
      message: error.message || "Token validation failed" 
    };
  }
}
