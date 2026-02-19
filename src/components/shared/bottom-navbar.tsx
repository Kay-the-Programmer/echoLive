"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { bottomNavItems } from "@/lib/constants";

export function BottomNavbar() {
  const pathname = usePathname();
  const navItems = bottomNavItems;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive =
            (item.href === "/" && pathname === "/") || (item.href !== "/" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-1 hover:bg-muted group relative",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <item.icon className="w-5 h-5 mb-1" />
                {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-2 -right-3 h-4 w-4 justify-center p-0 text-[10px]" variant="destructive">{item.badge}</Badge>
                )}
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
