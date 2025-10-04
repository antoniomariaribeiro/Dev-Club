import api from './api';

// Interfaces para tipagem
export interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalProducts: number;
  totalContacts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
  activeEvents: number;
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  belt?: string;
}

export interface EventFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  category?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  in_stock?: boolean;
}

export interface ContactFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  interest_type?: string;
  source?: string;
}

export interface GalleryFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  is_featured?: boolean;
}

export const adminService = {
  // Dashboard e Estatísticas
  getDashboardStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  getChartData: async (type: 'users' | 'events' | 'revenue', period: string) => {
    const response = await api.get(`/admin/dashboard/charts/${type}?period=${period}`);
    return response.data;
  },

  // Gestão de Usuários
  getUsers: async (filters: UserFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/admin/users?${params.toString()}`);
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  createUser: async (userData: any) => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: any) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  getUserStats: async () => {
    const response = await api.get('/admin/users/stats');
    return response.data;
  },

  // Gestão de Eventos
  getEvents: async (filters: EventFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/admin/events?${params.toString()}`);
    return response.data;
  },

  getEventById: async (id: number) => {
    const response = await api.get(`/admin/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: any) => {
    const response = await api.post('/admin/events', eventData);
    return response.data;
  },

  updateEvent: async (id: number, eventData: any) => {
    const response = await api.put(`/admin/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: number) => {
    const response = await api.delete(`/admin/events/${id}`);
    return response.data;
  },

  getEventRegistrations: async (eventId: number) => {
    const response = await api.get(`/admin/events/${eventId}/registrations`);
    return response.data;
  },

  updateEventRegistration: async (eventId: number, registrationId: number, data: any) => {
    const response = await api.put(`/admin/events/${eventId}/registrations/${registrationId}`, data);
    return response.data;
  },

  getEventStats: async () => {
    const response = await api.get('/admin/events/stats');
    return response.data;
  },

  // Gestão de Produtos
  getProducts: async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/admin/products?${params.toString()}`);
    return response.data;
  },

  getProductById: async (id: number) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (id: number, productData: any) => {
    const response = await api.put(`/admin/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: number) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  getProductCategories: async () => {
    const response = await api.get('/admin/products/categories');
    return response.data;
  },

  getProductStats: async () => {
    const response = await api.get('/admin/products/stats');
    return response.data;
  },

  updateProductStock: async (id: number, stockData: any) => {
    const response = await api.put(`/admin/products/${id}/stock`, stockData);
    return response.data;
  },

  // Gestão de Galeria
  getGalleryItems: async (filters: GalleryFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/admin/gallery?${params.toString()}`);
    return response.data;
  },

  getGalleryItemById: async (id: number) => {
    const response = await api.get(`/admin/gallery/${id}`);
    return response.data;
  },

  createGalleryItem: async (galleryData: any) => {
    const response = await api.post('/admin/gallery', galleryData);
    return response.data;
  },

  updateGalleryItem: async (id: number, galleryData: any) => {
    const response = await api.put(`/admin/gallery/${id}`, galleryData);
    return response.data;
  },

  deleteGalleryItem: async (id: number) => {
    const response = await api.delete(`/admin/gallery/${id}`);
    return response.data;
  },

  getGalleryCategories: async () => {
    const response = await api.get('/admin/gallery/categories');
    return response.data;
  },

  getGalleryStats: async () => {
    const response = await api.get('/admin/gallery/stats');
    return response.data;
  },

  batchUploadGallery: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    
    const response = await api.post('/admin/gallery/batch-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  batchUpdateGalleryCategory: async (ids: number[], category: string) => {
    const response = await api.put('/admin/gallery/batch-update-category', {
      ids,
      category
    });
    return response.data;
  },

  // Gestão de Contatos
  getContacts: async (filters: ContactFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/admin/contacts?${params.toString()}`);
    return response.data;
  },

  getContactById: async (id: number) => {
    const response = await api.get(`/admin/contacts/${id}`);
    return response.data;
  },

  createContact: async (contactData: any) => {
    const response = await api.post('/admin/contacts', contactData);
    return response.data;
  },

  updateContact: async (id: number, contactData: any) => {
    const response = await api.put(`/admin/contacts/${id}`, contactData);
    return response.data;
  },

  deleteContact: async (id: number) => {
    const response = await api.delete(`/admin/contacts/${id}`);
    return response.data;
  },

  getContactStats: async () => {
    const response = await api.get('/admin/contacts/stats');
    return response.data;
  },

  // Upload de arquivos
  uploadFile: async (file: File, type: 'events' | 'products' | 'gallery' | 'users') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await api.post('/admin/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Relatórios
  exportData: async (type: 'users' | 'events' | 'products' | 'contacts', format: 'csv' | 'xlsx') => {
    const response = await api.get(`/admin/export/${type}?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
};