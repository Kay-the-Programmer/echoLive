import { PageHeader } from "@/components/shared/page-header";
import { missions } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Info, Crown, Gem } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Mission } from "@/lib/types";

const MissionCard = ({ mission }: { mission: Mission }) => {
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
      className={cn("bg-card transition-all", cardBorderColor)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          {icon}
          {mission.title}
          {mission.gender === 'female' && <Badge variant="outline" className="border-pink-400 text-pink-500">Female only</Badge>}
          {mission.gender === 'male' && <Badge variant="outline" className="border-blue-400 text-blue-500">Male only</Badge>}
          {isVip && <Badge variant="outline" className="border-amber-400 text-amber-500">VIP</Badge>}
          {isGuardian && <Badge variant="outline" className="border-purple-400 text-purple-500">Guardian</Badge>}
        </CardTitle>
        <CardDescription>{mission.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center text-center">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Reward</p>
          <p className="text-2xl font-medium text-primary">
            {mission.reward}
          </p>
        </div>
        <Tooltip>
           <TooltipTrigger asChild>
            <div className="w-full">
              <Button
                className="w-full"
                variant={mission.completed ? "outline" : "secondary"}
                disabled={mission.completed}
              >
                {mission.completed ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Claimed
                  </>
                ) : (
                  "Claim Reward"
                )}
              </Button>
              </div>
          </TooltipTrigger>
          {!mission.completed && (
            <TooltipContent>
              <p>Complete the mission to claim.</p>
            </TooltipContent>
          )}
        </Tooltip>
      </CardContent>
    </Card>
  )
}

export default function MissionsPage() {
  const dailyMissions = missions.filter(m => m.type === 'daily' || !m.type);
  const vipMissions = missions.filter(m => m.type === 'vip');
  const guardianMissions = missions.filter(m => m.type === 'guardian');
  const specialMissions = missions.filter(m => m.type === 'special');
  
  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          title="Daily Missions"
          description="Complete tasks to earn exclusive rewards."
        />

        <Card className="mt-8 bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-primary neon-purple">Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="flex items-start gap-2 text-muted-foreground">
              <Info className="h-4 w-4 mt-1 shrink-0"/>
              <span>All rewards must be collected manually. Rewards not collected by <strong className="text-destructive-foreground">5:59 PM</strong> will be lost. Terms & Conditions apply.</span>
            </p>
          </CardContent>
        </Card>

        {dailyMissions.length > 0 && (
          <div className="mt-8">
            <h2 className="font-headline text-2xl font-bold mb-4">Daily Tasks</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {dailyMissions.map((mission) => <MissionCard key={mission.id} mission={mission} />)}
            </div>
          </div>
        )}
        
        {vipMissions.length > 0 && (
          <div className="mt-8">
            <h2 className="font-headline text-2xl font-bold mb-4 text-amber-500">VIP Rewards</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {vipMissions.map((mission) => <MissionCard key={mission.id} mission={mission} />)}
            </div>
          </div>
        )}
        
        {guardianMissions.length > 0 && (
          <div className="mt-8">
            <h2 className="font-headline text-2xl font-bold mb-4 text-purple-500">Guardian Rewards</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {guardianMissions.map((mission) => <MissionCard key={mission.id} mission={mission} />)}
            </div>
          </div>
        )}
        
        {specialMissions.length > 0 && (
          <div className="mt-8">
            <h2 className="font-headline text-2xl font-bold mb-4">Special Tasks</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {specialMissions.map((mission) => <MissionCard key={mission.id} mission={mission} />)}
            </div>
          </div>
        )}

      </div>
    </TooltipProvider>
  );
}
