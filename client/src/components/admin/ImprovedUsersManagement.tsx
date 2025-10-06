import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Download, 
  Grid, List, RefreshCw,
  UserCheck, UserX, Clock, Ban
} from 'lucide-react';
import toast from 'react-hot-toast';
import userService, { User } from '../../services/userService';

import UserModal from './UserModal';
import StatusManager from './StatusManager';
import StatusToggle from './StatusToggle';
import AdvancedSearch, { SearchFilters } from './AdvancedSearch';

// ============ TYPES ============
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';
type ViewMode = 'grid' | 'table';

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

const StatCard = styled(motion.div)<{ color?: string }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.color || '#ffd700'};
  }
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

const Button = styled(motion.button)<{ 
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}>`
  padding: ${props => 
    props.size === 'sm' ? '8px 12px' : 
    props.size === 'lg' ? '15px 25px' : 
    '12px 20px'};
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${props => 
    props.size === 'sm' ? '0.85rem' : 
    props.size === 'lg' ? '1.1rem' : 
    '1rem'};
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #2d3748;
        `;
      case 'secondary':
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
      case 'danger':
        return css`
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
        `;
      case 'success':
        return css`
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
        `;
      case 'warning':
        return css`
          background: linear-gradient(45deg, #f59e0b, #d97706);
          color: white;
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
    }
  }
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
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.7)'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    color: #ffd700;
  }
`;

const BulkActions = styled(motion.div)`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  padding: 15px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #2d3748;
`;

const BulkActionsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const BulkActionsRight = styled.div`
  display: flex;
  gap: 10px;
`;

const UsersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const UserCard = styled(motion.div)<{ selected?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.selected ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ffd700;
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const UserTable = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 50px 1fr 200px 120px 120px 100px 120px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  gap: 15px;
`;

const TableRow = styled(motion.div)<{ selected?: boolean }>`
  display: grid;
  grid-template-columns: 50px 1fr 200px 120px 120px 100px 120px;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: ${props => props.selected ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  transition: all 0.3s ease;
  gap: 15px;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.color || 'linear-gradient(45deg, #667eea, #764ba2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
`;

const UserDetails = styled.div`
  flex: 1;
`;

const UserName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const UserEmail = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
`;

const StatusBadge = styled.span<{ status: UserStatus }>`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return css`
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
        `;
      case 'inactive':
        return css`
          background: linear-gradient(45deg, #6b7280, #4b5563);
          color: white;
        `;
      case 'pending':
        return css`
          background: linear-gradient(45deg, #f59e0b, #d97706);
          color: white;
        `;
      case 'suspended':
        return css`
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: white;
        `;
    }
  }}
`;

const RoleBadge = styled.span<{ role: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => {
    switch (props.role) {
      case 'admin':
        return css`
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'instructor':
        return css`
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        `;
      case 'manager':
        return css`
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      default:
        return css`
          background: rgba(99, 102, 241, 0.2);
          color: #6366f1;
          border: 1px solid rgba(99, 102, 241, 0.3);
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled(motion.button)<{ variant?: 'edit' | 'delete' | 'status' }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'edit':
        return css`
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          &:hover {
            background: rgba(59, 130, 246, 0.3);
          }
        `;
      case 'delete':
        return css`
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          &:hover {
            background: rgba(239, 68, 68, 0.3);
          }
        `;
      case 'status':
        return css`
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          &:hover {
            background: rgba(16, 185, 129, 0.3);
          }
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: white;
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `;
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

const PageButton = styled(motion.button)<{ active?: boolean }>`
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.active ? '#2d3748' : 'white'};
  cursor: pointer;
  font-weight: 600;
  
  &:hover {
    background: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;



// ============ MAIN COMPONENT ============
const ImprovedUsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedUsers, setSelectedUsers] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    status: 'all',
    role: 'all',
    registrationPeriod: 'all'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    inactive: 0,
    suspended: 0
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load users with advanced search
  const loadUsers = useCallback(async (query = searchQuery, filters = searchFilters) => {
    setLoading(true);
    try {
      // Convert advanced filters to API parameters
      const roleFilter = filters.role !== 'all' ? filters.role : '';
      const statusFilter = filters.status !== 'all' ? filters.status : '';
      
      const response = await userService.getUsers(
        currentPage, 
        10, 
        query, 
        roleFilter, 
        statusFilter
      );
      setUsers(response.users);
      setTotalPages(response.pagination.total_pages);
      
      // Load stats
      const statsResponse = await userService.getUserStats();
      setStats({
        total: statsResponse.total,
        active: statsResponse.active || 0,
        pending: statsResponse.pending || 0,
        inactive: statsResponse.inactive || 0,
        suspended: statsResponse.suspended || 0
      });
    } catch (error) {
      toast.error('Erro ao carregar usuários');
      console.error(error);
    }
    setLoading(false);
  }, [currentPage, searchQuery, searchFilters]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle user selection
  const handleSelectUser = (userId: number) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  // Handle status change
  const handleStatusChange = async (userId: number, status: UserStatus) => {
    try {
      await userService.updateUserStatus(userId, status);
      toast.success('Status atualizado com sucesso!');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao atualizar status');
    }
  };

  // Handle bulk status change
  const handleBulkStatusChange = async (status: UserStatus) => {
    if (selectedUsers.size === 0) return;

    try {
      await userService.bulkUpdateStatus(Array.from(selectedUsers), status);
      toast.success(`${selectedUsers.size} usuário(s) atualizados!`);
      setSelectedUsers(new Set());
      loadUsers();
    } catch (error) {
      toast.error('Erro ao atualizar usuários');
    }
  };

  // Handle bulk status change with specific user IDs (for StatusManager)
  const handleBulkStatusUpdateWithIds = async (userIds: number[], status: UserStatus) => {
    if (userIds.length === 0) return;

    try {
      await userService.bulkUpdateStatus(userIds, status);
      toast.success(`${userIds.length} usuário(s) atualizados!`);
      loadUsers();
    } catch (error) {
      toast.error('Erro ao atualizar usuários');
    }
  };

  // Handle advanced search
  const handleAdvancedSearch = useCallback((query: string, filters: SearchFilters) => {
    setSearchQuery(query);
    setSearchFilters(filters);
    setCurrentPage(1); // Reset to first page on new search
    loadUsers(query, filters);
  }, [loadUsers]);

  // Handle clear filters
  const handleClearFilters = useCallback(() => {
    const emptyFilters: SearchFilters = {
      status: 'all',
      role: 'all',
      registrationPeriod: 'all'
    };
    setSearchQuery('');
    setSearchFilters(emptyFilters);
    setCurrentPage(1);
    loadUsers('', emptyFilters);
  }, [loadUsers]);

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;

    if (window.confirm(`Tem certeza que deseja deletar ${selectedUsers.size} usuário(s)?`)) {
      try {
        await userService.bulkDelete(Array.from(selectedUsers));
        toast.success(`${selectedUsers.size} usuário(s) deletados!`);
        setSelectedUsers(new Set());
        loadUsers();
      } catch (error) {
        toast.error('Erro ao deletar usuários');
      }
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await userService.deleteUser(userId);
        toast.success('Usuário deletado com sucesso!');
        loadUsers();
      } catch (error) {
        toast.error('Erro ao deletar usuário');
      }
    }
  };



  // Get user initials
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Handle modal actions
  const handleCreateUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaveUser = () => {
    loadUsers();
  };

  return (
    <Container>
      <Header>
        <div>
          <Title>Gestão de Usuários</Title>
          <p style={{ margin: '5px 0 0 0', opacity: 0.8 }}>
            Sistema completo de gerenciamento com status avançados
          </p>
        </div>
        <HeaderActions>
          <Button variant="primary" size="md" onClick={handleCreateUser}>
            <Plus size={20} />
            Novo Usuário
          </Button>
          <Button variant="secondary" size="md">
            <Download size={20} />
            Exportar
          </Button>
          <Button 
            variant="secondary" 
            size="md"
            onClick={() => loadUsers()}
            disabled={loading}
          >
            <RefreshCw size={20} />
            Atualizar
          </Button>
        </HeaderActions>
      </Header>

      <StatsBar>
        <StatCard 
          color="#10b981"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total de Usuários</StatLabel>
        </StatCard>
        
        <StatCard 
          color="#16a34a"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Ativos</StatLabel>
        </StatCard>
        
        <StatCard 
          color="#f59e0b"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue>{stats.pending}</StatValue>
          <StatLabel>Pendentes</StatLabel>
        </StatCard>
        
        <StatCard 
          color="#6b7280"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue>{stats.inactive}</StatValue>
          <StatLabel>Inativos</StatLabel>
        </StatCard>
        
        <StatCard 
          color="#ef4444"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue>{stats.suspended}</StatValue>
          <StatLabel>Suspensos</StatLabel>
        </StatCard>
      </StatsBar>

      <StatusManager 
        users={users}
        onRefresh={loadUsers}
        onUserUpdate={handleStatusChange}
        onBulkUpdate={handleBulkStatusUpdateWithIds}
        selectedUsers={Array.from(selectedUsers)}
      />

      {/* Advanced Search Component */}
      <AdvancedSearch
        onSearch={handleAdvancedSearch}
        onClearFilters={handleClearFilters}
        totalResults={users.length}
        isLoading={loading}
      />

      <ControlsBar>
        <ViewToggle>
          <ViewButton
            active={viewMode === 'table'}
            onClick={() => setViewMode('table')}
          >
            <List size={16} />
          </ViewButton>
          <ViewButton
            active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
          </ViewButton>
        </ViewToggle>
      </ControlsBar>

      <AnimatePresence>
        {selectedUsers.size > 0 && (
          <BulkActions
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <BulkActionsLeft>
              <strong>{selectedUsers.size} usuário(s) selecionado(s)</strong>
            </BulkActionsLeft>
            <BulkActionsRight>
              <Button 
                variant="success" 
                size="sm"
                onClick={() => handleBulkStatusChange('active')}
              >
                <UserCheck size={16} />
                Ativar
              </Button>
              <Button 
                variant="warning" 
                size="sm"
                onClick={() => handleBulkStatusChange('pending')}
              >
                <Clock size={16} />
                Pendente
              </Button>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleBulkStatusChange('inactive')}
              >
                <UserX size={16} />
                Inativar
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={() => handleBulkStatusChange('suspended')}
              >
                <Ban size={16} />
                Suspender
              </Button>
              <Button 
                variant="danger" 
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 size={16} />
                Deletar
              </Button>
            </BulkActionsRight>
          </BulkActions>
        )}
      </AnimatePresence>

      {viewMode === 'table' ? (
        <UserTable>
          <TableHeader>
            <div>
              <Checkbox
                checked={selectedUsers.size === users.length && users.length > 0}
                onChange={handleSelectAll}
              />
            </div>
            <div>Usuário</div>
            <div>Contato</div>
            <div>Role</div>
            <div>Status</div>
            <div>Criado</div>
            <div>Ações</div>
          </TableHeader>
          
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              selected={selectedUsers.has(user.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <Checkbox
                  checked={selectedUsers.has(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                />
              </div>
              
              <UserInfo>
                <Avatar>{getUserInitials(user.name)}</Avatar>
                <UserDetails>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserDetails>
              </UserInfo>
              
              <div>
                {user.phone && (
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    {user.phone}
                  </div>
                )}
              </div>
              
              <div>
                <RoleBadge role={user.role}>{user.role}</RoleBadge>
              </div>
              
              <div>
                <StatusBadge status={user.status}>{user.status}</StatusBadge>
              </div>
              
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </div>
              
              <ActionButtons>
                <ActionButton 
                  variant="edit"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit size={14} />
                </ActionButton>
                
                <StatusToggle
                  userId={user.id}
                  currentStatus={user.status}
                  onStatusChange={handleStatusChange}
                />
                
                <ActionButton 
                  variant="delete"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 size={14} />
                </ActionButton>
              </ActionButtons>
            </TableRow>
          ))}
        </UserTable>
      ) : (
        <UsersGrid>
          {users.map((user, index) => (
            <UserCard
              key={user.id}
              selected={selectedUsers.has(user.id)}
              onClick={() => handleSelectUser(user.id)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <UserInfo style={{ marginBottom: '15px' }}>
                <Avatar>{getUserInitials(user.name)}</Avatar>
                <UserDetails>
                  <UserName>{user.name}</UserName>
                  <UserEmail>{user.email}</UserEmail>
                </UserDetails>
              </UserInfo>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <RoleBadge role={user.role}>{user.role}</RoleBadge>
                <StatusBadge status={user.status}>{user.status}</StatusBadge>
              </div>
              
              <ActionButtons>
                <ActionButton 
                  variant="edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditUser(user);
                  }}
                >
                  <Edit size={16} />
                </ActionButton>
                <div onClick={(e) => e.stopPropagation()}>
                  <StatusToggle
                    userId={user.id}
                    currentStatus={user.status}
                    onStatusChange={handleStatusChange}
                  />
                </div>
                <ActionButton 
                  variant="delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteUser(user.id);
                  }}
                >
                  <Trash2 size={16} />
                </ActionButton>
              </ActionButtons>
            </UserCard>
          ))}
        </UsersGrid>
      )}

      {/* Pagination */}
      <Pagination>
        <PageButton
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          ‹
        </PageButton>
        
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const page = Math.max(1, currentPage - 2) + i;
          if (page > totalPages) return null;
          
          return (
            <PageButton
              key={page}
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PageButton>
          );
        })}
        
        <PageButton
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          ›
        </PageButton>
      </Pagination>

      <UserModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveUser}
        user={selectedUser}
        mode={modalMode}
      />
    </Container>
  );
};

export default ImprovedUsersManagement;