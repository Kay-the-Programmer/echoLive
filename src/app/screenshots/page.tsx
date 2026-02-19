
'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
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
  Briefcase,
  FileImage,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { TRCIcon } from '@/components/icons';
import { PayPalIcon } from '@/components/icons/paypal-icon';
import { GooglePayIcon } from '@/components/icons/google-pay-icon';

// Simplified StatCard for visual representation
const ScreenshotStatCard = ({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) => (
  <Card className="flex flex-col bg-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
        {title}
        {icon}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
    <CardFooter className="border-t pt-2 pb-2 px-4">
      <p className="text-sm text-primary hover:underline">Manage</p>
    </CardFooter>
  </Card>
);

export default function ScreenshotsPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-background">
      <div className="mb-4">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="text-center mb-8">
        <h1 className="font-headline text-3xl font-bold">UI Screenshots</h1>
        <p className="text-muted-foreground">
          Visual representations of key pages for your developer.
        </p>
      </div>

      <div className="space-y-12">
        {/* Admin Dashboard Screenshot */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Screenshot: Admin Dashboard</CardTitle>
            <CardDescription>/admin</CardDescription>
          </CardHeader>
          <CardContent className="bg-muted p-6 rounded-lg">
            <div className="text-center mb-8">
              <h1 className="font-headline text-3xl font-bold">
                Administrative Dashboard
              </h1>
              <p className="mt-1 font-semibold text-primary/90">Owner's Office</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <ScreenshotStatCard title="Admins" value="1" icon={<Shield />} />
              <ScreenshotStatCard title="Agents" value="5" icon={<UserCheck />} />
              <ScreenshotStatCard title="Users" value="138" icon={<Users />} />
              <ScreenshotStatCard title="VIPs" value="12" icon={<Crown />} />
              <ScreenshotStatCard title="Guardians" value="8" icon={<Gem />} />
              <ScreenshotStatCard title="Withdrawal Request" value="3" icon={<Banknote />} />
              <ScreenshotStatCard title="Global Account (Revenue)" value="$1,450.75" icon={<CircleDollarSign />} />
              <ScreenshotStatCard title="Treasury Access" value="1" icon={<Landmark />} />
              <ScreenshotStatCard title="Rules Violators" value="2" icon={<ShieldQuestion />} />
            </div>
          </CardContent>
        </Card>

        {/* Payment Page Screenshot */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle>Screenshot: Revenue Payout Page</CardTitle>
            <CardDescription>/admin/revenue</CardDescription>
          </CardHeader>
          <CardContent className="bg-muted p-6 rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CircleDollarSign className="text-primary" />
                  <span>App Owner Payout Center</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center rounded-lg bg-muted p-6">
                  <p className="text-sm text-muted-foreground">Current Available Revenue</p>
                  <p className="text-5xl font-bold text-foreground">$1,450.75</p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Choose Payout Method</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                    <Button variant="default"><TRCIcon className="mr-2 h-5 w-5" /> USDT</Button>
                    <Button variant="outline"><PayPalIcon className="mr-2 h-5 w-5" /> PayPal</Button>
                    <Button variant="outline"><GooglePayIcon className="mr-2 h-5 w-5" /> Google Pay</Button>
                    <Button variant="outline" disabled><Landmark className="mr-2 h-4 w-4" /> Bank</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="walletAddress" className="font-medium text-sm">USDT-TRC20 Wallet Address</label>
                  <Input id="walletAddress" type="text" placeholder="Enter your TRC20 wallet address" value="Txxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" readOnly />
                </div>

                <div className="space-y-2">
                  <label htmlFor="amount" className="font-medium">Amount (USD)</label>
                  <div className="relative">
                    <CircleDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="amount" type="number" placeholder="5.00" className="pl-10 h-12 text-lg" value="150" readOnly />
                  </div>
                </div>

                <Button size="lg" className="w-full">
                  <Banknote className="mr-2 h-5 w-5" />
                  Initiate Payout
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
