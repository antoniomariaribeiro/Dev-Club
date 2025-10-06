// API Service para conectar com o backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Método genérico para fazer requests
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // =========================== USERS ===========================
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // =========================== EVENTS ===========================
  async getEvents() {
    return this.request('/api/events');
  }

  async createEvent(eventData) {
    return this.request('/api/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  }

  async updateEvent(id, eventData) {
    return this.request(`/api/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  }

  async deleteEvent(id) {
    return this.request(`/api/events/${id}`, {
      method: 'DELETE',
    });
  }

  // =========================== PRODUCTS ===========================
  async getProducts() {
    return this.request('/products');
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // =========================== GALLERY ===========================
  async getGallery() {
    return this.request('/gallery');
  }

  async createGalleryItem(galleryData) {
    return this.request('/gallery', {
      method: 'POST',
      body: JSON.stringify(galleryData),
    });
  }

  async updateGalleryItem(id, galleryData) {
    return this.request(`/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(galleryData),
    });
  }

  async deleteGalleryItem(id) {
    return this.request(`/gallery/${id}`, {
      method: 'DELETE',
    });
  }

  // =========================== DASHBOARD ===========================
  async getDashboardStats() {
    return this.request('/api/dashboard/stats');
  }

  // =========================== AUTH ===========================
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

const apiServiceInstance = new ApiService();
export default apiServiceInstance;