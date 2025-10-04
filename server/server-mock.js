const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rota básica para testar se o servidor está funcionando
app.get('/', (req, res) => {
  res.json({ message: 'Academia Capoeira Nacional API funcionando!' });
});

// Mock de estatísticas para o dashboard
app.get('/api/dashboard/stats', (req, res) => {
  res.json({
    totalUsers: 156,
    activeEvents: 8,
    totalProducts: 24,
    totalPhotos: 89,
    monthlyRevenue: 12580,
    newContacts: 23
  });
});

// Mock de usuários
app.get('/api/admin/users', (req, res) => {
  const mockUsers = [
    { id: 1, name: 'Admin Principal', email: 'admin@admin.com', role: 'admin', is_active: true, created_at: new Date() },
    { id: 2, name: 'João Silva', email: 'joao@email.com', role: 'student', is_active: true, created_at: new Date() },
    { id: 3, name: 'Maria Santos', email: 'maria@email.com', role: 'student', is_active: true, created_at: new Date() }
  ];
  
  res.json({
    users: mockUsers,
    total: mockUsers.length,
    page: 1,
    totalPages: 1
  });
});

// Mock de eventos
app.get('/api/admin/events', (req, res) => {
  const mockEvents = [
    { 
      id: 1, 
      title: 'Roda de Capoeira', 
      event_date: new Date('2024-02-15'), 
      status: 'active', 
      max_participants: 30,
      price: 0,
      created_at: new Date() 
    },
    { 
      id: 2, 
      title: 'Workshop de Instrumentos', 
      event_date: new Date('2024-02-20'), 
      status: 'active', 
      max_participants: 20,
      price: 50,
      created_at: new Date() 
    }
  ];
  
  res.json({
    events: mockEvents,
    total: mockEvents.length,
    page: 1,
    totalPages: 1
  });
});

// Mock de produtos
app.get('/api/admin/products', (req, res) => {
  const mockProducts = [
    { 
      id: 1, 
      name: 'Berimbau Profissional', 
      price: 150.00, 
      category: 'instruments',
      stock_quantity: 10,
      status: 'active',
      created_at: new Date() 
    },
    { 
      id: 2, 
      name: 'Pandeiro de Couro', 
      price: 80.00, 
      category: 'instruments',
      stock_quantity: 15,
      status: 'active',
      created_at: new Date() 
    }
  ];
  
  res.json({
    products: mockProducts,
    total: mockProducts.length,
    page: 1,
    totalPages: 1
  });
});

// Mock de galeria
app.get('/api/admin/gallery', (req, res) => {
  const mockGallery = [
    { 
      id: 1, 
      title: 'Roda na Praia', 
      image_url: '/uploads/gallery/roda-praia.jpg',
      category: 'events',
      status: 'active',
      created_at: new Date() 
    },
    { 
      id: 2, 
      title: 'Apresentação Cultural', 
      image_url: '/uploads/gallery/apresentacao.jpg',
      category: 'shows',
      status: 'active',
      created_at: new Date() 
    }
  ];
  
  res.json({
    gallery: mockGallery,
    total: mockGallery.length,
    page: 1,
    totalPages: 1
  });
});

// Mock de autenticação
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@admin.com' && password === 'admin123') {
    res.json({
      success: true,
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: 'Admin Principal',
        email: 'admin@admin.com',
        role: 'admin'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor mock rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
});