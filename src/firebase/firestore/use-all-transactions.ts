'use client';

import { useMemo } from 'react';
import { collection, query as firestoreQuery, Query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import type { Transaction } from '@/lib/types';
import { useFirestore } from '@/firebase';

/**
 * A hook to fetch a real-time collection of all transactions from Firestore,
 * ordered by date.
 * @returns A list of transactions, loading status, and error state.
 */
export function useAllTransactions(options?: { enabled?: boolean; }) {
  const firestore = useFirestore();
  const query = useMemo(() => {
    if (!firestore) return null;
    try {
      // Order by timestamp in descending order to show newest transactions first
      return firestoreQuery(collection(firestore, 'transactions'), orderBy('timestamp', 'desc')) as Query<Transaction>;
    } catch (e) {
      console.error("Failed to create transactions query:", e);
      return null;
    }
  }, [firestore]);

  return useCollection<Transaction>(query, options);
}
