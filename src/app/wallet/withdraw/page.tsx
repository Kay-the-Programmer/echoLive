
'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { requestWithdrawal } from '@/app/actions/request-withdrawal';


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableHeader,
} from "@/components/ui/table"
import { TRCIcon } from '@/components/icons';
import { SecurityPasswordDialog } from '@/components/wallet/security-password-dialog';

const TPointIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="9" cy="9" r="9" fill="url(#paint0_linear_201_13)"/>
        <path d="M9.132 14V11.592L11.568 11.088V9.384L7.524 10.38V11.784L9.132 11.376V14H9.132ZM9.036 9.18C9.546 9.18 9.96 9.03 10.278 8.73C10.608 8.418 10.773 8.022 10.773 7.542C10.773 7.062 10.608 6.666 10.278 6.354C9.96 6.042 9.546 5.886 9.036 5.886C8.526 5.886 8.112 6.042 7.794 6.354C7.476 6.666 7.317 7.062 7.317 7.542C7.317 8.022 7.476 8.418 7.794 8.73C8.112 9.03 8.526 9.18 9.036 9.18Z" fill="white"/>
        <defs>
        <linearGradient id="paint0_linear_201_13" x1="9" y1="0" x2="9" y2="18" gradientUnits="userSpaceOnUse">
        <stop stopColor="#F06395"/>
        <stop offset="1" stopColor="#E53371"/>
        </linearGradient>
        </defs>
    </svg>
);

