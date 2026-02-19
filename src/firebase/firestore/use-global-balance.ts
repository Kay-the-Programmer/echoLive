'use client';

import { useDoc } from '@/firebase/firestore/use-doc';
import type { GlobalBalance } from '@/lib/types';

/**
 * A hook to fetch the singleton global balance document from Firestore.
 * This is intended for use in the admin panel.
 * @returns The global balance data, loading status, and error state.
 */
export function useGlobalBalance(options?: { enabled?: boolean; }) {
  const docPath = 'global_balances/singleton';
  return useDoc<GlobalBalance>(options?.enabled === false ? null : docPath);
}
