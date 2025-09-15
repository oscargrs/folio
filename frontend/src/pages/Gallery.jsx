import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Search, Filter, Eye, Heart, Calendar, User } from 'lucide-react'

const Gallery = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [currentPage, sortBy])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (currentPage === 1) {
        fetchProjects()
      } else {
        setCurrentPage(1)
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [searchTerm])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/projects', {
        params: {
          page: currentPage,
          per_page: 12,
          search: searchTerm,
          sort_by: sortBy
        }
      })
      
      setProjects(response.data.projects)
      setTotalPages(response.data.pages)
      setError('')
    } catch (error) {
      setError('Erro ao carregar projetos')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text
    return text.substr(0, maxLength) + '...'
  }

  const getProjectImage = (project) => {
    const imageFile = project.files?.find(file => file.file_type === 'image')
    return imageFile ? `http://localhost:5000/uploads/${imageFile.filename}` : null
  }

  return (
    <div className="gallery">
      <div className="container">
        {/* Header */}
        <div className="gallery-header">
          <h1>Galeria de Projetos</h1>
          <p>Explore os trabalhos de conclusão de curso de nossa comunidade</p>
        </div>

        {/* Filters */}
        <div className="gallery-filters">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Buscar projetos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sort-box">
            <Filter size={20} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="created_at">Mais recentes</option>
              <option value="views">Mais visualizados</option>
              <option value="likes">Mais curtidos</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="project-card skeleton">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-text"></div>
                  <div className="skeleton-text"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button onClick={fetchProjects} className="btn btn-primary">
              Tentar novamente
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum projeto encontrado</h3>
            <p>
              {searchTerm 
                ? `Não encontramos projetos para "${searchTerm}"`
                : 'Ainda não há projetos publicados'
              }
            </p>
          </div>
        ) : (
          <>
            {/* Projects Grid */}
            <div className="projects-grid">
              {projects.map((project) => (
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
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.nextSibling.style.display = 'flex'
                        }}
                      />
                    ) : null}
                    <div className="project-placeholder" style={{display: getProjectImage(project) ? 'none' : 'flex'}}>
                      <span>📄</span>
                    </div>
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
                      <div className="project-author">
                        <User size={16} />
                        <span>{project.author.full_name}</span>
                      </div>
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Anterior
                </button>
                
                <div className="pagination-info">
                  Página {currentPage} de {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Gallery

