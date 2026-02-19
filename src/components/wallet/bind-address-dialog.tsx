'use client';

import { useEffect, useRef, useState } from 'react';
import type { User } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useRouter } from 'next/navigation';


interface BindAddressDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
    paymentMethodName: string;
}

export function BindAddressDialog({ isOpen, onOpenChange, user, paymentMethodName }: BindAddressDialogProps) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) {
        toast({ variant: 'destructive', title: "Error", description: "Database not available." });
        return;
    }
    
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const paymentAddress = formData.get('paymentAddress') as string;
    
    if (!paymentAddress) {
        toast({ variant: 'destructive', title: "Error", description: "Wallet address cannot be empty." });
        setIsLoading(false);
        return;
    }
    
    const userDocRef = doc(firestore, 'users', user.id);
    const newPaymentMethods = {
      ...user.paymentMethods,
      [paymentMethodName]: paymentAddress,
    };

    updateDoc(userDocRef, { paymentMethods: newPaymentMethods })
      .then(() => {
        toast({ title: "Success!", description: `${paymentMethodName} address has been bound.` });
        onOpenChange(false);
        router.push('/wallet/withdraw');
      })
      .catch((error) => {
        console.error("Error binding address: ", error);
        errorEmitter.emit(
          'permission-error',
          new FirestorePermissionError({
            path: userDocRef.path,
            operation: 'update',
            requestResourceData: { paymentMethods: newPaymentMethods },
          })
        );
        // The listener will throw, but we add a toast as a fallback.
        toast({ variant: 'destructive', title: "Error", description: "Could not bind address. Please check your permissions and try again." });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      formRef.current?.reset();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bind {paymentMethodName}</DialogTitle>
          <DialogDescription>
            Enter your wallet address, and double check for accuracy
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment-address">Wallet Address</Label>
            <Input
              id="payment-address"
              name="paymentAddress"
              placeholder={`Your ${paymentMethodName} address`}
              defaultValue={user.paymentMethods?.[paymentMethodName] || ''}
              required
              className="font-mono text-xs"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Bind Address
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
