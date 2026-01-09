import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Screen capture
  getSources: () => ipcRenderer.invoke('get-sources'),
  
  // Window controls
  setAlwaysOnTop: (alwaysOnTop) => ipcRenderer.invoke('set-always-on-top', alwaysOnTop),
  setOpacity: (opacity) => ipcRenderer.invoke('set-opacity', opacity),
  getScreenSize: () => ipcRenderer.invoke('get-screen-size'),
  
  // Notifications
  showNotification: (options) => ipcRenderer.invoke('show-notification', options),
  
  // Platform info
  platform: process.platform,
})

// Add TypeScript definitions
declare global {
  interface Window {
    electronAPI: {
      getSources: () => Promise<Array<{id: string; name: string; thumbnail: string}>>;
      setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<boolean>;
      setOpacity: (opacity: number) => Promise<number>;
      getScreenSize: () => Promise<{width: number; height: number}>;
      showNotification: (options: {title: string; body: string; icon?: string}) => Promise<boolean>;
      platform: string;
    }
  }
}
