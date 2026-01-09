import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    title: 'RS3 Nexus',
    icon: path.join(__dirname, '../public/icon.png'),
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for services
ipcMain.handle('get-price', async (_, itemName: string) => {
  // Price service will be implemented
  console.log('Price requested for:', itemName);
  return { itemName, price: 0 };
});

ipcMain.handle('solve-clue', async (_, clueText: string) => {
  // Clue solver will be implemented
  console.log('Clue to solve:', clueText);
  return { solution: 'Unknown' };
});

ipcMain.handle('search-wiki', async (_, query: string) => {
  // Wiki search will be implemented
  console.log('Wiki search for:', query);
  return { results: [] };
});
