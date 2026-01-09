// src/pages/reports/PaymentReport.jsx
import { useState, useEffect } from 'react';
import { getPaymentReport } from '../../api/services/reports';
import Swal from 'sweetalert2';

const PaymentReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getPaymentReport(filters);
      if (response.status === 'success') {
        setReportData(response.data);
      } else {
        Swal.fire('Error', response.message || 'Failed to load payment report', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load payment report', 'error');
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

  const getPaymentMethodColor = (method) => {
    switch (method?.toLowerCase()) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'mobile':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Report</h2>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
          <p className="mt-4 text-gray-600">Loading payment report...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Payments</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.total_payments || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Total Amount</h3>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.total_amount || 0)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Report Period</h3>
              <p className="text-sm text-purple-600">
                {reportData.period?.start || 'All time'} - {reportData.period?.end || 'Present'}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900">Payment Methods</h3>
              <p className="text-2xl font-bold text-yellow-600">{reportData.method_breakdown ? Object.keys(reportData.method_breakdown).length : 0}</p>
            </div>
          </div>

          {/* Payment Method Breakdown */}
          {reportData.method_breakdown && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Methods Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(reportData.method_breakdown).map(([method, amount]) => (
                  <div key={method} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 capitalize">{method}</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(amount)}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentMethodColor(method)}`}>
                        {method}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Table */}
          {reportData.payments && reportData.payments.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Code</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.payments.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.order_code}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentMethodColor(payment.payment_method)}`}>
                            {payment.payment_method}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-green-600">
                          {formatCurrency(payment.amount_paid)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {payment.user_names}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.created_at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {(!reportData.payments || reportData.payments.length === 0) && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No payments found for the selected period.</p>
            </div>
          )}

          {/* Payment Summary */}
          {reportData.payments && reportData.payments.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(reportData.total_amount || 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {reportData.total_payments || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Transactions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {reportData.payments.length > 0 ? formatCurrency((reportData.total_amount || 0) / reportData.payments.length) : formatCurrency(0)}
                  </div>
                  <div className="text-sm text-gray-600">Average Transaction</div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No payment data available</p>
        </div>
      )}
    </div>
  );
};

export default PaymentReport;