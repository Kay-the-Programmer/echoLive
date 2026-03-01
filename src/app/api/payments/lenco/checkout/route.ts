import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { db, auth } from '@/lib/firebase-admin';
import { getLencoClient, ZMW_TO_COIN_RATE } from '@/lib/lenco';
import { coinPackages } from '@/lib/data';

const checkoutSchema = z.object({
    packageId: z.string().min(1),
    phoneNumber: z.string().regex(/^260[0-9]{9}$/, 'Invalid Zambian phone number format. Must start with 260.'),
});

/**
 * POST /api/payments/lenco/checkout
 * Purpose: Initiate a Mobile Money collection via Lenco (Broadpay).
 */
export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate user
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const idToken = authHeader.replace('Bearer ', '');
        const decodedToken = await auth.verifyIdToken(idToken);
        const userId = decodedToken.uid;

        // 2. Validate body
        const body = await req.json();
        const validation = checkoutSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid data', details: validation.error.format() }, { status: 400 });
        }

        const { packageId, phoneNumber } = validation.data;

        // 3. Find coin package
        const pkg = coinPackages.find(p => p.id === packageId);
        if (!pkg) {
            return NextResponse.json({ error: 'Invalid coin package ID' }, { status: 404 });
        }

        // 4. Calculate ZMW amount
        // pkg.coins = amount in coins
        // pkg.price = amount in USD (usually)
        // We need the ZMW equivalent. Let's assume the pkg.coins is the base.
        const zmwAmount = Math.ceil(pkg.coins / ZMW_TO_COIN_RATE);

        // 5. Build Lenco request
        const lenco = getLencoClient();
        const external_reference = `COIN_TOPUP_${userId}_${Date.now()}`;

        // 6. Create partial transaction record in Firestore (optional but recommended)
        await db.collection('transactions').doc(external_reference).set({
            userId,
            packageId,
            amount: pkg.coins,
            priceZmw: zmwAmount,
            currency: 'ZMW',
            status: 'pending',
            paymentMethod: 'Lenco_Mobile_Money',
            phoneNumber,
            type: 'purchase',
            timestamp: new Date().toISOString(),
        });

        // 7. Call Lenco API
        const response = await lenco.initiateMobileMoneyCollection({
            amount: zmwAmount,
            currency: 'ZMW',
            external_reference,
            phone_number: phoneNumber,
            narration: `Purchase of ${pkg.coins} EchoLive Coins`,
            customer: {
                name: decodedToken.name || 'EchoLive User',
                email: decodedToken.email,
            },
        });

        if (response.status === 'success' || response.status === 'pending') {
            return NextResponse.json({
                success: true,
                message: 'Payment request sent! Please check your phone to authorize.',
                reference: external_reference
            });
        } else {
            throw new Error(response.message || 'Lenco API returned an unsuccessful status.');
        }

    } catch (error: any) {
        console.error('[LENCO_CHECKOUT_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
