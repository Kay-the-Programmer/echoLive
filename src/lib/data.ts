
export type {
  User,
  Stream,
  CoinPackage,
  VIPLevel,
  GuardianTier,
  Transaction,
  Mission,
  Gift,
  LeaderboardEntry,
  Badge,
  LevelInfo,
  Event,
  Violation,
} from "./types";

import type {
  User,
  Stream,
  CoinPackage,
  VIPLevel,
  GuardianTier,
  Transaction,
  Mission,
  Gift,
  LeaderboardEntry,
  Badge,
  LevelInfo,
  Event,
  Violation,
} from "./types";
import placeholderImagesData from './placeholder-images.json';
import { subDays, subHours } from 'date-fns';

export const { placeholderImages } = placeholderImagesData;

const findImage = (id: string) => placeholderImages.find(p => p.id === id)?.imageUrl || `https://picsum.photos/seed/${id}/300/400`;
const now = new Date('2024-07-15T12:00:00.000Z');

export const users: User[] = [
  { id: "u1", name: "evangelist.mattchi", avatarUrl: findImage('profile-gift-box'), numericId: '27047564', level: 1, wealthLevel: 1, countryCode: "US", registrationDate: subDays(now, 10).toISOString(), followingCount: 0, followerCount: 0, friendCount: 0, visitorCount: 0, isAdmin: true, isOwner: true, isAgent: true, coinBalance: 7192000, pointBalance: 460500 },
  { id: "u2", name: "CypherQueen", avatarUrl: findImage('avatar-2'), level: 120, wealthLevel: 140, countryCode: "GB", registrationDate: subDays(now, 5).toISOString(), followingCount: 200, followerCount: 5000, friendCount: 50, visitorCount: 1200, pointBalance: 500000 },
  { id: "u3", name: "GlitchMaster", avatarUrl: findImage('avatar-3'), level: 90, wealthLevel: 110, countryCode: "CA", registrationDate: subHours(now, 12).toISOString(), followingCount: 50, followerCount: 1200, friendCount: 30, visitorCount: 800 },
  { id: "u4", name: "Echo", avatarUrl: findImage('avatar-4'), level: 75, wealthLevel: 80, countryCode: "AU", registrationDate: subHours(now, 2).toISOString(), followingCount: 80, followerCount: 800, friendCount: 40, visitorCount: 450 },
  { id: "u5", name: "make friends", avatarUrl: findImage('avatar-5'), level: 50, wealthLevel: 60, countryCode: "GH", registrationDate: subDays(now, 20).toISOString(), followingCount: 100, followerCount: 500, friendCount: 10, visitorCount: 200 },
  { id: "u6", name: "lets team work", avatarUrl: findImage('avatar-6'), level: 40, wealthLevel: 50, countryCode: "NG", registrationDate: subHours(now, 36).toISOString(), followingCount: 120, followerCount: 400, friendCount: 25, visitorCount: 300 },
  { id: "u7", name: "Urmila kushvaha", avatarUrl: findImage('avatar-7'), level: 30, wealthLevel: 40, countryCode: "IN", registrationDate: subDays(now, 2).toISOString(), followingCount: 90, followerCount: 600, friendCount: 15, visitorCount: 150 },
  { id: "u8", name: "A-T-steveofpa", avatarUrl: findImage('avatar-8'), level: 200, wealthLevel: 250, countryCode: "US", registrationDate: subDays(now, 50).toISOString(), followingCount: 300, followerCount: 10000, friendCount: 100, visitorCount: 2500 },
  { id: "u9", name: "SparkleStream", avatarUrl: findImage('avatar-9'), level: 88, wealthLevel: 92, countryCode: "PH", registrationDate: subHours(now, 8).toISOString(), followingCount: 110, followerCount: 950, friendCount: 35, visitorCount: 600 },
  { id: "u10", name: "LiveNow", avatarUrl: findImage('avatar-10'), level: 78, wealthLevel: 85, countryCode: "GB", registrationDate: subDays(now, 1).toISOString(), followingCount: 130, followerCount: 850, friendCount: 45, visitorCount: 700 },
  { id: "u11", name: "Luna", avatarUrl: findImage('avatar-11'), level: 95, wealthLevel: 100, countryCode: "PH", registrationDate: subDays(now, 15).toISOString(), followingCount: 180, followerCount: 1500, friendCount: 60, visitorCount: 1000 },
  { id: "u12", name: "Raja", avatarUrl: findImage('avatar-12'), level: 110, wealthLevel: 120, countryCode: "IN", registrationDate: subDays(now, 4).toISOString(), followingCount: 250, followerCount: 3000, friendCount: 70, visitorCount: 1500 },
  { id: "u13", name: "PartyAnimal", avatarUrl: findImage('avatar-13'), level: 55, wealthLevel: 55, countryCode: "BR", registrationDate: subHours(now, 1).toISOString(), followingCount: 60, followerCount: 300, friendCount: 20, visitorCount: 100 },
  { id: "u14", name: "VibeMaster", avatarUrl: findImage('avatar-14'), level: 65, wealthLevel: 70, countryCode: "DE", registrationDate: subDays(now, 3).toISOString(), followingCount: 75, followerCount: 700, friendCount: 33, visitorCount: 400 },
  { id: "u15", name: "MelodyMaker", avatarUrl: findImage('avatar-15'), level: 72, wealthLevel: 80, countryCode: "FR", registrationDate: subHours(now, 20).toISOString(), followingCount: 85, followerCount: 750, friendCount: 42, visitorCount: 550 },
  { id: "u16", name: "ChatChampion", avatarUrl: findImage('avatar-16'), level: 48, wealthLevel: 52, countryCode: "ES", registrationDate: subDays(now, 7).toISOString(), followingCount: 55, followerCount: 250, friendCount: 18, visitorCount: 220 },
  { id: "u17", name: "KaraokeKing", avatarUrl: findImage('avatar-17'), level: 81, wealthLevel: 90, countryCode: "JP", registrationDate: subHours(now, 5).toISOString(), followingCount: 105, followerCount: 900, friendCount: 38, visitorCount: 650 },
  { id: "u18", name: "StoryTeller", avatarUrl: findImage('avatar-18'), level: 62, wealthLevel: 68, countryCode: "IT", registrationDate: subDays(now, 6).toISOString(), followingCount: 65, followerCount: 450, friendCount: 22, visitorCount: 380 },
  { id: "u19", name: "RhythmRider", avatarUrl: findImage('avatar-19'), level: 77, wealthLevel: 85, countryCode: "KR", registrationDate: subHours(now, 15).toISOString(), followingCount: 95, followerCount: 800, friendCount: 48, visitorCount: 720 },
  { id: "u20", name: "LaughFactory", avatarUrl: findImage('avatar-20'), level: 53, wealthLevel: 60, countryCode: "MX", registrationDate: subDays(now, 9).toISOString(), followingCount: 45, followerCount: 350, friendCount: 28, visitorCount: 280 },
  { id: "u21", name: "PixelPilot", avatarUrl: findImage('avatar-1'), level: 130, wealthLevel: 145, countryCode: "JP", registrationDate: subDays(now, 30).toISOString(), followingCount: 220, followerCount: 4000, friendCount: 80, visitorCount: 1800 },
  { id: "u22", name: "SynthWave", avatarUrl: findImage('avatar-2'), level: 115, wealthLevel: 130, countryCode: "FR", registrationDate: subDays(now, 45).toISOString(), followingCount: 210, followerCount: 3500, friendCount: 75, visitorCount: 1600 },
  { id: "u23", name: "CosmicDancer", avatarUrl: findImage('avatar-3'), level: 98, wealthLevel: 115, countryCode: "BR", registrationDate: subDays(now, 25).toISOString(), followingCount: 160, followerCount: 1800, friendCount: 55, visitorCount: 1100 },
  { id: "u24", name: "RetroGamer", avatarUrl: findImage('avatar-4'), level: 82, wealthLevel: 90, countryCode: "DE", registrationDate: subDays(now, 18).toISOString(), followingCount: 140, followerCount: 1100, friendCount: 44, visitorCount: 900 }
];

