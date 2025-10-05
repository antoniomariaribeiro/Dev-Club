import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Plus, Edit3, Trash2, Eye, Search,
  MapPin, Clock, Users, DollarSign,
  X, Save, CalendarPlus
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============ TIPOS ============
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  category: 'roda' | 'workshop' | 'batizado' | 'competicao' | 'apresentacao';
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  image?: string;
  createdAt: string;
}

interface EventFormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxParticipants: number;
  price: number;
  category: 'roda' | 'workshop' | 'batizado' | 'competicao' | 'apresentacao';
}

// ============ STYLED COMPONENTS ============
const Container = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: transparent;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  
  h1 {
    font-size: 2.2rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  input {
    padding: 12px 15px 12px 45px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 0.9rem;
    width: 250px;
    backdrop-filter: blur(10px);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
  }
  
  .search-icon {
    position: absolute;
    left: 15px;
    color: rgba(255, 255, 255, 0.6);
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
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #333;
          &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4); }
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ff6b6b, #ff5252);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4); }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }
        `;
    }
  }}
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const EventCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const EventImage = styled.div<{ hasImage?: boolean }>`
  height: 200px;
  background: ${props => props.hasImage 
    ? `url(${props.hasImage}) center/cover` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  
  .status-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
`;

const EventContent = styled.div`
  padding: 25px;
`;

const EventHeader = styled.div`
  margin-bottom: 15px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.3rem;
    color: #ffd700;
  }
  
  .category {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(255, 215, 0, 0.2);
    color: #ffd700;
    border: 1px solid rgba(255, 215, 0, 0.3);
    text-transform: capitalize;
  }
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 15px 0;
  font-size: 0.9rem;
  
  .detail {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.8);
    
    svg {
      color: #ffd700;
      min-width: 16px;
    }
  }
`;

const EventDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled(motion.button)<{ variant?: 'edit' | 'delete' | 'view' }>`
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.variant) {
      case 'edit':
        return `background: rgba(52, 152, 219, 0.2); color: #3498db; &:hover { background: rgba(52, 152, 219, 0.3); }`;
      case 'delete':
        return `background: rgba(231, 76, 60, 0.2); color: #e74c3c; &:hover { background: rgba(231, 76, 60, 0.3); }`;
      default:
        return `background: rgba(46, 204, 113, 0.2); color: #2ecc71; &:hover { background: rgba(46, 204, 113, 0.3); }`;
    }
  }}
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 600;
    color: #ffd700;
    font-size: 0.9rem;
  }
  
  input, select, textarea {
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 0.9rem;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  select option {
    background: #333;
    color: white;
  }
`;

// ============ DADOS MOCK ============
const mockEvents: Event[] = [
  {
    id: 1,
    title: 'Roda de Capoeira Mensal',
    description: 'Roda tradicional com participação de todos os alunos e apresentação de graduados.',
    date: '2025-01-15',
    time: '19:00',
    location: 'Academia Central - São Paulo',
    maxParticipants: 50,
    currentParticipants: 32,
    price: 0,
    category: 'roda',
    status: 'upcoming',
    createdAt: '2024-12-01'
  },
  {
    id: 2,
    title: 'Workshop de Instrumentos',
    description: 'Aprenda a tocar berimbau, pandeiro e atabaque com mestres experientes.',
    date: '2025-01-20',
    time: '14:00',
    location: 'Sala de Música - Rio de Janeiro',
    maxParticipants: 20,
    currentParticipants: 15,
    price: 80,
    category: 'workshop',
    status: 'upcoming',
    createdAt: '2024-12-05'
  },
  {
    id: 3,
    title: 'Batizado e Troca de Cordas 2025',
    description: 'Cerimônia tradicional de graduação com a presença de mestres convidados.',
    date: '2025-03-15',
    time: '10:00',
    location: 'Centro de Convenções - Belo Horizonte',
    maxParticipants: 200,
    currentParticipants: 87,
    price: 150,
    category: 'batizado',
    status: 'upcoming',
    createdAt: '2024-11-20'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'upcoming': return '#3498db';
    case 'ongoing': return '#2ecc71';
    case 'completed': return '#95a5a6';
    case 'cancelled': return '#e74c3c';
    default: return '#3498db';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'upcoming': return 'Próximo';
    case 'ongoing': return 'Em Andamento';
    case 'completed': return 'Concluído';
    case 'cancelled': return 'Cancelado';
    default: return 'Próximo';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'roda': return '🥋';
    case 'workshop': return '🎵';
    case 'batizado': return '🎓';
    case 'competicao': return '🏆';
    case 'apresentacao': return '🎭';
    default: return '📅';
  }
};

// ============ COMPONENTE PRINCIPAL ============
const EventsManagement: React.FC = () => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    maxParticipants: 50,
    price: 0,
    category: 'roda'
  });

  // Filtrar eventos
  useEffect(() => {
    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [events, searchTerm]);

  // Abrir modal para criar/editar
  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        maxParticipants: event.maxParticipants,
        price: event.price,
        category: event.category
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        maxParticipants: 50,
        price: 0,
        category: 'roda'
      });
    }
    setShowModal(true);
  };

  // Salvar evento
  const handleSaveEvent = () => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { 
              ...event, 
              ...formData,
              status: new Date(formData.date) > new Date() ? 'upcoming' : event.status
            }
          : event
      ));
      toast.success('Evento atualizado com sucesso!');
    } else {
      const newEvent: Event = {
        id: Date.now(),
        ...formData,
        currentParticipants: 0,
        status: 'upcoming',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setEvents([...events, newEvent]);
      toast.success('Evento criado com sucesso!');
    }
    setShowModal(false);
  };

  // Excluir evento
  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(event => event.id !== eventId));
      toast.success('Evento excluído com sucesso!');
    }
  };

  return (
    <Container>
      <Header>
        <h1>
          <Calendar size={32} />
          Gerenciar Eventos
        </h1>
        
        <Controls>
          <SearchBar>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar eventos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <Button
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} />
            Novo Evento
          </Button>
        </Controls>
      </Header>

      <EventsGrid>
        <AnimatePresence>
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EventImage>
                <div style={{ fontSize: '4rem' }}>
                  {getCategoryIcon(event.category)}
                </div>
                <div 
                  className="status-badge"
                  style={{ 
                    background: getStatusColor(event.status) + '20',
                    color: getStatusColor(event.status),
                    border: `1px solid ${getStatusColor(event.status)}40`
                  }}
                >
                  {getStatusText(event.status)}
                </div>
              </EventImage>
              
              <EventContent>
                <EventHeader>
                  <h3>{event.title}</h3>
                  <div className="category">{event.category}</div>
                </EventHeader>
                
                <EventDescription>{event.description}</EventDescription>
                
                <EventDetails>
                  <div className="detail">
                    <Calendar size={16} />
                    {new Date(event.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="detail">
                    <Clock size={16} />
                    {event.time}
                  </div>
                  <div className="detail">
                    <MapPin size={16} />
                    {event.location}
                  </div>
                  <div className="detail">
                    <Users size={16} />
                    {event.currentParticipants}/{event.maxParticipants}
                  </div>
                  <div className="detail" style={{ gridColumn: '1 / -1' }}>
                    <DollarSign size={16} />
                    {event.price === 0 ? 'Gratuito' : `R$ ${event.price.toFixed(2)}`}
                  </div>
                </EventDetails>
                
                <EventActions>
                  <ActionButton
                    variant="view"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye size={16} />
                  </ActionButton>
                  
                  <ActionButton
                    variant="edit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleOpenModal(event)}
                  >
                    <Edit3 size={16} />
                  </ActionButton>
                  
                  <ActionButton
                    variant="delete"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteEvent(event.id)}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </EventActions>
              </EventContent>
            </EventCard>
          ))}
        </AnimatePresence>
      </EventsGrid>

      {/* Modal de Criar/Editar */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <Modal
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#ffd700' }}>
                  <CalendarPlus size={24} style={{ marginRight: '10px' }} />
                  {editingEvent ? 'Editar Evento' : 'Novo Evento'}
                </h2>
                <Button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </Button>
              </div>

              <FormGrid>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Título do Evento</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Nome do evento"
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva o evento..."
                  />
                </FormGroup>

                <FormGroup>
                  <label>Data</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </FormGroup>

                <FormGroup>
                  <label>Horário</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Local</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="Endereço do evento"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="roda">Roda</option>
                    <option value="workshop">Workshop</option>
                    <option value="batizado">Batizado</option>
                    <option value="competicao">Competição</option>
                    <option value="apresentacao">Apresentação</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Máximo de Participantes</label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                    min="1"
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00 para gratuito"
                  />
                </FormGroup>
              </FormGrid>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <Button onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSaveEvent}>
                  <Save size={20} />
                  {editingEvent ? 'Atualizar' : 'Criar'} Evento
                </Button>
              </div>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default EventsManagement;