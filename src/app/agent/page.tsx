
'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { AgentCard } from '@/components/shared/agent-card';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Loader2, ShieldAlert, LogIn } from "lucide-react"
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useAuth } from '@/firebase';

function AgentDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Agent Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <AgentCard />
        </CardContent>
      </Card>
      <div className="mt-8 flex justify-center">
        <Button variant="outline" asChild>
          <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            Watch Training Video
          </a>
        </Button>
      </div>
    </div>
  );
}

export default function AgentPage() {
  const { user: authUser, isUserLoading: authLoading } = useUser();
  const userPath = useMemo(() => authUser ? `users/${authUser.uid}` : null, [authUser]);
  const { data: user, isLoading: userLoading } = useDoc<User>(userPath);
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  const isLoading = authLoading || userLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mt-8 flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Alert variant="destructive" className="max-w-md mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Not Logged In</AlertTitle>
          <AlertDescription>
            You must be logged in to view the Agent Dashboard.
          </AlertDescription>
        </Alert>
        <Button asChild className="mt-4">
            <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
            </Link>
        </Button>
      </div>
    )
  }

  if (!user.isAgent && !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mt-8 max-w-md mx-auto">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            This area is for agents and admins only.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <AgentDashboard />;
}