export const violations: Violation[] = [
  { id: 'v1', userId: 'u3', ruleTitle: 'No Spam or Scams', violationDate: subDays(now, 1).toISOString(), reportingAdminId: 'system-moderator', notes: 'User was sending unsolicited links in party rooms.' },
  { id: 'v2', userId: 'u5', ruleTitle: 'No Impersonation', violationDate: subDays(now, 3).toISOString(), reportingAdminId: 'system-moderator', notes: 'User was pretending to be a platform moderator.' },
];

export const allStreams: Stream[] = [
  { id: "s1", title: "Chill Vibes & Good Times", user: users[0], thumbnailUrl: findImage('party-thumb-1'), viewerCount: 12500, tags: ["gaming", "chill"], isPartyRoom: true, category: "Chatting", isTop10: true, isLive: true },
  { id: "s2", title: "Karaoke Night! Join in!", user: users[1], thumbnailUrl: findImage('party-thumb-2'), viewerCount: 8900, tags: ["music", "singing"], isPartyRoom: true, category: "Singing", isLive: true },
  { id: "s3", title: "Digital Art & Lo-fi Beats", user: users[2], thumbnailUrl: findImage('party-thumb-3'), viewerCount: 4200, tags: ["art", "creative"], isPartyRoom: false, category: "Art", isLive: true },
  { id: "s4", title: "Late Night Talks", user: users[3], thumbnailUrl: findImage('party-thumb-4'), viewerCount: 1500, tags: ["just chatting", "ama"], isPartyRoom: true, category: "Chatting", isLive: true },
  { id: "s5", title: "Morning Coffee Chat", user: users[4], thumbnailUrl: findImage('party-thumb-5'), viewerCount: 2300, tags: ["chatting", "morning"], isPartyRoom: true, category: "Chatting", isLive: true },
  { id: "s6", title: "Guess the Song!", user: users[5], thumbnailUrl: findImage('party-thumb-6'), viewerCount: 5600, tags: ["music", "game"], isPartyRoom: true, category: "Games", isTop10: true, isLive: true },
  { id: "s7", title: "DJ Set - House Party", user: users[6], thumbnailUrl: findImage('party-thumb-7'), viewerCount: 18000, tags: ["music", "dj"], isPartyRoom: true, category: "Music", isLive: true },
  { id: "s8", title: "Let's Play: Among Us", user: users[7], thumbnailUrl: findImage('party-thumb-8'), viewerCount: 7800, tags: ["gaming", "among us"], isPartyRoom: false, category: "Gaming", isLive: true },
  { id: "s9", title: "Philippines Idol Voice", user: users[8], thumbnailUrl: findImage('party-thumb-9'), viewerCount: 2200, tags: ["singing", "contest"], isPartyRoom: true, category: "Singing", isLive: true },
  { id: "s10", title: "Welcome to my Party!", user: users[9], thumbnailUrl: findImage('party-thumb-10'), viewerCount: 3100, tags: ["chatting", "party"], isPartyRoom: true, category: "Chatting", isLive: true },
  { id: "s11", title: "Good vibes only", user: users[10], thumbnailUrl: findImage('party-thumb-11'), viewerCount: 4800, tags: ["chat", "chill"], isPartyRoom: true, category: "Chatting", isLive: true },
  { id: "s12", title: "Indian Beats Night", user: users[11], thumbnailUrl: findImage('party-thumb-12'), viewerCount: 6200, tags: ["music", "india"], isPartyRoom: true, category: "Music", isLive: true },
  { id: "s13", title: "Samba Party Room!", user: users[12], thumbnailUrl: findImage('party-thumb-13'), viewerCount: 3500, tags: ["dance", "brazil"], isPartyRoom: true, category: "Dancing", isLive: true },
  { id: "s14", title: "Techno Bunker", user: users[13], thumbnailUrl: findImage('party-thumb-14'), viewerCount: 9100, tags: ["music", "techno"], isPartyRoom: true, category: "Music", isLive: true },
  { id: "s15", title: "Acoustic Cafe", user: users[14], thumbnailUrl: findImage('party-thumb-15'), viewerCount: 2800, tags: ["music", "acoustic"], isPartyRoom: true, category: "Singing", isLive: true },
  { id: "s16", title: "La Tertulia Española", user: users[15], thumbnailUrl: findImage('party-thumb-16'), viewerCount: 1900, tags: ["chat", "spanish"], isPartyRoom: true, category: "Chatting", isLive: true },
  { id: "s17", title: "Anime & Chill", user: users[16], thumbnailUrl: findImage('party-thumb-17'), viewerCount: 5300, tags: ["anime", "chat"], isPartyRoom: true, category: "Chatting", isLive: true },
  { id: "s18", title: "Cucina Italiana Live", user: users[17], thumbnailUrl: findImage('party-thumb-18'), viewerCount: 1200, tags: ["cooking", "italy"], isPartyRoom: false, category: "Cooking", isLive: true },
  { id: "s19", title: "K-Pop Dance Party", user: users[18], thumbnailUrl: findImage('party-thumb-19'), viewerCount: 11500, tags: ["kpop", "dance"], isPartyRoom: true, category: "Dancing", isTop10: true, isLive: true },
  { id: "s20", title: "Comedy Hour", user: users[19], thumbnailUrl: findImage('party-thumb-20'), viewerCount: 4500, tags: ["comedy", "funny"], isPartyRoom: true, category: "Comedy", isLive: true },
  { id: "s21", title: "Just Dance Marathon", user: users[20], thumbnailUrl: findImage('party-thumb-1'), viewerCount: 6700, tags: ["dance", "gaming"], isPartyRoom: true, category: "Dancing", isLive: true },
  { id: "s22", title: "Valorant Scrims", user: users[21], thumbnailUrl: findImage('party-thumb-2'), viewerCount: 8200, tags: ["gaming", "valorant"], isPartyRoom: false, category: "Gaming", isLive: true },
  { id: "s23", title: "Open Mic Night", user: users[22], thumbnailUrl: findImage('party-thumb-3'), viewerCount: 3300, tags: ["music", "live"], isPartyRoom: true, category: "Singing", isLive: true },
  { id: "s24", title: "Ask Me Anything!", user: users[23], thumbnailUrl: findImage('party-thumb-4'), viewerCount: 1800, tags: ["chatting", "q&a"], isPartyRoom: true, category: "Chatting", isLive: true }
];

