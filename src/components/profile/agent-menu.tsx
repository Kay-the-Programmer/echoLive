
'use client';

import Link from 'next/link';
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
import { OIcon } from '@/components/icons';
import { ChevronRight } from 'lucide-react';
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

export function AgentMenu({ user }: { user: User | null }) {
  if (!user || (!user.isAgent && !user.isAdmin)) {
    return null;
  }
  
  return (
      <Card className="bg-primary/5 border-primary/10 p-4">
        <div className="flex items-center justify-between mb-4">
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
  );
}
