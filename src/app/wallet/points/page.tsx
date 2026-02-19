
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, CircleHelp, ChevronRight, ChevronDown, Award } from 'lucide-react';
import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const PointIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block">
        <circle cx="9" cy="9" r="8.25" fill="url(#paint0_linear_points_icon_page)" stroke="#FBC2D3" strokeWidth="1.5"/>
        <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="sans-serif">$</text>
        <defs>
            <linearGradient id="paint0_linear_points_icon_page" x1="9" y1="0.75" x2="9" y2="17.25" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F06395"/>
                <stop offset="1" stopColor="#E53371"/>
            </linearGradient>
        </defs>
    </svg>
);


export default function PointsBalancePage() {
    const { user: authUser, isUserLoading } = useUser();
    const userPath = useMemo(() => authUser ? `users/${authUser.uid}` : null, [authUser]);
    const { data: user, isLoading: isUserDocLoading } = useDoc<User>(userPath);
    
    const isLoading = isUserLoading || isUserDocLoading;
    const pointBalance = user?.pointBalance ?? 0;
    const unconfirmedPoints = user?.unconfirmedPoints ?? 0;
    const totalPointsEarned = user?.totalPointsEarned ?? 0;

    const incomeSources = [
        { name: 'Livestream', amount: user?.livestreamPoints ?? 0 },
        { name: 'Party', amount: user?.partyPoints ?? 0 },
        { name: 'Commission', amount: user?.commissionPoints ?? 0 },
        { name: 'Transfer points', amount: user?.transferPoints ?? 0 },
        { name: 'Platform Rewards', amount: user?.platformRewardPoints ?? 0 },
    ];

    const totalIncome = incomeSources.reduce((sum, source) => sum + source.amount, 0);

  return (
    <div className="bg-background min-h-screen text-foreground pb-40">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Points</h1>
        <Button variant="ghost" size="sm">Details</Button>
      </header>
      <main className="p-4">
        <div className="rounded-xl bg-pink-500 p-4 text-white shadow-lg">
            {isLoading ? <Skeleton className="h-28 w-full bg-white/20" /> : (
                <>
                <p className="text-sm opacity-80 flex items-center gap-1">
                    <PointIcon />
                    Available points
                </p>
                <p className="text-2xl font-bold mt-1">{pointBalance.toLocaleString()}</p>
                <div className="grid grid-cols-2 mt-4 text-sm">
                    <div>
                        <p className="opacity-80 flex items-center gap-1"><Award className="h-4 w-4"/>Total Lifetime</p>
                        <p className="text-sm font-bold">{totalPointsEarned.toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="opacity-80 flex items-center gap-1">
                           <PointIcon />
                            Unconfirmed
                            <CircleHelp className="h-4 w-4 opacity-80" />
                        </p>
                        <p className="text-sm font-bold">{unconfirmedPoints.toLocaleString()}</p>
                    </div>
                </div>
                </>
            )}
        </div>

        <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Income Breakdown</h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    Last 30 days
                    <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
            </div>
            <div className="space-y-4">
                {incomeSources.map(source => (
                    <Link href="#" key={source.name} className="flex items-center justify-between">
                        <p>{source.name}</p>
                        <div className="flex items-center gap-2 text-muted-foreground">
                           <PointIcon />
                           <span className="font-medium text-foreground">{source.amount.toLocaleString()}</span>
                           <ChevronRight className="h-4 w-4" />
                        </div>
                    </Link>
                ))}
                <div className="border-t pt-4 mt-4 flex items-center justify-between font-bold">
                    <p>Total Income</p>
                    <div className="flex items-center gap-2">
                        <PointIcon />
                        <span>{totalIncome.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>

      </main>
      <footer className="fixed bottom-0 left-0 w-full p-4 bg-background border-t">
          <div className="flex flex-col gap-2">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                <Link href="/wallet/withdraw">Withdraw now</Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20">
                <span className="text-yellow-500 mr-2">🪙</span>
                Exchange Points for Coins
            </Button>
             <Button variant="outline" size="lg" className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20">
                Transfer
            </Button>
          </div>
      </footer>
    </div>
  );
}
