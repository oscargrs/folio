import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { User, ArrowLeft, Eye, Heart, Calendar } from 'lucide-react'

const UserProfile = () => {
  const { id } = useParams()
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUserProfile()
  }, [id])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/users/${id}`)
      setUserProfile(response.data)
      setError('')
    } catch (error) {
      setError('Usuário não encontrado')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatJoinDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  const getProjectImage = (project) => {
    // Esta função seria implementada para buscar a primeira imagem do projeto
    return null // Por enquanto retorna null
  }

  if (loading) {
    return (
      <div className="user-profile">
        <div className="container">
          <div className="loading-profile">
            <div className="skeleton-header"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !userProfile) {
    return (
      <div className="user-profile">
        <div className="container">
          <div className="error-state">
            <h2>Usuário não encontrado</h2>
            <p>{error}</p>
            <Link to="/gallery" className="btn btn-primary">
              <ArrowLeft size={20} />
              Voltar à galeria
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="user-profile">
      <div className="container">
        {/* Back Button */}
        <Link to="/gallery" className="back-btn">
          <ArrowLeft size={20} />
          Voltar à galeria
        </Link>

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {userProfile.profile_picture ? (
              <img src={userProfile.profile_picture} alt={userProfile.full_name} />
            ) : (
              <User size={48} />
            )}
          </div>

          <div className="profile-info">
            <div className="profile-details">
              <div className="profile-name">
                <h1>{userProfile.full_name}</h1>
                <p>@{userProfile.username}</p>
              </div>
              
              {userProfile.bio && (
                <div className="profile-bio">
                  <p>{userProfile.bio}</p>
                </div>
              )}

              <div className="profile-stats">
                <div className="stat">
                  <strong>{userProfile.projects_count}</strong>
                  <span>Projetos</span>
                </div>
                <div className="stat">
                  <strong>{userProfile.projects.reduce((sum, p) => sum + p.views, 0)}</strong>
                  <span>Visualizações</span>
                </div>
                <div className="stat">
                  <strong>{userProfile.projects.reduce((sum, p) => sum + p.likes, 0)}</strong>
                  <span>Curtidas</span>
                </div>
              </div>

              <div className="profile-meta">
                <p>Membro desde {formatJoinDate(userProfile.created_at)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="profile-projects">
          <div className="projects-header">
            <h2>Projetos de {userProfile.full_name.split(' ')[0]}</h2>
            <span className="projects-count">
              {userProfile.projects_count} projeto{userProfile.projects_count !== 1 ? 's' : ''}
            </span>
          </div>

          {userProfile.projects.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhum projeto publicado</h3>
              <p>Este usuário ainda não publicou nenhum projeto.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {userProfile.projects.map((project) => (
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

export default UserProfile

