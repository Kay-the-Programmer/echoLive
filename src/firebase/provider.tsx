'use client';
import React, { createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, type Auth, type User } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

// Type for the user part of the context
export interface AuthState {
    user: User | null;
    isUserLoading: boolean;
    userError: Error | null;
}

// Type for the combined Firebase context
interface FirebaseContextValue {
    app: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    authState: AuthState;
}

const FirebaseContext = createContext<FirebaseContextValue | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize Firebase services only once
    const services = useMemo(() => {
        const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
        const auth = getAuth(app);
        const firestore = getFirestore(app);
        return { app, auth, firestore };
    }, []);

    // Manage user auth state
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isUserLoading: true,
        userError: null,
    });

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            services.auth,
            (user) => {
                setAuthState({ user, isUserLoading: false, userError: null });
            },
            (error) => {
                console.error("FirebaseProvider: onAuthStateChanged error:", error);
                setAuthState({ user: null, isUserLoading: false, userError: error });
            }
        );
        return () => unsubscribe();
    }, [services.auth]);

    const contextValue: FirebaseContextValue = {
        ...services,
        authState,
    };

    return (
        <FirebaseContext.Provider value={contextValue}>
            <FirebaseErrorListener />
            {children}
        </FirebaseContext.Provider>
    );
};

// Main hook to access all services
const useFirebase = (): FirebaseContextValue => {
    const context = useContext(FirebaseContext);
    if (context === undefined) {
        throw new Error('useFirebase must be used within a FirebaseProvider');
    }
    return context;
};

// Specific hooks for convenience
export const useFirebaseApp = (): FirebaseApp => useFirebase().app;
export const useAuth = (): Auth => useFirebase().auth;
export const useFirestore = (): Firestore => useFirebase().firestore;
export const useUser = (): AuthState => useFirebase().authState;
export type UserHookResult = AuthState; // Keep this export for compatibility
