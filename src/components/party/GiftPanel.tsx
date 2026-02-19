'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { User, Gift } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser, useAuth } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { gifts } from '@/lib/data';
import { ToastAction } from '@/components/ui/toast';


const quantityOptions = [1, 10, 50, 100, 520, 1314];

interface GiftPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[];
  currentUser: User | null;
  initialRecipients?: string[];
}

export function GiftPanel({ open, onOpenChange, users, currentUser, initialRecipients = [] }: GiftPanelProps) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedGiftId, setSelectedGiftId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'Gift' | 'Lucky'>('Gift');
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser } = useUser();
  const auth = useAuth();

  const giftTabs = ["Gift", "Lucky", "Fun Club", "Privilege", "Fun", "Custom", "Favorites"];
  const isExchange = activeTab === 'Gift';
  
  const selectableUsers = users; // Reverted to include all users

  const filteredGifts = useMemo(() => {
    return gifts.filter(g => g.category === activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (filteredGifts.length > 0) {
      setSelectedGiftId(filteredGifts[0].id);
    } else {
      setSelectedGiftId(null);
    }
  }, [filteredGifts, activeTab]);
  
  useEffect(() => {
    if (open) {
      if (initialRecipients.length > 0) {
        setSelectedUserIds(initialRecipients);
      } else if (users.length > 0) {
        setSelectedUserIds([users[0].id]); // Default to first user if no initial recipients
      } else {
        setSelectedUserIds([]);
      }
    }
  }, [open, users, initialRecipients]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserIds(prev => {
      if (prev.includes(userId)) {
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== userId);
      }
      return [...prev, userId];
    });
  };

  const handleSelectAll = () => {
    const selectableIds = selectableUsers.map(u => u.id);
    if (selectedUserIds.length === selectableIds.length && selectableIds.length > 0) {
        setSelectedUserIds([selectableIds[0]]);
    } else {
        setSelectedUserIds(selectableIds);
    }
  };

  const handleAction = async () => {
    if (!authUser || !currentUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in.' });
      return;
    }
    if (selectedUserIds.length === 0) {
      toast({ variant: 'destructive', title: 'No Recipient', description: 'Please select a user.' });
      return;
    }
    const selectedGift = gifts.find(g => g.id === selectedGiftId);
    if (!selectedGift) {
      toast({ variant: 'destructive', title: 'No Item Selected', description: 'Please select an item to send.' });
      return;
    }

    const totalCost = selectedGift.price * quantity;

    if ((currentUser.coinBalance ?? 0) < totalCost) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Coins',
        description: `You need ${totalCost.toLocaleString()} coins.`,
        action: (
          <ToastAction altText="Buy Coins" onClick={() => router.push('/shop/coins')}>
            Buy Coins
          </ToastAction>
        ),
      });
      return;
    }

    setIsSending(true);

    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error("Authentication token not found.");
      }

      const response = await fetch('/api/gift/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          giftId: selectedGift.id,
          recipientIds: selectedUserIds,
          quantity,
          isExchange: activeTab === 'Gift',
        }),
      });

      const result = await response.json();
      console.log("RAW RESPONSE:", result);
      if (!response.ok) {
        throw new Error(result.error || `Request failed with status ${response.status}`);
      }

      const recipientNames = users.filter(u => selectedUserIds.includes(u.id)).map(u => u.name).join(', ');
      toast({ 
        title: "Success!", 
        description: `Sent to ${recipientNames}.`
      });
      onOpenChange(false);
      
    } catch (error: any) {
        console.error("Failed to send gift:", error);
        toast({
            variant: 'destructive',
            title: 'Action Failed',
            description: error.message || 'Could not complete the action. Please try again.',
        });
    } finally {
        setIsSending(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[75%] rounded-t-2xl bg-[#1f1a2c] text-white border-t-0 p-0 flex flex-col">
        <div className="flex-shrink-0 p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
             <span className="text-sm font-semibold flex-shrink-0">Send to:</span>
             <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex items-center gap-2 pr-4">
                  {selectableUsers.map(user => (
                    <button key={user.id} onClick={() => handleUserSelect(user.id)} className={cn(
                      "flex flex-col items-center gap-1 p-1 rounded-lg transition-colors",
                      selectedUserIds.includes(user.id) ? "bg-white/20" : ""
                    )}>
                      <Avatar className={cn("h-10 w-10 border-2", selectedUserIds.includes(user.id) ? 'border-amber-400' : 'border-transparent')}>
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-xs truncate max-w-12">{user.name}</span>
                    </button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-0" />
            </ScrollArea>
          </div>
          <Button onClick={handleSelectAll} size="sm" className="rounded-full bg-white/20 hover:bg-white/30 text-white flex-shrink-0">ALL</Button>
        </div>

        <div className="flex-shrink-0 px-3">
          <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex items-center h-auto justify-start">
                {giftTabs.map(tabName => (
                  <button
                    key={tabName}
                    onClick={() => setActiveTab(tabName as 'Gift' | 'Lucky')}
                    className={cn(
                      "bg-transparent p-1 mr-4 border-b-2 text-sm font-medium",
                      activeTab === tabName
                        ? 'text-amber-400 border-amber-400'
                        : 'text-gray-400 border-transparent'
                    )}
                  >
                    {tabName}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-0" />
          </ScrollArea>
        </div>

        <div className="flex-shrink-0 px-3 py-2 flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-orange-500/30 text-orange-300 rounded-full px-2 py-0.5">
            <span className="font-bold">J</span>
            <span>18</span>
          </div>
          <Progress value={20} className="h-2 flex-1 bg-gray-600" />
          <span className="text-gray-400">XP requires: 1,218,044</span>
          <span className="text-gray-400">Lv.19 {'>'}</span>
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-4 gap-x-2 gap-y-4 p-3">
            {filteredGifts.map(gift => (
              <button
                key={gift.id}
                onClick={() => setSelectedGiftId(gift.id)}
                className={cn(
                  "flex flex-col items-center justify-between h-[110px] gap-1 text-center relative p-1 transition-colors rounded-lg",
                  selectedGiftId === gift.id ? 'bg-white/10 ring-2 ring-amber-400' : ''
                )}
              >
                {gift.badges?.map(badge => (
                  <Badge key={badge.text} className={cn('absolute top-0 right-0 text-xs px-1.5 h-auto z-10', badge.color)}>{badge.text}</Badge>
                ))}
                <div className="flex-1 flex items-center justify-center">
                  {gift.imageUrl && <Image src={gift.imageUrl} alt={gift.name} width={56} height={56} className="object-contain" />}
                </div>
                <div>
                  <p className="text-xs truncate w-full">{gift.name}</p>
                  <p className="text-xs text-amber-400 flex items-center justify-center gap-1">
                    <span>🪙</span>
                    {gift.price}
                  </p>
                </div>
              </button>
            ))}
             {filteredGifts.length === 0 && (
              <div className="col-span-4 text-center py-10 text-muted-foreground">
                No items in this category.
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex-shrink-0 p-3 bg-black/30 flex items-center justify-between">
          <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <span>🪙</span>
              <span>{currentUser?.coinBalance?.toLocaleString() || 0} {'>'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-black/40 rounded-full">
                 {quantityOptions.slice(0, 4).map(q => (
                    <Button key={q} variant="ghost" className={cn("h-8 w-8 p-0 rounded-full text-xs", quantity === q ? 'bg-amber-500 text-white' : 'text-gray-400')}>
                        {q}
                    </Button>
                ))}
            </div>
            <Button onClick={handleAction} disabled={isSending} className="rounded-full bg-amber-500 hover:bg-amber-600 px-8 text-black font-bold">
              {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
