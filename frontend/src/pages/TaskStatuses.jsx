import { useState, useEffect } from 'react'
import { taskStatusAPI } from '../services/api'

function TaskStatuses({ user }) {
  const [statuses, setStatuses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#6B7280',
    order: 0
  })

  useEffect(() => {
    loadStatuses()
  }, [])

  const loadStatuses = async () => {
    try {
      const response = await taskStatusAPI.getAll()
      setStatuses(response.data.statuses)
    } catch (error) {
      console.error('Error loading statuses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingStatus) {
        await taskStatusAPI.update(editingStatus.id, formData)
      } else {
        await taskStatusAPI.create(formData)
      }

      setShowForm(false)
      setEditingStatus(null)
      resetForm()
      loadStatuses()
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving status')
    }
  }

  const handleEdit = (status) => {
    setEditingStatus(status)
    setFormData({
      name: status.name,
      description: status.description || '',
      color: status.color || '#6B7280',
      order: status.order || 0
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this status?')) return

    try {
      await taskStatusAPI.delete(id)
      loadStatuses()
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting status')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#6B7280',
      order: 0
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingStatus(null)
    resetForm()
  }

  if (loading) {
    return <div className="loading">Loading task statuses...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Task Statuses</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="btn btn-primary"
        >
          Create Status
        </button>
      </div>

      <div className="card">
        {showForm && (
          <div className="card" style={{ backgroundColor: '#f9fafb', marginBottom: '1rem' }}>
            <h3>{editingStatus ? 'Edit Status' : 'Create New Status'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  />
                </div>

                <div className="form-group">
                  <label>Color</label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      style={{ width: '60px', height: '40px' }}
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="#6B7280"
                    />
                  </div>
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
                  {editingStatus ? 'Update Status' : 'Create Status'}
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
              <th>Order</th>
              <th>Name</th>
              <th>Description</th>
              <th>Color</th>
              <th>Preview</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {statuses.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                  No statuses found
                </td>
              </tr>
            ) : (
              statuses.map(status => (
                <tr key={status.id}>
                  <td>{status.order}</td>
                  <td><strong>{status.name}</strong></td>
                  <td>{status.description || 'N/A'}</td>
                  <td>{status.color}</td>
                  <td>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${status.color}20`,
                        color: status.color
                      }}
                    >
                      {status.name}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button onClick={() => handleEdit(status)} className="btn btn-secondary">
                        Edit
                      </button>
                      {!status.isDefault && (
                        <button onClick={() => handleDelete(status.id)} className="btn btn-danger">
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

export default TaskStatuses
