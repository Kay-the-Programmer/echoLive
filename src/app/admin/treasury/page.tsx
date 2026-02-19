'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import { useAppOwners } from '@/firebase/firestore/use-app-owners';
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
import { Loader2, ArrowLeft, ShieldAlert, Landmark, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser, useFirestore } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { doc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { GrantTreasuryAccessDialog } from '@/components/admin/grant-treasury-access-dialog';

export default function TreasuryManagementPage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const { data: owners, isLoading: ownersLoading } = useAppOwners();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isGrantDialogOpen, setIsGrantDialogOpen] = useState(false);

  const isOwner = useMemo(() => {
    if (!authUser || !owners) return false;
    return owners.some(o => o.id === authUser.uid);
  }, [authUser, owners]);

  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: isOwner });

  const treasuryUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(u => u.hasTreasuryAccess);
  }, [users]);
  
  const handleRevoke = async (userId: string) => {
    if (!firestore || !isOwner) {
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'Only the App Owner can manage Treasury access.',
      });
      return;
    }
    setUpdatingId(userId);

    const userToUpdate = users?.find(u => u.id === userId);
    if (!userToUpdate || !userToUpdate.hasTreasuryAccess) {
      toast({ variant: 'destructive', title: 'Error', description: 'User does not have Treasury access.' });
      setUpdatingId(null);
      return;
    }

    const batch = writeBatch(firestore);
    const userRef = doc(firestore, 'users', userId);
    const treasuryRef = doc(firestore, 'treasury_access', userId);

    try {
      batch.delete(treasuryRef);
      batch.update(userRef, { hasTreasuryAccess: false });
      await batch.commit();

      toast({
        title: 'Access Revoked',
        description: `${userToUpdate.name}'s Treasury access has been removed.`,
      });
    } catch (error: any) {
      console.error('Failed to revoke treasury access:', error);
      toast({
        variant: 'destructive',
        title: 'Update Error',
        description: error.message || 'Could not update user role.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const isLoading = authLoading || ownersLoading;
  const isLoadingData = usersLoading && isOwner;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mt-8 max-w-lg mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            Only the App Owner can manage Treasury access.
          </AlertDescription>
           <Button asChild variant="secondary" className="mt-4">
              <Link href="/admin">Back to Dashboard</Link>
           </Button>
        </Alert>
      </div>
    );
  }

  return (
    <>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-lg">
                <Landmark className="text-primary" />
                Treasury Access Management ({treasuryUsers.length})
              </CardTitle>
              <CardDescription>
                Grant or revoke permission to withdraw application revenue.
              </CardDescription>
            </div>
            <Button onClick={() => setIsGrantDialogOpen(true)} disabled={isLoadingData}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Grant Access
            </Button>
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
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {treasuryUsers.map((user) => (
                      <TableRow key={user.id} className={updatingId === user.id ? 'opacity-50' : ''}>
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
                        <TableCell className="text-muted-foreground text-sm">
                          {user.registrationDate ? format(new Date(user.registrationDate), 'PPP') : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRevoke(user.id)}
                            disabled={updatingId === user.id}
                          >
                            {updatingId === user.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Revoke Access
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {treasuryUsers.length === 0 && !isLoadingData && (
                      <TableRow>
                          <TableCell colSpan={5} className="h-24 text-center">
                              No users currently have Treasury access.
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

      {users && (
        <GrantTreasuryAccessDialog 
            isOpen={isGrantDialogOpen}
            onOpenChange={setIsGrantDialogOpen}
            allUsers={users}
        />
      )}
    </>
  );
}
