'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useDoc } from '@/firebase';
import type { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { coinPackages, type CoinPackage } from '@/lib/data';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { purchaseCoins } from '@/app/actions/purchase-coins';

export default function CoinsShopPage() {
  const { user, isUserLoading: authLoading } = useUser();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const userPath = useMemo(() => user ? `users/${user.uid}` : null, [user]);
  const { data: currentUser, isLoading: userDocLoading } = useDoc<UserType>(userPath);

  const coinBalance = currentUser?.coinBalance ?? 0;
  const isLoading = authLoading || userDocLoading;

  const handlePackageClick = async (pkg: CoinPackage) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Logged In",
        description: "You must be logged in to purchase coins.",
      });
      return;
    }
    
    setLoadingPackage(pkg.id);

    const result = await purchaseCoins(user.uid, pkg);

    if (result.success && result.message) {
        toast({
            title: "Coins Added!",
            description: result.message,
        });
    } else if (result.error) {
        toast({
            variant: "destructive",
            title: "Purchase Failed",
            description: result.error,
        });
    }

    setLoadingPackage(null);
  };

  return (
    <div className="bg-white min-h-screen text-black">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-black">Top-up coins</h1>
        <div className="w-9" />
      </header>

      <main className="p-4">
        <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Remaining coins</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : coinBalance.toLocaleString()}</p>
            </div>
          </div>
          <p className="mt-2 text-xs opacity-80">Transactions update in real-time.</p>
        </div>

        <div className="my-4">
          <Image
            src="https://picsum.photos/seed/scam-banner/800/200"
            alt="Beware of Scams"
            width={800}
            height={200}
            className="rounded-lg"
            data-ai-hint="security shield announcement"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {coinPackages.map((pkg) => (
            <Button
              key={pkg.id}
              variant="outline"
              onClick={() => handlePackageClick(pkg)}
              disabled={isLoading || !!loadingPackage}
              className={cn(
                "h-auto flex-col p-3 text-center bg-white border-gray-200 text-black",
                loadingPackage === pkg.id && "bg-gray-100"
              )}
            >
              {loadingPackage === pkg.id ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <p className={`font-bold ${pkg.id === 'c7' ? 'text-sm' : 'text-base'}`}>{pkg.coins.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">${pkg.price.toFixed(pkg.price % 1 === 0 ? 0 : 2)}</p>
                </>
              )}
            </Button>
          ))}
        </div>
        
        <div className="text-center mt-8">
            <Link href="#" className="text-blue-500 text-sm">
                {'>>Top up customer service<<'}
            </Link>
        </div>
      </main>
    </div>
  );
}