export const popularLiveStreams: Stream[] = allStreams.filter(s => !s.isPartyRoom);
export const livePartyRooms: Stream[] = allStreams.filter(s => s.isPartyRoom);


export const coinPackages: CoinPackage[] = [
  { id: "c1", price: 1, coins: 8000 },
  { id: "c2", price: 3, coins: 22000 },
  { id: "c3", price: 10, coins: 71000 },
  { id: "c4", price: 30, coins: 211000 },
  { id: "c5", price: 50, coins: 351000 },
  { id: "c6", price: 100, coins: 701000 },
  { id: "c7", price: 200, coins: 1401000 },
];

export const vipLevels: VIPLevel[] = [
  { id: "v1", name: "Silver VIP", seatAccess: 16, price: 9.99, perks: ["Access to 16-seat rooms", "Exclusive avatar frame", "Faster coin earning"] },
  { id: "v2", name: "Golden VIP", seatAccess: 21, price: 29.99, perks: ["All Silver perks", "Access to 21-seat rooms", "VIP-only gifts"] },
  { id: "v3", name: "Diamond VIP", seatAccess: 25, price: 49.99, perks: ["All Golden perks", "Access to 25-seat rooms", "Priority seating"] },
  { id: "v4", name: "Premium VIP", seatAccess: 35, price: 99.99, perks: ["All Diamond perks", "Access to 35-seat rooms", "Customizable VIP prices"] },
];

