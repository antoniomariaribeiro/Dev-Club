import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Calendar,
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from 'lucide-react';

const Container = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  padding: 20px 0;
`;

const FunctionCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.3rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(45deg, #ff6b35, #f7931e);
  border: none;
  border-radius: 10px;
  color: white;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
`;

const ItemList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(45deg, #ff6b35, #f7931e);
    border-radius: 3px;
  }
`;

const ListItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 10px;
  border-left: 4px solid #ff6b35;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ItemInfo = styled.div`
  color: white;
  
  .title {
    font-weight: 600;
    margin-bottom: 5px;
  }
  
  .subtitle {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }
`;

const ItemActions = styled.div`
  display: flex;
  gap: 8px;
`;

const SmallButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  color: white;
  margin: 0;
  font-size: 1.4rem;
`;

const CloseButton = styled(motion.button)`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  color: white;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #ff6b35;
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.2);
  }
  
  option {
    background: #1a1a2e;
    color: white;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.status) {
      case 'active': return 'linear-gradient(45deg, #10b981, #059669)';
      case 'inactive': return 'linear-gradient(45deg, #ef4444, #dc2626)';
      case 'pending': return 'linear-gradient(45deg, #f59e0b, #d97706)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: white;
`;

// Interfaces
interface Instrutor {
  id: string;
  name: string;
  cordao: string;
  especialidade: string;
  status: 'active' | 'inactive';
  experiencia: number;
}

interface Movimento {
  id: string;
  name: string;
  categoria: 'ataque' | 'defesa' | 'esquiva' | 'acrobacia';
  dificuldade: 1 | 2 | 3 | 4 | 5;
  descricao: string;
}

interface Evento {
  id: string;
  name: string;
  tipo: 'roda' | 'batizado' | 'workshop' | 'encontro';
  data: string;
  local: string;
  status: 'active' | 'pending' | 'completed';
}

