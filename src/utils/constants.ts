/**
 * API Configuration Constants
 * Using Weird Gloop API for RuneScape 3 Grand Exchange data
 */

export const DAILYSCAPE_API = {
  // Base URL for Weird Gloop API (RS3)
  BASE_URL: 'https://api.weirdgloop.org/exchange',
  
  // API Endpoints
  ENDPOINTS: {
    LATEST: '/history/rs/latest',
    HISTORY: '/history/rs',
    MAPPING: '/history/rs/mapping',
  },
  
  // Caching configuration
  CACHE_DURATION: 60000, // 1 minute in milliseconds
  REQUEST_TIMEOUT: 5000, // 5 seconds
  
  // Rate limiting
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Local storage keys
export const STORAGE_KEYS = {
  PRICE_CACHE: 'rs3_price_cache',
  MAPPING_CACHE: 'rs3_mapping_cache',
  FAVORITES: 'rs3_favorites',
  LAST_UPDATE: 'rs3_last_update',
};

// API Headers
export const API_HEADERS = {
  'User-Agent': 'RS3-Nexus-PriceChecker/1.0',
  'Accept': 'application/json',
};

// Time ranges for price history
export const TIME_RANGES = {
  '24h': { label: '24 Hours', value: 24 * 60 * 60 * 1000 },
  '7d': { label: '7 Days', value: 7 * 24 * 60 * 60 * 1000 },
  '30d': { label: '30 Days', value: 30 * 24 * 60 * 60 * 1000 },
  '90d': { label: '90 Days', value: 90 * 24 * 60 * 60 * 1000 },
  '1y': { label: '1 Year', value: 365 * 24 * 60 * 60 * 1000 },
};

// Debounce delay for search input
export const SEARCH_DEBOUNCE_DELAY = 300; // 300ms
