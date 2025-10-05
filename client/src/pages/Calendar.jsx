import React, { useEffect, useState, useMemo } from 'react'
import { apiFetch } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Calendar() {
  const { token } = useAuth()
  const [tasks, setTasks] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)

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

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }
    
    // Next month days
    const remainingDays = 42 - days.length // 6 weeks * 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate])
  
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }
  
  const today = () => {
    setCurrentDate(new Date())
  }

  const isToday = (date) => {
    const now = new Date()
    return date.toDateString() === now.toDateString()
  }

  const selectedTasks = selectedDate ? getTasksForDate(selectedDate) : []

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <div>
          <h1><i className="fas fa-calendar-alt"></i> Calendar View</h1>
          <p>Visualize your tasks by due date</p>
        </div>
        <div className="calendar-nav">
          <button onClick={previousMonth} className="nav-btn">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button onClick={today} className="today-btn">
            Today
          </button>
          <button onClick={nextMonth} className="nav-btn">
            <i className="fas fa-chevron-right"></i>
          </button>
          <h2 className="current-month">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading calendar...</p>
        </div>
      ) : (
        <div className="calendar-container">
          <div className="calendar-grid">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-header">{day}</div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, idx) => {
              const dayTasks = getTasksForDate(day.date)
              const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString()
              
              return (
                <div
                  key={idx}
                  className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${isToday(day.date) ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="day-number">{day.date.getDate()}</div>
                  {dayTasks.length > 0 && (
                    <div className="day-tasks">
                      {dayTasks.slice(0, 3).map(task => (
                        <div 
                          key={task._id} 
                          className={`day-task priority-${task.priority} ${task.completed ? 'completed' : ''}`}
                          title={task.title}
                        >
                          <span className="task-dot"></span>
                          <span className="task-title-short">{task.title}</span>
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="more-tasks">+{dayTasks.length - 3} more</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Selected Date Tasks */}
          {selectedDate && (
            <div className="selected-date-panel">
              <div className="panel-header">
                <h3>
                  <i className="fas fa-calendar-day"></i>
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </h3>
                <button onClick={() => setSelectedDate(null)} className="close-panel">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              <div className="panel-content">
                {selectedTasks.length === 0 ? (
                  <div className="no-tasks">
                    <i className="fas fa-calendar-check"></i>
                    <p>No tasks scheduled for this day</p>
                  </div>
                ) : (
                  <ul className="date-tasks-list">
                    {selectedTasks.map(task => (
                      <li key={task._id} className={`date-task-item priority-${task.priority}`}>
                        <input 
                          type="checkbox" 
                          checked={task.completed} 
                          readOnly
                        />
                        <div className="task-info">
                          <div className="task-title">{task.title}</div>
                          {task.description && <div className="task-desc">{task.description}</div>}
                          <div className="task-meta">
                            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                            <span className="category-badge" style={{ backgroundColor: getCategoryColor(task.category) }}>
                              {task.category}
                            </span>
                            {task.dueTime && <span><i className="fas fa-clock"></i> {task.dueTime}</span>}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function getCategoryColor(category) {
  const colors = {
    work: '#2196F3',
    personal: '#9C27B0',
    shopping: '#FF9800',
    health: '#F44336',
    study: '#4CAF50',
    other: '#607D8B'
  }
  return colors[category] || colors.other
}
