/**
 * Caching service using localStorage
 * Provides TTL-based caching for API responses
 */

import { STORAGE_KEYS, DAILYSCAPE_API } from '../utils/constants';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class CacheService {
  /**
   * Store data in cache with TTL
   */
  static set<T>(key: string, data: T, ttl: number = DAILYSCAPE_API.CACHE_DURATION): void {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        ttl,
      };
      localStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error('Error storing in cache:', error);
    }
  }

  /**
   * Retrieve data from cache if not expired
   */
  static get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const entry: CacheEntry<T> = JSON.parse(item);
      const now = Date.now();

      // Check if cache entry is expired
      if (now - entry.timestamp > entry.ttl) {
        localStorage.removeItem(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error retrieving from cache:', error);
      return null;
    }
  }

  /**
   * Remove specific cache entry
   */
  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from cache:', error);
    }
  }

  /**
   * Clear all cache entries
   */
  static clear(): void {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }

  /**
   * Check if cache entry exists and is valid
   */
  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Get cache key for item price
   */
  static getPriceCacheKey(itemId: number): string {
    return `${STORAGE_KEYS.PRICE_CACHE}_${itemId}`;
  }
}
