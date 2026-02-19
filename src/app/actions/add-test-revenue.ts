'use server';

import { db } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function addTestRevenue(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const globalBalanceRef = db.collection('global_balances').doc('singleton');
    
    // Using set with merge avoids the need to check for existence first.
    // It will create the document if it doesn't exist, or update it if it does.
    // FieldValue.increment is the correct way to atomically increase a number.
    await globalBalanceRef.set({
        totalUsdRevenue: FieldValue.increment(100)
    }, { merge: true });

    return { success: true, message: 'Added $100 of test revenue.' };
  } catch (error: any) {
    console.error('Error adding test revenue:', error);
    return { success: false, error: error.message || 'An unexpected server error occurred.' };
  }
}
