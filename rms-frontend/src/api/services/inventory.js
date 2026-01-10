// src/api/services/inventory.js
import api from "../axios";

const handleError = (error) => {
  if (error.response?.data) return error.response.data;
  return { status: "error", message: error.message || "An unexpected error occurred" };
};

// ========== Stock Category ==========
export const addStockCategory = async (data) => {
  try {
    const response = await api.post("/inventory/stock-category/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockCategories = async () => {
  try {
    const response = await api.get("/inventory/stock-category/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockCategory = async (data) => {
  try {
    const response = await api.put("/inventory/stock-category/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockCategory = async (stockcat_id) => {
  try {
    const response = await api.delete(`/inventory/stock-category/delete?stockcat_id=${stockcat_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock Item Category Group ==========
export const addStockGroup = async (data) => {
  try {
    const response = await api.post("/inventory/stock-group/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockGroups = async () => {
  try {
    const response = await api.get("/inventory/stock-group/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockGroup = async (data) => {
  try {
    const response = await api.put("/inventory/stock-group/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockGroup = async (group_id) => {
  try {
    const response = await api.delete("/inventory/stock-group/delete", { data: { group_id } });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock Item Category ==========
export const addStockItemCategory = async (data) => {
  try {
    const response = await api.post("/inventory/stock-item-category/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockItemCategories = async () => {
  try {
    const response = await api.get("/inventory/stock-item-category/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockItemCategory = async (data) => {
  try {
    const response = await api.put("/inventory/stock-item-category/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockItemCategory = async (id) => {
  try {
    const response = await api.delete("/inventory/stock-item-category/delete", { data: { id } });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stocks ==========
export const addStock = async (data) => {
  try {
    const response = await api.post("/inventory/stocks/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStocks = async () => {
  try {
    const response = await api.get("/inventory/stocks/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStock = async (data) => {
  try {
    const response = await api.put("/inventory/stocks/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStock = async (stock_id) => {
  try {
    const response = await api.delete("/inventory/stocks/delete", { data: { stock_id } });
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock IN ==========
export const addStockIn = async (data) => {
  try {
    const response = await api.post("/inventory/stockin/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockIn = async () => {
  try {
    const response = await api.get("/inventory/stockin/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockIn = async (data) => {
  try {
    const response = await api.put("/inventory/stockin/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockIn = async (stockin_id) => {
  try {
    const response = await api.delete(`/inventory/stockin/delete?stockin_id=${stockin_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Stock OUT ==========
export const addStockOut = async (data) => {
  try {
    const response = await api.post("/inventory/stockout/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listStockOut = async () => {
  try {
    const response = await api.get("/inventory/stockout/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateStockOut = async (data) => {
  try {
    const response = await api.put("/inventory/stockout/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteStockOut = async (stockout_id) => {
  try {
    const response = await api.delete(`/inventory/stockout/delete?stockout_id=${stockout_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
