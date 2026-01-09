# 🧪 Testing the API Integration

## Quick Test Instructions

### Step 1: Access the Test Page
Open your browser and go to:
```
http://localhost:5173/api-test
```

### Step 2: Run the Tests
1. The page will load with default login credentials already filled in:
   - Email: `admin@mail.com`
   - Password: `123456`

2. Click the **"▶️ Run All Tests"** button to test all endpoints at once

3. Or click individual **"Test"** buttons to test specific endpoints

### Step 3: Review Results
- ✅ **Green** = Test passed successfully
- ❌ **Red** = Test failed
- ⏳ **Yellow** = Test is running
- ⚪ **Gray** = Not tested yet

### Step 4: Check Response Details
- Click **"View Response"** under any test to see the actual API response
- This helps you understand what data is being returned

---

## What Gets Tested

### 1. Authentication
- Tests login endpoint
- Verifies session creation

### 2. User Management
- Fetches list of users
- Tests user API endpoint

### 3. Inventory
- Lists stock categories
- Verifies inventory endpoints

### 4. Menu Management
- Lists menu items
- Tests menu API

### 5. Tables
- Fetches table data
- Tests table management

### 6. Orders
- Lists orders
- Tests order endpoints

### 7. Reports
- Gets sales report
- Tests reporting functionality

---

## Expected Results

### ✅ If Everything Works:
All tests should show **green checkmarks** (✅)

### ⚠️ Possible Issues:

#### Some tests show red ❌
- **Cause**: Database might be empty (no data yet)
- **Solution**: This is normal for a fresh installation. The API is working, just no data exists yet.

#### All tests show red ❌
- **Cause**: Cannot connect to backend
- **Solutions**:
  1. Check your internet connection
  2. Verify backend URL: `https://gakoshop.xyz/seleno_backend/`
  3. Check browser console for CORS errors
  4. Try accessing the backend URL directly in browser

#### Login fails ❌
- **Cause**: Invalid credentials or backend auth issue
- **Solutions**:
  1. Verify credentials with backend admin
  2. Check if backend is running
  3. Look at the error message in the response

---

## Browser Console Debugging

Open browser DevTools (F12) and check:

### Network Tab
- See all API requests
- Check request/response headers
- View actual API responses

### Console Tab
- Look for any JavaScript errors
- Check for CORS errors
- See API error messages

---

## Testing Individual Features

After verifying the API works, you can test individual features:

### Test Login
1. Go to: `http://localhost:5173/login`
2. Enter: `admin@mail.com` / `123456`
3. Click Login

### Test Dashboard
After login, you should see the dashboard with navigation

### Test User Management
Navigate to Users → List Users to see actual user data from API

---

## Success Criteria

✅ Login test passes  
✅ At least one other test passes  
✅ Can see response data in the details  
✅ No CORS errors in console  
✅ Network tab shows successful API calls  

---

## Next Steps After Testing

1. ✅ **If tests pass**: Your integration is working! Start building features
2. ❌ **If tests fail**: Check the troubleshooting section below
3. ⚠️ **Partial success**: Some endpoints might need data first

---

## Troubleshooting Common Issues

### CORS Error
**Error**: "Access-Control-Allow-Origin"
**Fix**: Backend needs to allow your domain in CORS settings

### Network Error
**Error**: "Failed to fetch" or "Network request failed"
**Fix**: 
- Check internet connection
- Verify backend URL is correct
- Try accessing backend directly

### 401 Unauthorized
**Error**: Status 401
**Fix**: 
- Login first
- Check if session cookies are enabled
- Verify credentials

### 404 Not Found
**Error**: Status 404
**Fix**: 
- Endpoint might not exist
- Check API documentation
- Verify endpoint path

---

## Advanced Testing

### Test with Different Users
Change the credentials in the test page:
- Manager: `manager@mail.com` / `123456`
- Cashier: `cashier@mail.com` / `123456`
- Waiter: `waiter@mail.com` / `123456`

### Test API Directly
Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl commands

---

## Need Help?

If you encounter issues:
1. Check browser console for errors
2. Look at Network tab for failed requests
3. Review the API response details
4. Check QUICK_START.md for more info
5. Review API_INTEGRATION.md for usage examples

---

**Test Page**: http://localhost:5173/api-test  
**Backend API**: https://gakoshop.xyz/seleno_backend/  
**Login Page**: http://localhost:5173/login
