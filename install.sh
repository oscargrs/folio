#!/bin/bash

echo "🚀 Instalando TCC Portfolio..."
echo "================================"

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 não encontrado. Por favor, instale Python 3.11+"
    exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor, instale Node.js 18+"
    exit 1
fi

echo "✅ Pré-requisitos verificados"

# Configurar Backend
echo "📦 Configurando Backend..."
cd backend

# Criar ambiente virtual
python3 -m venv venv
echo "✅ Ambiente virtual criado"

# Ativar ambiente virtual
source venv/bin/activate
echo "✅ Ambiente virtual ativado"

# Instalar dependências
pip install -r requirements.txt
echo "✅ Dependências do backend instaladas"

# Inicializar banco de dados
python init_db.py
echo "✅ Banco de dados inicializado"

cd ..

# Configurar Frontend
echo "📦 Configurando Frontend..."
cd frontend

# Instalar dependências
npm install
echo "✅ Dependências do frontend instaladas"

# Build para produção
npm run build
echo "✅ Build de produção criado"

cd ..

echo ""
echo "🎉 Instalação concluída com sucesso!"
echo "================================"
echo ""
echo "Para iniciar a aplicação:"
echo ""
echo "1. Backend (Terminal 1):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "2. Frontend (Terminal 2):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Acesse: http://localhost:5173"
echo ""
echo "Credenciais de teste:"
echo "- Usuário: joaosilva | Senha: user123"
echo "- Admin: admin | Senha: admin123"
echo ""
echo "📖 Leia o README.md para mais informações"

