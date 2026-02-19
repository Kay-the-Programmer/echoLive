'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, ChevronLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { useMemo } from 'react';

export default function CoinsBalancePage() {
  const { user: authUser, isUserLoading } = useUser();
  const userPath = useMemo(() => authUser ? `users/${authUser.uid}` : null, [authUser]);
  const { data: user, isLoading: isUserDocLoading } = useDoc<User>(userPath);

  const isLoading = isUserLoading || isUserDocLoading;
  const coinBalance = user?.coinBalance ?? 0;

  return (
    <div className="bg-white min-h-screen text-black">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Coins</h1>
        <div className="w-8" />
      </header>
      <main className="p-4">
        <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 p-4 text-white shadow-lg">
          <div className="p-1 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <span className="text-2xl font-bold">{isLoading ? "..." : coinBalance.toLocaleString()}</span>
              </div>
              <p className="text-sm opacity-80">Remaining coins</p>
            </div>
            <Link href="/shop/coins">
              <Button size="sm" className="rounded-full bg-white text-amber-500 hover:bg-white/90">
                Top Up
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" className="flex items-center gap-1 text-black hover:bg-gray-100">
            All <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="flex items-center gap-2 text-black hover:bg-gray-100">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(), 'yyyy-MM-dd')}</span>
          </Button>
        </div>

        <div className="mt-8 flex h-48 flex-col items-center justify-center text-center">
          <p className="text-gray-500">No more</p>
        </div>
      </main>
    </div>
  );
}
