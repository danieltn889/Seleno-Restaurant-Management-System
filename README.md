# 🍽️ Seleno Restaurant Management System

A complete restaurant management solution with modern web technologies, featuring both backend API and frontend dashboard for comprehensive restaurant operations.

## 📋 Overview

**Seleno RMS** is a full-featured restaurant management system that includes:

- **👥 User Management**: Multi-role user system (Admin, Manager, Staff)
- **📦 Inventory Management**: Stock tracking, categories, and reporting
- **🍽️ Menu Management**: Dynamic menu with categories and pricing
- **🪑 Table Management**: Table and group management for reservations
- **📋 Order Management**: Complete order processing and tracking
- **💰 Payment Processing**: Multiple payment methods with status tracking
- **📊 Advanced Reporting**: Sales, inventory, and user activity reports
- **🎛️ API Dashboard**: Interactive API testing interface

## 🏗️ Architecture

### Backend (seleno_backend/)
- **Framework**: PHP 7.4+ with MVC Architecture
- **Database**: MySQL with PDO
- **Authentication**: JWT Bearer tokens
- **API**: RESTful endpoints with JSON responses

### Frontend (seleno_frontend/)
- **Interface**: Bootstrap 5.3.0 + Custom CSS
- **JavaScript**: Vanilla JS with API integration
- **Features**: Interactive dashboard with modal forms

## 🚀 Quick Start

### Prerequisites
- **PHP**: 7.4 or higher
- **MySQL**: 5.7 or higher
- **Web Server**: Apache/Nginx (XAMPP recommended for Windows)
- **Browser**: Modern browser with JavaScript enabled

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/yourusername/SRMS.git
   cd SRMS
   ```

2. **Setup Backend**:
   ```bash
   # Navigate to backend directory
   cd seleno_backend

   # Database will auto-create on first API call
   # Default credentials in config/Database.php:
   # Host: localhost, DB: selen_restaurant, User: root, Pass: ''
   ```

3. **Setup Frontend**:
   ```bash
   # Frontend is ready to use - no additional setup needed
   # Access via web server at: seleno_frontend/
   ```

4. **Access the System**:
   - **API Endpoints**: `http://localhost/SRMS/seleno_backend/`
   - **Dashboard**: `http://localhost/SRMS/seleno_frontend/`

## 🔐 Default Login Credentials

```
Email: admin@mail.com
Password: 123456
Role: Admin
```

## 📁 Project Structure

```
SRMS/
├── seleno_backend/          # PHP REST API
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── models/            # Data models
│   ├── core/              # Router & core classes
│   ├── middleware/        # Authentication middleware
│   ├── routes/            # API routes
│   └── index.php          # API entry point
│
├── seleno_frontend/        # Web Dashboard
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript files
│   ├── dashboard.html     # Main dashboard
│   ├── index.html         # Login page
│   └── .htaccess          # URL rewriting
│
└── README.md              # This file
```

## 🔧 Key Features

### Backend API
- ✅ **RESTful Design**: Clean, consistent API endpoints
- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **MVC Architecture**: Organized, maintainable code structure
- ✅ **PDO Database**: Secure database interactions
- ✅ **Auto Database Setup**: Automatic table creation
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **CORS Support**: Cross-origin request handling

### Frontend Dashboard
- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Interactive Modals**: Modern UI with modal forms
- ✅ **Real-time API Testing**: Built-in API tester interface
- ✅ **Dynamic Navigation**: Sidebar-controlled content sections
- ✅ **Bootstrap 5.3**: Modern CSS framework
- ✅ **JavaScript Integration**: Seamless API communication

### Business Features
- ✅ **Multi-user System**: Role-based access control
- ✅ **Inventory Tracking**: Stock management with categories
- ✅ **Menu Management**: Dynamic menu with categories
- ✅ **Order Processing**: Complete order lifecycle
- ✅ **Payment Handling**: Multiple payment methods
- ✅ **Table Management**: Table and reservation system
- ✅ **Reporting System**: Comprehensive business reports

## 📊 API Endpoints

### Authentication
- `POST /login` - User authentication
- `POST /logout` - User logout

### User Management
- `GET /users/list` - List all users
- `POST /users/add` - Add new user
- `PUT /users/update` - Update user
- `DELETE /users/delete` - Delete user

### Inventory Management
- `GET /inventory/stocks/list` - List stock items
- `POST /inventory/stocks/add` - Add stock item
- `GET /inventory/stock-category/list` - List categories
- `POST /inventory/stock-category/add` - Add category

### Menu Management
- `GET /menu/list` - List menu items
- `POST /menu/add` - Add menu item
- `GET /menu/category/list` - List menu categories
- `POST /menu/category/add` - Add menu category

### Order Management
- `GET /orders/list` - List orders
- `POST /orders/create` - Create new order
- `GET /orders/type/list` - List order types
- `POST /orders/type/add` - Add order type

### Payment System
- `GET /payments/list` - List payments
- `POST /payments/add` - Add payment
- `GET /payments/status` - Check payment status

### Reporting
- `GET /reports/sales` - Sales reports
- `GET /reports/inventory` - Inventory reports
- `GET /reports/stock-movement` - Stock movement reports
- `GET /reports/orders` - Order reports
- `GET /reports/payments` - Payment reports
- `GET /reports/user-activity` - User activity reports

## 🎨 Dashboard Features

### Navigation
- **Sidebar Navigation**: Click sections to show/hide content
- **Active Indicators**: Visual feedback for current section
- **Responsive Design**: Adapts to different screen sizes

### Interactive Elements
- **Modal Forms**: Add/edit/delete operations in modals
- **Dynamic Dropdowns**: Auto-populated select options
- **Real-time Updates**: Live API response display
- **Form Validation**: Client-side input validation

### API Testing
- **Built-in Tester**: Test all endpoints directly
- **Response Display**: Formatted JSON responses
- **Request History**: Track API calls
- **Error Handling**: Clear error messages

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Secure password storage
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: PDO prepared statements
- **XSS Protection**: Security headers
- **CORS Configuration**: Controlled cross-origin access

## 📈 Recent Improvements

- ✅ **Modal-based CRUD**: Consistent UI/UX with modal forms
- ✅ **Sidebar Navigation**: Single-section display system
- ✅ **Payment Status Fix**: Correct payment status responses
- ✅ **Layout Optimization**: Integrated API responses
- ✅ **Code Organization**: Clean, maintainable structure

## 🛠️ Development

### Database Schema
The system includes automatic database setup with tables for:
- Users, Roles, Sessions
- Inventory (Stocks, Categories, Items)
- Menu (Items, Categories, Groups)
- Orders (Orders, Items, Types)
- Payments, Tables, Reports

### API Response Format
```json
{
  "status": "success|error",
  "message": "Response message",
  "data": { /* Response data */ }
}
```

### Error Handling
```json
{
  "status": "error",
  "message": "Error description",
  "data": null
}
```

## 📞 Support

For issues or questions:
1. Check the API documentation in `seleno_backend/README.md`
2. Test endpoints using the dashboard API tester
3. Review database logs for errors
4. Check PHP error logs

## 📄 License

This project is open source and available under the MIT License.

---

**🍽️ Seleno Restaurant Management System** - Complete restaurant operations made simple!</content>
<parameter name="filePath">d:\My Server\xampp\htdocs\SRMS\README.md