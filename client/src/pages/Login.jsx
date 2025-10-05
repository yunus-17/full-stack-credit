import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const { token, setToken, setUser } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token, navigate])

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await apiFetch('/api/auth/login', { method: 'POST', body: form })
      setToken(res.token)
      setUser(res.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container-modern">
        <div className="auth-left">
          <div className="auth-brand">
            <i className="fas fa-tasks"></i>
            <h2>Task Manager</h2>
          </div>
          <h1>Welcome Back!</h1>
          <p>Sign in to continue managing your tasks and boost your productivity.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <i className="fas fa-check-circle"></i>
              <span>Organize your tasks efficiently</span>
            </div>
            <div className="auth-feature">
              <i className="fas fa-check-circle"></i>
              <span>Track your progress in real-time</span>
            </div>
            <div className="auth-feature">
              <i className="fas fa-check-circle"></i>
              <span>Never miss a deadline</span>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>
            <form onSubmit={onSubmit} className="auth-form-modern">
              <div className="form-group-modern">
                <label><i className="fas fa-envelope"></i> Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  placeholder="you@example.com"
                  value={form.email} 
                  onChange={onChange} 
                  required 
                />
              </div>
              <div className="form-group-modern">
                <label><i className="fas fa-lock"></i> Password</label>
                <input 
                  name="password" 
                  type="password" 
                  placeholder="Enter your password"
                  value={form.password} 
                  onChange={onChange} 
                  required 
                />
              </div>
              {error && <div className="error-modern"><i className="fas fa-exclamation-circle"></i> {error}</div>}
              <button className="btn-auth" disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Signing in...</>
                ) : (
                  <><i className="fas fa-sign-in-alt"></i> Sign In</>
                )}
              </button>
            </form>
            <div className="auth-footer">
              <p>Don't have an account? <Link to="/register">Create one now</Link></p>
              <Link to="/" className="back-home"><i className="fas fa-arrow-left"></i> Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
