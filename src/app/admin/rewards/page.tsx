
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PageHeader } from '@/components/shared/page-header';
import { Loader2, ShieldAlert, ArrowLeft, Info } from 'lucide-react';
import { useUser, useDoc } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function RewardRulesDashboard() {
    return (
        <div className="mt-8 grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg text-center">General Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-muted-foreground">
                    <p>Streamers must maintain a decent appearance (head-to-toe) and follow the dress code.</p>
                    <p>Rewards are subject to change and will be credited to user accounts upon manual collection.</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-pink-500/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-pink-400 text-center">Female Daily Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-bold text-foreground">1. Crown Seat Rewards</h4>
                            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1 text-sm">
                                <li>Crown seats are reserved for female users.</li>
                                <li>Earn points by occupying a crown seat:
                                    <ul className="list-disc list-inside pl-4">
                                        <li>1 hour: <strong className="text-green-400">900 points</strong></li>
                                        <li>2 hours: <strong className="text-green-400">950 points</strong></li>
                                    </ul>
                                </li>
                                <li>If a male user occupies a crown seat, they lose <strong className="text-red-400">1 point every 10 seconds</strong>.</li>
                                <li>Any female user sitting on seats 16, 21, 26, or 31 Seats automatically converts them into a crown seat. It reverts to normal when she leaves.</li>
                            </ul>
                        </div>
                         <div>
                            <h4 className="font-bold text-foreground">2. Livestreaming</h4>
                             <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1 text-sm">
                                <li>Go live for:
                                    <ul className="list-disc list-inside pl-4">
                                        <li>1 hour: <strong className="text-green-400">1,300 points</strong></li>
                                        <li>2 hours: <strong className="text-green-400">2,750 points</strong></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                 <Card className="border-blue-500/50">
                    <CardHeader>
                        <CardTitle className="font-headline text-blue-400 text-center">Male Daily Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div>
                            <h4 className="font-bold text-foreground">1. Seat Occupancy</h4>
                             <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1 text-sm">
                                 <li>Occupy a non-crown seat for:
                                     <ul className="list-disc list-inside pl-4">
                                        <li>30 minutes: <strong className="text-amber-400">460 coins</strong></li>
                                        <li>1 hour: <strong className="text-amber-400">500 coins</strong></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-primary text-center">PK Battle Rewards (Male & Female)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-sm mb-2">Win consecutive PK battles to earn points:</p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                        <li>2 wins: <strong className="text-green-400">4,000 points</strong></li>
                        <li>6 wins: <strong className="text-green-400">5,000 points</strong></li>
                        <li>11 wins: <strong className="text-green-400">2,000 points</strong></li>
                    </ul>
                </CardContent>
            </Card>

            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="font-headline text-destructive text-center">Reward Collection & Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-bold text-foreground">Reward Collection</h4>
                        <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                            <li>All rewards must be collected manually from the "Missions" page.</li>
                            <li><strong className="text-foreground">Deadline:</strong> Rewards not collected by <strong className="text-destructive-foreground">5:59 PM</strong> will be lost immediately.</li>
                        </ul>
                    </div>
                    <div className="border-t pt-4">
                        <h4 className="font-bold text-foreground">Important Notes</h4>
                         <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                            <li>Points and coins tasks are completed instantly, but rewards await manual collection.</li>
                            <li>Abuse of rules may lead to account suspension.</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function RewardManagementPage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const adminPath = useMemo(() => (authUser ? `admins/${authUser.uid}` : null), [authUser]);
  const { data: adminRecord, isLoading: adminLoading } = useDoc(adminPath);
  const isAdmin = !!adminRecord;

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
      <PageHeader 
        title="Reward Rules for EchoLive" 
        description="View and Manage Settings"
        className="text-center"
      />
      <RewardRulesDashboard />
    </div>
  );
}
