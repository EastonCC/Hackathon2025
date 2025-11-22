import { Outlet, NavLink } from 'react-router-dom'

function Layout({ user, onLogout }) {
  const isAdmin = user?.groups?.some(group => group.isAdmin)

  return (
    <div className="app">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src="/logo.png"
            alt="Clinic Logo"
            style={{ height: '40px', width: 'auto' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <h1>Valdosta Medicine</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div>
            <NavLink to="/">Dashboard</NavLink>
            <NavLink to="/tasks">Tasks</NavLink>
            <NavLink to="/employees">Employees</NavLink>
            {isAdmin && (
              <>
                <NavLink to="/groups">Groups</NavLink>
                <NavLink to="/task-statuses">Task Statuses</NavLink>
              </>
            )}
          </div>
          <div className="user-info">
            <span>{user?.name}</span>
            {isAdmin && <span className="badge badge-complete">Admin</span>}
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
