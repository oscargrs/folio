import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Plus, Upload, X, FileText, Image, Video, Check } from 'lucide-react'

const CreateProject = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  })
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [projectId, setProjectId] = useState(null)
  const navigate = useNavigate()

  const categories = [
    'Engenharia de Software',
    'Sistemas de Informação',
    'Ciência da Computação',
    'Engenharia Civil',
    'Engenharia Elétrica',
    'Engenharia Mecânica',
    'Administração',
    'Psicologia',
    'Medicina',
    'Direito',
    'Educação',
    'Design',
    'Arquitetura',
    'Outro'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const newFiles = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      uploaded: false,
      uploading: false,
      error: null
    }))
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return <Image size={20} />
    if (file.type.startsWith('video/')) return <Video size={20} />
    return <FileText size={20} />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const createProject = async () => {
    try {
      const response = await axios.post('/api/projects', formData)
      setProjectId(response.data.project.id)
      return response.data.project.id
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao criar projeto')
    }
  }

  const uploadFile = async (file, projectId) => {
    const formData = new FormData()
    formData.append('file', file.file)

    try {
      await axios.post(`/api/projects/${projectId}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return true
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao enviar arquivo')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Criar o projeto
      const newProjectId = await createProject()

      // Upload dos arquivos
      if (files.length > 0) {
        setUploading(true)
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          
          // Atualizar status do arquivo
          setFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, uploading: true } : f
          ))

          try {
            await uploadFile(file, newProjectId)
            
            // Marcar como enviado
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, uploading: false, uploaded: true } : f
            ))
          } catch (error) {
            // Marcar erro no arquivo
            setFiles(prev => prev.map(f => 
              f.id === file.id ? { ...f, uploading: false, error: error.message } : f
            ))
          }
        }
      }

      // Redirecionar para o projeto criado
      setTimeout(() => {
        navigate(`/project/${newProjectId}`)
      }, 1000)

    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
      setUploading(false)
    }
  }

  return (
    <div className="create-project">
      <div className="container">
        <div className="create-header">
          <h1>Criar novo projeto</h1>
          <p>Compartilhe seu trabalho de conclusão de curso com a comunidade</p>
        </div>

        <form onSubmit={handleSubmit} className="create-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Informações básicas */}
          <div className="form-section">
            <h2>Informações do projeto</h2>
            
            <div className="form-group">
              <label htmlFor="title">Título do projeto *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Ex: Sistema de Gestão Acadêmica"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descrição *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Descreva seu projeto, objetivos, metodologia, resultados..."
                rows="8"
              />
            </div>
          </div>

          {/* Upload de arquivos */}
          <div className="form-section">
            <h2>Arquivos do projeto</h2>
            <p>Adicione imagens, vídeos e documentos relacionados ao seu projeto</p>

            <div className="file-upload">
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx,.txt"
                style={{ display: 'none' }}
              />
              <label htmlFor="file-input" className="upload-btn">
                <Upload size={20} />
                Selecionar arquivos
              </label>
            </div>

            {files.length > 0 && (
              <div className="files-list">
                {files.map((file) => (
                  <div key={file.id} className="file-item">
                    <div className="file-info">
                      {getFileIcon(file.file)}
                      <div className="file-details">
                        <h4>{file.file.name}</h4>
                        <p>{formatFileSize(file.file.size)}</p>
                      </div>
                    </div>

                    <div className="file-status">
                      {file.uploading && (
                        <div className="uploading">
                          <div className="spinner"></div>
                          Enviando...
                        </div>
                      )}
                      {file.uploaded && (
                        <div className="uploaded">
                          <Check size={20} />
                          Enviado
                        </div>
                      )}
                      {file.error && (
                        <div className="error">
                          Erro: {file.error}
                        </div>
                      )}
                      {!file.uploading && !file.uploaded && !file.error && (
                        <button
                          type="button"
                          onClick={() => removeFile(file.id)}
                          className="remove-btn"
                        >
                          <X size={20} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/gallery')}
              className="btn btn-secondary"
              disabled={loading || uploading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || uploading}
            >
              {loading ? 'Criando projeto...' : 
               uploading ? 'Enviando arquivos...' : 
               'Publicar projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProject

