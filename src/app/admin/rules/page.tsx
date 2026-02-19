
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert, Gavel, ArrowLeft } from 'lucide-react';
import { useUser, useDoc } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { platformRules } from '@/lib/data';

function RulesDashboard() {
    return (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {platformRules.map((rule, index) => (
                <Card key={index}>
                    <CardHeader>
                        <CardTitle className="font-headline text-lg flex items-start gap-3">
                           <Gavel className="h-5 w-5 text-primary mt-1" />
                           <span>{rule.title}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{rule.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default function PlatformRulesPage() {
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
      <div className="pb-4 border-b border-border/50 text-center">
        <h1 className="font-headline text-3xl md:text-4xl font-bold tracking-tight text-foreground text-glow">
            Platform Rules
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
            General Community Rules and Guidelines.
        </p>
      </div>
      <RulesDashboard />
    </div>
  );
}
