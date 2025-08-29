import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  return (
    <nav style={{ padding: '12px 16px', borderBottom: '1px solid #eee', marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Link to="/search"><strong>Rental App</strong></Link>
        <div style={{ flex: 1 }} />
        {isAuthenticated ? (
          <>
            <Link to="/add-house">Add House</Link>
            <Link to="/profile">{user?.username || 'Profile'}</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  )
}


