'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { navItems, socialLinks } from "@/lib/constants";
import { Button } from "../ui/button";
import { Gift, Video, User, LogOut, Shield, Search, Trophy, LogIn, Loader2 } from "lucide-react";
import { BottomNavbar } from "./bottom-navbar";
import { useUser, useAuth } from "@/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

// A smaller, dedicated header for mobile agent page
function AgentHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="container mx-auto flex h-14 items-center justify-center px-4">
        <h1 className="text-base font-bold text-foreground">Agent Dashboard</h1>
      </div>
    </header>
  );
}

// A smaller, dedicated header for other mobile pages
function MobileHeader() {
    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            <div className="container mx-auto flex h-14 items-center justify-end px-4 space-x-4">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Trophy className="h-5 w-5 text-muted-foreground" />
            </div>
        </header>
    );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isUserLoading: loading } = useUser();
  const auth = useAuth();
  
  const handleLogout = async () => {
    await auth.signOut();
  }

  const desktopNavItems = navItems.filter(item => item.href !== '/admin');
  
  // These pages have their own layout or no layout at all
  const noLayoutPages = ['/signup', '/login', '/wallet/coins', '/party/create', '/admin', '/party/', '/profile/edit'];
  const useMainLayout = !noLayoutPages.some(p => pathname.startsWith(p));

  const isAgentPage = pathname.startsWith('/agent');
  const isProfilePage = pathname.startsWith('/profile');

  // These pages should not have the generic mobile header
  const mobileHeaderExclusions = ['/wallet/coins', '/party', '/', '/profile', '/agent', '/profile/edit'];
  const useMobileHeader = !mobileHeaderExclusions.some(p => pathname.startsWith(p));
  
  return (
    <SidebarProvider>
      {/* Desktop Sidebar */}
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Gift className="w-8 h-8 text-primary neon-purple" />
              <h2 className="font-headline text-xl font-bold text-primary neon-purple">
                EchoLive
              </h2>
            </Link>
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {desktopNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === "/"
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenu>
              {loading ? (
                <SidebarMenuSkeleton showIcon />
              ) : user ? (
                 <>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Profile">
                        <Link href="/profile">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src={user.photoURL || undefined} />
                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>{user.displayName || user.email}</span>
                        </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={handleLogout} tooltip="Log out">
                            <LogOut />
                            <span>Log out</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                 </>
               ) : (
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Login">
                      <Link href="/login">
                        <LogIn />
                        <span>Login</span>
                      </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
               )}
           </SidebarMenu>
          <div className="flex items-center justify-center gap-2 group-data-[collapsible=icon]:hidden">
            {socialLinks.map((item) => (
              <Button key={item.label} variant="ghost" size="icon" asChild>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Main Content Area */}
      <SidebarInset>
        <div className={cn(
            "flex-grow flex flex-col h-screen", 
            "pb-16 md:pb-0",
            isProfilePage && "pb-20 md:pb-0"
        )}>
            {isAgentPage && <AgentHeader />}
            {useMobileHeader && <MobileHeader />}

            <div className="flex-grow h-0 overflow-y-auto">
                {loading ? (
                    <div className="flex h-full w-full items-center justify-center bg-background">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
        
        {!loading && useMainLayout && <BottomNavbar />}
      </SidebarInset>
    </SidebarProvider>
  );
}
