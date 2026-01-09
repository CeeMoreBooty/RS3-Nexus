import { useState, useEffect } from 'react'
import { database, Task } from '../services/database'
import { notifications } from '../services/notifications'
import { xpToLevel } from '../utils/calculators'
import { SKILLS } from '../utils/constants'

function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    skill: '',
    currentXp: 0,
    targetLevel: 99,
    status: 'active',
  })

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    try {
      const allTasks = await database.getAllTasks()
      setTasks(allTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
    }
  }

  const addTask = async () => {
    if (!newTask.title) {
      notifications.notifyWarning('Please enter a task title')
      return
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description || '',
      skill: newTask.skill,
      currentXp: newTask.currentXp,
      targetLevel: newTask.targetLevel,
      status: 'active',
      createdAt: Date.now(),
    }

    try {
      await database.addTask(task)
      await loadTasks()
      setShowAddTask(false)
      setNewTask({
        title: '',
        description: '',
        skill: '',
        currentXp: 0,
        targetLevel: 99,
        status: 'active',
      })
      notifications.notifyInfo('Task added successfully!')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const completeTask = async (id: string) => {
    try {
      const task = await database.getTask(id)
      if (task) {
        task.status = 'completed'
        task.completedAt = Date.now()
        await database.updateTask(task)
        await loadTasks()
        notifications.notifyTaskComplete(task.title)
      }
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await database.deleteTask(id)
      await loadTasks()
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const activeTasks = tasks.filter(t => t.status === 'active')
  const completedTasks = tasks.filter(t => t.status === 'completed')

  return (
    <div className="component-container">
      <div className="component-header">
        <h2>Task Manager</h2>
        <p>Track your goals and progress</p>
      </div>

      <div className="card mb-4">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.5rem' }}>Active Tasks</h3>
          <button onClick={() => setShowAddTask(!showAddTask)}>
            {showAddTask ? 'Cancel' : 'Add Task'}
          </button>
        </div>

        {showAddTask && (
          <div style={{ 
            padding: '1.5rem', 
            backgroundColor: 'var(--bg-tertiary)', 
            borderRadius: '6px',
            marginBottom: '1.5rem'
          }}>
            <h4 style={{ marginBottom: '1rem' }}>New Task</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Get 99 Fishing"
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Task details..."
                  rows={3}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="grid grid-2">
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Skill (optional)</label>
                  <select
                    value={newTask.skill}
                    onChange={(e) => setNewTask({ ...newTask, skill: e.target.value })}
                    style={{ width: '100%' }}
                  >
                    <option value="">Select skill...</option>
                    {SKILLS.map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>Target Level</label>
                  <input
                    type="number"
                    value={newTask.targetLevel}
                    onChange={(e) => setNewTask({ ...newTask, targetLevel: parseInt(e.target.value) })}
                    min="1"
                    max="120"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <button onClick={addTask} style={{ width: '100%' }}>
                Create Task
              </button>
            </div>
          </div>
        )}

        {activeTasks.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No active tasks. Add one to get started!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeTasks.map(task => {
              const currentLevel = task.currentXp ? xpToLevel(task.currentXp) : 0
              const progress = task.currentXp && task.targetLevel 
                ? ((currentLevel / task.targetLevel) * 100).toFixed(1)
                : 0

              return (
                <div
                  key={task.id}
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    borderRadius: '6px',
                    borderLeft: '4px solid var(--accent-primary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{task.title}</h4>
                      {task.description && (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => completeTask(task.id)}
                        style={{ backgroundColor: 'var(--success)', padding: '0.4rem 0.8rem' }}
                      >
                        Complete
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        style={{ backgroundColor: 'var(--error)', padding: '0.4rem 0.8rem' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {task.skill && (
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>{task.skill}</span>
                        <span>Level {currentLevel} → {task.targetLevel}</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${progress}%`, 
                          height: '100%', 
                          backgroundColor: 'var(--accent-primary)',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {progress}% complete
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="card">
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Completed Tasks</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {completedTasks.map(task => (
              <div
                key={task.id}
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  borderRadius: '6px',
                  opacity: 0.7
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4>{task.title}</h4>
                    {task.completedAt && (
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Completed: {new Date(task.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    style={{ backgroundColor: 'var(--error)', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskManager
