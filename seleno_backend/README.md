# Selen Restaurant Management System API

## 📋 Overview

A complete REST API for restaurant management built with PHP OOP, MySQL, and following MVC architecture. The API handles user management, inventory, menu management, orders, payments, table management, and comprehensive reporting.

## 🚀 Quick Start

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server
- XAMPP/WAMP (recommended for Windows)

### Installation

1. **Clone/Download** the project to your web server root:
   ```
   d:\My Server\xampp\htdocs\seleno_backend_api\
   ```

2. **Database Configuration**:
   - The API automatically creates the database and tables on first use
   - Default MySQL credentials (update in `config/Database.php` if needed):
     ```php
     $host = 'localhost';
     $dbname = 'selen_restaurant';
     $username = 'root';
     $password = '';
     ```

3. **Access the API**:
   ```
   http://localhost/seleno_backend_api/
   ```

## 🔧 .htaccess Configuration

The API includes a `.htaccess` file that provides:

- **URL Rewriting**: Access endpoints with or without `.php` extension
  - `/login` → `/login.php`
  - `/users/list` → `/users/list.php`
- **Security Headers**: XSS protection, content type sniffing prevention
- **CORS Support**: Cross-origin requests enabled
- **Compression**: GZIP compression for faster responses
- **Caching**: Optimized caching for static assets

**Both URL formats work:**
```http
GET /users/list
GET /users/list.php
```

## 🔐 Authentication

### Login
```http
POST /login
Content-Type: application/json

{
  "email": "admin@mail.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "userid": 1,
    "role": "Admin",
    "names": "John Doe",
    "token": "eyJ1c2VyaWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJ0aW1lc3RhbXAiOjE3MzU5NjAwMDAsImV4cGlyZXMiOjE3MzYwNDY0MDB9",
    "token_type": "Bearer"
  }
}
```

### Using the API with Authentication

**Include the token in all API requests (except login):**
```http
Authorization: Bearer eyJ1c2VyaWQiOjEsImVtYWlsIjoiYWRtaW5AbWFpbC5jb20iLCJyb2xlIjoiQWRtaW4iLCJ0aW1lc3RhbXAiOjE3MzU5NjAwMDAsImV4cGlyZXMiOjE3MzYwNDY0MDB9
```

**Example authenticated request:**
```http
GET /users/list
Authorization: Bearer YOUR_TOKEN_HERE
```

### Authentication Notes
- ✅ **Login endpoint**: No authentication required
- 🔒 **All other endpoints**: Require Bearer token in Authorization header
- ⏰ **Token expiry**: 24 hours from login
- 🚫 **Invalid/expired tokens**: Will return 401 Unauthorized

## 📚 API Endpoints

### 👥 User Management

#### 1. Add User
```http
POST /users/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john@mail.com",
  "user_role": "Admin",
  "user_status": "active",
  "user_phone": "0780019550",
  "password": "123456"
}
```

#### 2. List Users
```http
GET /users/list
Authorization: Bearer YOUR_TOKEN_HERE
```

#### 3. Update User
```http
PUT /users/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "userid": 1,
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@mail.com",
  "user_role": "Manager",
  "user_status": "active",
  "user_phone": "0780019550"
}
```

#### 4. Delete User
```http
DELETE /users/delete?userid=1
Authorization: Bearer YOUR_TOKEN_HERE
```

### 📦 Inventory Management

#### Stock Categories
```http
# Add
POST /inventory/stock-category/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stockcat_name": "Vegetables",
  "stockcat_status": "active"
}

# List
GET /inventory/stock-category/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /inventory/stock-category/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stockcat_id": 1,
  "stockcat_name": "Fresh Vegetables",
  "stockcat_status": "active"
}

# Delete
DELETE /inventory/stock-category/delete?stockcat_id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Stock Groups
```http
# Add
POST /inventory/stock-group/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "group_name": "Fresh Items",
  "group_desc": "Daily fresh produce",
  "status": "active"
}

# List
GET /inventory/stock-group/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /inventory/stock-group/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "group_id": 1,
  "group_name": "Fresh Daily Items",
  "group_desc": "Updated description",
  "status": "active"
}

