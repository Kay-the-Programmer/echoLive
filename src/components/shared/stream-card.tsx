import Image from "next/image";
import Link from "next/link";
import { Stream } from "@/lib/types";
import { cn, formatViewerCount } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Flame } from "lucide-react";
import { FlagIcon } from "../icons";

type StreamCardProps = {
  stream: Stream;
  className?: string;
};

export function StreamCard({ stream, className }: StreamCardProps) {
  const href = stream.isPartyRoom ? `/party/${stream.id}` : '#';

  return (
    <Link href={href} className={cn("relative block w-full overflow-hidden rounded-lg group aspect-square", className)}>
      <Image
        src={stream.thumbnailUrl}
        alt={stream.title}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        data-ai-hint="live stream"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      <div className="absolute top-2 left-2 flex items-start gap-1 text-white text-xs z-10">
        {stream.isPartyRoom && (
          <Badge variant="secondary" className="bg-pink-500/80 border-0 text-white">Party</Badge>
        )}
        {stream.isTop10 && (
          <Badge variant="secondary" className="bg-yellow-500/80 border-0 text-white">Top 10</Badge>
        )}
      </div>

      <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                <p className="font-semibold truncate">{stream.user.name}</p>
                <FlagIcon code={stream.user.countryCode} className="h-4 w-4 rounded-sm" />
            </div>
            <div className="flex items-center gap-1">
                <span className="text-xs">..</span>
                <span>{formatViewerCount(stream.viewerCount)}</span>
            </div>
        </div>
      </div>
    </Link>
  );
}
