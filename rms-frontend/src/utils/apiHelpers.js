// src/utils/apiHelpers.js
import Swal from 'sweetalert2';

/**
 * Show success message
 * @param {string} message - Success message to display
 */
export const showSuccess = (message) => {
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: message,
    timer: 2000,
    showConfirmButton: false
  });
};

/**
 * Show error message
 * @param {string} message - Error message to display
 */
export const showError = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message || 'An unexpected error occurred'
  });
};

/**
 * Show loading message
 */
export const showLoading = (message = 'Loading...') => {
  Swal.fire({
    title: message,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

/**
 * Close any open Swal dialog
 */
export const closeLoading = () => {
  Swal.close();
};

/**
 * Confirm action
 * @param {string} title - Title of confirmation dialog
 * @param {string} text - Text of confirmation dialog
 * @returns {Promise<boolean>} - Returns true if confirmed
 */
export const confirmAction = async (title, text = 'This action cannot be undone') => {
  const result = await Swal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, proceed!',
    cancelButtonText: 'Cancel'
  });
  
  return result.isConfirmed;
};

/**
 * Handle API response consistently
 * @param {Object} response - API response object
 * @param {string} successMessage - Message to show on success
 * @param {Function} onSuccess - Callback function on success
 * @param {Function} onError - Callback function on error
 */
export const handleApiResponse = async (
  response,
  successMessage = 'Operation completed successfully',
  onSuccess = null,
  onError = null
) => {
  if (response.status === 'success') {
    showSuccess(successMessage);
    if (onSuccess) await onSuccess(response.data);
    return true;
  } else {
    showError(response.message);
    if (onError) await onError(response);
    return false;
  }
};

/**
 * Format date for API (YYYY-MM-DD)
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
export const formatDateForApi = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Format date for display
 * @param {string} dateString - Date string from API
 * @returns {string} - Formatted date for display
 */
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency symbol (default: RWF)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'RWF') => {
  if (amount === null || amount === undefined) return `0 ${currency}`;
  return `${Number(amount).toLocaleString()} ${currency}`;
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate phone number (Rwanda format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid
 */
export const isValidPhone = (phone) => {
  const re = /^(\+?250|0)?[7][0-9]{8}$/;
  return re.test(phone);
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Get status badge color
 * @param {string} status - Status string
 * @returns {string} - Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-red-100 text-red-800',
    partial: 'bg-orange-100 text-orange-800',
    available: 'bg-green-100 text-green-800',
    unavailable: 'bg-red-100 text-red-800'
  };
  
  return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Export data to CSV
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Filename for the export
 */
export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || data.length === 0) {
    showError('No data to export');
    return;
  }

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(',')
    )
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showSuccess('Copied to clipboard!');
  } catch (err) {
    showError('Failed to copy to clipboard');
  }
};
