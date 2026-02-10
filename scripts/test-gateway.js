const axios = require('axios');

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:3000';

async function testGateway() {
  console.log('🧪 Testing StacksAI Gateway...\n');

  try {
    console.log('1️⃣ Testing health endpoint...');
    const health = await axios.get(`${GATEWAY_URL}/health`);
    console.log('✅ Health check passed:', health.data);
    console.log('');

    console.log('2️⃣ Testing models endpoint...');
    const models = await axios.get(`${GATEWAY_URL}/v1/prompt/models`);
    console.log('✅ Models retrieved:', Object.keys(models.data.models));
    console.log('');

    console.log('3️⃣ Testing 402 payment required...');
    try {
      await axios.post(`${GATEWAY_URL}/v1/prompt/gpt4`, {
        prompt: 'Hello, this is a test'
      });
    } catch (error) {
      if (error.response?.status === 402) {
        console.log('✅ 402 Payment Required received');
        console.log('Payment info:', {
          amount: error.response.data.payment.amount,
          currency: error.response.data.payment.currency,
          nonce: error.response.data.payment.nonce.substring(0, 16) + '...'
        });
      } else {
        throw error;
      }
    }
    console.log('');

    console.log('4️⃣ Testing stats endpoint...');
    const stats = await axios.get(`${GATEWAY_URL}/v1/stats`);
    console.log('✅ Stats retrieved:', stats.data);
    console.log('');

    console.log('🎉 All tests passed!\n');
    console.log('Next steps:');
    console.log('1. Configure your AI API keys in .env');
    console.log('2. Test with real Stacks wallet');
    console.log('3. Try the web demo at http://localhost:3001');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
    process.exit(1);
  }
}

testGateway();