export const guardianTiers: GuardianTier[] = [
  { id: "g1", name: "Guardian of Silver", price: 99, perks: ["Special badge & glow", "Entry animations", "1.2x Earning multiplier"] },
  { id: "g2", name: "Guardian of Gold", price: 299, perks: ["Enhanced badge & effects", "Epic entry animation", "1.5x Earning multiplier", "Silver VIP Access"] },
  { id: "g3", name: "Guardian of Diamond", price: 599, perks: ["Diamond badge & effects", "Legendary entry animation", "2x Earning multiplier", "Golden VIP Access"] },
  { id: "g4", name: "Guardian of Masters", price: 999, perks: ["Master's badge & aura", "3x Earning multiplier", "Diamond VIP Access"] },
];

export const transactions: Transaction[] = [
  { id: "t1", userId: "u1", transactionType: "purchase", amount: 71000, price: 10, timestamp: new Date().toISOString(), details: "Purchased 71,000 coins" },
  { id: "t2", userId: "u1", transactionType: "gift_sent", amount: -5000, timestamp: new Date().toISOString(), details: "Sent a 'Diamond' to NeonBlade" },
  { id: "t3", userId: "u2", transactionType: "withdrawal", amount: -50000, timestamp: new Date().toISOString(), details: "Withdrawal to Binance" },
  { id: "t4", userId: "u3", transactionType: "exchange", amount: -10000, timestamp: new Date().toISOString(), details: "Exchanged 10,000 coins to points" },
  { id: "t5", userId: "u1", transactionType: "gift_received", amount: 700, timestamp: new Date().toISOString(), details: "Received a 'Rose' from CypherQueen" },
];

