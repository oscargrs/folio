from app import app, db, User, Project, ProjectFile
from flask_bcrypt import Bcrypt

bcrypt = Bcrypt()

def init_database():
    """Inicializa o banco de dados e cria usuários de exemplo"""
    with app.app_context():
        # Criar todas as tabelas
        db.create_all()
        
        # Verificar se já existem usuários
        if User.query.first() is None:
            # Criar usuário administrador de exemplo
            admin_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
            admin_user = User(
                username='admin',
                email='admin@tccportfolio.com',
                password_hash=admin_password,
                full_name='Administrador do Sistema',
                bio='Usuário administrador do sistema de portfólio de TCCs.'
            )
            
            # Criar usuário de exemplo
            user_password = bcrypt.generate_password_hash('user123').decode('utf-8')
            example_user = User(
                username='joaosilva',
                email='joao@email.com',
                password_hash=user_password,
                full_name='João Silva',
                bio='Estudante de Engenharia de Software apaixonado por tecnologia e inovação.'
            )
            
            db.session.add(admin_user)
            db.session.add(example_user)
            db.session.commit()
            
            # Criar projeto de exemplo
            example_project = Project(
                title='Sistema de Gestão Acadêmica',
                description='Este projeto consiste no desenvolvimento de um sistema completo para gestão acadêmica, incluindo controle de notas, frequência, disciplinas e relatórios. O sistema foi desenvolvido utilizando tecnologias modernas como React para o frontend e Node.js para o backend, com banco de dados PostgreSQL.',
                category='Sistemas de Informação',
                user_id=example_user.id,
                views=15,
                likes=3
            )
            
            db.session.add(example_project)
            db.session.commit()
            
            print("Banco de dados inicializado com sucesso!")
            print("Usuários criados:")
            print("- Admin: admin / admin123")
            print("- Usuário: joaosilva / user123")
        else:
            print("Banco de dados já foi inicializado anteriormente.")

if __name__ == '__main__':
    init_database()

