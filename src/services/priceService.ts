// Price Service - Real-time price checking and calculations
import { apiService } from './api';
import { ItemPrice, PriceHistory, PriceAlert } from '../types';

class PriceService {
  private cache: Map<string, { data: ItemPrice; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private alerts: PriceAlert[] = [];
  // WebSocket connection for real-time updates (placeholder for future implementation)
  // private wsConnection: WebSocket | null = null;

  // Get current item price with caching
  async getPrice(itemName: string): Promise<ItemPrice | null> {
    const cached = this.cache.get(itemName);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Use RS Wiki API to get price data
      const data = await apiService.getGEData(`/exchange/history/rs/latest?name=${encodeURIComponent(itemName)}`);
      
      if (data) {
        const priceData: ItemPrice = {
          id: (data as any).id || 0,
          name: itemName,
          current: (data as any).price || 0,
          today: (data as any).today || 0,
          members: (data as any).members !== false,
          buyLimit: (data as any).limit,
          trend: this.calculateTrend((data as any).price, (data as any).today),
        };

        this.cache.set(itemName, { data: priceData, timestamp: Date.now() });
        this.checkAlerts(priceData);
        return priceData;
      }
    } catch (error) {
      console.error(`Failed to fetch price for ${itemName}:`, error);
    }

    return null;
  }

  // Get price history
  async getPriceHistory(_itemName: string, days: number): Promise<PriceHistory[]> {
    try {
      // Simulate history data - replace with real API call
      const history: PriceHistory[] = [];
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        history.push({
          timestamp: date.getTime(),
          price: Math.floor(Math.random() * 10000) + 1000,
        });
      }

      return history;
    } catch (error) {
      console.error('Failed to fetch price history:', error);
      return [];
    }
  }

  // Bulk price check
  async getBulkPrices(itemNames: string[]): Promise<ItemPrice[]> {
    const promises = itemNames.map(name => this.getPrice(name));
    const results = await Promise.all(promises);
    return results.filter((p): p is ItemPrice => p !== null);
  }

  // Calculate profit margin
  calculateMargin(buyPrice: number, sellPrice: number, quantity: number = 1): number {
    const tax = sellPrice * 0.01; // 1% GE tax
    const profit = (sellPrice - tax - buyPrice) * quantity;
    return Math.floor(profit);
  }

  // Calculate ROI
  calculateROI(buyPrice: number, sellPrice: number): number {
    const margin = this.calculateMargin(buyPrice, sellPrice);
    return (margin / buyPrice) * 100;
  }

  // Add price alert
  addAlert(alert: PriceAlert): void {
    this.alerts.push(alert);
    this.saveAlerts();
  }

  // Remove price alert
  removeAlert(id: string): void {
    this.alerts = this.alerts.filter(a => a.id !== id);
    this.saveAlerts();
  }

  // Check if any alerts should trigger
  private checkAlerts(price: ItemPrice): void {
    this.alerts.forEach(alert => {
      if (!alert.active) return;

      const shouldTrigger =
        (alert.type === 'buy' && price.current <= alert.targetPrice) ||
        (alert.type === 'sell' && price.current >= alert.targetPrice);

      if (shouldTrigger) {
        this.triggerAlert(alert, price);
      }
    });
  }

  // Trigger an alert notification
  private triggerAlert(alert: PriceAlert, price: ItemPrice): void {
    console.log(`Alert triggered for ${alert.itemName} at ${price.current}gp`);
    // Implement notification system here
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Price Alert: ${alert.itemName}`, {
        body: `${alert.type === 'buy' ? 'Buy' : 'Sell'} price target reached: ${price.current}gp`,
        icon: price.icon,
      });
    }
  }

  // Calculate trend
  private calculateTrend(current: number, previous: number): 'rising' | 'falling' | 'stable' {
    const change = ((current - previous) / previous) * 100;
    if (change > 1) return 'rising';
    if (change < -1) return 'falling';
    return 'stable';
  }

  // Get trending items
  async getTrendingItems(limit: number = 10): Promise<ItemPrice[]> {
    // This would fetch from a real trending API
    const sampleItems = [
      'Blue partyhat', 'Dragon bones', 'Raw shark', 'Magic logs',
      'Rune platebody', 'Abyssal whip', 'Dragon scimitar',
    ];

    return this.getBulkPrices(sampleItems.slice(0, limit));
  }

  // Save alerts to localStorage
  private saveAlerts(): void {
    localStorage.setItem('priceAlerts', JSON.stringify(this.alerts));
  }

  // Load alerts from localStorage
  loadAlerts(): void {
    const stored = localStorage.getItem('priceAlerts');
    if (stored) {
      this.alerts = JSON.parse(stored);
    }
  }

  // Initialize WebSocket for real-time updates
  initWebSocket(): void {
    // Placeholder for WebSocket implementation
    // this.wsConnection = new WebSocket('wss://api.example.com/prices');
  }

  // Export price data
  exportData(prices: ItemPrice[], format: 'csv' | 'json'): string {
    if (format === 'json') {
      return JSON.stringify(prices, null, 2);
    }

    // CSV format
    const headers = ['Name', 'Current Price', 'Today Change', 'Members', 'Buy Limit'];
    const rows = prices.map(p => [
      p.name,
      p.current.toString(),
      p.today.toString(),
      p.members ? 'Yes' : 'No',
      p.buyLimit?.toString() || 'N/A',
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

export const priceService = new PriceService();
export default priceService;
