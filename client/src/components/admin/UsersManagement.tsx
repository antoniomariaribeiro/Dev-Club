import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Edit3, Trash2, Eye, Search,
  Phone, MapPin, Calendar, Award,
  X, Save
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============ TIPOS ============
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'student' | 'instructor';
  graduation: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  isActive: boolean;
  createdAt: string;
  avatar?: string;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'student' | 'instructor';
  graduation: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  isActive: boolean;
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

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const UserCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 25px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const UserInfo = styled.div`
  flex: 1;
  
  h3 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    color: #ffd700;
  }
  
  .email {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    margin-bottom: 5px;
  }
  
  .role {
    display: inline-block;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(255, 215, 0, 0.2);
    color: #ffd700;
    border: 1px solid rgba(255, 215, 0, 0.3);
  }
`;

const Avatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 10px;
`;

const UserDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin: 15px 0;
  font-size: 0.85rem;
  
  .detail {
    display: flex;
    align-items: center;
    gap: 5px;
    color: rgba(255, 255, 255, 0.8);
    
    svg {
      color: #ffd700;
    }
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 15px;
`;

const ActionButton = styled(motion.button)<{ variant?: 'edit' | 'delete' | 'view' }>`
  padding: 8px;
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
  max-width: 600px;
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
  
  select option {
    background: #333;
    color: white;
  }
`;

// ============ DADOS MOCK ============
const mockUsers: User[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@gmail.com',
    phone: '(11) 99999-9999',
    role: 'student',
    graduation: 'Cordão Amarelo',
    birthDate: '1995-03-15',
    address: 'São Paulo, SP',
    emergencyContact: 'Maria Silva',
    emergencyPhone: '(11) 88888-8888',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Ana Costa',
    email: 'ana@gmail.com',
    phone: '(11) 77777-7777',
    role: 'instructor',
    graduation: 'Professor',
    birthDate: '1988-07-22',
    address: 'Rio de Janeiro, RJ',
    emergencyContact: 'Pedro Costa',
    emergencyPhone: '(11) 66666-6666',
    isActive: true,
    createdAt: '2024-02-10'
  },
  {
    id: 3,
    name: 'Carlos Santos',
    email: 'carlos@gmail.com',
    phone: '(11) 55555-5555',
    role: 'student',
    graduation: 'Batizado',
    birthDate: '2000-12-05',
    address: 'Belo Horizonte, MG',
    emergencyContact: 'Lucia Santos',
    emergencyPhone: '(11) 44444-4444',
    isActive: false,
    createdAt: '2024-03-20'
  }
];

// ============ COMPONENTE PRINCIPAL ============
const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    graduation: '',
    birthDate: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    isActive: true
  });

  // Filtrar usuários
  useEffect(() => {
    const filtered = users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm]);

  // Abrir modal para criar/editar
  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        graduation: user.graduation,
        birthDate: user.birthDate,
        address: user.address,
        emergencyContact: user.emergencyContact,
        emergencyPhone: user.emergencyPhone,
        isActive: user.isActive
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'student',
        graduation: '',
        birthDate: '',
        address: '',
        emergencyContact: '',
        emergencyPhone: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  // Salvar usuário
  const handleSaveUser = () => {
    if (editingUser) {
      // Editar usuário existente
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
      toast.success('Usuário atualizado com sucesso!');
    } else {
      // Criar novo usuário
      const newUser: User = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
      toast.success('Usuário criado com sucesso!');
    }
    setShowModal(false);
  };

  // Excluir usuário
  const handleDeleteUser = (userId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('Usuário excluído com sucesso!');
    }
  };

  return (
    <Container>
      <Header>
        <h1>
          <Users size={32} />
          Gerenciar Usuários
        </h1>
        
        <Controls>
          <SearchBar>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar usuários..."
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
            Novo Usuário
          </Button>
        </Controls>
      </Header>

      <UsersGrid>
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UserHeader>
                <Avatar>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  borderRadius: '50%', 
                  background: user.isActive ? '#2ecc71' : '#e74c3c'
                }} />
              </UserHeader>
              
              <UserInfo>
                <h3>{user.name}</h3>
                <div className="email">{user.email}</div>
                <div className="role">{user.role}</div>
              </UserInfo>
              
              <UserDetails>
                <div className="detail">
                  <Phone size={14} />
                  {user.phone}
                </div>
                <div className="detail">
                  <Award size={14} />
                  {user.graduation}
                </div>
                <div className="detail">
                  <MapPin size={14} />
                  {user.address}
                </div>
                <div className="detail">
                  <Calendar size={14} />
                  {new Date(user.birthDate).toLocaleDateString('pt-BR')}
                </div>
              </UserDetails>
              
              <UserActions>
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
                  onClick={() => handleOpenModal(user)}
                >
                  <Edit3 size={16} />
                </ActionButton>
                
                <ActionButton
                  variant="delete"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </UserActions>
            </UserCard>
          ))}
        </AnimatePresence>
      </UsersGrid>

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
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </h2>
                <Button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </Button>
              </div>

              <FormGrid>
                <FormGroup>
                  <label>Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Digite o nome completo"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@exemplo.com"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Telefone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Função</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as 'admin' | 'student' | 'instructor'})}
                  >
                    <option value="student">Aluno</option>
                    <option value="instructor">Instrutor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Graduação</label>
                  <input
                    type="text"
                    value={formData.graduation}
                    onChange={(e) => setFormData({...formData, graduation: e.target.value})}
                    placeholder="Ex: Cordão Amarelo"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Data de Nascimento</label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Endereço</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Cidade, Estado"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Contato de Emergência</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    placeholder="Nome do contato"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Telefone de Emergência</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                    placeholder="(11) 99999-9999"
                  />
                </FormGroup>
              </FormGrid>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <Button onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSaveUser}>
                  <Save size={20} />
                  {editingUser ? 'Atualizar' : 'Criar'} Usuário
                </Button>
              </div>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default UsersManagement;