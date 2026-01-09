// Base API service for RS3 Nexus
import axios, { AxiosInstance } from 'axios';

class APIService {
  private rsWikiAPI: AxiosInstance;
  private geTrackerAPI: AxiosInstance;

  constructor() {
    // RuneScape Wiki API
    this.rsWikiAPI = axios.create({
      baseURL: 'https://runescape.wiki/api.php',
      timeout: 10000,
      headers: {
        'User-Agent': 'RS3-Nexus/1.0 (Enhanced Alt1 Toolkit)',
      },
    });

    // Grand Exchange Tracker
    this.geTrackerAPI = axios.create({
      baseURL: 'https://api.weirdgloop.org',
      timeout: 10000,
    });
  }

  // Generic GET request with caching
  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.rsWikiAPI.get<T>(url, { params });
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Grand Exchange specific requests
  async getGEData<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.geTrackerAPI.get<T>(endpoint);
      return response.data;
    } catch (error) {
      console.error('GE API request failed:', error);
      throw error;
    }
  }

  // Search wiki
  async searchWiki(query: string, limit = 10): Promise<any> {
    return this.get('/api.php', {
      action: 'opensearch',
      search: query,
      limit,
      namespace: 0,
      format: 'json',
    });
  }

  // Get page content
  async getWikiPage(title: string): Promise<any> {
    return this.get('/api.php', {
      action: 'parse',
      page: title,
      format: 'json',
      prop: 'text|images|categories',
    });
  }
}

export const apiService = new APIService();
export default apiService;
