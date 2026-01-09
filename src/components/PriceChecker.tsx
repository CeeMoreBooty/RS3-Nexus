/**
 * Price Checker Component
 * Main component for searching and displaying item prices
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '../services/apiService';
import type { Item, ItemPrice } from '../types/api';
import { formatPrice, formatTimeAgo, debounce } from '../utils/helpers';
import { SEARCH_DEBOUNCE_DELAY } from '../utils/constants';
import './PriceChecker.css';

export const PriceChecker: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [itemPrice, setItemPrice] = useState<ItemPrice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const demoMode = import.meta.env.VITE_DEMO_MODE === 'true';

  // Initialize API service
  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true);
        await apiService.loadItemMappings();
        setIsInitialized(true);
      } catch {
        setError('Failed to initialize. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    initialize();
  }, []);

  // Debounced search function
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const results = await apiService.searchItems(query);
      setSearchResults(results.items);
    } catch {
      setError('Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create debounced version using useMemo
  const debouncedSearch = useMemo(
    () => debounce(performSearch, SEARCH_DEBOUNCE_DELAY),
    [performSearch]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle item selection
  const handleItemSelect = async (item: Item) => {
    setSelectedItem(item);
    setSearchQuery('');
    setSearchResults([]);
    setLoading(true);
    setError(null);

    try {
      const price = await apiService.fetchItemPrice(item.id);
      if (price) {
        setItemPrice(price);
      } else {
        setError('Price data not available for this item.');
      }
    } catch {
      setError('Failed to fetch price. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    if (!selectedItem) return;
    await handleItemSelect(selectedItem);
  };

  if (!isInitialized && !error) {
    return (
      <div className="price-checker-container">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading item database...</p>
        </div>
      </div>
    );
  }

  if (!isInitialized && error) {
    return (
      <div className="price-checker-container">
        <header className="price-checker-header">
          <h1>RS3 Price Checker</h1>
          <p className="subtitle">Real-time Grand Exchange prices from RuneScape Wiki</p>
        </header>
        <div className="error-message">
          <span>⚠️ {error}</span>
          <p style={{ marginTop: '1rem' }}>
            This may be due to network restrictions or API unavailability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="price-checker-container">
      <header className="price-checker-header">
        <h1>RS3 Price Checker</h1>
        <p className="subtitle">Real-time Grand Exchange prices from RuneScape Wiki</p>
        {demoMode && (
          <div className="demo-banner">
            ⚠️ Demo Mode - Using sample data
          </div>
        )}
      </header>

      <div className="search-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {loading && searchQuery && (
            <span className="search-loading">Searching...</span>
          )}
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((item) => (
              <div
                key={item.id}
                className="search-result-item"
                onClick={() => handleItemSelect(item)}
              >
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  {item.members && <span className="members-badge">Members</span>}
                </div>
                {item.examine && <p className="item-examine">{item.examine}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
        </div>
      )}

      {itemPrice && selectedItem && (
        <div className="price-display">
          <div className="item-header">
            <h2>{itemPrice.name}</h2>
            <button onClick={handleRefresh} className="refresh-button" disabled={loading}>
              🔄 Refresh
            </button>
          </div>

          <div className="price-grid">
            <div className="price-card buy-price">
              <div className="price-label">Buy Price (High)</div>
              <div className="price-value">{formatPrice(itemPrice.buyPrice)}</div>
            </div>

            <div className="price-card sell-price">
              <div className="price-label">Sell Price (Low)</div>
              <div className="price-value">{formatPrice(itemPrice.sellPrice)}</div>
            </div>
          </div>

          <div className="price-details">
            <div className="detail-row">
              <span className="detail-label">Item ID:</span>
              <span className="detail-value">{itemPrice.id}</span>
            </div>
            {itemPrice.members !== undefined && (
              <div className="detail-row">
                <span className="detail-label">Membership:</span>
                <span className="detail-value">
                  {itemPrice.members ? 'Members Only' : 'Free to Play'}
                </span>
              </div>
            )}
            <div className="detail-row">
              <span className="detail-label">Last Updated:</span>
              <span className="detail-value">{formatTimeAgo(itemPrice.timestamp)}</span>
            </div>
          </div>

          <div className="margin-calculator">
            <h3>Margin Calculator</h3>
            <div className="margin-info">
              <div className="margin-row">
                <span>Potential Margin:</span>
                <span className="margin-value">
                  {formatPrice(itemPrice.buyPrice - itemPrice.sellPrice)}
                </span>
              </div>
              <div className="margin-row">
                <span>Margin %:</span>
                <span className="margin-value">
                  {(((itemPrice.buyPrice - itemPrice.sellPrice) / itemPrice.buyPrice) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {selectedItem.examine && (
            <div className="item-description">
              <h3>Description</h3>
              <p>{selectedItem.examine}</p>
            </div>
          )}
        </div>
      )}

      {!itemPrice && !error && !loading && (
        <div className="empty-state">
          <p>🔍 Search for an item to see its Grand Exchange price</p>
        </div>
      )}

      <footer className="price-checker-footer">
        <p>
          Price data provided by{' '}
          <a href="https://runescape.wiki" target="_blank" rel="noopener noreferrer">
            RuneScape Wiki
          </a>
          {' '}via the Weird Gloop API
        </p>
        <p className="disclaimer">
          Prices are indicative and may not reflect actual trading prices in-game
        </p>
      </footer>
    </div>
  );
};
