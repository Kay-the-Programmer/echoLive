'use client';

import { useMemo } from 'react';
import { collection, Query } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { User } from '@/lib/types';

/**
 * A hook to fetch a real-time collection of all users from Firestore.
 * @returns A list of users, loading status, and error state.
 */
export function useAllUsers(options?: { enabled?: boolean; }) {
  const firestore = useFirestore();
  const query = useMemo(() => {
    if (!firestore) return null;
    try {
      return collection(firestore, 'users') as Query<User>;
    } catch (e) {
      console.error("Failed to create users query:", e);
      return null;
    }
  }, [firestore]);

  return useCollection<User>(query, options);
}
