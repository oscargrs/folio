import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, Menu, X, Home, Image, Plus, Search } from 'lucide-react'

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <h2>TCC Portfolio</h2>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop-menu">
          <Link to="/" className="navbar-link">
            <Home size={18} />
            Início
          </Link>
          <Link to="/gallery" className="navbar-link">
            <Image size={18} />
            Galeria
          </Link>
          {user && (
            <Link to="/create-project" className="navbar-link">
              <Plus size={18} />
              Criar Projeto
            </Link>
          )}
        </div>

        {/* User Menu */}
        <div className="navbar-user desktop-menu">
          {user ? (
            <div className="user-menu">
              <Link to="/profile" className="user-profile">
                <User size={18} />
                {user.username}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <LogOut size={18} />
                Sair
              </button>
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="auth-link">Entrar</Link>
              <Link to="/register" className="auth-link register">Cadastrar</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            <Home size={18} />
            Início
          </Link>
          <Link to="/gallery" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
            <Image size={18} />
            Galeria
          </Link>
          {user && (
            <Link to="/create-project" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
              <Plus size={18} />
              Criar Projeto
            </Link>
          )}
          {user ? (
            <>
              <Link to="/profile" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                <User size={18} />
                Meu Perfil
              </Link>
              <button onClick={handleLogout} className="mobile-link logout">
                <LogOut size={18} />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Entrar
              </Link>
              <Link to="/register" className="mobile-link" onClick={() => setIsMenuOpen(false)}>
                Cadastrar
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar

