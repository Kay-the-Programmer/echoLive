'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser, useDoc, useAuth } from '@/firebase';
import type { User as UserType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { coinPackages, type CoinPackage } from '@/lib/data';
import { ChevronLeft, Loader2, Phone, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { purchaseCoins } from '@/app/actions/purchase-coins';

export default function CoinsShopPage() {
  const { user, isUserLoading: authLoading } = useUser();
  const auth = useAuth();
  const [loadingPackage, setLoadingPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'simulation' | 'lenco'>('lenco');
  const [phoneNumber, setPhoneNumber] = useState('');
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

    if (paymentMethod === 'lenco') {
      if (!phoneNumber.startsWith('260') || phoneNumber.length !== 12) {
        toast({
          variant: "destructive",
          title: "Invalid Phone Number",
          description: "Please enter a valid Zambian phone number starting with 260.",
        });
        return;
      }

      setLoadingPackage(pkg.id);
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/payments/lenco/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            packageId: pkg.id,
            phoneNumber: phoneNumber
          })
        });

        const result = await response.json();
        if (response.ok && result.success) {
          toast({
            title: "Payment Initiated",
            description: result.message,
          });
        } else {
          throw new Error(result.error || 'Failed to initiate payment.');
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: error.message,
        });
      } finally {
        setLoadingPackage(null);
      }
      return;
    }

    // Original Simulation Flow
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
    <div className="bg-white min-h-screen text-black pb-20">
      <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-4">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="text-black hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold text-black">Top-up coins</h1>
        <div className="w-9" />
      </header>

      <main className="p-4 space-y-6">
        <div className="rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 p-4 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-80">Remaining coins</p>
              <p className="text-2xl font-bold">{isLoading ? '...' : coinBalance.toLocaleString()}</p>
            </div>
          </div>
          <p className="mt-2 text-xs opacity-80">Transactions update in real-time.</p>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-semibold text-gray-700">Payment Method</Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={paymentMethod === 'lenco' ? 'default' : 'outline'}
              className={cn("flex items-center gap-2 h-11", paymentMethod === 'lenco' ? 'bg-blue-600' : 'text-gray-600')}
              onClick={() => setPaymentMethod('lenco')}
            >
              <Phone className="h-4 w-4" />
              Mobile Money
            </Button>
            <Button
              variant={paymentMethod === 'simulation' ? 'default' : 'outline'}
              className={cn("flex items-center gap-2 h-11", paymentMethod === 'simulation' ? 'bg-gray-800' : 'text-gray-600')}
              onClick={() => setPaymentMethod('simulation')}
            >
              <CreditCard className="h-4 w-4" />
              Simulation
            </Button>
          </div>
        </div>

        {paymentMethod === 'lenco' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Zambian Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="260xxxxxxxxx"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-12 border-gray-300 text-black text-lg focus:ring-blue-500"
            />
            <p className="text-[10px] text-gray-500 px-1">Must start with 260. A prompt will appear on your phone.</p>
          </div>
        )}

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
                "h-auto flex-col p-4 text-center bg-white border-gray-200 text-black hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm",
                loadingPackage === pkg.id && "bg-gray-100 ring-2 ring-blue-500"
              )}
            >
              {loadingPackage === pkg.id ? (
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              ) : (
                <>
                  <p className={`font-bold ${pkg.id === 'c7' ? 'text-xs' : 'text-base'}`}>{pkg.coins.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-500 mt-1">${pkg.price.toFixed(pkg.price % 1 === 0 ? 0 : 2)}</p>
                </>
              )}
            </Button>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link href="#" className="text-blue-500 text-sm hover:underline">
            {'>>Top up customer service<<'}
          </Link>
        </div>
      </main>
    </div>
  );
}

