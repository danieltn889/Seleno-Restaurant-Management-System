// src/api/services/menu.js
import api from "../axios";

const handleError = (error) => {
  if (error.response?.data) return error.response.data;
  return { status: "error", message: error.message || "An unexpected error occurred" };
};

// ========== Menu Category Groups ==========
export const addMenuCategoryGroup = async (data) => {
  try {
    const response = await api.post("/menu/category-group/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listMenuCategoryGroups = async () => {
  try {
    const response = await api.get("/menu/category-group/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateMenuCategoryGroup = async (data) => {
  try {
    const response = await api.put("/menu/category-group/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMenuCategoryGroup = async (id) => {
  try {
    const response = await api.delete(`/menu/category-group/delete?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Menu Category ==========
export const addMenuCategory = async (data) => {
  try {
    const response = await api.post("/menu/category/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listMenuCategories = async () => {
  try {
    const response = await api.get("/menu/category/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateMenuCategory = async (data) => {
  try {
    const response = await api.put("/menu/category/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMenuCategory = async (id) => {
  try {
    const response = await api.delete(`/menu/category/delete?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Menu ==========
export const addMenu = async (data) => {
  try {
    const response = await api.post("/menu/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listMenus = async () => {
  try {
    const response = await api.get("/menu/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateMenu = async (data) => {
  try {
    const response = await api.put("/menu/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMenu = async (id) => {
  try {
    const response = await api.delete(`/menu/delete?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Menu Items (Ingredients) ==========
export const addMenuItem = async (data) => {
  try {
    const response = await api.post("/menu/items/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listMenuItems = async () => {
  try {
    const response = await api.get("/menu/items/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateMenuItem = async (data) => {
  try {
    const response = await api.put("/menu/items/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteMenuItem = async (id) => {
  try {
    const response = await api.delete(`/menu/items/delete?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
