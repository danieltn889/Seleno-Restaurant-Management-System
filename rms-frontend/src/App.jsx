import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthContext } from "./context/AuthContext";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AddUser from "./pages/users/AddUser";
import ListUsers from "./pages/users/ListUsers";
import EditUser from "./pages/users/EditUser";
import StockCategory from "./pages/inventory/StockCategory";
import StockItemCategoryGroup from "./pages/inventory/StockItemCategoryGroup";
import StockItemCategory from "./pages/inventory/StockItemCategory";
import Stocks from "./pages/inventory/Stocks";
import StockIn from "./pages/inventory/StockIn";
import StockOut from "./pages/inventory/StockOut";

// menus
import MenuCategoryGroup from "./pages/menu/MenuCategoryGroup";
import MenuCategory from "./pages/menu/MenuCategory";
import Menu from "./pages/menu/Menu";
import MenuItems from "./pages/menu/MenuItems";
// end menus


// tables
import TableGroup from "./pages/table/TableGroup";
import Tables from "./pages/table/Tables";
// end of tables

// orders 
import OrderType from "./pages/orders/OrderType";
import SpecialOrder from "./pages/orders/SpecialOrder";
import Orders from "./pages/orders/Orders";
import OrdersReport from "./pages/orders/OrdersReport";
import OrderApproval from "./pages/orders/OrderApproval";

// end of orders

// API Test
import ApiTest from "./pages/ApiTest";

// Reports
import Reports from "./pages/reports/Reports";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      
      {/* API Test Route - Available without login for testing */}
      <Route path="/api-test" element={<ApiTest />} />

      {/* Protected routes */}
      <Route
        path="/"
        element={user ? <Layout user={user}><Dashboard /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/add"
        element={user ? <Layout user={user}><AddUser /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/list"
        element={user ? <Layout user={user}><ListUsers /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/users/edit/:id"
        element={user ? <Layout user={user}><EditUser /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/inventory/stock-category"
        element={user ? <Layout user={user}><StockCategory /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/inventory/stock-item-category-group"
        element={user ? <Layout user={user}><StockItemCategoryGroup /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/inventory/stock-item-category"
        element={user ? <Layout user={user}><StockItemCategory /></Layout> : <Navigate to="/login" replace />}
      />

       <Route
        path="/inventory/stock"
        element={user ? <Layout user={user}><Stocks /></Layout> : <Navigate to="/login" replace />}
      />
       <Route
        path="/inventory/stock-in"
        element={user ? <Layout user={user}><StockIn /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/inventory/stock-out"
        element={user ? <Layout user={user}><StockOut /></Layout> : <Navigate to="/login" replace />}
      />


      {/* menus */}
       <Route
        path="/menu/menu-category-group"
        element={user ? <Layout user={user}><MenuCategoryGroup /></Layout> : <Navigate to="/login" replace />}
      />
       <Route
        path="/menu/menu-category"
        element={user ? <Layout user={user}><MenuCategory /></Layout> : <Navigate to="/login" replace />}
      />

        <Route
        path="/menu/menu"
        element={user ? <Layout user={user}><Menu /></Layout> : <Navigate to="/login" replace />}
      />
        <Route
        path="/menu/menu-items"
        element={user ? <Layout user={user}><MenuItems /></Layout> : <Navigate to="/login" replace />}
      />
      {/* end menu */}


      {/* Tables */}

       <Route
        path="/table/table-groups"
        element={user ? <Layout user={user}><TableGroup /></Layout> : <Navigate to="/login" replace />}
      />

      <Route
        path="/table/table-data"
        element={user ? <Layout user={user}><Tables /></Layout> : <Navigate to="/login" replace />}
      />
      {/* end of tables */}

      {/* orders */}
      <Route
        path="/orders/order-type"
        element={user ? <Layout user={user}><OrderType /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/orders/order-special"
        element={user ? <Layout user={user}><SpecialOrder /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/orders/pos"
        element={user ? <Layout user={user}><Orders /></Layout> : <Navigate to="/login" replace />}
      />
      <Route
        path="/orders/report"
        element={user ? <Layout user={user}><OrdersReport /></Layout> : <Navigate to="/login" replace />}
      />
       <Route
        path="/orders/approval"
        element={user ? <Layout user={user}><OrderApproval /></Layout> : <Navigate to="/login" replace />}
      />
      {/* end of orders */}


      {/* Reports */}
      <Route
        path="/reports"
        element={user ? <Layout user={user}><Reports /></Layout> : <Navigate to="/login" replace />}
      />

      {/* Fallback */}
      <Route
        path="*"
        element={user ? <Layout user={user}><Dashboard /></Layout> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
