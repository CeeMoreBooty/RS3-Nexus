import { app, BrowserWindow, ipcMain, screen, desktopCapturer } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let mainWindow

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    frame: true,
    transparent: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../public/assets/icon.png'),
  })

  // Load the app
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC Handlers

// Screen capture handler
ipcMain.handle('get-sources', async () => {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['window', 'screen'],
      thumbnailSize: { width: 1920, height: 1080 }
    })
    return sources.map(source => ({
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL()
    }))
  } catch (error) {
    console.error('Error getting sources:', error)
    return []
  }
})

// Always on top toggle
ipcMain.handle('set-always-on-top', async (event, alwaysOnTop) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(alwaysOnTop)
    return alwaysOnTop
  }
  return false
})

// Window opacity control
ipcMain.handle('set-opacity', async (event, opacity) => {
  if (mainWindow) {
    mainWindow.setOpacity(opacity)
    return opacity
  }
  return 1
})

// Get screen size
ipcMain.handle('get-screen-size', async () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  return { width, height }
})

// Notification handler
ipcMain.handle('show-notification', async (event, options) => {
  const { Notification } = require('electron')
  if (Notification.isSupported()) {
    new Notification(options).show()
    return true
  }
  return false
})
