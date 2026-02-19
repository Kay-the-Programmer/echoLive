
'use server';

import { db } from '@/lib/firebase-admin';

/**
 * Allows the first user to claim ownership of the app if no owner exists.
 * This runs with admin privileges on the server, bypassing security rules.
 */
export async function claimAppOwnership(
  userId: string
): Promise<{ success: boolean; message: string }> {
  if (!userId) {
    return { success: false, message: 'User ID is required.' };
  }

  try {
    const ownersCollection = db.collection('appowners');
    const ownersSnapshot = await ownersCollection.get();

    if (!ownersSnapshot.empty) {
      // Check if the current user is already the owner
      const isAlreadyOwner = (await ownersCollection.doc(userId).get()).exists;
      if (isAlreadyOwner) {
          return { success: true, message: 'You are already the App Owner.' };
      }
      return { success: false, message: 'An App Owner already exists.' };
    }

    // Use a batch to perform all writes atomically
    const batch = db.batch();

    // 1. Set the document in appowners
    const ownerDocRef = db.collection('appowners').doc(userId);
    batch.set(ownerDocRef, { assignedAt: new Date().toISOString() });
    
    // 2. Set the document in admins
    const adminDocRef = db.collection('admins').doc(userId);
    batch.set(adminDocRef, { grantedAt: new Date().toISOString() });

    // 3. Update the user's profile. Use set with merge to create the doc if it doesn't exist.
    const userDocRef = db.collection('users').doc(userId);
    batch.set(userDocRef, { isOwner: true, isAdmin: true }, { merge: true });

    await batch.commit();

    return { success: true, message: 'You have successfully claimed ownership of the application.' };

  } catch (error: any) {
    console.error('Error claiming app ownership:', error);
    return { success: false, message: error.message || 'An unexpected server error occurred.' };
  }
}
