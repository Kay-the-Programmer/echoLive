'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import {
  Crown,
  LogIn,
  Loader2,
  ChevronRight,
  Gem,
  Share2,
} from 'lucide-react';
import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BalanceCard } from '@/components/shared/balance-card';
import { ProfileMenu } from '@/components/profile/profile-menu';
import { AgentAndSettingsMenu } from '@/components/profile/agent-and-settings-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { UserProfileHeader } from '@/components/profile/user-profile-header';
import { copyInvitationLink } from '@/lib/invitation';
import { useToast } from '@/hooks/use-toast';

// Helper component for stat items
const StatItem = ({ value, label }: { value: string | number; label: string; }) => (
  <Link href="#" className="flex flex-col items-center gap-1 text-center">
    <div className="relative">
      <p className="font-bold">{value}</p>
    </div>
    <p className="text-xs text-muted-foreground mt-0">{label}</p>
  </Link>
);


export default function ProfilePage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const { toast } = useToast();
  const userPath = useMemo(() => (authUser ? `users/${authUser.uid}` : null), [authUser]);
  const { data: userDoc, isLoading: userDocLoading } = useDoc<User>(userPath);

  if (authLoading && !authUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="container mx-auto flex h-screen flex-col items-center justify-center py-8 text-center">
        <h2 className="text-xl font-bold">You are not logged in</h2>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
        <Button asChild className="mt-4">
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
      </div>
    );
  }

  const isLoading = userDocLoading || authLoading;

  return (
    <div className="min-h-screen bg-card pb-20 md:pb-8">
      <header className="px-4">
        <div className="pt-2">
          <h1 className="text-xl font-bold text-foreground mb-4">Me</h1>
        </div>
        <div>
          <UserProfileHeader user={userDoc} authUser={authUser} />
        </div>
      </header>

      <main className="mt-4 flex flex-col gap-4">
        {/* Top Section: Stats and Balance */}
        <div className="px-4">
          <section>
            <div className="grid grid-cols-4 gap-4 py-0">
              {isLoading ? (
                <>
                  <div className="flex flex-col items-center gap-1 text-center"><Skeleton className="h-4 w-5" /><Skeleton className="h-3 w-10 mt-1" /></div>
                  <div className="flex flex-col items-center gap-1 text-center"><Skeleton className="h-4 w-5" /><Skeleton className="h-3 w-10 mt-1" /></div>
                  <div className="flex flex-col items-center gap-1 text-center"><Skeleton className="h-4 w-5" /><Skeleton className="h-3 w-10 mt-1" /></div>
                  <div className="flex flex-col items-center gap-1 text-center"><Skeleton className="h-4 w-5" /><Skeleton className="h-3 w-10 mt-1" /></div>
                </>
              ) : (
                <>
                  <StatItem value={userDoc?.friendCount ?? 0} label="Friends" />
                  <StatItem value={userDoc?.followingCount ?? 0} label="Following" />
                  <StatItem value={userDoc?.followerCount ?? 0} label="Followers" />
                  <StatItem value={userDoc?.visitorCount ?? 0} label="Visitors" />
                </>
              )}
            </div>
          </section>

          <section className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <BalanceCard
                title="Coins"
                balance={userDoc?.coinBalance ?? 0}
                href="/wallet/coins"
                icon={"🪙"}
                gradient="bg-gradient-to-r from-amber-500 to-yellow-600"
                isLoading={isLoading}
              />
              <BalanceCard
                title="Points"
                balance={userDoc?.pointBalance ?? 0}
                href="/wallet/points"
                icon={<Gem className="h-4 w-4" />}
                gradient="bg-gradient-to-r from-fuchsia-700 to-purple-800"
                isLoading={isLoading}
              />
            </div>
          </section>
        </div>

        {/* Lower Content Section */}
        <div className="px-4 space-y-4">
          <Link href="/shop/vip" className="block">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-between text-amber-950 px-4 py-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5" />
                <div>
                  <p className="font-bold">VIP</p>
                  <p className="text-xs">Get VIP & Enjoy Privileges</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm">View</span>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-between text-white px-4 py-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              <div>
                <p className="font-bold">Invite Friends</p>
                <p className="text-[10px] opacity-90">Share your link and earn rewards</p>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="h-8 text-xs bg-white/20 hover:bg-white/30 text-white border-none"
              onClick={() => {
                copyInvitationLink(authUser.uid);
                toast({ title: "Link Copied!", description: "Share it with your friends to earn points." });
              }}
            >
              Copy Link
            </Button>
          </div>

          <ProfileMenu />

          {userDoc && (
            <AgentAndSettingsMenu user={userDoc} />
          )}
        </div>
      </main>
    </div>
  );
}
