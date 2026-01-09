import { useState, useEffect, useCallback, memo } from 'react';
import { priceService } from '../services/priceService';
import { ItemPrice, PriceAlert } from '../types';
import PriceChart from './PriceChart';
import './PriceChecker.css';

const PriceChecker = memo(() => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<ItemPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [bulkItems, setBulkItems] = useState<string>('');
  const [bulkResults, setBulkResults] = useState<ItemPrice[]>([]);
  const [trending, setTrending] = useState<ItemPrice[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [chartDays, setChartDays] = useState(7);
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    loadFavorites();
    loadTrending();

    // Auto-refresh setup
    let interval: NodeJS.Timeout;
    if (autoRefresh && selectedItem) {
      interval = setInterval(() => {
        handleSearch(selectedItem.name);
      }, 30000); // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, selectedItem]);

  const loadFavorites = () => {
    const stored = localStorage.getItem('priceFavorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };

  const loadTrending = async () => {
    const items = await priceService.getTrendingItems(5);
    setTrending(items);
  };

  const handleSearch = async (itemName?: string) => {
    const name = itemName || searchTerm;
    if (!name.trim()) return;

    setLoading(true);
    try {
      const price = await priceService.getPrice(name);
      if (price) {
        setSelectedItem(price);
        setShowChart(false);
      } else {
        alert('Item not found. Please check the name and try again.');
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert('Failed to fetch price. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSearch = async () => {
    if (!bulkItems.trim()) return;

    setLoading(true);
    const items = bulkItems.split('\n').filter(i => i.trim());
    try {
      const results = await priceService.getBulkPrices(items);
      setBulkResults(results);
    } catch (error) {
      console.error('Bulk search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (itemName: string) => {
    const newFavorites = favorites.includes(itemName)
      ? favorites.filter(f => f !== itemName)
      : [...favorites, itemName];
    
    setFavorites(newFavorites);
    localStorage.setItem('priceFavorites', JSON.stringify(newFavorites));
  };

  const addAlert = () => {
    if (!selectedItem) return;

    const targetPrice = prompt('Enter target price (in gp):');
    if (!targetPrice) return;

    const type = confirm('Click OK for BUY alert, Cancel for SELL alert') ? 'buy' : 'sell';

    const alert: PriceAlert = {
      id: Date.now().toString(),
      itemName: selectedItem.name,
      targetPrice: parseInt(targetPrice),
      type,
      active: true,
    };

    priceService.addAlert(alert);
    setAlerts([...alerts, alert]);
  };

  const calculateMargin = useCallback(() => {
    if (!selectedItem) return null;

    const buyPrice = selectedItem.current;
    const sellPrice = prompt('Enter sell price (in gp):', selectedItem.current.toString());
    if (!sellPrice) return null;

    const quantity = prompt('Enter quantity:', '1');
    if (!quantity) return null;

    const margin = priceService.calculateMargin(buyPrice, parseInt(sellPrice), parseInt(quantity));
    const roi = priceService.calculateROI(buyPrice, parseInt(sellPrice));

    return { margin, roi };
  }, [selectedItem]);

  const showMarginCalculator = () => {
    const result = calculateMargin();
    if (result) {
      alert(`Margin: ${result.margin.toLocaleString()}gp\nROI: ${result.roi.toFixed(2)}%`);
    }
  };

  const exportData = () => {
    const format = confirm('Click OK for CSV, Cancel for JSON') ? 'csv' : 'json';
    const data = bulkResults.length > 0 ? bulkResults : selectedItem ? [selectedItem] : [];
    
    if (data.length === 0) {
      alert('No data to export. Search for items first.');
      return;
    }

    const exported = priceService.exportData(data, format);
    const blob = new Blob([exported], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prices-${Date.now()}.${format}`;
    a.click();
  };

  const getTrendIcon = (trend?: 'rising' | 'falling' | 'stable') => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➡️';
    }
  };

  return (
    <div className="price-checker">
      <div className="price-checker-container">
        <div className="search-section">
          <h2>🔍 Item Search</h2>
          <div className="search-bar">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter item name (e.g., Dragon bones)"
              className="search-input"
            />
            <button onClick={() => handleSearch()} disabled={loading} className="search-button">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="quick-actions">
            <label className="auto-refresh">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              Auto-refresh (30s)
            </label>
            <button onClick={exportData} className="action-btn">📊 Export Data</button>
          </div>
        </div>

        {selectedItem && (
          <div className="item-details fade-in">
            <div className="item-header">
              <h3>{selectedItem.name}</h3>
              <button
                onClick={() => toggleFavorite(selectedItem.name)}
                className="favorite-btn"
              >
                {favorites.includes(selectedItem.name) ? '⭐' : '☆'}
              </button>
            </div>

            <div className="price-info">
              <div className="price-card">
                <span className="price-label">Current Price</span>
                <span className="price-value">
                  {selectedItem.current.toLocaleString()} gp {getTrendIcon(selectedItem.trend)}
                </span>
              </div>
              <div className="price-card">
                <span className="price-label">Today's Change</span>
                <span className={`price-value ${selectedItem.today >= 0 ? 'positive' : 'negative'}`}>
                  {selectedItem.today >= 0 ? '+' : ''}{selectedItem.today.toLocaleString()} gp
                </span>
              </div>
              {selectedItem.buyLimit && (
                <div className="price-card">
                  <span className="price-label">Buy Limit</span>
                  <span className="price-value">{selectedItem.buyLimit.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="action-buttons">
              <button onClick={() => setShowChart(!showChart)} className="action-btn">
                {showChart ? '📊 Hide Chart' : '📈 Show Price History'}
              </button>
              <button onClick={showMarginCalculator} className="action-btn">
                💰 Calculate Margin
              </button>
              <button onClick={addAlert} className="action-btn">
                🔔 Set Alert
              </button>
            </div>

            {showChart && (
              <div className="chart-section fade-in">
                <div className="chart-controls">
                  <button onClick={() => setChartDays(7)} className={chartDays === 7 ? 'active' : ''}>7 Days</button>
                  <button onClick={() => setChartDays(30)} className={chartDays === 30 ? 'active' : ''}>30 Days</button>
                  <button onClick={() => setChartDays(90)} className={chartDays === 90 ? 'active' : ''}>90 Days</button>
                </div>
                <PriceChart itemName={selectedItem.name} days={chartDays} />
              </div>
            )}
          </div>
        )}

        <div className="favorites-section">
          <h3>⭐ Favorites</h3>
          <div className="favorites-list">
            {favorites.length === 0 ? (
              <p className="empty-state">No favorites yet. Add items to quick access them!</p>
            ) : (
              favorites.map(fav => (
                <button
                  key={fav}
                  onClick={() => handleSearch(fav)}
                  className="favorite-item"
                >
                  {fav}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="trending-section">
          <h3>🔥 Trending Items</h3>
          <div className="trending-list">
            {trending.map(item => (
              <div key={item.name} className="trending-item" onClick={() => handleSearch(item.name)}>
                <span className="trending-name">{item.name}</span>
                <span className="trending-price">{item.current.toLocaleString()} gp</span>
                <span className="trending-trend">{getTrendIcon(item.trend)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bulk-section">
          <h3>📋 Bulk Price Check</h3>
          <textarea
            value={bulkItems}
            onChange={(e) => setBulkItems(e.target.value)}
            placeholder="Enter item names (one per line)"
            className="bulk-input"
            rows={5}
          />
          <button onClick={handleBulkSearch} disabled={loading} className="search-button">
            Check Prices
          </button>

          {bulkResults.length > 0 && (
            <div className="bulk-results fade-in">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Change</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {bulkResults.map(item => (
                    <tr key={item.name}>
                      <td>{item.name}</td>
                      <td>{item.current.toLocaleString()} gp</td>
                      <td className={item.today >= 0 ? 'positive' : 'negative'}>
                        {item.today >= 0 ? '+' : ''}{item.today.toLocaleString()} gp
                      </td>
                      <td>{getTrendIcon(item.trend)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PriceChecker.displayName = 'PriceChecker';

export default PriceChecker;
