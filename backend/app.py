from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import os
import uuid
from datetime import datetime
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tcc_portfolio.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

# Criar pasta de uploads se não existir
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Inicializar extensões
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Configurar CORS para permitir requisições do frontend
CORS(app, supports_credentials=True)

# Extensões de arquivo permitidas
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'mov', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Modelos de dados
class User(UserMixin, db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    full_name = db.Column(db.String(200), nullable=False)
    bio = db.Column(db.Text)
    profile_picture = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relacionamento com projetos
    projects = db.relationship('Project', backref='author', lazy=True, cascade='all, delete-orphan')

class Project(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100))
    views = db.Column(db.Integer, default=0)
    likes = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Chave estrangeira para o usuário
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    
    # Relacionamento com arquivos
    files = db.relationship('ProjectFile', backref='project', lazy=True, cascade='all, delete-orphan')

class ProjectFile(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    filename = db.Column(db.String(200), nullable=False)
    original_filename = db.Column(db.String(200), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)  # image, video, document
    file_path = db.Column(db.String(500), nullable=False)
    file_size = db.Column(db.Integer)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Chave estrangeira para o projeto
    project_id = db.Column(db.String(36), db.ForeignKey('project.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

# Rotas de autenticação
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Verificar se o usuário já existe
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Nome de usuário já existe'}), 400
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email já está em uso'}), 400
        
        # Criar novo usuário
        password_hash = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=password_hash,
            full_name=data['full_name'],
            bio=data.get('bio', '')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(username=data['username']).first()
        
        if user and bcrypt.check_password_hash(user.password_hash, data['password']):
            login_user(user)
            return jsonify({
                'message': 'Login realizado com sucesso',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'full_name': user.full_name,
                    'bio': user.bio,
                    'profile_picture': user.profile_picture
                }
            }), 200
        else:
            return jsonify({'error': 'Credenciais inválidas'}), 401
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout realizado com sucesso'}), 200

@app.route('/api/current_user', methods=['GET'])
@login_required
def get_current_user():
    return jsonify({
        'user': {
            'id': current_user.id,
            'username': current_user.username,
            'email': current_user.email,
            'full_name': current_user.full_name,
            'bio': current_user.bio,
            'profile_picture': current_user.profile_picture
        }
    }), 200

# Rotas de projetos
@app.route('/api/projects', methods=['GET'])
def get_projects():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 12, type=int)
        search = request.args.get('search', '')
        category = request.args.get('category', '')
        sort_by = request.args.get('sort_by', 'created_at')  # created_at, views, likes
        
        query = Project.query
        
        # Filtros
        if search:
            query = query.filter(Project.title.contains(search) | Project.description.contains(search))
        
        if category:
            query = query.filter(Project.category == category)
        
        # Ordenação
        if sort_by == 'views':
            query = query.order_by(Project.views.desc())
        elif sort_by == 'likes':
            query = query.order_by(Project.likes.desc())
        else:
            query = query.order_by(Project.created_at.desc())
        
        projects = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'projects': [{
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'category': project.category,
                'views': project.views,
                'likes': project.likes,
                'created_at': project.created_at.isoformat(),
                'author': {
                    'id': project.author.id,
                    'username': project.author.username,
                    'full_name': project.author.full_name
                },
                'files': [{
                    'id': file.id,
                    'filename': file.filename,
                    'file_type': file.file_type,
                    'file_path': file.file_path
                } for file in project.files]
            } for project in projects.items],
            'total': projects.total,
            'pages': projects.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project(project_id):
    try:
        project = Project.query.get_or_404(project_id)
        
        # Incrementar visualizações
        project.views += 1
        db.session.commit()
        
        return jsonify({
            'id': project.id,
            'title': project.title,
            'description': project.description,
            'category': project.category,
            'views': project.views,
            'likes': project.likes,
            'created_at': project.created_at.isoformat(),
            'updated_at': project.updated_at.isoformat(),
            'author': {
                'id': project.author.id,
                'username': project.author.username,
                'full_name': project.author.full_name,
                'bio': project.author.bio,
                'profile_picture': project.author.profile_picture
            },
            'files': [{
                'id': file.id,
                'filename': file.filename,
                'original_filename': file.original_filename,
                'file_type': file.file_type,
                'file_path': file.file_path,
                'file_size': file.file_size,
                'uploaded_at': file.uploaded_at.isoformat()
            } for file in project.files]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects', methods=['POST'])
@login_required
def create_project():
    try:
        data = request.get_json()
        
        project = Project(
            title=data['title'],
            description=data['description'],
            category=data.get('category', ''),
            user_id=current_user.id
        )
        
        db.session.add(project)
        db.session.commit()
        
        return jsonify({
            'message': 'Projeto criado com sucesso',
            'project': {
                'id': project.id,
                'title': project.title,
                'description': project.description,
                'category': project.category
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/projects/<project_id>/upload', methods=['POST'])
@login_required
def upload_project_file(project_id):
    try:
        project = Project.query.get_or_404(project_id)
        
        # Verificar se o usuário é o dono do projeto
        if project.user_id != current_user.id:
            return jsonify({'error': 'Não autorizado'}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'Nenhum arquivo selecionado'}), 400
        
        if file and allowed_file(file.filename):
            # Gerar nome único para o arquivo
            filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            
            # Determinar tipo do arquivo
            file_ext = file.filename.rsplit('.', 1)[1].lower()
            if file_ext in ['png', 'jpg', 'jpeg', 'gif']:
                file_type = 'image'
            elif file_ext in ['mp4', 'avi', 'mov']:
                file_type = 'video'
            else:
                file_type = 'document'
            
            # Salvar informações do arquivo no banco
            project_file = ProjectFile(
                filename=filename,
                original_filename=file.filename,
                file_type=file_type,
                file_path=file_path,
                file_size=os.path.getsize(file_path),
                project_id=project.id
            )
            
            db.session.add(project_file)
            db.session.commit()
            
            return jsonify({
                'message': 'Arquivo enviado com sucesso',
                'file': {
                    'id': project_file.id,
                    'filename': project_file.filename,
                    'original_filename': project_file.original_filename,
                    'file_type': project_file.file_type
                }
            }), 201
        else:
            return jsonify({'error': 'Tipo de arquivo não permitido'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Rota para servir arquivos
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Rotas de usuário/perfil
@app.route('/api/users/<user_id>', methods=['GET'])
def get_user_profile(user_id):
    try:
        user = User.query.get_or_404(user_id)
        
        return jsonify({
            'id': user.id,
            'username': user.username,
            'full_name': user.full_name,
            'bio': user.bio,
            'profile_picture': user.profile_picture,
            'created_at': user.created_at.isoformat(),
            'projects_count': len(user.projects),
            'projects': [{
                'id': project.id,
                'title': project.title,
                'description': project.description[:200] + '...' if len(project.description) > 200 else project.description,
                'category': project.category,
                'views': project.views,
                'likes': project.likes,
                'created_at': project.created_at.isoformat()
            } for project in user.projects]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/users/<user_id>', methods=['PUT'])
@login_required
def update_user_profile(user_id):
    try:
        if user_id != current_user.id:
            return jsonify({'error': 'Não autorizado'}), 403
        
        data = request.get_json()
        user = User.query.get_or_404(user_id)
        
        user.full_name = data.get('full_name', user.full_name)
        user.bio = data.get('bio', user.bio)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Perfil atualizado com sucesso',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'bio': user.bio
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)