const CapoeiraAdminFunctions: React.FC = () => {
  // Estados para modais
  const [showInstructorModal, setShowInstructorModal] = useState(false);
  const [showMovementModal, setShowMovementModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);

  // Estados para dados
  const [instrutores, setInstrutores] = useState<Instrutor[]>([
    {
      id: '1',
      name: 'Mestre Cobra Coral',
      cordao: 'Vermelha',
      especialidade: 'Berimbau e Canto',
      status: 'active',
      experiencia: 35
    },
    {
      id: '2',
      name: 'Contra-Mestre Beija-Flor',
      cordao: 'Vermelha/Branca',
      especialidade: 'Floreios e Acrobacias',
      status: 'active',
      experiencia: 20
    },
    {
      id: '3',
      name: 'Professor Gato',
      cordao: 'Azul',
      especialidade: 'Movimentos Básicos',
      status: 'inactive',
      experiencia: 8
    }
  ]);

  const [movimentos, setMovimentos] = useState<Movimento[]>([
    {
      id: '1',
      name: 'Ginga',
      categoria: 'ataque',
      dificuldade: 1,
      descricao: 'Movimento base da capoeira'
    },
    {
      id: '2',
      name: 'Au Batido',
      categoria: 'acrobacia',
      dificuldade: 4,
      descricao: 'Movimento acrobático lateral'
    },
    {
      id: '3',
      name: 'Esquiva de Frente',
      categoria: 'esquiva',
      dificuldade: 2,
      descricao: 'Esquiva frontal básica'
    }
  ]);

  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: '1',
      name: 'Roda Semanal',
      tipo: 'roda',
      data: '2024-01-20',
      local: 'Academia Central',
      status: 'active'
    },
    {
      id: '2',
      name: 'Batizado 2024',
      tipo: 'batizado',
      data: '2024-03-15',
      local: 'Ginásio Municipal',
      status: 'pending'
    }
  ]);

  // Formulários
  const [newInstructor, setNewInstructor] = useState({
    name: '',
    cordao: '',
    especialidade: '',
    experiencia: 0
  });

  const [newMovement, setNewMovement] = useState({
    name: '',
    categoria: 'ataque' as const,
    dificuldade: 1 as const,
    descricao: ''
  });

  const [newEvent, setNewEvent] = useState({
    name: '',
    tipo: 'roda' as const,
    data: '',
    local: ''
  });

  // Funções
  const addInstructor = () => {
    const instrutor: Instrutor = {
      id: Date.now().toString(),
      ...newInstructor,
      status: 'active'
    };
    setInstrutores([...instrutores, instrutor]);
    setNewInstructor({ name: '', cordao: '', especialidade: '', experiencia: 0 });
    setShowInstructorModal(false);
  };

  const addMovement = () => {
    const movimento: Movimento = {
      id: Date.now().toString(),
      ...newMovement
    };
    setMovimentos([...movimentos, movimento]);
    setNewMovement({ name: '', categoria: 'ataque', dificuldade: 1, descricao: '' });
    setShowMovementModal(false);
  };

  const addEvent = () => {
    const evento: Evento = {
      id: Date.now().toString(),
      ...newEvent,
      status: 'active'
    };
    setEventos([...eventos, evento]);
    setNewEvent({ name: '', tipo: 'roda', data: '', local: '' });
    setShowEventModal(false);
  };

  const removeItem = (id: string, type: 'instructor' | 'movement' | 'event') => {
    switch (type) {
      case 'instructor':
        setInstrutores(instrutores.filter(i => i.id !== id));
        break;
      case 'movement':
        setMovimentos(movimentos.filter(m => m.id !== id));
        break;
      case 'event':
        setEventos(eventos.filter(e => e.id !== id));
        break;
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gestão de Instrutores */}
      <FunctionCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <Users size={24} />
            Instrutores
          </CardTitle>
          <ActionButton
            onClick={() => setShowInstructorModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Adicionar
          </ActionButton>
        </CardHeader>

        <ItemList>
          {instrutores.map((instrutor) => (
            <ListItem
              key={instrutor.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <ItemInfo>
                <div className="title">{instrutor.name}</div>
                <div className="subtitle">
                  {instrutor.cordao} • {instrutor.especialidade} • {instrutor.experiencia} anos
                </div>
              </ItemInfo>
              <ItemActions>
                <StatusBadge status={instrutor.status}>
                  {instrutor.status === 'active' ? 'Ativo' : 'Inativo'}
                </StatusBadge>
                <SmallButton whileHover={{ scale: 1.1 }}>
                  <Edit size={14} />
                </SmallButton>
                <SmallButton 
                  onClick={() => removeItem(instrutor.id, 'instructor')}
                  whileHover={{ scale: 1.1 }}
                >
                  <Trash2 size={14} />
                </SmallButton>
              </ItemActions>
            </ListItem>
          ))}
        </ItemList>
      </FunctionCard>

      {/* Gestão de Movimentos */}
      <FunctionCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <BookOpen size={24} />
            Movimentos
          </CardTitle>
          <ActionButton
            onClick={() => setShowMovementModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Adicionar
          </ActionButton>
        </CardHeader>

        <ItemList>
          {movimentos.map((movimento) => (
            <ListItem
              key={movimento.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <ItemInfo>
                <div className="title">{movimento.name}</div>
                <div className="subtitle">
                  {movimento.categoria} • Dificuldade: {Array(movimento.dificuldade).fill('⭐').join('')}
                </div>
              </ItemInfo>
              <ItemActions>
                <SmallButton whileHover={{ scale: 1.1 }}>
                  <Edit size={14} />
                </SmallButton>
                <SmallButton 
                  onClick={() => removeItem(movimento.id, 'movement')}
                  whileHover={{ scale: 1.1 }}
                >
                  <Trash2 size={14} />
                </SmallButton>
              </ItemActions>
            </ListItem>
          ))}
        </ItemList>
      </FunctionCard>

      {/* Gestão de Eventos */}
      <FunctionCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <Calendar size={24} />
            Eventos
          </CardTitle>
          <ActionButton
            onClick={() => setShowEventModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={16} />
            Adicionar
          </ActionButton>
        </CardHeader>

        <ItemList>
          {eventos.map((evento) => (
            <ListItem
              key={evento.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              <ItemInfo>
                <div className="title">{evento.name}</div>
                <div className="subtitle">
                  {evento.tipo} • {evento.data} • {evento.local}
                </div>
              </ItemInfo>
              <ItemActions>
                <StatusBadge status={evento.status}>
                  {evento.status === 'active' ? 'Ativo' : 
                   evento.status === 'pending' ? 'Pendente' : 'Concluído'}
                </StatusBadge>
                <SmallButton whileHover={{ scale: 1.1 }}>
                  <Edit size={14} />
                </SmallButton>
                <SmallButton 
                  onClick={() => removeItem(evento.id, 'event')}
                  whileHover={{ scale: 1.1 }}
                >
                  <Trash2 size={14} />
                </SmallButton>
              </ItemActions>
            </ListItem>
          ))}
        </ItemList>
      </FunctionCard>

      {/* Modal de Instrutor */}
      <AnimatePresence>
        {showInstructorModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInstructorModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Adicionar Instrutor</ModalTitle>
                <CloseButton
                  onClick={() => setShowInstructorModal(false)}
                  whileHover={{ scale: 1.1 }}
                >
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Nome</Label>
                <Input
                  value={newInstructor.name}
                  onChange={(e) => setNewInstructor({...newInstructor, name: e.target.value})}
                  placeholder="Nome do instrutor"
                />
              </FormGroup>

              <FormGroup>
                <Label>Cordão/Graduação</Label>
                <Select
                  value={newInstructor.cordao}
                  onChange={(e) => setNewInstructor({...newInstructor, cordao: e.target.value})}
                >
                  <option value="">Selecione</option>
                  <option value="Crua">Crua</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Laranja">Laranja</option>
                  <option value="Verde">Verde</option>
                  <option value="Azul">Azul</option>
                  <option value="Roxa">Roxa</option>
                  <option value="Marrom">Marrom</option>
                  <option value="Vermelha">Vermelha</option>
                  <option value="Vermelha/Branca">Vermelha/Branca</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Especialidade</Label>
                <Input
                  value={newInstructor.especialidade}
                  onChange={(e) => setNewInstructor({...newInstructor, especialidade: e.target.value})}
                  placeholder="Ex: Berimbau, Floreios, Canto..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Anos de Experiência</Label>
                <Input
                  type="number"
                  value={newInstructor.experiencia}
                  onChange={(e) => setNewInstructor({...newInstructor, experiencia: parseInt(e.target.value) || 0})}
                  placeholder="Anos de prática"
                />
              </FormGroup>

              <ModalActions>
                <ActionButton
                  onClick={() => setShowInstructorModal(false)}
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <X size={16} />
                  Cancelar
                </ActionButton>
                <ActionButton
                  onClick={addInstructor}
                  whileHover={{ scale: 1.05 }}
                >
                  <Save size={16} />
                  Salvar
                </ActionButton>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal de Movimento */}
      <AnimatePresence>
        {showMovementModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMovementModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Adicionar Movimento</ModalTitle>
                <CloseButton
                  onClick={() => setShowMovementModal(false)}
                  whileHover={{ scale: 1.1 }}
                >
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Nome do Movimento</Label>
                <Input
                  value={newMovement.name}
                  onChange={(e) => setNewMovement({...newMovement, name: e.target.value})}
                  placeholder="Ex: Armada, Au, Negativa..."
                />
              </FormGroup>

              <FormGroup>
                <Label>Categoria</Label>
                <Select
                  value={newMovement.categoria}
                  onChange={(e) => setNewMovement({...newMovement, categoria: e.target.value as any})}
                >
                  <option value="ataque">Ataque</option>
                  <option value="defesa">Defesa</option>
                  <option value="esquiva">Esquiva</option>
                  <option value="acrobacia">Acrobacia</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Dificuldade (1-5)</Label>
                <Select
                  value={newMovement.dificuldade}
                  onChange={(e) => setNewMovement({...newMovement, dificuldade: parseInt(e.target.value) as any})}
                >
                  <option value={1}>1 - Básico</option>
                  <option value={2}>2 - Iniciante</option>
                  <option value={3}>3 - Intermediário</option>
                  <option value={4}>4 - Avançado</option>
                  <option value={5}>5 - Expert</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Descrição</Label>
                <Input
                  value={newMovement.descricao}
                  onChange={(e) => setNewMovement({...newMovement, descricao: e.target.value})}
                  placeholder="Breve descrição do movimento"
                />
              </FormGroup>

              <ModalActions>
                <ActionButton
                  onClick={() => setShowMovementModal(false)}
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <X size={16} />
                  Cancelar
                </ActionButton>
                <ActionButton
                  onClick={addMovement}
                  whileHover={{ scale: 1.05 }}
                >
                  <Save size={16} />
                  Salvar
                </ActionButton>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>

      {/* Modal de Evento */}
      <AnimatePresence>
        {showEventModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEventModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>Adicionar Evento</ModalTitle>
                <CloseButton
                  onClick={() => setShowEventModal(false)}
                  whileHover={{ scale: 1.1 }}
                >
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <FormGroup>
                <Label>Nome do Evento</Label>
                <Input
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({...newEvent, name: e.target.value})}
                  placeholder="Nome do evento"
                />
              </FormGroup>

              <FormGroup>
                <Label>Tipo</Label>
                <Select
                  value={newEvent.tipo}
                  onChange={(e) => setNewEvent({...newEvent, tipo: e.target.value as any})}
                >
                  <option value="roda">Roda</option>
                  <option value="batizado">Batizado</option>
                  <option value="workshop">Workshop</option>
                  <option value="encontro">Encontro</option>
                </Select>
              </FormGroup>

              <FormGroup>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={newEvent.data}
                  onChange={(e) => setNewEvent({...newEvent, data: e.target.value})}
                />
              </FormGroup>

              <FormGroup>
                <Label>Local</Label>
                <Input
                  value={newEvent.local}
                  onChange={(e) => setNewEvent({...newEvent, local: e.target.value})}
                  placeholder="Local do evento"
                />
              </FormGroup>

              <ModalActions>
                <ActionButton
                  onClick={() => setShowEventModal(false)}
                  style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                  whileHover={{ scale: 1.05 }}
                >
                  <X size={16} />
                  Cancelar
                </ActionButton>
                <ActionButton
                  onClick={addEvent}
                  whileHover={{ scale: 1.05 }}
                >
                  <Save size={16} />
                  Salvar
                </ActionButton>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default CapoeiraAdminFunctions;