import React, { useEffect, useState, useMemo } from 'react'
import { apiFetch } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { token } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await apiFetch('/api/auth/users', { token })
        setUsers(res.users || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter(u => u.lastLogin).length,
    newToday: users.filter(u => {
      const regDate = new Date(u.registeredAt)
      const today = new Date()
      return regDate.toDateString() === today.toDateString()
    }).length
  }), [users])

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    return users.filter(u => 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [users, searchTerm])

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-title">
          <i className="fas fa-users-cog"></i>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage and monitor all registered users</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats">
        <div className="admin-stat-card blue">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Users</div>
          </div>
        </div>
        <div className="admin-stat-card green">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.active}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
        <div className="admin-stat-card purple">
          <div className="stat-icon">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="stat-info">
            <div className="stat-value">{stats.newToday}</div>
            <div className="stat-label">New Today</div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table-container">
        <div className="table-header">
          <h2><i className="fas fa-list"></i> User Directory</h2>
          <div className="table-search">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <i className="fas fa-exclamation-triangle"></i>
            <p>{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-users-slash"></i>
            <p>No users found</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th><i className="fas fa-user"></i> Name</th>
                  <th><i className="fas fa-envelope"></i> Email</th>
                  <th><i className="fas fa-calendar-plus"></i> Registered</th>
                  <th><i className="fas fa-sign-in-alt"></i> Last Login</th>
                  <th><i className="fas fa-circle"></i> Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="user-name">{u.name}</span>
                      </div>
                    </td>
                    <td className="email-cell">{u.email}</td>
                    <td>{u.registeredAt ? new Date(u.registeredAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    }) : '-'}</td>
                    <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Never'}</td>
                    <td>
                      <span className={`status-badge ${u.lastLogin ? 'active' : 'inactive'}`}>
                        {u.lastLogin ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
