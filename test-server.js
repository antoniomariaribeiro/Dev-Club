const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor backend funcionando' });
});

// Rota de login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@admin.com' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      token: 'fake-token-123',
      user: {
        id: 1,
        name: 'Administrador',
        email: 'admin@admin.com',
        role: 'admin',
        is_active: true
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Credenciais inválidas'
    });
  }
});

// Rota de dashboard stats
app.get('/api/admin/dashboard/stats', (req, res) => {
  res.json({
    users: 150,
    events: 25,
    products: 45,
    revenue: 15000
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Backend Simples rodando na porta ${PORT}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/health`);
  console.log(`🔑 API Login: http://localhost:${PORT}/api/auth/login`);
});