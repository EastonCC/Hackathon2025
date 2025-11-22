import { useState, useEffect } from 'react'
import { employeeAPI, taskAPI, groupAPI } from '../services/api'

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalTasks: 0,
    myTasks: 0,
    totalGroups: 0
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [employeesRes, tasksRes, myTasksRes, groupsRes] = await Promise.all([
        employeeAPI.getAll(),
        taskAPI.getAll(),
        taskAPI.getMyTasks(),
        groupAPI.getAll()
      ])

      setStats({
        totalEmployees: employeesRes.data.employees.length,
        totalTasks: tasksRes.data.tasks.length,
        myTasks: myTasksRes.data.tasks.length,
        totalGroups: groupsRes.data.groups.length
      })

      setRecentTasks(myTasksRes.data.tasks.slice(0, 5))
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>
  }

  const isAdmin = user?.groups?.some(group => group.isAdmin)

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Dashboard</h1>

      <div className="grid grid-3">
        <div className="stat-card">
          <h3>{stats.totalEmployees}</h3>
          <p>Total Employees</p>
        </div>
        <div className="stat-card">
          <h3>{stats.myTasks}</h3>
          <p>My Tasks</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalTasks}</h3>
          <p>Total Tasks</p>
        </div>
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h2>Welcome, {user.name}!</h2>
        <div className="grid grid-2" style={{ marginTop: '1rem' }}>
          <div>
            <p><strong>Employee ID:</strong> {user.employeeId}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Department:</strong> {user.department || 'N/A'}</p>
            <p><strong>Role:</strong> {user.role || 'N/A'}</p>
          </div>
          <div>
            <p><strong>Groups:</strong></p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {user.groups?.map(group => (
                <span
                  key={group.id}
                  className={group.isAdmin ? 'badge badge-complete' : 'badge badge-open'}
                >
                  {group.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {recentTasks.length > 0 && (
        <div className="card">
          <h2>My Recent Tasks</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${task.status.name.toLowerCase().replace('-', '-')}`}>
                      {task.status.name}
                    </span>
                  </td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard
