import { useState, useEffect } from 'react';
import PriceChecker from './components/PriceChecker';
import ClueSolver from './components/ClueSolver';
import WikiBrowser from './components/WikiBrowser';
import Settings from './components/Settings';
import { priceService } from './services/priceService';
import { wikiService } from './services/wikiService';
import { discordService } from './services/discord';
import './App.css';

type Tab = 'price' | 'clue' | 'wiki' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('price');

  useEffect(() => {
    // Initialize services
    priceService.loadAlerts();
    wikiService.loadRecentSearches();
    wikiService.loadBookmarks();
    discordService.loadSettings();

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'price':
        return <PriceChecker />;
      case 'clue':
        return <ClueSolver />;
      case 'wiki':
        return <WikiBrowser />;
      case 'settings':
        return <Settings />;
      default:
        return <PriceChecker />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">⚔️ RS3 Nexus</h1>
          <p className="app-subtitle">Enhanced Alt1 Toolkit for RuneScape 3</p>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'price' ? 'active' : ''}`}
          onClick={() => setActiveTab('price')}
        >
          💰 Price Checker
        </button>
        <button
          className={`nav-button ${activeTab === 'clue' ? 'active' : ''}`}
          onClick={() => setActiveTab('clue')}
        >
          🗺️ Clue Solver
        </button>
        <button
          className={`nav-button ${activeTab === 'wiki' ? 'active' : ''}`}
          onClick={() => setActiveTab('wiki')}
        >
          📚 Wiki
        </button>
        <button
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      <main className="app-content">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>RS3 Nexus v1.0 | Enhanced Alt1 Toolkit | Not affiliated with Jagex</p>
      </footer>
    </div>
  );
}

export default App;
