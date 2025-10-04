import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin';


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
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
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
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
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

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f8f9fa;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f9fa;
  }

  &:hover {
    background: #e3f2fd;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007bff, #0056b3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.status === 'active' ? '#d4edda' : '#f8d7da'};
  color: ${props => props.status === 'active' ? '#155724' : '#721c24'};
`;

const RoleBadge = styled.span<{ role: 'admin' | 'student' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.role === 'admin' ? '#fff3cd' : '#d1ecf1'};
  color: ${props => props.role === 'admin' ? '#856404' : '#0c5460'};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'warning' }>`
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.5rem;
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
      default:
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
    }
  }}
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button<{ active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border: 1px solid #dee2e6;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#495057'};
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  max-width: 500px;
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

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
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

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &.error {
    border-color: #dc3545;
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

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e5e5;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      default:
        return `
          background: #f8f9fa;
          color: #333;
          border: 1px solid #ddd;
          &:hover { background: #e9ecef; }
        `;
    }
  }}
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
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

// Skeleton Components
const SkeletonCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  animation: pulse 1.5s ease-in-out infinite alternate;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }
`;

const SkeletonLine = styled.div<{ width?: string; height?: string }>`
  background: #e9ecef;
  border-radius: 4px;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '16px'};
  margin-bottom: 0.5rem;
  animation: pulse 1.5s ease-in-out infinite alternate;
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    100% { opacity: 1; }
  }
`;

const SkeletonTable = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SkeletonTableRow = styled.div`
  display: grid;
  grid-template-columns: 50px 2fr 2fr 1fr 1fr 1.5fr 2fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f1f1;
  
  &:last-child {
    border-bottom: none;
  }
`;

// Bulk Actions
const BulkActionsBar = styled.div<{ visible: boolean }>`
  position: sticky;
  top: 0;
  background: #007bff;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transform: ${props => props.visible ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${props => props.visible ? 1 : 0};
  transition: all 0.3s ease;
  z-index: 10;
