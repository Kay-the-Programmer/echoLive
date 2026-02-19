'use server';

import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import type { Withdrawal } from '@/lib/types';

interface RequestWithdrawalPayload {
    userId: string;
    amount: number;
    paymentMethod: string;
    paymentAddress: string;
}

const FEE_IN_POINTS = 10000;
const FEE_IN_USD = 1;

export async function requestWithdrawal({ userId, amount, paymentMethod, paymentAddress }: RequestWithdrawalPayload): Promise<{ success: boolean; error?: string; }> {
    if (!userId || !amount || !paymentMethod || !paymentAddress) {
        return { success: false, error: "Invalid data provided for withdrawal request." };
    }

    const userRef = db.collection('users').doc(userId);
    const totalDeduction = amount + FEE_IN_POINTS;

    try {
        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) {
                throw new Error("User not found.");
            }

            const currentBalance = userDoc.data()?.pointBalance ?? 0;
            if (currentBalance < totalDeduction) {
                throw new Error(`Insufficient balance. You need ${totalDeduction.toLocaleString()} points to cover the withdrawal and fee.`);
            }

            // 1. Deduct points and fee from the user
            transaction.update(userRef, { pointBalance: FieldValue.increment(-totalDeduction) });

            const withdrawalId = db.collection('withdrawals').doc().id;
            const newWithdrawalRequest: Omit<Withdrawal, 'id'> = {
                userId,
                amount,
                status: 'pending',
                withdrawalDate: new Date().toISOString(),
                paymentMethod,
                paymentAddress,
            };

            // 2. Create records in both root and user-specific collections
            const rootWithdrawalRef = db.collection('withdrawals').doc(withdrawalId);
            const userWithdrawalRef = db.collection('users').doc(userId).collection('withdrawals').doc(withdrawalId);
            transaction.set(rootWithdrawalRef, newWithdrawalRequest);
            transaction.set(userWithdrawalRef, newWithdrawalRequest);

            // 3. Add fee to global revenue
            const globalBalanceRef = db.collection('global_balances').doc('singleton');
            transaction.set(globalBalanceRef, { totalUsdRevenue: FieldValue.increment(FEE_IN_USD) }, { merge: true });
        });

        return { success: true };
    } catch (error: any) {
        console.error("Withdrawal request transaction failed:", error);
        return { success: false, error: error.message || 'An unexpected server error occurred.' };
    }
}