# Delete
DELETE /inventory/stock-group/delete?group_id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Stock Item Categories
```http
# Add
POST /inventory/stock-item-category/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stockcat_id": 1,
  "group_id": 1,
  "name": "Tomatoes",
  "status": "active"
}

# List
GET /inventory/stock-item-category/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /inventory/stock-item-category/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stock_item_cat_id": 1,
  "name": "Fresh Tomatoes",
  "status": "active"
}

# Delete
DELETE /inventory/stock-item-category/delete?id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Stocks
```http
# Add
POST /inventory/stocks/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stock_item_cat_id": 1,
  "stock_name": "Fresh Tomatoes",
  "stock_qty": 50,
  "stock_status": "available"
}

# List
GET /inventory/stocks/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /inventory/stocks/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stock_id": 1,
  "stock_name": "Tomatoes Box",
  "stock_status": "available"
}

# Delete
DELETE /inventory/stocks/delete?stock_id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Stock IN
```http
POST /inventory/stockin/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stock_id": 1,
  "stockin_qty": 20,
  "stockin_price_init": 5000,
  "userid": 1
}
```

#### Stock OUT
```http
POST /inventory/stockout/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "stock_id": 1,
  "stockout_qty": 5,
  "userid": 1
}
```

### 🍽️ Menu Management

#### Menu Category Groups
```http
# Add
POST /menu/category-group/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "menu_cat_group_name": "Main Course",
  "menu_cat_group_desc": "Main dishes"
}

# List
GET /menu/category-group/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /menu/category-group/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "menu_cat_group_id": 1,
  "menu_cat_group_name": "Main Courses",
  "menu_cat_group_desc": "Updated description"
}

# Delete
DELETE /menu/category-group/delete?id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Menu Categories
```http
# Add
POST /menu/category/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "menu_cat_group_id": 1,
  "name": "Lunch"
}

# List
GET /menu/category/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /menu/category/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "menu_cat_id": 1,
  "menu_cat_name": "Dinner",
  "menu_cat_desc": "Evening meals"
}

# Delete
DELETE /menu/category/delete?id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Menus
```http
# Add
POST /menu/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "menu_cat_id": 1,
  "menu_name": "Chicken Rice",
  "menu_price": 3500,
  "menu_status": "available"
}

# List
GET /menu/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /menu/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "menu_id": 1,
  "menu_name": "Chicken Fried Rice",
  "menu_price": 4000,
  "menu_status": "available"
}

# Delete
DELETE /menu/delete?id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Menu Items (Ingredients)
```http
POST /menu/items/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "menu_id": 1,
  "stock_id": 2,
  "menu_item_name": "Rice"
}
```

### 🪑 Tables Management

#### Table Groups
```http
# Add
POST /tables/group/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "table_group_name": "VIP"
}

# List
GET /tables/group/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /tables/group/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "table_group_id": 1,
  "table_group_name": "Premium"
}

# Delete
DELETE /tables/group/delete?id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Tables
```http
# Add
POST /tables/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "table_group_id": 1,
  "table_desc": "VIP Table 1"
}

# List
GET /tables/list
Authorization: Bearer YOUR_TOKEN_HERE
```

### 📋 Orders Management

#### Order Types
```http
# Add
POST /orders/type/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "order_type_name": "Dine In",
  "order_type_status": "active"
}

# List
GET /orders/type/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /orders/type/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "order_type_id": 1,
  "order_type_name": "Take Away",
  "order_type_status": "active"
}

# Delete
DELETE /orders/type/delete?id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Special Orders
```http
# Add
POST /orders/special/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "special_order_name": "Extra Cheese",
  "special_order_desc": "Add extra cheese",
  "special_order_price": 200,
  "special_order_status": "active"
}

# List
GET /orders/special/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update
PUT /orders/special/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "special_order_id": 1,
  "special_order_name": "Double Cheese",
  "special_order_price": 300
}

