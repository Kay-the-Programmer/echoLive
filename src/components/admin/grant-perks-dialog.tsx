'use client';

import { useState, useEffect } from 'react';
import type { User } from '@/lib/types';
import { vipLevels } from '@/lib/data';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useFirestore } from '@/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';
import { addDays } from 'date-fns';

interface GrantPerksDialogProps {
  initialUser: User;
  allUsers: User[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GrantPerksDialog({ initialUser, allUsers, isOpen, onOpenChange }: GrantPerksDialogProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('coins');
  const [selectedUserId, setSelectedUserId] = useState(initialUser.id);
  const [isLoading, setIsLoading] = useState(false);
  const firestore = useFirestore();

  useEffect(() => {
    if(isOpen) {
      setSelectedUserId(initialUser.id);
      setIsLoading(false);
      setActiveTab('coins');
    }
  }, [initialUser, isOpen]);
  
  const selectedUser = allUsers.find(u => u.id === selectedUserId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Database not available.' });
      return;
    }
    
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const userId = formData.get('userId') as string;
    const grantType = formData.get('grantType') as 'coins' | 'vip';
    
    const userRef = doc(firestore, 'users', userId);

    try {
        if (grantType === 'coins') {
            const amount = Number(formData.get('amount'));
            if (isNaN(amount) || amount <= 0) {
                toast({ variant: 'destructive', title: 'Error', description: 'Invalid coin amount.' });
                setIsLoading(false);
                return;
            }

            await updateDoc(userRef, {
                coinBalance: increment(amount)
            });

            toast({ title: 'Success!', description: `Successfully granted ${amount.toLocaleString()} coins to the user.` });
        } 
        
        if (grantType === 'vip') {
            const tier = formData.get('tier') as string;
            const duration = Number(formData.get('duration'));
            if (!tier || isNaN(duration) || duration <= 0) {
                 toast({ variant: 'destructive', title: 'Error', description: 'Invalid VIP tier or duration.' });
                 setIsLoading(false);
                 return;
            }
            
            const now = new Date();
            const expiryDate = addDays(now, duration);

            await updateDoc(userRef, {
                vip: {
                    tier: tier,
                    activationDate: now.toISOString(),
                    expiryDate: expiryDate.toISOString(),
                }
            });
            
            toast({ title: 'Success!', description: `Successfully granted ${tier} VIP for ${duration} days.` });
        }
      onOpenChange(false);
    } catch (error: any) {
        console.error("Grant perk failure:", error);
        toast({ variant: 'destructive', title: 'Error', description: error.message || "An unexpected error occurred." });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grant Perk</DialogTitle>
          <DialogDescription>
            Select a user and the perk to grant. The changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
           <div className="space-y-2">
            <Label htmlFor="user-select">User</Label>
            <Select name="userId" value={selectedUserId} onValueChange={setSelectedUserId} required>
              <SelectTrigger id="user-select" className="h-auto">
                {selectedUser ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                        <AvatarFallback>{selectedUser.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-medium">{selectedUser.name}</span>
                        <span className="text-xs text-muted-foreground">({selectedUser.numericId})</span>
                      </div>
                    </div>
                ) : (
                    <SelectValue placeholder="Select a user" />
                )}
              </SelectTrigger>
              <SelectContent>
                {allUsers.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-medium">{user.name}</span>
                        <span className="text-xs text-muted-foreground">({user.numericId})</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <input type="hidden" name="grantType" value={activeTab} />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="coins">Grant Coins</TabsTrigger>
              <TabsTrigger value="vip">Grant VIP</TabsTrigger>
            </TabsList>
            <TabsContent value="coins" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="coin-amount">Coin Amount</Label>
                <Input id="coin-amount" name="amount" type="number" placeholder="e.g., 10000" required />
              </div>
            </TabsContent>
            <TabsContent value="vip" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="vip-tier">VIP Tier</Label>
                <Select name="tier" required>
                  <SelectTrigger id="vip-tier">
                    <SelectValue placeholder="Select a VIP tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {vipLevels.map((level) => (
                      <SelectItem key={level.id} value={level.name}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="vip-duration">Duration (in days)</Label>
                <Input id="vip-duration" name="duration" type="number" placeholder="e.g., 30" defaultValue={30} required />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Grant Perk
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  );
}
