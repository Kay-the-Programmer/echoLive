
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import { useAllWithdrawals } from '@/firebase/firestore/use-all-withdrawals';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowLeft, Check, X, Copy, ShieldAlert, Trash2 } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { User, Withdrawal } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useDoc, useAuth } from '@/firebase';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


const statusColors: { [key: string]: string } = {
  pending: "border-amber-400 text-amber-600 bg-amber-100 dark:bg-amber-900/50 dark:text-amber-300",
  completed: "border-green-400 text-green-600 bg-green-100 dark:bg-green-900/50 dark:text-green-300",
  rejected: "border-gray-400 text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400",
  payout_failed: "border-red-400 text-red-600 bg-red-100 dark:bg-red-900/50 dark:text-red-300",
};


export default function WithdrawalPage() {
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [requestToDelete, setRequestToDelete] = useState<Withdrawal | null>(null);
  
  const auth = useAuth();
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const isAdmin = !!adminRecord;

  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: isAdmin });
  const { data: withdrawals, isLoading: withdrawalsLoading } = useAllWithdrawals({ enabled: isAdmin });

  const getUserById = (userId: string): User | undefined => {
    return users?.find(u => u.id === userId);
  };

  const filteredWithdrawals = useMemo(() => {
    if (!withdrawals) return [];
    return withdrawals.filter(w => {
        const requestUser = getUserById(w.userId);
        const statusMatch = statusFilter === 'all' || w.status === statusFilter;
        const searchMatch = !searchQuery || (requestUser?.name && requestUser.name.toLowerCase().includes(searchQuery.toLowerCase()));
        return statusMatch && searchMatch;
    }).sort((a, b) => new Date(b.withdrawalDate).getTime() - new Date(a.withdrawalDate).getTime());
  }, [withdrawals, statusFilter, searchQuery, users]);
  
  const handleAction = async (withdrawalId: string, action: 'approve' | 'reject') => {
    setUpdatingId(withdrawalId);

    try {
        if (!auth.currentUser) throw new Error("Authentication error. Please log in again.");
        const token = await auth.currentUser.getIdToken();

        let response;
        if (action === 'approve') {
            response = await fetch('/api/admin/withdrawals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ withdrawalId }),
            });
        } else { // reject
            response = await fetch('/api/admin/withdrawals', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ withdrawalId }),
            });
        }
      
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Request failed');

        if (action === 'approve') {
            toast({
              title: 'Payout Successful!',
              description: (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono truncate">TxID: {result.transactionId}</span>
                    <Button size="sm" variant="ghost" className="h-auto p-1" onClick={() => {
                        navigator.clipboard.writeText(result.transactionId!);
                        toast({ title: "Copied!" });
                    }}><Copy className="h-3 w-3" /></Button>
                  </div>
              ),
            });
        } else {
             toast({ title: 'Request Rejected', description: 'Points have been refunded to the user.' });
        }
    } catch (error: any) {
        console.error("Failed to process withdrawal:", error);
        toast({
            variant: 'destructive',
            title: action === 'approve' ? 'Payout Failed' : 'Rejection Failed',
            description: error.message || 'Please check the console.',
            duration: 9000,
        });
    } finally {
        setUpdatingId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!requestToDelete) return;
    setUpdatingId(requestToDelete.id);

    try {
        if (!auth.currentUser) throw new Error("Authentication error. Please log in again.");
        const token = await auth.currentUser.getIdToken();
        const response = await fetch('/api/admin/withdrawals', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ withdrawalId: requestToDelete.id }),
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Delete request failed.');

        toast({ title: 'Request Deleted', description: 'The withdrawal record has been removed.' });
    } catch (error: any) {
        toast({ variant: 'destructive', title: 'Deletion Failed', description: error.message, duration: 9000 });
    }
    
    setUpdatingId(null);
    setRequestToDelete(null);
  };

  const copyToClipboard = (text: string, title: string = 'Copied!') => {
    navigator.clipboard.writeText(text);
    toast({
      title: title,
      description: 'The text has been copied to your clipboard.',
    });
  };
  
  const isLoading = authLoading || adminLoading;
  const isLoadingData = (usersLoading || withdrawalsLoading) && isAdmin;

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
      <div className="flex items-center justify-between mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Withdrawal Requests ({filteredWithdrawals.length})</CardTitle>
          <CardDescription>
            Manage user withdrawal requests. The default view shows pending requests.
          </CardDescription>
           <div className="flex flex-col sm:flex-row items-center gap-2 pt-4">
            <Input
              placeholder="Search by username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:max-w-xs"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="payout_failed">Payout Failed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment Info</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.map((w) => {
                  const requestUser = getUserById(w.userId);
                  const isProcessing = updatingId === w.id;
                  return (
                    <TableRow key={w.id} className={isProcessing ? 'opacity-50' : ''}>
                      <TableCell className="whitespace-nowrap">
                        {requestUser ? (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src={requestUser.avatarUrl} alt={requestUser.name} />
                              <AvatarFallback>{requestUser.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-sm">{requestUser.name}</p>
                          </div>
                        ) : (
                          <span className="font-mono text-xs text-muted-foreground">{w.userId}</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-foreground whitespace-nowrap">
                        {w.amount.toLocaleString()} pts
                      </TableCell>
                      <TableCell>
                          <Badge variant="outline" className={cn("capitalize whitespace-nowrap", statusColors[w.status])}>
                            {w.status.replace('_', ' ')}
                          </Badge>
                      </TableCell>
                      <TableCell>
                           <div className="flex flex-col text-xs">
                              <span>{w.paymentMethod}</span>
                              <div className="flex items-center gap-1 text-muted-foreground font-mono">
                                  <span className="truncate max-w-[100px]">{w.paymentAddress}</span>
                                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(w.paymentAddress, "Wallet Address Copied")}>
                                      <Copy className="h-3 w-3"/>
                                  </Button>
                              </div>
                           </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                        {w.withdrawalDate && format(new Date(w.withdrawalDate), 'PPp')}
                      </TableCell>
                      <TableCell className="text-right">
                        {w.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                              <Button size="sm" variant="outline" onClick={() => handleAction(w.id, 'approve')} className="text-green-600 border-green-400 hover:bg-green-50 hover:text-green-700 dark:hover:bg-green-900/30" disabled={isProcessing}>
                              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Check className="h-4 w-4 mr-1"/> Approve</>}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleAction(w.id, 'reject')} disabled={isProcessing}>
                              <X className="h-4 w-4 mr-1"/> Reject
                              </Button>
                          </div>
                         ) : (
                            <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                {w.payoutTransactionId ? (
                                    <div className="flex items-center justify-end gap-1 text-muted-foreground font-mono text-xs">
                                        <span className="truncate max-w-[100px]">Tx: {w.payoutTransactionId}</span>
                                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(w.payoutTransactionId!, "Transaction ID Copied")}>
                                            <Copy className="h-3 w-3"/>
                                        </Button>
                                    </div>
                                ) : (
                                    <Badge variant="outline" className={cn("capitalize whitespace-nowrap", statusColors[w.status])}>
                                        {w.status.replace('_', ' ')}
                                    </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => setRequestToDelete(w)}
                                  disabled={isProcessing}
                                >
                                  {isProcessing && updatingId === w.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
                                </Button>
                           </div>
                         )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredWithdrawals?.length === 0 && !isLoadingData && (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No withdrawal requests found for the selected filters.
                      </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
          </div>
        </CardContent>
      </Card>
      
      <AlertDialog open={!!requestToDelete} onOpenChange={(open) => !open && setRequestToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this withdrawal record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className={buttonVariants({ variant: "destructive" })}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
