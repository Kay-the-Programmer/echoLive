
'use client';

import React, { useMemo, useState } from 'react';
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
import { Loader2, ArrowLeft, Check, X, ShieldAlert, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser as useAuthUser, useDoc, useFirestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function AgentRequestsPage() {
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { user: authUser, isUserLoading: authLoading } = useAuthUser();
  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const isAdmin = !!adminRecord;

  const firestore = useFirestore();

  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: isAdmin });
  
  const pendingRequests = useMemo(() => {
    if (!users) return [];
    return users.filter(u => u.agentRequestStatus === 'pending');
  }, [users]);
  
  const handleAction = async (userId: string, action: 'approve' | 'reject') => {
    setUpdatingId(userId);
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Error', description: 'Firestore is not available.' });
      setUpdatingId(null);
      return;
    }

    const userRef = doc(firestore, 'users', userId);
    
    try {
      if (action === 'approve') {
        await updateDoc(userRef, { isAgent: true, agentRequestStatus: 'approved' });
        toast({ title: 'Request Approved', description: 'The user has been promoted to Agent.' });
      } else { // reject
        await updateDoc(userRef, { agentRequestStatus: 'rejected' });
        toast({ title: 'Request Rejected', description: 'The user\'s agent request has been rejected.' });
      }
    } catch (error: any) {
        console.error("Failed to process agent request:", error);
        toast({
            variant: 'destructive',
            title: 'Update Error',
            description: error.message || 'Could not update user role.',
        });
    } finally {
        setUpdatingId(null);
    }
  };
  
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
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCog />
            Agent Requests ({pendingRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="w-full overflow-x-auto">
          {isLoadingData ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.map((user) => {
                  const isProcessing = updatingId === user.id;
                  return (
                    <TableRow key={user.id} className={isProcessing ? 'opacity-50' : ''}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarImage src={user.avatarUrl} alt={user.name} />
                                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm">{user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{user.numericId ?? user.id}</TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {user.agentRequestDate ? format(new Date(user.agentRequestDate), 'PPp') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                              <Button size="sm" variant="outline" onClick={() => handleAction(user.id, 'approve')} className="text-green-600 border-green-400 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/30" disabled={isProcessing}>
                              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Check className="h-4 w-4 mr-1"/> Approve</>}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleAction(user.id, 'reject')} disabled={isProcessing}>
                              <X className="h-4 w-4 mr-1"/> Reject
                              </Button>
                          </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {pendingRequests?.length === 0 && !isLoadingData && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No pending agent requests.
                      </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
