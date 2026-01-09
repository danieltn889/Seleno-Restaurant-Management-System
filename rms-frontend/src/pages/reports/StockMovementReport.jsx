// src/pages/reports/StockMovementReport.jsx
import { useState, useEffect } from 'react';
import { getStockMovementReport } from '../../api/services/reports';
import Swal from 'sweetalert2';

const StockMovementReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    stock_id: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getStockMovementReport(filters);
      if (response.status === 'success') {
        setReportData(response.data);
      } else {
        Swal.fire('Error', response.message || 'Failed to load stock movement report', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load stock movement report', 'error');
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

  const getMovementTypeColor = (type) => {
    switch (type) {
      case 'IN':
        return 'bg-green-100 text-green-800';
      case 'OUT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stock Movement Report</h2>

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
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Item</label>
            <input
              type="text"
              name="stock_id"
              placeholder="Stock ID (optional)"
              value={filters.stock_id}
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
          <p className="mt-4 text-gray-600">Loading stock movement report...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Report Period</h3>
            <p className="text-blue-700">
              {reportData.period?.start || 'All time'} - {reportData.period?.end || 'Present'}
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Total movements: {reportData.movements?.length || 0}
            </p>
          </div>

          {/* Movements Table */}
          {reportData.movements && reportData.movements.length > 0 ? (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Stock Movements</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.movements.map((movement, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {new Date(movement.date).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMovementTypeColor(movement.type)}`}>
                            {movement.type}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {movement.stock_name}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          <span className={`font-semibold ${movement.type === 'IN' ? 'text-green-600' : 'text-red-600'}`}>
                            {movement.type === 'IN' ? '+' : '-'}{movement.quantity}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {movement.user}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No stock movements found for the selected period.</p>
            </div>
          )}

          {/* Movement Summary */}
          {reportData.movements && reportData.movements.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Movement Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {reportData.movements.filter(m => m.type === 'IN').length}
                  </div>
                  <div className="text-sm text-gray-600">Stock IN Movements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">
                    {reportData.movements.filter(m => m.type === 'OUT').length}
                  </div>
                  <div className="text-sm text-gray-600">Stock OUT Movements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {reportData.movements.reduce((sum, m) => sum + parseInt(m.quantity), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Items Moved</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No stock movement data available</p>
        </div>
      )}
    </div>
  );
};

export default StockMovementReport;