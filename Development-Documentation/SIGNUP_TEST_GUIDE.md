# Signup Flow Testing Guide

## Overview
This guide helps you test the signup flow to ensure it works correctly with the current KV store implementation.

## Prerequisites
1. Supabase project is set up and running
2. Edge Functions are deployed
3. Node.js installed (for automated tests)

## Testing Methods

### Method 1: Automated Test Script

Run the automated test script:

```bash
node test-signup.js
```

This script will:
- Create a test user with unique credentials
- Verify the signup response
- Test login with the new credentials
- Display detailed results

### Method 2: Manual Testing via Browser

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the signup page:**
   - Open your browser to the app URL (usually `http://localhost:5173`)
   - Click "Sign Up" or navigate to the signup page

3. **Fill in the signup form:**
   - **Email**: Use a unique email (e.g., `test-${Date.now()}@example.com`)
   - **Password**: At least 8 characters
   - **Full Name**: Your name
   - **Company Name**: Your company name
   - **Phone**: Optional
   - **Role**: Select a role (default: manager)
   - **Accept Terms**: Check the checkbox

4. **Submit the form:**
   - Click "Create Account"
   - Watch for success/error messages

5. **Verify the results:**
   - Check browser console for any errors
   - Check localStorage for `fabricxai_token`
   - Verify you're redirected to the dashboard

### Method 3: Direct API Testing (cURL)

Test the signup endpoint directly:

```bash
curl -X POST \
  'https://elznbletkunibhicbizb.supabase.co/functions/v1/make-server-1f923fcd/auth/signup' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsem5ibGV0a3VuaWJoaWNiaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDM3NjYsImV4cCI6MjA3NzIxOTc2Nn0.4HppRI5vcRf2zxjMKBPYghjVL0aYDCniniaDpqOTnvI' \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "fullName": "Test User",
    "companyName": "Test Company",
    "phone": "+1234567890",
    "role": "manager"
  }'
```

### Method 4: Postman/Thunder Client

1. **Create a new POST request:**
   - URL: `https://elznbletkunibhicbizb.supabase.co/functions/v1/make-server-1f923fcd/auth/signup`
   - Method: POST

2. **Set headers:**
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsem5ibGV0a3VuaWJoaWNiaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDM3NjYsImV4cCI6MjA3NzIxOTc2Nn0.4HppRI5vcRf2zxjMKBPYghjVL0aYDCniniaDpqOTnvI`

3. **Set body (JSON):**
   ```json
   {
     "email": "test@example.com",
     "password": "TestPassword123!",
     "fullName": "Test User",
     "companyName": "Test Company",
     "phone": "+1234567890",
     "role": "manager"
   }
   ```

4. **Send request and check response**

## What to Check

### ✅ Success Criteria

1. **Response Status**: Should be `200 OK`
2. **Response Body**: Should contain:
   ```json
   {
     "success": true,
     "user": {
       "id": "user-uuid",
       "email": "user@example.com",
       "fullName": "User Name",
       "companyName": "Company Name",
       "companyId": "company-id",
       "role": "manager"
     },
     "session": {
       "access_token": "jwt-token"
     }
   }
   ```

3. **User Created in Supabase Auth**: Check Supabase dashboard → Authentication → Users
4. **KV Store Data**: Check that user and company data is stored in KV store
5. **Token Stored**: Check browser localStorage for `fabricxai_token`
6. **Session Created**: User should be automatically logged in

### ❌ Common Issues

1. **"Failed to create user"**
   - Check Supabase Auth settings
   - Verify email format is valid
   - Check if user already exists

2. **"Failed to sign in"**
   - User created but session creation failed
   - Check Supabase Auth configuration
   - Verify password meets requirements

3. **CORS Errors**
   - Check Edge Function CORS settings
   - Verify request headers

4. **Network Errors**
   - Check Supabase project is active
   - Verify Edge Function is deployed
   - Check internet connection

## Testing Checklist

- [ ] Signup with valid data succeeds
- [ ] Signup with duplicate email fails gracefully
- [ ] Signup with invalid email format fails
- [ ] Signup with short password fails
- [ ] Signup without required fields fails
- [ ] Access token is returned and stored
- [ ] User can login after signup
- [ ] User profile is created in KV store
- [ ] Company data is created in KV store
- [ ] User is redirected to dashboard after signup

## Debugging

### Check Edge Function Logs
1. Go to Supabase Dashboard
2. Navigate to Edge Functions
3. Select `make-server-1f923fcd`
4. Check logs for errors

### Check Browser Console
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Check Supabase Auth
1. Go to Supabase Dashboard
2. Navigate to Authentication → Users
3. Verify user was created
4. Check user metadata

## Next Steps After Testing

Once signup is verified:
1. Test login flow
2. Test session persistence
3. Test logout
4. Test password reset (if implemented)
5. Test role-based access

---

**Note**: The current implementation uses KV store. If you want to migrate to database tables, that's a separate task.







