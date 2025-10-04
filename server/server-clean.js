const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Mock data para dashboard
const dashboardStats = {
    totalUsers: 47,
    totalEvents: 8,
    totalProducts: 15,
    totalContacts: 23,
    recentUsers: [
        { id: 1, name: 'João Silva', email: 'joao@gmail.com', role: 'student' },
        { id: 2, name: 'Maria Santos', email: 'maria@gmail.com', role: 'instructor' },
        { id: 3, name: 'Pedro Costa', email: 'pedro@gmail.com', role: 'student' }
    ],
    recentEvents: [
        { id: 1, title: 'Roda de Capoeira', date: '2024-01-15', participants: 25 },
        { id: 2, title: 'Workshop de Berimbau', date: '2024-01-20', participants: 15 },
        { id: 3, title: 'Batizado', date: '2024-02-01', participants: 50 }
    ],
    monthlyStats: {
        newUsers: 12,
        eventsHeld: 3,
        revenue: 2500
    }
};

// Routes
app.get('/', (req, res) => {
    res.json({ message: '🚀 Academia Capoeira Nacional - API funcionando!' });
});

// Auth routes
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email, password: password ? '***' : 'empty' });
    
    if (email === 'admin@admin.com' && password === 'admin123') {
        const response = {
            token: 'mock-jwt-token-' + Date.now(),
            user: {
                id: 1,
                name: 'Mestre Admin',
                email: 'admin@admin.com',
                role: 'admin'
            }
        };
        console.log('Login successful:', response);
        res.json(response);
    } else {
        console.log('Login failed: Invalid credentials');
        res.status(401).json({ message: 'Email ou senha inválidos' });
    }
});

// Route para verificar se o usuário está autenticado
app.get('/api/auth/me', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        res.json({
            user: {
                id: 1,
                name: 'Mestre Admin',
                email: 'admin@admin.com',
                role: 'admin'
            }
        });
    } else {
        res.status(401).json({ message: 'Token não fornecido ou inválido' });
    }
});

// Dashboard stats
app.get('/api/admin/dashboard/stats', (req, res) => {
    res.json(dashboardStats);
});

// Admin routes - Users
app.get('/api/admin/users', (req, res) => {
    const users = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Usuário ${i + 1}`,
        email: `usuario${i + 1}@gmail.com`,
        role: i % 3 === 0 ? 'admin' : 'student',
        status: i % 4 === 0 ? 'inactive' : 'active',
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    
    res.json({ users, total: users.length });
});

// Admin routes - Events
app.get('/api/admin/events', (req, res) => {
    const events = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: `Evento ${i + 1}`,
        description: `Descrição do evento ${i + 1}`,
        date: new Date(Date.now() + Math.random() * 10000000000).toISOString(),
        location: `Local ${i + 1}`,
        max_participants: 30 + (i * 5),
        price: 50 + (i * 10),
        status: i % 3 === 0 ? 'draft' : 'published',
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    
    res.json({ events, total: events.length });
});

// Admin routes - Products
app.get('/api/admin/products', (req, res) => {
    const products = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        name: `Produto ${i + 1}`,
        description: `Descrição do produto ${i + 1}`,
        price: 25 + (i * 15),
        category: ['uniformes', 'instrumentos', 'acessorios'][i % 3],
        stock_quantity: 10 + (i * 2),
        status: i % 4 === 0 ? 'inactive' : 'active',
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    
    res.json({ products, total: products.length });
});

// Admin routes - Gallery
app.get('/api/admin/gallery', (req, res) => {
    const images = Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Foto ${i + 1}`,
        description: `Descrição da foto ${i + 1}`,
        image_url: `https://via.placeholder.com/400x300?text=Foto+${i + 1}`,
        category: ['academy', 'events', 'training'][i % 3],
        is_featured: i % 5 === 0,
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
    
    res.json({ images, total: images.length });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Servidor limpo rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
    console.log(`📋 API Admin: http://localhost:${PORT}/api/admin/dashboard/stats`);
});