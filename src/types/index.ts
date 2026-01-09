// Type definitions for RS3 Nexus

export interface ItemPrice {
  id: number;
  name: string;
  current: number;
  today: number;
  members: boolean;
  buyLimit?: number;
  icon?: string;
  trend?: 'rising' | 'falling' | 'stable';
}

export interface PriceHistory {
  timestamp: number;
  price: number;
}

export interface PriceAlert {
  id: string;
  itemName: string;
  targetPrice: number;
  type: 'buy' | 'sell';
  active: boolean;
}

export interface ClueSolution {
  type: 'anagram' | 'coordinate' | 'cryptic' | 'puzzle' | 'scan' | 'emote' | 'map';
  input: string;
  solution: string;
  location?: string;
  requirements?: string[];
  teleports?: string[];
  steps?: string[];
  image?: string;
}

export interface WikiPage {
  id: number;
  title: string;
  url: string;
  excerpt: string;
  thumbnail?: string;
  categories?: string[];
}

export interface DiscordSettings {
  enabled: boolean;
  webhookUrl?: string;
  richPresence: boolean;
  notifications: {
    priceAlerts: boolean;
    clueCompletions: boolean;
    events: boolean;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark';
  autoRefresh: boolean;
  refreshInterval: number; // seconds
  discord: DiscordSettings;
  favorites: string[];
}

export interface ClueTrackerEntry {
  id: string;
  timestamp: number;
  clueType: string;
  tier: 'easy' | 'medium' | 'hard' | 'elite' | 'master';
  reward: number;
  items: string[];
}
