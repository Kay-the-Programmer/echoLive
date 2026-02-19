'use client';

import { useDoc } from './use-doc';

/**
 * A hook to check if a specific user has treasury access.
 * @param userId The ID of the user to check.
 * @returns An object with `hasAccess` boolean and loading status.
 */
export function useTreasuryAccess(userId: string | undefined | null) {
    const path = userId ? `treasury_access/${userId}` : null;
    const { data, isLoading, error } = useDoc(path);
    return { hasAccess: !!data, isLoading, error };
}
