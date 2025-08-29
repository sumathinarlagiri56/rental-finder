import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      const u = localStorage.getItem('user')
      if (u) setUser(JSON.parse(u))
    }
  }, [])

  const login = async ({ username, password }) => {
    try {
      const res = await axios.post('/api/auth/login', { username, password })
      const { token, id, username: un, email } = res.data
      localStorage.setItem('token', token)
      const u = { id, username: un, email }
      localStorage.setItem('user', JSON.stringify(u))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(u)
      setIsAuthenticated(true)
      return { success: true }
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Invalid credentials' }
    }
  }

  const signup = async (payload) => {
    try {
      const res = await axios.post('/api/auth/signup', payload)
      const { token, id, username: un, email } = res.data
      localStorage.setItem('token', token)
      const u = { id, username: un, email }
      localStorage.setItem('user', JSON.stringify(u))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(u)
      setIsAuthenticated(true)
      return { success: true }
    } catch (e) {
      return { success: false, error: e.response?.data?.error || 'Registration failed' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


