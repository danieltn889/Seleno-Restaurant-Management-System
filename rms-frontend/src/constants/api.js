// src/constants/api.js

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  CASHIER: 'Cashier',
  WAITER: 'Waiter'
};

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
};

// Stock Status
export const STOCK_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  LOW_STOCK: 'low_stock'
};

// Menu Status
export const MENU_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable'
};

// Order Status
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  BANK: 'bank',
  MOBILE: 'mobile',
  MOMO: 'momo'
};

// Payment Status
export const PAYMENT_STATUS = {
  PAID: 'paid',
  PARTIAL: 'partial',
  UNPAID: 'unpaid',
  PENDING: 'pending'
};

// Order Types (common examples)
export const ORDER_TYPES = {
  DINE_IN: 1,
  TAKEAWAY: 2,
  DELIVERY: 3
};

// Role Permissions
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'manage_users',
    'manage_orders',
    'manage_stock',
    'manage_expenses',
    'manage_menu',
    'view_reports',
    'manage_tables',
    'view_performance'
  ],
  [USER_ROLES.MANAGER]: [
    'manage_stock',
    'view_reports',
    'add_tables',
    'record_stock',
    'add_menu',
    'approve_orders'
  ],
  [USER_ROLES.WAITER]: [
    'place_orders',
    'view_orders',
    'print_orders',
    'reassign_orders',
    'add_special_orders',
    'print_invoice'
  ],
  [USER_ROLES.CASHIER]: [
    'receive_payments',
    'approve_payments',
    'generate_receipts',
    'view_payment_reports'
  ]
};

// Date Range Presets for Reports
export const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom'
};

// Get date range dates
export const getDateRange = (range) => {
  const today = new Date();
  const start = new Date();
  const end = new Date();

  switch (range) {
    case DATE_RANGES.TODAY:
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    
    case DATE_RANGES.YESTERDAY:
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    
    case DATE_RANGES.THIS_WEEK:
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + (6 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      break;
    
    case DATE_RANGES.LAST_WEEK:
      start.setDate(start.getDate() - start.getDay() - 7);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - end.getDay() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    
    case DATE_RANGES.THIS_MONTH:
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;
    
    case DATE_RANGES.LAST_MONTH:
      start.setMonth(start.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      break;
    
    case DATE_RANGES.THIS_YEAR:
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;
    
    default:
      return null;
  }

  return { start, end };
};

// Format date for API (YYYY-MM-DD)
export const formatDateForAPI = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

// API Response Status
export const API_STATUS = {
  SUCCESS: 'success',
  ERROR: 'error'
};

// Validation Rules
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  PHONE_PATTERN: /^(\+?250|0)?[7][0-9]{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// Table Status
export const TABLE_STATUS = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  RESERVED: 'reserved',
  CLEANING: 'cleaning'
};

// Currency
export const CURRENCY = {
  CODE: 'RWF',
  SYMBOL: 'RWF',
  NAME: 'Rwandan Franc'
};

// Export all as default for easy import
export default {
  USER_ROLES,
  USER_STATUS,
  STOCK_STATUS,
  MENU_STATUS,
  ORDER_STATUS,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
  ORDER_TYPES,
  ROLE_PERMISSIONS,
  DATE_RANGES,
  getDateRange,
  formatDateForAPI,
  HTTP_STATUS,
  API_STATUS,
  VALIDATION,
  PAGINATION,
  TABLE_STATUS,
  CURRENCY
};
