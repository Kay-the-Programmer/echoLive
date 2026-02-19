
'use client';

import { usePathname } from "next/navigation";
import { MainLayout } from "@/components/shared/main-layout";
import type { ReactNode } from "react";

export function LayoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Pages with custom layouts or no layout
  const noLayoutPages = ['/help', '/wallet/coins', '/wallet/points', '/wallet/withdraw', '/wallet/method', '/party/create', '/admin', '/party/', '/screenshots', '/handoff'];
  const useMainLayout = !noLayoutPages.some(p => pathname.startsWith(p));

  if (useMainLayout) {
    return <MainLayout>{children}</MainLayout>;
  }
  
  return <>{children}</>;
}
