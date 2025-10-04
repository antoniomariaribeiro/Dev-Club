import api from './api';
import { User, RegisterData } from '../types';

export const authService = {
  // Login
  login: async (email: string, password: string) => {
    console.log('authService: Fazendo requisição de login para:', `${api.defaults.baseURL}/auth/login`);
    console.log('authService: Dados enviados:', { email, password: password ? '***' : 'empty' });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      console.log('authService: Resposta recebida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('authService: Erro na requisição:', error);
      console.error('authService: Resposta de erro:', error.response?.data);
      throw error;
    }
  },

  // Registro
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Obter dados do usuário autenticado
  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Atualizar perfil
  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/auth/update-profile', userData);
    return response.data;
  },

  // Logout (limpar dados locais)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};