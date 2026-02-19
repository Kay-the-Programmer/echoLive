
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { users as allUsersData } from '@/lib/data';
import type { PartyRoom, User } from '@/lib/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PlusCircle,
  X,
  Gift,
  LayoutGrid,
  Sofa,
  Loader2,
  Users,
  Crown,
  Smile,
  MicOff,
  Send,
} from 'lucide-react';
import { PKIcon } from '@/components/icons/party-icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { GiftPanel } from '@/components/party/GiftPanel';
import { useUser, useDoc } from '@/firebase';


const HostInfo = ({ host }: { host: User | null }) => {
  if (!host) return <Skeleton className="h-10 w-40 rounded-full" />;
  return (
    <div className="flex items-center gap-2 rounded-full bg-black/30 p-1 pr-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={host.avatarUrl} />
        <AvatarFallback>{host.name?.[0]}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-xs font-bold">{host.name}</p>
        <p className="text-[10px] text-white/70">ID: {host.numericId}</p>
      </div>
      <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-white/10 hover:bg-white/20 text-white/70">
        <PlusCircle className="h-4 w-4" />
      </Button>
    </div>
  );
};

const SeatBox = ({ seatNumber, user, isCrown = false, onSeatClick }: { seatNumber: number; user: User | null; isCrown?: boolean; onSeatClick: (user: User) => void; }) => {
    const seatContent = user ? (
        <div className="flex flex-col items-center gap-2">
            <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={user.avatarUrl} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
            </Avatar>
            <p className="text-xs text-white/80 font-semibold">{user.name}</p>
        </div>
    ) : (
        <div className="relative">
            <Sofa className={cn("h-8 w-8", isCrown ? "text-yellow-400/80" : "text-white/30" )} />
            {isCrown && (
                <Crown className="absolute -top-1 left-1/2 -translate-x-1/2 h-4 w-4 text-yellow-400 fill-yellow-400" />
            )}
        </div>
    );

    return (
        <div className={cn(
            "relative aspect-square flex-col gap-2 flex items-center justify-center border-r border-b border-white/20 bg-black/20"
        )}>
            <span className="absolute top-1 left-1.5 text-xs font-semibold text-white/30">{seatNumber}</span>
            {user ? (
                <button onClick={() => onSeatClick(user)} className="w-full h-full flex flex-col items-center justify-center">
                    {seatContent}
                </button>
            ) : seatContent}
        </div>
    );
};

const getGridColsClass = (capacity: number) => {
  if (capacity <= 4) return 'grid-cols-2';
  if (capacity <= 9) return 'grid-cols-3';
  if (capacity <= 16) return 'grid-cols-4';
  return 'grid-cols-5';
};


