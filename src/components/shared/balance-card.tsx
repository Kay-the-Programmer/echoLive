'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface BalanceCardProps {
  title: string;
  balance: number;
  href: string;
  icon: ReactNode;
  gradient: string;
  isLoading?: boolean;
  className?: string;
}

export function BalanceCard({ title, balance, href, icon, gradient, isLoading, className }: BalanceCardProps) {
  if (isLoading) {
    return <Skeleton className={cn("h-[70px] w-full rounded-lg", className)} />;
  }
  
  return (
    <Link href={href} className={cn("relative p-3 h-[70px] rounded-lg", gradient, className)}>
      <div className="absolute top-1/2 left-3 -translate-y-1/2">
        <div className="flex flex-col">
          <p className="text-sm text-white/80 font-semibold leading-tight">{title}</p>
          <p className="text-xl font-bold text-white leading-tight">{balance.toLocaleString()}</p>
        </div>
      </div>
      <div className="absolute top-1/2 right-3 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-white/30 text-lg">
        {icon}
      </div>
    </Link>
  );
}
