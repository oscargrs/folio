# TCC Portfolio - Plataforma de Portfólio de TCCs

Uma plataforma moderna e completa para estudantes apresentarem seus Trabalhos de Conclusão de Curso, conectando talentos e inspirando futuras gerações de pesquisadores.

## 🚀 Funcionalidades

- **Sistema de Autenticação**: Login e registro de usuários com segurança
- **Galeria de Projetos**: Visualização de todos os projetos com busca e filtros
- **Upload de Mídia**: Suporte para imagens, vídeos e documentos
- **Perfis de Usuários**: Páginas de perfil personalizáveis
- **Sistema de Busca**: Busca por título, descrição e categoria
- **Design Responsivo**: Interface moderna que funciona em desktop e mobile
- **IDs Únicos**: Sistema de identificação única para usuários e projetos

## 🛠️ Tecnologias Utilizadas

### Backend
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **Flask-Login**: Gerenciamento de sessões
- **Flask-Bcrypt**: Criptografia de senhas
- **Flask-CORS**: Suporte a CORS
- **SQLite**: Banco de dados (desenvolvimento)

### Frontend
- **React**: Biblioteca JavaScript para UI
- **React Router**: Roteamento
- **Axios**: Cliente HTTP
- **Lucide React**: Ícones
- **CSS3**: Estilização moderna
- **Vite**: Build tool

## 📋 Pré-requisitos

- Python 3.11+
- Node.js 18+
- npm ou yarn

## 🔧 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd tcc_portfolio
```

### 2. Configuração do Backend

```bash
cd backend

# Criar ambiente virtual
python3.11 -m venv venv

# Ativar ambiente virtual
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows

# Instalar dependências
pip install -r requirements.txt

# Inicializar banco de dados
python init_db.py

# Iniciar servidor
python app.py
```

O backend estará rodando em `http://localhost:5000`

### 3. Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 🎯 Como Usar

### Credenciais de Demonstração

O sistema vem com usuários pré-cadastrados para teste:

- **Usuário**: `joaosilva` | **Senha**: `user123`
- **Admin**: `admin` | **Senha**: `admin123`

### Fluxo de Uso

1. **Acesse a aplicação** em `http://localhost:5173`
2. **Faça login** ou **crie uma conta**
3. **Explore a galeria** de projetos existentes
4. **Crie seu projeto** clicando em "Criar Projeto"
5. **Faça upload** de imagens, vídeos e documentos
6. **Visualize perfis** de outros usuários
7. **Use a busca** para encontrar projetos específicos

## 📁 Estrutura do Projeto

```
tcc_portfolio/
├── backend/
│   ├── app.py              # Aplicação Flask principal
│   ├── config.py           # Configurações
│   ├── init_db.py          # Script de inicialização do BD
│   ├── requirements.txt    # Dependências Python
│   ├── uploads/            # Arquivos enviados
│   └── venv/               # Ambiente virtual
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── App.jsx         # Componente principal
│   │   ├── App.css         # Estilos principais
│   │   └── main.jsx        # Ponto de entrada
│   ├── dist/               # Build de produção
│   ├── package.json        # Dependências Node.js
│   └── vite.config.js      # Configuração Vite
└── README.md               # Este arquivo
```

## 🚀 Deploy para Produção

### Backend (Flask)

1. **Configure variáveis de ambiente**:
```bash
export SECRET_KEY="sua-chave-secreta-aqui"
export DATABASE_URL="postgresql://user:pass@host:port/db"  # Para PostgreSQL
```

2. **Use um servidor WSGI** como Gunicorn:
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend (React)

1. **Build para produção**:
```bash
cd frontend
npm run build
```

2. **Sirva os arquivos estáticos** usando nginx, Apache ou outro servidor web.

### Opções de Deploy

- **Heroku**: Para deploy rápido
- **DigitalOcean**: Para VPS
- **AWS**: Para infraestrutura escalável
- **Vercel/Netlify**: Para frontend estático

## 🔒 Segurança

- Senhas são criptografadas com bcrypt
- Sessões seguras com Flask-Login
- Validação de tipos de arquivo no upload
- CORS configurado adequadamente
- Sanitização de dados de entrada

## 📊 Banco de Dados

### Modelos

- **User**: Usuários do sistema
- **Project**: Projetos/TCCs
- **ProjectFile**: Arquivos dos projetos

### Relacionamentos

- Um usuário pode ter vários projetos
- Um projeto pode ter vários arquivos
- Cada arquivo pertence a um projeto

## 🎨 Personalização

### Cores e Tema

Edite o arquivo `frontend/src/App.css` para personalizar:
- Cores primárias e secundárias
- Tipografia
- Espaçamentos
- Animações

### Categorias

Adicione novas categorias editando o array `categories` em:
`frontend/src/pages/CreateProject.jsx`

## 🐛 Solução de Problemas

### Backend não inicia
- Verifique se o ambiente virtual está ativado
- Confirme se todas as dependências estão instaladas
- Verifique se a porta 5000 não está em uso

### Frontend não carrega
- Verifique se o Node.js está instalado
- Execute `npm install` novamente
- Confirme se a porta 5173 não está em uso

### Erro de CORS
- Verifique se o Flask-CORS está configurado
- Confirme se o backend está rodando na porta correta

## 📝 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Entre em contato com a equipe de desenvolvimento

---

**Desenvolvido com ❤️ para a comunidade acadêmica**

