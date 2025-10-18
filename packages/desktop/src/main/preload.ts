import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),

  // Auto-updater
  onUpdateAvailable: (callback: () => void) => {
    ipcRenderer.on('update-available', callback);
  },
  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', callback);
  },
  restartApp: () => ipcRenderer.invoke('restart-app'),

  // Remove listeners
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Type definitions for the exposed API
declare global {
  interface Window {
    electronAPI: {
      getAppVersion: () => Promise<string>;
      getPlatform: () => Promise<string>;
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      restartApp: () => Promise<void>;
      removeAllListeners: (channel: string) => void;
    };
  }
}
