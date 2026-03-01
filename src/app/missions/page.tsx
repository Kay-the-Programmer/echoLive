'use client';

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from "@/components/shared/page-header";
import { missions as staticMissions } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Info, Crown, Gem, Clock, Gift } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Mission, User } from "@/lib/types";
import { useUser, useDoc, useFirestore } from "@/firebase";
import { getZambianDayStart, getNextZambianReset } from "@/lib/date-utils";
import { doc, updateDoc, increment, arrayUnion, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';

const MissionCard = ({
  mission,
  onClaim,
  isClaiming
}: {
  mission: Mission & { claimable?: boolean };
  onClaim?: (id: string, reward: number | string) => void;
  isClaiming?: boolean;
}) => {
  const isSpecial = mission.type === 'special';
  const isVip = mission.type === 'vip';
  const isGuardian = mission.type === 'guardian';

  const cardBorderColor = isVip
    ? "border-amber-500/30"
    : isGuardian
      ? "border-purple-500/30"
      : "border-primary/30";

  const iconColor = isVip
    ? "text-amber-500"
    : isGuardian
      ? "text-purple-500"
      : "text-primary";

  const icon = isVip ? <Crown className={cn("h-5 w-5", iconColor)} /> : isGuardian ? <Gem className={cn("h-5 w-5", iconColor)} /> : <Star className={cn("h-5 w-5", iconColor)} />;

  return (
    <Card
      key={mission.id}
      className={cn("bg-card transition-all h-full flex flex-col", cardBorderColor, mission.claimable && "ring-1 ring-primary")}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-base">
          {icon}
          {mission.title}
          {mission.gender === 'female' && <Badge variant="outline" className="border-pink-400 text-pink-500 text-[10px]">Female</Badge>}
          {mission.gender === 'male' && <Badge variant="outline" className="border-blue-400 text-blue-500 text-[10px]">Male</Badge>}
        </CardTitle>
        <CardDescription className="text-xs line-clamp-2">{mission.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center mt-auto">
        <div className="mb-4">
          <p className="text-[10px] text-muted-foreground">Reward</p>
          <p className="text-xl font-medium text-primary">
            {mission.reward.toLocaleString()}
          </p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                className="w-full h-9 text-xs"
                variant={mission.completed ? "outline" : (mission.claimable ? "default" : "secondary")}
                disabled={mission.completed || (!mission.claimable && !onClaim) || isClaiming}
                onClick={() => mission.claimable && onClaim?.(mission.id, mission.reward)}
              >
                {mission.completed ? (
                  <>
                    <Check className="mr-2 h-3 w-3" />
                    Claimed
                  </>
                ) : (
                  mission.claimable ? "Claim Now!" : "Claim Reward"
                )}
              </Button>
            </div>
          </TooltipTrigger>
          {!mission.completed && !mission.claimable && (
            <TooltipContent>
              <p>Complete the mission to claim.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </CardContent>
    </Card>
  );
};

export default function MissionsPage() {
  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isClaiming, setIsClaiming] = useState<string | null>(null);

  const userPath = useMemo(() => authUser ? `users/${authUser.uid}` : null, [authUser]);
  const { data: user } = useDoc<User>(userPath);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const zambianReset = useMemo(() => getNextZambianReset(currentTime), [currentTime]);
  const dayStart = useMemo(() => getZambianDayStart(currentTime), [currentTime]);

  // Derived user missions state
  const completedMissions = user?.completedMissions || [];
  const lastResetTime = user?.lastMissionsReset || "";

  // Logic to simulate "online time" for testing or use real session time
  const minutesToday = 65;

  const timeRewards = [
    { id: 'time_1hr', title: '1 Hour Stay', description: `Stay active for 60 minutes today.`, reward: APP_CONFIG.REWARD_1HR_STAY_POINTS, requiredMins: 60 },
    { id: 'time_2hr', title: '2 Hour Stay', description: `Stay active for 120 minutes today.`, reward: APP_CONFIG.REWARD_2HR_STAY_POINTS, requiredMins: 120 },
  ];

  const handleClaim = async (missionId: string, reward: number | string) => {
    if (!authUser || !firestore) return;

    setIsClaiming(missionId);
    try {
      const userRef = doc(firestore, 'users', authUser.uid);
      await updateDoc(userRef, {
        pointBalance: increment(Number(reward)),
        totalPointsEarned: increment(Number(reward)),
        completedMissions: arrayUnion(missionId),
        lastMissionsReset: dayStart.toISOString()
      });
      toast({ title: "Success!", description: `Claimed ${reward.toLocaleString()} points.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Claim Failed", description: e.message });
    } finally {
      setIsClaiming(null);
    }
  };

  const dailyMissions = staticMissions.filter(m => m.type === 'daily' || !m.type).map(m => ({
    ...m,
    completed: completedMissions.includes(m.id) && lastResetTime === dayStart.toISOString()
  }));

  const rewards = timeRewards.map(r => ({
    ...r,
    type: 'daily' as const,
    completed: completedMissions.includes(r.id) && lastResetTime === dayStart.toISOString(),
    claimable: minutesToday >= r.requiredMins && !(completedMissions.includes(r.id) && lastResetTime === dayStart.toISOString())
  }));

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8 pb-24">
        <PageHeader
          title="Missions & Rewards"
          description="Complete tasks to earn exclusive rewards."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <Card className="bg-card/50 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                Zambian Time Reset
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl font-bold">{formatDistanceToNow(zambianReset)} left</p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Rewards reset at 18:00 Zambian Time (16:00 UTC).
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-sm flex items-center gap-2">
                <Gift className="h-4 w-4 text-amber-500" />
                Important Notice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Rewards not collected by <strong>17:59 PM</strong> ZM will be lost. You must claim them manually.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <h2 className="font-headline text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Live Stay Rewards
            <Badge variant="secondary" className="ml-2">Manual Claim</Badge>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {rewards.map((r) => (
              <MissionCard
                key={r.id}
                mission={r}
                onClaim={handleClaim}
                isClaiming={isClaiming === r.id}
              />
            ))}
          </div>
        </div>

        {dailyMissions.length > 0 && (
          <div className="mt-12">
            <h2 className="font-headline text-xl font-bold mb-4">Daily Tasks</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dailyMissions.map((mission) => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
