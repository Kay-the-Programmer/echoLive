'use client';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { ChevronUp, Plus, Moon, RefreshCw, Star, Crown, Sun, Gem, Leaf, Sprout, Droplets, Flame, Flower } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const wealthLevels = [
  { level: 1, cost: 0, color: 'bg-green-500', icon: ChevronUp },
  { level: 2, cost: 3000, color: 'bg-green-500', icon: ChevronUp },
  { level: 3, cost: 6000, color: 'bg-green-500', icon: ChevronUp },
  { level: 4, cost: 16000, color: 'bg-green-500', icon: ChevronUp },
  { level: 5, cost: 66000, color: 'bg-yellow-500', icon: Plus },
  { level: 6, cost: 166000, color: 'bg-yellow-500', icon: Plus },
  { level: 7, cost: 330000, color: 'bg-yellow-500', icon: Plus },
  { level: 8, cost: 500000, color: 'bg-yellow-500', icon: Plus },
  { level: 9, cost: 700000, color: 'bg-yellow-500', icon: Plus },
  { level: 10, cost: 1000000, color: 'bg-orange-500', icon: Moon },
  { level: 11, cost: 1100000, color: 'bg-orange-500', icon: Moon },
  { level: 12, cost: 1300000, color: 'bg-orange-500', icon: Moon },
  { level: 13, cost: 1600000, color: 'bg-orange-500', icon: Moon },
  { level: 14, cost: 2000000, color: 'bg-orange-500', icon: Moon },
  { level: 15, cost: 2600000, color: 'bg-orange-500', icon: Moon },
  { level: 16, cost: 3400000, color: 'bg-orange-500', icon: Moon },
  { level: 17, cost: 4400000, color: 'bg-orange-500', icon: Moon },
  { level: 18, cost: 5600000, color: 'bg-orange-500', icon: Moon },
  { level: 19, cost: 7000000, color: 'bg-orange-500', icon: Moon },
  { level: 20, cost: 10000000, color: 'bg-orange-500', icon: Moon },
  { level: 21, cost: 10500000, color: 'bg-red-500', icon: RefreshCw },
  { level: 22, cost: 11500000, color: 'bg-red-500', icon: RefreshCw },
  { level: 23, cost: 13000000, color: 'bg-red-500', icon: RefreshCw },
  { level: 24, cost: 15000000, color: 'bg-red-500', icon: RefreshCw },
  { level: 25, cost: 18000000, color: 'bg-red-500', icon: RefreshCw },
  { level: 26, cost: 22000000, color: 'bg-red-500', icon: RefreshCw },
  { level: 27, cost: 27000000, color: 'bg-red-500', icon: RefreshCw },
  { level: 28, cost: 33000000, color: 'bg-red-500', icon: RefreshCw },
  { level: 29, cost: 40000000, color: 'bg-red-500', icon: RefreshCw },
  { level: 30, cost: 50000000, color: 'bg-pink-500', icon: Star },
  { level: 31, cost: 52000000, color: 'bg-pink-500', icon: Star },
  { level: 32, cost: 55000000, color: 'bg-pink-500', icon: Star },
  { level: 33, cost: 60000000, color: 'bg-pink-500', icon: Star },
  { level: 34, cost: 68000000, color: 'bg-pink-500', icon: Star },
  { level: 35, cost: 79000000, color: 'bg-pink-500', icon: Star },
  { level: 36, cost: 95000000, color: 'bg-pink-500', icon: Star },
  { level: 37, cost: 114000000, color: 'bg-pink-500', icon: Star },
  { level: 38, cost: 137000000, color: 'bg-pink-500', icon: Star },
  { level: 39, cost: 163000000, color: 'bg-pink-500', icon: Star },
  { level: 40, cost: 200000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 41, cost: 204000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 42, cost: 210000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 43, cost: 220000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 44, cost: 236000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 45, cost: 258000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 46, cost: 290000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 47, cost: 328000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 48, cost: 375000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 49, cost: 428000000, color: 'bg-fuchsia-500', icon: Sun },
  { level: 50, cost: 500000000, color: 'bg-purple-500', icon: Crown },
  { level: 51, cost: 506000000, color: 'bg-purple-500', icon: Crown },
  { level: 52, cost: 516000000, color: 'bg-purple-500', icon: Crown },
  { level: 53, cost: 535000000, color: 'bg-purple-500', icon: Crown },
  { level: 54, cost: 560000000, color: 'bg-purple-500', icon: Crown },
  { level: 55, cost: 598000000, color: 'bg-purple-500', icon: Crown },
  { level: 56, cost: 648000000, color: 'bg-purple-500', icon: Crown },
  { level: 57, cost: 710000000, color: 'bg-purple-500', icon: Crown },
  { level: 58, cost: 785000000, color: 'bg-purple-500', icon: Crown },
  { level: 59, cost: 870000000, color: 'bg-purple-500', icon: Crown },
  { level: 60, cost: 1000000000, color: 'bg-blue-500', icon: Gem },
  { level: 61, cost: 1020000000, color: 'bg-blue-500', icon: Gem },
  { level: 62, cost: 1060000000, color: 'bg-blue-500', icon: Gem },
  { level: 63, cost: 1120000000, color: 'bg-blue-500', icon: Gem },
  { level: 64, cost: 1220000000, color: 'bg-blue-500', icon: Gem },
  { level: 65, cost: 1360000000, color: 'bg-blue-500', icon: Gem },
  { level: 66, cost: 1560000000, color: 'bg-blue-500', icon: Gem },
  { level: 67, cost: 1800000000, color: 'bg-blue-500', icon: Gem },
  { level: 68, cost: 2100000000, color: 'bg-blue-500', icon: Gem },
  { level: 69, cost: 2440000000, color: 'bg-blue-500', icon: Gem },
  { level: 70, cost: 3000000000, color: 'bg-yellow-500', icon: Crown },
  { level: 71, cost: 3020000000, color: 'bg-yellow-500', icon: Crown },
  { level: 72, cost: 3060000000, color: 'bg-yellow-500', icon: Crown },
  { level: 73, cost: 3120000000, color: 'bg-yellow-500', icon: Crown },
  { level: 74, cost: 3220000000, color: 'bg-yellow-500', icon: Crown },
  { level: 75, cost: 3360000000, color: 'bg-yellow-500', icon: Crown },
  { level: 76, cost: 3560000000, color: 'bg-yellow-500', icon: Crown },
  { level: 77, cost: 3800000000, color: 'bg-yellow-500', icon: Crown },
  { level: 78, cost: 4100000000, color: 'bg-yellow-500', icon: Crown },
  { level: 79, cost: 4440000000, color: 'bg-yellow-500', icon: Crown },
  { level: 80, cost: 5000000000, color: 'bg-red-500', icon: Crown },
  { level: 81, cost: 5050000000, color: 'bg-red-500', icon: Crown },
  { level: 82, cost: 5150000000, color: 'bg-red-500', icon: Crown },
  { level: 83, cost: 5300000000, color: 'bg-red-500', icon: Crown },
  { level: 84, cost: 5550000000, color: 'bg-red-500', icon: Crown },
  { level: 85, cost: 5900000000, color: 'bg-red-500', icon: Crown },
  { level: 86, cost: 6400000000, color: 'bg-red-500', icon: Crown },
  { level: 87, cost: 7000000000, color: 'bg-red-500', icon: Crown },
  { level: 88, cost: 7750000000, color: 'bg-red-500', icon: Crown },
  { level: 89, cost: 8600000000, color: 'bg-red-500', icon: Crown },
  { level: 90, cost: 10000000000, color: 'bg-red-500', icon: Crown },
  { level: 91, cost: 10100000000, color: 'bg-red-500', icon: Crown },
  { level: 92, cost: 10300000000, color: 'bg-red-500', icon: Crown },
  { level: 93, cost: 10600000000, color: 'bg-red-500', icon: Crown },
  { level: 94, cost: 11100000000, color: 'bg-red-500', icon: Crown },
  { level: 95, cost: 11800000000, color: 'bg-red-500', icon: Crown },
  { level: 96, cost: 12800000000, color: 'bg-red-500', icon: Crown },
  { level: 97, cost: 14000000000, color: 'bg-red-500', icon: Crown },
  { level: 98, cost: 15500000000, color: 'bg-red-500', icon: Crown },
  { level: 99, cost: 17200000000, color: 'bg-red-500', icon: Crown },
  { level: 100, cost: 20600000000, color: 'bg-purple-500', icon: Crown },
  { level: 101, cost: 20710000000, color: 'bg-purple-500', icon: Crown },
  { level: 102, cost: 20930000000, color: 'bg-purple-500', icon: Crown },
  { level: 103, cost: 21260000000, color: 'bg-purple-500', icon: Crown },
  { level: 104, cost: 21810000000, color: 'bg-purple-500', icon: Crown },
  { level: 105, cost: 22580000000, color: 'bg-purple-500', icon: Crown },
  { level: 106, cost: 23680000000, color: 'bg-purple-500', icon: Crown },
  { level: 107, cost: 25000000000, color: 'bg-purple-500', icon: Crown },
  { level: 108, cost: 26650000000, color: 'bg-purple-500', icon: Crown },
  { level: 109, cost: 28520000000, color: 'bg-purple-500', icon: Crown },
  { level: 110, cost: 30200000000, color: 'bg-purple-500', icon: Crown },
  { level: 111, cost: 30320000000, color: 'bg-purple-500', icon: Crown },
  { level: 112, cost: 30560000000, color: 'bg-purple-500', icon: Crown },
  { level: 113, cost: 30920000000, color: 'bg-purple-500', icon: Crown },
  { level: 114, cost: 31520000000, color: 'bg-purple-500', icon: Crown },
  { level: 115, cost: 32360000000, color: 'bg-purple-500', icon: Crown },
  { level: 116, cost: 33560000000, color: 'bg-purple-500', icon: Crown },
  { level: 117, cost: 35000000000, color: 'bg-purple-500', icon: Crown },
  { level: 118, cost: 36800000000, color: 'bg-purple-500', icon: Crown },
  { level: 119, cost: 38840000000, color: 'bg-purple-500', icon: Crown },
  { level: 120, cost: 40688000000, color: 'bg-purple-500', icon: Crown },
  { level: 121, cost: 40820000000, color: 'bg-purple-500', icon: Crown },
  { level: 122, cost: 41084000000, color: 'bg-purple-500', icon: Crown },
  { level: 123, cost: 41480000000, color: 'bg-purple-500', icon: Crown },
  { level: 124, cost: 42140000000, color: 'bg-purple-500', icon: Crown },
  { level: 125, cost: 43064000000, color: 'bg-purple-500', icon: Crown },
  { level: 126, cost: 44384000000, color: 'bg-purple-500', icon: Crown },
  { level: 127, cost: 45968000000, color: 'bg-purple-500', icon: Crown },
  { level: 128, cost: 47948000000, color: 'bg-purple-500', icon: Crown },
  { level: 129, cost: 50192000000, color: 'bg-purple-500', icon: Crown },
  { level: 130, cost: 52208000000, color: 'bg-purple-500', icon: Crown },
  { level: 131, cost: 52352000000, color: 'bg-purple-500', icon: Crown },
  { level: 132, cost: 52640000000, color: 'bg-purple-500', icon: Crown },
  { level: 133, cost: 53072000000, color: 'bg-purple-500', icon: Crown },
  { level: 134, cost: 53792000000, color: 'bg-purple-500', icon: Crown },
  { level: 135, cost: 54800000000, color: 'bg-purple-500', icon: Crown },
  { level: 136, cost: 56240000000, color: 'bg-purple-500', icon: Crown },
  { level: 137, cost: 57968000000, color: 'bg-purple-500', icon: Crown },
  { level: 138, cost: 60128000000, color: 'bg-purple-500', icon: Crown },
  { level: 139, cost: 62576000000, color: 'bg-purple-500', icon: Crown },
  { level: 140, cost: 64793600000, color: 'bg-purple-500', icon: Crown },
  { level: 141, cost: 64952000000, color: 'bg-purple-500', icon: Crown },
  { level: 142, cost: 65268800000, color: 'bg-purple-500', icon: Crown },
  { level: 143, cost: 65744000000, color: 'bg-purple-500', icon: Crown },
  { level: 144, cost: 66536000000, color: 'bg-purple-500', icon: Crown },
  { level: 145, cost: 67644800000, color: 'bg-purple-500', icon: Crown },
  { level: 146, cost: 69228800000, color: 'bg-purple-500', icon: Crown },
  { level: 147, cost: 71129600000, color: 'bg-purple-500', icon: Crown },
  { level: 148, cost: 73505600000, color: 'bg-purple-500', icon: Crown },
  { level: 149, cost: 76198400000, color: 'bg-purple-500', icon: Crown },
  { level: 150, cost: 78617600000, color: 'bg-yellow-500', icon: Crown },
  { level: 151, cost: 78790400000, color: 'bg-yellow-500', icon: Crown },
  { level: 152, cost: 79136000000, color: 'bg-yellow-500', icon: Crown },
  { level: 153, cost: 79654400000, color: 'bg-yellow-500', icon: Crown },
  { level: 154, cost: 80518400000, color: 'bg-yellow-500', icon: Crown },
  { level: 155, cost: 81728000000, color: 'bg-yellow-500', icon: Crown },
  { level: 156, cost: 83456000000, color: 'bg-yellow-500', icon: Crown },
  { level: 157, cost: 85529600000, color: 'bg-yellow-500', icon: Crown },
  { level: 158, cost: 88121600000, color: 'bg-yellow-500', icon: Crown },
  { level: 159, cost: 91059200000, color: 'bg-yellow-500', icon: Crown },
  { level: 160, cost: 93720320000, color: 'bg-yellow-500', icon: Crown },
  { level: 161, cost: 93910400000, color: 'bg-yellow-500', icon: Crown },
  { level: 162, cost: 94290560000, color: 'bg-yellow-500', icon: Crown },
  { level: 163, cost: 94860800000, color: 'bg-yellow-500', icon: Crown },
  { level: 164, cost: 95811200000, color: 'bg-yellow-500', icon: Crown },
  { level: 165, cost: 97141760000, color: 'bg-yellow-500', icon: Crown },
  { level: 166, cost: 99042560000, color: 'bg-yellow-500', icon: Crown },
  { level: 167, cost: 101324000000, color: 'bg-yellow-500', icon: Crown },
  { level: 168, cost: 104174720000, color: 'bg-yellow-500', icon: Crown },
  { level: 169, cost: 107406080000, color: 'bg-yellow-500', icon: Crown },
  { level: 170, cost: 110309120000, color: 'bg-yellow-500', icon: Crown },
  { level: 171, cost: 110516480000, color: 'bg-yellow-500', icon: Crown },
  { level: 172, cost: 110931200000, color: 'bg-yellow-500', icon: Crown },
  { level: 173, cost: 111553280000, color: 'bg-yellow-500', icon: Crown },
  { level: 174, cost: 112590080000, color: 'bg-yellow-500', icon: Crown },
  { level: 175, cost: 114041600000, color: 'bg-yellow-500', icon: Crown },
  { level: 176, cost: 116115200000, color: 'bg-yellow-500', icon: Crown },
  { level: 177, cost: 118603520000, color: 'bg-yellow-500', icon: Crown },
  { level: 178, cost: 121713920000, color: 'bg-yellow-500', icon: Crown },
  { level: 179, cost: 125239040000, color: 'bg-yellow-500', icon: Crown },
  { level: 180, cost: 128432384000, color: 'bg-yellow-500', icon: Crown },
  { level: 181, cost: 128660480000, color: 'bg-yellow-500', icon: Crown },
  { level: 182, cost: 129116672000, color: 'bg-yellow-500', icon: Crown },
  { level: 183, cost: 129800960000, color: 'bg-yellow-500', icon: Crown },
  { level: 184, cost: 130941440000, color: 'bg-yellow-500', icon: Crown },
  { level: 185, cost: 132538112000, color: 'bg-yellow-500', icon: Crown },
  { level: 186, cost: 134819072000, color: 'bg-yellow-500', icon: Crown },
  { level: 187, cost: 137556224000, color: 'bg-yellow-500', icon: Crown },
  { level: 188, cost: 140977664000, color: 'bg-yellow-500', icon: Crown },
  { level: 189, cost: 144855296000, color: 'bg-yellow-500', icon: Crown },
  { level: 190, cost: 148338944000, color: 'bg-yellow-500', icon: Crown },
  { level: 191, cost: 148587776000, color: 'bg-yellow-500', icon: Crown },
  { level: 192, cost: 149085440000, color: 'bg-yellow-500', icon: Crown },
  { level: 193, cost: 149831936000, color: 'bg-yellow-500', icon: Crown },
  { level: 194, cost: 151076096000, color: 'bg-yellow-500', icon: Crown },
  { level: 195, cost: 152817920000, color: 'bg-yellow-500', icon: Crown },
  { level: 196, cost: 155306240000, color: 'bg-yellow-500', icon: Crown },
  { level: 197, cost: 158292224000, color: 'bg-yellow-500', icon: Crown },
  { level: 198, cost: 162024704000, color: 'bg-yellow-500', icon: Crown },
  { level: 199, cost: 166254848000, color: 'bg-yellow-500', icon: Crown },
  { label: '200 MAX', level: 200, cost: 170086860800, color: 'bg-yellow-500', icon: Crown },
];

