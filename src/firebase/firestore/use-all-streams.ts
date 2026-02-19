'use client';

import { useMemo } from 'react';
import { collection, Query, Firestore } from 'firebase/firestore';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore } from '@/firebase';
import type { Stream } from '@/lib/types';

/**
 * A hook to fetch a real-time collection of all streams from Firestore.
 * This is intended for use in the admin panel.
 * @returns A list of streams, loading status, and error state.
 */
export function useAllStreams() {
  const firestore = useFirestore();
  const query = useMemo(() => {
    if (!firestore) return null;
    try {
      return collection(firestore, 'streams') as Query<Stream>;
    } catch (e) {
      console.error("Failed to create streams query:", e);
      return null;
    }
  }, [firestore]);

  return useCollection<Stream>(query);
}
