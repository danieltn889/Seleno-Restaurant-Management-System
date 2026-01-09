// src/pages/reports/InventoryReport.jsx
import { useState, useEffect } from 'react';
import { getInventoryReport } from '../../api/services/reports';
import Swal from 'sweetalert2';

const InventoryReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getInventoryReport();
      if (response.status === 'success') {
        setReportData(response.data);
      } else {
        Swal.fire('Error', response.message || 'Failed to load inventory report', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load inventory report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Inventory Report</h2>
        <button
          onClick={fetchReport}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Report'}
        </button>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading inventory report...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Items</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.total_items || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900">Low Stock Items</h3>
              <p className="text-2xl font-bold text-yellow-600">{reportData.low_stock_items?.length || 0}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-900">Out of Stock</h3>
              <p className="text-2xl font-bold text-red-600">{reportData.out_of_stock_items?.length || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Total Value</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.total_inventory_value || 0)}</p>
            </div>
          </div>

          {/* Low Stock Items */}
          {reportData.low_stock_items && reportData.low_stock_items.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Low Stock Alert (≤ 10 items)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-yellow-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.low_stock_items.map((item, index) => (
                      <tr key={index} className="bg-yellow-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.stock_name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.stock_qty}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Low Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Out of Stock Items */}
          {reportData.out_of_stock_items && reportData.out_of_stock_items.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Out of Stock Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-red-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.out_of_stock_items.map((item, index) => (
                      <tr key={index} className="bg-red-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{item.stock_name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.stock_qty}</td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Out of Stock
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inventory Status Summary */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Inventory Health Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {reportData.total_items - (reportData.low_stock_items?.length || 0) - (reportData.out_of_stock_items?.length || 0)}
                </div>
                <div className="text-sm text-gray-600">Healthy Stock Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {reportData.low_stock_items?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Low Stock Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {reportData.out_of_stock_items?.length || 0}
                </div>
                <div className="text-sm text-gray-600">Out of Stock Items</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No inventory data available</p>
        </div>
      )}
    </div>
  );
};

export default InventoryReport;