export const missions: Mission[] = [
  { id: "m1", title: "Daily Check-in", description: "Log in to claim your daily reward.", reward: "300 Coins", completed: false, type: 'daily' },
  { id: "m2", title: "Stream for 1 Hour", description: "Go live for at least one hour.", reward: "1,300 Points", completed: false, gender: "female", type: 'daily' },
  { id: "m3", title: "Stream for 2 Hours", description: "Go live for a total of two hours today.", reward: "2,750 Points", completed: false, gender: "female", type: 'daily' },
  { id: "m4", title: "Win 3 PK Battles", description: "Win 3 consecutive PK battles.", reward: "7,000 Points", completed: false, type: 'special' },
  { id: "m5", title: "Sit on a Crown Seat (1 Hour)", description: "Occupy a crown seat for 1 hour.", reward: "900 Points", completed: false, gender: "female", type: 'daily' },
  { id: "m6", title: "Registration Bonus", description: "Your one-time bonus for joining EchoLive.", reward: "750 Coins", completed: false, type: 'special' },
  { id: "m7", title: "Occupy a Seat (30 mins)", description: "Sit on any non-crown seat for 30 minutes.", reward: "460 Coins", completed: false, gender: "male", type: 'daily' },
  { id: "m8", title: "Occupy a Seat (1 Hour)", description: "Sit on any non-crown seat for a total of 1 hour.", reward: "500 Coins", completed: false, gender: "male", type: 'daily' },
  { id: "m9", title: "Sit on a Crown Seat (2 Hours)", description: "Occupy a crown seat for a total of two hours today.", reward: "950 Points", completed: false, gender: "female", type: 'daily' },
];

const giftImages = {
  sweetPop: findImage('gift-sweet-pop'),
  iCone: findImage('gift-i-cone'),
  perfume: findImage('gift-perfume'),
  rose: findImage('gift-rose'),
  kiss: findImage('gift-kiss'),
  crown: findImage('gift-crown'),
  diamondRing: findImage('gift-diamond-ring'),
  luxuryCar: findImage('gift-luxury-car'),
  clover: 'https://picsum.photos/seed/clover/200',
  horseshoe: 'https://picsum.photos/seed/horseshoe/200',
};

export const gifts: Gift[] = [
  { id: 'g1', name: 'Sweet Pop', price: 100, imageUrl: giftImages.sweetPop, category: 'Gift', badges: [{ text: 'Lucky', color: 'bg-pink-500' }] },
  { id: 'g2', name: 'I-cone', price: 500, imageUrl: giftImages.iCone, category: 'Gift' },
  { id: 'g3', name: 'Perfume', price: 500, imageUrl: giftImages.perfume, category: 'Gift', badges: [{ text: 'Unit', color: 'bg-gray-500' }] },
  { id: 'g4', name: 'Rose', price: 3000, imageUrl: giftImages.rose, category: 'Gift' },
  { id: 'g5', name: 'Kiss', price: 10000, imageUrl: giftImages.kiss, category: 'Gift', badges: [{ text: 'Unit', color: 'bg-gray-500' }] },
  { id: 'g6', name: 'Crown', price: 50000, imageUrl: giftImages.crown, category: 'Gift', badges: [{ text: 'PK', color: 'bg-blue-500' }] },
  { id: 'g7', name: 'Diamond Ring', price: 300000, imageUrl: giftImages.diamondRing, category: 'Gift', badges: [{ text: 'Avatar', color: 'bg-cyan-500' }] },
  { id: 'g8', name: 'Luxury Car', price: 600000, imageUrl: giftImages.luxuryCar, category: 'Gift', badges: [{ text: 'Avatar', color: 'bg-cyan-500' }] },
  { id: 'l1', name: 'Clover', price: 200, imageUrl: giftImages.clover, category: 'Lucky', badges: [{ text: 'Lucky', color: 'bg-pink-500' }] },
  { id: 'l2', name: 'Horseshoe', price: 1000, imageUrl: giftImages.horseshoe, category: 'Lucky' },
];


export const wealthLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: users[0], value: "1.5M Points" },
  { rank: 2, user: users[1], value: "1.2M Points" },
  { rank: 3, user: users[2], value: "980K Points" },
];

export const livestreamLeaderboard: LeaderboardEntry[] = [
  { rank: 1, user: users[1], value: "250 Hours" },
  { rank: 2, user: users[3], value: "180 Hours" },
  { rank: 3, user: users[0], value: "150 Hours" },
];

