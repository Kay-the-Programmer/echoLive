'use client';

import Link from 'next/link';
import { useAuth } from '@/firebase';
import type { User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  AgentIcon,
  AddHostIcon,
  InviteAgentIcon,
  CoinsTradingIcon,
  AgentRewardIcon,
  AgentRankingIcon,
  DiamondAgentIcon,
  AgentActivitiesIcon,
} from '@/components/agent-icons';
import { OIcon, FacebookIcon, YouTubeIcon } from '@/components/icons';
import {
  BarChart3,
  HelpCircle,
  Briefcase,
  Layers,
  Backpack,
  Fingerprint,
  LogOut,
  Heart,
  ChevronRight,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

const AgentGridItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <Link href="#" className="flex flex-col items-center gap-1.5 text-center">
        <Icon className="h-12 w-12" />
        <span className="text-xs text-muted-foreground">{label}</span>
    </Link>
);

const AgentListItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <Link href="#" className="flex items-center gap-2">
        <Icon className="h-6 w-6" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </Link>
);

const SettingsItem = ({ href, icon: Icon, label, children }: { href: string, icon: React.ElementType, label: string, children?: React.ReactNode }) => (
    <Link href={href} className="flex items-center p-3 text-foreground">
        <Icon className="h-5 w-5 mr-3 text-muted-foreground" />
        <span className="flex-grow">{label}</span>
        <div className="flex items-center text-muted-foreground">
            {children}
            <ChevronRight className="h-5 w-5" />
        </div>
    </Link>
);

export function AgentAndSettingsMenu({ user }: { user: User }) {
  const auth = useAuth();
  const router = useRouter();

  if (!user.isAgent && !user.isAdmin) {
    return null;
  }
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div className="flex flex-col space-y-4">
      <Card className="bg-primary/5 border-primary/10 p-4 rounded-lg">
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
          <h3 className="font-bold text-lg">Agent</h3>
          <div className="flex items-center gap-2">
            {user.isAdmin && (
                <Button variant="outline" size="sm" className="border-primary/50 text-primary h-7 px-2" asChild>
                    <Link href="/admin"><OIcon className="mr-1.5 h-3 w-3" />Admin Panel</Link>
                </Button>
            )}
            <Link href="/agent" className="text-xs text-muted-foreground flex items-center">
                All <ChevronRight className="h-4 w-4"/>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-y-4 mb-6">
            <AgentGridItem icon={AgentIcon} label="Agent" />
            <AgentGridItem icon={AddHostIcon} label="Add Host" />
            <AgentGridItem icon={InviteAgentIcon} label="Invite Agent" />
            <AgentGridItem icon={CoinsTradingIcon} label="Coins Trading" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <AgentListItem icon={AgentRewardIcon} label="Agent Reward" />
            <AgentListItem icon={AgentRankingIcon} label="Agent Ranking" />
            <AgentListItem icon={DiamondAgentIcon} label="Diamond Agent" />
            <AgentListItem icon={AgentActivitiesIcon} label="Agent Activities" />
        </div>
      </Card>
      
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-sky-400 p-3 text-center text-white font-semibold text-sm relative">
        <p>IF YOU HAVE ANY QUESTIONS</p>
        <p>PLEASE CONTACT US IMMEDIATELY</p>
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="h-1 w-3 rounded-full bg-white"></span>
            <span className="h-1 w-1 rounded-full bg-white/50"></span>
            <span className="h-1 w-1 rounded-full bg-white/50"></span>
            <span className="h-1 w-1 rounded-full bg-white/50"></span>
            <span className="h-1 w-1 rounded-full bg-white/50"></span>
        </div>
      </div>
      
      <Card className="p-0 rounded-lg">
         <div className="divide-y divide-border">
            <SettingsItem href="#" icon={BarChart3} label="Live data" />
            <SettingsItem href="/help" icon={HelpCircle} label="Help">
                <span className="text-xs mr-1">24h</span>
            </SettingsItem>
            <SettingsItem href="/agent" icon={Briefcase} label="Agent Panel" />
            <SettingsItem href="/levels" icon={Layers} label="Level" />
            <SettingsItem href="#" icon={Backpack} label="Backpack" />
            <SettingsItem href="#" icon={Fingerprint} label="Auth" />
            <div className="flex items-center p-3 text-red-500 cursor-pointer" onClick={handleLogout}>
                <LogOut className="h-5 w-5 mr-3" />
                <span className="flex-grow">Log Out</span>
            </div>
            <SettingsItem href="#" icon={Heart} label="Follow Us">
                <div className="flex items-center gap-2 mr-2">
                    <FacebookIcon className="h-5 w-5" />
                    <YouTubeIcon className="h-5 w-5" />
                </div>
            </SettingsItem>
         </div>
      </Card>
    </div>
  );
}
