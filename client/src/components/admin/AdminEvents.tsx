import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin';
import api from '../../services/api';


const Container = styled.div`
  padding: 0;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-width: 120px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
  }
`;

const EventsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
`;

const EventCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const EventImage = styled.div<{ image?: string }>`
  height: 200px;
  background: ${props => props.image 
    ? `url(${props.image})` 
    : 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'
  };
  background-size: cover;
  background-position: center;
  position: relative;
`;

const EventStatus = styled.div<{ status: string }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return 'background: #28a745; color: white;';
      case 'cancelled':
        return 'background: #dc3545; color: white;';
      case 'completed':
        return 'background: #6c757d; color: white;';
      default:
        return 'background: #ffc107; color: #212529;';
    }
  }}
`;

const EventContent = styled.div`
  padding: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #343a40;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
`;

const EventDescription = styled.p`
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const EventMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #495057;
`;

const EventStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #007bff;
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'warning' | 'success' }>`
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      case 'warning':
        return `
          background: #ffc107;
          color: #212529;
          &:hover { background: #e0a800; }
        `;
      case 'success':
        return `
          background: #28a745;
          color: white;
          &:hover { background: #218838; }
        `;
      default:
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
    }
  }}
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatCardNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatCardLabel = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
`;

// Modal Components
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
`;



const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;



const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;



const FormInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ddd'};
  border-radius: 6px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
  }
`;



const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;





const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Toast = styled(motion.div)<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 1rem 1.5rem;
  border-radius: 6px;
  color: white;
  font-weight: 500;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `background: #28a745;`;
      case 'error':
        return `background: #dc3545;`;
      default:
        return `background: #007bff;`;
    }
  }}
`;

const FormTextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ddd'};
  border-radius: 6px;
  font-size: 0.875rem;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f8f9fa;
  color: #333;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e9ecef;
  }
`;

const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #0056b3;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Registrations Modal Components
const RegistrationsGrid = styled.div`
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const RegistrationCard = styled.div<{ status: string }>`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s;
  border-left: 4px solid ${props => {
    switch (props.status) {
      case 'approved': return '#28a745';
      case 'pending': return '#ffc107';
      case 'rejected': return '#dc3545';
      case 'cancelled': return '#6c757d';
      default: return '#e9ecef';
    }
  }};

  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }
`;

const RegistrationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
`;

const UserInfo = styled.div`
  h4 {
    margin: 0 0 0.25rem 0;
    color: #212529;
    font-size: 1rem;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: #6c757d;
    font-size: 0.875rem;
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background: ${props => {
    switch (props.status) {
      case 'approved': return '#d4edda';
      case 'pending': return '#fff3cd';
      case 'rejected': return '#f8d7da';
      case 'cancelled': return '#e2e3e5';
      default: return '#e9ecef';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'approved': return '#155724';
      case 'pending': return '#856404';
      case 'rejected': return '#721c24';
      case 'cancelled': return '#383d41';
      default: return '#495057';
    }
  }};
`;

const RegistrationActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionBtn = styled.button<{ variant: 'approve' | 'reject' | 'remove' }>`
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  background: ${props => {
    switch (props.variant) {
      case 'approve': return '#28a745';
      case 'reject': return '#dc3545';
      case 'remove': return '#6c757d';
      default: return '#e9ecef';
    }
  }};
  
  color: white;
  
  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
`;

const RegistrationStatCard = styled.div`
  text-align: center;
  
  .number {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #212529;
    margin-bottom: 0.25rem;
  }
  
  .label {
    font-size: 0.75rem;
    color: #6c757d;
    text-transform: uppercase;
    font-weight: 600;
  }
`;

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: number;
  price: number;
  status: string;
  image_url?: string;
  registrations_count: number;
  confirmed_count: number;
  available_spots: number;
  category?: string;
}

interface AdminEventStats {
  total: number;
  active: number;
  cancelled: number;
  completed: number;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  max_participants: string;
  price: string;
  category: string;
}

interface FormErrors {
  title?: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  max_participants?: string;
  price?: string;
  category?: string;
}

interface EventRegistration {
  id: number;
  event_id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  registration_date: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  notes: string;
  created_at: string;
}

interface RegistrationsResponse {
  registrations: EventRegistration[];
  total: number;
  summary: {
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
  };
}



