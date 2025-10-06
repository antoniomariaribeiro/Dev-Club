import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Edit, Trash2, Users, 
  MapPin, Clock, DollarSign, Search,
  Save, X
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// ============ TYPES ============
interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  price: number;
  max_participants: number;
  level?: string;
  status: 'draft' | 'published' | 'cancelled' | 'finished';
  is_featured: boolean;
  image?: string;
  requirements?: string;
  what_to_bring?: string;
  instructor?: string;
  registrations_count: number;
  confirmed_count: number;
  pending_count: number;
  available_spots: number;
  created_at: string;
}

interface NewEvent {
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  price: number;
  max_participants: number;
  level?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  image?: string;
  requirements?: string;
  what_to_bring?: string;
  instructor?: string;
}

// ============ STYLED COMPONENTS ============
const Container = styled.div`
  padding: 20px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const FilterSelect = styled.select`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #333;
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const EventCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const EventImage = styled.div<{ imageUrl?: string }>`
  height: 200px;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover`
    : 'linear-gradient(45deg, #667eea, #764ba2)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
`;

const EventContent = styled.div`
  padding: 20px;
`;

const EventTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #ffd700;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 15px 0;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const EventActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'published':
        return 'background: #10b981; color: white;';
      case 'draft':
        return 'background: #f59e0b; color: white;';
      case 'cancelled':
        return 'background: #ef4444; color: white;';
      case 'finished':
        return 'background: #6b7280; color: white;';
      default:
        return 'background: #374151; color: white;';
    }
  }}
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${props => props.fullWidth && 'grid-column: 1 / -1;'}
`;

