// src/api/services/reports.js
import api from "../axios";

const handleError = (error) => {
  if (error.response?.data) return error.response.data;
  return { status: "error", message: error.message || "An unexpected error occurred" };
};

/**
 * Get sales report
 * @param {Object} params - Query parameters: start_date, end_date, menu_id (all optional)
 * @returns {Promise<object>}
 */
export const getSalesReport = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.menu_id) queryParams.append("menu_id", params.menu_id);
    
    const url = `/reports/sales${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get inventory report
 * @returns {Promise<object>}
 */
export const getInventoryReport = async () => {
  try {
    const response = await api.get("/reports/inventory");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get stock movement report
 * @param {Object} params - Query parameters: start_date, end_date, stock_id (all optional)
 * @returns {Promise<object>}
 */
export const getStockMovementReport = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.stock_id) queryParams.append("stock_id", params.stock_id);
    
    const url = `/reports/stock-movement${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get order report
 * @param {Object} params - Query parameters: start_date, end_date, status (all optional)
 * @returns {Promise<object>}
 */
export const getOrderReport = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    if (params.status) queryParams.append("status", params.status);
    
    const url = `/reports/orders${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get payment report
 * @param {Object} params - Query parameters: start_date, end_date (all optional)
 * @returns {Promise<object>}
 */
export const getPaymentReport = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    
    const url = `/reports/payments${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Get user activity report
 * @param {Object} params - Query parameters: start_date, end_date (all optional)
 * @returns {Promise<object>}
 */
export const getUserActivityReport = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.start_date) queryParams.append("start_date", params.start_date);
    if (params.end_date) queryParams.append("end_date", params.end_date);
    
    const url = `/reports/user-activity${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
