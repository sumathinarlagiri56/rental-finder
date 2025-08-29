import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [houses, setHouses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      try {
        const [p, h] = await Promise.all([
          axios.get('/api/user/profile'),
          axios.get('/api/houses/my')
        ])
        setProfile(p.data)
        setHouses(h.data.houses || [])
      } catch (e) {
        const status = e.response?.status
        if (status === 401 || status === 403) {
          navigate('/login')
          return
        }
        setError(e.response?.data?.error || 'Error loading user data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div style={{ padding: 24 }}>Loading profile...</div>
  if (error) return <div style={{ padding: 24, color: 'red' }}>{error}</div>

  return (
    <div style={{ padding: 24 }}>
      <h2>My Profile</h2>
      <div>Username: {profile?.username}</div>
      <div>Email: {profile?.email}</div>
      <div>Phone: {profile?.phoneNumber || 'Not provided'}</div>

      <h3 style={{ marginTop: 24 }}>My Listings</h3>
      {houses.length === 0 ? (
        <div>No listings yet.</div>
      ) : (
        <ul>
          {houses.map(h => (
            <li key={h.id}>{h.type} - {h.city}, {h.district}</li>
          ))}
        </ul>
      )}
    </div>
  )
}


