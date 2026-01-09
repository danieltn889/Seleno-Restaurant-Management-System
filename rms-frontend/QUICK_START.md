# 🚀 Quick Start Guide - Seleno API Integration

## 🎯 Getting Started in 5 Minutes

### Step 1: Verify Configuration
Your project is already configured! The API base URL is set to:
```
https://gakoshop.xyz/seleno_backend/
```

### Step 2: Test the Login
Try logging in with the default credentials:
```javascript
Email: admin@mail.com
Password: 123456
```

### Step 3: Use in Your Components

#### Example 1: Fetch Users List
```javascript
import { useState, useEffect } from 'react';
import { listUsers } from '@/api/services';

function MyComponent() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await listUsers();
      if (result.status === 'success') {
        setUsers(result.data);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {users.map(user => (
        <div key={user.userid}>{user.firstname} {user.lastname}</div>
      ))}
    </div>
  );
}
```

#### Example 2: Create an Order
```javascript
import { createOrder, addOrderItem } from '@/api/services';
import { showSuccess, showError } from '@/utils/apiHelpers';

const placeOrder = async () => {
  // Create order
  const orderResult = await createOrder({
    order_type_id: 1,
    userid: 2,
    table_id: 3
  });

  if (orderResult.status === 'success') {
    const orderId = orderResult.order_id;
    
    // Add items to order
    const itemResult = await addOrderItem({
      order_id: orderId,
      menu_id: 5,
      order_qty: 2,
      order_item_price: 7000
    });
    
    if (itemResult.status === 'success') {
      showSuccess('Order created successfully!');
    }
  } else {
    showError(orderResult.message);
  }
};
```

#### Example 3: Get Sales Report
```javascript
import { getSalesReport } from '@/api/services';

const fetchSalesReport = async () => {
  const result = await getSalesReport({
    start_date: '2024-01-01',
    end_date: '2024-01-31'
  });
  
  if (result.status === 'success') {
    console.log('Total Sales:', result.data.total_sales);
    console.log('Menu Sales:', result.data.menu_sales);
  }
};
```

## 📦 Available Services

All services are imported from `@/api/services`:

### Authentication
```javascript
import { loginRequest, forgotPasswordRequest } from '@/api/services';
```

### Users
```javascript
import { addUser, listUsers, updateUser, deleteUser } from '@/api/services';
```

### Inventory
```javascript
import { 
  addStockCategory, listStockCategories,
  addStock, listStocks,
  addStockIn, addStockOut
} from '@/api/services';
```

### Menu
```javascript
import { 
  addMenu, listMenus,
  addMenuCategory, listMenuCategories,
  addMenuItem
} from '@/api/services';
```

### Tables
```javascript
import { addTable, listTables, addTableGroup } from '@/api/services';
```

### Orders
```javascript
import { 
  createOrder, listOrders,
  addOrderItem, updateOrderStatus
} from '@/api/services';
```

### Payments
```javascript
import { addPayment, checkPaymentStatus } from '@/api/services';
```

### Reports
```javascript
import { 
  getSalesReport,
  getInventoryReport,
  getOrderReport,
  getPaymentReport
} from '@/api/services';
```

## 🛠️ Helper Utilities

Use these helpers for better UX:

```javascript
import { 
  showSuccess, 
  showError, 
  showLoading,
  confirmAction,
  formatCurrency,
  formatDateForDisplay
} from '@/utils/apiHelpers';

// Show success message
showSuccess('User added successfully!');

// Show error
showError('Failed to save data');

// Show loading
showLoading('Saving...');

// Confirm action
const confirmed = await confirmAction('Delete User', 'Are you sure?');
if (confirmed) {
  // Proceed with deletion
}

// Format currency
const price = formatCurrency(5000); // "5,000 RWF"

// Format date
const date = formatDateForDisplay('2024-01-15'); // "Jan 15, 2024"
```

## 🎨 Complete Component Example

```javascript
import { useState, useEffect } from 'react';
import { listMenus, addMenu, deleteMenu } from '@/api/services';
import { showSuccess, showError, confirmAction, formatCurrency } from '@/utils/apiHelpers';

function MenuManagement() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    const result = await listMenus();
    if (result.status === 'success') {
      setMenus(result.data);
    } else {
      showError(result.message);
    }
    setLoading(false);
  };

  const handleAddMenu = async (menuData) => {
    const result = await addMenu(menuData);
    if (result.status === 'success') {
      showSuccess('Menu added successfully!');
      fetchMenus(); // Refresh list
    } else {
      showError(result.message);
    }
  };

  const handleDeleteMenu = async (id, name) => {
    const confirmed = await confirmAction(
      'Delete Menu',
      `Are you sure you want to delete ${name}?`
    );
    
    if (confirmed) {
      const result = await deleteMenu(id);
      if (result.status === 'success') {
        showSuccess('Menu deleted!');
        fetchMenus();
      } else {
        showError(result.message);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Management</h1>
      
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {menus.map(menu => (
            <div key={menu.menu_id} className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">{menu.menu_name}</h3>
              <p className="text-gray-600">{formatCurrency(menu.menu_price)}</p>
              <button
                onClick={() => handleDeleteMenu(menu.menu_id, menu.menu_name)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MenuManagement;
```

## 🔍 Testing Checklist

Run through these to verify everything works:

- [ ] Login with test credentials
- [ ] Fetch and display users list
- [ ] Create a new user
- [ ] Fetch menu items
- [ ] Create an order
- [ ] Add items to order
- [ ] Process payment
- [ ] Generate a sales report

## 📚 More Information

- **Detailed Examples**: See `API_INTEGRATION.md`
- **Working Component**: See `src/pages/examples/UserManagementExample.jsx`
- **Helper Functions**: See `src/utils/apiHelpers.js`
- **Complete Summary**: See `INTEGRATION_COMPLETE.md`

## 🆘 Need Help?

If something doesn't work:
1. Check browser console for errors
2. Verify API base URL is correct
3. Check network tab to see API requests
4. Make sure backend is accessible
5. Verify your internet connection

## 🎊 You're Ready!

Start building your restaurant management system with confidence. All the API integration is complete and ready to use!

Happy coding! 🚀
