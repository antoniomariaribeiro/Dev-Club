import api from './api';
import { User, RegisterData } from '../types';

export const authService = {
  // Login
  login: async (email: string, password: string) => {
    console.log('🔑 authService: Iniciando login...', {
      endpoint: `${api.defaults.baseURL}/auth/login`,
      email,
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await api.post('/auth/login', { email, password });
      
      console.log('✅ authService: Login bem-sucedido:', {
        success: response.data.success,
        user: response.data.user?.email,
        role: response.data.user?.role
      });
      
      // Verificar se a resposta contém os dados esperados
      if (!response.data.success) {
        throw new Error(response.data.message || 'Login falhou');
      }
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Resposta de login inválida do servidor');
      }
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ authService: Erro no login:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString()
      });
      
      // Melhorar mensagem de erro para o usuário
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Erro de conexão com o servidor';
      
      throw new Error(errorMessage);
    }
  },

  // Registro
  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Obter dados do usuário autenticado
  getMe: async (): Promise<{ user: User }> => {
    console.log('👤 authService: Obtendo dados do usuário...');
    
    try {
      const response = await api.get('/auth/me');
      
      console.log('✅ authService: Dados do usuário obtidos:', {
        success: response.data.success,
        email: response.data.user?.email,
        role: response.data.user?.role
      });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Falha ao obter dados do usuário');
      }
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ authService: Erro ao obter dados do usuário:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      throw error;
    }
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