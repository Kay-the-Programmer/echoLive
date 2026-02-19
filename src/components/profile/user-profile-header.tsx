'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Leaf, Flame, Copy, ChevronRight } from "lucide-react";
import type { User } from '@/lib/types';
import { User as AuthUserType } from 'firebase/auth';

export function UserProfileHeader({ user, authUser }: { user: User | null; authUser: AuthUserType | null }) {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "ID copied to clipboard.",
    });
  };
  
  const displayName = user?.name || authUser?.displayName || 'User';
  const numericId = user?.numericId || '...';
  const avatarUrl = user?.avatarUrl || authUser?.photoURL || `https://picsum.photos/seed/${user?.id || 'user'}/128`;
  const level = user?.level ?? 1;
  const wealthLevel = user?.wealthLevel ?? 1;

  return (
    <Link href="#" className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>{displayName?.[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-1.5">
          <h1 className="text-base font-bold text-foreground leading-tight">
            {displayName}
          </h1>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="border-green-300 bg-green-100 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300 h-auto w-auto px-1.5 flex items-center gap-0.5 rounded-full font-normal text-[9px]">
              <Leaf className="h-2.5 w-2.5" />
              <span className="font-semibold leading-none">{level}</span>
            </Badge>
            <Badge variant="outline" className="border-orange-300 bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:border-orange-700 dark:text-orange-300 h-auto w-auto px-1.5 flex items-center gap-0.5 rounded-full font-normal text-[9px]">
              <Flame className="h-2.5 w-2.5" />
              <span className="font-semibold leading-none">{wealthLevel}</span>
            </Badge>
            <Badge variant="secondary" className="h-auto p-1 bg-muted hover:bg-muted text-muted-foreground font-normal text-[9.5px]">
              <span className="font-medium mr-1">ID</span>
              <span className="font-mono text-[9px]">{numericId}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 ml-0.5"
                onClick={(e) => { e.preventDefault(); copyToClipboard(numericId); }}
              >
                <Copy className="h-2.5 w-2.5" />
              </Button>
            </Badge>
          </div>
        </div>
      </div>
      <ChevronRight className="h-6 w-6 text-muted-foreground" />
    </Link>
  );
}
