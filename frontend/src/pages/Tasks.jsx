import { useState, useEffect } from 'react'
import { taskAPI, taskStatusAPI, employeeAPI, groupAPI } from '../services/api'

function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [statuses, setStatuses] = useState([])
  const [employees, setEmployees] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [showMyTasks, setShowMyTasks] = useState(false)
  const [directTasksOnly, setDirectTasksOnly] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assigneeType: 'employee',
    assigneeId: '',
    statusId: ''
  })

  useEffect(() => {
    loadData()
  }, [showMyTasks, filterStatus, directTasksOnly])

  const loadData = async () => {
    try {
      const [statusesRes, employeesRes, groupsRes] = await Promise.all([
        taskStatusAPI.getAll(),
        employeeAPI.getAll(),
        groupAPI.getAll()
      ])

      setStatuses(statusesRes.data.statuses)
      setEmployees(employeesRes.data.employees)
      setGroups(groupsRes.data.groups)

      const params = filterStatus ? { statusId: filterStatus } : {}
      if (directTasksOnly) {
        params.directOnly = 'true'
      }

      const tasksRes = showMyTasks
        ? await taskAPI.getMyTasks(params)
        : await taskAPI.getAll(params)

      setTasks(tasksRes.data.tasks)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingTask) {
        await taskAPI.update(editingTask.id, formData)
      } else {
        await taskAPI.create(formData)
      }

      setShowForm(false)
      setEditingTask(null)
      resetForm()
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving task')
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      assigneeType: task.assigneeType,
      assigneeId: task.assigneeId,
      statusId: task.statusId
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    try {
      await taskAPI.delete(id)
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting task')
    }
  }

  const handleApprove = async (id) => {
    if (!confirm('Approve this task completion?')) return

    try {
      await taskAPI.approve(id)
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error approving task')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      assigneeType: 'employee',
      assigneeId: '',
      statusId: statuses.find(s => s.name === 'Open')?.id || ''
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingTask(null)
    resetForm()
  }

  if (loading) {
    return <div className="loading">Loading tasks...</div>
  }

  const isAdmin = user?.groups?.some(group => group.isAdmin)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Tasks</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="btn btn-primary"
        >
          Create Task
        </button>
      </div>

      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Filter by status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ padding: '0.5rem' }}
            >
              <option value="">All Statuses</option>
              {statuses.map(status => (
                <option key={status.id} value={status.id}>{status.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                checked={showMyTasks}
                onChange={(e) => setShowMyTasks(e.target.checked)}
              />
              Show only my tasks
            </label>
          </div>
          {showMyTasks && (
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={directTasksOnly}
                  onChange={(e) => setDirectTasksOnly(e.target.checked)}
                />
                Show only tasks assigned directly to me
              </label>
            </div>
          )}
        </div>

        {showForm && (
          <div className="card" style={{ backgroundColor: '#f9fafb', marginBottom: '1rem' }}>
            <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign to</label>
                  <select
                    value={formData.assigneeType}
                    onChange={(e) => setFormData({ ...formData, assigneeType: e.target.value, assigneeId: '' })}
                  >
                    <option value="employee">Employee</option>
                    <option value="group">Group</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>{formData.assigneeType === 'employee' ? 'Employee' : 'Group'} *</label>
                  <select
                    value={formData.assigneeId}
                    onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                    required
                  >
                    <option value="">Select {formData.assigneeType}</option>
                    {formData.assigneeType === 'employee'
                      ? employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.employeeId})
                          </option>
                        ))
                      : groups.map(group => (
                          <option key={group.id} value={group.id}>
                            {group.name}
                          </option>
                        ))
                    }
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.statusId}
                    onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
                    required
                  >
                    <option value="">Select status</option>
                    {statuses.map(status => (
                      <option key={status.id} value={status.id}>{status.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Assigned To</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task.id}>
                  <td>
                    <strong>{task.title}</strong>
                    {task.description && (
                      <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        {task.description.substring(0, 100)}
                        {task.description.length > 100 && '...'}
                      </div>
                    )}
                  </td>
                  <td>
                    {task.assignee?.type === 'employee' ? (
                      <div>
                        {task.assignee.name}
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {task.assignee.employeeId}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="badge badge-open">{task.assignee?.name}</span>
                      </div>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span className={`badge badge-${task.status.name.toLowerCase().replace('-', '-')}`}>
                        {task.status.name}
                      </span>
                      {task.pendingApproval && (
                        <span className="badge" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                          Pending Approval
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleEdit(task)} className="btn btn-secondary">
                        Edit
                      </button>
                      {isAdmin && task.pendingApproval && (
                        <button onClick={() => handleApprove(task.id)} className="btn btn-success">
                          Approve
                        </button>
                      )}
                      {isAdmin && (
                        <button onClick={() => handleDelete(task.id)} className="btn btn-danger">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Tasks