# Delete
DELETE /orders/special/delete?id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Orders
```http
# Create Order
POST /orders/create
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "order_type_id": 1,
  "userid": 2,
  "table_id": 3
}

# List Orders
GET /orders/list
Authorization: Bearer YOUR_TOKEN_HERE

# Update Order Status
PUT /orders/update
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "order_id": 10,
  "order_status": "completed"
}

# Delete Order
DELETE /orders/delete?order_id=10
Authorization: Bearer YOUR_TOKEN_HERE
```

#### Order Items
```http
POST /orders/items/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "order_id": 10,
  "menu_id": 5,
  "order_qty": 2,
  "order_item_price": 7000
}
```

### 💳 Payments

#### Add Payment
```http
POST /payments/add
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE

{
  "order_id": 10,
  "payment_method": "cash",
  "amount_paid": 7000
}
```

#### Check Payment Status
```http
GET /payments/status?order_id=10
Authorization: Bearer YOUR_TOKEN_HERE
```

## 📊 Reports

### Sales Report
```http
GET /reports/sales?start_date=2024-01-01&end_date=2024-01-31&menu_id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

**Parameters:**
- `start_date`: Start date (YYYY-MM-DD) - optional, shows all data if not provided
- `end_date`: End date (YYYY-MM-DD) - optional, shows all data if not provided  
- `menu_id`: Filter by specific menu item (optional)

**Response:**
```json
{
  "status": "success",
  "data": {
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "total_sales": 125000,
    "menu_sales": [
      {
        "menu_name": "Chicken Rice",
        "quantity": 25,
        "revenue": 87500
      },
      {
        "menu_name": "Coca Cola",
        "quantity": 30,
        "revenue": 37500
      }
    ],
    "daily_sales": {
      "2024-01-15": 45000,
      "2024-01-16": 38000,
      "2024-01-17": 42000
    }
  }
}
```

**Note:** If no date parameters are provided, the report shows all historical sales data.

### Inventory Report
```http
GET /reports/inventory
Authorization: Bearer YOUR_TOKEN_HERE
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "total_items": 15,
    "low_stock_items": [
      {
        "stock_id": 2,
        "stock_name": "Red Apples",
        "stock_qty": 8,
        "stock_status": "available"
      }
    ],
    "out_of_stock_items": [
      {
        "stock_id": 5,
        "stock_name": "Milk",
        "stock_qty": 0,
        "stock_status": "unavailable"
      }
    ],
    "total_inventory_value": 250000
  }
}
```

**Returns:** Current stock levels, low stock alerts, out of stock items, and total inventory value.

### Stock Movement Report
```http
GET /reports/stock-movement?start_date=2024-01-01&end_date=2024-01-31&stock_id=1
Authorization: Bearer YOUR_TOKEN_HERE
```

**Parameters:**
- `start_date`: Start date (YYYY-MM-DD) - optional, shows all data if not provided
- `end_date`: End date (YYYY-MM-DD) - optional, shows all data if not provided
- `stock_id`: Filter by specific stock item (optional)

**Response:**
```json
{
  "status": "success",
  "data": {
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "movements": [
      {
        "date": "2024-01-15 10:30:00",
        "type": "IN",
        "stock_name": "Fresh Tomatoes",
        "quantity": 50,
        "user": "John Doe"
      },
      {
        "date": "2024-01-16 14:20:00",
        "type": "OUT",
        "stock_name": "Fresh Tomatoes",
        "quantity": 10,
        "user": "Jane Smith"
      }
    ]
  }
}
```

**Note:** If no date parameters are provided, the report shows all historical stock movements.

### Order Report
```http
GET /reports/orders?start_date=2024-01-01&end_date=2024-01-31&status=completed
Authorization: Bearer YOUR_TOKEN_HERE
```

**Parameters:**
- `start_date`: Start date (YYYY-MM-DD) - optional, shows all data if not provided
- `end_date`: End date (YYYY-MM-DD) - optional, shows all data if not provided
- `status`: Filter by order status (optional)

**Response:**
```json
{
  "status": "success",
  "data": {
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "total_orders": 45,
    "completed_orders": 42,
    "status_breakdown": {
      "pending": 2,
      "confirmed": 1,
      "preparing": 0,
      "ready": 0,
      "completed": 42,
      "cancelled": 0
    },
    "orders": [
      {
        "order_id": 10,
        "order_code": "ORD-202401-001",
        "order_status": "completed",
        "order_created_at": "2024-01-15 12:30:00",
        "order_type_name": "Dine In",
        "table_desc": "VIP Table 1",
        "user_names": "John Doe"
      }
    ]
  }
}
```

**Note:** If no date parameters are provided, the report shows all historical orders.

### Payment Report
```http
GET /reports/payments?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer YOUR_TOKEN_HERE
```

**Parameters:**
- `start_date`: Start date (YYYY-MM-DD) - optional, shows all data if not provided
- `end_date`: End date (YYYY-MM-DD) - optional, shows all data if not provided

**Response:**
```json
{
  "status": "success",
  "data": {
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "total_payments": 185000,
    "method_breakdown": {
      "cash": 125000,
      "card": 45000,
      "mobile": 15000
    },
    "payments": [
      {
        "payment_id": 15,
        "order_code": "ORD-202401-001",
        "payment_method": "cash",
        "amount_paid": 25000,
        "created_at": "2024-01-15 13:00:00",
        "user_names": "John Doe"
      }
    ]
  }
}
```

**Note:** If no date parameters are provided, the report shows all historical payments.

### User Activity Report
```http
GET /reports/user-activity?start_date=2024-01-01&end_date=2024-01-31
Authorization: Bearer YOUR_TOKEN_HERE
```

**Parameters:**
- `start_date`: Start date (YYYY-MM-DD) - optional, shows all data if not provided
- `end_date`: End date (YYYY-MM-DD) - optional, shows all data if not provided
**Response:**
```json
{
  "status": "success",
  "data": {
    "period": {
      "start": "2024-01-01",
      "end": "2024-01-31"
    },
    "total_users": 5,
    "active_users": 4,
    "user_activity": [
      {
        "user_id": 1,
        "user_names": "John Doe",
        "role_name": "admin",
        "last_login": "2024-01-30 09:15:00",
        "orders_created": 25,
        "payments_processed": 20
      }
    ]
  }
}
```
**Note:** If no date parameters are provided, the report shows all user statistics.

## ❌ Error Responses

All API endpoints return standardized error responses:

### Authentication Errors
```json
{
  "status": "error",
  "message": "Unauthorized access",
  "code": 401
}
```

### Validation Errors
```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "field_name": "This field is required"
  },
  "code": 422
}
```

### Not Found Errors
```json
{
  "status": "error",
  "message": "Resource not found",
  "code": 404
}
```

### Server Errors
```json
{
  "status": "error",
  "message": "Internal server error",
  "code": 500
}
```

## 🧪 Testing with Postman

### 1. Import Postman Collection

Create a new collection in Postman and import the following requests:

### 2. Environment Variables

Set up environment variables in Postman:
- `base_url`: `http://localhost/seleno_backend_api`
- `auth_token`: (will be set after login)

