/**
 * API Service for fetching RuneScape 3 Grand Exchange data
 * Using Weird Gloop API (api.weirdgloop.org)
 * Supports demo mode with mock data when VITE_DEMO_MODE=true
 */

import type { 
  ItemPrice, 
  PriceHistory, 
  Item, 
  ApiItemMapping, 
  ApiPriceData,
  ApiHistoryData,
  SearchResult 
} from '../types/api';
import { DAILYSCAPE_API, API_HEADERS } from '../utils/constants';
import { CacheService } from './cacheService';
import { getMockItemMappings, getMockPrice } from './mockData';

class ApiService {
  private itemMappings: Map<number, Item> = new Map();
  private itemNameIndex: Map<string, number[]> = new Map();
  private mappingsLoaded = false;
  private demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  /**
   * Fetch with retry logic
   */
  private async fetchWithRetry(url: string, retries = DAILYSCAPE_API.MAX_RETRIES): Promise<Response> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), DAILYSCAPE_API.REQUEST_TIMEOUT);

      const response = await fetch(url, {
        headers: API_HEADERS,
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, DAILYSCAPE_API.RETRY_DELAY));
        return this.fetchWithRetry(url, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Load item mappings (ID to name, metadata)
   */
  async loadItemMappings(): Promise<void> {
    if (this.mappingsLoaded) return;

    // Demo mode: use mock data
    if (this.demoMode) {
      const mockData = getMockItemMappings();
      const items: Item[] = mockData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.examine,
        members: item.members,
        icon: item.icon,
        examine: item.examine,
        lowalch: item.lowalch,
        highalch: item.highalch,
        value: item.value,
      }));
      this.populateMappings(items);
      this.mappingsLoaded = true;
      return;
    }

    // Try cache first
    const cached = CacheService.get<Item[]>('item_mappings');
    if (cached) {
      this.populateMappings(cached);
      this.mappingsLoaded = true;
      return;
    }

    try {
      const response = await this.fetchWithRetry(
        `${DAILYSCAPE_API.BASE_URL}${DAILYSCAPE_API.ENDPOINTS.MAPPING}`
      );
      const data: ApiItemMapping[] = await response.json();

      const items: Item[] = data.map(item => ({
        id: item.id,
        name: item.name,
        description: item.examine,
        members: item.members,
        icon: item.icon,
        examine: item.examine,
        lowalch: item.lowalch,
        highalch: item.highalch,
        value: item.value,
      }));

      // Cache for 24 hours
      CacheService.set('item_mappings', items, 24 * 60 * 60 * 1000);
      this.populateMappings(items);
      this.mappingsLoaded = true;
    } catch (error) {
      console.error('Error loading item mappings:', error);
      throw new Error('Failed to load item data. Please try again later.');
    }
  }

  /**
   * Populate internal mappings for fast lookup
   */
  private populateMappings(items: Item[]): void {
    this.itemMappings.clear();
    this.itemNameIndex.clear();

    items.forEach(item => {
      this.itemMappings.set(item.id, item);

      // Build name index for search
      const nameLower = item.name.toLowerCase();
      const words = nameLower.split(' ');
      
      words.forEach(word => {
        if (!this.itemNameIndex.has(word)) {
          this.itemNameIndex.set(word, []);
        }
        this.itemNameIndex.get(word)!.push(item.id);
      });
    });
  }

  /**
   * Fetch current price for a single item
   */
  async fetchItemPrice(itemId: number): Promise<ItemPrice | null> {
    // Check cache first
    const cacheKey = CacheService.getPriceCacheKey(itemId);
    const cached = CacheService.get<ItemPrice>(cacheKey);
    if (cached) {
      return cached;
    }

    // Demo mode: use mock data
    if (this.demoMode) {
      const mockPrice = getMockPrice(itemId);
      if (!mockPrice) return null;

      const item = this.itemMappings.get(itemId);
      const itemPrice: ItemPrice = {
        id: itemId,
        name: item?.name || `Item ${itemId}`,
        buyPrice: mockPrice.high,
        sellPrice: mockPrice.low,
        timestamp: new Date(mockPrice.highTime * 1000),
        icon: item?.icon,
        members: item?.members,
      };

      CacheService.set(cacheKey, itemPrice);
      return itemPrice;
    }

    try {
      const response = await this.fetchWithRetry(
        `${DAILYSCAPE_API.BASE_URL}${DAILYSCAPE_API.ENDPOINTS.LATEST}?id=${itemId}`
      );
      const data: ApiPriceData = await response.json();

      const priceData = data[itemId.toString()];
      if (!priceData) {
        return null;
      }

      const item = this.itemMappings.get(itemId);
      const itemPrice: ItemPrice = {
        id: itemId,
        name: item?.name || `Item ${itemId}`,
        buyPrice: priceData.high,
        sellPrice: priceData.low,
        timestamp: new Date(priceData.highTime * 1000),
        icon: item?.icon,
        members: item?.members,
      };

      // Cache the result
      CacheService.set(cacheKey, itemPrice);
      return itemPrice;
    } catch (error) {
      console.error(`Error fetching price for item ${itemId}:`, error);
      return null;
    }
  }

  /**
   * Fetch prices for multiple items at once (bulk)
   */
  async fetchBulkPrices(itemIds: number[]): Promise<ItemPrice[]> {
    try {
      const response = await this.fetchWithRetry(
        `${DAILYSCAPE_API.BASE_URL}${DAILYSCAPE_API.ENDPOINTS.LATEST}`
      );
      const data: ApiPriceData = await response.json();

      const prices: ItemPrice[] = [];

      itemIds.forEach(itemId => {
        const priceData = data[itemId.toString()];
        if (priceData) {
          const item = this.itemMappings.get(itemId);
          const itemPrice: ItemPrice = {
            id: itemId,
            name: item?.name || `Item ${itemId}`,
            buyPrice: priceData.high,
            sellPrice: priceData.low,
            timestamp: new Date(priceData.highTime * 1000),
            icon: item?.icon,
            members: item?.members,
          };

          // Cache individual item
          const cacheKey = CacheService.getPriceCacheKey(itemId);
          CacheService.set(cacheKey, itemPrice);
          prices.push(itemPrice);
        }
      });

      return prices;
    } catch (error) {
      console.error('Error fetching bulk prices:', error);
      throw error;
    }
  }

  /**
   * Fetch price history for an item
   */
  async fetchPriceHistory(itemId: number): Promise<PriceHistory> {
    try {
      const response = await this.fetchWithRetry(
        `${DAILYSCAPE_API.BASE_URL}${DAILYSCAPE_API.ENDPOINTS.HISTORY}/${itemId}.json`
      );
      const data: ApiHistoryData = await response.json();

      const prices = Object.entries(data).map(([timestamp, price]) => ({
        timestamp: new Date(parseInt(timestamp) * 1000),
        buyPrice: price,
        sellPrice: price,
      }));

      // Sort by timestamp
      prices.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      return {
        itemId,
        prices,
      };
    } catch (error) {
      console.error(`Error fetching price history for item ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Search items by name
   */
  async searchItems(query: string): Promise<SearchResult> {
    if (!this.mappingsLoaded) {
      await this.loadItemMappings();
    }

    const queryLower = query.toLowerCase().trim();
    if (!queryLower) {
      return { items: [], total: 0 };
    }

    // Search through items
    const itemScores = new Map<number, number>();

    this.itemMappings.forEach((item, itemId) => {
      const nameLower = item.name.toLowerCase();
      
      // Exact match gets highest score
      if (nameLower === queryLower) {
        itemScores.set(itemId, 100);
      }
      // Starts with query gets high score
      else if (nameLower.startsWith(queryLower)) {
        itemScores.set(itemId, 50);
      }
      // Contains query gets lower score
      else if (nameLower.includes(queryLower)) {
        itemScores.set(itemId, 25);
      }
    });

    // Get top matches
    const sortedItems = Array.from(itemScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([itemId]) => this.itemMappings.get(itemId)!)
      .filter(item => item !== undefined);

    return {
      items: sortedItems,
      total: sortedItems.length,
    };
  }

  /**
   * Get trending/popular items (placeholder - returns commonly traded items)
   */
  async fetchTrendingItems(): Promise<Item[]> {
    if (!this.mappingsLoaded) {
      await this.loadItemMappings();
    }

    // Common high-value items that are frequently traded
    const trendingIds = [4151, 11694, 11696, 11698, 11700, 4708, 4710, 4712, 4714, 1050];
    
    return trendingIds
      .map(id => this.itemMappings.get(id))
      .filter((item): item is Item => item !== undefined);
  }
}

// Export singleton instance
export const apiService = new ApiService();
