import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { placeholderImages } from "@/lib/data";
import { Swords, Shield, Trophy, Info } from "lucide-react";
import Image from "next/image";

export default function PkBattlesPage() {
  const pkImage = placeholderImages.find(p => p.id === 'stream-1');

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="PK Battles"
        description="Challenge other streamers and prove your might."
      />

      <div className="mt-8">
        <Card className="overflow-hidden">
            <div className="relative aspect-video">
                {pkImage && <Image src={pkImage.imageUrl} alt="PK Battle" fill className="object-cover" data-ai-hint={pkImage.imageHint} />}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                    <Swords className="h-24 w-24 text-primary opacity-50 drop-shadow-lg" />
                    <h2 className="font-headline text-6xl font-bold text-white text-glow absolute">
                        PK BATTLE
                    </h2>
                </div>
            </div>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-primary neon-purple">
                    <Swords />
                    The Challenge
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    PK (Player Kill) Battles are live competitions between two streamers. During the battle, viewers send gifts to their favorite streamer. The streamer who earns more points from gifts within the time limit wins the battle.
                </p>
            </CardContent>
        </Card>
         <Card className="border-green-500/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-green-400">
                    <Trophy />
                    Winning Streak Reward
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">
                    To celebrate true champions, a special reward is given for exceptional performance.
                </p>
                <p className="mt-4 text-2xl font-bold text-center text-green-400 text-glow">
                    Win 3 consecutive PK battles <br/> for +7,000 points!
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-accent neon-pink">
                    <Shield />
                    Rules of Engagement
                </CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                    <li>Battles have a set timer (e.g., 5 minutes).</li>
                    <li>Only gifts sent during the battle count towards the score.</li>
                    <li>The winner is determined by total points from gifts.</li>
                    <li>Winning streaks reset after a loss.</li>
                </ul>
            </CardContent>
        </Card>
      </div>

       <Card className="mt-8 bg-card/50 border-primary/20">
          <CardHeader>
            <CardTitle className="font-headline text-primary neon-purple">Fair Play Policy</CardTitle>
          </CardHeader>
          <CardContent>
             <p className="flex items-start gap-2 text-muted-foreground">
              <Info className="h-4 w-4 mt-1 shrink-0"/>
              <span>All PK Battle results are reviewed to ensure fairness. Any attempt to manipulate results may lead to disqualification from rewards and other penalties. <strong className="text-foreground">Terms & Conditions apply.</strong></span>
            </p>
          </CardContent>
        </Card>

    </div>
  );
}
