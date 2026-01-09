// src/pages/reports/SalesReport.jsx
import { useState, useEffect } from 'react';
import { getSalesReport } from '../../api/services/reports';
import Swal from 'sweetalert2';

const SalesReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    menu_id: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getSalesReport(filters);
      if (response.status === 'success') {
        setReportData(response.data);
      } else {
        Swal.fire('Error', response.message || 'Failed to load sales report', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load sales report', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'RWF'
    }).format(amount);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Sales Report</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Menu Item</label>
            <input
              type="text"
              name="menu_id"
              placeholder="Menu ID (optional)"
              value={filters.menu_id}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales report...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Sales</h3>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(reportData.total_sales || 0)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Period</h3>
              <p className="text-sm text-green-600">
                {reportData.period?.start || 'All time'} - {reportData.period?.end || 'Present'}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Menu Items</h3>
              <p className="text-2xl font-bold text-purple-600">{reportData.menu_sales?.length || 0}</p>
            </div>
          </div>

          {/* Menu Sales Table */}
          {reportData.menu_sales && reportData.menu_sales.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Menu Item Sales</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Menu Item</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.menu_sales.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.menu_name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{formatCurrency(item.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Daily Sales Chart Placeholder */}
          {reportData.daily_sales && Object.keys(reportData.daily_sales).length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Daily Sales Trend</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-4">Daily sales data is available. Chart visualization can be implemented here.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(reportData.daily_sales).map(([date, amount]) => (
                    <div key={date} className="bg-white p-3 rounded border">
                      <p className="text-sm text-gray-600">{date}</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No data available</p>
        </div>
      )}
    </div>
  );
};

export default SalesReport;