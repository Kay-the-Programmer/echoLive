
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { X, Pencil, MapPin, Loader2 } from 'lucide-react';
import { FourSeatsIcon, SixSeatsIcon, NineSeatsIcon, SixteenSeatsIcon, TwentyOneSeatsIcon, TwentySixSeatsIcon, ThirtyOneSeatsIcon } from '@/components/icons/seats';
import Link from 'next/link';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { collection, addDoc } from 'firebase/firestore';
import type { PartyRoom } from '@/lib/types';

const partyTags = ["Chatting", "Singing", "Dancing", "Make Friends", "Talent", "Music", "Funny", "Stories"];
const seatLayouts = [
  { id: '4', icon: FourSeatsIcon, label: '4-seats' },
  { id: '6', icon: SixSeatsIcon, label: '6-seats' },
  { id: '9', icon: NineSeatsIcon, label: '9-seats' },
  { id: '16', icon: SixteenSeatsIcon, label: '16-seats' },
  { id: '21', icon: TwentyOneSeatsIcon, label: '21-seats' },
  { id: '26', icon: TwentySixSeatsIcon, label: '26 seats' },
  { id: '31', icon: ThirtyOneSeatsIcon, label: '31-seats' },
];

export default function CreatePartyPage() {
  const [mode, setMode] = useState<'video' | 'voice'>('voice');
  const [selectedLayout, setSelectedLayout] = useState('9');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showActivityWarning, setShowActivityWarning] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const [isCreating, setIsCreating] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showActivityWarning) {
      timer = setTimeout(() => {
        setShowActivityWarning(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showActivityWarning]);

  const handleSelectTag = (tag: string) => {
    setSelectedTag(tag);
    if (showActivityWarning) {
      setShowActivityWarning(false);
    }
  };
  
  const handleSelectLayout = (layoutId: string) => {
    setSelectedLayout(layoutId);
    if (layoutId === '4') {
      setMode('voice');
    }
  };

  const handleHoldParty = async () => {
    if (!selectedTag) {
      setShowActivityWarning(true);
      return;
    }
    if (!authUser || !firestore) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to create a party room.",
      });
      return;
    }

    setIsCreating(true);

    const capacity = parseInt(selectedLayout, 10);
    const seats: { [key: string]: string | null } = {};
    for (let i = 1; i <= capacity; i++) {
        seats[String(i)] = null;
    }
    // The creator (host) takes the first seat.
    seats['1'] = authUser.uid;

    const newRoomData: Omit<PartyRoom, 'id'> = {
        title: roomTitle || `${authUser.displayName}'s Party`,
        roomType: `${selectedLayout}-seat`,
        capacity,
        isLive: true,
        userIds: [authUser.uid],
        seats,
    };

    try {
        const partyRoomsCollection = collection(firestore, 'party_rooms');
        const newRoomRef = await addDoc(partyRoomsCollection, newRoomData);
        router.push(`/party/${newRoomRef.id}`);
    } catch (error: any) {
      console.error("Error creating party room:", error);
      toast({
        variant: 'destructive',
        title: "Creation Failed",
        description: error.message || "Could not create the party room. Please check permissions and try again.",
      });
       setIsCreating(false);
    }
  };

  const userAvatar = authUser?.photoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#2a1a3c] via-[#1a132d] to-[#131127] text-white">
      {/* Header */}
      <header className="flex flex-shrink-0 items-center justify-between p-4">
        <Link href="/party" passHref>
          <X className="h-6 w-6 text-white/80" />
        </Link>
        <MapPin className="h-5 w-5 text-white/80" />
      </header>

      {/* Main Content */}
      <main className="flex-grow space-y-8 px-4 pt-4">
        {/* User Info & Title */}
        <div className="flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src={userAvatar}
              alt="User Avatar"
              fill
              className="rounded-lg object-cover"
              data-ai-hint="man portrait"
            />
            <button className="absolute inset-0 bg-black/50 flex items-end justify-center rounded-lg opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-full text-center text-xs font-semibold py-1 rounded-b-lg bg-black/60">
                    Change
                </div>
            </button>
          </div>
          <div className="flex-grow space-y-3 overflow-hidden">
            <div className="relative">
                <Input
                    placeholder="Give your party a title..."
                    value={roomTitle}
                    onChange={(e) => setRoomTitle(e.target.value)}
                    className="h-9 bg-transparent border-0 border-b border-white/20 rounded-none px-0 pr-8 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-b-purple-400"
                />
                <Pencil className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
            </div>
            
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex items-center gap-2 pb-2">
                {partyTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className={cn(
                      'px-3 py-1 text-xs rounded-full transition-colors shrink-0 border',
                      selectedTag === tag
                        ? 'bg-white/20 text-white border-white'
                        : 'bg-white/10 text-white/70 border-transparent'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="h-0" />
            </ScrollArea>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full flex-shrink-0 space-y-6 pb-4">
        {/* Activity Not Selected Warning */}
        {showActivityWarning && (
          <div className="text-center text-white text-sm -mb-2">
            Activity Not Selected
          </div>
        )}

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex items-center rounded-full bg-black/30 p-1">
            <Button
              onClick={() => {
                if (selectedLayout === '4') {
                    return;
                }
                setMode('video')
              }}
              variant="ghost"
              className={cn(
                'rounded-full px-2 py-1 h-auto text-sm',
                mode === 'video' ? 'bg-purple-600 text-white' : 'text-white/70',
                "hover:bg-purple-700 hover:text-white"
              )}
            >
              Video
            </Button>
            <Button
              onClick={() => setMode('voice')}
              variant="ghost"
              className={cn(
                'rounded-full px-2 py-1 h-auto text-sm',
                mode === 'voice' ? 'bg-purple-600 text-white' : 'text-white/70',
                "hover:bg-purple-700 hover:text-white"
              )}
            >
              Voice
            </Button>
          </div>
        </div>

        {/* Seat Layout Selector */}
        <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max justify-center space-x-8 px-4 mx-auto">
                {seatLayouts.map((layout) => {
                const isSelected = selectedLayout === layout.id;
                return (
                    <button
                        key={layout.id}
                        onClick={() => handleSelectLayout(layout.id)}
                        className="flex flex-col items-center gap-2"
                    >
                        <layout.icon
                            className={cn(
                                'h-12 w-12 transition-colors',
                                isSelected ? 'text-white' : 'text-white/40'
                            )}
                        />
                        <span className={cn('text-xs', 
                           isSelected ? 'text-white' : 'text-white/40 font-medium'
                        )}>
                            {layout.label}
                        </span>
                    </button>
                );
                })}
            </div>
            <ScrollBar orientation="horizontal" className="h-0" />
        </ScrollArea>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-center px-4">
          <Button onClick={handleHoldParty} disabled={isCreating} className="rounded-full bg-purple-600 font-semibold text-white hover:bg-purple-700 px-12">
              {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Hold Party'}
          </Button>
        </div>
        
        {/* Bottom Navigation */}
        <div className="flex justify-center items-center space-x-12 text-lg">
          <Link href="#" className="text-white/70">
            Live
          </Link>
          <div className="flex flex-col items-center">
            <span className="text-white font-semibold">Party</span>
            <div className="w-6 h-1 bg-white rounded-full mt-1"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
