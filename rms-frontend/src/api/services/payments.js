// src/api/services/payments.js
import api from "../axios";

const handleError = (error) => {
  if (error.response?.data) return error.response.data;
  return { status: "error", message: error.message || "An unexpected error occurred" };
};

/**
 * Add a payment for an order
 * @param {Object} data - Payment data including order_id, payment_method, amount_paid
 * @returns {Promise<object>}
 */
export const addPayment = async (data) => {
  try {
    const response = await api.post("/payments/add", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Check payment status for an order
 * @param {number} order_id - Order ID to check payment status
 * @returns {Promise<object>}
 */
export const checkPaymentStatus = async (order_id) => {
  try {
    const response = await api.get(`/payments/status?order_id=${order_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * List all payments
 * @returns {Promise<object>}
 */
export const listPayments = async () => {
  try {
    const response = await api.get("/payments/list");
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Update payment details
 * @param {Object} data - Payment data to update
 * @returns {Promise<object>}
 */
export const updatePayment = async (data) => {
  try {
    const response = await api.put("/payments/update", data);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};

/**
 * Delete a payment
 * @param {number} payment_id - Payment ID to delete
 * @returns {Promise<object>}
 */
export const deletePayment = async (payment_id) => {
  try {
    const response = await api.delete(`/payments/delete?payment_id=${payment_id}`);
    return response.data;
  } catch (error) {
    return handleError(error);
  }
};
