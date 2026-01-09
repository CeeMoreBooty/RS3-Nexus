import { useState, useEffect } from 'react';
import { discordService } from '../services/discord';
import { DiscordSettings as DiscordSettingsType } from '../types';
import './Settings.css';

function Settings() {
  const [discordSettings, setDiscordSettings] = useState<DiscordSettingsType>({
    enabled: false,
    richPresence: false,
    notifications: {
      priceAlerts: true,
      clueCompletions: true,
      events: true,
    },
  });

  const [webhookUrl, setWebhookUrl] = useState('');
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(30);

  useEffect(() => {
    // Load settings
    discordService.loadSettings();
    const settings = discordService.getSettings();
    setDiscordSettings(settings);
    setWebhookUrl(settings.webhookUrl || '');

    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(storedTheme);

    const storedAutoRefresh = localStorage.getItem('autoRefresh') === 'true';
    setAutoRefresh(storedAutoRefresh);

    const storedInterval = parseInt(localStorage.getItem('refreshInterval') || '30');
    setRefreshInterval(storedInterval);
  }, []);

  const handleDiscordToggle = (enabled: boolean) => {
    const newSettings = { ...discordSettings, enabled };
    setDiscordSettings(newSettings);
    discordService.updateSettings(newSettings);
  };

  const handleRichPresenceToggle = (richPresence: boolean) => {
    const newSettings = { ...discordSettings, richPresence };
    setDiscordSettings(newSettings);
    discordService.updateSettings(newSettings);
  };

  const handleNotificationToggle = (key: keyof DiscordSettingsType['notifications'], value: boolean) => {
    const newSettings = {
      ...discordSettings,
      notifications: {
        ...discordSettings.notifications,
        [key]: value,
      },
    };
    setDiscordSettings(newSettings);
    discordService.updateSettings(newSettings);
  };

  const handleWebhookSave = () => {
    const newSettings = { ...discordSettings, webhookUrl };
    setDiscordSettings(newSettings);
    discordService.updateSettings(newSettings);
    alert('Webhook URL saved successfully!');
  };

  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      alert('Please enter a webhook URL first.');
      return;
    }

    setTestingWebhook(true);
    const success = await discordService.testWebhook(webhookUrl);
    setTestingWebhook(false);

    if (success) {
      alert('✅ Webhook test successful! Check your Discord channel.');
    } else {
      alert('❌ Webhook test failed. Please check the URL and try again.');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // Apply theme (would need CSS variables setup)
    document.body.classList.toggle('dark-theme', newTheme === 'dark');
  };

  const handleAutoRefreshChange = (enabled: boolean) => {
    setAutoRefresh(enabled);
    localStorage.setItem('autoRefresh', enabled.toString());
  };

  const handleIntervalChange = (interval: number) => {
    setRefreshInterval(interval);
    localStorage.setItem('refreshInterval', interval.toString());
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all app data? This cannot be undone.')) {
      localStorage.clear();
      alert('All data cleared. Please refresh the page.');
    }
  };

  return (
    <div className="settings">
      <div className="settings-container">
        <h2>⚙️ Settings</h2>

        {/* Discord Integration */}
        <div className="settings-section">
          <h3>💬 Discord Integration</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Enable Discord Integration</span>
              <span className="setting-description">
                Connect RS3 Nexus with Discord for notifications and rich presence
              </span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={discordSettings.enabled}
                onChange={(e) => handleDiscordToggle(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {discordSettings.enabled && (
            <>
              <div className="setting-item">
                <div className="setting-info">
                  <span className="setting-label">Rich Presence</span>
                  <span className="setting-description">
                    Show your RS3 Nexus activity on Discord
                  </span>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={discordSettings.richPresence}
                    onChange={(e) => handleRichPresenceToggle(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="webhook-section">
                <label className="webhook-label">
                  Discord Webhook URL
                  <span className="help-text">
                    Create a webhook in your Discord server settings to receive notifications
                  </span>
                </label>
                <div className="webhook-input-group">
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                    className="webhook-input"
                  />
                  <button onClick={handleWebhookSave} className="save-btn">
                    💾 Save
                  </button>
                  <button
                    onClick={handleTestWebhook}
                    disabled={testingWebhook}
                    className="test-btn"
                  >
                    {testingWebhook ? '⏳ Testing...' : '🧪 Test'}
                  </button>
                </div>
              </div>

              <div className="notifications-section">
                <h4>🔔 Notification Settings</h4>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Price Alerts</span>
                    <span className="setting-description">
                      Get notified when price alerts trigger
                    </span>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={discordSettings.notifications.priceAlerts}
                      onChange={(e) => handleNotificationToggle('priceAlerts', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Clue Completions</span>
                    <span className="setting-description">
                      Get notified when you complete clue scrolls
                    </span>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={discordSettings.notifications.clueCompletions}
                      onChange={(e) => handleNotificationToggle('clueCompletions', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <span className="setting-label">Event Notifications</span>
                    <span className="setting-description">
                      Get notified about in-game events
                    </span>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={discordSettings.notifications.events}
                      onChange={(e) => handleNotificationToggle('events', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="discord-commands">
                <h4>📝 Available Discord Commands</h4>
                <div className="commands-list">
                  <div className="command-item">
                    <code>/price &lt;item&gt;</code>
                    <span>Check item prices</span>
                  </div>
                  <div className="command-item">
                    <code>/clue &lt;text&gt;</code>
                    <span>Solve clue scrolls</span>
                  </div>
                  <div className="command-item">
                    <code>/wiki &lt;query&gt;</code>
                    <span>Search the wiki</span>
                  </div>
                  <div className="command-item">
                    <code>/event</code>
                    <span>Check upcoming events</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* General Settings */}
        <div className="settings-section">
          <h3>🎨 Appearance</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Theme</span>
              <span className="setting-description">Choose your preferred color scheme</span>
            </div>
            <div className="theme-selector">
              <button
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                ☀️ Light
              </button>
              <button
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                🌙 Dark
              </button>
            </div>
          </div>
        </div>

        {/* Price Checker Settings */}
        <div className="settings-section">
          <h3>💰 Price Checker</h3>
          
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Auto-Refresh</span>
              <span className="setting-description">
                Automatically refresh prices for selected items
              </span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => handleAutoRefreshChange(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {autoRefresh && (
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-label">Refresh Interval</span>
                <span className="setting-description">
                  How often to refresh prices (in seconds)
                </span>
              </div>
              <select
                value={refreshInterval}
                onChange={(e) => handleIntervalChange(parseInt(e.target.value))}
                className="interval-select"
              >
                <option value="15">15 seconds</option>
                <option value="30">30 seconds</option>
                <option value="60">1 minute</option>
                <option value="300">5 minutes</option>
              </select>
            </div>
          )}
        </div>

        {/* Data Management */}
        <div className="settings-section">
          <h3>🗄️ Data Management</h3>
          
          <div className="data-actions">
            <button onClick={clearAllData} className="danger-btn">
              🗑️ Clear All Data
            </button>
            <p className="warning-text">
              ⚠️ This will delete all favorites, alerts, history, and settings
            </p>
          </div>
        </div>

        {/* About */}
        <div className="settings-section">
          <h3>ℹ️ About</h3>
          <div className="about-info">
            <p><strong>RS3 Nexus</strong> v1.0.0</p>
            <p>Enhanced Alt1 Toolkit for RuneScape 3</p>
            <p className="disclaimer">
              This tool is not affiliated with or endorsed by Jagex. 
              RuneScape is a registered trademark of Jagex Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
