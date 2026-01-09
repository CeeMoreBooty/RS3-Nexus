import { useState, useEffect } from 'react'
import { apiService, PriceData } from '../services/api'
import { database, PriceAlert } from '../services/database'
import { notifications } from '../services/notifications'
import { formatNumber, calculateProfit, calculateProfitMargin } from '../utils/calculators'

function PriceChecker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [quantity, setQuantity] = useState(1)

  // Popular items for quick access
  const popularItems = [
    { id: 995, name: 'Coins' },
    { id: 29492, name: 'Bond' },
    { id: 1511, name: 'Logs' },
    { id: 2349, name: 'Bronze bar' },
  ]

  useEffect(() => {
    loadAlerts()
  }, [])

  const loadAlerts = async () => {
    try {
      const allAlerts = await database.getAllPriceAlerts()
      setAlerts(allAlerts)
    } catch (error) {
      console.error('Error loading alerts:', error)
    }
  }

  const searchItem = async (itemId: number) => {
    setLoading(true)
    try {
      const price = await apiService.getItemPrice(itemId)
      if (price) {
        setSelectedItem(price)
      } else {
        notifications.notifyWarning('Item not found')
      }
    } catch (error) {
      console.error('Error searching item:', error)
      notifications.notifyWarning('Failed to fetch item price')
    } finally {
      setLoading(false)
    }
  }

  const addAlert = async () => {
    if (!selectedItem) return

    const alert: PriceAlert = {
      id: Date.now().toString(),
      itemId: selectedItem.id,
      itemName: selectedItem.name || `Item ${selectedItem.id}`,
      targetPrice: selectedItem.price,
      condition: 'below',
      enabled: true,
      createdAt: Date.now(),
    }

    try {
      await database.addPriceAlert(alert)
      await loadAlerts()
      notifications.notifyInfo('Price alert added!')
    } catch (error) {
      console.error('Error adding alert:', error)
    }
  }

  const deleteAlert = async (id: string) => {
    try {
      await database.deletePriceAlert(id)
      await loadAlerts()
    } catch (error) {
      console.error('Error deleting alert:', error)
    }
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Price Checker</h2>
        <p>Check Grand Exchange prices and set price alerts</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Search Item</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Enter item ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && searchTerm) {
                  searchItem(parseInt(searchTerm))
                }
              }}
              style={{ width: '100%', marginBottom: '0.5rem' }}
            />
            <button 
              onClick={() => searchTerm && searchItem(parseInt(searchTerm))}
              disabled={loading || !searchTerm}
              style={{ width: '100%' }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>Quick Search</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {popularItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => searchItem(item.id)}
                  style={{ fontSize: '0.9rem', padding: '0.5rem' }}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Item Details</h3>
          
          {!selectedItem ? (
            <p style={{ color: 'var(--text-secondary)' }}>Search for an item to see details</p>
          ) : (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {selectedItem.name || `Item ${selectedItem.id}`}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Item ID: {selectedItem.id}
                </p>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(2, 1fr)', 
                gap: '1rem',
                marginBottom: '1.5rem'
              }}>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    High Price
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
                    {formatNumber(selectedItem.high)} gp
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    Low Price
                  </p>
                  <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--error)' }}>
                    {formatNumber(selectedItem.low)} gp
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                  Quantity
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  min="1"
                  style={{ width: '100%' }}
                />
              </div>

              {selectedItem.high > 0 && selectedItem.low > 0 && (
                <div style={{ 
                  padding: '1rem', 
                  backgroundColor: 'var(--bg-tertiary)', 
                  borderRadius: '6px',
                  marginBottom: '1rem'
                }}>
                  <h4 style={{ marginBottom: '0.5rem' }}>Profit Calculation</h4>
                  <p>
                    Margin: {formatNumber(calculateProfit(selectedItem.high, selectedItem.low, quantity))} gp
                  </p>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    ({calculateProfitMargin(selectedItem.high, selectedItem.low).toFixed(2)}%)
                  </p>
                </div>
              )}

              <button onClick={addAlert} style={{ width: '100%' }}>
                Add Price Alert
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Price Alerts</h3>
        
        {alerts.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No price alerts set</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map(alert => (
              <div
                key={alert.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '6px'
                }}
              >
                <div>
                  <h4>{alert.itemName}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Alert when {alert.condition} {formatNumber(alert.targetPrice)} gp
                  </p>
                </div>
                <button
                  onClick={() => deleteAlert(alert.id)}
                  style={{ backgroundColor: 'var(--error)' }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PriceChecker
