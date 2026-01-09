import { useState, useEffect } from 'react'
import { database } from '../services/database'
import { notifications } from '../services/notifications'
import { DEFAULT_SETTINGS } from '../utils/constants'

function Settings() {
  const [alwaysOnTop, setAlwaysOnTop] = useState(false)
  const [opacity, setOpacity] = useState(100)
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: true,
    sound: true,
    desktop: true,
  })
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await database.getSetting('app-settings') || DEFAULT_SETTINGS
      
      setAlwaysOnTop(settings.alwaysOnTop || false)
      setOpacity((settings.opacity || 1) * 100)
      setNotificationSettings(settings.notifications || DEFAULT_SETTINGS.notifications)
      setTheme(settings.theme || 'dark')
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const saveSettings = async () => {
    const settings = {
      alwaysOnTop,
      opacity: opacity / 100,
      notifications: notificationSettings,
      theme,
    }

    try {
      await database.setSetting('app-settings', settings)
      
      // Apply window settings if in Electron
      if (window.electronAPI) {
        await window.electronAPI.setAlwaysOnTop(alwaysOnTop)
        await window.electronAPI.setOpacity(opacity / 100)
      }

      // Apply notification settings
      notifications.setEnabled(notificationSettings.enabled)
      notifications.setSoundEnabled(notificationSettings.sound)
      notifications.setDesktopEnabled(notificationSettings.desktop)

      notifications.notifyInfo('Settings saved successfully!')
    } catch (error) {
      console.error('Error saving settings:', error)
      notifications.notifyWarning('Failed to save settings')
    }
  }

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone!')) {
      try {
        await database.clearAll()
        notifications.notifyInfo('All data cleared')
        window.location.reload()
      } catch (error) {
        console.error('Error clearing data:', error)
        notifications.notifyWarning('Failed to clear data')
      }
    }
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Settings</h2>
        <p>Configure your RS3-Nexus experience</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Window Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Always on Top</label>
                <input
                  type="checkbox"
                  checked={alwaysOnTop}
                  onChange={(e) => setAlwaysOnTop(e.target.checked)}
                  style={{ width: 'auto', cursor: 'pointer' }}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Keep the window on top of other applications
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Opacity</label>
                <span>{opacity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                style={{ width: '100%', cursor: 'pointer' }}
              />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Adjust window transparency
              </p>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{ width: '100%' }}
              >
                <option value="dark">Dark</option>
                <option value="light">Light (Coming Soon)</option>
              </select>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Choose your preferred theme
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Notification Settings</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Enable Notifications</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.enabled}
                  onChange={(e) => setNotificationSettings({ 
                    ...notificationSettings, 
                    enabled: e.target.checked 
                  })}
                  style={{ width: 'auto', cursor: 'pointer' }}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Show in-app notifications
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Sound Notifications</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.sound}
                  onChange={(e) => setNotificationSettings({ 
                    ...notificationSettings, 
                    sound: e.target.checked 
                  })}
                  style={{ width: 'auto', cursor: 'pointer' }}
                  disabled={!notificationSettings.enabled}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Play sound for notifications
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label>Desktop Notifications</label>
                <input
                  type="checkbox"
                  checked={notificationSettings.desktop}
                  onChange={(e) => setNotificationSettings({ 
                    ...notificationSettings, 
                    desktop: e.target.checked 
                  })}
                  style={{ width: 'auto', cursor: 'pointer' }}
                  disabled={!notificationSettings.enabled}
                />
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Show desktop notifications
              </p>
            </div>

            <button 
              onClick={() => notifications.notifyInfo('Test notification')}
              style={{ width: '100%' }}
            >
              Test Notification
            </button>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Actions</h3>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={saveSettings} style={{ flex: 1, backgroundColor: 'var(--success)' }}>
            Save Settings
          </button>
          <button onClick={loadSettings} style={{ flex: 1 }}>
            Reset to Saved
          </button>
        </div>
      </div>

      <div className="card" style={{ borderLeft: '4px solid var(--error)' }}>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--error)' }}>
          Danger Zone
        </h3>
        
        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          These actions are permanent and cannot be undone.
        </p>
        
        <button 
          onClick={clearAllData}
          style={{ backgroundColor: 'var(--error)' }}
        >
          Clear All Data
        </button>
      </div>

      <div className="card mt-4" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>About RS3-Nexus</h3>
        <p style={{ marginBottom: '0.5rem' }}>Version 1.0.0</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          An Enhanced Version of Alt1 for RuneScape 3
        </p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Built with Electron, React, and TypeScript
        </p>
      </div>
    </div>
  )
}

export default Settings