### 3. Sample Test Data

The API auto-creates sample data on first run:

#### Default Users:
- **Admin**: `admin@mail.com` / `123456`
- **Manager**: `manager@mail.com` / `123456`

#### Sample Data Created:
- 2 Stock Categories (Vegetables, Fruits)
- 2 Stock Groups (Fresh Items, Dairy)
- 2 Stock Item Categories
- 2 Stocks (Fresh Tomatoes, Red Apples)
- 2 Menu Category Groups (Main Course, Beverages)
- 2 Menu Categories (Lunch, Cold Drinks)
- 2 Menus (Chicken Rice, Coca Cola)
- 2 Table Groups (VIP, Standard)
- 2 Tables
- 2 Order Types (Dine In, Take Away)
- Sample Orders and Payments

### 4. Testing Steps

1. **Start XAMPP/WAMP** and ensure MySQL is running
2. **Open Postman** and create a new collection
3. **Test Login** first (no auth header needed):
   ```
   POST {{base_url}}/login
   Body: {
     "email": "admin@mail.com",
     "password": "123456"
   }
   ```
4. **Copy the token** from login response and set it as `auth_token` variable
5. **Test other endpoints** using the Authorization header:
   ```
   Authorization: Bearer {{auth_token}}
   ```
6. **Verify responses** match the expected JSON structure

