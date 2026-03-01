'use client';

import Link from "next/link";
import Image from "next/image";
import {
  MessageCircle,
  Music,
  Mic,
  Gamepad2,
  Users,
  PartyPopper
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FlagIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { Stream } from "@/lib/types";
import { placeholderImages } from "@/lib/data";

const AnimatedWaveIcon = () => (
  <div className="flex items-end gap-0.5 h-3 w-3">
    <style jsx>{`
            @keyframes wave-short {
                0%, 100% { height: 25%; }
                50% { height: 75%; }
            }
            @keyframes wave-long {
                0%, 100% { height: 75%; }
                50% { height: 25%; }
            }
            .animate-wave-short { animation: wave-short 1s ease-in-out infinite; }
            .animate-wave-long { animation: wave-long 1s ease-in-out infinite; }
        `}</style>
    <span className="w-[2px] bg-primary/80 animate-wave-short" style={{ animationDelay: '0.1s' }}></span>
    <span className="w-[2px] bg-primary animate-wave-long"></span>
    <span className="w-[2px] bg-primary/80 animate-wave-short" style={{ animationDelay: '0.3s' }}></span>
  </div>
);

const categoryStyles: { [key: string]: { icon: React.ElementType; className: string } } = {
  "Chatting": { icon: MessageCircle, className: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-600 dark:text-yellow-300" },
  "Music": { icon: Music, className: "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300" },
  "Singing": { icon: Mic, className: "bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300" },
  "Games": { icon: Gamepad2, className: "bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300" },
  "Dancing": { icon: Users, className: "bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300" },
};

const CategoryBadge = ({ category }: { category: string }) => {
  const style = categoryStyles[category] || { icon: PartyPopper, className: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300" };
  const Icon = style.icon;
  return (
    <Badge variant="secondary" className={cn("w-fit mt-1 border-none text-[10px] px-1.5 py-0.5 h-5 flex items-center gap-1", style.className)}>
      <Icon className="h-3 w-3" />
      {category}
    </Badge>
  );
};

export const PartyRoomCard = ({ stream }: { stream: Stream }) => {
  const otherUsers = placeholderImages.filter(p => p.id.startsWith('avatar-')).slice(stream.id.charCodeAt(1) % 10, (stream.id.charCodeAt(1) % 10) + 4);
  // Use a deterministic value for seat count to avoid hydration mismatch
  const seatCount = (stream.viewerCount % 5) + 4;

  return (
    <div className="border-t border-border">
      <Link href={`/party/${stream.id}`} className="block px-2.5 py-3 rounded-none">
        <div className="flex gap-3">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
            <Image
              src={stream.thumbnailUrl}
              alt={stream.user.name}
              fill
              className="object-cover"
              data-ai-hint="live streamer"
            />
          </div>
          <div className="flex flex-col flex-grow min-w-0">
            <p className="font-semibold text-sm truncate flex items-center gap-1.5">
              <span className="truncate">{stream.title}</span>
              <FlagIcon code={stream.user.countryCode} className="h-4 w-4 shrink-0 rounded-sm" />
            </p>
            <CategoryBadge category={stream.category} />
            <div className="flex items-center mt-auto">
              <div className="flex items-center">
                {otherUsers.slice(0, 3).map((u, i) => (
                  <Avatar key={u.id} className={`h-5 w-5 border-2 border-card ${i > 0 ? '-ml-2' : ''}`}>
                    <AvatarImage src={u.imageUrl} />
                    <AvatarFallback>{u.id.slice(-1)}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="ml-1 h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] text-muted-foreground font-mono border-2 border-card">
                  {seatCount}
                </div>
              </div>
              <div className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                <AnimatedWaveIcon />
                <span className="font-mono">{stream.viewerCount}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
