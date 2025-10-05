import React, { useEffect, useState, useMemo } from 'react'
import { apiFetch } from '../services/api'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [
  { value: 'work', label: 'Work', icon: 'briefcase', color: '#2196F3' },
  { value: 'personal', label: 'Personal', icon: 'user', color: '#9C27B0' },
  { value: 'shopping', label: 'Shopping', icon: 'shopping-cart', color: '#FF9800' },
  { value: 'health', label: 'Health', icon: 'heartbeat', color: '#F44336' },
  { value: 'study', label: 'Study', icon: 'book', color: '#4CAF50' },
  { value: 'other', label: 'Other', icon: 'tag', color: '#607D8B' }
]

export default function Home() {
  const { user, token } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Form state
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    dueDate: '', 
    dueTime: '', 
    priority: 'medium',
    category: 'other'
  })
  
  // Filter and search state
  const [filter, setFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('dueDate')
  
  // Edit modal state
  const [editModal, setEditModal] = useState(false)
  const [editTask, setEditTask] = useState(null)
  
  // Subtask state
  const [newSubtask, setNewSubtask] = useState({})
  const [expandedTasks, setExpandedTasks] = useState({})

  const loadTasks = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/tasks', { token })
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTasks() }, [])

  const addTask = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    try {
      const body = { ...form, subtasks: [] }
      if (!body.dueDate) delete body.dueDate
      if (!body.dueTime) delete body.dueTime
      const created = await apiFetch('/api/tasks', { method: 'POST', body, token })
      setTasks([created, ...tasks])
      setForm({ title: '', description: '', dueDate: '', dueTime: '', priority: 'medium', category: 'other' })
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleTask = async (id) => {
    const task = tasks.find(t => t._id === id)
    try {
      const updated = await apiFetch(`/api/tasks/${id}`, { method: 'PUT', body: { completed: !task.completed }, token })
      setTasks(tasks.map(t => t._id === id ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteTask = async (id) => {
    if (!confirm('Delete this task?')) return
    try {
      await apiFetch(`/api/tasks/${id}`, { method: 'DELETE', token })
      setTasks(tasks.filter(t => t._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  const openEditModal = (task) => {
    setEditTask({ ...task })
    setEditModal(true)
  }

  const saveEdit = async () => {
    try {
      const updated = await apiFetch(`/api/tasks/${editTask._id}`, { method: 'PUT', body: editTask, token })
      setTasks(tasks.map(t => t._id === editTask._id ? updated : t))
      setEditModal(false)
      setEditTask(null)
    } catch (err) {
      setError(err.message)
    }
  }

  // Subtask functions
  const addSubtask = async (taskId) => {
    const title = newSubtask[taskId]
    if (!title || !title.trim()) return
    try {
      const updated = await apiFetch(`/api/tasks/${taskId}/subtasks`, { 
        method: 'POST', 
        body: { title }, 
        token 
      })
      setTasks(tasks.map(t => t._id === taskId ? updated : t))
      setNewSubtask({ ...newSubtask, [taskId]: '' })
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleSubtask = async (taskId, subtaskId) => {
    const task = tasks.find(t => t._id === taskId)
    const subtask = task.subtasks.find(s => s._id === subtaskId)
    try {
      const updated = await apiFetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'PUT',
        body: { completed: !subtask.completed },
        token
      })
      setTasks(tasks.map(t => t._id === taskId ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteSubtask = async (taskId, subtaskId) => {
    try {
      const updated = await apiFetch(`/api/tasks/${taskId}/subtasks/${subtaskId}`, {
        method: 'DELETE',
        token
      })
      setTasks(tasks.map(t => t._id === taskId ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleExpanded = (taskId) => {
    setExpandedTasks({ ...expandedTasks, [taskId]: !expandedTasks[taskId] })
  }

  // Statistics
  const stats = useMemo(() => ({
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  }), [tasks])

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    let result = tasks.filter(t => {
      if (filter === 'completed') return t.completed
      if (filter === 'pending') return !t.completed
      if (filter === 'high') return t.priority === 'high'
      return true
    })
    
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter)
    }
    
    if (searchTerm) {
      result = result.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    result.sort((a, b) => {
      if (sortBy === 'dueDate') return new Date(a.dueDate || '9999') - new Date(b.dueDate || '9999')
      if (sortBy === 'priority') {
        const p = { high: 3, medium: 2, low: 1 }
        return p[b.priority] - p[a.priority]
      }
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'category') return a.category.localeCompare(b.category)
      return 0
    })
    
    return result
  }, [tasks, filter, categoryFilter, searchTerm, sortBy])

  const getCategoryInfo = (category) => CATEGORIES.find(c => c.value === category) || CATEGORIES[5]

  const getSubtaskProgress = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) return null
    const completed = task.subtasks.filter(s => s.completed).length
    const total = task.subtasks.length
    const percentage = Math.round((completed / total) * 100)
    return { completed, total, percentage }
  }

  return (
    <div className="home-container">
      <div className="header-home">
        <h1><i className="fas fa-tasks"></i> Task Manager</h1>
        <div className="user-info-home">
          <span>{user?.name || 'User'}</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="statistics">
        <div className="stat-item">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button 
          onClick={() => setCategoryFilter('all')} 
          className={categoryFilter === 'all' ? 'category-btn active' : 'category-btn'}
        >
          <i className="fas fa-th"></i> All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategoryFilter(cat.value)}
            className={categoryFilter === cat.value ? 'category-btn active' : 'category-btn'}
            style={{ '--cat-color': cat.color }}
          >
            <i className={`fas fa-${cat.icon}`}></i> {cat.label}
          </button>
        ))}
      </div>

      {/* Search and Sort */}
      <div className="search-sort">
        <div className="search-box">
          <input type="text" placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <i className="fas fa-search"></i>
        </div>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
          <option value="category">Sort by Category</option>
          <option value="createdAt">Sort by Created Date</option>
        </select>
      </div>

      {/* Task Input */}
      <form className="task-input" onSubmit={addTask}>
        <input type="text" placeholder="Enter task title..." value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required />
        <input type="text" placeholder="Enter description..." value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        <input type="date" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} />
        <input type="time" value={form.dueTime} onChange={(e) => setForm({...form, dueTime: e.target.value})} />
        <select value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <button type="submit"><i className="fas fa-plus"></i> Add Task</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}>All</button>
        <button onClick={() => setFilter('pending')} className={filter === 'pending' ? 'filter-btn active' : 'filter-btn'}>Pending</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}>Completed</button>
        <button onClick={() => setFilter('high')} className={filter === 'high' ? 'filter-btn active' : 'filter-btn'}>High Priority</button>
      </div>

      {/* Task List */}
      {error && <div className="error">{error}</div>}
      <ul className="task-list">
        {loading ? (
          <li>Loading...</li>
        ) : filteredTasks.length === 0 ? (
          <li>No tasks found.</li>
        ) : (
          filteredTasks.map(task => {
            const catInfo = getCategoryInfo(task.category)
            const progress = getSubtaskProgress(task)
            const isExpanded = expandedTasks[task._id]
            
            return (
              <li key={task._id} className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
                <div className="task-main-row">
                  <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task._id)} />
                  <div className="task-content">
                    <div className="task-title-main">{task.title}</div>
                    {task.description && <div className="task-description">{task.description}</div>}
                    <div className="task-meta-info">
                      <span className="category-badge" style={{ backgroundColor: catInfo.color }}>
                        <i className={`fas fa-${catInfo.icon}`}></i> {catInfo.label}
                      </span>
                      <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                      {task.dueDate && <span><i className="fas fa-calendar"></i> {new Date(task.dueDate).toLocaleDateString()}</span>}
                      {task.dueTime && <span><i className="fas fa-clock"></i> {task.dueTime}</span>}
                      {progress && (
                        <span className="subtask-progress">
                          <i className="fas fa-list-check"></i> {progress.completed}/{progress.total} ({progress.percentage}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    {task.subtasks && task.subtasks.length > 0 && (
                      <button onClick={() => toggleExpanded(task._id)} className="expand-btn">
                        <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                      </button>
                    )}
                    <button onClick={() => openEditModal(task)} className="edit-btn"><i className="fas fa-edit"></i></button>
                    <button onClick={() => deleteTask(task._id)} className="delete-btn"><i className="fas fa-trash"></i></button>
                  </div>
                </div>
                
                {/* Subtasks Section */}
                {isExpanded && (
                  <div className="subtasks-container">
                    <div className="subtasks-header">
                      <h4><i className="fas fa-list-ul"></i> Subtasks</h4>
                    </div>
                    <ul className="subtasks-list">
                      {task.subtasks.map(subtask => (
                        <li key={subtask._id} className={subtask.completed ? 'completed' : ''}>
                          <input 
                            type="checkbox" 
                            checked={subtask.completed} 
                            onChange={() => toggleSubtask(task._id, subtask._id)} 
                          />
                          <span>{subtask.title}</span>
                          <button onClick={() => deleteSubtask(task._id, subtask._id)} className="delete-subtask">
                            <i className="fas fa-times"></i>
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div className="add-subtask">
                      <input
                        type="text"
                        placeholder="Add a subtask..."
                        value={newSubtask[task._id] || ''}
                        onChange={(e) => setNewSubtask({ ...newSubtask, [task._id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && addSubtask(task._id)}
                      />
                      <button onClick={() => addSubtask(task._id)}>
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })
        )}
      </ul>

      {/* Edit Modal */}
      {editModal && editTask && (
        <div className="modal" onClick={() => setEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setEditModal(false)}>&times;</span>
            <h2>Edit Task</h2>
            <input type="text" placeholder="Task title" value={editTask.title} onChange={(e) => setEditTask({...editTask, title: e.target.value})} />
            <input type="text" placeholder="Task description" value={editTask.description || ''} onChange={(e) => setEditTask({...editTask, description: e.target.value})} />
            <select value={editTask.category} onChange={(e) => setEditTask({...editTask, category: e.target.value})}>
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
            <input type="date" value={editTask.dueDate || ''} onChange={(e) => setEditTask({...editTask, dueDate: e.target.value})} />
            <input type="time" value={editTask.dueTime || ''} onChange={(e) => setEditTask({...editTask, dueTime: e.target.value})} />
            <select value={editTask.priority} onChange={(e) => setEditTask({...editTask, priority: e.target.value})}>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <button onClick={saveEdit}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  )
}
