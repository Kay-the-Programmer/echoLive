'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowLeft, Shield, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useUser, useDoc } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const tierColors: { [key: string]: string } = {
  "Guardian of Silver": "border-gray-400 text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-300",
  "Guardian of Gold": "border-amber-400 text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300",
  "Guardian of Diamond": "border-sky-400 text-sky-600 bg-sky-100 dark:bg-sky-900/50 dark:text-sky-300",
  "Guardian of Masters": "border-primary text-primary bg-primary/10",
};

export default function GuardianListPage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const isAdmin = !!adminRecord;
  
  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: isAdmin });

  const guardianUsers = users?.filter(u => u.guardian) ?? [];
  
  const isLoading = authLoading || adminLoading;

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
  
  const isLoadingData = usersLoading && isAdmin;

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
          <CardTitle>Guardian Users ({guardianUsers.length})</CardTitle>
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
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>ID Number</TableHead>
                    <TableHead>Guardian Tier</TableHead>
                    <TableHead>Day of Activation</TableHead>
                    <TableHead>Day of Expiry</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guardianUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p className="font-medium">{user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {user.numericId ?? user.id}
                      </TableCell>
                      <TableCell>
                        {user.guardian && (
                          <Badge variant="outline" className={tierColors[user.guardian.tier as keyof typeof tierColors]}>
                            <Shield className="mr-1 h-3 w-3" />
                            {user.guardian.tier}
                          </Badge>
                        )}
                      </TableCell>
                       <TableCell className="text-muted-foreground text-sm">
                        {user.guardian?.activationDate ? format(new Date(user.guardian.activationDate), 'PPP') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {user.guardian?.expiryDate ? format(new Date(user.guardian.expiryDate), 'PPP') : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {guardianUsers.length === 0 && !isLoadingData && (
                    <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No Guardian users found.
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
