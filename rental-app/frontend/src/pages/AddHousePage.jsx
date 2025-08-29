import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function AddHousePage() {
  const [form, setForm] = useState({ type: '', phoneNumber: '', district: '', city: '' })
  const [image, setImage] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('type', form.type)
      fd.append('phoneNumber', form.phoneNumber)
      fd.append('district', form.district)
      fd.append('city', form.city)
      if (image) fd.append('image', image)
      await axios.post('/api/houses/add', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      navigate('/profile')
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to add house')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Add House</h2>
      <form onSubmit={submit}>
        <div><input placeholder="Type (e.g., 2BHK)" value={form.type} onChange={e=>setForm({...form, type: e.target.value})} required /></div>
        <div><input placeholder="Phone" value={form.phoneNumber} onChange={e=>setForm({...form, phoneNumber: e.target.value})} required /></div>
        <div><input placeholder="District" value={form.district} onChange={e=>setForm({...form, district: e.target.value})} required /></div>
        <div><input placeholder="City" value={form.city} onChange={e=>setForm({...form, city: e.target.value})} required /></div>
        <div><input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} /></div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
      </form>
    </div>
  )
}


