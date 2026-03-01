

export type User = {
  id: string;
  numericId?: string;
  name: string;
  email?: string;
  avatarUrl: string;
  level: number;
  wealthLevel: number;
  countryCode: string;
  coinBalance?: number;
  pointBalance?: number;
  unconfirmedPoints?: number;
  totalCoinsSpent?: number;
  totalPointsEarned?: number;
  isAdmin?: boolean;
  isOwner?: boolean;
  isAgent?: boolean;
  hasTreasuryAccess?: boolean;
  agentRequestStatus?: 'pending' | 'approved' | 'rejected';
  agentRequestDate?: string;
  gender?: 'male' | 'female';
  vip?: {
    tier: string;
    activationDate: string;
    expiryDate: string;
  };
  guardian?: {
    tier: string;
    activationDate: string;
    expiryDate: string;
  };
  registrationDate: string;
  photoWall?: (string | null)[];
  coverImageUrl?: string;
  coverImageOffsetY?: number;
  followingCount?: number;
  followerCount?: number;
  friendCount?: number;
  visitorCount?: number;
  selfIntroduction?: string;
  securityPasswordSet?: boolean;
  paymentMethods?: { [key: string]: string };
  livestreamPoints?: number;
  partyPoints?: number;
  commissionPoints?: number;
  transferPoints?: number;
  platformRewardPoints?: number;
  completedMissions?: string[];
  lastMissionsReset?: string;
  invitedBy?: string;
};

export type PartyRoom = {
  id: string;
  title: string;
  roomType: string;
  capacity: number;
  isLive: boolean;
  userIds: string[];
  seats: { [key: string]: string | null };
};

export type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'payout_failed';
  withdrawalDate: string;
  paymentMethod: string;
  paymentAddress: string;
  payoutTransactionId?: string;
  payoutError?: string;
};

export type Violation = {
  id: string;
  userId: string;
  ruleTitle: string;
  violationDate: string; // ISO date string
  reportingAdminId: string;
  notes?: string;
};

export type Stream = {
  id: string;
  title: string;
  user: User;
  thumbnailUrl: string;
  viewerCount: number;
  tags: string[];
  isPartyRoom: boolean;
  category: string;
  isTop10?: boolean;
  isLive?: boolean;
};

export type CoinPackage = {
  id: string;
  price: number;
  coins: number;
};

export type VIPLevel = {
  id: string;
  name: string;
  seatAccess: number;
  price?: number;
  perks: string[];
};

export type GuardianTier = {
  id: string;
  name: string;
  price: number;
  perks: string[];
};

export type Transaction = {
  id: string;
  userId: string;
  transactionType: "purchase" | "gift_sent" | "gift_received" | "withdrawal" | "exchange";
  amount: number;
  timestamp: string; // ISO date string
  details: string;
  price?: number; // USD price for purchases
};

export type Mission = {
  id: string;
  title: string;
  description: string;
  reward: number | string;
  completed: boolean;
  gender?: 'male' | 'female';
  tier?: 'Silver VIP' | 'Golden VIP' | 'Diamond VIP' | 'Premium VIP' | 'Guardian of Silver' | 'Guardian of Gold' | 'Guardian of Diamond' | 'Guardian of Masters';
  type?: 'daily' | 'vip' | 'guardian' | 'special';
};

export type Gift = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: 'Gift' | 'Lucky' | 'Fun Club' | 'Privilege' | 'Fun' | 'Custom';
  badges?: { text: string; color: string; }[];
};

export type LeaderboardEntry = {
  rank: number;
  user: User;
  value: string;
};

export type Badge = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export type LevelInfo = {
  type: 'Livestream Level' | 'Wealth Level';
  description: string;
  factors: string[];
}

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
};

export type GlobalBalance = {
  id: 'singleton';
  totalUsdRevenue: number;
  updatedAt?: string;
}

export type Admin = {
  id: string;
  grantedAt: string; // ISO date string
}

export type AppOwner = {
  id: string;
  assignedAt: string; // ISO date string
}

export type TreasuryAccess = {
  id: string;
  grantedAt: string;
}
