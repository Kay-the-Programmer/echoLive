'use client';

import { useMemo } from 'react';
import { collection, query as firestoreQuery, orderBy, Query } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { Withdrawal } from '@/lib/types';

/**
 * A hook to fetch a real-time collection of a specific user's withdrawal requests.
 * @param userId - The ID of the user whose withdrawals to fetch.
 * @returns A list of withdrawals, loading status, and error state.
 */
export function useUserWithdrawals(userId: string | undefined) {
  const firestore = useFirestore();
  const query = useMemo(() => {
    if (!userId || !firestore) return null;
    try {
      return firestoreQuery(
        collection(firestore, `users/${userId}/withdrawals`), 
        orderBy('withdrawalDate', 'desc')
      ) as Query<Withdrawal>;
    } catch (e) {
      console.error("Failed to create user withdrawals query:", e);
      return null;
    }
  }, [userId, firestore]);

  return useCollection<Withdrawal>(query);
}
