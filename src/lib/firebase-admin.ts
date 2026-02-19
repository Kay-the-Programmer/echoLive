import admin from 'firebase-admin';
import { firebaseConfig } from '@/firebase/config';

// This is a server-side only file.

// Check if the app is already initialized to prevent errors
if (!admin.apps.length) {
  try {
    // Initialize with explicit Project ID to override any incorrect environment
    // variables and resolve metadata server authentication issues.
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

/**
 * A stable, server-side Firestore database instance.
 */
export const db = admin.firestore();

/**
 * A stable, server-side Firebase Authentication instance.
 */
export const auth = admin.auth();
