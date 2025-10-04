# Capoeira Pro - Site Profissional de Capoeira

Um site completo para academias de capoeira com sistema de gerenciamento, eventos, loja online e muito mais.

## 🥋 Funcionalidades

### Para Visitantes
- **Página inicial** com formulário de interesse
- **Sobre a capoeira** - História e filosofia
- **Eventos** - Lista de eventos e workshops
- **Galeria** - Fotos da academia e eventos
- **Loja online** - Instrumentos, roupas e acessórios
- **Contato** - Informações e localização

### Para Alunos
- **Dashboard pessoal** com informações do perfil
- **Inscrições em eventos** - Participar de workshops e rodas
- **Histórico de atividades**
- **Acesso a conteúdo exclusivo**

### Para Administradores
- **Painel administrativo completo**
- **Gestão de usuários** (alunos e admins)
- **Gerenciamento de eventos** (criar, editar, ver inscrições)
- **Controle da loja** (produtos, categorias, estoque)
- **Galeria de fotos** (upload e organização)
- **Dashboard com estatísticas**
- **Gestão de leads** (formulários de interesse)

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **Multer** - Upload de arquivos
- **Bcrypt** - Criptografia de senhas
- **Nodemailer** - Envio de emails

### Frontend
- **React** - Biblioteca de interface
- **TypeScript** - Tipagem estática
- **Styled Components** - Estilização
- **React Router** - Navegação
- **React Hook Form** - Formulários
- **Framer Motion** - Animações
- **Axios** - Cliente HTTP
- **React Query** - Cache de dados

### Design
- **Cores claras e elegantes**
- **Design responsivo**
- **Tema profissional**
- **Animações suaves**

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- MySQL
- Yarn

### 1. Instalar dependências
```bash
# Instalar dependências do projeto principal
yarn install

# Instalar dependências do servidor
cd server && yarn install

# Instalar dependências do cliente
cd ../client && yarn install
```

### 2. Configurar banco de dados
1. Criar banco de dados MySQL
2. Copiar `.env.example` para `.env` no diretório `server`
3. Configurar as variáveis de ambiente:

```env
NODE_ENV=development
PORT=5000

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_NAME=capoeira_pro
DB_USER=root
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

### 3. Executar o projeto

#### Desenvolvimento (modo completo)
```bash
# Na raiz do projeto
yarn dev
```

#### Ou executar separadamente

**Backend:**
```bash
cd server
yarn dev
```

**Frontend:**
```bash
cd client
yarn start
```

### 4. Acessar a aplicação
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Estrutura do Projeto

```
capoeira-pro/
├── client/                 # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── contexts/       # Contextos (Auth, etc.)
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços API
│   │   ├── styles/         # Temas e estilos
│   │   └── types/          # Tipos TypeScript
│   └── package.json
├── server/                 # Backend Node.js
│   ├── config/            # Configurações
│   ├── middleware/        # Middlewares
│   ├── models/            # Modelos do Sequelize
│   ├── routes/            # Rotas da API
│   ├── uploads/           # Arquivos enviados
│   └── server.js          # Servidor principal
└── package.json           # Workspace principal
```

## 🎨 Design e UX

### Cores do Tema
- **Primária**: Verde da capoeira (#2E7D32)
- **Secundária**: Laranja/dourado (#FF8F00)
- **Background**: Tons claros e elegantes
- **Texto**: Azul escuro elegante (#2C3E50)

### Componentes
- **Layout responsivo** para todos os dispositivos
- **Animações suaves** com Framer Motion
- **Interface limpa** e profissional
- **Navegação intuitiva**

## 🔐 Sistema de Autenticação

### Roles de Usuário
- **Admin**: Acesso total ao sistema
- **Student**: Área do aluno com funcionalidades limitadas
- **Guest**: Visitante (sem login)

### Funcionalidades de Auth
- Registro e login
- JWT tokens
- Proteção de rotas
- Perfil de usuário
- Logout seguro

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Dados do usuário
- `PUT /api/auth/update-profile` - Atualizar perfil

### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events/:id` - Detalhes do evento
- `POST /api/events` - Criar evento (Admin)
- `POST /api/events/:id/register` - Inscrever-se
- `DELETE /api/events/:id/register` - Cancelar inscrição

### Usuários (Admin)
- `GET /api/users` - Listar usuários
- `POST /api/users` - Criar usuário
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Desativar usuário

### Dashboard (Admin)
- `GET /api/dashboard/stats` - Estatísticas
- `GET /api/dashboard/recent-activity` - Atividades recentes
- `GET /api/dashboard/contacts` - Listar contatos
- `PUT /api/dashboard/contacts/:id` - Atualizar contato

### Contatos
- `POST /api/contacts` - Enviar formulário
- `GET /api/contacts/info` - Info da academia

## 🎯 Próximos Passos

### Funcionalidades Planejadas
- [ ] Sistema de pagamento online
- [ ] Chat ao vivo
- [ ] App mobile (React Native)
- [ ] Sistema de mensagens
- [ ] Calendário de aulas
- [ ] Certificados digitais
- [ ] Integração com redes sociais
- [ ] Sistema de avaliações
- [ ] Programa de pontos/recompensas
- [ ] Transmissões ao vivo

### Melhorias Técnicas
- [ ] Testes automatizados
- [ ] CI/CD
- [ ] Docker
- [ ] Cache Redis
- [ ] CDN para imagens
- [ ] Monitoramento
- [ ] Logs estruturados

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade da capoeira.

---

**Axé!** 🥋🇧🇷