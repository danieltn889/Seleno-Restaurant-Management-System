// src/api/services/orders.js
import api from "../axios";

const handleError = (error) => {
  if (error.response?.data) return error.response.data;
  return { status: "error", message: error.message || "An unexpected error occurred" };
};

// ========== Order Type ==========
export const addOrderType = async (data) => {
  try {
    const response = await api.post("/orders/type/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listOrderTypes = async () => {
  try {
    const response = await api.get("/orders/type/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateOrderType = async (data) => {
  try {
    const response = await api.put("/orders/type/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteOrderType = async (id) => {
  try {
    const response = await api.delete(`/orders/type/delete?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Special Orders ==========
export const addSpecialOrder = async (data) => {
  try {
    const response = await api.post("/orders/special/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listSpecialOrders = async () => {
  try {
    const response = await api.get("/orders/special/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateSpecialOrder = async (data) => {
  try {
    const response = await api.put("/orders/special/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteSpecialOrder = async (id) => {
  try {
    const response = await api.delete(`/orders/special/delete?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Orders ==========
export const createOrder = async (data) => {
  try {
    const response = await api.post("/orders/create", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listOrders = async () => {
  try {
    const response = await api.get("/orders/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateOrderStatus = async (data) => {
  try {
    const response = await api.put("/orders/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteOrder = async (order_id) => {
  try {
    const response = await api.delete(`/orders/delete?order_id=${order_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

// ========== Order Items ==========
export const addOrderItem = async (data) => {
  try {
    const response = await api.post("/orders/items/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const listOrderItems = async (order_id) => {
  try {
    const response = await api.get(`/orders/items/list?order_id=${order_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateOrderItem = async (data) => {
  try {
    const response = await api.put("/orders/items/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const updateOrder = async (data) => {
  try {
    const response = await api.put("/orders/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

export const deleteOrderItem = async (id) => {
  try {
    const response = await api.delete(`/orders/items/delete?id=${id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
