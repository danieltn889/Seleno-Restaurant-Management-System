// src/pages/reports/UserActivityReport.jsx
import { useState, useEffect } from 'react';
import { getUserActivityReport } from '../../api/services/reports';
import Swal from 'sweetalert2';

const UserActivityReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    try {
      const response = await getUserActivityReport(filters);
      if (response.status === 'success') {
        setReportData(response.data);
      } else {
        Swal.fire('Error', response.message || 'Failed to load user activity report', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load user activity report', 'error');
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

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'waiter':
        return 'bg-green-100 text-green-800';
      case 'cashier':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">User Activity Report</h2>

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
          <p className="mt-4 text-gray-600">Loading user activity report...</p>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.total_users || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Active Users</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.active_users || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Report Period</h3>
              <p className="text-sm text-purple-600">
                {reportData.period?.start || 'All time'} - {reportData.period?.end || 'Present'}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900">Inactive Users</h3>
              <p className="text-2xl font-bold text-yellow-600">
                {(reportData.total_users || 0) - (reportData.active_users || 0)}
              </p>
            </div>
          </div>

          {/* User Activity Table */}
          {reportData.user_activity && reportData.user_activity.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Activity Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Name</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders Created</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payments Processed</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.user_activity.map((user, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.user_names}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role_name)}`}>
                            {user.role_name}
                          </span>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-blue-600 font-semibold">
                          {user.orders_created || 0}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-green-600 font-semibold">
                          {user.payments_processed || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Activity Summary */}
          {reportData.user_activity && reportData.user_activity.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {reportData.user_activity.reduce((sum, user) => sum + (user.orders_created || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Orders Created</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {reportData.user_activity.reduce((sum, user) => sum + (user.payments_processed || 0), 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Payments Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {reportData.user_activity.filter(user => user.last_login).length}
                  </div>
                  <div className="text-sm text-gray-600">Users Who Logged In</div>
                </div>
              </div>
            </div>
          )}

          {/* No Data Message */}
          {(!reportData.user_activity || reportData.user_activity.length === 0) && (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No user activity data found for the selected period.</p>
            </div>
          )}

          {/* User Role Distribution */}
          {reportData.user_activity && reportData.user_activity.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">User Role Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['admin', 'manager', 'waiter', 'cashier'].map(role => {
                  const count = reportData.user_activity.filter(user => user.role_name?.toLowerCase() === role).length;
                  return (
                    <div key={role} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                      <div className="text-sm text-gray-600 capitalize">{role}s</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">No user activity data available</p>
        </div>
      )}
    </div>
  );
};

export default UserActivityReport;