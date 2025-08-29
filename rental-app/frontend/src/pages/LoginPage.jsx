import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await login(form)
    setLoading(false)
    if (res.success) navigate('/search')
    else setError(res.error)
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input value={form.username} onChange={(e)=>setForm({...form, username: e.target.value})} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e)=>setForm({...form, password: e.target.value})} required />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
      </form>
      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  )
}


