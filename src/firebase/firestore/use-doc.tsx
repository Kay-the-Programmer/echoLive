'use client';
    
import { useState, useEffect } from 'react';
import {
  doc,
  onSnapshot,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';

/** Utility type to add an 'id' field to a given type T. */
type WithId<T> = T & { id: string };

/**
 * Interface for the return value of the useDoc hook.
 * @template T Type of the document data.
 */
export interface UseDocResult<T> {
  data: WithId<T> | null; // Document data with ID, or null.
  isLoading: boolean;       // True if loading.
  error: FirestoreError | null; // Error object, or null.
}

/**
 * React hook to subscribe to a single Firestore document in real-time.
 *
 * @template T Optional type for document data. Defaults to any.
 * @param {string | null} path - The path to the document. Pass null to disable fetching.
 * @returns {UseDocResult<T>} Object with data, isLoading, error.
 */
export function useDoc<T = any>(
  path: string | null,
): UseDocResult<T> {
  const firestore = useFirestore();
  const [data, setData] = useState<WithId<T> | null>(null);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!path || !firestore) {
      setIsLoading(false);
      setData(null);
      setError(null);
      return;
    }
    
    setIsLoading(true);
    
    const docRef = doc(firestore, path);
    
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot) => {
        if (snapshot.exists()) {
          setData({ ...(snapshot.data() as T), id: snapshot.id });
        } else {
          setData(null);
        }
        setError(null);
        setIsLoading(false);
      },
      (err: FirestoreError) => {
        console.error(`useDoc: Error listening to ${path}`, err);
        setError(err);
        setData(null);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [path, firestore]);

  return { data, isLoading, error };
}