export default function PartyRoomPage() {
  const params = useParams();
  const roomId = params.id as string;
  const { toast } = useToast();
  
  const { user: authUser, isUserLoading: isAuthLoading } = useUser();
  const userPath = useMemo(() => (authUser ? `users/${authUser.uid}` : null), [authUser]);
  const { data: currentUserData, isLoading: isLoadingUser } = useDoc<User>(userPath);
  const { data: room, isLoading: isLoadingRoom } = useDoc<PartyRoom>(roomId ? `party_rooms/${roomId}`: null);
  
  const allUsers = useMemo(() => allUsersData, []);
  
  const roomCapacity = room?.capacity || 4;
  const [seatedUsers, setSeatedUsers] = useState<(User | null)[]>(Array(roomCapacity).fill(null));
  const [showGiftPanel, setShowGiftPanel] = useState(false);
  const [initialGiftRecipients, setInitialGiftRecipients] = useState<string[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Combine all loading states
  const isLoading = isLoadingRoom || isAuthLoading || (authUser && isLoadingUser);

  // Derived data using memos for performance
  const host = useMemo(() => {
    if (!room?.userIds?.[0]) return null;
    const hostId = room.userIds[0];
    if (authUser?.uid === hostId) return currentUserData;
    return allUsers.find(u => u.id === hostId) || null;
  }, [room, allUsers, authUser, currentUserData]);

  const partyRoomUsers = useMemo(() => {
    if (!room?.userIds) return [];
    return room.userIds
        .map(userId => {
            if (authUser?.uid === userId) return currentUserData;
            return allUsers.find(u => u.id === userId);
        })
        .filter((u): u is User => !!u);
  }, [room?.userIds, allUsers, authUser, currentUserData]);

  const handleSeatClick = (user: User) => {
    setInitialGiftRecipients([user.id]);
    setShowGiftPanel(true);
  };
  
  const handleOpenGiftPanel = () => {
    setInitialGiftRecipients([]);
    setShowGiftPanel(true);
  };

  useEffect(() => {
    if (!room?.seats) return;

    const capacity = room.capacity || 4;
    const newSeatedUsers = Array(capacity).fill(null);
    
    for (const seatNumberStr in room.seats) {
        const seatNumber = parseInt(seatNumberStr, 10);
        const userId = room.seats[seatNumberStr];

        if (userId && seatNumber <= capacity) {
            const user = partyRoomUsers.find(u => u.id === userId);
            if (user) {
                newSeatedUsers[seatNumber - 1] = user;
            }
        }
    }
    setSeatedUsers(newSeatedUsers);

  }, [room, partyRoomUsers]);

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || !authUser) return;
    setIsSendingMessage(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate sending
    toast({ title: 'Message Sent (Simulated)' });
    setChatMessage('');
    setIsSendingMessage(false);
  };

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#1A132D]">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
    );
  }

  if (!room) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-[#1A132D] text-white text-center">
            <div>
              <p className="text-2xl font-bold">Party Room not found.</p>
              <p className="text-muted-foreground">This room may no longer exist.</p>
              <Button asChild variant="link" className="mt-4"><Link href="/party">Back to Party List</Link></Button>
            </div>
        </div>
    );
  }

  const gridColsClass = getGridColsClass(room.capacity);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#2a1a3c] via-[#1a132d] to-[#131127] text-white overflow-hidden">
      <header className="flex-shrink-0 px-3 py-2">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
                <HostInfo host={host} />
                <div className="flex flex-col text-center">
                    <p className="text-xs font-bold">{room?.title}</p>
                    <p className="text-[10px] text-white/70">ID: {room.id.slice(0,8)}</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {partyRoomUsers.slice(0, 3).map((u, i) => (
                     <Avatar key={u.id} className={cn("h-6 w-6 border border-black", i > 0 && "-ml-2")}>
                       <AvatarImage src={u.avatarUrl} />
                       <AvatarFallback>{u.name?.[0]}</AvatarFallback>
                     </Avatar>
                  ))}
                   <div className="h-6 w-6 rounded-full bg-black/50 flex items-center justify-center text-xs -ml-2 border border-black">
                     <Users className="h-3 w-3 text-white/70"/>
                   </div>
                </div>
                 <Link href="/party">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50">
                        <X className="h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col min-h-0">
        <div className={cn("grid w-full", gridColsClass)}>
            {seatedUsers.map((user, index) => (
                <SeatBox
                    key={index}
                    seatNumber={index + 1}
                    user={user}
                    isCrown={index === 1 && room.capacity <= 9}
                    onSeatClick={handleSeatClick}
                />
            ))}
        </div>
        <div className="flex-1" />
      </main>

      <footer className="flex-shrink-0 bg-black/30 backdrop-blur-sm p-2 space-y-2">
        <div className="flex items-center gap-2">
          <Input 
              placeholder="Send a friendly message..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="h-9 bg-black/50 border-white/20 text-white placeholder:text-white/50"
          />
          <Button size="icon" onClick={handleSendMessage} disabled={isSendingMessage} className="h-9 w-9 flex-shrink-0">
              {isSendingMessage ? <Loader2 className="h-4 w-4 animate-spin"/> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center justify-around">
            <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-1 text-white/80 hover:bg-white/10 hover:text-white">
                <MicOff className="h-6 w-6" />
                <span className="text-[10px] mt-1">Mic</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-1 text-white/80 hover:bg-white/10 hover:text-white">
                <Smile className="h-6 w-6" />
                <span className="text-[10px] mt-1">Emoji</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-1 text-white/80 hover:bg-white/10 hover:text-white">
                <LayoutGrid className="h-6 w-6" />
                <span className="text-[10px] mt-1">Layout</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-1 text-white/80 hover:bg-white/10 hover:text-white">
                <Sofa className="h-6 w-6" />
                <span className="text-[10px] mt-1">Seat</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-1 text-white/80 hover:bg-white/10 hover:text-white">
                <PKIcon className="h-8 w-8" />
                <span className="text-[10px] -mt-1">PK</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-1 text-white/80 hover:bg-white/10 hover:text-white">
                <span className="h-8 w-8 flex items-center justify-center text-2xl">🎮</span>
                <span className="text-[10px] -mt-1">Game</span>
            </Button>
             <Button variant="ghost" className="flex flex-col items-center justify-center h-auto p-1 text-white/80 hover:bg-white/10 hover:text-white" onClick={handleOpenGiftPanel}>
                <Gift className="h-6 w-6 text-pink-400" />
                <span className="text-[10px] mt-1">Gift</span>
            </Button>
        </div>
      </footer>

      {currentUserData && <GiftPanel
        open={showGiftPanel}
        onOpenChange={setShowGiftPanel}
        users={partyRoomUsers}
        currentUser={currentUserData}
        initialRecipients={initialGiftRecipients}
      />}
    </div>
  );
}
