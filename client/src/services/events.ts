import api from './api';
import { Event, EventRegistration } from '../types';

export const eventService = {
  // Listar eventos
  getEvents: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    level?: string;
    featured?: boolean;
    search?: string;
  }) => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  // Obter evento por ID
  getEvent: async (id: number): Promise<{ event: Event }> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Criar evento (Admin)
  createEvent: async (eventData: Partial<Event>) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  // Atualizar evento (Admin)
  updateEvent: async (id: number, eventData: Partial<Event>) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Deletar evento (Admin)
  deleteEvent: async (id: number) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Inscrever-se em evento
  registerForEvent: async (
    eventId: number, 
    registrationData: {
      notes?: string;
      emergency_contact?: string;
      emergency_phone?: string;
    }
  ): Promise<{ registration: EventRegistration }> => {
    const response = await api.post(`/events/${eventId}/register`, registrationData);
    return response.data;
  },

  // Cancelar inscrição
  cancelRegistration: async (eventId: number) => {
    const response = await api.delete(`/events/${eventId}/register`);
    return response.data;
  }
};