import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Users, BookOpen, Award, Zap } from 'lucide-react'

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Compartilhe seu <span className="highlight">TCC</span> com o mundo
          </h1>
          <p className="hero-description">
            Uma plataforma moderna para estudantes apresentarem seus Trabalhos de Conclusão de Curso,
            conectando talentos e inspirando futuras gerações de pesquisadores.
          </p>
          <div className="hero-actions">
            <Link to="/gallery" className="btn btn-primary">
              Explorar Projetos
              <ArrowRight size={20} />
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Começar Agora
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="card-header">
              <div className="card-avatar"></div>
              <div className="card-info">
                <h4>Sistema de IA</h4>
                <p>João Silva</p>
              </div>
            </div>
            <div className="card-content">
              <p>Desenvolvimento de um sistema inteligente para análise de dados...</p>
            </div>
            <div className="card-stats">
              <span>👁 245 visualizações</span>
              <span>❤️ 32 curtidas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Por que escolher nossa plataforma?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Users size={32} />
              </div>
              <h3>Comunidade Ativa</h3>
              <p>Conecte-se com outros estudantes e pesquisadores, compartilhe experiências e aprenda juntos.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <BookOpen size={32} />
              </div>
              <h3>Portfólio Completo</h3>
              <p>Apresente seu trabalho com fotos, vídeos, documentos e descrições detalhadas de forma profissional.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Award size={32} />
              </div>
              <h3>Reconhecimento</h3>
              <p>Ganhe visibilidade para seu trabalho e seja descoberto por empresas e instituições de pesquisa.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Fácil de Usar</h3>
              <p>Interface intuitiva e moderna que torna simples o processo de upload e organização dos seus projetos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>500+</h3>
              <p>Projetos Publicados</p>
            </div>
            <div className="stat-item">
              <h3>200+</h3>
              <p>Estudantes Ativos</p>
            </div>
            <div className="stat-item">
              <h3>50+</h3>
              <p>Universidades</p>
            </div>
            <div className="stat-item">
              <h3>10k+</h3>
              <p>Visualizações</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Pronto para compartilhar seu trabalho?</h2>
            <p>Junte-se à nossa comunidade e mostre seu TCC para o mundo</p>
            <Link to="/register" className="btn btn-primary large">
              Criar Conta Gratuita
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

