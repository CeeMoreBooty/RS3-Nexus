// Discord Integration Service
import { DiscordSettings } from '../types';

class DiscordService {
  private settings: DiscordSettings = {
    enabled: false,
    richPresence: false,
    notifications: {
      priceAlerts: true,
      clueCompletions: true,
      events: true,
    },
  };

  private webhookUrl: string | null = null;

  // Initialize Discord integration
  init(settings: DiscordSettings): void {
    this.settings = settings;
    this.webhookUrl = settings.webhookUrl || null;

    if (settings.enabled && settings.richPresence) {
      this.enableRichPresence();
    }
  }

  // Send webhook notification
  async sendNotification(
    title: string,
    description: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ): Promise<void> {
    if (!this.webhookUrl || !this.settings.enabled) return;

    const colors = {
      info: 0x3498db,
      success: 0x2ecc71,
      warning: 0xf39c12,
      error: 0xe74c3c,
    };

    const embed = {
      title,
      description,
      color: colors[type],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'RS3 Nexus',
      },
    };

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [embed],
        }),
      });
    } catch (error) {
      console.error('Failed to send Discord notification:', error);
    }
  }

  // Send price alert
  async notifyPriceAlert(itemName: string, price: number, type: 'buy' | 'sell'): Promise<void> {
    if (!this.settings.notifications.priceAlerts) return;

    await this.sendNotification(
      '💰 Price Alert',
      `**${itemName}** has reached your ${type} target price: **${price.toLocaleString()}gp**`,
      'success'
    );
  }

  // Send clue completion notification
  async notifyClueCompletion(tier: string, reward: number): Promise<void> {
    if (!this.settings.notifications.clueCompletions) return;

    await this.sendNotification(
      '🗺️ Clue Scroll Completed',
      `Completed a **${tier}** clue scroll! Reward: **${reward.toLocaleString()}gp**`,
      'success'
    );
  }

  // Send event notification
  async notifyEvent(eventName: string, details: string): Promise<void> {
    if (!this.settings.notifications.events) return;

    await this.sendNotification(
      '📅 Event Notification',
      `**${eventName}**\n${details}`,
      'info'
    );
  }

  // Enable Discord Rich Presence
  private enableRichPresence(): void {
    // In a real implementation, this would use Discord RPC
    console.log('Discord Rich Presence enabled');
  }

  // Update Rich Presence
  updatePresence(activity: string, details?: string): void {
    if (!this.settings.richPresence) return;

    console.log('Rich Presence:', activity, details);
    // Implementation would update Discord RPC
  }

  // Test webhook connection
  async testWebhook(webhookUrl: string): Promise<boolean> {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          embeds: [
            {
              title: '✅ Connection Test',
              description: 'RS3 Nexus Discord integration is working!',
              color: 0x2ecc71,
            },
          ],
        }),
      });
      return true;
    } catch (error) {
      console.error('Webhook test failed:', error);
      return false;
    }
  }

  // Get settings
  getSettings(): DiscordSettings {
    return this.settings;
  }

  // Update settings
  updateSettings(settings: Partial<DiscordSettings>): void {
    this.settings = { ...this.settings, ...settings };
    this.saveSettings();
  }

  // Save settings to localStorage
  private saveSettings(): void {
    localStorage.setItem('discordSettings', JSON.stringify(this.settings));
  }

  // Load settings from localStorage
  loadSettings(): void {
    const stored = localStorage.getItem('discordSettings');
    if (stored) {
      this.settings = JSON.parse(stored);
      this.webhookUrl = this.settings.webhookUrl || null;
    }
  }
}

export const discordService = new DiscordService();
export default discordService;
