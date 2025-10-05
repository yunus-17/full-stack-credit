import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const { token } = useAuth()
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (token) navigate('/dashboard')
  }, [token, navigate])

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fas fa-rocket"></i> Your Productivity Partner
          </div>
          <h1 className="hero-title">
            Organize Your Life,<br />
            <span className="gradient-text">One Task at a Time</span>
          </h1>
          <p className="hero-subtitle">
            A powerful, intuitive task manager that helps you stay on top of your goals.
            Prioritize, track, and accomplish more every day.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              <i className="fas fa-user-plus"></i> Get Started Free
            </Link>
            <Link to="/login" className="btn-secondary">
              <i className="fas fa-sign-in-alt"></i> Sign In
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat">
              <div className="stat-number">500K+</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <div className="stat">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
        <div className="hero-image">
          <div className="floating-card card-1">
            <i className="fas fa-check-circle"></i>
            <span>Task Completed!</span>
          </div>
          <div className="floating-card card-2">
            <i className="fas fa-bell"></i>
            <span>Reminder: Meeting at 3 PM</span>
          </div>
          <div className="floating-card card-3">
            <i className="fas fa-chart-line"></i>
            <span>80% Weekly Progress</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>Everything You Need to Stay Productive</h2>
          <p>Powerful features designed to help you manage tasks effortlessly</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <i className="fas fa-tasks"></i>
            </div>
            <h3>Smart Task Management</h3>
            <p>Create, organize, and prioritize tasks with an intuitive interface. Set due dates, add descriptions, and never miss a deadline.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">
              <i className="fas fa-filter"></i>
            </div>
            <h3>Advanced Filtering</h3>
            <p>Filter by status, priority, or custom criteria. Find exactly what you need in seconds with powerful search capabilities.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon purple">
              <i className="fas fa-chart-pie"></i>
            </div>
            <h3>Progress Tracking</h3>
            <p>Visualize your productivity with real-time statistics. Track completed tasks and monitor your progress over time.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon orange">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>Fully Responsive</h3>
            <p>Access your tasks anywhere, anytime. Seamless experience across desktop, tablet, and mobile devices.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon red">
              <i className="fas fa-bolt"></i>
            </div>
            <h3>Lightning Fast</h3>
            <p>Built with modern technology for instant loading and smooth interactions. No lag, no waiting.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon teal">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>Secure & Private</h3>
            <p>Your data is encrypted and secure. We respect your privacy and never share your information.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>Get Started in 3 Simple Steps</h2>
          <p>Start organizing your life in less than a minute</p>
        </div>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3>Create Your Account</h3>
            <p>Sign up for free in seconds. No credit card required.</p>
          </div>
          <div className="step-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-icon">
              <i className="fas fa-plus-circle"></i>
            </div>
            <h3>Add Your Tasks</h3>
            <p>Create tasks, set priorities, and add due dates.</p>
          </div>
          <div className="step-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <h3>Achieve Your Goals</h3>
            <p>Stay organized and accomplish more every day.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Boost Your Productivity?</h2>
          <p>Join thousands of users who are getting more done with our task manager</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta">
              Start Free Today <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          <p className="cta-note">No credit card required • Free forever • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3><i className="fas fa-tasks"></i> Task Manager</h3>
            <p>Your ultimate productivity companion for managing tasks and achieving goals.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><Link to="/login">Features</Link></li>
              <li><Link to="/login">Pricing</Link></li>
              <li><Link to="/login">Security</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><Link to="/login">About</Link></li>
              <li><Link to="/login">Blog</Link></li>
              <li><Link to="/login">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><Link to="/login">Help Center</Link></li>
              <li><Link to="/login">Contact</Link></li>
              <li><Link to="/login">Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Task Manager. All rights reserved.</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </footer>
    </div>
  )
}
