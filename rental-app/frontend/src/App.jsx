import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import AddHousePage from './pages/AddHousePage.jsx'
import Navbar from './components/Navbar.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/login" />
}

const AppContent = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Navigate to="/search" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/add-house" element={<ProtectedRoute><AddHousePage /></ProtectedRoute>} />
    </Routes>
  </Router>
)

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}


