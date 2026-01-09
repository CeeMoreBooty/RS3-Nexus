import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import PriceChecker from './components/PriceChecker'
import TaskManager from './components/TaskManager'
import CombatHelper from './components/CombatHelper'
import ClueSolver from './components/ClueSolver'
import Settings from './components/Settings'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <h1>RS3-Nexus</h1>
            <p>Enhanced Alt1</p>
          </div>
          
          <ul className="nav-menu">
            <li className={activeTab === 'dashboard' ? 'active' : ''}>
              <Link to="/" onClick={() => setActiveTab('dashboard')}>
                <span>📊</span> Dashboard
              </Link>
            </li>
            <li className={activeTab === 'prices' ? 'active' : ''}>
              <Link to="/prices" onClick={() => setActiveTab('prices')}>
                <span>💰</span> Price Checker
              </Link>
            </li>
            <li className={activeTab === 'tasks' ? 'active' : ''}>
              <Link to="/tasks" onClick={() => setActiveTab('tasks')}>
                <span>✓</span> Task Manager
              </Link>
            </li>
            <li className={activeTab === 'combat' ? 'active' : ''}>
              <Link to="/combat" onClick={() => setActiveTab('combat')}>
                <span>⚔️</span> Combat Helper
              </Link>
            </li>
            <li className={activeTab === 'clues' ? 'active' : ''}>
              <Link to="/clues" onClick={() => setActiveTab('clues')}>
                <span>🗺️</span> Clue Solver
              </Link>
            </li>
            <li className={activeTab === 'settings' ? 'active' : ''}>
              <Link to="/settings" onClick={() => setActiveTab('settings')}>
                <span>⚙️</span> Settings
              </Link>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prices" element={<PriceChecker />} />
            <Route path="/tasks" element={<TaskManager />} />
            <Route path="/combat" element={<CombatHelper />} />
            <Route path="/clues" element={<ClueSolver />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
