import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="brand">Todo App</div>
      <div className="spacer" />
      <div className="links">
        {token ? (
          <>
            <Link to="/dashboard"><i className="fas fa-tasks"></i> Tasks</Link>
            <Link to="/calendar"><i className="fas fa-calendar"></i> Calendar</Link>
            <Link to="/analytics"><i className="fas fa-chart-line"></i> Analytics</Link>
            <Link to="/admin-dashboard"><i className="fas fa-users-cog"></i> Admin</Link>
            <span className="user"><i className="fas fa-user-circle"></i> {user?.name}</span>
            <button className="btn" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
