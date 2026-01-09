// src/api/services/users.js
import api from "../axios";

/**
 * Add a new user
 * @param {Object} userData - User data including firstname, lastname, email, user_role, user_status, user_phone
 * @returns {Promise<object>}
 */
export const addUser = async (userData) => {
  try {
    const response = await api.post("/users/add.php", userData);
    return response.data;
  } catch (error) {
    console.error("Add user error:", error);
    return handleError(error);
  }
};

/**
 * Get all users
 * @returns {Promise<object>}
 */
export const listUsers = async () => {
  try {
    const response = await api.get("/users/list.php");
    return response.data;
  } catch (error) {
    console.error("List users error:", error);
    return handleError(error);
  }
};

/**
 * Update user details
 * @param {Object} userData - User data including userid and fields to update
 * @returns {Promise<object>}
 */
export const updateUser = async (userData) => {
  try {
    const response = await api.put("/users/update.php", userData);
    return response.data;
  } catch (error) {
    console.error("Update user error:", error);
    return handleError(error);
  }
};

/**
 * Delete a user
 * @param {number} userid - User ID to delete
 * @returns {Promise<object>}
 */
export const deleteUser = async (userid) => {
  try {
    const response = await api.delete(`/users/delete.php?userid=${userid}`);
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error);
    return handleError(error);
  }
};

// Helper function to handle errors consistently
const handleError = (error) => {
  if (error.response?.data) {
    return error.response.data;
  }
  return {
    status: "error",
    message: error.message || "An unexpected error occurred"
  };
};
