import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import DeepSeaHubTracker from './components/DeepSeaHubTracker';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app">
        <nav className="app-nav">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/tracker" className="nav-link">Event Tracker</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tracker" element={
            <div className="standalone-tracker">
              <DeepSeaHubTracker />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