`;

const BulkActionsLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BulkActionsRight = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const BulkActionButton = styled.button<{ variant?: 'danger' | 'warning' }>`
  background: ${props => {
    switch (props.variant) {
      case 'danger': return '#dc3545';
      case 'warning': return '#ffc107';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  color: ${props => props.variant === 'warning' ? '#333' : 'white'};
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => {
      switch (props.variant) {
        case 'danger': return '#c82333';
        case 'warning': return '#e0a800';
        default: return 'rgba(255, 255, 255, 0.3)';
      }
    }};
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student';
  is_active: boolean;
  phone?: string;
  created_at: string;
}

interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  students: number;
}

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'student';
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    phone: '',
    role: 'student'
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Toast states
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  // Loading states
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  
  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  // Bulk selection states
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

  // Helper functions
  const showToast = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    const toast: ToastMessage = { id, type, message };
    
    setToasts(prev => [...prev, toast]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);

  const validateForm = useCallback((data: UserFormData): FormErrors => {
    const errors: FormErrors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Nome é obrigatório';
    } else if (data.name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }
    
    if (!data.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Email inválido';
    }
    
    if (data.phone && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(data.phone)) {
      errors.phone = 'Telefone deve estar no formato (xx) xxxxx-xxxx';
    }
    
    return errors;
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'student'
    });
    setFormErrors({});
  }, []);

  const loadUsers = React.useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const filters = {
        page: currentPage,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(roleFilter && { role: roleFilter as 'admin' | 'student' }),
        ...(statusFilter && { status: statusFilter })
      };

      const response = await adminService.getUsers(filters);
      setUsers(response.users);
      setTotalPages(response.pagination.total_pages);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      showToast('error', 'Erro ao carregar usuários');
    } finally {
      setIsLoadingUsers(false);
    }
  }, [currentPage, debouncedSearch, roleFilter, statusFilter, showToast]);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await adminService.getUserStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      showToast('error', 'Erro ao carregar estatísticas');
    } finally {
      setIsLoadingStats(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Debounce search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to first page when search changes
  useEffect(() => {
    if (debouncedSearch !== search) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, search]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await adminService.createUser(formData);
      showToast('success', 'Usuário criado com sucesso!');
      setShowAddModal(false);
      resetForm();
      loadUsers();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      showToast('error', error.response?.data?.message || 'Erro ao criar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await adminService.updateUser(editingUser.id, formData);
      showToast('success', 'Usuário atualizado com sucesso!');
      setShowEditModal(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao editar usuário:', error);
      showToast('error', error.response?.data?.message || 'Erro ao editar usuário');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role
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
    setEditingUser(null);
    resetForm();
  };

  // Bulk selection functions
  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setIsSelectAllChecked(checked);
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkActivate = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      await Promise.all(
        selectedUsers.map(userId => 
          adminService.updateUser(userId, { is_active: true })
        )
      );
      
      showToast('success', `${selectedUsers.length} usuários ativados com sucesso!`);
      setSelectedUsers([]);
      setIsSelectAllChecked(false);
      loadUsers();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao ativar usuários:', error);
      showToast('error', 'Erro ao ativar usuários em lote');
    }
  };

  const handleBulkDeactivate = async () => {
    if (selectedUsers.length === 0) return;
    
    try {
      await Promise.all(
        selectedUsers.map(userId => 
          adminService.updateUser(userId, { is_active: false })
        )
      );
      
      showToast('success', `${selectedUsers.length} usuários desativados com sucesso!`);
      setSelectedUsers([]);
      setIsSelectAllChecked(false);
      loadUsers();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao desativar usuários:', error);
      showToast('error', 'Erro ao desativar usuários em lote');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) return;
    
    const confirmed = window.confirm(
      `Tem certeza que deseja deletar ${selectedUsers.length} usuários? Esta ação não pode ser desfeita.`
    );
    
    if (!confirmed) return;
    
    try {
      await Promise.all(
        selectedUsers.map(userId => 
          adminService.deleteUser(userId)
        )
      );
      
      showToast('success', `${selectedUsers.length} usuários deletados com sucesso!`);
      setSelectedUsers([]);
      setIsSelectAllChecked(false);
      loadUsers();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao deletar usuários:', error);
      showToast('error', 'Erro ao deletar usuários em lote');
    }
  };

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await adminService.updateUser(userId, {
        is_active: !currentStatus
      });
      showToast('success', `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      loadUsers();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      showToast('error', error.response?.data?.message || 'Erro ao alterar status do usuário');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await adminService.deleteUser(userId);
        showToast('success', 'Usuário deletado com sucesso!');
        loadUsers();
        loadStats();
      } catch (error: any) {
        console.error('Erro ao deletar usuário:', error);
        showToast('error', error.response?.data?.message || 'Erro ao deletar usuário');
      }
    }
  };

  return (
    <Container>
      {/* Stats Cards */}
      <StatsCards>
        {isLoadingStats ? (
          // Skeleton for stats
          <>
            {[1, 2, 3, 4].map(i => (
              <SkeletonCard key={i}>
                <SkeletonLine height="24px" width="60%" />
                <SkeletonLine height="16px" width="80%" />
              </SkeletonCard>
            ))}
          </>
        ) : stats ? (
          <>
            <StatCard
              style={{ borderLeftColor: '#007bff' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatNumber style={{ color: '#007bff' }}>{stats.total}</StatNumber>
              <StatLabel>Total de Usuários</StatLabel>
            </StatCard>
            
            <StatCard
              style={{ borderLeftColor: '#28a745' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatNumber style={{ color: '#28a745' }}>{stats.active}</StatNumber>
              <StatLabel>Usuários Ativos</StatLabel>
            </StatCard>
            
            <StatCard
              style={{ borderLeftColor: '#ffc107' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatNumber style={{ color: '#ffc107' }}>{stats.admins}</StatNumber>
              <StatLabel>Administradores</StatLabel>
            </StatCard>
            
            <StatCard
              style={{ borderLeftColor: '#17a2b8' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <StatNumber style={{ color: '#17a2b8' }}>{stats.students}</StatNumber>
              <StatLabel>Alunos</StatLabel>
            </StatCard>
          </>
        ) : null}
      </StatsCards>

      <ControlsBar>
        <SearchInput
          type="text"
          placeholder="Buscar usuários..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <FilterSelect
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Todos os Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Aluno</option>
        </FilterSelect>
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </FilterSelect>
        
        <AddButton onClick={openAddModal}>
          <span>+</span>
          Novo Usuário
        </AddButton>
      </ControlsBar>

      {/* Bulk Actions Bar */}
      <BulkActionsBar visible={selectedUsers.length > 0}>
        <BulkActionsLeft>
          <span>{selectedUsers.length} usuário(s) selecionado(s)</span>
        </BulkActionsLeft>
        <BulkActionsRight>
          <BulkActionButton onClick={handleBulkActivate}>
            Ativar Selecionados
          </BulkActionButton>
          <BulkActionButton variant="warning" onClick={handleBulkDeactivate}>
            Desativar Selecionados
          </BulkActionButton>
          <BulkActionButton variant="danger" onClick={handleBulkDelete}>
            Deletar Selecionados
          </BulkActionButton>
          <BulkActionButton onClick={() => {setSelectedUsers([]); setIsSelectAllChecked(false);}}>
            Cancelar
          </BulkActionButton>
        </BulkActionsRight>
      </BulkActionsBar>

      <TableContainer>
        {isLoadingUsers ? (
          // Skeleton for table
          <SkeletonTable>
            <SkeletonTableRow>
              <SkeletonLine height="16px" width="16px" />
              <SkeletonLine height="16px" />
              <SkeletonLine height="16px" />
              <SkeletonLine height="16px" />
              <SkeletonLine height="16px" />
              <SkeletonLine height="16px" />
              <SkeletonLine height="16px" />
            </SkeletonTableRow>
            {[1, 2, 3, 4, 5].map(i => (
              <SkeletonTableRow key={i}>
                <SkeletonLine height="16px" width="16px" />
                <SkeletonLine height="20px" />
                <SkeletonLine height="20px" />
                <SkeletonLine height="20px" width="60%" />
                <SkeletonLine height="20px" width="50%" />
                <SkeletonLine height="20px" />
                <SkeletonLine height="20px" />
              </SkeletonTableRow>
            ))}
          </SkeletonTable>
        ) : (
          <Table>
            <TableHeader>
              <tr>
                <TableHeaderCell>
                  <Checkbox
                    checked={isSelectAllChecked}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </TableHeaderCell>
                <TableHeaderCell>Usuário</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Data Cadastro</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => handleSelectUser(user.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <UserAvatar>
                        {user.name.charAt(0).toUpperCase()}
                      </UserAvatar>
                      <div>
                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                        {user.phone && (
                          <div style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <RoleBadge role={user.role}>{user.role}</RoleBadge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.is_active ? 'active' : 'inactive'}>
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <ActionButton onClick={() => openEditModal(user)}>Editar</ActionButton>
                    <ActionButton 
                      variant="warning"
                      onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                    >
                      {user.is_active ? 'Desativar' : 'Ativar'}
                    </ActionButton>
                    <ActionButton 
                      variant="danger"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Deletar
                    </ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </TableContainer>

      {totalPages > 1 && (
        <Pagination>
          <PaginationButton 
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </PaginationButton>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <PaginationButton
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationButton>
          ))}
          
          <PaginationButton 
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </PaginationButton>
        </Pagination>
      )}

      {/* Modal de Adicionar Usuário */}
      {showAddModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closeModals()}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ModalHeader>
              <ModalTitle>Adicionar Novo Usuário</ModalTitle>
              <CloseButton onClick={closeModals}>×</CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleCreateUser}>
              <ModalBody>
                <FormGroup>
                  <FormLabel htmlFor="name">Nome *</FormLabel>
                  <FormInput
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="email">Email *</FormLabel>
                  <FormInput
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="phone">Telefone</FormLabel>
                  <FormInput
                    id="phone"
                    type="tel"
                    placeholder="(xx) xxxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && <ErrorMessage>{formErrors.phone}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="role">Tipo de Usuário *</FormLabel>
                  <FormSelect
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'student' }))}
                  >
                    <option value="student">Aluno</option>
                    <option value="admin">Administrador</option>
                  </FormSelect>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button type="button" onClick={closeModals}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Criando...
                    </>
                  ) : (
                    'Criar Usuário'
                  )}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de Editar Usuário */}
      {showEditModal && editingUser && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && closeModals()}
        >
          <ModalContent
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <ModalHeader>
              <ModalTitle>Editar Usuário</ModalTitle>
              <CloseButton onClick={closeModals}>×</CloseButton>
            </ModalHeader>
            
            <form onSubmit={handleEditUser}>
              <ModalBody>
                <FormGroup>
                  <FormLabel htmlFor="edit-name">Nome *</FormLabel>
                  <FormInput
                    id="edit-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={formErrors.name ? 'error' : ''}
                  />
                  {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="edit-email">Email *</FormLabel>
                  <FormInput
                    id="edit-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className={formErrors.email ? 'error' : ''}
                  />
                  {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="edit-phone">Telefone</FormLabel>
                  <FormInput
                    id="edit-phone"
                    type="tel"
                    placeholder="(xx) xxxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className={formErrors.phone ? 'error' : ''}
                  />
                  {formErrors.phone && <ErrorMessage>{formErrors.phone}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="edit-role">Tipo de Usuário *</FormLabel>
                  <FormSelect
                    id="edit-role"
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'student' }))}
                  >
                    <option value="student">Aluno</option>
                    <option value="admin">Administrador</option>
                  </FormSelect>
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <Button type="button" onClick={closeModals}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      Salvando...
                    </>
                  ) : (
                    'Salvar Alterações'
                  )}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
        >
          {toast.message}
        </Toast>
      ))}
    </Container>
  );
};

export default AdminUsers;