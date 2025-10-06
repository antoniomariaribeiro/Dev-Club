import api from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student' | 'manager';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  is_active: boolean;
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: string;
  status: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: string;
  status?: string;
}

class UserService {
  async getUsers(page = 1, limit = 10, search = '', role = '', status = '') {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(role && { role }),
        ...(status && { status })
      });

      const response = await api.get(`/api/admin/users?${params}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  }

  async getUserById(id: number) {
    try {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData) {
    try {
      const response = await api.post('/api/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async updateUser(id: number, userData: UpdateUserData) {
    try {
      const response = await api.put(`/api/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  }

  async deleteUser(id: number) {
    try {
      const response = await api.delete(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }

  async bulkDelete(userIds: number[]) {
    try {
      const response = await api.post('/api/admin/users/bulk-delete', { userIds });
      return response.data;
    } catch (error) {
      console.error('Erro ao deletar usuários:', error);
      throw error;
    }
  }

  async toggleUserStatus(id: number) {
    try {
      const response = await api.patch(`/api/admin/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error);
      throw error;
    }
  }

  async updateUserStatus(id: number, status: 'active' | 'inactive' | 'pending' | 'suspended') {
    try {
      const response = await api.patch(`/api/admin/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status do usuário:', error);
      throw error;
    }
  }

  async bulkUpdateStatus(userIds: number[], status: 'active' | 'inactive' | 'pending' | 'suspended') {
    try {
      const response = await api.post('/api/admin/users/bulk-status', { userIds, status });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar status dos usuários:', error);
      throw error;
    }
  }

  async exportUsers(format: 'csv' | 'excel' = 'csv') {
    try {
      const response = await api.get(`/api/admin/users/export?format=${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar usuários:', error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const response = await api.get('/api/admin/users/stats');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar estatísticas de usuários:', error);
      throw error;
    }
  }

  async getSearchSuggestions(query: string) {
    try {
      const response = await api.get(`/api/admin/users/suggestions?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      // Return empty array if API fails
      return [];
    }
  }
}

const userService = new UserService();
export default userService;