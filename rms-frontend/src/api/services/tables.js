// src/api/services/tables.js
import api from "../axios";

const handleError = (error) => {
  if (error.response?.data) return error.response.data;
  return { status: "error", message: error.message || "An unexpected error occurred" };
};

// ========== Table Groups ==========
export const addTableGroup = async (data) => {
  try {
    const response = await api.post("/tables/group/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listTableGroups = async () => {
  try {
    const response = await api.get("/tables/group/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateTableGroup = async (data) => {
  try {
    const response = await api.put("/tables/group/update.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTableGroup = async (id) => {
  try {
    const response = await api.delete(`/tables/group/delete.php?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Tables ==========
export const addTable = async (data) => {
  try {
    const response = await api.post("/tables/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listTables = async () => {
  try {
    const response = await api.get("/tables/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateTable = async (data) => {
  try {
    const response = await api.put("/tables/update.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteTable = async (id) => {
  try {
    const response = await api.delete(`/tables/delete.php?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
