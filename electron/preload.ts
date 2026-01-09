import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getPrice: (itemName: string) => ipcRenderer.invoke('get-price', itemName),
  solveClue: (clueText: string) => ipcRenderer.invoke('solve-clue', clueText),
  searchWiki: (query: string) => ipcRenderer.invoke('search-wiki', query),
});
