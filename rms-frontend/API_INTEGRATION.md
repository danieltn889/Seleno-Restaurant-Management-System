# Selen Restaurant Management System - Frontend API Integration

This document explains how to use the API services in your React components.

## 📁 API Structure

```
src/api/
├── axios.js              # Axios instance configuration
├── auth.js               # Authentication services
├── config.js             # API configuration
└── services/
    ├── index.js          # Central export for all services
    ├── users.js          # User management
    ├── inventory.js      # Inventory management
    ├── menu.js           # Menu management
    ├── tables.js         # Tables management
    ├── orders.js         # Orders management
    ├── payments.js       # Payment services
    └── reports.js        # Reporting services
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://gakoshop.xyz/seleno_backend
```

### API Base URL
The API base URL is configured in:
- `.env` file
- `src/config/api.js`
- `src/api/axios.js`

## 🚀 Usage Examples

### 1. Authentication

```javascript
import { loginRequest } from '@/api/services';

// Login
const handleLogin = async (email, password) => {
  const result = await loginRequest(email, password);
  
  if (result.status === 'success') {
    console.log('User:', result.data);
    // Store user data in context or state
  } else {
    console.error('Login failed:', result.message);
  }
};
```

### 2. User Management

```javascript
import { addUser, listUsers, updateUser, deleteUser } from '@/api/services';

// Add new user
const createUser = async () => {
  const userData = {
    firstname: "John",
    lastname: "Doe",
    email: "john@mail.com",
    user_role: "Admin",
    user_status: "active",
    user_phone: "0780019550"
  };
  
  const result = await addUser(userData);
  if (result.status === 'success') {
    console.log('User created successfully');
  }
};

// List all users
const fetchUsers = async () => {
  const result = await listUsers();
  if (result.status === 'success') {
    console.log('Users:', result.data);
  }
};

// Update user
const updateUserInfo = async () => {
  const userData = {
    userid: 1,
    firstname: "John",
    lastname: "Smith",
    email: "john.smith@mail.com",
    user_role: "Manager",
    user_status: "active",
    user_phone: "0780019550"
  };
  
  const result = await updateUser(userData);
  if (result.status === 'success') {
    console.log('User updated');
  }
};

// Delete user
const removeUser = async (userId) => {
  const result = await deleteUser(userId);
  if (result.status === 'success') {
    console.log('User deleted');
  }
};
```

### 3. Inventory Management

```javascript
import { 
  addStockCategory, 
  listStockCategories,
  addStock,
  addStockIn,
  addStockOut 
} from '@/api/services';

// Add stock category
const createStockCategory = async () => {
  const result = await addStockCategory({
    stockcat_name: "Vegetables",
    stockcat_status: "active"
  });
};

// List stock categories
const fetchStockCategories = async () => {
  const result = await listStockCategories();
  if (result.status === 'success') {
    console.log('Categories:', result.data);
  }
};

// Add stock
const createStock = async () => {
  const result = await addStock({
    stock_item_cat_id: 1,
    stock_name: "Fresh Tomatoes",
    stock_qty: 50,
    stock_status: "available"
  });
};

// Stock IN
const recordStockIn = async () => {
  const result = await addStockIn({
    stock_id: 1,
    stockin_qty: 20,
    stockin_price_init: 5000,
    userid: 1
  });
  
  if (result.status === 'success') {
    console.log('Current quantity:', result.current_qty);
  }
};

// Stock OUT
const recordStockOut = async () => {
  const result = await addStockOut({
    stock_id: 1,
    stockout_qty: 5,
    userid: 1
  });
};
```

### 4. Menu Management

```javascript
import { 
  addMenuCategoryGroup,
  addMenuCategory,
  addMenu,
  addMenuItem,
  listMenus
} from '@/api/services';

// Add menu category group
const createMenuCategoryGroup = async () => {
  const result = await addMenuCategoryGroup({
    menu_cat_group_name: "Main Course",
    menu_cat_group_desc: "Main dishes"
  });
};

// Add menu
const createMenu = async () => {
  const result = await addMenu({
    menu_cat_id: 1,
    menu_name: "Chicken Rice",
    menu_price: 3500,
    menu_status: "available"
  });
};

// List menus
const fetchMenus = async () => {
  const result = await listMenus();
  if (result.status === 'success') {
    console.log('Menus:', result.data);
  }
};

// Add menu item (ingredient)
const addIngredient = async () => {
  const result = await addMenuItem({
    menu_id: 1,
    stock_id: 2,
    menu_item_name: "Rice"
  });
};
```

### 5. Table Management

```javascript
import { addTableGroup, addTable, listTables } from '@/api/services';

// Add table group
const createTableGroup = async () => {
  const result = await addTableGroup({
    table_group_name: "VIP Section"
  });
};

// Add table
const createTable = async () => {
  const result = await addTable({
    table_group_id: 1,
    table_desc: "VIP Table 1"
  });
};

// List tables
const fetchTables = async () => {
  const result = await listTables();
  if (result.status === 'success') {
    console.log('Tables:', result.data);
  }
};
```

### 6. Orders Management

