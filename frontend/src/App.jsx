import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import './App.css'

// Componentes
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Gallery from './pages/Gallery'
import ProjectDetail from './pages/ProjectDetail'
import CreateProject from './pages/CreateProject'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'

// Configurar axios
axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.withCredentials = true

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/current_user')
      setUser(response.data.user)
    } catch (error) {
      console.log('Usuário não autenticado')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout')
      setUser(null)
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route 
              path="/login" 
              element={user ? <Navigate to="/gallery" /> : <Login onLogin={handleLogin} />} 
            />
            <Route 
              path="/register" 
              element={user ? <Navigate to="/gallery" /> : <Register />} 
            />
            <Route 
              path="/create-project" 
              element={user ? <CreateProject user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
            />
            <Route path="/user/:id" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
