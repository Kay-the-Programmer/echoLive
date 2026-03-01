import { NextRequest, NextResponse } from 'next/server';
import { db, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Withdrawal } from '@/lib/types';
import { z } from 'zod';
import crypto from 'crypto';
import { getLencoClient } from '@/lib/lenco';
import { APP_CONFIG } from '@/lib/constants';

const BINANCE_API_URL = 'https://api.binance.com';
const withdrawalIdSchema = z.object({ withdrawalId: z.string().min(1) });

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

async function verifyAdmin(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Unauthorized: Missing authorization token.');
    }
    const idToken = authHeader.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(idToken);

    const adminDoc = await db.collection('admins').doc(decodedToken.uid).get();
    if (!adminDoc.exists) {
        throw new Error('Unauthorized: User is not an admin.');
    }
}

// APPROVE (POST)
export async function POST(req: NextRequest) {
    console.log(`API_ROUTE: Approving withdrawal request...`);
    let withdrawalId: string | undefined;
    try {
        await verifyAdmin(req);

        const body = await req.json();
        const validation = withdrawalIdSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request: missing withdrawalId' }, { status: 400 });
        }
        withdrawalId = validation.data.withdrawalId;

        const rootWithdrawalRef = db.collection('withdrawals').doc(withdrawalId);
        const withdrawalDoc = await rootWithdrawalRef.get();
        if (!withdrawalDoc.exists) throw new Error(`Withdrawal request ${withdrawalId} not found.`);

        const withdrawal = withdrawalDoc.data() as Withdrawal;
        if (withdrawal.status !== 'pending') return NextResponse.json({ error: `Request is already in status: ${withdrawal.status}` }, { status: 409 });

        const { userId, amount, paymentAddress, paymentMethod } = withdrawal;
        let externalTxId = '';

        // ROUTE BY PAYMENT METHOD
        if (paymentMethod.includes('Mobile Money ZM') || paymentMethod === 'Lenco_Mobile_Money') {
            // LENCO PAYOUT (Zambia Mobile Money)
            const lenco = getLencoClient();
            // Conversion: Let's use APP_CONFIG for flexible rates
            const zmwAmount = Math.floor((amount / APP_CONFIG.POINTS_PER_USD) * APP_CONFIG.ZMW_PER_USD);

            if (zmwAmount < 1) throw new Error('Payout amount too low for ZMW conversion.');

            const lencoResponse = await lenco.initiatePayout({
                amount: zmwAmount,
                currency: 'ZMW',
                external_reference: `PAYOUT_${withdrawalId}`,
                phone_number: paymentAddress,
                narration: `Withdrawal for ${userId}`,
            });

            // Note: Lenco might return 'id' or 'reference'
            externalTxId = lencoResponse.data?.reference || lencoResponse.id || `LENCO_${Date.now()}`;
        } else {
            // BINANCE PAYOUT (USDT-TRC20)
            const apiKey = process.env.BINANCE_API_KEY;
            const apiSecret = process.env.BINANCE_API_SECRET;

            if (!apiKey || !apiSecret) {
                throw new Error('Binance API keys are not configured on the server.');
            }

            const usdtAmount = amount / 10000;
            const withdrawalParams = {
                coin: 'USDT',
                address: paymentAddress,
                amount: usdtAmount,
                network: 'TRX',
            };

            const withdrawalResult = await createSignedRequest(withdrawalParams, apiKey, apiSecret);
            if (!withdrawalResult.id) {
                throw new Error(withdrawalResult.msg || 'Binance API did not return a transaction ID.');
            }
            externalTxId = withdrawalResult.id;
        }

        const userWithdrawalRef = db.collection('users').doc(userId).collection('withdrawals').doc(withdrawalId);
        const batch = db.batch();
        batch.update(rootWithdrawalRef, { status: 'completed', payoutTransactionId: externalTxId, payoutError: null });
        batch.update(userWithdrawalRef, { status: 'completed', payoutTransactionId: externalTxId, payoutError: null });
        await batch.commit();

        return NextResponse.json({ success: true, transactionId: externalTxId });

    } catch (e: any) {
        // ... (existing error handling remains same)
        console.error(`Withdrawal for ${withdrawalId} failed:`, e);
        const errorMessage = e.message || 'An unknown server error from the payment provider occurred.';

        if (withdrawalId) {
            try {
                const rootWithdrawalRef = db.collection('withdrawals').doc(withdrawalId);
                const withdrawalDoc = await rootWithdrawalRef.get();
                if (withdrawalDoc.exists) {
                    const withdrawal = withdrawalDoc.data() as Withdrawal;
                    const userRef = db.collection('users').doc(withdrawal.userId);
                    const userWithdrawalRef = db.collection('users').doc(withdrawal.userId).collection('withdrawals').doc(withdrawalId);

                    const batch = db.batch();
                    batch.update(rootWithdrawalRef, { status: 'payout_failed', payoutError: errorMessage });
                    batch.update(userWithdrawalRef, { status: 'payout_failed', payoutError: errorMessage });
                    batch.update(userRef, { pointBalance: FieldValue.increment(withdrawal.amount) });
                    await batch.commit();
                }
            } catch (dbError) {
                console.error(`CRITICAL ERROR: Payout for ${withdrawalId} failed, and DB update also failed.`, dbError);
            }
        }
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}

