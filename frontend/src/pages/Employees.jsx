import { useState, useEffect } from 'react'
import { employeeAPI } from '../services/api'

function Employees({ user }) {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    password: '',
    address: '',
    salary: '',
    dateOfHire: '',
    dateOfBirth: '',
    department: '',
    role: ''
  })

  useEffect(() => {
    loadEmployees()
  }, [searchTerm])

  const loadEmployees = async () => {
    try {
      const params = searchTerm ? { search: searchTerm } : {}
      const response = await employeeAPI.getAll(params)
      setEmployees(response.data.employees)
    } catch (error) {
      console.error('Error loading employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editingEmployee) {
        const updateData = { ...formData }
        delete updateData.password
        delete updateData.employeeId
        delete updateData.email
        await employeeAPI.update(editingEmployee.id, updateData)
      } else {
        const createData = { ...formData }
        delete createData.employeeId  // Let backend auto-generate
        await employeeAPI.create(createData)
      }

      setShowForm(false)
      setEditingEmployee(null)
      resetForm()
      loadEmployees()
    } catch (error) {
      alert(error.response?.data?.error || 'Error saving employee')
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      password: '',
      address: employee.address || '',
      salary: employee.salary || '',
      dateOfHire: employee.dateOfHire || '',
      dateOfBirth: employee.dateOfBirth || '',
      department: employee.department || '',
      role: employee.role || ''
    })
    setShowForm(true)
  }

  const handleDeactivate = async (id) => {
    if (!confirm('Are you sure you want to deactivate this employee?')) return

    try {
      await employeeAPI.update(id, { isActive: false })
      loadEmployees()
    } catch (error) {
      alert(error.response?.data?.error || 'Error deactivating employee')
    }
  }

  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      password: '',
      address: '',
      salary: '',
      dateOfHire: '',
      dateOfBirth: '',
      department: '',
      role: ''
    })
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEmployee(null)
    resetForm()
  }

  if (loading) {
    return <div className="loading">Loading employees...</div>
  }

  const isAdmin = user?.groups?.some(group => group.isAdmin)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Employees</h1>
        {isAdmin && (
          <button
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
            className="btn btn-primary"
          >
            Add Employee
          </button>
        )}
      </div>

      <div className="card">
        <div className="form-group">
          <input
            type="text"
            placeholder="Search by name, employee ID, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
        </div>

        {showForm && (
          <div className="card" style={{ backgroundColor: '#f9fafb', marginBottom: '1rem' }}>
            <h3>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h3>
            <form onSubmit={handleSubmit}>
              {editingEmployee && (
                <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#e0e7ff', borderRadius: '4px' }}>
                  <strong>Employee ID:</strong> {formData.employeeId}
                </div>
              )}
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
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={editingEmployee}
                  />
                </div>

                {!editingEmployee && (
                  <div className="form-group">
                    <label>Password *</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Salary</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Date of Hire</label>
                  <input
                    type="date"
                    value={formData.dateOfHire}
                    onChange={(e) => setFormData({ ...formData, dateOfHire: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  {editingEmployee ? 'Update Employee' : 'Add Employee'}
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
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Role</th>
              <th>Groups</th>
              {isAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? "7" : "6"} style={{ textAlign: 'center', padding: '2rem' }}>
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map(employee => (
                <tr key={employee.id}>
                  <td>{employee.employeeId}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.department || 'N/A'}</td>
                  <td>{employee.role || 'N/A'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {employee.groups?.map(group => (
                        <span
                          key={group.id}
                          className={group.isAdmin ? 'badge badge-complete' : 'badge badge-open'}
                        >
                          {group.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  {isAdmin && (
                    <td>
                      <div className="actions">
                        <button onClick={() => handleEdit(employee)} className="btn btn-secondary">
                          Edit
                        </button>
                        {employee.isActive && (
                          <button onClick={() => handleDeactivate(employee.id)} className="btn btn-danger">
                            Deactivate
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Employees