export default function WithdrawPage() {
  const { user: authUser } = useUser();
  const userPath = useMemo(() => (authUser ? `users/${authUser.uid}` : null), [authUser]);
  const { data: user } = useDoc<User>(userPath);
  
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSecurityDialogOpen, setSecurityDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const pointBalance = user?.pointBalance ?? 0;
  const pointsToUsdRate = 1 / 10000; // 10,000 points = $1
  const amountInUsd = amount * pointsToUsdRate;
  const feeInUsd = 1;
  const feeInPoints = 10000; // $1 fee = 10,000 points

  const minWithdrawalPoints = 100000; // Minimum for all users
  const minWithdrawalUsd = minWithdrawalPoints * pointsToUsdRate;

  const boundPaymentMethod = user?.paymentMethods ? Object.keys(user.paymentMethods)[0] : undefined;
  const address = user?.paymentMethods ? Object.values(user.paymentMethods)[0] : undefined;

  const handleWithdrawClick = () => {
    const totalDeduction = amount + feeInPoints;

    if (!amount || amount <= 0) {
      toast({ variant: 'destructive', title: "Invalid Amount", description: "Please enter a valid amount of points to withdraw." });
      return;
    }
    if (amount < minWithdrawalPoints) {
      toast({ variant: 'destructive', title: "Amount Too Low", description: `Minimum withdrawal is ${minWithdrawalPoints.toLocaleString()} points ($${minWithdrawalUsd}).` });
      return;
    }
    if (totalDeduction > pointBalance) {
      toast({ variant: 'destructive', title: "Insufficient Balance", description: `You need ${totalDeduction.toLocaleString()} points to cover the withdrawal and the ${feeInPoints.toLocaleString()} point fee.` });
      return;
    }
    if (!address || !boundPaymentMethod) {
        toast({ variant: 'destructive', title: "No Payment Method", description: "Please bind a payment address before withdrawing." });
        return;
    }

    setSecurityDialogOpen(true);
  };
  
  const startWithdrawalProcess = useCallback(async () => {
    if (!authUser || !boundPaymentMethod || !address) {
      toast({ variant: 'destructive', title: 'Error', description: 'User or payment details missing.' });
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await requestWithdrawal({
        userId: authUser.uid,
        amount,
        paymentMethod: boundPaymentMethod,
        paymentAddress: address,
      });

      if (result.success) {
        toast({
          title: "Success!",
          description: `Withdrawal request for ${amount.toLocaleString()} points submitted successfully.`,
        });
        setAmount(0);
      } else {
        throw new Error(result.error || 'An unknown error occurred.');
      }
    } catch (error: any) {
      console.error("Client-side withdrawal request failed:", error);
      toast({
        variant: 'destructive',
        title: 'Withdrawal Failed',
        description: error.message || "An unexpected server error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  }, [authUser, amount, boundPaymentMethod, address, toast]);

  return (
    <div className="bg-background min-h-screen">
       <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
        <Link href="/wallet/points">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-lg font-semibold">Withdraw</h1>
        <Button variant="ghost" size="sm" asChild>
            <Link href="/wallet#withdrawals">Record</Link>
        </Button>
      </header>

      <main className="p-4 space-y-4">
        <div className="rounded-lg bg-blue-500 p-4 text-white">
            <div className="flex items-center justify-between text-sm opacity-80">
                <span>Withdrawal Amount</span>
            </div>
            <p className="text-2xl font-bold mt-1">${amountInUsd.toFixed(2)}</p>
             <div className="grid grid-cols-2 mt-4">
                 <div className="text-sm leading-tight">
                    <p className="opacity-80">Total Amount</p>
                    <p>${(pointBalance * pointsToUsdRate).toFixed(2)}</p>
                 </div>
                 <div>
                     <div className="text-sm leading-tight">
                        <p className="opacity-80 flex items-center">Unconfirmed<ChevronRight className="h-3 w-3 ml-0.5" /></p>
                        <div className="flex items-center gap-1">
                           <TPointIcon/>
                           <span>{user?.unconfirmedPoints ?? 0}</span>
                        </div>
                    </div>
                 </div>
            </div>
        </div>

        <div className="space-y-4">
            <div>
                <h3 className="font-semibold mb-2">Method</h3>
                <Link href="/wallet/method">
                    <div className="rounded-lg border bg-card p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <TRCIcon className="h-6 w-6"/>
                            <div>
                                <p className="font-semibold">{boundPaymentMethod || 'No Method Bound'}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <input
                                      readOnly
                                      value={address || ''}
                                      placeholder="No address bound"
                                      className="h-auto p-0 border-none bg-transparent text-xs text-muted-foreground placeholder:text-destructive focus-visible:ring-0 focus-visible:ring-offset-0 cursor-pointer w-full"
                                    />
                                </div>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground"/>
                    </div>
                </Link>
            </div>
        
            <div className="space-y-2">
                <label htmlFor="amount" className="font-semibold">Amount</label>
                <Input 
                    id="amount"
                    type="number" 
                    name="amount"
                    value={amount === 0 ? '' : amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="border p-2 rounded-md h-12 text-lg"
                    placeholder="Enter points to withdraw"
                    required
                />
            </div>

            <Button onClick={handleWithdrawClick} size="lg" className="w-full rounded-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Withdraw'}
            </Button>
            <Button asChild variant="outline" type="button" size="lg" className="w-full rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20">
              <Link href="#">Exchange Points for Coins</Link>
            </Button>
            <Button variant="outline" type="button" size="lg" className="w-full rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20">
                Transfer
            </Button>
        </div>

        <div className="space-y-4">
            <h3 className="font-semibold">Withdrawal Rules</h3>
            
            <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Exchange ratio</TableCell>
                            <TableCell className="text-right font-medium flex items-center justify-end gap-1">
                                10,000 points = $1
                            </TableCell>
                        </TableRow>
                         <TableRow>
                            <TableCell className="text-muted-foreground">Minimum withdrawal amount</TableCell>
                            <TableCell className="text-right font-medium">{minWithdrawalPoints.toLocaleString()} = ${minWithdrawalUsd.toLocaleString()}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
                <p>1. Coins can not be withdrawn.</p>
                <p>2. The service fees for different payment methods may vary. Please choose a suitable payment method.</p>
                <p>3. Payouts are typically processed within 30-60 minutes after administrative approval.</p>
            </div>

             <div className="rounded-lg border bg-card overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Withdrawal Rule</TableHead>
                            <TableHead className="text-right">Service Fee</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell>Flat fee per transaction</TableCell>
                            <TableCell className="text-right font-medium">{feeInPoints.toLocaleString()} Points (${feeInUsd})</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
      </main>

      {user && (
        <SecurityPasswordDialog 
          isOpen={isSecurityDialogOpen}
          onOpenChange={setSecurityDialogOpen}
          user={user}
          onSuccess={startWithdrawalProcess}
        />
      )}
    </div>
  );
}
