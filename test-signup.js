/**
 * Signup Flow Test Script
 * 
 * This script tests the signup endpoint to verify it works correctly.
 * Run with: node test-signup.js
 */

const SUPABASE_URL = 'https://elznbletkunibhicbizb.supabase.co';
const PROJECT_ID = 'elznbletkunibhicbizb';
const PUBLIC_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsem5ibGV0a3VuaWJoaWNiaXpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NDM3NjYsImV4cCI6MjA3NzIxOTc2Nn0.4HppRI5vcRf2zxjMKBPYghjVL0aYDCniniaDpqOTnvI';

// Generate unique test data
const timestamp = Date.now();
const testEmail = `test-${timestamp}@example.com`;
const testPassword = 'TestPassword123!';
const testFullName = 'Test User';
const testCompanyName = `Test Company ${timestamp}`;
const testPhone = '+1234567890';
const testRole = 'manager';

async function testSignup() {
  console.log('🧪 Testing Signup Flow...\n');
  console.log('Test Data:');
  console.log(`  Email: ${testEmail}`);
  console.log(`  Company: ${testCompanyName}`);
  console.log(`  Full Name: ${testFullName}`);
  console.log(`  Role: ${testRole}\n`);

  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/make-server-1f923fcd/auth/signup`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PUBLIC_ANON_KEY}`,
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          fullName: testFullName,
          companyName: testCompanyName,
          phone: testPhone,
          role: testRole,
        }),
      }
    );

    const data = await response.json();

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (response.ok && data.success) {
      console.log('\n✅ Signup successful!');
      console.log('\nUser Details:');
      console.log(`  User ID: ${data.user.id}`);
      console.log(`  Email: ${data.user.email}`);
      console.log(`  Company ID: ${data.user.companyId}`);
      console.log(`  Role: ${data.user.role}`);
      
      if (data.session?.access_token) {
        console.log('\n✅ Access token received');
        console.log(`  Token (first 20 chars): ${data.session.access_token.substring(0, 20)}...`);
      } else {
        console.log('\n⚠️  No access token in response');
      }

      // Test login with the created credentials
      console.log('\n🔄 Testing login with new credentials...');
      await testLogin(testEmail, testPassword);
    } else {
      console.log('\n❌ Signup failed!');
      console.log(`Error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.error('Stack:', error.stack);
  }
}

async function testLogin(email, password) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/make-server-1f923fcd/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PUBLIC_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      console.log('✅ Login successful!');
      console.log(`  User: ${data.user.email}`);
      console.log(`  Company: ${data.user.companyName}`);
    } else {
      console.log('❌ Login failed!');
      console.log(`Error: ${data.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Login test error:', error.message);
  }
}

// Run the test
testSignup();









