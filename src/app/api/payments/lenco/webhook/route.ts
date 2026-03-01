import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import admin from 'firebase-admin';

// 1 Coin = $0.000125 ($1 / 8000 coins)
const COIN_TO_USD_RATE = 1 / 8000;

/**
 * POST /api/payments/lenco/webhook
 * Purpose: Receive payment status updates from Lenco (Broadpay).
 * This endpoint should be protected or validated via a secret/header if Lenco provides one.
 */
export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.json();
        console.log('[LENCO_WEBHOOK_RECEIVED]', JSON.stringify(rawBody));

        // Lenco Webhook structure (Hypothetical - adjust based on actual provider)
        // {
        //   "event": "collection.success",
        //   "data": {
        //     "reference": "COIN_TOPUP_user123_123456789",
        //     "status": "success",
        //     "amount": 100,
        //     "currency": "ZMW"
        //   }
        // }

        const { event, data } = rawBody;
        const reference = data?.reference;

        if (!reference || (event !== 'collection.success' && data?.status !== 'success')) {
            console.log(`[LENCO_WEBHOOK] Skipping non-success event: ${event}`);
            return NextResponse.json({ success: true }); // Always return 200 to acknowledge webhook
        }

        // 1. Find transaction in Firestore
        const txRef = db.collection('transactions').doc(reference);
        const txDoc = await txRef.get();

        if (!txDoc.exists) {
            console.error(`[LENCO_WEBHOOK] Transaction record not found for reference: ${reference}`);
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        const txData = txDoc.data();
        if (txData?.status === 'success') {
            console.log(`[LENCO_WEBHOOK] Transaction ${reference} already processed.`);
            return NextResponse.json({ success: true });
        }

        const { userId, amount: coinAmount } = txData as { userId: string, amount: number };

        // 2. Perform Atomic Update (Credit User & Update Global Balance)
        await db.runTransaction(async (transaction) => {
            const userRef = db.collection('users').doc(userId);
            const globalBalanceRef = db.collection('global_balances').doc('singleton');

            // Update transaction status
            transaction.update(txRef, {
                status: 'success',
                webhookData: rawBody,
                updatedAt: new Date().toISOString()
            });

            // Update user coin balance
            transaction.update(userRef, {
                coinBalance: admin.firestore.FieldValue.increment(coinAmount)
            });

            // Update global revenue
            const appRevenueInUSD = coinAmount * COIN_TO_USD_RATE;
            transaction.set(globalBalanceRef, {
                totalUsdRevenue: admin.firestore.FieldValue.increment(appRevenueInUSD),
            }, { merge: true });
        });

        console.log(`[LENCO_WEBHOOK] Successfully credited ${coinAmount} coins to user ${userId}`);
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[LENCO_WEBHOOK_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
