const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { sequelize } = require('./config/database');
const { setupAssociations } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares de segurança
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por IP
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use('/uploads', express.static('uploads'));

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/events', require('./routes/events'));
app.use('/api/products', require('./routes/products'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Rotas administrativas
app.use('/api/admin/dashboard', require('./routes/admin-dashboard'));
app.use('/api/admin/users', require('./routes/admin-users'));
app.use('/api/admin/events', require('./routes/admin-events'));
app.use('/api/admin/products', require('./routes/admin-products'));
app.use('/api/admin/gallery', require('./routes/admin-gallery'));
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

// Inicializar servidor
const startServer = async () => {
  try {
    // Configurar associações dos modelos
    setupAssociations();
    
    // Testar conexão com banco
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida');
    
    // Sincronizar modelos (apenas em desenvolvimento)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Modelos sincronizados com banco de dados');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`🌐 Acesse: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
};

startServer();