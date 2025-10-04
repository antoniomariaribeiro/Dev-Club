import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../../utils/icons';
import { adminService, ContactFilters } from '../../services/admin';

// Interfaces
interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  age?: number;
  message?: string;
  interest_type: 'classes' | 'events' | 'workshops' | 'performances' | 'general';
  experience_level: 'none' | 'beginner' | 'intermediate' | 'advanced';
  preferred_schedule?: string;
  status: 'new' | 'contacted' | 'converted' | 'not_interested';
  source?: string;
  created_at: string;
  updated_at: string;
}

interface ContactStats {
  total_contacts: number;
  recent_contacts: number;
  conversion_rate: number;
  converted_contacts: number;
  status_distribution: Record<string, number>;
  interest_distribution: Record<string, number>;
  experience_distribution: Record<string, number>;
  source_distribution: Record<string, number>;
  monthly_contacts: Array<{ month: string; count: number }>;
}

// Styled Components
const Container = styled.div`
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    color: #4f46e5;
  }
`;

const AddButton = styled(motion.button)`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)<{ $color: string }>`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => props.$color};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    background: ${props => props.$color}15;
    border-radius: 50%;
    transform: translate(25%, -25%);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 50px;
  height: 50px;
  background: ${props => props.$color}20;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.$color};
  font-size: 1.5rem;
