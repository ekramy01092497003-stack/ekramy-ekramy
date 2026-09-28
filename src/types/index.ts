// Core types for Voice Party Social App
export type RoomRole = 'owner' | 'admin' | 'host' | 'moderator' | 'speaker' | 'listener';

export interface VipBadge {
  id: string;
  name: string;
  tier: string;
  icon: string;
  rarity: 'gold' | 'diamond' | 'mythic' | 'royal';
  description: string;
  glowColor: string;
  isUnlocked: boolean;
  perk: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  badgeLevel: number;
  country: string;
  countryFlag: string;
  coins: number; // ONLY COINS in the entire app - No Diamonds, No Gems
  followers: number;
  following: number;
  visitors: number;
  earnings: number;
  vipLevel: number;
  activeVipBadgeId?: string;
  familyId?: string;
  familyName?: string;
  role?: RoomRole;
}

export interface VoiceSeat {
  seatNumber: number;
  occupied: boolean;
  userId?: string;
  userName?: string;
  userAvatar?: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
  role?: RoomRole;
  isLocked?: boolean;
}

export interface HandRaiseRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  requestedAt: string;
}

export interface VoiceRoom {
  id: string;
  title: string;
  category: string;
  country: string;
  countryFlag: string;
  coverImage: string;
  hostName: string;
  hostAvatar: string;
  hostId: string;
  onlineCount: number;
  rankBadge?: string;
  tags: string[];
  seats: VoiceSeat[];
  announcement?: string;
  gradient: string;
  admins: string[];      // userIds of Admins
  moderators: string[];  // userIds of Moderators
  bannedUsers: string[]; // userIds of Banned Users
  mutedUsers: string[];  // userIds of Muted Users
}

export interface FamilyItem {
  id: string;
  name: string;
  badge: string;
  level: number;
  membersCount: number;
  leaderName: string;
  leaderAvatar: string;
  totalCoins: number;
  avatar: string;
  description: string;
  isJoined?: boolean;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  isOfficial?: boolean;
}

export interface MomentPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorBadges: {
    level: number;
    crownBadge?: number;
  };
  timeString: string;
  country: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  likesCount: number;
  isLiked?: boolean;
  commentsCount: number;
  sharesCount: number;
  giftsCount: number;
  hashtags?: string[];
}

export interface GiftItem {
  id: string;
  name: string;
  nameAr: string;
  cost: number;
  currency: 'coins'; // strictly coins
  icon: string;
  effect: 'sparkles' | 'fire' | 'heart' | 'car' | 'castle';
}

export interface StoreItem {
  id: string;
  name: string;
  category: 'frame' | 'ride' | 'bubble' | 'badge';
  cost: number; // strictly coins
  icon: string;
  description: string;
}

export interface NotificationItem {
  id: string;
  type: 'gift' | 'system' | 'room_invite' | 'level' | 'family';
  title: string;
  message: string;
  time: string;
  avatar?: string;
  isRead: boolean;
  actionUrl?: string;
}
