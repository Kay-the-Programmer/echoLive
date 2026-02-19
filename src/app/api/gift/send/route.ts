import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import admin from 'firebase-admin';
import { db, auth } from '@/lib/firebase-admin';
import { gifts } from '@/lib/data';

// 1 Coin = $0.000125 ($1 / 8000 coins)
const COIN_TO_USD_RATE = 1 / 8000;

const sendGiftSchema = z.object({
  giftId: z.string().min(1),
  quantity: z.number().int().positive(),
  recipientIds: z.array(z.string().min(1)).min(1),
  isExchange: z.boolean(),
});

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing authorization token.' }, { status: 401 });
    }

    const idToken = authHeader.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(idToken);
    const senderId = decodedToken.uid;

    // 2. Validate the request body
    const body = await req.json();
    const validation = sendGiftSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid request body.', details: validation.error.format() }, { status: 400 });
    }
    const { giftId, quantity, recipientIds, isExchange } = validation.data;
    
    // 3. Get gift details
    const gift = gifts.find(g => g.id === giftId);
    if (!gift) {
        return NextResponse.json({ error: `Gift with ID ${giftId} not found.` }, { status: 404 });
    }
    
    const totalCost = gift.price * quantity;

    // 4. Run the transaction
    await db.runTransaction(async (transaction) => {
      const senderRef = db.collection('users').doc(senderId);
      const globalBalanceRef = db.collection('global_balances').doc('singleton');

      // --- READ PHASE ---
      const senderDoc = await transaction.get(senderRef);
      if (!senderDoc.exists) {
        throw new Error('Your user profile could not be found.');
      }
      
      const senderBalance = senderDoc.data()?.coinBalance ?? 0;
      if (senderBalance < totalCost) {
        throw new Error('You do not have enough coins to send this gift.');
      }
      
      // For this transaction to be robust, we should also read recipient docs
      // But for simplicity, we assume recipients exist. A production app should verify.

      // --- WRITE PHASE ---
      
      // A. Calculate points and revenue
      const totalPointsToDistribute = totalCost * (isExchange ? 0.70 : 0.02);
      const pointsAwardedPerUser = Math.floor(totalPointsToDistribute / recipientIds.length);
      const appCutInCoins = totalCost * (isExchange ? 0.30 : 0.98);
      const appRevenueInUSD = appCutInCoins * COIN_TO_USD_RATE;

      // B. Update other recipients (non-senders)
      if (pointsAwardedPerUser > 0) {
        for (const recipientId of recipientIds) {
          if (recipientId === senderId) continue; // Skip the sender, they are handled next

          const recipientRef = db.collection('users').doc(recipientId);
          // We use `update` assuming the recipient doc exists.
          transaction.update(recipientRef, {
            pointBalance: admin.firestore.FieldValue.increment(pointsAwardedPerUser),
            partyPoints: admin.firestore.FieldValue.increment(pointsAwardedPerUser),
            totalPointsEarned: admin.firestore.FieldValue.increment(pointsAwardedPerUser),
          });
        }
      }

      // C. Prepare and execute the sender's update
      const senderUpdateData: { [key: string]: any } = {
        coinBalance: admin.firestore.FieldValue.increment(-totalCost),
        totalCoinsSpent: admin.firestore.FieldValue.increment(totalCost),
      };

      if (recipientIds.includes(senderId) && pointsAwardedPerUser > 0) {
        senderUpdateData.pointBalance = admin.firestore.FieldValue.increment(pointsAwardedPerUser);
        senderUpdateData.partyPoints = admin.firestore.FieldValue.increment(pointsAwardedPerUser);
        senderUpdateData.totalPointsEarned = admin.firestore.FieldValue.increment(pointsAwardedPerUser);
      }
      
      // Atomically update the sender's document with all changes.
      transaction.update(senderRef, senderUpdateData);

      // E. Update global app revenue.
      if (appRevenueInUSD > 0) {
        transaction.set(globalBalanceRef, {
          totalUsdRevenue: admin.firestore.FieldValue.increment(appRevenueInUSD),
        }, { merge: true });
      }
    });

    return NextResponse.json({ success: true, message: 'Gift sent successfully.' });

  } catch (error: any) {
    console.error('[GIFT_API_ERROR]', error);
    return NextResponse.json({ error: error.message || 'An internal server error occurred.' }, { status: 500 });
  }
}
