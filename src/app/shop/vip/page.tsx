import { PageHeader } from "@/components/shared/page-header";
import { vipLevels } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Crown } from "lucide-react";

const tierColors = {
  "Silver VIP": "border-gray-400 text-gray-300",
  "Golden VIP": "border-amber-400 text-amber-300",
  "Diamond VIP": "border-sky-400 text-sky-300",
  "Premium VIP": "border-primary text-primary",
};

export default function VipPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="VIP System"
        description="Upgrade to VIP for an enhanced experience and exclusive access."
      />
      
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {vipLevels.map((level) => (
          <Card key={level.id} className={`flex flex-col bg-card/80 border-2 ${tierColors[level.name as keyof typeof tierColors]} shadow-lg shadow-black/30`}>
            <CardHeader className="text-center">
              <Crown className={`mx-auto h-12 w-12 ${tierColors[level.name as keyof typeof tierColors]}`} />
              <CardTitle className={`font-headline text-2xl pt-2 ${tierColors[level.name as keyof typeof tierColors]}`}>
                {level.name}
              </CardTitle>
               <CardDescription>Unlocks {level.seatAccess}-Seat Party Rooms</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 pt-0">
               <div className="my-4 text-center">
                    <span className="text-4xl font-bold">${level.price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {level.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2">
                    <Check className="h-5 w-4 mt-px text-green-500 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full font-bold">Upgrade to VIP</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <Card className="mt-8 bg-card/50">
        <CardHeader>
          <CardTitle className="font-headline text-accent">Crown Seat Rules</CardTitle>
          <CardDescription>Special rules apply to Crown Seats in party rooms.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-bold text-foreground">VIP & 9/4-Seat Rooms</h4>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                <li><strong className="text-foreground">VIP Rooms (16, 21, 25, 35):</strong> Any seat used by a female user automatically becomes a crown seat. When she leaves, it returns to normal.</li>
                <li><strong className="text-foreground">4 & 9-Seat Rooms:</strong> Seats are predefined as crown seats.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground">Rewards & Penalties</h4>
             <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                <li><strong className="text-green-400">Female user on crown seat (1 hour):</strong> +900 points.</li>
                <li><strong className="text-green-400">Female user on crown seat (2 hours):</strong> +950 points.</li>
                 <li><strong className="text-amber-400">Male user on any seat (30 mins):</strong> +460 coins.</li>
                 <li><strong className="text-amber-400">Male user on any seat (1 hour):</strong> +500 coins.</li>
                <li><strong className="text-red-400">Male user on crown seat (4/9-seat rooms):</strong> -1 point every 10 seconds.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
