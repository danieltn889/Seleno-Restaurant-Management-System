// src/pages/reports/Reports.jsx
import { useState } from 'react';
import SalesReport from './SalesReport';
import InventoryReport from './InventoryReport';
import StockMovementReport from './StockMovementReport';
import OrdersReport from './OrdersReport';
import PaymentReport from './PaymentReport';
import UserActivityReport from './UserActivityReport';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('sales');

  const reportTabs = [
    { id: 'sales', name: 'Sales Report', component: SalesReport },
    { id: 'inventory', name: 'Inventory Report', component: InventoryReport },
    { id: 'stock-movement', name: 'Stock Movement', component: StockMovementReport },
    { id: 'orders', name: 'Orders Report', component: OrdersReport },
    { id: 'payments', name: 'Payment Report', component: PaymentReport },
    { id: 'user-activity', name: 'User Activity', component: UserActivityReport },
  ];

  const ActiveComponent = reportTabs.find(tab => tab.id === activeReport)?.component;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports Dashboard</h1>
        <p className="text-gray-600">Comprehensive reporting system for restaurant management</p>
      </div>

      {/* Report Navigation Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {reportTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeReport === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Active Report Component */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default Reports;