'use client';

import Link from "next/link";
import { useMemo, useState, useEffect } from 'react';
import { useUser, useDoc } from '@/firebase';
import { useUserWithdrawals } from '@/firebase/firestore/use-user-withdrawals';
import { PageHeader } from "@/components/shared/page-header";
import { transactions } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Coins, Gem, ArrowRightLeft, Upload, Download, CircleDollarSign, Loader2 } from "lucide-react";
import { format } from "date-fns";
import type { User, Withdrawal } from '@/lib/types';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusColors: { [key: string]: string } = {
  pending: "border-amber-400 text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300",
  approved: "border-green-400 text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300",
  rejected: "border-red-400 text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300",
};

const getIconForType = (type: (typeof transactions)[0]['type']) => {
    switch (type) {
        case 'purchase': return <Download className="h-4 w-4 text-green-500"/>
        case 'gift_sent': return <Upload className="h-4 w-4 text-red-500"/>
        case 'gift_received': return <Download className="h-4 w-4 text-green-500"/>
        case 'withdrawal': return <CircleDollarSign className="h-4 w-4 text-blue-400"/>
        case 'exchange': return <ArrowRightLeft className="h-4 w-4 text-gray-400"/>
    }
}

const WithdrawalsHistoryTab = () => {
    const { user: authUser } = useUser();
    const { data: withdrawals, isLoading } = useUserWithdrawals(authUser?.uid);

    if (isLoading) {
        return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (!withdrawals || withdrawals.length === 0) {
        return <p className="text-center text-muted-foreground py-8">You have no withdrawal history.</p>;
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {withdrawals.map((w: Withdrawal) => (
                    <TableRow key={w.id}>
                        <TableCell className="font-mono">{w.amount.toLocaleString()} pts</TableCell>
                        <TableCell>
                            <Badge variant="outline" className={cn("capitalize", statusColors[w.status])}>
                                {w.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                            {w.withdrawalDate ? format(new Date(w.withdrawalDate), 'PPp') : 'N/A'}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default function WalletPage() {
  const { user: authUser, isUserLoading } = useUser();
  const userPath = useMemo(() => authUser ? `users/${authUser.uid}` : null, [authUser]);
  const { data: user, isLoading: isUserDocLoading } = useDoc<User>(userPath);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.substring(1);
      if (hash === 'withdrawals' || hash === 'gifts') {
        setActiveTab(hash);
      }
    }
  }, []);

  const isLoading = isUserLoading || isUserDocLoading;
  const coinBalance = user?.coinBalance ?? 0;
  const pointBalance = user?.pointBalance ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="My Wallet" description="Manage your coins, points, and transactions." />

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-tr from-amber-500/10 to-amber-500/5 via-transparent border-amber-500/20">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-amber-400 font-headline">
                    <span>Coin Balance</span>
                    <Coins />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold text-amber-400 text-glow">{isLoading ? '...' : coinBalance.toLocaleString()}</p>
                 <Button asChild className="mt-4"><Link href="/shop/coins">Buy Coins</Link></Button>
            </CardContent>
        </Card>
        <Card className="bg-gradient-to-tr from-primary/10 to-primary/5 via-transparent border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center justify-between text-primary font-headline">
                    <span>Point Balance</span>
                    <Gem />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-5xl font-bold text-primary neon-purple">{isLoading ? '...' : pointBalance.toLocaleString()}</p>
                <Button asChild variant="secondary" className="mt-4"><Link href="/wallet/withdraw">Withdraw Points</Link></Button>
            </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="font-headline text-2xl font-bold mb-4">Transaction History</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="gifts">Gifts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map(tx => (
                        <TableRow key={tx.id}>
                            <TableCell className="font-medium flex items-center gap-2">
                                {getIconForType(tx.type)}
                                {tx.description}
                            </TableCell>
                            <TableCell>{format(new Date(tx.date), 'PPp')}</TableCell>
                            <TableCell className={`text-right font-mono ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {tx.amount.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                    {transactions.length === 0 && (
                       <TableRow>
                            <TableCell colSpan={3} className="text-center h-24">No transactions yet.</TableCell>
                       </TableRow>
                    )}
                </TableBody>
            </Table>
          </TabsContent>

           <TabsContent value="withdrawals" className="mt-4">
            <WithdrawalsHistoryTab />
          </TabsContent>
          
          <TabsContent value="gifts" className="mt-4">
             <p className="text-center text-muted-foreground py-8">No gift transaction history.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
