'use client';

import { useState, useEffect } from 'react';
import {
  Query,
  onSnapshot,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
  CollectionReference,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';

/** Utility type to add an 'id' field to a given type T. */
export type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useCollection hook.
 * @template T Type of the document data.
 */
export interface UseCollectionResult<T> {
  data: WithId<T>[] | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | null; // Error object, or null.
}

/**
 * React hook to subscribe to a Firestore collection or query in real-time.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {Query<DocumentData> | CollectionReference<DocumentData> | null} query - A direct Firestore query or collection reference.
 * @param {object} [options] - Options for the hook.
 * @param {boolean} [options.enabled=true] - Whether the query is enabled.
 * @returns {UseCollectionResult<T>} Object with data, isLoading, error.
 */
export function useCollection<T = any>(
    query: Query<DocumentData> | CollectionReference<DocumentData> | null,
    options?: { enabled?: boolean; }
): UseCollectionResult<T> {
  const firestore = useFirestore();
  const [data, setData] = useState<WithId<T>[] | null>(null);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { enabled = true } = options ?? {};

  useEffect(() => {
    if (!enabled || !query || !firestore) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }
    
    setIsLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const results: WithId<T>[] = snapshot.docs.map(doc => ({ ...(doc.data() as T), id: doc.id }));
        setData(results);
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        console.error(`useCollection: Error listening to query`, err);
        setError(err);
        setData(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query, enabled, firestore]);
  
  return { data, isLoading, error };
}
