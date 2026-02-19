'use client';

import { useMemo } from 'react';
import { collection, query as firestoreQuery, Query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { Withdrawal } from '@/lib/types';

/**
 * A hook to fetch a real-time collection of all withdrawal requests from Firestore,
 * ordered by date.
 * @returns A list of withdrawals, loading status, and error state.
 */
export function useAllWithdrawals(options?: { enabled?: boolean; }) {
  const firestore = useFirestore();
  const query = useMemo(() => {
    if (!firestore) return null;
    try {
      // Order by withdrawalDate in descending order to show newest requests first
      return firestoreQuery(collection(firestore, 'withdrawals'), orderBy('withdrawalDate', 'desc')) as Query<Withdrawal>;
    } catch (e) {
      console.error("Failed to create withdrawals query:", e);
      return null;
    }
  }, [firestore]);
 
  return useCollection<Withdrawal>(query, options);
}
