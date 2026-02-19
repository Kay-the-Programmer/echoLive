
'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Loader2,
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  PlusCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useDoc } from '@/firebase';
import type { User, Violation } from '@/lib/types';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useAllUsers } from '@/firebase/firestore/use-all-users';
import { useAllViolations } from '@/firebase/firestore/use-all-violations';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ReportViolationDialog } from '@/components/admin/report-violation-dialog';
import { cn } from '@/lib/utils';

export default function RulesViolatorsPage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const isAdmin = !!adminRecord;
  
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);

  const { data: users, isLoading: usersLoading } = useAllUsers({ enabled: isAdmin });
  const { data: violations, isLoading: violationsLoading } = useAllViolations({ enabled: isAdmin });

  const getUserById = (userId: string): User | undefined => {
    return users?.find(u => u.id === userId);
  };
  
  const isLoading = authLoading || adminLoading;
  const isLoadingData = (usersLoading || violationsLoading) && isAdmin;


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
        <Button onClick={() => setIsReportDialogOpen(true)} disabled={isLoadingData || !users}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Report Violation
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle /> Rules Violators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
             {isLoadingData ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            ) : (
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>Violator</TableHead>
                    <TableHead>Rule Broken</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {violations?.map((violation) => {
                        const violator = getUserById(violation.userId);
                        const reporter = violation.reportingAdminId === 'system-moderator' 
                            ? { name: 'Auto-Moderator' } 
                            : getUserById(violation.reportingAdminId);

                        return (
                            <TableRow key={violation.id}>
                                <TableCell>
                                    {violator ? (
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={violator.avatarUrl} alt={violator.name} />
                                                <AvatarFallback>{violator.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span>{violator.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs font-mono text-muted-foreground">{violation.userId}</span>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium max-w-xs truncate">{violation.ruleTitle}</TableCell>
                                <TableCell className="text-muted-foreground text-xs max-w-sm truncate">{violation.notes}</TableCell>
                                <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                                    {format(new Date(violation.violationDate), 'PP')}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs">
                                    {reporter?.name ? (
                                        <span className={cn(violation.reportingAdminId === 'system-moderator' && 'italic text-primary')}>
                                            {reporter.name}
                                        </span>
                                    ) : 'Admin'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" disabled>Resolve</Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {violations?.length === 0 && !isLoadingData && (
                        <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                            No rules violators found.
                        </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            )}
          </div>
        </CardContent>
      </Card>
      {users && (
        <ReportViolationDialog 
            isOpen={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
            allUsers={users}
        />
      )}
    </div>
  );
}