const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<AdminEventStats | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showRegistrationsModal, setShowRegistrationsModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<Event | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    max_participants: '',
    price: '',
    category: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Loading states
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  // Registrations states
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [registrationsStats, setRegistrationsStats] = useState<RegistrationsResponse['summary'] | null>(null);
  const [isLoadingRegistrations, setIsLoadingRegistrations] = useState(false);
  
  // Toast states
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' | 'info' });

  // Helper functions
  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    setToast({ show: true, type, message });
    
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4000);
  }, []);

  const validateForm = useCallback((data: EventFormData): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.title.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (data.title.trim().length < 5) {
      errors.title = 'Título deve ter pelo menos 5 caracteres';
    }
    
    if (!data.description.trim()) {
      errors.description = 'Descrição é obrigatória';
    } else if (data.description.trim().length < 10) {
      errors.description = 'Descrição deve ter pelo menos 10 caracteres';
    }
    
    if (!data.date) {
      errors.date = 'Data é obrigatória';
    }
    
    if (!data.time) {
      errors.time = 'Horário é obrigatório';
    }
    
    if (!data.location.trim()) {
      errors.location = 'Local é obrigatório';
    }
    
    if (!data.max_participants || parseInt(data.max_participants) < 1) {
      errors.max_participants = 'Número de participantes deve ser maior que 0';
    }
    
    if (!data.price || parseFloat(data.price) < 0) {
      errors.price = 'Preço deve ser maior ou igual a 0';
    }
    
    return errors;
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      max_participants: '',
      price: '',
      category: ''
    });
    setFormErrors({});
  }, []);

  const loadEvents = React.useCallback(async () => {
    setIsLoadingEvents(true);
    try {
      const filters = {
        limit: 12,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      };

      const response = await adminService.getEvents(filters);
      setEvents(response.events);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      showToast('error', 'Erro ao carregar eventos');
    } finally {
      setIsLoadingEvents(false);
    }
  }, [search, statusFilter, showToast]);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await adminService.getEventStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      showToast('error', 'Erro ao carregar estatísticas');
    } finally {
      setIsLoadingStats(false);
    }
  }, [showToast]);

  const loadRegistrations = useCallback(async (eventId: number) => {
    setIsLoadingRegistrations(true);
    try {
      const response = await api.get(`/admin/events/${eventId}/registrations`);
      setRegistrations(response.data.registrations);
      setRegistrationsStats(response.data.summary);
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      showToast('error', 'Erro ao carregar inscrições');
    } finally {
      setIsLoadingRegistrations(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // CRUD Functions
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await adminService.createEvent(formData);
      showToast('success', 'Evento criado com sucesso!');
      setShowAddModal(false);
      resetForm();
      loadEvents();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao criar evento:', error);
      showToast('error', error.response?.data?.message || 'Erro ao criar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingEvent) return;
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await adminService.updateEvent(editingEvent.id, formData);
      showToast('success', 'Evento atualizado com sucesso!');
      setShowEditModal(false);
      setEditingEvent(null);
      resetForm();
      loadEvents();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao editar evento:', error);
      showToast('error', error.response?.data?.message || 'Erro ao editar evento');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      max_participants: event.max_participants.toString(),
      price: event.price.toString(),
      category: event.category || ''
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowRegistrationsModal(false);
    setEditingEvent(null);
    setSelectedEventForRegistrations(null);
    resetForm();
  };

  const openRegistrationsModal = (event: Event) => {
    setSelectedEventForRegistrations(event);
    setShowRegistrationsModal(true);
    loadRegistrations(event.id);
  };

  const handleStatusChange = async (eventId: number, newStatus: string) => {
    setIsLoadingStats(true);
    try {
      await adminService.updateEvent(eventId, { status: newStatus });
      showToast('success', 'Status atualizado com sucesso!');
      loadEvents();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error);
      showToast('error', 'Erro ao atualizar status');
    } finally {
      setIsLoadingStats(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Tem certeza que deseja deletar este evento?')) return;
    
    setIsLoadingStats(true);
    
    try {
      await adminService.deleteEvent(eventId);
      showToast('success', 'Evento deletado com sucesso!');
      loadEvents();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao deletar evento:', error);
      showToast('error', error.response?.data?.message || 'Erro ao deletar evento');
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Registration handling functions
  const handleRegistrationStatusUpdate = async (registrationId: number, newStatus: string, notes?: string) => {
    if (!selectedEventForRegistrations) return;

    try {
      await api.put(`/admin/events/${selectedEventForRegistrations.id}/registrations/${registrationId}`, {
        status: newStatus,
        notes: notes || ''
      });
      
      showToast('success', `Inscrição ${newStatus === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso!`);
      loadRegistrations(selectedEventForRegistrations.id);
      loadEvents(); // Reload to update event stats
    } catch (error: any) {
      console.error('Erro ao atualizar inscrição:', error);
      showToast('error', error.response?.data?.message || 'Erro ao atualizar inscrição');
    }
  };

  const handleRegistrationRemove = async (registrationId: number) => {
    if (!selectedEventForRegistrations) return;
    if (!window.confirm('Tem certeza que deseja remover esta inscrição?')) return;

    try {
      await api.delete(`/admin/events/${selectedEventForRegistrations.id}/registrations/${registrationId}`);
      showToast('success', 'Inscrição removida com sucesso!');
      loadRegistrations(selectedEventForRegistrations.id);
      loadEvents(); // Reload to update event stats
    } catch (error: any) {
      console.error('Erro ao remover inscrição:', error);
      showToast('error', error.response?.data?.message || 'Erro ao remover inscrição');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Container>
      {isLoadingStats ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <LoadingSpinner />
          Carregando estatísticas...
        </div>
      ) : stats && (
        <StatsCards>
          <StatCard
            style={{ borderLeftColor: '#007bff' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCardNumber style={{ color: '#007bff' }}>{stats.total}</StatCardNumber>
            <StatCardLabel>Total de Eventos</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#28a745' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCardNumber style={{ color: '#28a745' }}>{stats.active}</StatCardNumber>
            <StatCardLabel>Eventos Ativos</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#6c757d' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCardNumber style={{ color: '#6c757d' }}>{stats.completed}</StatCardNumber>
            <StatCardLabel>Eventos Concluídos</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#dc3545' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatCardNumber style={{ color: '#dc3545' }}>{stats.cancelled}</StatCardNumber>
            <StatCardLabel>Eventos Cancelados</StatCardLabel>
          </StatCard>
        </StatsCards>
      )}

      <ControlsBar>
        <SearchInput
          type="text"
          placeholder="Buscar eventos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="completed">Concluído</option>
          <option value="cancelled">Cancelado</option>
        </FilterSelect>
        
        <AddButton onClick={openAddModal}>
          <span>+</span>
          Novo Evento
        </AddButton>
      </ControlsBar>

      <EventsGrid>
        {isLoadingEvents ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            <LoadingSpinner />
            Carregando eventos...
          </div>
        ) : events.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem', color: '#666' }}>
            Nenhum evento encontrado
          </div>
        ) : events.map((event, index) => (
          <EventCard
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EventImage image={event.image_url}>
              <EventStatus status={event.status}>
                {event.status === 'active' ? 'Ativo' : 
                 event.status === 'cancelled' ? 'Cancelado' : 
                 event.status === 'completed' ? 'Concluído' : event.status}
              </EventStatus>
            </EventImage>
            
            <EventContent>
              <EventTitle>{event.title}</EventTitle>
              <EventDescription>{event.description}</EventDescription>
              
              <EventMeta>
                <EventMetaItem>
                  <span>📅</span>
                  <span>{formatDate(event.date)} às {event.time}</span>
                </EventMetaItem>
                <EventMetaItem>
                  <span>📍</span>
                  <span>{event.location}</span>
                </EventMetaItem>
                <EventMetaItem>
                  <span>💰</span>
                  <span>{formatPrice(event.price)}</span>
                </EventMetaItem>
              </EventMeta>
              
              <EventStats>
                <StatItem>
                  <StatNumber>{event.confirmed_count}</StatNumber>
                  <StatLabel>Confirmados</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>{event.available_spots}</StatNumber>
                  <StatLabel>Vagas</StatLabel>
                </StatItem>
                <StatItem>
                  <StatNumber>{event.max_participants}</StatNumber>
                  <StatLabel>Máximo</StatLabel>
                </StatItem>
              </EventStats>
              
              <ActionButtons>
                <ActionButton onClick={() => openEditModal(event)}>Editar</ActionButton>
                <ActionButton onClick={() => openRegistrationsModal(event)}>Inscrições</ActionButton>
                {event.status === 'active' && (
                  <ActionButton 
                    variant="warning"
                    onClick={() => handleStatusChange(event.id, 'cancelled')}
                  >
                    Cancelar
                  </ActionButton>
                )}
                {event.status === 'cancelled' && (
                  <ActionButton 
                    variant="success"
                    onClick={() => handleStatusChange(event.id, 'active')}
                  >
                    Ativar
                  </ActionButton>
                )}
                <ActionButton 
                  variant="danger"
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  Deletar
                </ActionButton>
              </ActionButtons>
            </EventContent>
          </EventCard>
        ))}
      </EventsGrid>

      {/* Modal de Adicionar Evento */}
      {showAddModal && (
        <ModalOverlay onClick={closeModals}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Novo Evento</h2>
              <CloseButton onClick={closeModals}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleCreateEvent}>
              <FormGroup>
                <label htmlFor="title">Título *</label>
                <FormInput
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome do evento"
                  hasError={!!formErrors.title}
                />
                {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <label htmlFor="description">Descrição *</label>
                <FormTextArea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do evento"
                  rows={4}
                  hasError={!!formErrors.description}
                />
                {formErrors.description && <ErrorMessage>{formErrors.description}</ErrorMessage>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label htmlFor="date">Data *</label>
                  <FormInput
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    hasError={!!formErrors.date}
                  />
                  {formErrors.date && <ErrorMessage>{formErrors.date}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <label htmlFor="time">Horário *</label>
                  <FormInput
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    hasError={!!formErrors.time}
                  />
                  {formErrors.time && <ErrorMessage>{formErrors.time}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label htmlFor="location">Local *</label>
                <FormInput
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Local do evento"
                  hasError={!!formErrors.location}
                />
                {formErrors.location && <ErrorMessage>{formErrors.location}</ErrorMessage>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label htmlFor="max_participants">Máx. Participantes *</label>
                  <FormInput
                    id="max_participants"
                    type="number"
                    min="1"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                    hasError={!!formErrors.max_participants}
                  />
                  {formErrors.max_participants && <ErrorMessage>{formErrors.max_participants}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <label htmlFor="price">Preço (R$) *</label>
                  <FormInput
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    hasError={!!formErrors.price}
                  />
                  {formErrors.price && <ErrorMessage>{formErrors.price}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label htmlFor="category">Categoria</label>
                <FormSelect
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="batizado">Batizado</option>
                  <option value="workshop">Workshop</option>
                  <option value="aula">Aula Aberta</option>
                  <option value="roda">Roda de Capoeira</option>
                  <option value="apresentacao">Apresentação</option>
                </FormSelect>
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={closeModals}>
                  Cancelar
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Criando...' : 'Criar Evento'}
                </SubmitButton>
              </FormActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Editar Evento */}
      {showEditModal && editingEvent && (
        <ModalOverlay onClick={closeModals}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Editar Evento</h2>
              <CloseButton onClick={closeModals}>×</CloseButton>
            </ModalHeader>
            <form onSubmit={handleEditEvent}>
              <FormGroup>
                <label htmlFor="edit-title">Título *</label>
                <FormInput
                  id="edit-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nome do evento"
                  hasError={!!formErrors.title}
                />
                {formErrors.title && <ErrorMessage>{formErrors.title}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <label htmlFor="edit-description">Descrição *</label>
                <FormTextArea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do evento"
                  rows={4}
                  hasError={!!formErrors.description}
                />
                {formErrors.description && <ErrorMessage>{formErrors.description}</ErrorMessage>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label htmlFor="edit-date">Data *</label>
                  <FormInput
                    id="edit-date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    hasError={!!formErrors.date}
                  />
                  {formErrors.date && <ErrorMessage>{formErrors.date}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <label htmlFor="edit-time">Horário *</label>
                  <FormInput
                    id="edit-time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    hasError={!!formErrors.time}
                  />
                  {formErrors.time && <ErrorMessage>{formErrors.time}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label htmlFor="edit-location">Local *</label>
                <FormInput
                  id="edit-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Local do evento"
                  hasError={!!formErrors.location}
                />
                {formErrors.location && <ErrorMessage>{formErrors.location}</ErrorMessage>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <label htmlFor="edit-max_participants">Máx. Participantes *</label>
                  <FormInput
                    id="edit-max_participants"
                    type="number"
                    min="1"
                    value={formData.max_participants}
                    onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                    hasError={!!formErrors.max_participants}
                  />
                  {formErrors.max_participants && <ErrorMessage>{formErrors.max_participants}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <label htmlFor="edit-price">Preço (R$) *</label>
                  <FormInput
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    hasError={!!formErrors.price}
                  />
                  {formErrors.price && <ErrorMessage>{formErrors.price}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <label htmlFor="edit-category">Categoria</label>
                <FormSelect
                  id="edit-category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="batizado">Batizado</option>
                  <option value="workshop">Workshop</option>
                  <option value="aula">Aula Aberta</option>
                  <option value="roda">Roda de Capoeira</option>
                  <option value="apresentacao">Apresentação</option>
                </FormSelect>
              </FormGroup>

              <FormActions>
                <CancelButton type="button" onClick={closeModals}>
                  Cancelar
                </CancelButton>
                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </SubmitButton>
              </FormActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Inscrições */}
      {showRegistrationsModal && selectedEventForRegistrations && (
        <ModalOverlay onClick={closeModals}>
          <ModalContent onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <ModalHeader>
              <h2>Inscrições - {selectedEventForRegistrations.title}</h2>
              <CloseButton onClick={closeModals}>×</CloseButton>
            </ModalHeader>
            
            <div style={{ padding: '1.5rem' }}>
              {isLoadingRegistrations ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                  <LoadingSpinner />
                  Carregando inscrições...
                </div>
              ) : (
                <>
                  {registrationsStats && (
                    <StatsRow>
                      <RegistrationStatCard>
                        <span className="number">{registrationsStats.pending}</span>
                        <span className="label">Pendentes</span>
                      </RegistrationStatCard>
                      <RegistrationStatCard>
                        <span className="number">{registrationsStats.approved}</span>
                        <span className="label">Aprovadas</span>
                      </RegistrationStatCard>
                      <RegistrationStatCard>
                        <span className="number">{registrationsStats.rejected}</span>
                        <span className="label">Rejeitadas</span>
                      </RegistrationStatCard>
                      <RegistrationStatCard>
                        <span className="number">{registrationsStats.cancelled}</span>
                        <span className="label">Canceladas</span>
                      </RegistrationStatCard>
                    </StatsRow>
                  )}

                  {registrations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                      Nenhuma inscrição encontrada para este evento.
                    </div>
                  ) : (
                    <RegistrationsGrid>
                      {registrations.map((registration) => (
                        <RegistrationCard key={registration.id} status={registration.status}>
                          <RegistrationHeader>
                            <UserInfo>
                              <h4>{registration.user_name}</h4>
                              <p>{registration.user_email}</p>
                              {registration.user_phone && <p>📞 {registration.user_phone}</p>}
                            </UserInfo>
                            <StatusBadge status={registration.status}>
                              {registration.status === 'pending' ? 'Pendente' :
                               registration.status === 'approved' ? 'Aprovada' :
                               registration.status === 'rejected' ? 'Rejeitada' :
                               registration.status === 'cancelled' ? 'Cancelada' : registration.status}
                            </StatusBadge>
                          </RegistrationHeader>

                          <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '0.75rem' }}>
                            <div>Data da inscrição: {new Date(registration.registration_date).toLocaleDateString('pt-BR')}</div>
                            <div>Pagamento: {registration.payment_status === 'pending' ? 'Pendente' : 
                                                   registration.payment_status === 'paid' ? 'Pago' : 
                                                   registration.payment_status === 'refunded' ? 'Reembolsado' : registration.payment_status}</div>
                            {registration.notes && (
                              <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                                Observações: {registration.notes}
                              </div>
                            )}
                          </div>

                          {registration.status === 'pending' && (
                            <RegistrationActions>
                              <ActionBtn 
                                variant="approve"
                                onClick={() => handleRegistrationStatusUpdate(registration.id, 'approved')}
                              >
                                Aprovar
                              </ActionBtn>
                              <ActionBtn 
                                variant="reject"
                                onClick={() => handleRegistrationStatusUpdate(registration.id, 'rejected')}
                              >
                                Rejeitar
                              </ActionBtn>
                            </RegistrationActions>
                          )}

                          {registration.status !== 'cancelled' && (
                            <RegistrationActions style={{ marginTop: '0.5rem' }}>
                              <ActionBtn 
                                variant="remove"
                                onClick={() => handleRegistrationRemove(registration.id)}
                              >
                                Remover Inscrição
                              </ActionBtn>
                            </RegistrationActions>
                          )}
                        </RegistrationCard>
                      ))}
                    </RegistrationsGrid>
                  )}
                </>
              )}
            </div>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <Toast type={toast.type}>
          {toast.message}
        </Toast>
      )}
    </Container>
  );
};

export default AdminEvents;