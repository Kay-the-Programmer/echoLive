import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, ShoppingBag, Gem, Crown } from "lucide-react";

const shopSections = [
    {
        title: "Coin Shop",
        description: "Stock up on coins for gifts and more.",
        href: "/shop/coins",
        icon: Gem,
        color: "text-amber-400"
    },
    {
        title: "VIP Memberships",
        description: "Unlock exclusive rooms and perks.",
        href: "/shop/vip",
        icon: Crown,
        color: "text-primary"
    },
    {
        title: "Guardian Tiers",
        description: "Show your elite status with a Guardian badge.",
        href: "/shop/guardian",
        icon: ShoppingBag,
        color: "text-accent"
    }
]

export default function ShopPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Shop"
        description="Your one-stop destination for all purchases."
      />

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {shopSections.map((section) => (
            <Link href={section.href} key={section.title}>
                <Card className="group bg-card hover:border-primary/50 transition-all">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                             <div>
                                <CardTitle className="font-headline text-xl flex items-center gap-2">
                                    <section.icon className={`h-6 w-6 ${section.color}`} />
                                    {section.title}
                                </CardTitle>
                                <CardDescription className="mt-1">{section.description}</CardDescription>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                        </div>
                    </CardHeader>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
