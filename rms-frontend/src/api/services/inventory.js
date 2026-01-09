// src/api/services/inventory.js
import api from "../axios";

const handleError = (error) => {
  if (error.response?.data) return error.response.data;
  return { status: "error", message: error.message || "An unexpected error occurred" };
};

// ========== Stock Category ==========
export const addStockCategory = async (data) => {
  try {
    const response = await api.post("/inventory/stock-category/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockCategories = async () => {
  try {
    const response = await api.get("/inventory/stock-category/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockCategory = async (data) => {
  try {
    const response = await api.put("/inventory/stock-category/update.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockCategory = async (stockcat_id) => {
  try {
    const response = await api.delete(`/inventory/stock-category/delete.php?stockcat_id=${stockcat_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock Item Category Group ==========
export const addStockGroup = async (data) => {
  try {
    const response = await api.post("/inventory/stock-group/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockGroups = async () => {
  try {
    const response = await api.get("/inventory/stock-group/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockGroup = async (data) => {
  try {
    const response = await api.put("/inventory/stock-group/update.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockGroup = async (group_id) => {
  try {
    const response = await api.delete(`/inventory/stock-group/delete.php?group_id=${group_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock Item Category ==========
export const addStockItemCategory = async (data) => {
  try {
    const response = await api.post("/inventory/stock-item-category/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockItemCategories = async () => {
  try {
    const response = await api.get("/inventory/stock-item-category/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockItemCategory = async (data) => {
  try {
    const response = await api.put("/inventory/stock-item-category/update.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockItemCategory = async (id) => {
  try {
    const response = await api.delete(`/inventory/stock-item-category/delete.php?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stocks ==========
export const addStock = async (data) => {
  try {
    const response = await api.post("/inventory/stocks/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStocks = async () => {
  try {
    const response = await api.get("/inventory/stocks/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStock = async (data) => {
  try {
    const response = await api.put("/inventory/stocks/update.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStock = async (stock_id) => {
  try {
    const response = await api.delete(`/inventory/stocks/delete.php?stock_id=${stock_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock IN ==========
export const addStockIn = async (data) => {
  try {
    const response = await api.post("/inventory/stockin/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockIn = async () => {
  try {
    const response = await api.get("/inventory/stockin/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock OUT ==========
export const addStockOut = async (data) => {
  try {
    const response = await api.post("/inventory/stockout/add.php", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockOut = async () => {
  try {
    const response = await api.get("/inventory/stockout/list.php");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
