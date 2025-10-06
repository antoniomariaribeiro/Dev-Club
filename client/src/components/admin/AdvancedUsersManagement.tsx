import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Plus, Edit, Trash2, Eye, 
  Filter, Download, Upload, UserCheck,
  Mail, Phone, Calendar, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';
import userService, { User, CreateUserData, UpdateUserData } from '../../services/userService';

// ============ STYLED COMPONENTS ============
const UsersContainer = styled.div`
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
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
          &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4); }
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(239, 68, 68, 0.4); }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover { background: rgba(255, 255, 255, 0.2); }
        `;
    }
  }}
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StatInfo = styled.div``;

const StatLabel = styled.p`
  font-size: 0.9rem;
  opacity: 0.7;
  margin: 0 0 5px 0;
`;

const StatValue = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
`;

const FiltersBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
  flex: 1;
  min-width: 200px;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  
  option {
    background: #333;
    color: white;
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const UserCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 25px;
  position: relative;
  overflow: hidden;
`;

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
`;

const UserAvatar = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-right: 15px;
`;

const UserInfo = styled.div`
  flex: 1;
`;

const UserName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 5px 0;
`;

const UserRole = styled.p`
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
  padding: 3px 8px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 5px;
  display: inline-block;
`;

const UserDetails = styled.div`
  margin: 15px 0;
`;

const UserDetail = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  font-size: 0.9rem;
  opacity: 0.8;
  
  svg {
    margin-right: 8px;
    width: 16px;
    height: 16px;
  }
`;

const UserActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const ActionButton = styled(motion.button)<{ variant?: 'edit' | 'delete' | 'view' }>`
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'edit':
        return `
          background: linear-gradient(45deg, #3b82f6, #2563eb);
          color: white;
          &:hover { transform: translateY(-1px); }
        `;
      case 'delete':
        return `
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
          &:hover { transform: translateY(-1px); }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover { background: rgba(255, 255, 255, 0.2); }
        `;
    }
  }}
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${props => props.status === 'active' 
    ? 'background: linear-gradient(45deg, #10b981, #059669); color: white;'
    : 'background: linear-gradient(45d, #6b7280, #4b5563); color: white;'
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  color: white;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
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
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
`;

// ============ INTERFACES ============
interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'instructor' | 'admin' | 'manager';
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  password?: string;
}

// ============ COMPONENTE PRINCIPAL ============
const AdvancedUsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  // const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  // const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
    password: ''
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers(1, 12, searchTerm, roleFilter !== 'all' ? roleFilter : '', statusFilter !== 'all' ? statusFilter : '');
      setUsers(data.users || data);
      // setTotalPages(Math.ceil((data.total || data.length) / 12));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
      // Dados simulados como fallback
      setUsers([
        {
          id: 1,
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '(11) 99999-9999',
          role: 'student',
          status: 'active',
          is_active: true,
          createdAt: '2024-01-15T10:00:00Z'
        },
        {
          id: 2,
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '(11) 88888-8888',
          role: 'instructor',
          status: 'active',
          is_active: true,
          createdAt: '2024-02-20T14:30:00Z'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userData: CreateUserData = {
        name: formData.name,
        email: formData.email,
        password: formData.password || 'senha123',
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      };
      
      await userService.createUser(userData);
      toast.success('Usuário criado com sucesso!');
      fetchUsers();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar usuário');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const userData: UpdateUserData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status
      };
      
      await userService.updateUser(editingUser.id, userData);
      toast.success('Usuário atualizado com sucesso!');
      fetchUsers();
      setShowModal(false);
      setEditingUser(null);
      resetForm();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao atualizar usuário');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      await userService.deleteUser(userId);
      toast.success('Usuário excluído com sucesso!');
      fetchUsers();
      // Remove da seleção se estava selecionado
      // setSelectedUsers(prev => prev.filter(id => id !== userId));
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao excluir usuário');
    }
  };



  // const handleSelectUser = (userId: number) => {
  //   setSelectedUsers(prev => 
  //     prev.includes(userId)
  //       ? prev.filter(id => id !== userId)
  //       : [...prev, userId]
  //   );
  // };


  const handleExportUsers = async () => {
    try {
      const blob = await userService.exportUsers('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `usuarios-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao exportar relatório');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'student',
      status: 'active',
      password: ''
    });
  };

  const openCreateModal = () => {
    setEditingUser(null);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      status: user.status
    });
    setShowModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.status === 'active') ||
                         (statusFilter === 'inactive' && user.status === 'inactive');
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getUserStats = () => ({
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    students: users.filter(u => u.role === 'student').length,
    instructors: users.filter(u => u.role === 'instructor').length,
  });

  const stats = getUserStats();

  const getAvatarColor = (name: string) => {
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getRoleLabel = (role: string) => {
    const labels = {
      student: 'Aluno',
      instructor: 'Professor',
      admin: 'Administrador'
    };
    return labels[role as keyof typeof labels] || role;
  };

  if (loading) {
    return (
      <UsersContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <div style={{ fontSize: '1.2rem' }}>Carregando usuários...</div>
        </div>
      </UsersContainer>
    );
  }

  return (
    <UsersContainer>
      <Header>
        <Title>👥 Gestão de Usuários</Title>
        <HeaderActions>
          <Button variant="secondary" onClick={handleExportUsers}>
            <Download size={20} />
            Exportar
          </Button>
          <Button variant="secondary">
            <Upload size={20} />
            Importar
          </Button>
          <Button variant="primary" onClick={openCreateModal}>
            <Plus size={20} />
            Novo Usuário
          </Button>
        </HeaderActions>
      </Header>

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatInfo>
            <StatLabel>Total de Usuários</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatInfo>
          <StatIcon>
            <Users />
          </StatIcon>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatInfo>
            <StatLabel>Usuários Ativos</StatLabel>
            <StatValue>{stats.active}</StatValue>
          </StatInfo>
          <StatIcon>
            <UserCheck />
          </StatIcon>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatInfo>
            <StatLabel>Alunos</StatLabel>
            <StatValue>{stats.students}</StatValue>
          </StatInfo>
          <StatIcon>
            <Users />
          </StatIcon>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatInfo>
            <StatLabel>Professores</StatLabel>
            <StatValue>{stats.instructors}</StatValue>
          </StatInfo>
          <StatIcon>
            <Shield />
          </StatIcon>
        </StatCard>
      </StatsGrid>

      <FiltersBar>
        <SearchInput
          type="text"
          placeholder="🔍 Buscar usuários..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">Todos os Papéis</option>
          <option value="student">Alunos</option>
          <option value="instructor">Professores</option>
          <option value="admin">Administradores</option>
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </Select>
        <Button variant="secondary">
          <Filter size={20} />
          Filtros Avançados
        </Button>
      </FiltersBar>

      <UsersGrid>
        <AnimatePresence>
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -5 }}
            >
              <StatusBadge status={user.status === 'active' ? 'active' : 'inactive'}>
                {user.status === 'active' ? 'Ativo' : 'Inativo'}
              </StatusBadge>
              
              <UserHeader>
                <UserAvatar color={getAvatarColor(user.name)}>
                  {user.name.charAt(0).toUpperCase()}
                </UserAvatar>
                <UserInfo>
                  <UserName>{user.name}</UserName>
                  <UserRole>{getRoleLabel(user.role)}</UserRole>
                </UserInfo>
              </UserHeader>

              <UserDetails>
                <UserDetail>
                  <Mail />
                  {user.email}
                </UserDetail>
                {user.phone && (
                  <UserDetail>
                    <Phone />
                    {user.phone}
                  </UserDetail>
                )}
                <UserDetail>
                  <Calendar />
                  Cadastrado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </UserDetail>
              </UserDetails>

              <UserActions>
                <ActionButton
                  variant="view"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Eye size={16} />
                  Ver
                </ActionButton>
                <ActionButton
                  variant="edit"
                  onClick={() => openEditModal(user)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Edit size={16} />
                  Editar
                </ActionButton>
                <ActionButton
                  variant="delete"
                  onClick={() => handleDeleteUser(user.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 size={16} />
                  Excluir
                </ActionButton>
              </UserActions>
            </UserCard>
          ))}
        </AnimatePresence>
      </UsersGrid>

      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>
                  ×
                </CloseButton>
              </ModalHeader>

              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                <FormGroup>
                  <Label>Nome Completo</Label>
                  <Input
                    type="text"
                    placeholder="Digite o nome completo"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="Digite o email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Telefone</Label>
                  <Input
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Papel</Label>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    style={{ width: '100%' }}
                  >
                    <option value="student">Aluno</option>
                    <option value="instructor">Professor</option>
                    <option value="admin">Administrador</option>
                  </Select>
                </FormGroup>

                {!editingUser && (
                  <FormGroup>
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      placeholder="Digite a senha"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </FormGroup>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    style={{ flex: 1 }}
                  >
                    {editingUser ? 'Atualizar' : 'Criar'} Usuário
                  </Button>
                </div>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </UsersContainer>
  );
};

export default AdvancedUsersManagement;