const livestreamLevels = [
    { level: 1, points: 0, color: 'bg-green-400', icon: Leaf },
    { level: 2, points: 10000, color: 'bg-green-400', icon: Leaf },
    { level: 3, points: 70000, color: 'bg-green-400', icon: Leaf },
    { level: 4, points: 250000, color: 'bg-green-400', icon: Leaf },
    { level: 5, points: 630000, color: 'bg-teal-400', icon: Sprout },
    { level: 6, points: 1410000, color: 'bg-teal-400', icon: Sprout },
    { level: 7, points: 3010000, color: 'bg-teal-400', icon: Sprout },
    { level: 8, points: 5710000, color: 'bg-teal-400', icon: Sprout },
    { level: 9, points: 10310000, color: 'bg-teal-400', icon: Sprout },
    { level: 10, points: 18110000, color: 'bg-cyan-400', icon: Droplets },
    { level: 11, points: 31010000, color: 'bg-cyan-400', icon: Droplets },
    { level: 12, points: 52010000, color: 'bg-cyan-400', icon: Droplets },
    { level: 13, points: 85010000, color: 'bg-cyan-400', icon: Droplets },
    { level: 14, points: 137010000, color: 'bg-cyan-400', icon: Droplets },
    { level: 15, points: 214010000, color: 'bg-blue-400', icon: Droplets },
    { level: 16, points: 323010000, color: 'bg-blue-400', icon: Droplets },
    { level: 17, points: 492010000, color: 'bg-blue-400', icon: Droplets },
    { level: 18, points: 741010000, color: 'bg-blue-400', icon: Droplets },
    { level: 19, points: 1100010000, color: 'bg-blue-400', icon: Droplets },
    { level: 20, points: 1689010000, color: 'bg-orange-400', icon: Flame },
    { level: 21, points: 2528010000, color: 'bg-orange-400', icon: Flame },
    { level: 22, points: 3637010000, color: 'bg-orange-400', icon: Flame },
    { level: 23, points: 5137010000, color: 'bg-orange-400', icon: Flame },
    { level: 24, points: 7337010000, color: 'bg-orange-400', icon: Flame },
    { level: 25, points: 10137010000, color: 'bg-pink-400', icon: Flower },
    { level: 26, points: 14137010000, color: 'bg-pink-400', icon: Flower },
    { level: 27, points: 19137010000, color: 'bg-pink-400', icon: Flower },
    { level: 28, points: 30000000000, color: 'bg-pink-400', icon: Flower },
    { level: 29, points: 45000000000, color: 'bg-pink-400', icon: Flower },
    { level: 30, points: 60000000000, color: 'bg-red-500', icon: Sun },
    { level: 31, points: 80000000000, color: 'bg-red-500', icon: Sun },
    { level: 32, points: 100000000000, color: 'bg-red-500', icon: Sun },
    { level: 33, points: 130000000000, color: 'bg-red-500', icon: Sun },
    { level: 34, points: 160000000000, color: 'bg-red-500', icon: Sun },
    { level: 35, points: 200000000000, color: 'bg-purple-500', icon: Gem },
];


