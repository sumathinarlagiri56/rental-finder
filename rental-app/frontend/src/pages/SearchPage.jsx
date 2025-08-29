import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function SearchPage() {
  const [district, setDistrict] = useState('')
  const [city, setCity] = useState('')
  const [districts, setDistricts] = useState([])
  const [cities, setCities] = useState([])
  const [houses, setHouses] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const res = await fetch('/telangana_districts_cities.json')
        const data = await res.json()
        setDistricts(Object.keys(data))
      } catch (e) {
        console.error('Failed loading districts', e)
      }
    }
    loadDistricts()
  }, [])

  useEffect(() => {
    const loadCities = async () => {
      if (!district) { setCities([]); setCity(''); return }
      try {
        const res = await fetch('/telangana_districts_cities.json')
        const data = await res.json()
        setCities(data[district] || [])
        setCity('')
      } catch (e) {
        console.error('Failed loading cities', e)
      }
    }
    loadCities()
  }, [district])

  const search = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.get('/api/houses/search', { params: { district, city } })
      setHouses(res.data.houses)
    } catch (e) {
      setError('Search failed')
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Search Houses</h2>
      <form onSubmit={search}>
        <select value={district} onChange={e=>setDistrict(e.target.value)}>
          <option value="">Select district</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={city} onChange={e=>setCity(e.target.value)} disabled={!district}>
          <option value="">{district ? 'Select city' : 'Select district first'}</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button type="submit">Search</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {houses.map(h => (
          <li key={h.id}>{h.type} - {h.city}, {h.district}</li>
        ))}
      </ul>
    </div>
  )
}


