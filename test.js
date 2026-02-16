const axios = require('axios');

const API_BASE = 'http://localhost:3005';
const TEST_API_KEY = 'demo-key-123';

// Test cases
const testCases = [
  {
    email: 'user@example.com',
    expected: true,
    description: 'Valid email'
  },
  {
    email: 'invalid-email',
    expected: false,
    description: 'Invalid syntax'
  },
  {
    email: 'test@10minutemail.com',
    expected: false,
    description: 'Disposable email'
  },
  {
    email: 'user@nonexistentdomain12345.com',
    expected: false,
    description: 'No MX record'
  },
  {
    email: 'user@gmail.com',
    expected: true,
    description: 'Trusted domain'
  }
];

async function runTests() {
  console.log('🧪 Running Email Validator API Tests\n');
  
  let passed = 0;
  let failed = 0;
  
  // Test health endpoint
  try {
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', healthResponse.data.status);
  } catch (error) {
    console.log('❌ Health check failed');
    return;
  }
  
  console.log('\n📧 Email Validation Tests:\n');
  
  for (const testCase of testCases) {
    try {
      const response = await axios.post(
        `${API_BASE}/validate`,
        { email: testCase.email },
        { 
          headers: { 'X-API-Key': TEST_API_KEY },
          timeout: 10000
        }
      );
      
      const result = response.data;
      const testPassed = result.valid === testCase.expected;
      
      if (testPassed) {
        console.log(`✅ ${testCase.description}: ${testCase.email}`);
        console.log(`   Valid: ${result.valid}, Confidence: ${result.confidence}`);
        passed++;
      } else {
        console.log(`❌ ${testCase.description}: ${testCase.email}`);
        console.log(`   Expected: ${testCase.expected}, Got: ${result.valid}`);
        console.log(`   Reason: ${result.reason}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ ${testCase.description}: ${testCase.email}`);
      console.log(`   Error: ${error.message}`);
      failed++;
    }
    console.log('');
  }
  
  // Test usage endpoint
  try {
    const usageResponse = await axios.get(`${API_BASE}/usage`, {
      headers: { 'X-API-Key': TEST_API_KEY }
    });
    console.log('✅ Usage tracking:', usageResponse.data);
  } catch (error) {
    console.log('❌ Usage tracking failed');
  }
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed');
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

runTests();