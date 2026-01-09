import axios from 'axios'
import { API_ENDPOINTS } from '../utils/constants'

// Types
export interface PriceData {
  id: number
  name: string
  price: number
  high: number
  low: number
  volume?: number
  timestamp?: number
}

export interface ItemInfo {
  id: number
  name: string
  description?: string
  members?: boolean
  tradeable?: boolean
  limit?: number
}

/**
 * API Service for RS3 data
 */
class ApiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map()
  private readonly CACHE_DURATION = 60000 // 1 minute

  /**
   * Get from cache or fetch
   */
  private async getCached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data as T
    }
    
    const data = await fetcher()
    this.cache.set(key, { data, timestamp: Date.now() })
    return data
  }

  /**
   * Get latest GE prices
   */
  async getLatestPrices(): Promise<Record<string, PriceData>> {
    return this.getCached('latest-prices', async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.RS3_GE, {
          headers: {
            'User-Agent': 'RS3-Nexus/1.0'
          }
        })
        return response.data.data || {}
      } catch (error) {
        console.error('Error fetching latest prices:', error)
        return {}
      }
    })
  }

  /**
   * Get item price by ID
   */
  async getItemPrice(itemId: number): Promise<PriceData | null> {
    try {
      const prices = await this.getLatestPrices()
      const item = prices[itemId]
      
      if (!item) return null
      
      return {
        id: itemId,
        name: '',
        price: item.high || item.low || 0,
        high: item.high || 0,
        low: item.low || 0,
      }
    } catch (error) {
      console.error(`Error fetching price for item ${itemId}:`, error)
      return null
    }
  }

  /**
   * Search item by name
   */
  async searchItem(name: string): Promise<ItemInfo[]> {
    return this.getCached(`search-${name}`, async () => {
      try {
        // This would use the RS3 Wiki API or similar
        // For now, return empty array as placeholder
        return []
      } catch (error) {
        console.error(`Error searching for item ${name}:`, error)
        return []
      }
    })
  }

  /**
   * Get item history
   */
  async getItemHistory(itemId: number, days: number = 7): Promise<Array<{ timestamp: number; price: number }>> {
    try {
      const response = await axios.get(`${API_ENDPOINTS.WIKI_PRICES}?id=${itemId}`, {
        headers: {
          'User-Agent': 'RS3-Nexus/1.0'
        }
      })
      
      // Parse and return history data
      const history = response.data || []
      return history.slice(-days * 24) // Last N days (hourly data)
    } catch (error) {
      console.error(`Error fetching history for item ${itemId}:`, error)
      return []
    }
  }

  /**
   * Get Grand Exchange limits
   */
  async getGELimits(): Promise<Record<number, number>> {
    return this.getCached('ge-limits', async () => {
      // Placeholder - would fetch from RS3 Wiki
      return {}
    })
  }

  /**
   * Calculate flip margins
   */
  async getFlipMargins(itemIds: number[]): Promise<Array<{
    id: number
    buyPrice: number
    sellPrice: number
    margin: number
    marginPercent: number
  }>> {
    try {
      const prices = await this.getLatestPrices()
      
      return itemIds.map(id => {
        const item = prices[id]
        if (!item) {
          return {
            id,
            buyPrice: 0,
            sellPrice: 0,
            margin: 0,
            marginPercent: 0
          }
        }
        
        const buyPrice = item.high || 0
        const sellPrice = item.low || 0
        const margin = sellPrice - buyPrice - (sellPrice * 0.01) // 1% tax
        const marginPercent = buyPrice > 0 ? (margin / buyPrice) * 100 : 0
        
        return {
          id,
          buyPrice,
          sellPrice,
          margin,
          marginPercent
        }
      })
    } catch (error) {
      console.error('Error calculating flip margins:', error)
      return []
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Clear specific cache entry
   */
  clearCacheEntry(key: string): void {
    this.cache.delete(key)
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService
