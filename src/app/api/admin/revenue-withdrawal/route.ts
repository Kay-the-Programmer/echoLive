import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { db, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { z } from 'zod';
import crypto from 'crypto';

const BINANCE_API_URL = 'https://api.binance.com';

const withdrawSchema = z.object({
    walletAddress: z.string().min(1),
    amount: z.number().positive(),
});

// Function to create a signed request for Binance API
async function createSignedRequest(params: Record<string, string | number>, apiKey: string, apiSecret: string) {
    const timestamp = Date.now();
    const queryString = new URLSearchParams({ ...params, timestamp: timestamp.toString() }).toString();
    const signature = crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');

    const url = `${BINANCE_API_URL}/sapi/v1/capital/withdraw/apply?${queryString}&signature=${signature}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'X-MBX-APIKEY': apiKey,
        },
    });

    return response.json();
}

export async function POST(req: NextRequest) {
    console.log(`API_ROUTE: Processing revenue withdrawal...`);
    try {
        const apiKey = process.env.BINANCE_API_KEY;
        const apiSecret = process.env.BINANCE_API_SECRET;

        if (!apiKey || !apiSecret) {
            throw new Error('Binance API keys are not configured on the server.');
        }

        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized: Missing authorization token.' }, { status: 401 });
        }

        const idToken = authHeader.replace('Bearer ', '');
        const decodedToken = await auth.verifyIdToken(idToken);
        const callerId = decodedToken.uid;

        const ownerDoc = await db.collection('appowners').doc(callerId).get();
        if (!ownerDoc.exists) {
            return NextResponse.json({ error: 'Authorization failed: Only the App Owner can withdraw revenue.' }, { status: 403 });
        }

        const body = await req.json();
        const validation = withdrawSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request body.', details: validation.error.format() }, { status: 400 });
        }
        const { walletAddress, amount } = validation.data;

        const globalBalanceRef = db.collection('global_balances').doc('singleton');

        const balanceDoc = await globalBalanceRef.get();
        const currentRevenue = balanceDoc.data()?.totalUsdRevenue ?? 0;
        if (amount > currentRevenue) {
            throw new Error(`Withdrawal amount of $${amount} exceeds available revenue of $${currentRevenue}.`);
        }

        const withdrawalParams = {
            coin: 'USDT',
            address: walletAddress,
            amount: amount,
            network: 'TRX',
        };

        const withdrawalResult = await createSignedRequest(withdrawalParams, apiKey, apiSecret);

        if (!withdrawalResult.id) {
            throw new Error(withdrawalResult.msg || 'Binance API did not return a transaction ID.');
        }

        await globalBalanceRef.update({
            totalUsdRevenue: FieldValue.increment(-amount)
        });

        return NextResponse.json({ success: true, transactionId: withdrawalResult.id });

    } catch (e: any) {
        console.error('Revenue withdrawal failed:', e);
        const errorMessage = e.message || 'An unknown server error occurred.';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
