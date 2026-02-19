
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, ArrowLeft, ShieldAlert, CircleDollarSign, Banknote, Landmark, Copy, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useGlobalBalance, useAppOwners, useTreasuryAccess, useAuth } from '@/firebase';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { TRCIcon, NowPaymentsIcon, MtnMobileMoneyIcon, AirtelMobileMoneyIcon } from '@/components/icons';
import { addTestRevenue } from '@/app/actions/add-test-revenue';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type PaymentMethod = 'USDT-TRC20' | 'NOWPayments' | 'MTN' | 'Airtel' | 'Bank';

export default function RevenuePage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const auth = useAuth();
  const { data: appOwners, isLoading: ownersLoading } = useAppOwners();
  const { hasAccess: hasTreasuryAccess, isLoading: treasuryLoading } = useTreasuryAccess(authUser?.uid);

  const isOwner = useMemo(() => appOwners?.some(o => o.id === authUser?.uid), [appOwners, authUser]);
  const canViewPage = isOwner || hasTreasuryAccess;

  const { data: globalBalance, isLoading: balanceLoading } = useGlobalBalance({ enabled: canViewPage });
  const { toast } = useToast();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('USDT-TRC20');
  const [amount, setAmount] = useState<number | string>('');
  const [payoutAddress, setPayoutAddress] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isAddingRevenue, setIsAddingRevenue] = useState(false);

  const isLoading = authLoading || ownersLoading || treasuryLoading || (canViewPage && balanceLoading);
  const totalRevenue = globalBalance?.totalUsdRevenue ?? 0;

  const handleAddTestRevenue = async () => {
    setIsAddingRevenue(true);
    const result = await addTestRevenue();
    if (result.success) {
        toast({ title: "Success", description: result.message });
    } else {
        toast({ variant: 'destructive', title: "Error", description: result.error });
    }
    setIsAddingRevenue(false);
  }

  const handleWithdraw = async () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount to withdraw.'});
        return;
    }
    if (numAmount > totalRevenue) {
        toast({ variant: 'destructive', title: 'Insufficient Revenue', description: 'The withdrawal amount cannot exceed the total app revenue.'});
        return;
    }
     if (!payoutAddress) {
        toast({ variant: 'destructive', title: 'Address Missing', description: `Please enter a valid ${selectedMethod} address or ID.` });
        return;
    }
    
    if (!authUser || !auth.currentUser) {
      toast({ variant: 'destructive', title: 'Authentication Error', description: 'You must be logged in to perform this action.' });
      return;
    }
    
    setIsWithdrawing(true);

    try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('/api/admin/revenue-withdrawal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            // DEV NOTE: The backend currently only supports USDT-TRC20 via Binance.
            // You will need to add logic to handle other payment methods like NOWPayments.
            body: JSON.stringify({ 
              paymentMethod: selectedMethod,
              walletAddress: payoutAddress, 
              amount: numAmount 
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'An unknown error occurred.');
        }

        toast({
            title: 'Revenue Withdrawal Successful!',
            description: (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono truncate">TxID: {result.transactionId}</span>
                <Button size="sm" variant="ghost" className="h-auto p-1" onClick={() => {
                  navigator.clipboard.writeText(result.transactionId!);
                  toast({ title: 'Copied!' });
                }}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ),
        });
        setAmount('');
        setPayoutAddress('');

    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Withdrawal Failed',
            description: error.message,
            duration: 9000,
        });
    } finally {
        setIsWithdrawing(false);
    }
  };

  const paymentMethods: { id: PaymentMethod, label: string, icon: React.ElementType, enabled: boolean }[] = [
    { id: 'USDT-TRC20', label: 'USDT (TRC20)', icon: TRCIcon, enabled: true },
    { id: 'NOWPayments', label: 'NOWPayments', icon: NowPaymentsIcon, enabled: true },
    { id: 'MTN', label: 'MTN Mobile', icon: MtnMobileMoneyIcon, enabled: true },
    { id: 'Airtel', label: 'Airtel Mobile', icon: AirtelMobileMoneyIcon, enabled: true },
    { id: 'Bank', label: 'Bank Transfer', icon: Landmark, enabled: true },
  ];

  const getAddressLabel = () => {
    switch(selectedMethod) {
      case 'USDT-TRC20':
        return 'USDT-TRC20 Wallet Address';
      case 'NOWPayments':
        return 'NOWPayments Invoice ID / Address';
      case 'MTN':
      case 'Airtel':
        return 'Mobile Money Number';
      case 'Bank':
        return 'Bank Account Details';
      default:
        return 'Payout Address';
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!canViewPage) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mt-8 max-w-lg mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access financial revenue data.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4 flex justify-between items-center">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <Button onClick={handleAddTestRevenue} disabled={isAddingRevenue} variant="secondary" size="sm">
            {isAddingRevenue ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CircleDollarSign className="mr-2 h-4 w-4" />}
            Add $100 Test Revenue
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <CircleDollarSign className="text-primary" /> 
            <span>App Owner Payout Center</span>
          </CardTitle>
          <CardDescription>
            Track total app revenue and manage your payouts. Payouts are completed in under 5 minutes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <>
              <div className="text-center rounded-lg bg-muted p-6">
                <p className="text-sm text-muted-foreground">Current Available Revenue</p>
                <p className="text-5xl font-bold text-foreground">${totalRevenue.toFixed(2)}</p>
              </div>

              <div className="space-y-4">
                 <h3 className="font-medium">Choose Payout Method</h3>
                 <div className="grid grid-cols-2 lg:grid-cols-5 gap-2">
                    {paymentMethods.map(method => (
                      <Tooltip key={method.id}>
                        <TooltipTrigger asChild>
                          <div className={cn(!method.enabled && "cursor-not-allowed")}>
                            <Button
                              variant={selectedMethod === method.id ? 'default' : 'outline'}
                              onClick={() => method.enabled && setSelectedMethod(method.id)}
                              className="w-full"
                              disabled={!method.enabled}
                            >
                                <method.icon className="mr-2 h-5 w-5" /> {method.label}
                            </Button>
                          </div>
                        </TooltipTrigger>
                        {!method.enabled && (
                          <TooltipContent>
                            <p>This payment method will be integrated soon.</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                  <label htmlFor="payoutAddress" className="font-medium text-sm">{getAddressLabel()}</label>
                  <Input 
                      id="payoutAddress"
                      type="text"
                      placeholder={`Enter your ${selectedMethod} details`}
                      value={payoutAddress}
                      onChange={(e) => setPayoutAddress(e.target.value)}
                      className="h-11"
                  />
              </div>

              <div className="space-y-2">
                <label htmlFor="amount" className="font-medium">Amount (USD)</label>
                <div className="relative">
                    <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pl-10 h-12 text-lg"
                    />
                </div>
                <p className="text-xs text-muted-foreground">No minimum withdrawal amount.</p>
              </div>

              <Button onClick={handleWithdraw} size="lg" className="w-full" disabled={isWithdrawing}>
                {isWithdrawing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Banknote className="mr-2 h-5 w-5" />}
                Initiate Payout
              </Button>
            </>
        </CardContent>
      </Card>
    </div>
    </TooltipProvider>
  );
}
