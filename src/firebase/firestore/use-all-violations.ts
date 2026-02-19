'use client';

import { useMemo } from 'react';
import { collection, query as firestoreQuery, Query, orderBy } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { Violation } from '@/lib/types';

/**
 * A hook to fetch a real-time collection of all rule violations from Firestore,
 * ordered by date.
 */
export function useAllViolations(options?: { enabled?: boolean; }) {
  const firestore = useFirestore();
  const query = useMemo(() => {
    if (!firestore) return null;
    try {
      return firestoreQuery(collection(firestore, 'violations'), orderBy('violationDate', 'desc')) as Query<Violation>;
    } catch (e) {
      console.error("Failed to create violations query:", e);
      return null;
    }
  }, [firestore]);
 
  return useCollection<Violation>(query, options);
}