### 5. Postman Authorization Setup

For each request (except login):
1. Go to **Authorization** tab
2. Select **Bearer Token**
3. Enter: `{{auth_token}}`

Or manually add header:
```
Authorization: Bearer {{auth_token}}
```

### 5. Common Test Scenarios

#### Inventory Flow:
1. Add Stock Category → Add Stock Group → Add Stock Item Category → Add Stock
2. Add Stock IN to increase quantity
3. Add Stock OUT to decrease quantity

#### Menu Flow:
1. Add Menu Category Group → Add Menu Category → Add Menu
2. Add Menu Items (ingredients) linking menu to stocks

#### Order Flow:
1. Create Order → Add Order Items → Add Payment → Check Payment Status

#### Complete Order Process:
1. Login as user
2. Create order with table and type
3. Add menu items to order
4. Process payment
5. Update order status to completed

## 📊 Response Formats

### Success Response
```json
{
  "status": "success",
  "data": [...],
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Detailed error message explaining what went wrong"
}
```

## 🎨 Frontend Dashboard

The API includes a complete frontend dashboard for testing and managing the restaurant system:

### Features:
- **Interactive API Testing**: Test all endpoints directly from the browser
- **Real-time Responses**: See JSON responses instantly
- **Authentication Management**: Login/logout with token persistence
- **Comprehensive Reports**: View all 6 report types with date filtering
- **Data Management**: Create, read, update, delete operations for all entities
- **Bootstrap UI**: Modern, responsive interface

### Accessing the Dashboard:
1. Start your web server (XAMPP/WAMP)
2. Open `seleno_frontend/dashboard.html` in your browser
3. Login with default credentials: `admin@mail.com` / `123456`
4. Navigate through different sections using the sidebar

### Dashboard Sections:
- **Authentication**: Login/logout functionality
- **Users**: Manage system users and roles
- **Inventory**: Stock categories, groups, items, and movements
- **Menu**: Menu categories, items, and pricing
- **Tables**: Table groups and table management
- **Orders**: Order creation, management, and status tracking
- **Payments**: Payment processing and history
- **Reports**: Comprehensive reporting with 6 different report types

### Testing All Endpoints:
The dashboard includes a "Test All Endpoints" button that automatically tests all API endpoints and displays the results in a structured format.

## 🔧 Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check MySQL is running
   - Verify credentials in `config/Database.php`

2. **404 Not Found**:
   - Ensure URL is correct
   - Check Apache rewrite rules if using clean URLs

3. **Foreign Key Errors**:
   - Ensure referenced records exist before creating dependent records
   - Example: Create stock category before stock item category

4. **Validation Errors**:
   - Check required fields are provided
   - Verify data types (numbers, emails, enums)

### Debug Mode:
Add this to any PHP file for debugging:
```php
ini_set('display_errors', 1);
error_reporting(E_ALL);
```

## 📋 API Features

- ✅ **Clean URLs**: Access endpoints with or without .php extension
- ✅ **Bearer Token Authentication**: Secure API access with JWT-like tokens
- ✅ **Automatic Database Setup**: Creates tables and sample data on first run
- ✅ **Input Validation**: Comprehensive validation with descriptive error messages
- ✅ **Security**: Password hashing, prepared statements, input sanitization
- ✅ **Foreign Key Constraints**: Maintains data integrity
- ✅ **RESTful Design**: Standard HTTP methods and status codes
- ✅ **JSON Responses**: Consistent API response format
- ✅ **OOP Architecture**: Clean, maintainable code structure
- ✅ **CORS Support**: Cross-origin requests enabled
- ✅ **Security Headers**: XSS protection, content type sniffing prevention
- ✅ **Reports**: Comprehensive reporting system for sales, inventory, orders, and payments
- ✅ **Frontend Dashboard**: Complete testing interface with Bootstrap UI

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify your Postman requests match the examples
3. Ensure database is properly set up
4. Check PHP error logs for server-side issues

---

**Version:** 1.0
**Last Updated:** January 2026
**Base URL:** `http://localhost/seleno_backend_api/`
**Authentication:** Bearer Token (except login)