import { useState } from 'react'
import { solveAnagram, getCoordinateLocation, parseCoordinates } from '../utils/parsers'
import { CLUE_ANAGRAMS, CLUE_COORDINATES } from '../utils/constants'

function ClueSolver() {
  const [anagramInput, setAnagramInput] = useState('')
  const [anagramSolution, setAnagramSolution] = useState<string | null>(null)
  const [coordinateInput, setCoordinateInput] = useState('')
  const [coordinateSolution, setCoordinateSolution] = useState<{ location: string; description: string } | null>(null)

  const solveAnagramClue = () => {
    const solution = solveAnagram(anagramInput)
    setAnagramSolution(solution)
  }

  const solveCoordinateClue = () => {
    // Try to parse the coordinate input
    const parsed = parseCoordinates(coordinateInput)
    const coords = parsed || coordinateInput
    
    const solution = getCoordinateLocation(coords)
    setCoordinateSolution(solution)
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Clue Solver</h2>
        <p>Solve clue scrolls and puzzles</p>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Anagram Solver</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Enter Anagram
            </label>
            <input
              type="text"
              value={anagramInput}
              onChange={(e) => {
                setAnagramInput(e.target.value)
                setAnagramSolution(null)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  solveAnagramClue()
                }
              }}
              placeholder="e.g., A BAKER"
              style={{ width: '100%' }}
            />
          </div>

          <button onClick={solveAnagramClue} style={{ width: '100%', marginBottom: '1rem' }}>
            Solve Anagram
          </button>

          {anagramSolution && (
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--success)', 
              color: 'white',
              borderRadius: '6px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Solution:
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {anagramSolution}
              </p>
            </div>
          )}

          {!anagramSolution && anagramInput && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '6px'
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                No solution found. Make sure the anagram is correct.
              </p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Coordinate Solver</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Enter Coordinates
            </label>
            <input
              type="text"
              value={coordinateInput}
              onChange={(e) => {
                setCoordinateInput(e.target.value)
                setCoordinateSolution(null)
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  solveCoordinateClue()
                }
              }}
              placeholder="e.g., 14:00N 26:00E"
              style={{ width: '100%' }}
            />
          </div>

          <button onClick={solveCoordinateClue} style={{ width: '100%', marginBottom: '1rem' }}>
            Solve Coordinates
          </button>

          {coordinateSolution && (
            <div style={{ 
              padding: '1.5rem', 
              backgroundColor: 'var(--success)', 
              color: 'white',
              borderRadius: '6px'
            }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Location:
              </p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {coordinateSolution.location}
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {coordinateSolution.description}
              </p>
            </div>
          )}

          {!coordinateSolution && coordinateInput && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--bg-tertiary)', 
              borderRadius: '6px'
            }}>
              <p style={{ color: 'var(--text-secondary)' }}>
                No location found. Check coordinate format (e.g., 14:00N 26:00E)
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="card mb-4">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Common Anagrams</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(CLUE_ANAGRAMS).slice(0, 10).map(([anagram, solution]) => (
            <div
              key={anagram}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '6px'
              }}
            >
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                {anagram}
              </p>
              <p style={{ fontWeight: 'bold' }}>
                → {solution}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Common Coordinates</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(CLUE_COORDINATES).slice(0, 6).map(([coords, info]) => (
            <div
              key={coords}
              style={{
                padding: '1rem',
                backgroundColor: 'var(--bg-tertiary)',
                borderRadius: '6px'
              }}
            >
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                {coords}
              </p>
              <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {info.location}
              </p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="card mt-4" style={{ backgroundColor: 'var(--info)', color: 'white' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>💡 Tip</h3>
        <p>
          More clue solutions can be added to the database in Settings. The solver supports anagrams, 
          coordinates, and will be expanded with more puzzle types in future updates!
        </p>
      </div>
    </div>
  )
}

export default ClueSolver
