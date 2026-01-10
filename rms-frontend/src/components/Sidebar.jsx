import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FaUserCircle, FaUsers, FaBox, FaUtensils, FaTable, 
  FaMoneyCheck, FaClipboardList, FaAngleDown, FaTimes,FaTachometerAlt,
  FaChartBar
} from "react-icons/fa";

export default function Sidebar({ user, sidebarOpen, setSidebarOpen }) {
  if (!user) return null;

  // Keep state persistent even if sidebarOpen changes
  const [dropdowns, setDropdowns] = useState({
    users: false,
    inventory: false,
    stock: false,
    menu: false,
    table: false,
    orders: false,
  });

  const toggleDropdown = (key) => {
    setDropdowns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300 ${sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} 
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`bg-white shadow-lg inset-y-0 left-0 w-64 flex flex-col transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0
        fixed md:static z-40`}>
        
        {/* Header with X for mobile */}
        <div className="px-6 py-4 flex justify-between items-center border-b  bg-amber-800 text-white">
          <div className="text-center flex flex-col items-center">
            <FaUserCircle className="w-16 h-16 mx-auto" />
            <h2 className="mt-2 font-bold text-lg">{user.names}</h2>
            <p className="text-sm">{user.role}</p>
          </div>
          <button className="md:hidden text-white text-xl" onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-auto">
              <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"> <FaTachometerAlt /> DashBoard</Link>
          {/* Users */}
          <button 
            onClick={() => toggleDropdown("users")} 
            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2"><FaUsers /> Users</div>
            <FaAngleDown className={`${dropdowns.users ? "rotate-180" : "rotate-0"} transition-transform`} />
          </button>
          <div className={`pl-8 flex flex-col space-y-1 mt-1 overflow-hidden transition-all duration-300 ${dropdowns.users ? "max-h-40" : "max-h-0"}`}>
            {/* <Link to="/users/add" className="text-gray-600 hover:text-blue-600">Add User</Link> */}
            <Link to="/users/list" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">View Users</Link>
          </div>

          {/* Inventory */}
          <button 
            onClick={() => toggleDropdown("inventory")} 
            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2"><FaBox /> Inventory</div>
            <FaAngleDown className={`${dropdowns.inventory ? "rotate-180" : "rotate-0"} transition-transform`} />
          </button>
          <div className={`pl-8 flex flex-col space-y-1 mt-1 overflow-hidden transition-all duration-300 ${dropdowns.inventory ? "max-h-40" : "max-h-0"}`}>
            <Link to="/inventory/stock-category" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Stock Categories</Link>
            <Link to="/inventory/stock-item-category-group" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Items Category Group</Link>
            <Link to="/inventory/stock-item-category" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Stock item category</Link>
          </div>
          
           {/* Stock */}
          <button 
            onClick={() => toggleDropdown("stock")} 
            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2"><FaBox /> Stock Operation</div>
            <FaAngleDown className={`${dropdowns.stock ? "rotate-180" : "rotate-0"} transition-transform`} />
          </button>
          <div className={`pl-8 flex flex-col space-y-1 mt-1 overflow-hidden transition-all duration-300 ${dropdowns.stock ? "max-h-40" : "max-h-0"}`}>
            <Link to="/inventory/stock" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Stock Availabe</Link>
            <Link to="/inventory/stock-in" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Stock in</Link>
            <Link to="/inventory/stock-out" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Stock out</Link>
          </div>

          {/* Menu */}
          <button 
            onClick={() => toggleDropdown("menu")} 
            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2"><FaUtensils /> Menu</div>
            <FaAngleDown className={`${dropdowns.menu ? "rotate-180" : "rotate-0"} transition-transform`} />
          </button>
          <div className={`pl-8 flex flex-col space-y-1 mt-1 overflow-hidden transition-all duration-300 ${dropdowns.menu ? "max-h-40" : "max-h-0"}`}>
            <Link to="/menu/menu-category-group" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Menu Group</Link>
            <Link to="/menu/menu-category" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Menu Category</Link>
            <Link to="/menu/menu" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Menu</Link>
            <Link to="/menu/menu-items" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Menu Items</Link>

          </div>


          
          {/* tables */}
          <button 
            onClick={() => toggleDropdown("table")} 
            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2"><FaTable /> Tables</div>
            <FaAngleDown className={`${dropdowns.table ? "rotate-180" : "rotate-0"} transition-transform`} />
          </button>
          <div className={`pl-8 flex flex-col space-y-1 mt-1 overflow-hidden transition-all duration-300 ${dropdowns.table ? "max-h-40" : "max-h-0"}`}>
            <Link to="/table/table-groups" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Table Group</Link>
            <Link to="/table/table-data" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Table Available</Link>
          </div>



          {/* Orders */}
          <button 
            onClick={() => toggleDropdown("orders")} 
            className="flex items-center justify-between w-full px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-2"><FaClipboardList /> Orders</div>
            <FaAngleDown className={`${dropdowns.orders ? "rotate-180" : "rotate-0"} transition-transform`} />
          </button>
          <div className={`pl-8 flex flex-col space-y-1 mt-1 overflow-hidden transition-all duration-300 ${dropdowns.orders ? "max-h-40" : "max-h-0"}`}>
            <Link to="/orders/order-type" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Order type</Link>
            <Link to="/orders/order-special" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Special Order</Link>
            <Link to="/orders/pos" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Make Order</Link>
            <Link to="/orders/report" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Report</Link>
            <Link to="/orders/approval" onClick={() => setSidebarOpen(false)} className="text-gray-600 hover:text-blue-600">Approval</Link>
          </div>
          {/* Other links */}
          <Link to="/reports" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"><FaChartBar /> Reports</Link>
          <Link to="#" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded hover:bg-gray-100 transition"><FaMoneyCheck /> Payments</Link>
        </nav>
      </aside>
    </>
  );
}