`;

const FiltersContainer = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const ContactsList = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ContactCard = styled(motion.div)<{ $status: string }>`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 5px solid ${props => 
    props.$status === 'converted' ? '#10b981' :
    props.$status === 'contacted' ? '#3b82f6' :
    props.$status === 'not_interested' ? '#ef4444' : '#f59e0b'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ContactHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
`;

const ContactInfo = styled.div`
  flex: 1;
`;

const ContactName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
`;

const ContactMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6b7280;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

const StatusBadge = styled.div<{ $status: string }>`
  background: ${props => 
    props.$status === 'converted' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' :
    props.$status === 'contacted' ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' :
    props.$status === 'not_interested' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' :
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
`;

const InterestBadge = styled.div`
  background: #e5e7eb;
  color: #374151;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ContactMessage = styled.div`
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-style: italic;
  color: #6b7280;
  border-left: 3px solid #d1d5db;
`;

const ContactActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)<{ $variant: string }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.3s ease;

  ${props => props.$variant === 'edit' && `
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
  `}

  ${props => props.$variant === 'delete' && `
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: white;
  `}

  ${props => props.$variant === 'status' && `
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
  `}

  &:hover {
    transform: translateY(-1px);
  }
`;

const Modal = styled(motion.div)`
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
  background: white;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  grid-column: 1 / -1;

  &:hover {
    transform: translateY(-2px);
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.1rem;
  color: #6b7280;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #d1d5db;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #374151;
  }

  p {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 2rem;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$active ? '#4f46e5' : '#e5e7eb'};
  background: ${props => props.$active ? '#4f46e5' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4f46e5;
    background: ${props => props.$active ? '#4338ca' : '#f8fafc'};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

// Componente Principal
const AdminContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [filters, setFilters] = useState<ContactFilters>({
    search: '',
    status: '',
    interest_type: '',
    source: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    message: '',
    interest_type: 'general' as Contact['interest_type'],
    experience_level: 'none' as Contact['experience_level'],
    preferred_schedule: '',
    status: 'new' as Contact['status'],
    source: ''
  });

  const statusOptions = [
    { value: 'new', label: 'Novo', color: '#f59e0b' },
    { value: 'contacted', label: 'Contatado', color: '#3b82f6' },
    { value: 'converted', label: 'Convertido', color: '#10b981' },
    { value: 'not_interested', label: 'Não Interessado', color: '#ef4444' }
  ];

  const interestOptions = [
    { value: 'classes', label: 'Aulas Regulares' },
    { value: 'events', label: 'Eventos' },
    { value: 'workshops', label: 'Workshops' },
    { value: 'performances', label: 'Apresentações' },
    { value: 'general', label: 'Informações Gerais' }
  ];

  const experienceOptions = [
    { value: 'none', label: 'Nenhuma' },
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' }
  ];

  // Carregar contatos
  const loadContacts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getContacts({
        page: currentPage,
        limit: 10,
        ...filters
      });
      
      setContacts(response.contacts);
      setTotalPages(response.pagination.total_pages);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  // Carregar estatísticas
  const loadStats = async () => {
    try {
      const response = await adminService.getContactStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    loadStats();
  }, []);

  // Handlers
  const handleFilterChange = (key: keyof ContactFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      age: contact.age?.toString() || '',
      message: contact.message || '',
      interest_type: contact.interest_type,
      experience_level: contact.experience_level,
      preferred_schedule: contact.preferred_schedule || '',
      status: contact.status,
      source: contact.source || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      try {
        await adminService.deleteContact(id);
        loadContacts();
        loadStats();
      } catch (error) {
        console.error('Erro ao excluir contato:', error);
      }
    }
  };

  const handleStatusUpdate = async (id: number, newStatus: Contact['status']) => {
    try {
      await adminService.updateContact(id, { status: newStatus });
      loadContacts();
      loadStats();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contactData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : undefined
      };

      if (editingContact) {
        await adminService.updateContact(editingContact.id, contactData);
      } else {
        await adminService.createContact(contactData);
      }
      
      setShowModal(false);
      resetForm();
      loadContacts();
      loadStats();
    } catch (error) {
      console.error('Erro ao salvar contato:', error);
    }
  };

  const resetForm = () => {
    setEditingContact(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      message: '',
      interest_type: 'general',
      experience_level: 'none',
      preferred_schedule: '',
      status: 'new',
      source: ''
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };



  const getInterestLabel = (interest: string) => {
    const option = interestOptions.find(opt => opt.value === interest);
    return option?.label || interest;
  };

  const getExperienceLabel = (experience: string) => {
    const option = experienceOptions.find(opt => opt.value === experience);
    return option?.label || experience;
  };

  return (
    <Container>
      <Header>
        <Title>
          <Icons.FiUsers className="icon" />
          Contatos
        </Title>
        <AddButton
          onClick={openAddModal}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
                                    <Icons.FiPlus /> Adicionar Primeiro Contato
        </AddButton>
      </Header>

      {/* Estatísticas */}
      {stats && (
        <StatsContainer>
          <StatCard
            $color="#4f46e5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatIcon $color="#4f46e5">
                              <Icons.FiUsers />
            </StatIcon>
            <StatNumber>{stats.total_contacts}</StatNumber>
            <StatLabel>Total de Contatos</StatLabel>
          </StatCard>

          <StatCard
            $color="#10b981"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatIcon $color="#10b981">
              <Icons.FiCheckCircle />
            </StatIcon>
            <StatNumber>{stats.converted_contacts}</StatNumber>
            <StatLabel>Convertidos</StatLabel>
          </StatCard>

          <StatCard
            $color="#f59e0b"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatIcon $color="#f59e0b">
                              <Icons.FiClock />
            </StatIcon>
            <StatNumber>{stats.recent_contacts}</StatNumber>
            <StatLabel>Novos (30 dias)</StatLabel>
          </StatCard>

          <StatCard
            $color="#8b5cf6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatIcon $color="#8b5cf6">
              <Icons.FiCalendar />
            </StatIcon>
            <StatNumber>{stats.conversion_rate}%</StatNumber>
            <StatLabel>Taxa de Conversão</StatLabel>
          </StatCard>
        </StatsContainer>
      )}

      {/* Filtros */}
      <FiltersContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FiltersGrid>
          <FilterGroup>
            <Label>Buscar</Label>
            <Input
              type="text"
              placeholder="Nome, email, telefone..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Todos os status</option>
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Interesse</Label>
            <Select
              value={filters.interest_type || ''}
              onChange={(e) => handleFilterChange('interest_type', e.target.value)}
            >
              <option value="">Todos os interesses</option>
              {interestOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Origem</Label>
            <Input
              type="text"
              placeholder="Site, redes sociais..."
              value={filters.source || ''}
              onChange={(e) => handleFilterChange('source', e.target.value)}
            />
          </FilterGroup>
        </FiltersGrid>
      </FiltersContainer>

      {/* Lista de Contatos */}
      {loading ? (
        <LoadingContainer>
          Carregando contatos...
        </LoadingContainer>
      ) : contacts.length === 0 ? (
        <EmptyState>
          <Icons.FiUsers className="icon" />
          <h3>Nenhum contato encontrado</h3>
          <p>Adicione o primeiro contato ou ajuste os filtros.</p>
          <AddButton onClick={openAddModal}>
            <Icons.FiPlus /> Adicionar Primeiro Contato
          </AddButton>
        </EmptyState>
      ) : (
        <>
          <ContactsList>
            <AnimatePresence>
              {contacts.map((contact, index) => (
                <ContactCard
                  key={contact.id}
                  $status={contact.status}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ContactHeader>
                    <ContactInfo>
                      <ContactName>{contact.name}</ContactName>
                      <ContactMeta>
                        <MetaItem>
                                                      <Icons.FiMail /> {contact.email}
                        </MetaItem>
                        {contact.phone && (
                          <MetaItem>
                                                          <Icons.FiPhone /> {contact.phone}
                          </MetaItem>
                        )}
                        {contact.age && (
                          <MetaItem>
                                                          <Icons.FiUser /> {contact.age} anos
                          </MetaItem>
                        )}
                        <MetaItem>
                          <Icons.FiCalendar /> {formatDate(contact.created_at)}
                        </MetaItem>
                      </ContactMeta>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <InterestBadge>{getInterestLabel(contact.interest_type)}</InterestBadge>
                        <InterestBadge>Experiência: {getExperienceLabel(contact.experience_level)}</InterestBadge>
                        {contact.source && <InterestBadge>Origem: {contact.source}</InterestBadge>}
                      </div>
                    </ContactInfo>
                    <StatusBadge $status={contact.status}>
                      {statusOptions.find(opt => opt.value === contact.status)?.label}
                    </StatusBadge>
                  </ContactHeader>

                  {contact.message && (
                    <ContactMessage>
                                              <Icons.FiMessageSquare style={{ marginRight: '0.5rem' }} />
                      {contact.message}
                    </ContactMessage>
                  )}

                  <ContactActions>
                    <ActionButton
                      $variant="edit"
                      onClick={() => handleEdit(contact)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                                              <Icons.FiEdit3 /> Editar
                    </ActionButton>

                    {contact.status !== 'converted' && (
                      <ActionButton
                        $variant="status"
                        onClick={() => handleStatusUpdate(contact.id, 'converted')}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icons.FiCheckCircle /> Converter
                      </ActionButton>
                    )}

                    <ActionButton
                      $variant="delete"
                      onClick={() => handleDelete(contact.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                                              <Icons.FiTrash2 /> Excluir
                    </ActionButton>
                  </ContactActions>
                </ContactCard>
              ))}
            </AnimatePresence>
          </ContactsList>

          {/* Paginação */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </PaginationButton>
              
              {[...Array(totalPages)].map((_, index) => (
                <PaginationButton
                  key={index + 1}
                  $active={currentPage === index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
            >
              <ModalHeader>
                <ModalTitle>
                  {editingContact ? 'Editar Contato' : 'Novo Contato'}
                </ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>
                                      <Icons.FiX />
                </CloseButton>
              </ModalHeader>

              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <Label>Nome *</Label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Telefone</Label>
                    <Input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Idade</Label>
                    <Input
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Interesse</Label>
                    <Select
                      value={formData.interest_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, interest_type: e.target.value as Contact['interest_type'] }))}
                    >
                      {interestOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Experiência</Label>
                    <Select
                      value={formData.experience_level}
                      onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value as Contact['experience_level'] }))}
                    >
                      {experienceOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Horário Preferido</Label>
                    <Input
                      type="text"
                      placeholder="Ex: Manhã, Tarde, Noite"
                      value={formData.preferred_schedule}
                      onChange={(e) => setFormData(prev => ({ ...prev, preferred_schedule: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Contact['status'] }))}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Origem</Label>
                    <Input
                      type="text"
                      placeholder="Ex: Site, Instagram, Indicação"
                      value={formData.source}
                      onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    />
                  </FormGroup>

                  <FormGroup className="full-width">
                    <Label>Mensagem</Label>
                    <TextArea
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Mensagem ou observações sobre o contato..."
                    />
                  </FormGroup>

                  <SubmitButton
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {editingContact ? 'Atualizar' : 'Adicionar'} Contato
                  </SubmitButton>
                </FormGrid>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default AdminContacts;