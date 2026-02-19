'use client';

import { useState, useMemo } from 'react';
import type { User } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { doc, writeBatch } from 'firebase/firestore';

interface GrantTreasuryAccessDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  allUsers: User[];
}

export function GrantTreasuryAccessDialog({ isOpen, onOpenChange, allUsers }: GrantTreasuryAccessDialogProps) {
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();

  const eligibleUsers = useMemo(() => {
    return allUsers.filter(u => !u.hasTreasuryAccess);
  }, [allUsers]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Database not available.' });
      return;
    }
    if (!selectedUserId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a user.' });
      return;
    }

    setIsLoading(true);

    const batch = writeBatch(firestore);
    const userRef = doc(firestore, 'users', selectedUserId);
    const treasuryRef = doc(firestore, 'treasury_access', selectedUserId);
    
    try {
        batch.set(treasuryRef, { grantedAt: new Date().toISOString() });
        batch.update(userRef, { hasTreasuryAccess: true });
        await batch.commit();

        toast({
            title: 'Access Granted',
            description: `User now has Treasury access.`,
        });
        onOpenChange(false);

    } catch (error: any) {
        console.error("Failed to grant treasury access:", error);
        toast({
            variant: 'destructive',
            title: 'Update Error',
            description: error.message || 'Could not update user role.',
        });
    } finally {
        setIsLoading(false);
        setSelectedUserId('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant Treasury Access</DialogTitle>
          <DialogDescription>
            Select a user to grant them permission to view and withdraw application revenue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="user-select">User</Label>
            <Select name="userId" value={selectedUserId} onValueChange={setSelectedUserId} required>
              <SelectTrigger id="user-select">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {eligibleUsers.length > 0 ? (
                  eligibleUsers.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.numericId})
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-4 text-sm text-center text-muted-foreground">
                    All users already have access.
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading || eligibleUsers.length === 0}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Grant Access
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
