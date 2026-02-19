
'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, ShieldAlert, Coins, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export default function CoinBuyersPage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const isAdmin = !!adminRecord;

  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: isAdmin });

  const topBuyers = useMemo(() => {
    if (!users) return [];
    return users
      .filter(u => u.totalCoinsSpent && u.totalCoinsSpent > 0)
      .sort((a, b) => (b.totalCoinsSpent ?? 0) - (a.totalCoinsSpent ?? 0));
  }, [users]);
  
  const isLoading = authLoading || adminLoading;
  const isLoadingData = usersLoading && isAdmin;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mt-8 max-w-lg mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have administrative privileges to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Top Coin Buyers ({topBuyers.length})</CardTitle>
        </CardHeader>
        <CardContent>
           {isLoadingData ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[10%] text-center">Rank</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead className="text-right">Coins Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topBuyers.map((buyer, index) => (
                    <TableRow key={buyer.id}>
                       <TableCell className="text-center font-bold text-lg">
                        {index === 0 ? <Crown className="w-6 h-6 mx-auto text-amber-400" /> : index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={buyer.avatarUrl} alt={buyer.name} />
                            <AvatarFallback>{buyer.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{buyer.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{buyer.email}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {buyer.numericId ?? buyer.id}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="border-amber-400 text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300">
                            <Coins className="mr-1 h-3 w-3" />
                            {buyer.totalCoinsSpent?.toLocaleString() ?? 0}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {topBuyers.length === 0 && !isLoadingData && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                            No coin buyers found.
                        </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
