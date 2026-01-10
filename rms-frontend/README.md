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

## 📡 API Examples

Below are common API endpoints used by the frontend with sample requests and responses. Add or edit entries as needed.

1) List Menu Items
- Endpoint: `GET /menu/items/list`
- Description: Fetch menu items (includes menu, category, and stock)
- Request: none
- Success response example:
```json
{
  "status": "success",
  "message": "Menu items listed",
  "data": [
    {
      "menu_item_id": 1,
      "menu_item_name": "Chicken Stew",
      "menu_price": "7000.00",
      "menu_name": "Lunch",
      "category": "Lunch",
      "stock_name": "Chicken",
      "quantity": 50
    }
  ]
}
```

2) List Orders
- Endpoint: `GET /orders/list`
- Description: Returns orders with an `items` array for each order
- Request: none
- Success response example:
```json
{
  "status": "success",
  "message": "Orders listed",
  "data": [
    {
      "order_id": 1,
      "order_code": "ORD-2026-001",
      "table_id": 1,
      "userid": 1,
      "order_status": "confirmed",
      "items": [{ "qty": 1, "price": 7000, "name": "Chicken Stew" }]
    }
  ]
}
```

3) Create Order
- Endpoint: `POST /orders/create`
- Description: Create a new order (order record)
- Request body example:
```json
{ "order_type_id": 1, "userid": 2, "table_id": 3 }
```
- Success response example:
```json
{ "status": "success", "message": "Order created", "data": { "order_id": 7, "order_code": "ORD-2026-007" } }
```

4) Add Order Item
- Endpoint: `POST /orders/items/add`
- Request body example:
```json
{ "order_id": 7, "menu_id": 5, "order_qty": 2, "order_item_price": 7000 }
```
- Success response: `{ "status": "success", "message": "Order item added" }`

5) Add Payment
- Endpoint: `POST /payments/add`
- Description: Record a payment for an order. Allowed `payment_method`: `cash`, `card`, `mobile`.
- Request body example:
```json
{
  "order_id": 7,
  "payment_method": "cash",
  "amount_paid": 7000,
  "payment_status": "paid",
  "partial_reason": ""  // required when payment_status == 'partial'
}
```
- Success response example:
```json
{ "status": "success", "message": "Payment added", "data": { "payment_status": "paid" } }
```

(For full API details see `API_INTEGRATION.md`.)
---

## 📘 Detailed API Integration

I consolidated the full API integration documentation from `API_INTEGRATION.md` here for convenience. Below are full request/response templates plus placeholders where you can paste the actual responses from your server.

### How to capture real responses
- Use Postman / Insomnia or curl to send the request and copy the response body here.
- From the frontend, open browser DevTools -> Network, perform the action, then copy the request and response JSON.

Template to fill for each endpoint
```
Endpoint: METHOD /path
Description: ...
Request (example):
{
  ...
}
Sample response (expected):
{
  "status": "success",
  "message": "...",
  "data": { ... }
}
Actual response (paste here):
```

---

## Authentication

### POST /login
- Description: Authenticate user (returns session data)
- Request example:
```json
{ "email": "admin@mail.com", "password": "123456" }
```
- Sample response:
```json
{ "status": "success", "message": "Login successful", "data": { "userid": 1, "firstname": "John", "lastname": "Doe", "token": "..." } }
```
- Actual response:


---

## Menu

### GET /menu/items/list
- Description: Returns all menu items with category and stock details
- Request: `GET /menu/items/list`
- Sample response:
```json
{
  "status": "success",
  "message": "Menu items listed",
  "data": [
    {
      "menu_item_id": 1,
      "menu_item_name": "Chicken Stew",
      "menu_price": "7000.00",
      "menu_name": "Lunch",
      "category": "Lunch",
      "stock_name": "Chicken",
      "quantity": 50
    }
  ]
}
```
- Actual response:


---

## Orders

### POST /orders/create
- Description: Create an order (order record)
- Request example:
```json
{ "order_type_id": 1, "userid": 2, "table_id": 3 }
```
- Sample response:
```json
{ "status": "success", "message": "Order created", "data": { "order_id": 7, "order_code": "ORD-2026-007" } }
```
- Actual response:


### POST /orders/items/add
- Description: Add an item to an order
- Request example:
```json
{ "order_id": 7, "menu_id": 5, "order_qty": 2, "order_item_price": 7000 }
```
- Sample response:
```json
{ "status": "success", "message": "Order item added" }
```
- Actual response:


