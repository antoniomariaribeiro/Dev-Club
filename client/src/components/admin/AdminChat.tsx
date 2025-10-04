import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AdminChatContainer = styled.div`
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.8rem;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid;
`;

const StatTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const StatChange = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  color: ${props => props.positive ? '#27ae60' : '#e74c3c'};
  font-weight: 500;
`;

const TabContainer = styled.div`
  border-bottom: 2px solid #ecf0f1;
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  gap: 2rem;
`;

const Tab = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  padding: 1rem 0;
  font-size: 1rem;
  font-weight: 500;
  color: ${props => props.active ? '#3498db' : '#7f8c8d'};
  border-bottom: 2px solid ${props => props.active ? '#3498db' : 'transparent'};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #3498db;
  }
`;

const ContentSection = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem;
  background: #f8f9fa;
  border-bottom: 2px solid #ecf0f1;
  font-weight: 600;
  color: #2c3e50;
`;

const Td = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #ecf0f1;
  color: #34495e;
`;

const RoomBadge = styled.span<{ type: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.type === 'private' ? '#e74c3c' : '#27ae60'};
  color: white;
`;

const CreateRoomButton = styled(motion.button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  margin: 2rem;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #2c3e50;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 1rem;
  min-height: 80px;
  resize: vertical;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  background: ${props => props.variant === 'primary' ? '#3498db' : '#95a5a6'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
`;

interface ChatStats {
  overview: {
    total_rooms: number;
    total_messages: number;
    online_users: number;
    active_rooms: number;
  };
  messages_by_day: Array<{
    date: string;
    messages: number;
  }>;
  room_activity: Array<{
    room_name: string;
    messages_count: number;
    members_count: number;
  }>;
}

interface Room {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  created_by: number;
  created_at: string;
  members_count: number;
  last_activity: string;
}

const AdminChat: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    type: 'public' as 'public' | 'private'
  });

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/chat/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/rooms');
      const data = await response.json();
      
      if (data.success) {
        setRooms(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:5000/api/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newRoom,
          created_by: 1 // Admin ID
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRooms(prev => [...prev, data.data]);
        setShowCreateModal(false);
        setNewRoom({ name: '', description: '', type: 'public' });
      }
    } catch (error) {
      console.error('Erro ao criar sala:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchRooms()]);
      setLoading(false);
    };

    loadData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <AdminChatContainer>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Carregando dados do chat...
        </div>
      </AdminChatContainer>
    );
  }

  return (
    <AdminChatContainer>
      <Header>
        <Title>Gerenciamento de Chat</Title>
        <CreateRoomButton
          onClick={() => setShowCreateModal(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>+</span>
          Nova Sala
        </CreateRoomButton>
      </Header>

      {stats && (
        <StatsGrid>
          <StatCard
            style={{ borderLeftColor: '#3498db' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatTitle>Total de Salas</StatTitle>
            <StatValue style={{ color: '#3498db' }}>
              {stats.overview.total_rooms}
            </StatValue>
            <StatChange positive>
              {stats.overview.active_rooms} ativas hoje
            </StatChange>
          </StatCard>

          <StatCard
            style={{ borderLeftColor: '#27ae60' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatTitle>Mensagens Totais</StatTitle>
            <StatValue style={{ color: '#27ae60' }}>
              {stats.overview.total_messages}
            </StatValue>
            <StatChange positive>
              +{stats.messages_by_day[stats.messages_by_day.length - 1]?.messages || 0} hoje
            </StatChange>
          </StatCard>

          <StatCard
            style={{ borderLeftColor: '#e67e22' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatTitle>Usuários Online</StatTitle>
            <StatValue style={{ color: '#e67e22' }}>
              {stats.overview.online_users}
            </StatValue>
            <StatChange positive>
              Agora conectados
            </StatChange>
          </StatCard>

          <StatCard
            style={{ borderLeftColor: '#9b59b6' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatTitle>Salas Ativas</StatTitle>
            <StatValue style={{ color: '#9b59b6' }}>
              {stats.overview.active_rooms}
            </StatValue>
            <StatChange positive>
              Últimas 24h
            </StatChange>
          </StatCard>
        </StatsGrid>
      )}

      <TabContainer>
        <TabList>
          <Tab 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Visão Geral
          </Tab>
          <Tab 
            active={activeTab === 'rooms'} 
            onClick={() => setActiveTab('rooms')}
          >
            Salas de Chat
          </Tab>
          <Tab 
            active={activeTab === 'activity'} 
            onClick={() => setActiveTab('activity')}
          >
            Atividade
          </Tab>
        </TabList>
      </TabContainer>

      {activeTab === 'rooms' && (
        <ContentSection>
          <SectionTitle>Salas de Chat</SectionTitle>
          <Table>
            <thead>
              <tr>
                <Th>Nome</Th>
                <Th>Tipo</Th>
                <Th>Membros</Th>
                <Th>Criada em</Th>
                <Th>Última Atividade</Th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room.id}>
                  <Td>
                    <strong>{room.name}</strong>
                    <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                      {room.description}
                    </div>
                  </Td>
                  <Td>
                    <RoomBadge type={room.type}>
                      {room.type === 'public' ? 'Pública' : 'Privada'}
                    </RoomBadge>
                  </Td>
                  <Td>{room.members_count}</Td>
                  <Td>{formatDate(room.created_at)}</Td>
                  <Td>{formatDate(room.last_activity)}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ContentSection>
      )}

      {activeTab === 'activity' && stats && (
        <ContentSection>
          <SectionTitle>Salas Mais Ativas</SectionTitle>
          <Table>
            <thead>
              <tr>
                <Th>Sala</Th>
                <Th>Mensagens</Th>
                <Th>Membros</Th>
                <Th>Média por Membro</Th>
              </tr>
            </thead>
            <tbody>
              {stats.room_activity.map(room => (
                <tr key={room.room_name}>
                  <Td><strong>{room.room_name}</strong></Td>
                  <Td>{room.messages_count}</Td>
                  <Td>{room.members_count}</Td>
                  <Td>
                    {room.members_count > 0 
                      ? (room.messages_count / room.members_count).toFixed(1)
                      : '0'
                    }
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </ContentSection>
      )}

      {showCreateModal && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <ModalTitle>Criar Nova Sala</ModalTitle>
            <Form onSubmit={handleCreateRoom}>
              <FormGroup>
                <Label htmlFor="name">Nome da Sala</Label>
                <Input
                  type="text"
                  id="name"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="description">Descrição</Label>
                <TextArea
                  id="description"
                  value={newRoom.description}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o propósito desta sala..."
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  id="type"
                  value={newRoom.type}
                  onChange={(e) => setNewRoom(prev => ({ ...prev, type: e.target.value as 'public' | 'private' }))}
                >
                  <option value="public">Pública</option>
                  <option value="private">Privada</option>
                </Select>
              </FormGroup>

              <ButtonGroup>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  Criar Sala
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </AdminChatContainer>
  );
};

export default AdminChat;