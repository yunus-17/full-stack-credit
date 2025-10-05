import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiFetch } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const { token, setToken, setUser } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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
      const res = await apiFetch('/api/auth/register', { method: 'POST', body: form })
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
          <h1>Start Your Journey!</h1>
          <p>Create your account and unlock powerful task management features to supercharge your productivity.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <i className="fas fa-rocket"></i>
              <span>Get started in seconds</span>
            </div>
            <div className="auth-feature">
              <i className="fas fa-shield-alt"></i>
              <span>Your data is secure with us</span>
            </div>
            <div className="auth-feature">
              <i className="fas fa-infinity"></i>
              <span>Free forever, no credit card</span>
            </div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join thousands of productive users today</p>
            </div>
            <form onSubmit={onSubmit} className="auth-form-modern">
              <div className="form-group-modern">
                <label><i className="fas fa-user"></i> Full Name</label>
                <input 
                  name="name" 
                  type="text"
                  placeholder="John Doe"
                  value={form.name} 
                  onChange={onChange} 
                  required 
                />
              </div>
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
                  placeholder="Create a strong password"
                  value={form.password} 
                  onChange={onChange} 
                  required 
                  minLength={6}
                />
              </div>
              {error && <div className="error-modern"><i className="fas fa-exclamation-circle"></i> {error}</div>}
              <button className="btn-auth" disabled={loading}>
                {loading ? (
                  <><i className="fas fa-spinner fa-spin"></i> Creating account...</>
                ) : (
                  <><i className="fas fa-user-plus"></i> Create Account</>
                )}
              </button>
            </form>
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in here</Link></p>
              <Link to="/" className="back-home"><i className="fas fa-arrow-left"></i> Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