### GET /orders/list
- Description: List orders. Each order includes `items` array (qty, price, name)
- Request: `GET /orders/list`
- Sample response:
```json
{
  "status": "success",
  "message": "Orders listed",
  "data": [
    {
      "order_id": 1,
      "order_code": "ORD-2026-001",
      "table_id": 1,
      "userid": 1,
      "order_status": "confirmed",
      "items": [{ "qty": 1, "price": 7000, "name": "Chicken Stew" }]
    }
  ]
}
```
- Actual response:


### PUT /orders/update
- Description: Update order fields (status, table, etc.)
- Request example:
```json
{ "order_id": 1, "order_status": "confirmed" }
```
- Sample response:
```json
{ "status": "success", "message": "Order updated" }
```
- Actual response:


---

## Payments

### POST /payments/add
- Description: Record a payment for an order. Allowed `payment_method`: `cash`, `card`, `mobile`.
- Request example:
```json
{
  "order_id": 7,
  "payment_method": "cash",
  "amount_paid": 7000,
  "payment_status": "paid",
  "partial_reason": ""  // required if payment_status == 'partial'
}
```
- Sample response:
```json
{ "status": "success", "message": "Payment added", "data": { "payment_status": "paid" } }
```
- Actual response:


### GET /payments/status?order_id={id}
- Description: Returns payment status for an order
- Request example: `GET /payments/status?order_id=7`
- Sample response:
```json
{ "status": "success", "message": "Payment status checked", "data": { "status": "paid", "total_paid": 7000 } }
```
- Actual response:


---

## Tables

### GET /tables/list
- Description: Get available tables
- Sample response:
```json
{ "status": "success", "message": "Tables listed", "data": [ { "table_id": 1, "table_name": "VIP", "table_group_name": "Standard" } ] }
```
- Actual response:


---

## Inventory (stocks)

### GET /inventory/stocks/list
- Description: List stocks
- Sample response:
```json
{ "status": "success", "message": "Stocks listed", "data": [ { "stock_id": 1, "stock_name": "Rice", "quantity": 100 } ] }
```
- Actual response:


---

## Users

### GET /users/list
- Description: List users
- Sample response:
```json
{ "status": "success", "message": "Users listed", "data": [ { "userid": 1, "firstname": "John", "lastname": "Doe", "user_role": "Admin" } ] }
```
- Actual response:


---

## Notes
- If you want me to populate each "Actual response" block with the real responses from your running server, I can: (a) give you curl/Postman commands to run and paste results here, or (b) attempt to call local endpoints if you confirm the server is accessible and you want me to run network tests (I currently cannot make external HTTP requests without your environment) — option (a) is quicker.

If this looks good I will:
1. Add any additional endpoints you want documented.
2. Validate the sample payloads against frontend usage and link to the files that call them.
3. Commit the changes (if you want) and finish the docs task.

---

## 📋 Complete Endpoint Reference (all endpoints)

Below is a complete list of endpoints from the backend grouped by feature. Each entry includes: method, path, controller, a short description and placeholders for request/response examples.

---

### Authentication
- POST /login — AuthController@login — Login user
  - Request example: `{ "email": "admin@mail.com", "password": "123456" }`
  - Sample response: `{ "status": "success", "data": { "userid": 1, "token": "..." } }`
  - Actual response:

- POST /validate-token — AuthController@validateToken — Validate session token
  - Request example: `{ "token": "..." }`
  - Sample response: `{ "status": "success", "message": "Token valid" }`
  - Actual response:

- POST /logout — AuthController@logout — Logout current session
  - Request: none (session/cookie)
  - Sample response: `{ "status": "success", "message": "Logged out" }`
  - Actual response:

---

### Users
- POST /users/add — UserController@addUser
- GET /users/list — UserController@listUsers
- PUT /users/update — UserController@updateUser
- DELETE /users/delete — UserController@deleteUser

(For each user endpoint add request & response examples like in the Menu/Orders examples above)

---

