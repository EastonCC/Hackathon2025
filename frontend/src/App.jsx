import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Employees from './pages/Employees'
import Tasks from './pages/Tasks'
import Groups from './pages/Groups'
import TaskStatuses from './pages/TaskStatuses'
import Layout from './components/Layout'
import { authAPI } from './services/api'

function PrivateRoute({ children, user }) {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

function AppContent() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.getProfile()
        .then(response => {
          setUser(response.data.employee)
          setLoading(false)
        })
        .catch(() => {
          localStorage.removeItem('token')
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token)
    setUser(userData)
    navigate('/')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Routes>
      <Route path="/login" element={
        user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
      } />
      <Route path="/" element={
        <PrivateRoute user={user}>
          <Layout user={user} onLogout={handleLogout} />
        </PrivateRoute>
      }>
        <Route index element={<Dashboard user={user} />} />
        <Route path="employees" element={<Employees user={user} />} />
        <Route path="tasks" element={<Tasks user={user} />} />
        <Route path="groups" element={<Groups user={user} />} />
        <Route path="task-statuses" element={<TaskStatuses user={user} />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  )
}

function App() {
  console.log('App component rendering...')
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App
