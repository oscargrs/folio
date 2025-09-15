# Guia de Deploy - TCC Portfolio

Este documento fornece instruções detalhadas para fazer o deploy da aplicação TCC Portfolio em diferentes plataformas.

## 🌐 Opções de Deploy

### 1. Heroku (Recomendado para iniciantes)

#### Backend (Flask)

1. **Instale o Heroku CLI**
2. **Crie um arquivo `Procfile` no diretório backend:**
```
web: gunicorn app:app
```

3. **Adicione gunicorn ao requirements.txt:**
```bash
echo "gunicorn==20.1.0" >> backend/requirements.txt
```

4. **Configure variáveis de ambiente no Heroku:**
```bash
heroku config:set SECRET_KEY="sua-chave-secreta-super-segura"
heroku config:set DATABASE_URL="postgresql://..."
```

5. **Deploy:**
```bash
cd backend
git init
heroku create seu-app-backend
git add .
git commit -m "Deploy inicial"
git push heroku main
```

#### Frontend (React)

1. **Build para produção:**
```bash
cd frontend
npm run build
```

2. **Deploy no Netlify ou Vercel:**
   - Conecte seu repositório
   - Configure build command: `npm run build`
   - Configure publish directory: `dist`

### 2. DigitalOcean Droplet

#### Configuração do Servidor

1. **Crie um droplet Ubuntu 22.04**
2. **Instale dependências:**
```bash
sudo apt update
sudo apt install python3-pip python3-venv nginx nodejs npm
```

3. **Clone o repositório:**
```bash
git clone <seu-repositorio>
cd tcc_portfolio
```

4. **Execute o script de instalação:**
```bash
./install.sh
```

#### Configuração do Nginx

1. **Crie arquivo de configuração:**
```bash
sudo nano /etc/nginx/sites-available/tcc_portfolio
```

2. **Adicione a configuração:**
```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend
    location / {
        root /home/ubuntu/tcc_portfolio/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Arquivos de upload
    location /uploads {
        proxy_pass http://localhost:5000;
    }
}
```

3. **Ative a configuração:**
```bash
sudo ln -s /etc/nginx/sites-available/tcc_portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Configuração do Systemd (Backend)

1. **Crie arquivo de serviço:**
```bash
sudo nano /etc/systemd/system/tcc-portfolio.service
```

2. **Adicione a configuração:**
```ini
[Unit]
Description=TCC Portfolio Flask App
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/tcc_portfolio/backend
Environment=PATH=/home/ubuntu/tcc_portfolio/backend/venv/bin
ExecStart=/home/ubuntu/tcc_portfolio/backend/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 app:app
Restart=always

[Install]
WantedBy=multi-user.target
```

3. **Inicie o serviço:**
```bash
sudo systemctl daemon-reload
sudo systemctl enable tcc-portfolio
sudo systemctl start tcc-portfolio
```

### 3. AWS (Produção Escalável)

#### Backend (Elastic Beanstalk)

1. **Instale EB CLI:**
```bash
pip install awsebcli
```

2. **Configure aplicação:**
```bash
cd backend
eb init
eb create production
```

3. **Configure RDS para PostgreSQL**
4. **Configure S3 para arquivos de upload**

#### Frontend (S3 + CloudFront)

1. **Build para produção:**
```bash
cd frontend
npm run build
```

2. **Upload para S3:**
```bash
aws s3 sync dist/ s3://seu-bucket-frontend/
```

3. **Configure CloudFront para distribuição**

### 4. Docker (Containerização)

#### Dockerfile - Backend
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

#### Dockerfile - Frontend
```dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/tcc_portfolio
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "80:80"

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=tcc_portfolio
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 🔧 Configurações de Produção

### Variáveis de Ambiente

```bash
# Backend
SECRET_KEY=sua-chave-secreta-super-segura-aqui
DATABASE_URL=postgresql://user:pass@host:port/database
FLASK_ENV=production

# Frontend (se necessário)
VITE_API_URL=https://api.seu-dominio.com
```

### Banco de Dados

Para produção, recomenda-se usar PostgreSQL:

1. **Instale psycopg2:**
```bash
pip install psycopg2-binary
```

2. **Configure DATABASE_URL:**
```bash
export DATABASE_URL="postgresql://user:pass@host:port/database"
```

### SSL/HTTPS

1. **Certbot (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

2. **Configure redirecionamento HTTPS no Nginx**

### Backup

1. **Banco de dados:**
```bash
pg_dump $DATABASE_URL > backup.sql
```

2. **Arquivos de upload:**
```bash
tar -czf uploads_backup.tar.gz backend/uploads/
```

## 📊 Monitoramento

### Logs

1. **Backend (systemd):**
```bash
sudo journalctl -u tcc-portfolio -f
```

2. **Nginx:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Performance

1. **Configure Gunicorn workers baseado no CPU:**
```bash
workers = (2 * cpu_cores) + 1
```

2. **Use Redis para cache (opcional):**
```bash
pip install redis flask-caching
```

## 🔒 Segurança

1. **Firewall:**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Atualizações automáticas:**
```bash
sudo apt install unattended-upgrades
```

3. **Backup automático:**
```bash
# Adicione ao crontab
0 2 * * * /path/to/backup-script.sh
```

## 📞 Suporte

Para problemas de deploy:
1. Verifique logs de erro
2. Confirme configurações de rede
3. Teste conectividade entre serviços
4. Verifique permissões de arquivo

---

**Boa sorte com seu deploy! 🚀**

