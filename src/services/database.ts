import { openDB, DBSchema, IDBPDatabase } from 'idb'

// Database schema
interface RS3NexusDB extends DBSchema {
  tasks: {
    key: string
    value: Task
    indexes: { 'by-status': string }
  }
  settings: {
    key: string
    value: any
  }
  priceAlerts: {
    key: string
    value: PriceAlert
    indexes: { 'by-item': number }
  }
  history: {
    key: string
    value: HistoryEntry
    indexes: { 'by-date': number }
  }
}

// Types
export interface Task {
  id: string
  title: string
  description: string
  skill?: string
  currentXp?: number
  targetXp?: number
  targetLevel?: number
  status: 'active' | 'completed' | 'paused'
  createdAt: number
  completedAt?: number
}

export interface PriceAlert {
  id: string
  itemId: number
  itemName: string
  targetPrice: number
  condition: 'above' | 'below'
  enabled: boolean
  createdAt: number
}

export interface HistoryEntry {
  id: string
  type: 'task' | 'price' | 'level' | 'other'
  title: string
  description: string
  timestamp: number
}

/**
 * Database service for local storage
 */
class DatabaseService {
  private db: IDBPDatabase<RS3NexusDB> | null = null
  private readonly DB_NAME = 'rs3-nexus-db'
  private readonly DB_VERSION = 1

  /**
   * Initialize database
   */
  async init(): Promise<void> {
    if (this.db) return

    this.db = await openDB<RS3NexusDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Tasks store
        if (!db.objectStoreNames.contains('tasks')) {
          const taskStore = db.createObjectStore('tasks', { keyPath: 'id' })
          taskStore.createIndex('by-status', 'status')
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings')
        }

        // Price alerts store
        if (!db.objectStoreNames.contains('priceAlerts')) {
          const alertStore = db.createObjectStore('priceAlerts', { keyPath: 'id' })
          alertStore.createIndex('by-item', 'itemId')
        }

        // History store
        if (!db.objectStoreNames.contains('history')) {
          const historyStore = db.createObjectStore('history', { keyPath: 'id' })
          historyStore.createIndex('by-date', 'timestamp')
        }
      },
    })
  }

  /**
   * Ensure database is initialized
   */
  private async ensureInit(): Promise<IDBPDatabase<RS3NexusDB>> {
    if (!this.db) {
      await this.init()
    }
    return this.db!
  }

  // Task operations
  async addTask(task: Task): Promise<void> {
    const db = await this.ensureInit()
    await db.add('tasks', task)
  }

  async getTask(id: string): Promise<Task | undefined> {
    const db = await this.ensureInit()
    return db.get('tasks', id)
  }

  async getAllTasks(): Promise<Task[]> {
    const db = await this.ensureInit()
    return db.getAll('tasks')
  }

  async getTasksByStatus(status: string): Promise<Task[]> {
    const db = await this.ensureInit()
    return db.getAllFromIndex('tasks', 'by-status', status)
  }

  async updateTask(task: Task): Promise<void> {
    const db = await this.ensureInit()
    await db.put('tasks', task)
  }

  async deleteTask(id: string): Promise<void> {
    const db = await this.ensureInit()
    await db.delete('tasks', id)
  }

  // Settings operations
  async getSetting(key: string): Promise<any> {
    const db = await this.ensureInit()
    return db.get('settings', key)
  }

  async setSetting(key: string, value: any): Promise<void> {
    const db = await this.ensureInit()
    await db.put('settings', value, key)
  }

  async deleteSetting(key: string): Promise<void> {
    const db = await this.ensureInit()
    await db.delete('settings', key)
  }

  // Price alert operations
  async addPriceAlert(alert: PriceAlert): Promise<void> {
    const db = await this.ensureInit()
    await db.add('priceAlerts', alert)
  }

  async getPriceAlert(id: string): Promise<PriceAlert | undefined> {
    const db = await this.ensureInit()
    return db.get('priceAlerts', id)
  }

  async getAllPriceAlerts(): Promise<PriceAlert[]> {
    const db = await this.ensureInit()
    return db.getAll('priceAlerts')
  }

  async updatePriceAlert(alert: PriceAlert): Promise<void> {
    const db = await this.ensureInit()
    await db.put('priceAlerts', alert)
  }

  async deletePriceAlert(id: string): Promise<void> {
    const db = await this.ensureInit()
    await db.delete('priceAlerts', id)
  }

  // History operations
  async addHistory(entry: HistoryEntry): Promise<void> {
    const db = await this.ensureInit()
    await db.add('history', entry)
  }

  async getHistory(limit: number = 50): Promise<HistoryEntry[]> {
    const db = await this.ensureInit()
    const tx = db.transaction('history', 'readonly')
    const index = tx.store.index('by-date')
    
    let entries: HistoryEntry[] = []
    let cursor = await index.openCursor(null, 'prev')
    
    while (cursor && entries.length < limit) {
      entries.push(cursor.value)
      cursor = await cursor.continue()
    }
    
    return entries
  }

  async clearHistory(): Promise<void> {
    const db = await this.ensureInit()
    await db.clear('history')
  }

  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    const db = await this.ensureInit()
    await db.clear('tasks')
    await db.clear('settings')
    await db.clear('priceAlerts')
    await db.clear('history')
  }
}

// Export singleton instance
export const database = new DatabaseService()
export default database