const LevelBadge = ({
  level,
  label,
  color,
  icon: Icon,
}: {
  level: number;
  label?: string;
  color: string;
  icon: React.ElementType;
}) => (
  <Badge
    className={cn(
      'flex items-center gap-1 w-20 justify-center text-white text-xs font-bold border-none',
      color
    )}
  >
    <Icon className="h-3 w-3" />
    <span>{label ?? level}</span>
  </Badge>
);

export default function LevelsPage() {
  return (
    <div className="container mx-auto px-4 h-screen flex flex-col">
      <Tabs defaultValue="wealth" className="w-full flex flex-col h-full">
        <div className="sticky top-0 z-10 py-4 bg-background/80 backdrop-blur-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="wealth">Wealth level</TabsTrigger>
            <TabsTrigger value="livestream">Livestream level</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="wealth" className="mt-2 flex-grow overflow-hidden">
           <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Upgrade Coin Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wealthLevels.map((item) => (
                  <TableRow key={item.level}>
                    <TableCell>
                      <LevelBadge
                        level={item.level}
                        label={item.label}
                        color={item.color}
                        icon={item.icon}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {item.cost.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="livestream" className="mt-2 flex-grow overflow-hidden">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader className="sticky top-0 bg-background z-10">
                <TableRow>
                  <TableHead>Level</TableHead>
                  <TableHead className="text-right">Points required to upgrade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {livestreamLevels.map((item) => (
                  <TableRow key={item.level}>
                    <TableCell>
                      <LevelBadge
                        level={item.level}
                        color={item.color}
                        icon={item.icon}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono text-foreground">
                      {item.points.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