### Inventory
- POST /inventory/stock-category/add — Add stock category
- GET /inventory/stock-category/list — List stock categories
- PUT /inventory/stock-category/update — Update stock category
- DELETE /inventory/stock-category/delete — Delete stock category
- POST /inventory/stock-group/add — Add stock group
- GET /inventory/stock-group/list — List stock groups
- PUT /inventory/stock-group/update — Update stock group
- DELETE /inventory/stock-group/delete — Delete stock group
- POST /inventory/stock-item-category/add — Add stock item category
- GET /inventory/stock-item-category/list — List stock item categories
- PUT /inventory/stock-item-category/update — Update stock item category
- DELETE /inventory/stock-item-category/delete — Delete stock item category
- POST /inventory/stocks/add — Add stock item
- GET /inventory/stocks/list — List stocks
- PUT /inventory/stocks/update — Update stock
- DELETE /inventory/stocks/delete — Delete stock
- POST /inventory/stockin/add — Add stock in record
- GET /inventory/stockin/list — List stock in records
- PUT /inventory/stockin/update — Update stock in
- DELETE /inventory/stockin/delete — Delete stock in
- POST /inventory/stockout/add — Add stock out record
- GET /inventory/stockout/list — List stock out records
- PUT /inventory/stockout/update — Update stock out
- DELETE /inventory/stockout/delete — Delete stock out

---

### Menu Management
- POST /menu/category-group/add — Add menu category group
- GET /menu/category-group/list — List menu category groups
- PUT /menu/category-group/update — Update menu category group
- DELETE /menu/category-group/delete — Delete menu category group
- POST /menu/category/add — Add menu category
- GET /menu/category/list — List menu categories
- PUT /menu/category/update — Update menu category
- DELETE /menu/category/delete — Delete menu category
- POST /menu/add — Add menu
- GET /menu/list — List menus
- PUT /menu/update — Update menu
- DELETE /menu/delete — Delete menu
- POST /menu/items/add — Add menu item
- GET /menu/items/list — List menu items
- PUT /menu/items/update — Update menu item
- DELETE /menu/items/delete — Delete menu item

---

### Tables Management
- POST /tables/group/add — Add table group
- GET /tables/group/list — List table groups
- PUT /tables/group/update — Update table group
- DELETE /tables/group/delete — Delete table group
- POST /tables/add — Add table
- GET /tables/list — List tables
- PUT /tables/update — Update table
- DELETE /tables/delete — Delete table

---

### Orders
- POST /orders/type/add — Add order type
- GET /orders/type/list — List order types
- PUT /orders/type/update — Update order type
- DELETE /orders/type/delete — Delete order type
- POST /orders/special/add — Add special order
- GET /orders/special/list — List special orders
- PUT /orders/special/update — Update special order
- DELETE /orders/special/delete — Delete special order
- POST /orders/create — Create order
  - Request example: `{ "order_type_id": 1, "userid": 2, "table_id": 3 }`
  - Sample response: `{ "status": "success", "data": { "order_id": 7, "order_code": "ORD-2026-007" } }`
  - Actual response:

- GET /orders/list — List orders
  - Sample response: `{"status":"success","data":[{"order_id":1,"order_code":"ORD-2026-001","order_status":"confirmed","items":[{...}]}]}`
  - Actual response:

- PUT /orders/update — Update order (status, etc.)
  - Request example: `{ "order_id": 1, "order_status": "confirmed" }`
  - Sample response: `{ "status": "success", "message": "Order updated" }`
  - Actual response:

- DELETE /orders/delete — Delete order

- POST /orders/items/add — Add order item
  - Request example: `{ "order_id": 7, "menu_id": 5, "order_qty": 2, "order_item_price": 7000 }`
  - Sample response: `{ "status": "success", "message": "Order item added" }`
  - Actual response:

- GET /orders/items/list?order_id={id} — List order items for an order
- PUT /orders/items/update — Update order item
- DELETE /orders/items/delete — Delete order item

---

### Payments
- POST /payments/add — Add payment
  - Request example: `{ "order_id":7, "payment_method":"cash", "amount_paid":7000, "payment_status":"paid" }`
  - Sample response: `{ "status": "success", "message": "Payment added", "data": { "payment_status": "paid" } }`
  - Actual response:

- GET /payments/status?order_id={id} — Check payment status for an order
  - Sample response: `{ "status": "success", "data": { "status": "paid", "total_paid": 7000 } }`
  - Actual response:

---

### Reports
- GET /reports/sales — Sales report
- GET /reports/inventory — Inventory report
- GET /reports/stock-movement — Stock movement report
- GET /reports/orders — Orders report
- GET /reports/payments — Payments report
- GET /reports/user-activity — User activity report

---

If you want, I will now populate the "Actual response" blocks by either:
- giving you curl/Postman commands to run and paste results here (fast), or
- attempting automated validation against your local server (I will need confirmation that I should run network tests from the environment).

