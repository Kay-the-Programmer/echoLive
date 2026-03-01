
import { LencoClient } from '../lib/lenco';

async function testLenco() {
    console.log('--- Lenco API Integration Test ---');

    const apiKey = process.env.LENCO_API_KEY || 'sandbox_key_123';
    const lenco = new LencoClient(apiKey);

    console.log('Testing Mobile Money Collection Initiation...');
    try {
        const response = await lenco.initiateMobileMoneyCollection({
            amount: 10,
            currency: 'ZMW',
            external_reference: 'TEST_' + Date.now(),
            phone_number: '260970000000',
            narration: 'Test Coin Purchase',
            customer: {
                name: 'Test User',
                email: 'test@example.com'
            }
        });
        console.log('Response:', JSON.stringify(response, null, 2));
    } catch (error: any) {
        console.error('Error initiating collection:', error.message);
    }

    console.log('\nTesting Transaction Status Check...');
    try {
        const status = await lenco.getTransactionStatus('TEST_123456');
        console.log('Status:', JSON.stringify(status, null, 2));
    } catch (error: any) {
        console.error('Error checking status:', error.message);
    }
}

testLenco();
