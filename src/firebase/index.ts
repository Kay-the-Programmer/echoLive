'use client';

// Main provider and core hooks
export { FirebaseProvider, useUser, useAuth, useFirestore, useFirebaseApp, type UserHookResult } from './provider';

// Firestore hooks
export { useCollection } from './firestore/use-collection';
export { useDoc } from './firestore/use-doc';
export { useAppOwners } from './firestore/use-app-owners';
export { useGlobalBalance } from './firestore/use-global-balance';
export { useTreasuryAccess } from './firestore/use-treasury-access';


// Errors
export * from './errors';
export * from './error-emitter';
