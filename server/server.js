/**
 * ========================================
 * 🥋 SISTEMA CAPOEIRA PRO - SERVIDOR PRINCIPAL
 * ========================================
 * 
 * Sistema completo de gestão para academia de capoeira
 * - Autenticação JWT
 * - Dashboard administrativo  
 * - Gestão de eventos e usuários
 * - Galeria de fotos
 * - Sistema de pagamentos
 * 
 * @author Antonio Maria
 * @version 1.0.0
 * ========================================
 */

// ===== IMPORTS E DEPENDÊNCIAS =====
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Configuração do banco de dados
const { sequelize } = require('./config/database');
const { setupAssociations } = require('./models');

// ===== CONFIGURAÇÃO DO SERVIDOR =====
const app = express();
const PORT = process.env.PORT || 5000;

// ===== MIDDLEWARES DE SEGURANÇA =====
// Proteção básica de cabeçalhos HTTP
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Desabilitado para desenvolvimento
}));

// Compressão de responses para melhor performance
app.use(compression());

// ===== RATE LIMITING =====
// Proteção contra ataques de força bruta
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em 15 minutos.'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// ===== CONFIGURAÇÃO CORS =====
// Permitir requisições do frontend
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ===== PARSERS DE DADOS =====
// Parser para JSON (limite de 10MB para uploads)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== ARQUIVOS ESTÁTICOS =====
// Servir uploads de imagens e documentos
app.use('/uploads', express.static('uploads'));

// ===== ROTAS PÚBLICAS =====
// Autenticação (login, registro, recuperação de senha)
app.use('/api/auth', require('./routes/auth'));

// Usuários (perfil, atualização de dados)
app.use('/api/users', require('./routes/users'));

// Eventos (listagem pública, inscrições)
app.use('/api/events', require('./routes/events'));

// Produtos (catálogo público)
app.use('/api/products', require('./routes/products'));

// Galeria (visualização pública de fotos)
app.use('/api/gallery', require('./routes/gallery'));

// Contatos (formulário de contato)
app.use('/api/contacts', require('./routes/contacts'));

// Dashboard (estatísticas públicas)
app.use('/api/dashboard', require('./routes/dashboard'));

// ===== ROTAS ADMINISTRATIVAS (PROTEGIDAS) =====
// Dashboard administrativo completo
app.use('/api/admin/dashboard', require('./routes/admin-dashboard'));

// Gestão de usuários (CRUD, relatórios)
app.use('/api/admin/users', require('./routes/admin-users'));

// Gestão de eventos (criação, edição, participantes)
app.use('/api/admin/events', require('./routes/admin-events'));

// Gestão de produtos (estoque, preços, categorias)
app.use('/api/admin/products', require('./routes/admin-products'));

// Gestão de galeria (upload, moderação, organização)
app.use('/api/admin/gallery', require('./routes/admin-gallery'));

// Gestão de contatos (atendimento, follow-up)
app.use('/api/admin/contacts', require('./routes/admin-contacts'));

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API Capoeira Pro funcionando!' });
});

// Middleware de erro global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo deu errado!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
const startServer = async () => {
  try {
    console.log('🚀 Iniciando Servidor Capoeira Pro...');
    console.log('='.repeat(50));
    
    // 1. Configurar associações dos modelos
    console.log('🔄 Configurando modelos do banco de dados...');
    setupAssociations();
    console.log('✅ Associações dos modelos configuradas');
    
    // 2. Testar conexão com banco de dados
    console.log('🔄 Testando conexão com banco de dados...');
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida');
    
    // 3. Sincronizar modelos (criar/atualizar tabelas)
    console.log('🔄 Verificando modelos do banco de dados...');
    // DESABILITADO para evitar loops infinitos de ALTER TABLE
    // await sequelize.sync({ alter: true }); // Criar/atualizar tabelas
    console.log('✅ Tabelas do banco já existem (sync desabilitado)');

    // 4. Garantir que existe um admin padrão
    console.log('🔧 Verificando usuário administrador...');
    const { createDefaultAdmin } = require('./scripts/create-default-admin');
    await createDefaultAdmin();
    
    // 5. Iniciar servidor HTTP
    const server = app.listen(PORT, () => {
      console.log('='.repeat(50));
      console.log('✅ SERVIDOR CAPOEIRA PRO ONLINE!');
      console.log('='.repeat(50));
      console.log(`🌐 URL Principal: http://localhost:${PORT}`);
      console.log(`🔑 API Endpoint: http://localhost:${PORT}/api`);
      console.log(`🚑 Health Check: http://localhost:${PORT}/health`);
      console.log(`🛡️  Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🕰️  Iniciado em: ${new Date().toLocaleString('pt-BR')}`);
      console.log('='.repeat(50));
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📋 Recebido SIGTERM, desligando servidor...');
      server.close(() => {
        console.log('✅ Servidor desligado com sucesso');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('='.repeat(50));
    console.error('❌ ERRO FATAL AO INICIALIZAR SERVIDOR');
    console.error('='.repeat(50));
    console.error('Erro:', error.message);
    console.error('Stack:', error.stack);
    console.error('='.repeat(50));
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();

/**
 * ========================================
 * FIM DO SERVIDOR PRINCIPAL
 * ========================================
 */