```javascript
import { 
  createOrder,
  addOrderItem,
  listOrders,
  updateOrderStatus 
} from '@/api/services';

// Create order
const placeOrder = async () => {
  const result = await createOrder({
    order_type_id: 1,
    userid: 2,
    table_id: 3
  });
  
  if (result.status === 'success') {
    console.log('Order ID:', result.order_id);
    console.log('Order Code:', result.order_code);
  }
};

// Add order items
const addItemToOrder = async (orderId) => {
  const result = await addOrderItem({
    order_id: orderId,
    menu_id: 5,
    order_qty: 2,
    order_item_price: 7000
  });
};

// List orders
const fetchOrders = async () => {
  const result = await listOrders();
  if (result.status === 'success') {
    console.log('Orders:', result.data);
  }
};

// Update order status
const changeOrderStatus = async (orderId) => {
  const result = await updateOrderStatus({
    order_id: orderId,
    order_status: "completed"
  });
};
```

### 7. Payments

```javascript
import { addPayment, checkPaymentStatus } from '@/api/services';

// Add payment
const processPayment = async () => {
  const result = await addPayment({
    order_id: 10,
    payment_method: "cash",
    amount_paid: 7000
  });
  
  if (result.status === 'success') {
    console.log('Payment status:', result.payment_status);
  }
};

// Check payment status
const checkStatus = async (orderId) => {
  const result = await checkPaymentStatus(orderId);
  
  if (result.status === 'success') {
    console.log('Payment status:', result.payment_status);
    console.log('Total:', result.total);
    console.log('Paid:', result.paid);
    console.log('Balance:', result.balance);
  }
};
```

### 8. Reports

```javascript
import { 
  getSalesReport,
  getInventoryReport,
  getStockMovementReport,
  getOrderReport,
  getPaymentReport,
  getUserActivityReport 
} from '@/api/services';

// Sales report
const fetchSalesReport = async () => {
  const result = await getSalesReport({
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    menu_id: 1 // optional
  });
  
  if (result.status === 'success') {
    console.log('Total sales:', result.data.total_sales);
    console.log('Menu sales:', result.data.menu_sales);
  }
};

// Inventory report
const fetchInventoryReport = async () => {
  const result = await getInventoryReport();
  
  if (result.status === 'success') {
    console.log('Low stock items:', result.data.low_stock_items);
    console.log('Out of stock:', result.data.out_of_stock_items);
  }
};

// Stock movement report
const fetchStockMovement = async () => {
  const result = await getStockMovementReport({
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    stock_id: 1 // optional
  });
};

// Order report
const fetchOrderReport = async () => {
  const result = await getOrderReport({
    start_date: "2024-01-01",
    end_date: "2024-01-31",
    status: "completed" // optional
  });
};

// Payment report
const fetchPaymentReport = async () => {
  const result = await getPaymentReport({
    start_date: "2024-01-01",
    end_date: "2024-01-31"
  });
  
  if (result.status === 'success') {
    console.log('Total payments:', result.data.total_payments);
    console.log('Method breakdown:', result.data.method_breakdown);
  }
};

// User activity report
const fetchUserActivity = async () => {
  const result = await getUserActivityReport({
    start_date: "2024-01-01",
    end_date: "2024-01-31"
  });
};
```

## 🔒 Authentication & Session Management

The API uses session-based authentication. After successful login:

```javascript
import { loginRequest } from '@/api/services';

const handleLogin = async (email, password) => {
  const result = await loginRequest(email, password);
  
  if (result.status === 'success') {
    // Store user data
    const userData = result.data;
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Session is automatically managed by the backend
    // Cookies will be sent with subsequent requests
  }
};
```

## 📝 Response Format

### Success Response
```javascript
{
  "status": "success",
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

### Error Response
```javascript
{
  "status": "error",
  "message": "Description of the error",
  "code": "ERROR_CODE"
}
```

## 🛠️ Error Handling

All API functions return a response object. Always check the `status` field:

```javascript
const result = await someApiFunction();

if (result.status === 'success') {
  // Handle success
  console.log(result.data);
} else {
  // Handle error
  console.error(result.message);
  // Show error to user
}
```

## 🔄 Using with React Hooks

Example custom hook:

```javascript
import { useState, useEffect } from 'react';
import { listUsers } from '@/api/services';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const result = await listUsers();
      
      if (result.status === 'success') {
        setUsers(result.data);
        setError(null);
      } else {
        setError(result.message);
      }
      
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
};
```

## 🎯 Best Practices

1. **Always check response status** before using data
2. **Handle errors gracefully** with user-friendly messages
3. **Use loading states** to show feedback to users
4. **Store minimal data** in localStorage/state
5. **Invalidate/refresh data** after mutations (create, update, delete)
6. **Use environment variables** for configuration
7. **Create custom hooks** for reusable data fetching logic

## 📚 Additional Resources

- Backend API Documentation: See the full API documentation provided
- Base URL: `https://gakoshop.xyz/seleno_backend/`
- Authentication: Session-based (via `/login.php`)

## 🤝 Support

For issues or questions, refer to the complete API documentation or contact the backend team.
