import { useState } from 'react';
// Make sure this file actually exists in your project structure
import { 
  loginRequest,
  listUsers,
  listStockCategories,
  listMenuCategories,
  listTables,
  listOrders,
  getSalesReport
} from '../api/services';
import { API_BASE_URL } from '../api/config';

const ApiTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [loginData, setLoginData] = useState({
    email: 'admin@mail.com',
    password: '123456'
  });
  const [customEndpoint, setCustomEndpoint] = useState('');
  const [customMethod, setCustomMethod] = useState('GET');
  const [customData, setCustomData] = useState('{}');

  // 1. DEFINE TESTS FIRST (So runAllTests can see them)
  const tests = [
    {
      name: 'Connectivity Test',
      description: 'Check if API server is reachable',
      run: async () => {
        try {
          // Note: mode 'no-cors' returns an opaque response. You won't see status 200, but it won't throw if reachable.
          await fetch(API_BASE_URL, {
            method: 'HEAD',
            mode: 'no-cors'
          });
          return { status: 'success', message: 'Server is reachable' };
        } catch (error) {
          throw new Error('Cannot reach API server. Check your internet connection.');
        }
      }
    },
    {
      name: 'Login',
      description: 'Test authentication endpoint',
      run: () => loginRequest(loginData.email, loginData.password)
    },
    {
      name: 'List Users',
      description: 'Fetch all users',
      run: () => listUsers()
    },
    {
      name: 'List Stock Categories',
      description: 'Fetch stock categories',
      run: () => listStockCategories()
    },
    {
      name: 'List Menus',
      description: 'Fetch menu categories (not menu items)',
      run: () => listMenuCategories()
    },
    {
      name: 'List Tables',
      description: 'Fetch tables',
      run: () => listTables()
    },
    {
      name: 'List Orders',
      description: 'Fetch orders',
      run: () => listOrders()
    },
    {
      name: 'Sales Report',
      description: 'Get sales report',
      run: () => getSalesReport()
    }
  ];

  // 2. HELPER FUNCTIONS
  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: result?.status === 'success' || result?.status === 200 || result?.success === true, 
          data: result,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    } catch (error) {
      console.error(`Test ${testName} error:`, error);
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error.message || 'Unknown error',
          fullError: error,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    }
    setLoading(prev => ({ ...prev, [testName]: false }));
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.name, test.run);
    }
  };

  const runCustomTest = async () => {
    if (!customEndpoint.trim()) {
      alert('Please enter an endpoint');
      return;
    }

    const testName = `Custom: ${customMethod} ${customEndpoint}`;
    setLoading(prev => ({ ...prev, [testName]: true }));

    try {
      let data = null;
      if (customMethod !== 'GET' && customData.trim()) {
        try {
          data = JSON.parse(customData);
        } catch (e) {
          throw new Error('Invalid JSON in request data');
        }
      }

      const response = await fetch(`${API_BASE_URL}${customEndpoint}`, {
        method: customMethod,
        headers: {
          'Content-Type': 'application/json',
        },
        body: customMethod !== 'GET' ? JSON.stringify(data) : undefined,
        credentials: 'include'
      });

      const responseText = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(responseText);
      } catch (e) {
        parsedData = responseText;
      }

      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: response.ok, 
          data: parsedData,
          status: response.status,
          statusText: response.statusText,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    } catch (error) {
      setResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error.message,
          timestamp: new Date().toLocaleTimeString()
        } 
      }));
    }
    setLoading(prev => ({ ...prev, [testName]: false }));
  };

  // 3. UI HELPERS
  const getStatusIcon = (testName) => {
    const result = results[testName];
    if (loading[testName]) return '⏳';
    if (!result) return '⚪';
    return result.success ? '✅' : '❌';
  };

  const getStatusColor = (testName) => {
    const result = results[testName];
    if (loading[testName]) return 'bg-yellow-50 border-yellow-200';
    if (!result) return 'bg-gray-50 border-gray-200';
    return result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🧪 API Integration Test Suite
          </h1>
          <p className="text-gray-600 mb-4">
            Test all API endpoints to verify the integration is working correctly
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-blue-800 mb-2">API Configuration:</p>
            <p className="text-sm text-blue-700">
              <strong>Base URL:</strong> {API_BASE_URL}
            </p>
            <p className="text-sm text-blue-700">
              <strong>Auth Type:</strong> Session-based (cookies)
            </p>
            <p className="text-sm text-blue-700">
              <strong>Status:</strong> 
              <span className="ml-2 px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                Tests Failing - Check Details Below
              </span>
            </p>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Login Credentials</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
            </div>
          </div>

          <button
            onClick={runAllTests}
            disabled={Object.values(loading).some(l => l)}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {Object.values(loading).some(l => l) ? '⏳ Running Tests...' : '▶️ Run All Tests'}
          </button>
        </div>

        {/* Custom Test Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔧 Custom API Test</h3>
          <p className="text-gray-600 mb-4">Test any API endpoint manually</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Method</label>
              <select
                value={customMethod}
                onChange={(e) => setCustomMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">Endpoint</label>
              <input
                type="text"
                value={customEndpoint}
                onChange={(e) => setCustomEndpoint(e.target.value)}
                placeholder="e.g., login.php"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={runCustomTest}
                disabled={loading[`Custom: ${customMethod} ${customEndpoint}`]}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                Test
              </button>
            </div>
          </div>
          
          {customMethod !== 'GET' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1">Request Data (JSON)</label>
              <textarea
                value={customData}
                onChange={(e) => setCustomData(e.target.value)}
                placeholder='{"key": "value"}'
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              />
            </div>
          )}
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...tests, ...Object.keys(results).filter(key => key.startsWith('Custom:')).map(key => ({
            name: key,
            description: 'Custom test',
            run: () => {}
          }))].map((test) => (
            // FIX: Replaced curly brace with parenthesis for implicit return
            <div
              key={test.name}
              className={`bg-white border rounded-lg p-4 transition-all ${getStatusColor(test.name)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <span className="text-2xl">{getStatusIcon(test.name)}</span>
                    {test.name}
                  </h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                </div>
                {!test.name.startsWith('Custom:') && (
                  <button
                    onClick={() => runTest(test.name, test.run)}
                    disabled={loading[test.name]}
                    className="ml-2 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Test
                  </button>
                )}
              </div>

              {results[test.name] && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-semibold ${
                      results[test.name].success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {results[test.name].success ? 'SUCCESS' : 'FAILED'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {results[test.name].timestamp}
                    </span>
                  </div>
                  
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800 font-medium">
                      View Response
                    </summary>
                    <div className="mt-2 space-y-2">
                      {results[test.name].data && (
                        <div>
                          <div className="text-green-600 font-medium mb-1">
                            Response Data {results[test.name].status && `(${results[test.name].status} ${results[test.name].statusText})`}:
                          </div>
                          <pre className="p-2 bg-gray-800 text-green-400 rounded overflow-x-auto text-xs max-h-32 overflow-y-auto">
                            {typeof results[test.name].data === 'string' 
                              ? results[test.name].data 
                              : JSON.stringify(results[test.name].data, null, 2)}
                          </pre>
                        </div>
                      )}
                      {results[test.name].error && (
                        <div>
                          <div className="text-red-600 font-medium mb-1">Error Details:</div>
                          <div className="p-2 bg-red-50 border border-red-200 rounded text-xs">
                            <div><strong>Message:</strong> {results[test.name].error}</div>
                            {results[test.name].fullError?.response && (
                              <div><strong>Status:</strong> {results[test.name].fullError.response.status}</div>
                            )}
                            {results[test.name].fullError?.response?.statusText && (
                              <div><strong>Status Text:</strong> {results[test.name].fullError.response.statusText}</div>
                            )}
                          </div>
                        </div>
                      )}
                      {results[test.name].fullError?.response?.data && (
                        <div>
                          <div className="text-orange-600 font-medium mb-1">Server Response:</div>
                          <pre className="p-2 bg-orange-50 border border-orange-200 rounded overflow-x-auto text-xs max-h-32 overflow-y-auto">
                            {JSON.stringify(results[test.name].fullError.response.data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Summary */}
        {Object.keys(results).length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Test Summary</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-700">
                  {Object.values(results).filter(r => r.success).length}
                </div>
                <div className="text-sm text-green-600">Passed</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-700">
                  {Object.values(results).filter(r => !r.success).length}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-700">
                  {Object.keys(results).length}
                </div>
                <div className="text-sm text-blue-600">Total</div>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Instructions</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>✅ Click "Run All Tests" to test all endpoints at once</li>
            <li>✅ Click individual "Test" buttons to test specific endpoints</li>
            <li>✅ Check the response details by clicking "View Response"</li>
            <li>✅ Green = Success, Red = Failed, Yellow = Loading, Gray = Not tested</li>
            <li>⚠️ Some endpoints may fail if there's no data in the database yet</li>
            <li>⚠️ Make sure you're connected to the internet</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-yellow-800 mb-4">🔧 Troubleshooting</h3>
          <div className="space-y-3 text-sm">
            <div>
              <strong className="text-yellow-800">If all tests fail:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-yellow-700">
                <li>• Check your internet connection</li>
                <li>• Verify API URL: {API_BASE_URL}</li>
                <li>• Backend server might be down</li>
                <li>• CORS policy might be blocking requests</li>
              </ul>
            </div>
            <div>
              <strong className="text-yellow-800">If login fails:</strong>
              <ul className="ml-4 mt-1 space-y-1 text-yellow-700">
                <li>• Check credentials: admin@mail.com / 123456</li>
                <li>• Backend authentication might not be implemented</li>
                <li>• Database might not have the admin user</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiTest;