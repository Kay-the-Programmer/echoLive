
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function RecoverPage() {
  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            Page No Longer In Use
          </CardTitle>
          <CardDescription>
            This recovery page has been deprecated. The ownership claim process has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Please navigate to the Admin Dashboard to claim or recover ownership of the application.
          </p>
          <Button asChild className="w-full">
            <Link href="/admin">
              Go to Admin Page
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
