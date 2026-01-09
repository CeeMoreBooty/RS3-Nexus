/**
 * TypeScript interfaces for DailyScape/RuneScape Wiki API data
 */

export interface ItemPrice {
  id: number;
  name: string;
  buyPrice: number;
  sellPrice: number;
  volume?: number;
  timestamp: Date;
  buyLimit?: number;
  icon?: string;
  members?: boolean;
}

export interface PriceHistory {
  itemId: number;
  prices: Array<{
    timestamp: Date;
    buyPrice: number;
    sellPrice: number;
    volume?: number;
  }>;
}

export interface Item {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  members?: boolean;
  examine?: string;
  lowalch?: number;
  highalch?: number;
  value?: number;
  limit?: number;
}

export interface ApiItemMapping {
  id: number;
  name: string;
  examine?: string;
  members?: boolean;
  lowalch?: number;
  highalch?: number;
  value?: number;
  limit?: number;
  icon?: string;
}

export interface ApiPriceData {
  [itemId: string]: {
    high: number;
    highTime: number;
    low: number;
    lowTime: number;
  };
}

export interface ApiHistoryData {
  [timestamp: string]: number;
}

export interface PriceTrend {
  direction: 'up' | 'down' | 'stable';
  percentChange: number;
}

export interface SearchResult {
  items: Item[];
  total: number;
}
