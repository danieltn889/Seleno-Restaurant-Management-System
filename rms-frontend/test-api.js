// test-api.js
const axios = require('axios');

// Use the same base URL as the frontend
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost/selenorms/seleno_backend/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {'Content-Type': 'application/json'},
  timeout: 10000
});

async function testEndpoint(endpoint, method = 'get', data = null) {
  try {
    const response = await api[method](endpoint, data);
    console.log(`✅ ${endpoint}: ${response.status}`);
    console.log('Response:', JSON.stringify(response.data, null, 2).substring(0, 200) + '...');
  } catch (error) {
    console.log(`❌ ${endpoint}: ${error.response?.status || 'Network Error'}`);
    console.log('Error:', error.message);
    if (error.response?.data) {
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
  console.log('---');
}

async function runTests() {
  console.log('Testing API endpoints...\n');

  // Test login
  console.log('Testing Login...');
  await testEndpoint('login.php', 'post', {
    email: 'admin@mail.com',
    password: '123456'
  });

  // Test users list
  console.log('Testing Users List...');
  await testEndpoint('users/list.php');

  // Test stock categories
  console.log('Testing Stock Categories...');
  await testEndpoint('inventory/stock-category/list.php');

  // Test menus
  console.log('Testing Menus...');
  await testEndpoint('menu/list.php');

  // Test tables
  console.log('Testing Tables...');
  await testEndpoint('tables/list.php');

  // Test orders
  console.log('Testing Orders...');
  await testEndpoint('orders/list.php');

  // Test sales report
  console.log('Testing Sales Report...');
  await testEndpoint('reports/sales.php');
}

runTests().catch(console.error);