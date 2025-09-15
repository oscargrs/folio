import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, Eye, Heart, Calendar, User, Download, FileText, Image, Video } from 'lucide-react'

const ProjectDetail = () => {
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/projects/${id}`)
      setProject(response.data)
      setError('')
    } catch (error) {
      setError('Projeto não encontrado')
      console.error('Erro:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image':
        return <Image size={20} />
      case 'video':
        return <Video size={20} />
      default:
        return <FileText size={20} />
    }
  }

  const getFileUrl = (filename) => {
    return `http://localhost:5000/uploads/${filename}`
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (loading) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="loading-detail">
            <div className="skeleton-header"></div>
            <div className="skeleton-content"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="project-detail">
        <div className="container">
          <div className="error-state">
            <h2>Projeto não encontrado</h2>
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

  const images = project.files.filter(file => file.file_type === 'image')
  const videos = project.files.filter(file => file.file_type === 'video')
  const documents = project.files.filter(file => file.file_type === 'document')

  return (
    <div className="project-detail">
      <div className="container">
        {/* Header */}
        <div className="project-header">
          <Link to="/gallery" className="back-btn">
            <ArrowLeft size={20} />
            Voltar à galeria
          </Link>

          <div className="project-title-section">
            <h1>{project.title}</h1>
            {project.category && (
              <span className="project-category">{project.category}</span>
            )}
          </div>

          <div className="project-stats">
            <div className="stat">
              <Eye size={20} />
              <span>{project.views} visualizações</span>
            </div>
            <div className="stat">
              <Heart size={20} />
              <span>{project.likes} curtidas</span>
            </div>
            <div className="stat">
              <Calendar size={20} />
              <span>{formatDate(project.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="project-author">
          <Link to={`/user/${project.author.id}`} className="author-card">
            <div className="author-avatar">
              {project.author.profile_picture ? (
                <img src={project.author.profile_picture} alt={project.author.full_name} />
              ) : (
                <User size={24} />
              )}
            </div>
            <div className="author-info">
              <h3>{project.author.full_name}</h3>
              <p>@{project.author.username}</p>
              {project.author.bio && (
                <p className="author-bio">{project.author.bio}</p>
              )}
            </div>
          </Link>
        </div>

        {/* Description */}
        <div className="project-description">
          <h2>Sobre o projeto</h2>
          <div className="description-content">
            {project.description.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Media Gallery */}
        {images.length > 0 && (
          <div className="media-section">
            <h2>Imagens</h2>
            <div className="images-grid">
              {images.map((image) => (
                <div key={image.id} className="image-item">
                  <img
                    src={getFileUrl(image.filename)}
                    alt={image.original_filename}
                    onClick={() => window.open(getFileUrl(image.filename), '_blank')}
                  />
                  <div className="image-overlay">
                    <span>{image.original_filename}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <div className="media-section">
            <h2>Vídeos</h2>
            <div className="videos-grid">
              {videos.map((video) => (
                <div key={video.id} className="video-item">
                  <video controls>
                    <source src={getFileUrl(video.filename)} type="video/mp4" />
                    Seu navegador não suporta o elemento de vídeo.
                  </video>
                  <p>{video.original_filename}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents */}
        {documents.length > 0 && (
          <div className="media-section">
            <h2>Documentos</h2>
            <div className="documents-list">
              {documents.map((doc) => (
                <div key={doc.id} className="document-item">
                  <div className="document-info">
                    {getFileIcon(doc.file_type)}
                    <div className="document-details">
                      <h4>{doc.original_filename}</h4>
                      <p>{formatFileSize(doc.file_size)} • {formatDate(doc.uploaded_at)}</p>
                    </div>
                  </div>
                  <a
                    href={getFileUrl(doc.filename)}
                    download={doc.original_filename}
                    className="download-btn"
                  >
                    <Download size={20} />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Info */}
        <div className="project-info">
          <div className="info-card">
            <h3>Informações do projeto</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Publicado em:</strong>
                <span>{formatDate(project.created_at)}</span>
              </div>
              {project.updated_at !== project.created_at && (
                <div className="info-item">
                  <strong>Última atualização:</strong>
                  <span>{formatDate(project.updated_at)}</span>
                </div>
              )}
              <div className="info-item">
                <strong>Total de arquivos:</strong>
                <span>{project.files.length}</span>
              </div>
              {project.category && (
                <div className="info-item">
                  <strong>Categoria:</strong>
                  <span>{project.category}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetail

