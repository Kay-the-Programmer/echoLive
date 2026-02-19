'use client';

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Search, Trophy, Flame, ChevronRight, PartyPopper, ChevronDown } from "lucide-react";
import Link from "next/link";
import { allStreams } from "@/lib/data"; // Changed to local import
import type { Stream } from "@/lib/types";
import { PartyRoomCard } from "@/components/party/party-room-card";
import { cn } from "@/lib/utils";
import { FlagIcon, MultiFlagIcon } from "@/components/icons";

const partyCategories = [
  { name: "Popular", label: "Popular", icon: <Flame className="h-4 w-4" /> },
  { name: "Global", label: "", icon: <MultiFlagIcon /> },
  { name: "Philippines", label: "Philippines", icon: <FlagIcon code="PH" className="h-4 w-4 rounded-sm"/> },
  { name: "New", label: "New", icon: <PartyPopper className="h-4 w-4" /> },
];

const HonorMallBanner = () => (
    <div className="px-2.5 py-2 border-t border-border">
        <div className="rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 p-3 flex items-center justify-between text-white">
            <div>
                <p className="text-xs font-medium">New in Honor Mall:</p>
                <p className="font-bold">Custom Ride is Now Available!</p>
            </div>
            <Button asChild size="sm" className="bg-yellow-300 text-amber-900 font-bold rounded-full hover:bg-yellow-200">
            <Link href="#">
                Check it out <ChevronRight className="h-4 w-4 ml-0.5" />
            </Link>
            </Button>
        </div>
    </div>
);


export default function PartyPage() {
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mainScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mainEl = mainScrollRef.current;
    if (!mainEl) return;

    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 2000);
    };

    mainEl.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mainEl.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  
  const partyRooms: Stream[] = allStreams.filter(s => s.isPartyRoom);

  const filteredPartyRooms = useMemo(() => {
    if (activeCategory === 'Popular') {
        return partyRooms;
    }
    if (activeCategory === 'Philippines') {
        return partyRooms.filter(r => r.user.countryCode === 'PH');
    }
    if (activeCategory === 'Global') {
        return partyRooms.filter(r => ['US', 'GB', 'NG', 'GH'].includes(r.user.countryCode));
    }
     if (activeCategory === 'New') {
        // Just show some recent rooms for "New"
        return partyRooms.slice(0, 5);
    }
    return partyRooms;
  }, [partyRooms, activeCategory]);

  return (
    <div ref={mainScrollRef} className="h-full overflow-y-auto">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex flex-1 items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Following</Link>
            <span className="text-base font-bold text-foreground">Party</span>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-2 pb-2 no-scrollbar">
            {partyCategories.map((cat) => {
              const isActive = activeCategory === cat.name;
              return (
                <Button 
                  key={cat.name} 
                  variant={isActive ? "secondary" : "outline"} 
                  size="sm" 
                  className={cn(
                    "rounded-full shrink-0 h-8 text-xs px-4 flex items-center gap-1.5",
                    isActive ? "bg-primary/20 text-primary" : "border-border/50",
                    !cat.label && "w-auto px-2.5" // Adjust padding for icon-only button
                  )}
                  onClick={() => setActiveCategory(cat.name)}
                >
                  {cat.icon}
                  {cat.label}
                </Button>
              )
            })}
             <Button variant="outline" size="icon" className="rounded-full border-border/50 shrink-0 h-8 w-8">
                <ChevronDown className="h-4 w-4" />
            </Button>
        </div>
      </header>

      <main className="container mx-auto px-0 py-4 md:px-4">
        <div className="bg-card">
            {filteredPartyRooms.length === 0 && (
                 <div className="text-center py-16 text-muted-foreground">
                    <p>No party rooms found for this category.</p>
                </div>
            )}
            {filteredPartyRooms.map((stream, index) => (
                <React.Fragment key={stream.id}>
                    <PartyRoomCard stream={stream} />
                    {index === 3 && <HonorMallBanner />}
                </React.Fragment>
            ))}
        </div>
      </main>

      <div className="fixed bottom-20 right-1 z-50 md:hidden">
        <Button asChild className={cn(
          "rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg flex items-center justify-center transition-all duration-500 ease-in-out",
          isScrolling 
            ? "w-10 h-10 p-0" 
            : "h-9 px-5"
        )}>
            <Link href="/party/create">
                <PartyPopper className="h-5 w-5" />
                <span className={cn(
                    "transition-all duration-200 whitespace-nowrap", 
                    isScrolling ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-2'
                )}>
                    Party
                </span>
            </Link>
        </Button>
      </div>
    </div>
  );
}
