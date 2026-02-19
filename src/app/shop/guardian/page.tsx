import { PageHeader } from "@/components/shared/page-header";
import { guardianTiers } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Shield } from "lucide-react";

const tierColors = {
  "Guardian of Silver": "border-gray-400 text-gray-300",
  "Guardian of Gold": "border-amber-400 text-amber-300",
  "Guardian of Diamond": "border-sky-400 text-sky-300",
  "Guardian of Masters": "border-primary text-primary",
};

export default function GuardianPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Guardian System"
        description="Become a Guardian to unlock exclusive perks and show your elite status."
      />
      
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {guardianTiers.map((tier) => (
          <Card key={tier.id} className={`flex flex-col bg-card/80 border-2 ${tierColors[tier.name as keyof typeof tierColors]} shadow-lg shadow-black/30`}>
            <CardHeader className="text-center">
              <Shield className={`mx-auto h-12 w-12 ${tierColors[tier.name as keyof typeof tierColors]}`} />
              <CardTitle className={`font-headline text-2xl pt-2 ${tierColors[tier.name as keyof typeof tierColors]}`}>
                {tier.name}
              </CardTitle>
               <CardDescription>One-time Purchase</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-3 pt-0">
               <div className="my-4 text-center">
                    <span className="text-4xl font-bold">${tier.price}</span>
                    <span className="text-sm text-muted-foreground">/one-time</span>
                </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {tier.perks.map(perk => (
                  <li key={perk} className="flex items-start gap-2">
                    <Check className="h-5 w-4 mt-px text-green-500 shrink-0" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" className="w-full font-bold">Become a Guardian</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
