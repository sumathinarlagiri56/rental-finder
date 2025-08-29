import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { signup } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    const res = await signup({ username: form.username, email: form.email, password: form.password })
    setLoading(false)
    if (res.success) navigate('/search')
    else setError(res.error)
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto' }}>
      <h2>Create Account</h2>
      <form onSubmit={submit}>
        <div>
          <label>Username</label>
          <input value={form.username} onChange={(e)=>setForm({ ...form, username: e.target.value })} required />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} required />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} required />
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" value={form.confirmPassword} onChange={(e)=>setForm({ ...form, confirmPassword: e.target.value })} required />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
      </form>
      <p>Already have an account? <Link to="/login">Sign in</Link></p>
    </div>
  )
}


