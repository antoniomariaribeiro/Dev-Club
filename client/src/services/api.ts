import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      const savedUser = localStorage.getItem('user');
      let redirectPath = '/login';
      
      // Se for admin, redirecionar para página de login admin
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          if (user.role === 'admin') {
            redirectPath = '/admin/login';
          }
        } catch (e) {
          console.error('Erro ao parsear usuário:', e);
        }
      }
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Só redirecionar se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = redirectPath;
      }
    }
    return Promise.reject(error);
  }
);

export default api;