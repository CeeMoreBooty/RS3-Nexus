// Wiki Service - RS Wiki integration with caching
import { apiService } from './api';
import { WikiPage } from '../types';

class WikiService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 30 * 60 * 1000; // 30 minutes
  private recentSearches: string[] = [];
  private bookmarks: Set<string> = new Set();

  // Search wiki with autocomplete
  async search(query: string, limit: number = 10): Promise<WikiPage[]> {
    if (!query.trim()) return [];

    try {
      const cached = this.cache.get(`search:${query}`);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const results = await apiService.searchWiki(query, limit);
      
      // Parse OpenSearch results
      const pages: WikiPage[] = results[1].map((title: string, index: number) => ({
        id: index,
        title,
        url: results[3][index],
        excerpt: results[2][index],
      }));

      this.cache.set(`search:${query}`, { data: pages, timestamp: Date.now() });
      this.addRecentSearch(query);

      return pages;
    } catch (error) {
      console.error('Wiki search failed:', error);
      return [];
    }
  }

  // Get full wiki page content
  async getPage(title: string): Promise<any> {
    try {
      const cached = this.cache.get(`page:${title}`);
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const page = await apiService.getWikiPage(title);
      this.cache.set(`page:${title}`, { data: page, timestamp: Date.now() });

      return page;
    } catch (error) {
      console.error('Failed to fetch wiki page:', error);
      return null;
    }
  }

  // Get item information
  async getItemInfo(itemName: string): Promise<any> {
    try {
      const page = await this.getPage(itemName);
      
      if (page?.parse) {
        return {
          title: page.parse.title,
          content: page.parse.text['*'],
          images: page.parse.images,
          categories: page.parse.categories?.map((c: any) => c['*']),
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to get item info:', error);
      return null;
    }
  }

  // Get monster information
  async getMonsterInfo(monsterName: string): Promise<any> {
    return this.getItemInfo(monsterName);
  }

  // Autocomplete suggestions
  async getAutocomplete(query: string): Promise<string[]> {
    if (query.length < 2) return [];

    try {
      const results = await this.search(query, 5);
      return results.map(r => r.title);
    } catch (error) {
      console.error('Autocomplete failed:', error);
      return [];
    }
  }

  // Manage recent searches
  private addRecentSearch(query: string): void {
    this.recentSearches = [query, ...this.recentSearches.filter(q => q !== query)].slice(0, 10);
    this.saveRecentSearches();
  }

  getRecentSearches(): string[] {
    return this.recentSearches;
  }

  clearRecentSearches(): void {
    this.recentSearches = [];
    this.saveRecentSearches();
  }

  private saveRecentSearches(): void {
    localStorage.setItem('wikiRecentSearches', JSON.stringify(this.recentSearches));
  }

  loadRecentSearches(): void {
    const stored = localStorage.getItem('wikiRecentSearches');
    if (stored) {
      this.recentSearches = JSON.parse(stored);
    }
  }

  // Bookmark management
  addBookmark(title: string): void {
    this.bookmarks.add(title);
    this.saveBookmarks();
  }

  removeBookmark(title: string): void {
    this.bookmarks.delete(title);
    this.saveBookmarks();
  }

  getBookmarks(): string[] {
    return Array.from(this.bookmarks);
  }

  isBookmarked(title: string): boolean {
    return this.bookmarks.has(title);
  }

  private saveBookmarks(): void {
    localStorage.setItem('wikiBookmarks', JSON.stringify(Array.from(this.bookmarks)));
  }

  loadBookmarks(): void {
    const stored = localStorage.getItem('wikiBookmarks');
    if (stored) {
      this.bookmarks = new Set(JSON.parse(stored));
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }

  // Get cache size
  getCacheSize(): number {
    return this.cache.size;
  }
}

export const wikiService = new WikiService();
export default wikiService;
