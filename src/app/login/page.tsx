
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { GoogleIcon } from '@/components/icons/google-icon';
import type { User } from '@/lib/types';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Logged In Successfully!",
        description: "Welcome back to EchoLive.",
      });
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not sign in.",
      });
    } finally {
        setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const numericId = Math.floor(10000000 + Math.random() * 90000000).toString();
        const ownersCollectionRef = collection(firestore, 'appowners');
        const ownersSnapshot = await getDocs(ownersCollectionRef);
        const isFirstUser = ownersSnapshot.empty;
        
        const userProfile: User = {
          id: user.uid,
          numericId: numericId,
          name: user.displayName || 'New User',
          email: user.email,
          avatarUrl: user.photoURL || `https://picsum.photos/seed/${user.uid}/128`,
          countryCode: 'US',
          level: 1,
          wealthLevel: 1,
          totalCoinsSpent: 0,
          totalPointsEarned: 0,
          coinBalance: 750,
          pointBalance: 0,
          isAdmin: isFirstUser,
          isOwner: isFirstUser,
          isAgent: false,
          registrationDate: new Date().toISOString(),
          photoWall: [user.photoURL || `https://picsum.photos/seed/${user.uid}/128`],
          followingCount: 0,
          followerCount: 0,
          friendCount: 0,
        };
  
        const batch = writeBatch(firestore);
        batch.set(userDocRef, userProfile);
  
        if (isFirstUser) {
            const ownerDocRef = doc(firestore, 'appowners', user.uid);
            batch.set(ownerDocRef, { assignedAt: new Date().toISOString() });
            const adminDocRef = doc(firestore, 'admins', user.uid);
            batch.set(adminDocRef, { grantedAt: new Date().toISOString() });
        }
  
        await batch.commit();
        toast({ title: "Account Created Successfully!", description: "Welcome to EchoLive." });
      } else {
        toast({ title: "Logged In Successfully!", description: "Welcome back to EchoLive." });
      }
      
      router.push('/profile');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message || "Could not sign in with Google.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="you@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Login
                </Button>
              </form>
            </Form>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="mr-2 h-5 w-5" />
              )}
              Sign In with Google
            </Button>
            <div className="mt-4 text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="underline text-primary">
                    Sign up
                </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
