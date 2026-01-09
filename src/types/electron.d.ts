// Type definitions for Electron API exposed via preload
declare global {
  interface Window {
    electronAPI?: {
      getSources: () => Promise<Array<{id: string; name: string; thumbnail: string}>>;
      setAlwaysOnTop: (alwaysOnTop: boolean) => Promise<boolean>;
      setOpacity: (opacity: number) => Promise<number>;
      getScreenSize: () => Promise<{width: number; height: number}>;
      showNotification: (options: {title: string; body: string; icon?: string}) => Promise<boolean>;
      platform: string;
    }
  }
}

export {}