*Generated by the development assistant.*---

## 📜 Full API Endpoint Reference

Below is a concise reference of all backend endpoints exposed by the API (grouped by feature):

- Authentication
  - POST /login — Login (AuthController@login)
  - POST /validate-token — Validate session token (AuthController@validateToken)
  - POST /logout — Logout (AuthController@logout)

- Users
  - POST /users/add — Add user (UserController@addUser)
  - GET /users/list — List users (UserController@listUsers)
  - PUT /users/update — Update user (UserController@updateUser)
  - DELETE /users/delete — Delete user (UserController@deleteUser)

- Inventory (Stock Categories / Groups / Item Categories / Stocks / IN/OUT)
  - POST /inventory/stock-category/add — Add stock category
  - GET /inventory/stock-category/list — List stock categories
  - PUT /inventory/stock-category/update — Update stock category
  - DELETE /inventory/stock-category/delete — Delete stock category
  - POST /inventory/stock-group/add — Add stock group
  - GET /inventory/stock-group/list — List stock groups
  - PUT /inventory/stock-group/update — Update stock group
  - DELETE /inventory/stock-group/delete — Delete stock group
  - POST /inventory/stock-item-category/add — Add stock item category
  - GET /inventory/stock-item-category/list — List stock item categories
  - PUT /inventory/stock-item-category/update — Update stock item category
  - DELETE /inventory/stock-item-category/delete — Delete stock item category
  - POST /inventory/stocks/add — Add stock item
  - GET /inventory/stocks/list — List stocks
  - PUT /inventory/stocks/update — Update stock
  - DELETE /inventory/stocks/delete — Delete stock
  - POST /inventory/stockin/add — Add stock in record
  - GET /inventory/stockin/list — List stock in records
  - PUT /inventory/stockin/update — Update stock in
  - DELETE /inventory/stockin/delete — Delete stock in
  - POST /inventory/stockout/add — Add stock out record
  - GET /inventory/stockout/list — List stock out records
  - PUT /inventory/stockout/update — Update stock out
  - DELETE /inventory/stockout/delete — Delete stock out

- Menu Management
  - POST /menu/category-group/add — Add menu category group
  - GET /menu/category-group/list — List menu category groups
  - PUT /menu/category-group/update — Update menu category group
  - DELETE /menu/category-group/delete — Delete menu category group
  - POST /menu/category/add — Add menu category
  - GET /menu/category/list — List menu categories
  - PUT /menu/category/update — Update menu category
  - DELETE /menu/category/delete — Delete menu category
  - POST /menu/add — Add menu
  - GET /menu/list — List menus
  - PUT /menu/update — Update menu
  - DELETE /menu/delete — Delete menu
  - POST /menu/items/add — Add menu item
  - GET /menu/items/list — List menu items
  - PUT /menu/items/update — Update menu item
  - DELETE /menu/items/delete — Delete menu item

- Tables Management
  - POST /tables/group/add — Add table group
  - GET /tables/group/list — List table groups
  - PUT /tables/group/update — Update table group
  - DELETE /tables/group/delete — Delete table group
  - POST /tables/add — Add table
  - GET /tables/list — List tables
  - PUT /tables/update — Update table
  - DELETE /tables/delete — Delete table

- Orders
  - POST /orders/type/add — Add order type
  - GET /orders/type/list — List order types
  - PUT /orders/type/update — Update order type
  - DELETE /orders/type/delete — Delete order type
  - POST /orders/special/add — Add special order
  - GET /orders/special/list — List special orders
  - PUT /orders/special/update — Update special order
  - DELETE /orders/special/delete — Delete special order
  - POST /orders/create — Create order
  - GET /orders/list — List orders
  - PUT /orders/update — Update order
  - DELETE /orders/delete — Delete order
  - POST /orders/items/add — Add order item
  - GET /orders/items/list — List order items (by order)
  - PUT /orders/items/update — Update order item
  - DELETE /orders/items/delete — Delete order item

- Payments
  - POST /payments/add — Add payment
  - GET /payments/status — Check payment status (by order_id)

- Reports
  - GET /reports/sales — Sales report
  - GET /reports/inventory — Inventory report
  - GET /reports/stock-movement — Stock movement
  - GET /reports/orders — Orders report
  - GET /reports/payments — Payments report
  - GET /reports/user-activity — User activity report

---

You can expand each entry with request/response examples in `API_INTEGRATION.md`.

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