// REJECT (PUT)
export async function PUT(req: NextRequest) {
    console.log(`API_ROUTE: Rejecting withdrawal request...`);
    try {
        await verifyAdmin(req);

        const body = await req.json();
        const validation = withdrawalIdSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request: missing withdrawalId' }, { status: 400 });
        }
        const { withdrawalId } = validation.data;

        const rootWithdrawalRef = db.collection('withdrawals').doc(withdrawalId);
        const withdrawalDoc = await rootWithdrawalRef.get();
        if (!withdrawalDoc.exists) throw new Error(`Withdrawal request ${withdrawalId} not found.`);

        const withdrawal = withdrawalDoc.data() as Withdrawal;
        if (withdrawal.status !== 'pending') return NextResponse.json({ error: `Request is already in status: ${withdrawal.status}` }, { status: 409 });

        const userRef = db.collection('users').doc(withdrawal.userId);
        const userWithdrawalRef = db.collection('users').doc(withdrawal.userId).collection('withdrawals').doc(withdrawalId);

        const batch = db.batch();
        batch.update(rootWithdrawalRef, { status: 'rejected' });
        batch.update(userWithdrawalRef, { status: 'rejected' });
        batch.update(userRef, { pointBalance: FieldValue.increment(withdrawal.amount) });
        await batch.commit();

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error(`Failed to reject withdrawal:`, e);
        return NextResponse.json({ error: e.message || "An unknown server error occurred." }, { status: 500 });
    }
}

// DELETE (DELETE)
export async function DELETE(req: NextRequest) {
    console.log(`API_ROUTE: Deleting withdrawal request...`);
    try {
        await verifyAdmin(req);

        const body = await req.json();
        const validation = withdrawalIdSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request: missing withdrawalId' }, { status: 400 });
        }
        const { withdrawalId } = validation.data;

        const rootWithdrawalRef = db.collection('withdrawals').doc(withdrawalId);
        const withdrawalDoc = await rootWithdrawalRef.get();
        if (!withdrawalDoc.exists) return NextResponse.json({ success: true }); // Already deleted

        const withdrawal = withdrawalDoc.data() as Withdrawal;
        const userWithdrawalRef = db.collection('users').doc(withdrawal.userId).collection('withdrawals').doc(withdrawalId);

        const batch = db.batch();
        batch.delete(rootWithdrawalRef);
        batch.delete(userWithdrawalRef);
        await batch.commit();

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error(`Failed to delete withdrawal:`, e);
        return NextResponse.json({ error: e.message || "An unknown server error occurred." }, { status: 500 });
    }
}
