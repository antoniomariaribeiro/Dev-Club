import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search, Download, 
  Mail, Phone, Calendar, Grid, List,
  Check, X, ArrowUpDown, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import userService, { User, CreateUserData, UpdateUserData } from '../../services/userService';

// ============ STYLED COMPONENTS ============
const Container = styled.div`
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
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 5px;
`;

const ControlsBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder { color: rgba(255, 255, 255, 0.6); }
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
`;

const FilterSelect = styled.select`
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  
  option { background: #333; color: white; }
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' | 'success' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  
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
      case 'success':
        return `
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          &:hover { transform: translateY(-2px); }
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
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover { transform: none; }
  }
`;

const BulkActions = styled.div<{ visible: boolean }>`
  background: linear-gradient(45deg, #ef4444, #dc2626);
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${props => props.visible ? 1 : 0};
  transition: all 0.3s ease;
  height: ${props => props.visible ? 'auto' : '0'};
  overflow: hidden;
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 4px;
`;

const ViewButton = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.8)' : 'transparent'};
  color: ${props => props.active ? '#333' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'rgba(255, 215, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

// Grid View
const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
`;

const UserCard = styled(motion.div)<{ selected: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: ${props => props.selected ? '2px solid #ffd700' : '1px solid rgba(255, 255, 255, 0.2)'};
  border-radius: 15px;
  padding: 25px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(255, 215, 0, 0.5);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
`;

// Table View
const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  padding: 20px 15px;
  text-align: left;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TableRow = styled(motion.tr)<{ selected: boolean }>`
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`;

const TableCell = styled.td`
  padding: 15px;
  vertical-align: middle;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const UserAvatar = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.2rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return 'background: linear-gradient(45deg, #10b981, #059669); color: white;';
      case 'inactive':
        return 'background: linear-gradient(45deg, #6b7280, #4b5563); color: white;';
      case 'pending':
        return 'background: linear-gradient(45deg, #f59e0b, #d97706); color: white;';
      default:
        return 'background: rgba(255, 255, 255, 0.2); color: white;';
    }
  }}
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  
  ${props => {
    switch (props.role) {
      case 'admin':
        return 'background: rgba(255, 215, 0, 0.8); color: #333;';
      case 'instructor':
        return 'background: rgba(59, 130, 246, 0.8); color: white;';
      case 'manager':
        return 'background: rgba(139, 69, 19, 0.8); color: white;';
      default:
        return 'background: rgba(255, 255, 255, 0.2); color: white;';
    }
  }}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
`;

const PageButton = styled.button<{ active?: boolean }>`
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background: ${props => props.active ? 'linear-gradient(45deg, #ffd700, #ffed4e)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#333' : 'white'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(45deg, #ffd700, #ffed4e)' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Modal Components
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
  backdrop-filter: blur(5px);
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  font-size: 0.95rem;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder { color: rgba(255, 255, 255, 0.6); }
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  
  option { background: #333; color: white; }
  &:focus {
    outline: none;
    border-color: #ffd700;
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

interface UserStats {
  total: number;
  active: number;
  byRole: Record<string, number>;
}

// ============ COMPONENTE PRINCIPAL ============
const SuperAdvancedUsersManagement: React.FC = () => {
  // Estados principais
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({ total: 0, active: 0, byRole: {} });
  
  // Estados de filtros e busca
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Estados de paginação
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Estados de interface
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Estados de modal e formulário
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'student',
    status: 'active',
    password: ''
  });
  
  // Estados de ações
  const [bulkLoading, setBulkLoading] = useState(false);

  // ============ FUNÇÕES DE API ============
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers(
        currentPage, 
        12, 
        searchTerm, 
        roleFilter !== 'all' ? roleFilter : '', 
        statusFilter !== 'all' ? statusFilter : ''
      );
      setUsers(data.users || data);
      setTotalPages(Math.ceil((data.total || data.length) / 12));
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await userService.getUserStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Fallback para stats baseado nos users carregados
      const total = users.length;
      const active = users.filter(u => u.status === 'active').length;
      const byRole = users.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      setStats({ total, active, byRole });
    }
  }, [users]);

  // ============ EFEITOS ============
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // ============ FUNÇÕES DE MANIPULAÇÃO ============
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (type: 'role' | 'status', value: string) => {
    if (type === 'role') {
      setRoleFilter(value);
    } else {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === users.length ? [] : users.map(u => u.id)
    );
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // ============ FUNÇÕES CRUD ============
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
      fetchStats();
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
      fetchStats();
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
      fetchStats();
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao excluir usuário');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Selecione pelo menos um usuário');
      return;
    }

    if (!window.confirm(`Tem certeza que deseja excluir ${selectedUsers.length} usuário(s)?`)) return;

    setBulkLoading(true);
    try {
      await userService.bulkDelete(selectedUsers);
      toast.success(`${selectedUsers.length} usuário(s) excluído(s) com sucesso!`);
      fetchUsers();
      fetchStats();
      setSelectedUsers([]);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao excluir usuários');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId: number) => {
    try {
      await userService.toggleUserStatus(userId);
      toast.success('Status alterado com sucesso!');
      fetchUsers();
      fetchStats();
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao alterar status');
    }
  };

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

  // ============ FUNÇÕES AUXILIARES ============
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

  const getAvatarColor = (name: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // ============ RENDER ============
  return (
    <Container>
      <Header>
        <Title>🥋 Gestão Avançada de Usuários</Title>
        <HeaderActions>
          <Button onClick={() => fetchUsers()} disabled={loading}>
            <RefreshCw size={16} />
            Atualizar
          </Button>
          <Button onClick={handleExportUsers} variant="secondary">
            <Download size={16} />
            Exportar
          </Button>
          <Button onClick={openCreateModal} variant="primary">
            <Plus size={16} />
            Novo Usuário
          </Button>
        </HeaderActions>
      </Header>

      {/* Estatísticas */}
      <StatsBar>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total de Usuários</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Usuários Ativos</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue>{stats.byRole.student || 0}</StatValue>
          <StatLabel>Alunos</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue>{stats.byRole.instructor || 0}</StatValue>
          <StatLabel>Instrutores</StatLabel>
        </StatCard>
      </StatsBar>

      {/* Controles */}
      <ControlsBar>
        <SearchBox>
          <SearchIcon size={20} />
          <SearchInput
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </SearchBox>
        
        <FilterSelect
          value={roleFilter}
          onChange={(e) => handleFilterChange('role', e.target.value)}
        >
          <option value="all">Todos os Cargos</option>
          <option value="admin">Administrador</option>
          <option value="instructor">Instrutor</option>
          <option value="manager">Gerente</option>
          <option value="student">Aluno</option>
        </FilterSelect>
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
          <option value="pending">Pendente</option>
        </FilterSelect>

        <ViewToggle>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
            Grid
          </ViewButton>
          <ViewButton
            active={viewMode === 'table'}
            onClick={() => setViewMode('table')}
          >
            <List size={16} />
            Tabela
          </ViewButton>
        </ViewToggle>
      </ControlsBar>

      {/* Ações em Lote */}
      <BulkActions visible={selectedUsers.length > 0}>
        <span>{selectedUsers.length} usuário(s) selecionado(s)</span>
        <Button 
          onClick={handleBulkDelete} 
          variant="danger" 
          disabled={bulkLoading}
        >
          <Trash2 size={16} />
          Excluir Selecionados
        </Button>
      </BulkActions>

      {/* Lista de Usuários */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p>Carregando usuários...</p>
        </div>
      ) : viewMode === 'grid' ? (
        <UsersGrid>
          {users.map(user => (
            <UserCard
              key={user.id}
              selected={selectedUsers.includes(user.id)}
              onClick={() => handleSelectUser(user.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <UserAvatar color={getAvatarColor(user.name)}>
                    {getUserInitials(user.name)}
                  </UserAvatar>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{user.name}</h3>
                    <RoleBadge role={user.role}>
                      {user.role === 'admin' ? 'Admin' : 
                       user.role === 'instructor' ? 'Instrutor' :
                       user.role === 'manager' ? 'Gerente' : 'Aluno'}
                    </RoleBadge>
                  </div>
                </div>
                <StatusBadge status={user.status}>
                  {user.status === 'active' ? 'Ativo' : 
                   user.status === 'inactive' ? 'Inativo' : 'Pendente'}
                </StatusBadge>
              </div>
              
              <div style={{ fontSize: '0.9rem', opacity: 0.8, marginBottom: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                  <Mail size={14} />
                  {user.email}
                </div>
                {user.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <Phone size={14} />
                    {user.phone}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={14} />
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <Button 
                  onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                  style={{ flex: 1, fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  <Edit size={14} />
                  Editar
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleToggleUserStatus(user.id); }}
                  variant={user.status === 'active' ? 'secondary' : 'success'}
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  {user.status === 'active' ? <X size={14} /> : <Check size={14} />}
                  {user.status === 'active' ? 'Desativar' : 'Ativar'}
                </Button>
                <Button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                  variant="danger"
                  style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </UserCard>
          ))}
        </UsersGrid>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <TableHeader style={{ width: '50px' }}>
                  <Checkbox
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={handleSelectAll}
                  />
                </TableHeader>
                <TableHeader onClick={() => handleSort('name')}>
                  Nome <ArrowUpDown size={14} />
                </TableHeader>
                <TableHeader onClick={() => handleSort('email')}>
                  Email <ArrowUpDown size={14} />
                </TableHeader>
                <TableHeader onClick={() => handleSort('role')}>
                  Cargo <ArrowUpDown size={14} />
                </TableHeader>
                <TableHeader onClick={() => handleSort('status')}>
                  Status <ArrowUpDown size={14} />
                </TableHeader>
                <TableHeader onClick={() => handleSort('createdAt')}>
                  Criado em <ArrowUpDown size={14} />
                </TableHeader>
                <TableHeader style={{ width: '120px' }}>Ações</TableHeader>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <TableRow
                  key={user.id}
                  selected={selectedUsers.includes(user.id)}
                  onClick={() => handleSelectUser(user.id)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <UserAvatar color={getAvatarColor(user.name)} style={{ width: '35px', height: '35px', fontSize: '0.9rem' }}>
                        {getUserInitials(user.name)}
                      </UserAvatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role}>
                      {user.role === 'admin' ? 'Admin' : 
                       user.role === 'instructor' ? 'Instrutor' :
                       user.role === 'manager' ? 'Gerente' : 'Aluno'}
                    </RoleBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status}>
                      {user.status === 'active' ? 'Ativo' : 
                       user.status === 'inactive' ? 'Inativo' : 'Pendente'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); openEditModal(user); }}
                        style={{ padding: '5px 8px', fontSize: '0.8rem' }}
                      >
                        <Edit size={12} />
                      </Button>
                      <Button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                        variant="danger"
                        style={{ padding: '5px 8px', fontSize: '0.8rem' }}
                      >
                        <Trash2 size={12} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <Pagination>
          <PageButton
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </PageButton>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
            if (page > totalPages) return null;
            
            return (
              <PageButton
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PageButton>
            );
          })}
          
          <PageButton
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próximo
          </PageButton>
        </Pagination>
      )}

      {/* Modal de Criação/Edição */}
      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                </ModalTitle>
                <CloseButton onClick={() => setShowModal(false)}>
                  <X size={20} />
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
                <FormGroup>
                  <Label>Nome Completo</Label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome completo"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Digite o email"
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Telefone</Label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="(11) 99999-9999"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Cargo</Label>
                  <Select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                    required
                  >
                    <option value="student">Aluno</option>
                    <option value="instructor">Instrutor</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    required
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="pending">Pendente</option>
                  </Select>
                </FormGroup>

                {!editingUser && (
                  <FormGroup>
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Digite a senha (deixe vazio para senha padrão)"
                    />
                  </FormGroup>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <Button type="submit" variant="primary" style={{ flex: 1 }}>
                    {editingUser ? 'Atualizar' : 'Criar'} Usuário
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default SuperAdvancedUsersManagement;