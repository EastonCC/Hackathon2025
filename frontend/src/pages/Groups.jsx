import { useState, useEffect } from 'react'
import { groupAPI, employeeAPI } from '../services/api'

function Groups({ user }) {
  const [groups, setGroups] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGroup, setEditingGroup] = useState(null)
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showAddMember, setShowAddMember] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [groupsRes, employeesRes] = await Promise.all([
        groupAPI.getAll(),
        employeeAPI.getAll()
      ])

      setGroups(groupsRes.data.groups)
      setEmployees(employeesRes.data.employees)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingGroup) {
        await groupAPI.update(editingGroup.id, formData)
      } else {
        await groupAPI.create(formData)
      }

      setShowForm(false)
      setEditingGroup(null)
      resetForm()
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving group')
    }
  }

  const handleEdit = (group) => {
    setEditingGroup(group)
    setFormData({
      name: group.name,
      description: group.description || ''
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this group?')) return

    try {
      await groupAPI.delete(id)
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error deleting group')
    }
  }

  const handleAddMember = async () => {
    if (!selectedEmployee) return

    try {
      await groupAPI.addMember(selectedGroup.id, selectedEmployee)
      setShowAddMember(false)
      setSelectedEmployee('')
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error adding member')
    }
  }

  const handleRemoveMember = async (groupId, employeeId) => {
    if (!confirm('Are you sure you want to remove this member?')) return

    try {
      await groupAPI.removeMember(groupId, employeeId)
      loadData()
    } catch (error) {
      alert(error.response?.data?.error || 'Error removing member')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingGroup(null)
    resetForm()
  }

  if (loading) {
    return <div className="loading">Loading groups...</div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Groups</h1>
        <button
          onClick={() => {
            resetForm()
            setShowForm(true)
          }}
          className="btn btn-primary"
        >
          Create Group
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3>{editingGroup ? 'Edit Group' : 'Create New Group'}</h3>
          <form onSubmit={handleSubmit}>
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
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="btn btn-primary">
                {editingGroup ? 'Update Group' : 'Create Group'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-2">
        {groups.map(group => (
          <div key={group.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
              <div>
                <h2>
                  {group.name}
                  {group.isAdmin && (
                    <span className="badge badge-complete" style={{ marginLeft: '0.5rem' }}>
                      Admin
                    </span>
                  )}
                </h2>
                {group.description && (
                  <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>{group.description}</p>
                )}
              </div>
              <div className="actions">
                <button onClick={() => handleEdit(group)} className="btn btn-secondary">
                  Edit
                </button>
                {!group.isAdmin && (
                  <button onClick={() => handleDelete(group.id)} className="btn btn-danger">
                    Delete
                  </button>
                )}
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>Members ({group.members?.length || 0})</strong>
                <button
                  onClick={() => {
                    setSelectedGroup(group)
                    setShowAddMember(true)
                  }}
                  className="btn btn-success"
                  style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                >
                  Add Member
                </button>
              </div>

              {showAddMember && selectedGroup?.id === group.id && (
                <div style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <select
                      value={selectedEmployee}
                      onChange={(e) => setSelectedEmployee(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="">Select employee...</option>
                      {employees
                        .filter(emp => !group.members?.find(m => m.id === emp.id))
                        .map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.name} ({emp.employeeId})
                          </option>
                        ))
                      }
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={handleAddMember} className="btn btn-success" style={{ fontSize: '0.875rem' }}>
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddMember(false)
                        setSelectedEmployee('')
                      }}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.875rem' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {group.members && group.members.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {group.members.map(member => (
                    <div
                      key={member.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px'
                      }}
                    >
                      <div>
                        <div>{member.name}</div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {member.employeeId} • {member.department || 'N/A'} • {member.role || 'N/A'}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveMember(group.id, member.id)}
                        className="btn btn-danger"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>No members yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Groups
