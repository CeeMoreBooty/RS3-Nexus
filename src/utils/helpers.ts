/**
 * Utility functions for price formatting and calculations
 */

import type { PriceTrend, PriceHistory } from '../types/api';

/**
 * Format price as GP (gold pieces)
 */
export function formatPrice(price: number): string {
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(2)}B gp`;
  } else if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(2)}M gp`;
  } else if (price >= 1_000) {
    return `${(price / 1_000).toFixed(1)}K gp`;
  }
  return `${price.toLocaleString()} gp`;
}

/**
 * Format time ago
 */
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }
}

/**
 * Calculate price trend from history
 */
export function calculatePriceTrend(history: PriceHistory): PriceTrend {
  if (history.prices.length < 2) {
    return { direction: 'stable', percentChange: 0 };
  }

  const latestPrice = history.prices[history.prices.length - 1].buyPrice;
  const oldestPrice = history.prices[0].buyPrice;
  
  const percentChange = ((latestPrice - oldestPrice) / oldestPrice) * 100;
  
  let direction: 'up' | 'down' | 'stable' = 'stable';
  if (percentChange > 1) {
    direction = 'up';
  } else if (percentChange < -1) {
    direction = 'down';
  }

  return {
    direction,
    percentChange: Math.abs(percentChange),
  };
}

/**
 * Calculate margin between buy and sell prices
 */
export function calculateMargin(buyPrice: number, sellPrice: number): {
  profit: number;
  profitPercent: number;
} {
  const profit = buyPrice - sellPrice;
  const profitPercent = (profit / buyPrice) * 100;

  return {
    profit,
    profitPercent,
  };
}

/**
 * Debounce function for search input
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}
