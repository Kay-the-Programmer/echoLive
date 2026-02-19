'use server';

import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function purchaseCoins(userId: string, pkg: { id: string; price: number; coins: number; }): Promise<{success: boolean, error: string | null, message: string | null}> {
    if (!userId || !pkg || !pkg.coins) {
        return { success: false, error: "Invalid data provided.", message: null };
    }

    const userRef = db.collection('users').doc(userId);

    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists()) {
                throw new Error("User document not found.");
            }

            // Grant coins to the user
            transaction.update(userRef, {
                coinBalance: FieldValue.increment(pkg.coins)
            });
        });

        return { 
            success: true, 
            message: `Successfully purchased ${pkg.coins.toLocaleString()} coins. Your balance has been updated.`,
            error: null 
        };

    } catch (error: any) {
        console.error("Coin purchase simulation failed:", error);
        return { 
            success: false, 
            error: error.message || 'An unexpected server error occurred.',
            message: null 
        };
    }
}
