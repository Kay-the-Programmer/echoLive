
import {
  Home,
  Compass,
  Award,
  Swords,
  Store,
  Star,
  Trophy,
  ShoppingBag,
  Wallet,
  User,
  Github,
  Twitter,
  Bot,
  PartyPopper,
  MessageCircle,
  Tv,
  Shield,
  Film,
} from "lucide-react";
import { UserSquare } from 'lucide-react';

export const navItems = [
  { href: "/", label: "Home Feed", icon: Tv },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/party", label: "Party Rooms", icon: PartyPopper },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/pk-battles", label: "PK Battles", icon: Swords },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/missions", label: "Missions", icon: Star },
  { href: "/levels", label: "Levels", icon: Award },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
  { href: "/store", label: "Gift Store", icon: Store },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/agent", label: "Agent", icon: UserSquare },
  { href: "/admin", label: "Admin", icon: Shield },
  { href: "/profile", label: "Profile", icon: User },
];

export const bottomNavItems = [
  { href: "/", label: "Live", icon: Home },
  { href: "/party", label: "Party", icon: PartyPopper },
  { href: "/moments", label: "Moments", icon: Film },
  {
    href: "/messages",
    label: "Message",
    icon: MessageCircle,
  },
  { href: "/profile", label: "Me", icon: User },
];

export const socialLinks = [
    { href: "#", label: "GitHub", icon: Github },
    { href: "#", label: "Twitter", icon: Twitter },
]
