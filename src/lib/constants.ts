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
  UserSquare
} from "lucide-react";

/**
 * ECHO LIVE APP CONFIGURATION
 * ---------------------------
 * Edit these values to change rewards, conversion rates, and reset times.
 */
export const APP_CONFIG = {
  // REGISTRATION & DEFAULTS
  REGISTRATION_BONUS_POINTS: 1000,
  DEFAULT_COUNTRY: 'ZM', // Zambia

  // DAILY REWARDS (MANUAL CLAIM)
  REWARD_1HR_STAY_POINTS: 2000,
  REWARD_2HR_STAY_POINTS: 5000,

  // ZAMBIAN TIME RESET (18:00 ZM / 6:00 PM)
  // UTC+2 to UTC conversion: 18:00 ZM = 16:00 UTC
  RESET_HOUR_UTC: 16,
  RESET_MINUTE_UTC: 0,

  // PAYOUT CONVERSION RATES
  POINTS_PER_USD: 10000, // 10,000 pts = $1
  ZMW_PER_USD: 25,       // $1 = 25 ZMW

  // FEATURES
  SELF_GIFTING_ALLOWED: true,

  // INVITATION LINK BASE
  PRODUCTION_URL: 'https://echolive-app.vercel.app',
};

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
