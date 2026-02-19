import Image from "next/image";
import { PageHeader } from "@/components/shared/page-header";
import {
  wealthLeaderboard,
  livestreamLeaderboard,
} from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown } from "lucide-react";

export default function LeaderboardsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Leaderboards"
        description="See who's topping the charts in EchoLive."
      />

      <Tabs defaultValue="wealth" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 mx-auto">
          <TabsTrigger value="wealth">Wealth</TabsTrigger>
          <TabsTrigger value="livestream">Livestream</TabsTrigger>
        </TabsList>

        <TabsContent value="wealth" className="mt-6">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%] text-center">Rank</TableHead>
                <TableHead className="w-[60%]">User</TableHead>
                <TableHead className="w-[25%] text-right">Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wealthLeaderboard.map((entry, index) => (
                <TableRow key={entry.rank}>
                  <TableCell className="text-center font-bold text-lg">
                    {index === 0 ? <Crown className="w-6 h-6 mx-auto text-amber-400" /> : entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 truncate">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={entry.user.avatarUrl} alt={entry.user.name} />
                        <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate">{entry.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-accent neon-pink truncate">{entry.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="livestream" className="mt-6">
           <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%] text-center">Rank</TableHead>
                <TableHead className="w-[60%]">User</TableHead>
                <TableHead className="w-[25%] text-right">Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {livestreamLeaderboard.map((entry, index) => (
                <TableRow key={entry.rank}>
                  <TableCell className="text-center font-bold text-lg">
                     {index === 0 ? <Crown className="w-6 h-6 mx-auto text-amber-400" /> : entry.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 truncate">
                      <Avatar className="flex-shrink-0">
                        <AvatarImage src={entry.user.avatarUrl} alt={entry.user.name} />
                        <AvatarFallback>{entry.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate">{entry.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-primary neon-purple truncate">{entry.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
