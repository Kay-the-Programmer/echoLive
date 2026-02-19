
'use client';

import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ExamplePage() {
  const { user, isUserLoading } = useUser();

  if (isUserLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Checking authentication status...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Hello, {user.displayName || 'User'}!</h1>
        <p className="mt-4 text-muted-foreground">This page demonstrates how to get the current user's ID.</p>
        
        <div className="mt-6 p-6 border rounded-lg bg-card">
            <p className="font-medium">Your User ID is:</p>
            <pre className="mt-2 p-3 bg-muted rounded-md font-mono text-sm text-primary">{user.uid}</pre>
            <p className="mt-4 text-xs text-muted-foreground">This ID comes from the `user.uid` property provided by our custom `useUser()` hook.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h1 className="text-3xl font-bold">You are not logged in.</h1>
      <p className="text-muted-foreground">Please log in to see your User ID.</p>
      <Button asChild>
        <Link href="/login">Go to Login</Link>
      </Button>
    </div>
  );
}
