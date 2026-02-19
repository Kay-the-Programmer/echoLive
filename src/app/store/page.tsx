import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import { gifts } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Send } from "lucide-react";

export default function GiftStorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Gift Store"
        description="Send gifts to show your support for your favorite streamers."
      />

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {gifts.map((gift) => (
          <Card key={gift.id} className="group overflow-hidden bg-card text-center transition-all hover:shadow-primary/20 hover:shadow-lg">
            <CardContent className="p-4">
              <div className="relative aspect-square w-full">
                <Image
                  src={gift.imageUrl}
                  alt={gift.name}
                  fill
                  className="object-contain p-4 transition-transform group-hover:scale-110"
                  data-ai-hint={gift.name.toLowerCase()}
                />
              </div>
              <h3 className="mt-2 font-bold text-lg">{gift.name}</h3>
              <div className="flex items-center justify-center gap-1 text-amber-400">
                <Coins className="h-4 w-4" />
                <span className="font-semibold">{gift.price.toLocaleString()}</span>
              </div>
              <Button variant="secondary" size="sm" className="mt-4 w-full">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
