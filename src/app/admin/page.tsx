
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import {
  Loader2,
  ShieldAlert,
  Users,
  Shield,
  UserCheck,
  Crown,
  Gem,
  UserPlus,
  Coins,
  Banknote,
  Scale,
  Gavel,
  ShieldQuestion,
  UserCog,
  CircleDollarSign,
  Landmark,
  ArrowLeft,
  FileImage,
  Briefcase,
} from 'lucide-react';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import { useAllWithdrawals } from '@/firebase/firestore/use-all-withdrawals';
import { useGlobalBalance } from '@/firebase/firestore/use-global-balance';
import { useAllViolations } from '@/firebase/firestore/use-all-violations';
import { useUser, useDoc, useFirestore, useAppOwners, useTreasuryAccess } from '@/firebase';
import type { User as UserType } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { isAfter } from 'date-fns';
import { GrantPerksDialog } from '@/components/admin/grant-perks-dialog';
import { doc, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { claimAppOwnership } from '@/app/actions/claim-ownership';


interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  manageLink: string;
  icon: React.ReactNode;
  footerValue?: string | number;
  isViewCard?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  manageLink,
  icon,
  footerValue,
  isViewCard,
}) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {title}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{subtext}</p>
      </CardContent>
      <CardFooter className="border-t pt-2 pb-2 px-4">
        {isViewCard ? (
          <Link 
            href={manageLink} 
            className="w-full text-sm text-primary hover:underline text-center active:text-green-500">
            View
          </Link>
        ) : (
          <div className="flex justify-between w-full items-center">
            <p className="text-sm text-muted-foreground">{footerValue}</p>
            <Link 
              href={manageLink}
              className="text-sm text-primary hover:underline active:text-green-500">
              Manage
            </Link>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isClaiming, setIsClaiming] = useState(false);

  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const { data: appOwners, isLoading: ownersLoading } = useAppOwners();
  const { hasAccess: hasTreasuryAccess, isLoading: treasuryLoading } = useTreasuryAccess(authUser?.uid);

  const isAdmin = !!adminRecord;
  const noOwnerExists = useMemo(() => !ownersLoading && (!appOwners || appOwners.length === 0), [appOwners, ownersLoading]);
  const isOwner = useMemo(() => {
    if (ownersLoading || !appOwners || !authUser) return false;
    return appOwners.some(owner => owner.id === authUser.uid);
  }, [appOwners, ownersLoading, authUser]);

  const canViewDashboard = isAdmin || isOwner;
  const canViewRevenue = isOwner || hasTreasuryAccess;

  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: canViewDashboard });
  const { data: withdrawals, isLoading: withdrawalsLoading } = useAllWithdrawals({ enabled: canViewDashboard });
  const { data: globalBalance, isLoading: balanceLoading } = useGlobalBalance({ enabled: canViewRevenue });
  const { data: violations, isLoading: violationsLoading } = useAllViolations({ enabled: canViewDashboard });
  const [isGrantPerksDialogOpen, setIsGrantPerksDialogOpen] = useState(false);
  const [selectedUserForPerks, setSelectedUserForPerks] = useState<UserType | null>(null);
  const [isUpdatingRole, setIsUpdatingRole] = useState<string | null>(null);

  const stats = useMemo(() => {
    if (!users) return { admins: 0, agents: 0, totalUsers: 0, vips: 0, guardians: 0, newRegistries: 0, coinBuyers: 0, agentRequests: 0, treasuryAccess: 0 };
    const now = new Date();
    let startOfDay = new Date(now);
    startOfDay.setHours(18, 0, 0, 0);
    if (now.getHours() < 18) startOfDay.setDate(startOfDay.getDate() - 1);
    return {
      admins: users.filter(u => u.isAdmin).length,
      agents: users.filter(u => u.isAgent).length,
      totalUsers: users.length,
      vips: users.filter(u => u.vip).length,
      guardians: users.filter(u => u.guardian).length,
      newRegistries: users.filter(u => u.registrationDate && isAfter(new Date(u.registrationDate), startOfDay)).length,
      coinBuyers: users.filter(u => u.totalCoinsSpent && u.totalCoinsSpent > 0).length,
      agentRequests: users.filter(u => u.agentRequestStatus === 'pending').length,
      treasuryAccess: users.filter(u => u.hasTreasuryAccess).length,
    };
  }, [users]);
  
  const withdrawalRequests = useMemo(() => {
    if (!withdrawals) return 0;
    return withdrawals.filter(w => w.status === 'pending').length;
  }, [withdrawals]);

  const handleOpenGrantPerks = (userToGrant: UserType) => {
    setSelectedUserForPerks(userToGrant);
    setIsGrantPerksDialogOpen(true);
  };
  
  const handleUpdateRole = async (userId: string, role: 'agent' | 'admin' | 'treasury') => {
    if (!firestore) { toast({ variant: 'destructive', title: 'Permission Denied', description: "Firestore not available."}); return; }
    
    setIsUpdatingRole(userId);
    const userToUpdate = users?.find(u => u.id === userId);
    if (!userToUpdate) return;
    
    const batch = writeBatch(firestore);
    const userRef = doc(firestore, 'users', userId);

    try {
      if (role === 'admin') {
        const adminRef = doc(firestore, 'admins', userId);
        if (userToUpdate.isAdmin) { batch.delete(adminRef); batch.update(userRef, { isAdmin: false }); }
        else { batch.set(adminRef, { grantedAt: new Date().toISOString() }); batch.update(userRef, { isAdmin: true }); }
      } else if (role === 'agent') {
        batch.update(userRef, { isAgent: !userToUpdate.isAgent });
      } else if (role === 'treasury') {
          const treasuryRef = doc(firestore, 'treasury_access', userId);
          if (userToUpdate.hasTreasuryAccess) { batch.delete(treasuryRef); batch.update(userRef, { hasTreasuryAccess: false }); }
          else { batch.set(treasuryRef, { grantedAt: new Date().toISOString() }); batch.update(userRef, { hasTreasuryAccess: true }); }
      }

      await batch.commit();
      toast({ title: 'Role Updated', description: `User role has been successfully toggled.`});
    } catch (error: any) {
      console.error("Failed to update user role:", error);
      toast({ variant: 'destructive', title: 'Update Error', description: error.message || 'Could not update user role.' });
    } finally {
      setIsUpdatingRole(null);
    }
  };

  const handleClaimOwnership = async () => {
    if (!authUser) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in to claim ownership.' });
      return;
    }
    setIsClaiming(true);
    const result = await claimAppOwnership(authUser.uid);
    if (result.success) {
      toast({ title: 'Ownership Claimed!', description: 'You now have full admin access. The page will reload.' });
      setTimeout(() => window.location.reload(), 2000);
    } else {
      toast({ variant: 'destructive', title: 'Claim Failed', description: result.message, duration: 9000 });
      setIsClaiming(false);
    }
  };
  
  const isLoadingPage = authLoading || adminLoading || ownersLoading || treasuryLoading;
  
  if (isLoadingPage) {
      return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (noOwnerExists) {
    return (
      <div className="container mx-auto flex h-screen items-center justify-center">
        <Alert variant="destructive" className="max-w-lg">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Final Step: Claim Ownership</AlertTitle>
          <AlertDescription>
            This application has no owner. Click the button below to become the first administrator and claim full ownership. This is a one-time action.
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={handleClaimOwnership} disabled={isClaiming || !authUser}>
              {isClaiming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Claim Application Ownership
            </Button>
          </div>
        </Alert>
      </div>
    );
  }

  if (!canViewDashboard) {
      return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mt-8 max-w-lg mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have administrative privileges to view this page. An owner has already been assigned to this application.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLoadingData = usersLoading || withdrawalsLoading || balanceLoading || violationsLoading;
  const totalAppRevenue = (globalBalance?.totalUsdRevenue ?? 0);

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
            <Button onClick={() => router.back()} variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        </div>
        <div className="text-center mb-8">
            <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground text-glow">
                Administrative Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Application Management</p>
            <p className="mt-1 font-semibold text-primary/90">Owner's Office</p>
        </div>

      {isLoadingData ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard title="Admins" value={stats.admins} subtext="Click to manage" manageLink="/admin/users?filter=admins" icon={<Shield />} footerValue={stats.admins} />
            <StatCard title="Agents" value={stats.agents} subtext="Click to manage" manageLink="/admin/users?filter=agents" icon={<UserCheck />} footerValue={stats.agents} />
            <StatCard title="Users" value={stats.totalUsers} subtext="Click to manage" manageLink="/admin/users?filter=all" icon={<Users />} footerValue={stats.totalUsers} />
            
            <StatCard title="Developer Handoff" value="View" subtext="Copy all code for developer" manageLink="/handoff" icon={<Briefcase />} isViewCard={true} />
            <StatCard title="UI Screenshots" value="View" subtext="Visual guide for developer" manageLink="/screenshots" icon={<FileImage />} isViewCard={true} />
            
            <StatCard title="VIPs" value={stats.vips} subtext="Click to manage" manageLink="/admin/vips" icon={<Crown />} footerValue={stats.vips} />
            <StatCard title="Guardians" value={stats.guardians} subtext="Click to manage" manageLink="/admin/guardians" icon={<Gem />} footerValue={stats.guardians} />
            <StatCard title="New Registry" value={stats.newRegistries} subtext="Click to manage" manageLink="/admin/users?filter=new" icon={<UserPlus />} footerValue={stats.newRegistries} />
            <StatCard title="Coins Buyer" value={stats.coinBuyers} subtext="Click to manage" manageLink="/admin/coin-buyers" icon={<Coins />} footerValue={stats.coinBuyers} />
            <StatCard title="Withdrawal Request" value={withdrawalRequests} subtext="Click to manage" manageLink="/admin/withdrawals" icon={<Banknote />} footerValue={withdrawalRequests} />
            {canViewRevenue && (
                <>
                    <StatCard title="Global Account (Revenue)" value={`$${totalAppRevenue.toFixed(2)}`} subtext="Coin purchases, fees, etc." manageLink="/admin/revenue" icon={<CircleDollarSign />} footerValue={`$${totalAppRevenue.toFixed(2)}`} />
                    <StatCard title="Treasury Access" value={stats.treasuryAccess} subtext="Click to manage" manageLink="/admin/treasury" icon={<Landmark />} footerValue={stats.treasuryAccess} />
                </>
            )}
            <StatCard title="Reward Rules" value="View" subtext="Click to manage" manageLink="/admin/rewards" icon={<Scale />} isViewCard={true} />
            <StatCard title="Platform Rules" value="View" subtext="Click to manage" manageLink="/admin/rules" icon={<Gavel />} isViewCard={true} />
            <StatCard title="Rules Violators" value={violations?.length ?? 0} subtext="Click to manage" manageLink="/admin/violators" icon={<ShieldQuestion />} footerValue={violations?.length ?? 0} />
            <StatCard title="Agents Request" value={stats.agentRequests} subtext="Click to manage" manageLink="/admin/agent-requests" icon={<UserCog />} footerValue={stats.agentRequests} />
          </div>

          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Manage Users</CardTitle>
                <Link href="/admin/users?filter=all" className="text-sm text-primary hover:underline">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.slice(0, 5).map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                           <Avatar className="h-8 w-8">
                                <AvatarImage src={u.avatarUrl} alt={u.name} />
                                <AvatarFallback>{u.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                           <span>{u.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{u.numericId ?? u.id}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end space-y-1">
                            <Button variant="outline" size="sm" onClick={() => handleOpenGrantPerks(u)} className="w-36 border-primary">Grant Perk</Button>
                            <Button 
                                variant={u.isAgent ? "destructive" : "outline"}
                                size="sm" 
                                className={cn('w-36', !u.isAgent && 'border-primary')} 
                                disabled={isUpdatingRole === u.id} 
                                onClick={() => handleUpdateRole(u.id, 'agent')}
                            >
                                {u.isAgent ? 'Demote Agent' : 'Make Agent'}
                            </Button>
                            <Button 
                                variant={u.isAdmin ? 'destructive' : 'outline'}
                                size="sm" 
                                className={cn('w-36', !u.isAdmin && 'border-primary')}
                                disabled={isUpdatingRole === u.id} 
                                onClick={() => handleUpdateRole(u.id, 'admin')}
                            >
                                {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                            </Button>
                             <Button 
                                variant={u.hasTreasuryAccess ? 'destructive' : 'outline'}
                                size="sm" 
                                className={cn('w-36', !u.hasTreasuryAccess && 'border-primary')}
                                disabled={isUpdatingRole === u.id} 
                                onClick={() => handleUpdateRole(u.id, 'treasury')}
                            >
                                {u.hasTreasuryAccess ? 'Revoke Treasury' : 'Grant Treasury'}
                            </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}

      {selectedUserForPerks && users && (
        <GrantPerksDialog
            initialUser={selectedUserForPerks}
            allUsers={users}
            isOpen={isGrantPerksDialogOpen}
            onOpenChange={setIsGrantPerksDialogOpen}
        />
      )}
    </div>
  );
}
