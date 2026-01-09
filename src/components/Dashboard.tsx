import { useState, useEffect } from 'react'
import { database, Task } from '../services/database'
import { notifications } from '../services/notifications'

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTasks, setActiveTasks] = useState<Task[]>([])
  const [completedToday, setCompletedToday] = useState(0)
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeTasks: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const allTasks = await database.getAllTasks()
      const active = await database.getTasksByStatus('active')
      
      setTasks(allTasks)
      setActiveTasks(active)
      
      // Calculate stats
      const completed = allTasks.filter(t => t.status === 'completed')
      const today = new Date().setHours(0, 0, 0, 0)
      const completedTodayCount = completed.filter(t => 
        t.completedAt && new Date(t.completedAt).setHours(0, 0, 0, 0) === today
      ).length
      
      setCompletedToday(completedTodayCount)
      setStats({
        totalTasks: allTasks.length,
        completedTasks: completed.length,
        activeTasks: active.length,
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Dashboard</h2>
        <p>Welcome to RS3-Nexus - Your RuneScape 3 companion</p>
      </div>

      <div className="grid grid-3 mb-4">
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Active Tasks
          </h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>
            {stats.activeTasks}
          </p>
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Completed Today
          </h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>
            {completedToday}
          </p>
        </div>
        
        <div className="card">
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
            Total Completed
          </h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--info)' }}>
            {stats.completedTasks}
          </p>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Recent Tasks</h3>
          {activeTasks.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No active tasks. Create one in Task Manager!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeTasks.slice(0, 5).map(task => (
                <div 
                  key={task.id} 
                  style={{ 
                    padding: '1rem', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    borderRadius: '6px',
                    borderLeft: '4px solid var(--accent-primary)'
                  }}
                >
                  <h4 style={{ marginBottom: '0.25rem' }}>{task.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {task.description}
                  </p>
                  {task.skill && (
                    <span style={{ 
                      display: 'inline-block', 
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: 'var(--accent-secondary)',
                      borderRadius: '4px',
                      fontSize: '0.8rem'
                    }}>
                      {task.skill}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button onClick={() => window.location.href = '/prices'}>
              💰 Check Item Prices
            </button>
            <button onClick={() => window.location.href = '/tasks'}>
              ✓ Manage Tasks
            </button>
            <button onClick={() => window.location.href = '/combat'}>
              ⚔️ Combat Calculator
            </button>
            <button onClick={() => window.location.href = '/clues'}>
              🗺️ Solve Clue Scroll
            </button>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>💡 Tip</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Use the Price Checker to track Grand Exchange prices and set alerts for your favorite items!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
