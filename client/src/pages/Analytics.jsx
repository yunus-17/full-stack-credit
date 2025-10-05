import React, { useEffect, useState, useMemo } from 'react'
import { apiFetch } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Analytics() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('week') // week, month, year, all

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true)
      try {
        const data = await apiFetch('/api/tasks', { token })
        setTasks(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date()
    const filterByTime = (task) => {
      const created = new Date(task.createdAt)
      if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return created >= weekAgo
      }
      if (timeRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return created >= monthAgo
      }
      if (timeRange === 'year') {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        return created >= yearAgo
      }
      return true
    }

    const filteredTasks = tasks.filter(filterByTime)
    const completed = filteredTasks.filter(t => t.completed)
    const pending = filteredTasks.filter(t => !t.completed)
    const overdue = filteredTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now)

    // Priority distribution
    const priorityDist = {
      high: filteredTasks.filter(t => t.priority === 'high').length,
      medium: filteredTasks.filter(t => t.priority === 'medium').length,
      low: filteredTasks.filter(t => t.priority === 'low').length
    }

    // Category distribution
    const categoryDist = {}
    filteredTasks.forEach(t => {
      categoryDist[t.category] = (categoryDist[t.category] || 0) + 1
    })

    // Completion rate
    const completionRate = filteredTasks.length > 0 
      ? Math.round((completed.length / filteredTasks.length) * 100) 
      : 0

    // Tasks by day (last 7 days)
    const tasksByDay = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dayStart = new Date(date.setHours(0, 0, 0, 0))
      const dayEnd = new Date(date.setHours(23, 59, 59, 999))
      
      const dayTasks = tasks.filter(t => {
        const created = new Date(t.createdAt)
        return created >= dayStart && created <= dayEnd
      })
      
      const dayCompleted = dayTasks.filter(t => t.completed).length
      
      tasksByDay.push({
        date: dayStart.toLocaleDateString('en-US', { weekday: 'short' }),
        total: dayTasks.length,
        completed: dayCompleted
      })
    }

    return {
      total: filteredTasks.length,
      completed: completed.length,
      pending: pending.length,
      overdue: overdue.length,
      completionRate,
      priorityDist,
      categoryDist,
      tasksByDay,
      avgCompletionTime: 0 // Can be calculated if we track completion dates
    }
  }, [tasks, timeRange])

  const exportData = (format) => {
    if (format === 'json') {
      const dataStr = JSON.stringify(tasks, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`
      link.click()
    } else if (format === 'csv') {
      const headers = ['Title', 'Description', 'Category', 'Priority', 'Status', 'Due Date', 'Created']
      const rows = tasks.map(t => [
        t.title,
        t.description || '',
        t.category,
        t.priority,
        t.completed ? 'Completed' : 'Pending',
        t.dueDate || '',
        new Date(t.createdAt).toLocaleDateString()
      ])
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n')
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`
      link.click()
    }
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <div>
          <h1><i className="fas fa-chart-line"></i> Analytics Dashboard</h1>
          <p>Track your productivity and task completion trends</p>
        </div>
        <div className="analytics-controls">
          <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="time-range-select">
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
          <div className="export-buttons">
            <button onClick={() => exportData('json')} className="export-btn">
              <i className="fas fa-file-code"></i> Export JSON
            </button>
            <button onClick={() => exportData('csv')} className="export-btn">
              <i className="fas fa-file-csv"></i> Export CSV
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading analytics...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card blue">
              <div className="metric-icon"><i className="fas fa-tasks"></i></div>
              <div className="metric-info">
                <div className="metric-value">{stats.total}</div>
                <div className="metric-label">Total Tasks</div>
              </div>
            </div>
            <div className="metric-card green">
              <div className="metric-icon"><i className="fas fa-check-circle"></i></div>
              <div className="metric-info">
                <div className="metric-value">{stats.completed}</div>
                <div className="metric-label">Completed</div>
              </div>
            </div>
            <div className="metric-card orange">
              <div className="metric-icon"><i className="fas fa-clock"></i></div>
              <div className="metric-info">
                <div className="metric-value">{stats.pending}</div>
                <div className="metric-label">Pending</div>
              </div>
            </div>
            <div className="metric-card red">
              <div className="metric-icon"><i className="fas fa-exclamation-triangle"></i></div>
              <div className="metric-info">
                <div className="metric-value">{stats.overdue}</div>
                <div className="metric-label">Overdue</div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="charts-row">
            {/* Completion Rate */}
            <div className="chart-card">
              <h3><i className="fas fa-percentage"></i> Completion Rate</h3>
              <div className="completion-circle">
                <svg viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#e0e0e0" strokeWidth="20" />
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="80" 
                    fill="none" 
                    stroke="#4CAF50" 
                    strokeWidth="20"
                    strokeDasharray={`${stats.completionRate * 5.03} 503`}
                    strokeDashoffset="125.75"
                    transform="rotate(-90 100 100)"
                  />
                  <text x="100" y="100" textAnchor="middle" dy="0.3em" fontSize="40" fontWeight="bold" fill="#333">
                    {stats.completionRate}%
                  </text>
                </svg>
              </div>
            </div>

            {/* Priority Distribution */}
            <div className="chart-card">
              <h3><i className="fas fa-flag"></i> Priority Distribution</h3>
              <div className="bar-chart">
                <div className="bar-item">
                  <div className="bar-label">High</div>
                  <div className="bar-container">
                    <div className="bar high" style={{ width: `${stats.total > 0 ? (stats.priorityDist.high / stats.total) * 100 : 0}%` }}></div>
                  </div>
                  <div className="bar-value">{stats.priorityDist.high}</div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Medium</div>
                  <div className="bar-container">
                    <div className="bar medium" style={{ width: `${stats.total > 0 ? (stats.priorityDist.medium / stats.total) * 100 : 0}%` }}></div>
                  </div>
                  <div className="bar-value">{stats.priorityDist.medium}</div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Low</div>
                  <div className="bar-container">
                    <div className="bar low" style={{ width: `${stats.total > 0 ? (stats.priorityDist.low / stats.total) * 100 : 0}%` }}></div>
                  </div>
                  <div className="bar-value">{stats.priorityDist.low}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="chart-card full-width">
            <h3><i className="fas fa-chart-bar"></i> 7-Day Activity</h3>
            <div className="activity-chart">
              {stats.tasksByDay.map((day, idx) => (
                <div key={idx} className="activity-day">
                  <div className="activity-bars">
                    <div 
                      className="activity-bar total" 
                      style={{ height: `${day.total * 20}px` }}
                      title={`${day.total} total`}
                    ></div>
                    <div 
                      className="activity-bar completed" 
                      style={{ height: `${day.completed * 20}px` }}
                      title={`${day.completed} completed`}
                    ></div>
                  </div>
                  <div className="activity-label">{day.date}</div>
                  <div className="activity-count">{day.total}</div>
                </div>
              ))}
            </div>
            <div className="activity-legend">
              <span><div className="legend-box total"></div> Total Tasks</span>
              <span><div className="legend-box completed"></div> Completed</span>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="chart-card full-width">
            <h3><i className="fas fa-th"></i> Category Distribution</h3>
            <div className="category-stats">
              {Object.entries(stats.categoryDist).map(([category, count]) => (
                <div key={category} className="category-stat-item">
                  <div className="category-stat-label">{category}</div>
                  <div className="category-stat-bar">
                    <div 
                      className="category-stat-fill" 
                      style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <div className="category-stat-value">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
