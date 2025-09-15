import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { User, Edit, Save, X, Plus, Eye, Heart, Calendar } from 'lucide-react'

const Profile = ({ user, setUser }) => {
  const [userProjects, setUserProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || ''
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/users/${user.id}`)
      setUserProjects(response.data.projects)
      setError('')
    } catch (error) {
      setError('Erro ao carregar perfil')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await axios.put(`/api/users/${user.id}`, formData)
      setUser(response.data.user)
      setEditing(false)
      setError('')
    } catch (error) {
      setError(error.response?.data?.error || 'Erro ao salvar perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name,
      bio: user.bio || ''
    })
    setEditing(false)
    setError('')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  const getProjectImage = (project) => {
    // Esta função seria implementada para buscar a primeira imagem do projeto
    return null // Por enquanto retorna null
  }

  if (!user) {
    return (
      <div className="profile">
        <div className="container">
          <div className="error-state">
            <p>Usuário não encontrado</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile">
      <div className="container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt={user.full_name} />
            ) : (
              <User size={48} />
            )}
          </div>

          <div className="profile-info">
            {editing ? (
              <div className="edit-form">
                {error && (
                  <div className="error-message">
                    {error}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="full_name">Nome completo</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Biografia</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Conte um pouco sobre você..."
                    rows="4"
                  />
                </div>

                <div className="edit-actions">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    <Save size={18} />
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="btn btn-secondary"
                  >
                    <X size={18} />
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <div className="profile-name">
                  <h1>{user.full_name}</h1>
                  <p>@{user.username}</p>
                </div>
                
                {user.bio && (
                  <div className="profile-bio">
                    <p>{user.bio}</p>
                  </div>
                )}

                <div className="profile-stats">
                  <div className="stat">
                    <strong>{userProjects.length}</strong>
                    <span>Projetos</span>
                  </div>
                  <div className="stat">
                    <strong>{userProjects.reduce((sum, p) => sum + p.views, 0)}</strong>
                    <span>Visualizações</span>
                  </div>
                  <div className="stat">
                    <strong>{userProjects.reduce((sum, p) => sum + p.likes, 0)}</strong>
                    <span>Curtidas</span>
                  </div>
                </div>

                <button
                  onClick={() => setEditing(true)}
                  className="btn btn-secondary"
                >
                  <Edit size={18} />
                  Editar perfil
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Projects Section */}
        <div className="profile-projects">
          <div className="projects-header">
            <h2>Meus projetos</h2>
            <Link to="/create-project" className="btn btn-primary">
              <Plus size={18} />
              Novo projeto
            </Link>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="project-card skeleton">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-content">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : userProjects.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhum projeto publicado</h3>
              <p>Comece criando seu primeiro projeto e compartilhe seu trabalho com a comunidade.</p>
              <Link to="/create-project" className="btn btn-primary">
                <Plus size={18} />
                Criar primeiro projeto
              </Link>
            </div>
          ) : (
            <div className="projects-grid">
              {userProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="project-card"
                >
                  <div className="project-image">
                    {getProjectImage(project) ? (
                      <img
                        src={getProjectImage(project)}
                        alt={project.title}
                      />
                    ) : (
                      <div className="project-placeholder">
                        <span>📄</span>
                      </div>
                    )}
                    <div className="project-overlay">
                      <div className="project-stats">
                        <span>
                          <Eye size={16} />
                          {project.views}
                        </span>
                        <span>
                          <Heart size={16} />
                          {project.likes}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="project-content">
                    <h3 className="project-title">
                      {truncateText(project.title, 60)}
                    </h3>
                    <p className="project-description">
                      {truncateText(project.description, 120)}
                    </p>
                    
                    <div className="project-meta">
                      <div className="project-date">
                        <Calendar size={16} />
                        <span>{formatDate(project.created_at)}</span>
                      </div>
                    </div>

                    {project.category && (
                      <div className="project-category">
                        {project.category}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile

