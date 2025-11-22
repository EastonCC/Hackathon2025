import { useState } from 'react'
import { authAPI } from '../services/api'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login({ email, password })
      onLogin(response.data.employee, response.data.token)
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1rem' }}>
          <img
            src="/logo.png"
            alt="Clinic Logo"
            style={{ height: '80px', width: 'auto', marginBottom: '1rem' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <h2>Valdosta Medicine</h2>
        </div>
        <h3 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#6b7280' }}>
          Task Management System
        </h3>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your.email@clinicops.com"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            <strong>Demo Credentials:</strong>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Admin: admin@clinicops.test / admintest123!!<br />
            User: user@clinicops.test / usertest123!!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
