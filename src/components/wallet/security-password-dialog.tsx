'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Fingerprint, Delete } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const PASSWORD_LENGTH = 6;

interface SecurityPasswordDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    onSuccess: () => void; // This function will now handle the withdrawal logic
}

export function SecurityPasswordDialog({ isOpen, onOpenChange, user, onSuccess }: SecurityPasswordDialogProps) {
    const firestore = useFirestore();
    const [mode, setMode] = useState<'create' | 'confirm' | 'enter'>('enter');
    const [password, setPassword] = useState<string[]>([]);
    const [confirmPassword, setConfirmPassword] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Reset state when the dialog opens
    useEffect(() => {
        if (isOpen) {
            setPassword([]);
            setConfirmPassword([]);
            setError(null);
            setMode(user.securityPasswordSet ? 'enter' : 'create');
        }
    }, [isOpen, user.securityPasswordSet]);

    const handleNumberClick = (num: string) => {
        setError(null);
        const targetArray = mode === 'confirm' ? confirmPassword : password;
        const setTargetArray = mode === 'confirm' ? setConfirmPassword : setPassword;
        if (targetArray.length < PASSWORD_LENGTH) {
            setTargetArray([...targetArray, num]);
        }
    };

    const handleDeleteClick = () => {
        setError(null);
        const targetArray = mode === 'confirm' ? confirmPassword : password;
        const setTargetArray = mode === 'confirm' ? setConfirmPassword : setPassword;
        setTargetArray(targetArray.slice(0, -1));
    };

    // Effect for handling password entry when CREATING a password or ENTERING an existing one
    useEffect(() => {
        const processPasswordEntry = () => {
            if (password.length === PASSWORD_LENGTH) {
                if (mode === 'create') {
                    setMode('confirm'); // Move to confirmation step
                } else if (mode === 'enter') {
                    // For entering password (like withdrawal), immediately trigger success and close.
                    // The parent component is now responsible for loading states and server calls.
                    onSuccess();
                    onOpenChange(false);
                }
            }
        };
        processPasswordEntry();
    }, [password, mode, onSuccess, onOpenChange]);

    // Effect for handling the CONFIRMATION step when creating a new password
    useEffect(() => {
        const processConfirmPassword = async () => {
            if (mode === 'confirm' && confirmPassword.length === PASSWORD_LENGTH) {
                if (password.join('') === confirmPassword.join('')) {
                    if (!firestore) {
                        setError("Database not available.");
                        return;
                    }
                    const userDocRef = doc(firestore, 'users', user.id);
                    try {
                        // This part is only for setting the flag that a password exists.
                        await updateDoc(userDocRef, { securityPasswordSet: true });
                        onSuccess(); // Call success callback
                        onOpenChange(false); // Close dialog
                    } catch (e) {
                        console.error("Error setting security password flag:", e);
                        errorEmitter.emit('permission-error', new FirestorePermissionError({
                            path: userDocRef.path,
                            operation: 'update',
                            requestResourceData: { securityPasswordSet: true }
                        }));
                        setError("Failed to set password. Check permissions.");
                    }
                } else {
                    setError("Passwords do not match. Please start over.");
                    setPassword([]);
                    setConfirmPassword([]);
                    setMode('create');
                }
            }
        };
        processConfirmPassword();
    }, [confirmPassword, mode, password, onSuccess, onOpenChange, firestore, user.id]);


    const getTitle = () => {
        if (mode === 'create') return 'Create Security Password';
        if (mode === 'confirm') return 'Confirm Security Password';
        return 'Enter Security Password';
    };

    const getDescription = () => {
        if (mode === 'create') return 'Please create a 6-digit password.';
        if (mode === 'confirm') return 'Please enter the password again to confirm.';
        return 'Enter your 6-digit security password.';
    };

    const activePasswordArray = mode === 'confirm' ? confirmPassword : password;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm p-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-center">{getTitle()}</DialogTitle>
                    <DialogDescription className="text-center">{getDescription()}</DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-2 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        {Array.from({ length: PASSWORD_LENGTH }).map((_, i) => (
                            <div key={i} className={cn(
                                "h-12 w-8 rounded-md flex items-center justify-center border-2",
                                error ? "border-destructive" : "border-input",
                                activePasswordArray[i] && (error ? "bg-destructive/10" : "border-primary")
                            )}>
                                {activePasswordArray[i] && <div className="h-3 w-3 rounded-full bg-foreground"></div>}
                            </div>
                        ))}
                    </div>
                    {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                </div>

                <div className="bg-muted/50 p-2">
                    <div className="grid grid-cols-3 gap-2 place-items-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                            <Button key={num} variant="ghost" className="h-12 w-12 rounded-full text-2xl font-bold" onClick={() => handleNumberClick(String(num))}>
                                {num}
                            </Button>
                        ))}
                         <div className="h-12 w-12 flex items-center justify-center">
                           <Fingerprint className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button variant="ghost" className="h-12 w-12 rounded-full text-2xl font-bold" onClick={() => handleNumberClick('0')}>
                            0
                        </Button>
                        <Button variant="ghost" className="h-12 w-12 rounded-full" onClick={handleDeleteClick}>
                            <Delete className="h-8 w-8" />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
