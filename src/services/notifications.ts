import { NOTIFICATION_TYPES } from '../utils/constants'

// Types
export interface NotificationOptions {
  title: string
  body: string
  icon?: string
  type?: keyof typeof NOTIFICATION_TYPES
  duration?: number
  sound?: boolean
}

/**
 * Notification service
 */
class NotificationService {
  private enabled: boolean = true
  private soundEnabled: boolean = true
  private desktopEnabled: boolean = true

  /**
   * Show notification
   */
  async show(options: NotificationOptions): Promise<void> {
    if (!this.enabled) return

    // Show in-app notification (would be handled by React components)
    this.showInApp(options)

    // Show desktop notification if enabled
    if (this.desktopEnabled) {
      await this.showDesktop(options)
    }

    // Play sound if enabled
    if (this.soundEnabled && options.sound !== false) {
      this.playSound(options.type || 'INFO')
    }
  }

  /**
   * Show in-app notification
   */
  private showInApp(options: NotificationOptions): void {
    // Dispatch custom event for React to listen to
    const event = new CustomEvent('rs3-notification', {
      detail: options
    })
    window.dispatchEvent(event)
  }

  /**
   * Show desktop notification
   */
  private async showDesktop(options: NotificationOptions): Promise<void> {
    try {
      // Check if running in Electron
      if (window.electronAPI) {
        await window.electronAPI.showNotification({
          title: options.title,
          body: options.body,
          icon: options.icon,
        })
      } else if ('Notification' in window) {
        // Fallback to web notification API
        if (Notification.permission === 'granted') {
          new Notification(options.title, {
            body: options.body,
            icon: options.icon,
          })
        } else if (Notification.permission !== 'denied') {
          const permission = await Notification.requestPermission()
          if (permission === 'granted') {
            new Notification(options.title, {
              body: options.body,
              icon: options.icon,
            })
          }
        }
      }
    } catch (error) {
      console.error('Error showing desktop notification:', error)
    }
  }

  /**
   * Play notification sound
   */
  private playSound(type: string): void {
    try {
      // Create audio element for notification sound
      const audio = new Audio()
      
      // Different sounds for different notification types
      switch (type) {
        case NOTIFICATION_TYPES.TASK_COMPLETE:
          audio.src = '/assets/sounds/task-complete.mp3'
          break
        case NOTIFICATION_TYPES.PRICE_ALERT:
          audio.src = '/assets/sounds/price-alert.mp3'
          break
        case NOTIFICATION_TYPES.WARNING:
          audio.src = '/assets/sounds/warning.mp3'
          break
        default:
          audio.src = '/assets/sounds/info.mp3'
      }
      
      audio.volume = 0.5
      audio.play().catch(err => {
        console.error('Error playing notification sound:', err)
      })
    } catch (error) {
      console.error('Error playing sound:', error)
    }
  }

  /**
   * Show task completion notification
   */
  async notifyTaskComplete(taskTitle: string): Promise<void> {
    await this.show({
      title: 'Task Completed!',
      body: taskTitle,
      type: 'TASK_COMPLETE',
      duration: 5000,
    })
  }

  /**
   * Show price alert notification
   */
  async notifyPriceAlert(itemName: string, price: number, condition: string): Promise<void> {
    await this.show({
      title: 'Price Alert!',
      body: `${itemName} is now ${condition} ${price.toLocaleString()} gp`,
      type: 'PRICE_ALERT',
      duration: 7000,
    })
  }

  /**
   * Show level up notification
   */
  async notifyLevelUp(skill: string, level: number): Promise<void> {
    await this.show({
      title: 'Level Up!',
      body: `Congratulations! You reached ${skill} level ${level}`,
      duration: 5000,
    })
  }

  /**
   * Show warning notification
   */
  async notifyWarning(message: string): Promise<void> {
    await this.show({
      title: 'Warning',
      body: message,
      type: 'WARNING',
      duration: 10000,
    })
  }

  /**
   * Show info notification
   */
  async notifyInfo(message: string): Promise<void> {
    await this.show({
      title: 'Info',
      body: message,
      type: 'INFO',
      duration: 5000,
    })
  }

  /**
   * Enable/disable notifications
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * Enable/disable sound
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled
  }

  /**
   * Enable/disable desktop notifications
   */
  setDesktopEnabled(enabled: boolean): void {
    this.desktopEnabled = enabled
  }

  /**
   * Get current settings
   */
  getSettings(): { enabled: boolean; sound: boolean; desktop: boolean } {
    return {
      enabled: this.enabled,
      sound: this.soundEnabled,
      desktop: this.desktopEnabled,
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    return false
  }
}

// Export singleton instance
export const notifications = new NotificationService()
export default notifications
