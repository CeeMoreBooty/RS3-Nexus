import { useState, useEffect } from 'react';
import { clueSolverService } from '../services/clueSolver';
import { ClueSolution, ClueTrackerEntry } from '../types';
import './ClueSolver.css';

function ClueSolver() {
  const [clueText, setClueText] = useState('');
  const [solution, setSolution] = useState<ClueSolution | null>(null);
  const [solveTime, setSolveTime] = useState<number>(0);
  const [history, setHistory] = useState<ClueTrackerEntry[]>([]);
  const [stats, setStats] = useState({ totalClues: 0, avgSolveTime: 0 });

  useEffect(() => {
    const serviceStats = clueSolverService.getStats();
    setStats(serviceStats);
    loadHistory();
  }, []);

  const loadHistory = () => {
    const stored = localStorage.getItem('clueHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  };

  const handleSolve = () => {
    if (!clueText.trim()) return;

    const startTime = performance.now();
    const result = clueSolverService.solve(clueText);
    const endTime = performance.now();
    
    setSolveTime(endTime - startTime);
    setSolution(result);

    if (!result) {
      alert('Could not solve this clue. Please check the text and try again.');
    }
  };

  const addToTracker = () => {
    if (!solution) return;

    const reward = parseInt(prompt('Enter total reward value (in gp):', '0') || '0');
    const tier = prompt('Enter clue tier (easy/medium/hard/elite/master):', 'medium') as any;

    const entry: ClueTrackerEntry = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      clueType: solution.type,
      tier,
      reward,
      items: [],
    };

    const newHistory = [entry, ...history].slice(0, 50); // Keep last 50
    setHistory(newHistory);
    localStorage.setItem('clueHistory', JSON.stringify(newHistory));
  };

  const clearHistory = () => {
    if (confirm('Clear all clue history?')) {
      setHistory([]);
      localStorage.removeItem('clueHistory');
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      anagram: '🔤',
      coordinate: '📍',
      cryptic: '🤔',
      puzzle: '🧩',
      scan: '🔍',
      emote: '💃',
      map: '🗺️',
    };
    return icons[type] || '❓';
  };

  const exampleClues = [
    { text: 'A BAKER', type: 'Anagram' },
    { text: '02:40 N 31:48 E', type: 'Coordinate' },
    { text: 'speak to the keeper of ale', type: 'Cryptic' },
    { text: '5 steps from lumbridge', type: 'Scan' },
  ];

  return (
    <div className="clue-solver">
      <div className="clue-solver-container">
        <div className="solver-section">
          <h2>🗺️ Clue Scroll Solver</h2>
          <p className="solver-description">
            Instant clue solving with &lt;100ms response time. Supports all clue types!
          </p>

          <div className="solve-stats">
            <div className="stat-item">
              <span className="stat-label">Database Size</span>
              <span className="stat-value">{stats.totalClues} clues</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg Solve Time</span>
              <span className="stat-value">{stats.avgSolveTime}ms</span>
            </div>
            {solveTime > 0 && (
              <div className="stat-item">
                <span className="stat-label">Last Solve</span>
                <span className="stat-value">{solveTime.toFixed(2)}ms</span>
              </div>
            )}
          </div>

          <div className="input-section">
            <textarea
              value={clueText}
              onChange={(e) => setClueText(e.target.value)}
              placeholder="Enter your clue text here...
Examples:
- A BAKER (anagram)
- 02:40 N 31:48 E (coordinate)
- speak to the keeper of ale (cryptic)"
              className="clue-input"
              rows={6}
            />
            <button onClick={handleSolve} className="solve-button">
              🔍 Solve Clue
            </button>
          </div>

          <div className="examples-section">
            <h4>📝 Try These Examples:</h4>
            <div className="example-buttons">
              {exampleClues.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setClueText(example.text)}
                  className="example-btn"
                >
                  {example.type}: {example.text}
                </button>
              ))}
            </div>
          </div>
        </div>

        {solution && (
          <div className="solution-section fade-in">
            <div className="solution-header">
              <h3>{getTypeIcon(solution.type)} Solution Found!</h3>
              <button onClick={addToTracker} className="tracker-btn">
                📊 Add to Tracker
              </button>
            </div>

            <div className="solution-content">
              <div className="solution-item">
                <span className="solution-label">Type:</span>
                <span className="solution-value">{solution.type}</span>
              </div>

              <div className="solution-item">
                <span className="solution-label">Solution:</span>
                <span className="solution-value highlight">{solution.solution}</span>
              </div>

              {solution.location && (
                <div className="solution-item">
                  <span className="solution-label">Location:</span>
                  <span className="solution-value">{solution.location}</span>
                </div>
              )}

              {solution.teleports && solution.teleports.length > 0 && (
                <div className="solution-item">
                  <span className="solution-label">Suggested Teleports:</span>
                  <div className="teleports-list">
                    {solution.teleports.map((tp, idx) => (
                      <span key={idx} className="teleport-badge">{tp}</span>
                    ))}
                  </div>
                </div>
              )}

              {solution.requirements && solution.requirements.length > 0 && (
                <div className="solution-item">
                  <span className="solution-label">Requirements:</span>
                  <div className="requirements-list">
                    {solution.requirements.map((req, idx) => (
                      <span key={idx} className="requirement-badge">{req}</span>
                    ))}
                  </div>
                </div>
              )}

              {solution.steps && solution.steps.length > 0 && (
                <div className="solution-item">
                  <span className="solution-label">Steps:</span>
                  <ol className="steps-list">
                    {solution.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="tracker-section">
          <div className="tracker-header">
            <h3>📊 Clue Tracker</h3>
            <button onClick={clearHistory} className="clear-btn">
              🗑️ Clear History
            </button>
          </div>

          {history.length === 0 ? (
            <p className="empty-state">
              No clues tracked yet. Solve clues and add them to track your progress!
            </p>
          ) : (
            <>
              <div className="tracker-stats">
                <div className="tracker-stat">
                  <span className="stat-label">Total Clues</span>
                  <span className="stat-value">{history.length}</span>
                </div>
                <div className="tracker-stat">
                  <span className="stat-label">Total Rewards</span>
                  <span className="stat-value">
                    {history.reduce((sum, h) => sum + h.reward, 0).toLocaleString()} gp
                  </span>
                </div>
                <div className="tracker-stat">
                  <span className="stat-label">Avg Reward</span>
                  <span className="stat-value">
                    {Math.floor(history.reduce((sum, h) => sum + h.reward, 0) / history.length).toLocaleString()} gp
                  </span>
                </div>
              </div>

              <div className="history-list">
                {history.slice(0, 10).map((entry) => (
                  <div key={entry.id} className="history-item">
                    <span className="history-icon">{getTypeIcon(entry.clueType)}</span>
                    <div className="history-details">
                      <span className="history-type">{entry.clueType} ({entry.tier})</span>
                      <span className="history-date">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="history-reward">{entry.reward.toLocaleString()} gp</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="features-section">
          <h3>✨ Features</h3>
          <ul className="features-list">
            <li>⚡ Instant solving (&lt;100ms for all clue types)</li>
            <li>🔤 Anagram solver with fuzzy matching</li>
            <li>📍 Coordinate clue location finder</li>
            <li>🤔 Cryptic clue decoder</li>
            <li>🔍 Scan clue helper with step counts</li>
            <li>🧩 Puzzle box solver (step-by-step)</li>
            <li>🗺️ Map clue location guide</li>
            <li>💃 Emote clue requirements</li>
            <li>📊 Clue completion tracker</li>
            <li>🚀 Optimal teleport suggestions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ClueSolver;
