
'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import type { User } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, ArrowLeft, ShieldAlert, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { isAfter } from 'date-fns';
import { useUser, useDoc, useFirestore, useAppOwners } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { doc, writeBatch } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { GrantPerksDialog } from '@/components/admin/grant-perks-dialog';
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

function UserListContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');

  const { user: authUser, isUserLoading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const { data: appOwners, isLoading: ownersLoading } = useAppOwners();

  const isAdmin = !!adminRecord;
  const isOwner = useMemo(() => {
    if (ownersLoading || !appOwners || !authUser) return false;
    return appOwners.some((owner: any) => owner.id === authUser.uid);
  }, [appOwners, ownersLoading, authUser]);

  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: isAdmin });


  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);
  const [isGrantPerksDialogOpen, setIsGrantPerksDialogOpen] = useState(false);
  const [selectedUserForPerks, setSelectedUserForPerks] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const handleOpenGrantPerks = (userToGrant: User) => {
    setSelectedUserForPerks(userToGrant);
    setIsGrantPerksDialogOpen(true);
  };

  const handleUpdateRole = async (userId: string, role: 'agent' | 'admin' | 'treasury') => {
    if (!firestore) {
      toast({ variant: 'destructive', title: 'Permission Denied', description: 'Firestore not available.' });
      return;
    }

    setIsUpdatingRole(userId);
    const userToUpdate = users?.find((u) => u.id === userId);
    if (!userToUpdate) return;

    const batch = writeBatch(firestore);
    const userRef = doc(firestore, 'users', userId);

    try {
      if (role === 'admin') {
        const adminRef = doc(firestore, 'admins', userId);
        if (userToUpdate.isAdmin) {
          batch.delete(adminRef);
          batch.update(userRef, { isAdmin: false });
        } else {
          batch.set(adminRef, { grantedAt: new Date().toISOString() });
          batch.update(userRef, { isAdmin: true });
        }
      } else if (role === 'agent') {
        batch.update(userRef, { isAgent: !userToUpdate.isAgent });
      } else if (role === 'treasury') {
        const treasuryRef = doc(firestore, 'treasury_access', userId);
        if (userToUpdate.hasTreasuryAccess) {
          batch.delete(treasuryRef);
          batch.update(userRef, { hasTreasuryAccess: false });
        } else {
          batch.set(treasuryRef, { grantedAt: new Date().toISOString() });
          batch.update(userRef, { hasTreasuryAccess: true });
        }
      }

      await batch.commit();
      toast({ title: 'Role Updated', description: `User role has been successfully toggled.` });
    } catch (error: any) {
      console.error('Failed to update user role:', error);
      toast({ variant: 'destructive', title: 'Update Error', description: error.message || 'Could not update user role.' });
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete || !firestore || !authUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'Required information is missing.' });
      return;
    }
    if (userToDelete.id === authUser.uid) {
      toast({ variant: 'destructive', title: 'Action Forbidden', description: 'App Owner cannot delete their own account.' });
      setUserToDelete(null);
      return;
    }

    setIsUpdatingRole(userToDelete.id);

    try {
      const batch = writeBatch(firestore);

      const userDocRef = doc(firestore, 'users', userToDelete.id);
      batch.delete(userDocRef);

      const adminDocRef = doc(firestore, 'admins', userToDelete.id);
      batch.delete(adminDocRef);

      const treasuryDocRef = doc(firestore, 'treasury_access', userToDelete.id);
      batch.delete(treasuryDocRef);

      await batch.commit();

      toast({
        title: 'User Deleted',
        description: `${userToDelete.name}'s data has been removed.`,
      });
    } catch (error: any) {
      console.error("User deletion failed on client:", error);
      toast({
        variant: 'destructive',
        title: 'Deletion Failed',
        description: error.message || 'You may not have permission to perform this action.',
      });
    } finally {
      setIsUpdatingRole(null);
      setUserToDelete(null);
    }
  };

  const getFilteredUsers = () => {
    if (!isAdmin || !users) return [];

    switch (filter) {
      case 'admins':
        return users.filter((u) => u.isAdmin);
      case 'agents':
        return users.filter((u) => u.isAgent);
      case 'new': {
        const now = new Date();
        let startOfDay = new Date(now);

        startOfDay.setHours(18, 0, 0, 0);

        if (now.getHours() < 18) {
          startOfDay.setDate(startOfDay.getDate() - 1);
        }

        return users.filter((u) => u.registrationDate && isAfter(new Date(u.registrationDate), startOfDay));
      }
      case 'all':
      default:
        return users;
    }
  };

  const getPageTitle = () => {
    switch (filter) {
      case 'admins':
        return 'Administrators';
      case 'agents':
        return 'Agents';
      case 'new':
        return 'New Registries';
      case 'all':
      default:
        return 'All Users';
    }
  };

  const isLoadingPage = authLoading || adminLoading || ownersLoading;

  if (isLoadingPage) {
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
          <AlertDescription>You do not have administrative privileges to view this page.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const filteredUsers = getFilteredUsers();
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

      <div className="border rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">
            {getPageTitle()} ({filteredUsers.length})
          </h2>
        </div>

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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className={isUpdatingRole === user.id ? 'opacity-50' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <p>{user.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{user.numericId ?? user.id}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end space-y-1">
                          <Button variant="outline" size="sm" onClick={() => handleOpenGrantPerks(user)} className="w-36 border-primary">
                            Grant Perk
                          </Button>
                          <Button
                            variant={user.isAgent ? 'destructive' : 'outline'}
                            size="sm"
                            className={cn('w-36', !user.isAgent && 'border-primary')}
                            disabled={isUpdatingRole === user.id}
                            onClick={() => handleUpdateRole(user.id, 'agent')}
                          >
                            {user.isAgent ? 'Demote Agent' : 'Make Agent'}
                          </Button>
                          <Button
                            variant={user.isAdmin ? 'destructive' : 'outline'}
                            size="sm"
                            className={cn('w-36', !user.isAdmin && 'border-primary')}
                            disabled={isUpdatingRole === user.id}
                            onClick={() => handleUpdateRole(user.id, 'admin')}
                          >
                            {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                          </Button>
                          <Button
                            variant={user.hasTreasuryAccess ? 'destructive' : 'outline'}
                            size="sm"
                            className={cn('w-36', !user.hasTreasuryAccess && 'border-primary')}
                            disabled={isUpdatingRole === user.id}
                            onClick={() => handleUpdateRole(user.id, 'treasury')}
                          >
                            {user.hasTreasuryAccess ? 'Revoke Treasury' : 'Grant Treasury'}
                          </Button>
                          {isOwner && user.id !== authUser?.uid && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-36"
                              onClick={() => setUserToDelete(user)}
                              disabled={isUpdatingRole === user.id}
                            >
                              {isUpdatingRole === user.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                              Delete User
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      {selectedUserForPerks && users && (
        <GrantPerksDialog initialUser={selectedUserForPerks} allUsers={users} isOpen={isGrantPerksDialogOpen} onOpenChange={setIsGrantPerksDialogOpen} />
      )}

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user's data from the application database. The user account in Firebase Authentication will not be disabled.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdatingRole === userToDelete?.id}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isUpdatingRole === userToDelete?.id}
              onClick={handleDeleteConfirm}
              className={buttonVariants({ variant: "destructive" })}
            >
              {isUpdatingRole === userToDelete?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}

export default function UserListPage() {
  return (
    <React.Suspense fallback={
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    }>
      <UserListContent />
    </React.Suspense>
  );
}
