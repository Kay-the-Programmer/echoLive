
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { StreamCard } from "@/components/stream-card";
import { livePartyRooms, popularLiveStreams } from "@/lib/data";
import { placeholderImages as placeholderImagesData } from "@/lib/placeholder-images.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Coins } from "lucide-react";

export default function ExplorePage() {
  const [showBonusDialog, setShowBonusDialog] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBonusDialog(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const bonusImage = placeholderImagesData.find(p => p.id === "gift-bonus");

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Home Feed"
        description="Discover the most popular streams and party rooms."
      />

      <section className="mt-8">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-primary neon-purple mb-4">
          Live Party Rooms
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {livePartyRooms.map((room) => (
            <StreamCard key={room.id} stream={room} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-headline text-2xl font-bold tracking-tight text-primary neon-purple mb-4">
          Popular Live Streams
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {popularLiveStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </section>

      <Dialog open={showBonusDialog} onOpenChange={setShowBonusDialog}>
        <DialogContent className="sm:max-w-[425px] bg-card border-primary/50">
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl text-primary neon-purple flex items-center gap-2">
              <Gift className="h-6 w-6" /> Welcome to EchoLive!
            </DialogTitle>
            <DialogDescription className="text-muted-foreground pt-2">
              As a new member of our community, you've received a special registration bonus.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 text-center">
            {bonusImage && (
               <Image
                src={bonusImage.imageUrl}
                alt="Registration Bonus"
                width={200}
                height={200}
                className="mx-auto rounded-lg shadow-lg shadow-primary/20"
                data-ai-hint={bonusImage.imageHint}
              />
            )}
            <p className="mt-4 text-lg font-bold text-foreground flex items-center justify-center gap-2">
              You've been awarded
            </p>
            <p className="font-headline text-4xl font-bold text-amber-400 flex items-center justify-center gap-2" style={{textShadow: "0 0 10px #fbbF2480"}}>
              <Coins className="h-8 w-8" /> 750 Coins
            </p>
          </div>
          <Button onClick={() => setShowBonusDialog(false)} variant="secondary" className="w-full">
            Start Exploring
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
