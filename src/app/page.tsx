"use client";

import { useState, useEffect, useRef } from "react";
import { StreamCard } from "@/components/stream-card";
import { Button } from "@/components/ui/button";
import { Search, Trophy, Crown, Star, Flame, PartyPopper, Video, Shield } from "lucide-react";
import Link from "next/link";
import { FlagIcon, MultiFlagIcon } from "@/components/icons";
import { allStreams as streams } from "@/lib/data"; // Changed to local import
import { EventCarousel } from "@/components/shared/event-carousel";
import { cn } from "@/lib/utils";

export default function Home() {
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
  
  const topStreams = streams.slice(0, 4);
  const bottomStreams = streams.slice(4);

  return (
    <div ref={mainScrollRef} className="h-full overflow-y-auto">
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex flex-1 items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground">Following</Link>
            <span className="text-base font-bold text-foreground">Explore</span>
            <Link href="#" className="hover:text-foreground">Newbies</Link>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Trophy className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <div className="container mx-auto flex items-center gap-2 overflow-x-auto px-2 pb-2 no-scrollbar">
            <Button variant="secondary" size="sm" className="rounded-full bg-primary/20 text-primary shrink-0 h-8 text-xs px-4">
              <Flame className="h-4 w-4 mr-1.5" />
              Popular
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-border/50 shrink-0 h-8 w-8">
                <MultiFlagIcon />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-border/50 shrink-0 h-8 w-8">
                <FlagIcon code="PH" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-border/50 shrink-0 h-8 w-8">
                <FlagIcon code="NG" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full border-border/50 shrink-0 h-8 w-8">
                <FlagIcon code="GH" />
            </Button>
             <Button variant="outline" size="icon" className="rounded-full border-border/50 shrink-0 h-8 w-8">
                <FlagIcon code="US" />
            </Button>
        </div>
      </header>

      <main className="container mx-auto px-2 py-4 md:px-4">
        
        <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 p-2 flex items-center justify-between">
                <div>
                    <p className="text-xs font-bold text-white bg-red-500 px-1.5 py-0.5 rounded-full inline-block">NEW</p>
                    <h2 className="text-sm font-bold text-white">Honor</h2>
                </div>
                <Crown className="h-6 w-6 text-white/70"/>
            </div>
             <div className="col-span-1 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 p-2 flex items-center justify-between">
                <div>
                    <h2 className="text-sm font-bold text-white">Activity Centre</h2>
                </div>
                <Star className="h-6 w-6 text-white/70"/>
            </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
            {topStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
        </div>
        
        <div className="my-2">
            <EventCarousel />
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2">
            {bottomStreams.map((stream) => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
        </div>
      </main>

      <div className="fixed bottom-20 right-1 z-50 md:hidden">
        <Button
          asChild
          className={cn(
            "rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg flex items-center justify-center transition-all duration-500 ease-in-out",
            isScrolling
              ? "w-10 h-10 p-0"
              : "h-9 px-5"
          )}
        >
          <Link href="#">
            <Video className="h-5 w-5 fill-white" />
            <span className={cn("transition-all duration-200 whitespace-nowrap", isScrolling ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-1')}>
                LIVE
            </span>
          </Link>
        </Button>
      </div>

    </div>
  );
}
