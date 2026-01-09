# 🍽️ Selen Restaurant Management System - Frontend

A modern React-based frontend for the Selen Restaurant Management System, fully integrated with the backend API.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Default Login Credentials
```
Email: admin@mail.com
Password: 123456
```

## 📁 Project Structure

```
src/
├── api/
│   ├── axios.js              # Axios configuration
│   ├── auth.js               # Authentication services
│   ├── config.js             # API configuration
│   └── services/             # API service modules
│       ├── index.js          # Central export
│       ├── users.js          # User management
│       ├── inventory.js      # Inventory operations
│       ├── menu.js           # Menu operations
│       ├── tables.js         # Table operations
│       ├── orders.js         # Order operations
│       ├── payments.js       # Payment operations
│       └── reports.js        # Reporting services
├── components/               # Reusable components
├── pages/                    # Page components
├── context/                  # React contexts
├── hooks/                    # Custom hooks
├── utils/                    # Utility functions
├── constants/                # Constants and enums
└── assets/                   # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file:
```env
VITE_API_BASE_URL=https://gakoshop.xyz/seleno_backend
```

### API Base URL
The backend API is hosted at:
```
https://gakoshop.xyz/seleno_backend/
```

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Get started in 5 minutes
- **[API_INTEGRATION.md](./API_INTEGRATION.md)** - Complete API usage guide
- **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - Integration summary

## 🎯 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🌟 Features

### Implemented Modules
✅ **Authentication** - Login, logout, session management  
✅ **User Management** - CRUD operations for users  
✅ **Inventory Management** - Stock categories, items, stock in/out  
✅ **Menu Management** - Menu categories, items, ingredients  
✅ **Table Management** - Table groups and tables  
✅ **Order Management** - Create orders, add items, track status  
✅ **Payment Processing** - Multiple payment methods, status tracking  
✅ **Reports** - Sales, inventory, orders, payments, user activity  

### User Roles
- **Admin** - Full system access
- **Manager** - Stock and sales management
- **Cashier** - Payment processing
- **Waiter** - Order management

## 💻 Usage Examples

### Import Services
```javascript
import { listUsers, addUser, updateUser, deleteUser } from '@/api/services';
```

### Fetch Data
```javascript
const fetchUsers = async () => {
  const result = await listUsers();
  if (result.status === 'success') {
    console.log(result.data);
  }
};
```

### Create Order
```javascript
import { createOrder, addOrderItem } from '@/api/services';

const placeOrder = async () => {
  const order = await createOrder({
    order_type_id: 1,
    userid: 2,
    table_id: 3
  });
  
  if (order.status === 'success') {
    await addOrderItem({
      order_id: order.order_id,
      menu_id: 5,
      order_qty: 2,
      order_item_price: 7000
    });
  }
};
```

### Generate Report
```javascript
import { getSalesReport } from '@/api/services';

const fetchReport = async () => {
  const report = await getSalesReport({
    start_date: '2024-01-01',
    end_date: '2024-01-31'
  });
  console.log(report.data.total_sales);
};
```

## 🛠️ Helper Utilities

```javascript
import { 
  showSuccess, 
  showError, 
  formatCurrency,
  confirmAction 
} from '@/utils/apiHelpers';

// Show notifications
showSuccess('Order created!');
showError('Failed to save');

// Format currency
formatCurrency(5000); // "5,000 RWF"

// Confirm action
const confirmed = await confirmAction('Delete', 'Are you sure?');
```

## 🔒 Authentication

Session-based authentication with automatic cookie management:
```javascript
import { loginRequest } from '@/api/services';

const login = async (email, password) => {
  const result = await loginRequest(email, password);
  if (result.status === 'success') {
    // Session automatically managed
    localStorage.setItem('user', JSON.stringify(result.data));
  }
};
```

## 📦 Technologies

- **React 19** - UI framework
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **SweetAlert2** - Notifications
- **React Icons** - Icons

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

All rights reserved.

## 🆘 Support

For issues or questions:
- Check the documentation files
- Review example components
- Contact the development team

---

**Backend API**: https://gakoshop.xyz/seleno_backend/  
**Version**: 1.0  
**Last Updated**: January 2026