const Label = styled.label`
  font-weight: 600;
  color: #ffd700;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const ImageUploadContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ImageUploadArea = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
  
  &:hover {
    border-color: #ffd700;
    background: rgba(255, 221, 0, 0.1);
  }
  
  &.dragover {
    border-color: #ffd700;
    background: rgba(255, 221, 0, 0.2);
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  display: inline-block;
  border-radius: 12px;
  overflow: hidden;
  max-width: 300px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(220, 53, 69, 1);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

// ============ COMPONENT ============
const EventsManager: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [newEvent, setNewEvent] = useState<NewEvent>({
    title: '',
    description: '',
    event_date: '',
    end_date: '',
    location: '',
    price: 0,
    max_participants: 50,
    level: 'beginner',
    status: 'draft',
    is_featured: false,
    image: '',
    requirements: '',
    what_to_bring: '',
    instructor: ''
  });

  // ============ FUNCTIONS ============
  const fetchEvents = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get('/api/admin/events');
      setEvents(response.data.events || []);
      
      // Atualizar dados em tempo real
      setLastUpdate(new Date());
      console.log('✅ Eventos atualizados:', response.data.events?.length || 0);
    } catch (error) {
      console.error('❌ Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleSaveEvent = async () => {
    try {
      if (!newEvent.title || !newEvent.event_date || !newEvent.location) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }

      // Usar FormData para envio de arquivo
      const formData = new FormData();
      Object.entries(newEvent).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Adicionar imagem se foi selecionada
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      if (editingEvent) {
        await api.put(`/api/admin/events/${editingEvent.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Evento atualizado com sucesso!');
      } else {
        await api.post('/api/admin/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Evento criado com sucesso!');
      }

      setShowModal(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error: any) {
      console.error('Erro ao salvar evento:', error);
      toast.error(error.response?.data?.message || 'Erro ao salvar evento');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      // Buscar detalhes do evento primeiro
      const eventResponse = await api.get(`/api/admin/events/${id}`);
      const event = eventResponse.data.event;
      
      if (event.confirmed_count > 0) {
        const cancelFirst = window.confirm(
          `Este evento possui ${event.confirmed_count} inscrições confirmadas. ` +
          'É necessário cancelar o evento primeiro para excluí-lo. Deseja cancelar automaticamente?'
        );
        
        if (cancelFirst) {
          // Cancelar o evento primeiro
          await api.put(`/api/admin/events/${id}`, {
            ...event,
            status: 'cancelled'
          });
          toast.success('Evento cancelado com sucesso!');
          fetchEvents();
          return;
        } else {
          return;
        }
      }
      
      if (window.confirm('Tem certeza que deseja excluir este evento permanentemente?')) {
        await api.delete(`/api/admin/events/${id}`);
        toast.success('Evento excluído com sucesso!');
        fetchEvents();
      }
    } catch (error: any) {
      console.error('Erro ao processar evento:', error);
      toast.error(error.response?.data?.message || 'Erro ao processar evento');
    }
  };

  const resetForm = () => {
    setNewEvent({
      title: '',
      description: '',
      event_date: '',
      end_date: '',
      location: '',
      price: 0,
      max_participants: 50,
      level: 'beginner',
      status: 'draft',
      is_featured: false,
      image: '',
      requirements: '',
      what_to_bring: '',
      instructor: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const openModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setNewEvent({
        title: event.title,
        description: event.description,
        event_date: event.event_date ? event.event_date.split('T')[0] : '', // Format for input[type="date"]
        end_date: event.end_date ? event.end_date.split('T')[0] : '',
        location: event.location,
        price: event.price,
        max_participants: event.max_participants,
        level: event.level || 'beginner',
        status: event.status as 'draft' | 'published',
        is_featured: event.is_featured,
        image: event.image || '',
        requirements: event.requirements || '',
        what_to_bring: event.what_to_bring || '',
        instructor: event.instructor || ''
      });
      
      // Se tem imagem existente, definir como preview
      if (event.image) {
        setImagePreview(`http://localhost:5000${event.image}`);
      }
    } else {
      setEditingEvent(null);
      resetForm();
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
    resetForm();
  };

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    const matchesLevel = levelFilter === 'all' || event.level === levelFilter;

    return matchesSearch && matchesStatus && matchesLevel;
  });

  // ============ EFFECTS ============
  useEffect(() => {
    fetchEvents();
    
    // Atualização automática a cada 30 segundos
    const interval = setInterval(() => {
      fetchEvents(false); // Sem loading visual
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // ============ RENDER ============
  return (
    <Container>
      <Header>
        <div>
          <Title>📅 Gestão de Eventos</Title>
          <small style={{ color: '#bbb', fontSize: '0.8rem' }}>
            Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </small>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button variant="secondary" onClick={() => fetchEvents()}>
            🔄 Atualizar
          </Button>
          <Button variant="primary" onClick={() => openModal()}>
            <Plus size={20} />
            Novo Evento
          </Button>
        </div>
      </Header>

      <Controls>
        <SearchBar>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            placeholder="Buscar eventos por título, descrição ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="draft">Rascunho</option>
          <option value="published">Publicado</option>
          <option value="cancelled">Cancelado</option>
          <option value="finished">Finalizado</option>
        </FilterSelect>

        <FilterSelect
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="all">Todos os Níveis</option>
          <option value="beginner">Iniciante</option>
          <option value="intermediate">Intermediário</option>
          <option value="advanced">Avançado</option>
        </FilterSelect>
      </Controls>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2rem' }}>⏳</div>
          <p>Carregando eventos...</p>
        </div>
      ) : (
        <EventsGrid>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EventImage imageUrl={event.image}>
                {!event.image && '📅'}
              </EventImage>
              
              <EventContent>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <EventTitle>{event.title}</EventTitle>
                  <StatusBadge status={event.status}>{event.status}</StatusBadge>
                </div>
                
                <p style={{ margin: '10px 0', opacity: 0.8, lineHeight: '1.4' }}>
                  {event.description.length > 100 
                    ? `${event.description.substring(0, 100)}...` 
                    : event.description
                  }
                </p>

                <EventMeta>
                  <MetaItem>
                    <Calendar size={16} />
                    {new Date(event.event_date).toLocaleDateString('pt-BR')}
                  </MetaItem>
                  <MetaItem>
                    <Clock size={16} />
                    {new Date(event.event_date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </MetaItem>
                  <MetaItem>
                    <MapPin size={16} />
                    {event.location}
                  </MetaItem>
                  <MetaItem>
                    <DollarSign size={16} />
                    {event.price === 0 ? 'Gratuito' : `R$ ${event.price.toFixed(2)}`}
                  </MetaItem>
                  <MetaItem>
                    <Users size={16} />
                    <span style={{ color: event.confirmed_count > 0 ? '#27ae60' : '#95a5a6' }}>
                      {event.confirmed_count || 0} confirmados
                    </span>
                    {' | '}
                    <span style={{ color: '#f39c12' }}>
                      {event.pending_count || 0} pendentes
                    </span>
                    {' | '}
                    <span style={{ color: '#3498db' }}>
                      {event.available_spots || event.max_participants} vagas
                    </span>
                  </MetaItem>
                </EventMeta>

                <EventActions>
                  <Button onClick={() => openModal(event)}>
                    <Edit size={16} />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteEvent(event.id)}>
                    <Trash2 size={16} />
                  </Button>
                </EventActions>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
      )}

      {/* Modal para Criar/Editar Evento */}
      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <ModalContent
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <ModalHeader>
                <h2>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</h2>
                <Button onClick={closeModal}>
                  <X size={20} />
                </Button>
              </ModalHeader>

              <FormGrid>
                <FormGroup fullWidth>
                  <Label>Título *</Label>
                  <Input
                    type="text"
                    placeholder="Nome do evento"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </FormGroup>

                <FormGroup fullWidth>
                  <Label>Descrição *</Label>
                  <TextArea
                    placeholder="Descrição detalhada do evento"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Data de Início *</Label>
                  <Input
                    type="datetime-local"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({...newEvent, event_date: e.target.value})}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Data de Término</Label>
                  <Input
                    type="datetime-local"
                    value={newEvent.end_date}
                    onChange={(e) => setNewEvent({...newEvent, end_date: e.target.value})}
                  />
                </FormGroup>

                <FormGroup fullWidth>
                  <Label>Local *</Label>
                  <Input
                    type="text"
                    placeholder="Endereço do evento"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Preço (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={newEvent.price}
                    onChange={(e) => setNewEvent({...newEvent, price: Number(e.target.value)})}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Max. Participantes</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="50"
                    value={newEvent.max_participants}
                    onChange={(e) => setNewEvent({...newEvent, max_participants: Number(e.target.value)})}
                  />
                </FormGroup>

                <FormGroup fullWidth>
                  <Label>Imagem do Evento</Label>
                  <ImageUploadContainer>
                    {imagePreview ? (
                      <ImagePreviewContainer>
                        <ImagePreview src={imagePreview} alt="Preview" />
                        <RemoveImageButton onClick={removeImage}>
                          <X size={16} />
                        </RemoveImageButton>
                      </ImagePreviewContainer>
                    ) : (
                      <ImageUploadArea onClick={() => document.getElementById('image-input')?.click()}>
                        <div style={{ marginBottom: '10px', fontSize: '2rem' }}>📷</div>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>
                          Clique para selecionar uma imagem
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
                          PNG, JPG, WebP até 5MB
                        </p>
                      </ImageUploadArea>
                    )}
                    <HiddenFileInput
                      id="image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </ImageUploadContainer>
                </FormGroup>

                <FormGroup>
                  <Label>Nível</Label>
                  <Select
                    value={newEvent.level}
                    onChange={(e) => setNewEvent({...newEvent, level: e.target.value as any})}
                  >
                    <option value="all">Todos os níveis</option>
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({...newEvent, status: e.target.value as any})}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="published">Publicado</option>
                  </Select>
                </FormGroup>

                <FormGroup fullWidth>
                  <CheckboxGroup>
                    <Checkbox
                      type="checkbox"
                      id="featured"
                      checked={newEvent.is_featured}
                      onChange={(e) => setNewEvent({...newEvent, is_featured: e.target.checked})}
                    />
                    <Label htmlFor="featured">Evento em destaque</Label>
                  </CheckboxGroup>
                </FormGroup>
              </FormGrid>

              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <Button variant="primary" onClick={handleSaveEvent} style={{ flex: 1 }}>
                  <Save size={20} />
                  {editingEvent ? 'Atualizar' : 'Criar'} Evento
                </Button>
                <Button onClick={closeModal}>
                  Cancelar
                </Button>
              </div>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default EventsManager;