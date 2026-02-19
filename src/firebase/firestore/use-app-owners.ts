
'use client';

import { useMemo } from 'react';
import { collection, Query } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { AppOwner } from '@/lib/types';

/**
 * A hook to fetch a real-time collection of all App Owners from Firestore.
 * This is used to determine if an owner has been designated yet.
 */
export function useAppOwners(options?: { enabled?: boolean; }) {
  const firestore = useFirestore();
  const query = useMemo(() => {
    if (!firestore) return null;
    try {
      return collection(firestore, 'appowners') as Query<AppOwner>;
    } catch (e) {
      console.error("Failed to create appowners query:", e);
      return null;
    }
  }, [firestore]);

  return useCollection<AppOwner>(query, options);
}
