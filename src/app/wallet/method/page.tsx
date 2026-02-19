
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useUser, useDoc } from '@/firebase';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Landmark } from 'lucide-react';
import { TRCIcon, BitcoinIcon, BinanceIcon, EthereumIcon, MtnMobileMoneyIcon, AirtelMobileMoneyIcon, NowPaymentsIcon } from '@/components/icons';
import { SecurityPasswordDialog } from '@/components/wallet/security-password-dialog';
import { BindAddressDialog } from '@/components/wallet/bind-address-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type PaymentMethod = {
    name: string;
    icon: React.ElementType;
    fee: string;
    arrival: string;
    enabled: boolean;
};

const paymentMethods: PaymentMethod[] = [
    { name: 'USDT-TRC20', icon: TRCIcon, fee: '1.5%', arrival: '8-10 minutes', enabled: true },
    { name: 'NOWPayments', icon: NowPaymentsIcon, fee: '0.5%', arrival: 'Varies', enabled: true },
    { name: 'Bank Transfer', icon: Landmark, fee: 'Varies', arrival: '1-3 days', enabled: true },
    { name: 'MTN Mobile Money ZM', icon: MtnMobileMoneyIcon, fee: '1%', arrival: 'Instant', enabled: true },
    { name: 'Airtel Mobile Money ZM', icon: AirtelMobileMoneyIcon, fee: '1%', arrival: 'Instant', enabled: true },
    { name: 'BTC (Bitcoin)', icon: BitcoinIcon, fee: 'Network', arrival: '10-30 minutes', enabled: false },
    { name: 'ETH (Ethereum)', icon: EthereumIcon, fee: 'Network', arrival: '2-5 minutes', enabled: false },
    { name: 'BNB (Binance Coin)', icon: BinanceIcon, fee: 'Network', arrival: '1-3 minutes', enabled: false },
];

export default function MethodPage() {
    const { user: authUser } = useUser();
    const userPath = useMemo(() => (authUser ? `users/${authUser.uid}` : null), [authUser]);
    const { data: user } = useDoc<User>(userPath);

    const [isSecurityDialogOpen, setSecurityDialogOpen] = useState(false);
    const [isBindDialogOpen, setBindDialogOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    
    const handleBindClick = (method: PaymentMethod) => {
        setSelectedMethod(method);
        setSecurityDialogOpen(true);
    };

    const handleSecuritySuccess = () => {
        setSecurityDialogOpen(false);
        setBindDialogOpen(true);
    };

    return (
        <TooltipProvider>
        <div className="bg-background min-h-screen">
            <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4">
                <Link href="/wallet/withdraw">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-lg font-semibold">Method</h1>
                <div className="w-9" />
            </header>

            <main className="p-4 space-y-3">
                {paymentMethods.map((method) => {
                    const boundAddress = user?.paymentMethods?.[method.name];
                    return (
                        <div key={method.name} className="rounded-lg border bg-card p-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <method.icon className="h-8 w-8"/>
                                <div>
                                    <p className="font-semibold">{method.name}</p>
                                    {boundAddress ? (
                                        <p className="text-xs text-muted-foreground truncate max-w-48">{boundAddress}</p>
                                    ) : (
                                        <p className="text-xs text-destructive">Not Bound</p>
                                    )}
                                </div>
                            </div>
                             <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="inline-block">
                                        <Button 
                                            variant={boundAddress ? "secondary" : "default"} 
                                            size="sm" 
                                            className="rounded-full px-4"
                                            onClick={() => method.enabled && handleBindClick(method)}
                                            disabled={!method.enabled}
                                        >
                                            {boundAddress ? "Change" : "Bind"}
                                        </Button>
                                    </div>
                                </TooltipTrigger>
                                {!method.enabled && (
                                    <TooltipContent>
                                        <p>This payment method will be integrated soon.</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </div>
                    )
                })}
            </main>
            
            {user && selectedMethod && (
                <SecurityPasswordDialog 
                    isOpen={isSecurityDialogOpen}
                    onOpenChange={setSecurityDialogOpen}
                    user={user}
                    onSuccess={handleSecuritySuccess}
                />
            )}
            
            {user && selectedMethod && (
                <BindAddressDialog
                    isOpen={isBindDialogOpen}
                    onOpenChange={setBindDialogOpen}
                    user={user}
                    paymentMethodName={selectedMethod.name}
                />
            )}
        </div>
        </TooltipProvider>
    );
}