export const userBadges: Badge[] = [
  { id: 'b1', name: 'PK Champion', description: 'Won 10 PK battles in a row.', imageUrl: findImage('badge-pk-winner') },
  { id: 'b2', name: 'Level 100', description: 'Reached Wealth Level 100.', imageUrl: findImage('badge-level-100') },
  { id: 'b3', name: 'Top Gifter', description: 'Was #1 on the weekly gifting leaderboard.', imageUrl: findImage('badge-top-gifter') },
];

export const levelSystemInfo: LevelInfo[] = [
  { type: 'Livestream Level', description: 'Increase your Livestream Level by engaging in streaming activities.', factors: ['Points earned', 'Hours of livestreaming', 'Gifts received', 'PK wins', 'Crown seat usage'] },
  { type: 'Wealth Level', description: 'Increase your Wealth Level by contributing to the community.', factors: ['Coins spent', 'Gifts sent', 'Purchasing VIP', 'Purchasing Guardian status'] }
];

export const events: Event[] = [
  { id: 'e1', title: 'Summer Synthwave Festival', description: 'A 3-day music festival featuring the best synthwave artists on the platform. Special event gifts and badges available.', date: '2024-08-15T18:00:00Z', imageUrl: findImage('stream-7') },
  { id: 'e2', title: 'Cyberpunk 2077 Speedrun Challenge', description: 'Watch top streamers race to complete Cyberpunk 2077. Bet on your favorite and win coin prizes.', date: '2024-09-01T12:00:00Z', imageUrl: findImage('stream-1') },
  { id: 'e3', title: 'Community Art Showcase', description: 'A week-long event celebrating the amazing artists of EchoLive. Vote for your favorite creations.', date: '2024-09-10T10:00:00Z', imageUrl: findImage('stream-3') },
];

export const platformRules = [
  { title: "No Pornography or Sexually Explicit Content", description: "Any content depicting pornography, sexual acts, or nudity is strictly forbidden. This includes avatars, backgrounds, and user-generated content." },
  { title: "No Hate Speech or Harassment", description: "Hate speech, bullying, harassment, and any form of discrimination against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics will not be tolerated." },
  { title: "No Illegal Activities", description: "Do not use the platform to conduct or promote illegal activities, including but not limited to drug trafficking, fraud, and terrorism." },
  { title: "No Spam or Scams", description: "Spamming, phishing, and attempting to scam other users out of their coins, points, or personal information is strictly prohibited." },
  { title: "Respect Intellectual Property", description: "Do not stream, post, or share content that infringes on the copyrights, trademarks, or other intellectual property rights of others." },
  { title: "No Impersonation", description: "Do not impersonate other users, streamers, platform staff, or any other individual or entity." },
  { title: "Maintain a Safe Environment", description: "Content that promotes self-harm, violence, or dangerous acts is not allowed. We strive to maintain a positive and safe community for everyone." },
  { title: "No Underage Users", description: "You must be 18 years or older to use this platform. Do not stream or interact with minors in an inappropriate manner." },
  { title: "Protect Private Information", description: "Do not share private information of other users without their explicit consent. This includes phone numbers, addresses, and other personal data." },
  { title: "Do Not Exploit the System", description: "Abusing bugs, manipulating platform features, or using automated scripts to gain an unfair advantage is strictly forbidden." }
];

export const faqs = [
  {
    question: 'How do I get more coins?',
    answer: 'You can purchase coins from the "Top-up coins" page, accessible from your wallet or the shop. You can also earn coins through some daily tasks and platform rewards.',
  },
  {
    question: 'What is the difference between Coins and Points?',
    answer: 'Coins are the primary currency you purchase and use to send gifts or exchange for points. Points are earned from receiving gifts/exchanges, completing missions, and other activities. Points can be withdrawn for real money.',
  },
  {
    question: 'How do I withdraw my points?',
    answer: 'You can withdraw points from your wallet. Navigate to Wallet > Points > Withdraw now. You must have a payment method bound to your account and meet the minimum withdrawal amount. A fee applies to each transaction.',
  },
  {
    question: 'What are the requirements to become an Agent?',
    answer: 'To become an agent, you must apply through the "Agent" page. Your application will be reviewed by our administrators. Active and trusted members of the community are more likely to be approved.',
  },
  {
    question: 'My withdrawal failed. What should I do?',
    answer: 'If a withdrawal fails, the points (minus any transaction fees) are typically refunded to your account. Check the reason for failure in your withdrawal history. Common reasons include an incorrect wallet address. If you need further assistance, please contact customer support.',
  },
];
