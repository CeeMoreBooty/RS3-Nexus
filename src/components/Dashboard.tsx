import React from 'react';
import DeepSeaHubTracker from './DeepSeaHubTracker';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>RS3 Nexus</h1>
        <p className="subtitle">Enhanced RuneScape 3 Companion</p>
      </header>

      <main className="dashboard-content">
        <section className="dashboard-section">
          <DeepSeaHubTracker />
        </section>

        <section className="dashboard-info">
          <div className="info-card">
            <h3>Welcome to RS3 Nexus</h3>
            <p>
              Track Deep Sea Hub events with live countdown timers and never miss an event again.
              Enable notifications to get alerts before events start.
            </p>
          </div>

          <div className="info-card">
            <h3>Features</h3>
            <ul>
              <li>Live countdown timers for all events</li>
              <li>Real-time event tracking</li>
              <li>24-hour event schedule</li>
              <li>Customizable notifications</li>
              <li>Event rewards and location info</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>RS3 Nexus - An Enhanced Version of Alt1 for RuneScape 3</p>
      </footer>
    </div>
  );
};

export default Dashboard;
