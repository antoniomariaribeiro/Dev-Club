import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck, UserX, Clock, Ban, Users,
  CheckCircle, RotateCcw
} from 'lucide-react';
import toast from 'react-hot-toast';
import userService, { User } from '../../services/userService';

type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

interface StatusOption {
  value: UserStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface StatusManagerProps {
  users: User[];
  onRefresh: () => void;
  onUserUpdate: (userId: number, newStatus: UserStatus) => void;
  onBulkUpdate: (userIds: number[], newStatus: UserStatus) => void;
  selectedUsers: number[];
  className?: string;
}

// ============ STYLED COMPONENTS ============
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const StatusCard = styled(motion.div)<{ status: UserStatus }>`
  position: relative;
  background: ${props => {
    switch (props.status) {
      case 'active': return 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05))';
      case 'inactive': return 'linear-gradient(135deg, rgba(107, 114, 128, 0.15), rgba(107, 114, 128, 0.05))';
      case 'pending': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.05))';
      case 'suspended': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'active': return 'rgba(16, 185, 129, 0.3)';
      case 'inactive': return 'rgba(107, 114, 128, 0.3)';
      case 'pending': return 'rgba(245, 158, 11, 0.3)';
      case 'suspended': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    border-color: ${props => {
      switch (props.status) {
        case 'active': return 'rgba(16, 185, 129, 0.6)';
        case 'inactive': return 'rgba(107, 114, 128, 0.6)';
        case 'pending': return 'rgba(245, 158, 11, 0.6)';
        case 'suspended': return 'rgba(239, 68, 68, 0.6)';
        default: return 'rgba(255, 255, 255, 0.3)';
      }
    }};
  }
`;

const StatusIcon = styled.div<{ status: UserStatus }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  background: ${props => {
    switch (props.status) {
      case 'active': return 'rgba(16, 185, 129, 0.2)';
      case 'inactive': return 'rgba(107, 114, 128, 0.2)';
      case 'pending': return 'rgba(245, 158, 11, 0.2)';
      case 'suspended': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return 'white';
    }
  }};
`;

const StatusInfo = styled.div`
  flex: 1;
`;

const StatusLabel = styled.h4`
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const StatusCount = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 8px 0 4px 0;
  color: white;
`;

const StatusDescription = styled.p`
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.7;
  color: white;
`;

const BulkActions = styled(motion.div)`
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
  animation: ${slideIn} 0.3s ease;
`;

const BulkActionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const BulkActionsTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: white;
`;

const BulkActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

const BulkActionButton = styled(motion.button)<{ status: UserStatus }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => {
    switch (props.status) {
      case 'active': return 'rgba(16, 185, 129, 0.2)';
      case 'inactive': return 'rgba(107, 114, 128, 0.2)';
      case 'pending': return 'rgba(245, 158, 11, 0.2)';
      case 'suspended': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return 'white';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'active': return 'rgba(16, 185, 129, 0.3)';
      case 'inactive': return 'rgba(107, 114, 128, 0.3)';
      case 'pending': return 'rgba(245, 158, 11, 0.3)';
      case 'suspended': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  
  &:hover {
    background: ${props => {
      switch (props.status) {
        case 'active': return 'rgba(16, 185, 129, 0.3)';
        case 'inactive': return 'rgba(107, 114, 128, 0.3)';
        case 'pending': return 'rgba(245, 158, 11, 0.3)';
        case 'suspended': return 'rgba(239, 68, 68, 0.3)';
        default: return 'rgba(255, 255, 255, 0.2)';
      }
    }};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const QuickFilters = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const FilterButton = styled(motion.button)<{ active: boolean; status?: UserStatus }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => props.active ? css`
    background: ${props.status ? (() => {
      switch (props.status) {
        case 'active': return 'rgba(16, 185, 129, 0.2)';
        case 'inactive': return 'rgba(107, 114, 128, 0.2)';
        case 'pending': return 'rgba(245, 158, 11, 0.2)';
        case 'suspended': return 'rgba(239, 68, 68, 0.2)';
        default: return 'rgba(59, 130, 246, 0.2)';
      }
    })() : 'rgba(59, 130, 246, 0.2)'};
    color: ${props.status ? (() => {
      switch (props.status) {
        case 'active': return '#10b981';
        case 'inactive': return '#6b7280';
        case 'pending': return '#f59e0b';
        case 'suspended': return '#ef4444';
        default: return '#3b82f6';
      }
    })() : '#3b82f6'};
    border: 1px solid ${props.status ? (() => {
      switch (props.status) {
        case 'active': return 'rgba(16, 185, 129, 0.4)';
        case 'inactive': return 'rgba(107, 114, 128, 0.4)';
        case 'pending': return 'rgba(245, 158, 11, 0.4)';
        case 'suspended': return 'rgba(239, 68, 68, 0.4)';
        default: return 'rgba(59, 130, 246, 0.4)';
      }
    })() : 'rgba(59, 130, 246, 0.4)'};
  ` : css`
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
  `}
  
  &:hover {
    background: ${props => props.active 
      ? (props.status ? (() => {
          switch (props.status) {
            case 'active': return 'rgba(16, 185, 129, 0.3)';
            case 'inactive': return 'rgba(107, 114, 128, 0.3)';
            case 'pending': return 'rgba(245, 158, 11, 0.3)';
            case 'suspended': return 'rgba(239, 68, 68, 0.3)';
            default: return 'rgba(59, 130, 246, 0.3)';
          }
        })() : 'rgba(59, 130, 246, 0.3)')
      : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: linear-gradient(45deg, #3b82f6, #2563eb);
          color: white;
        `;
      case 'danger':
        return css`
          background: linear-gradient(45deg, #ef4444, #dc2626);
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
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ============ STATUS OPTIONS ============
const statusOptions: StatusOption[] = [
  {
    value: 'active',
    label: 'Ativo',
    description: 'Usuários ativos no sistema',
    icon: <UserCheck size={20} />,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)'
  },
  {
    value: 'pending',
    label: 'Pendente',
    description: 'Aguardando aprovação',
    icon: <Clock size={20} />,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)'
  },
  {
    value: 'inactive',
    label: 'Inativo',
    description: 'Usuários temporariamente inativos',
    icon: <UserX size={20} />,
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)'
  },
  {
    value: 'suspended',
    label: 'Suspenso',
    description: 'Usuários suspensos do sistema',
    icon: <Ban size={20} />,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)'
  }
];

// ============ MAIN COMPONENT ============
const StatusManager: React.FC<StatusManagerProps> = ({
  users,
  onRefresh,
  onUserUpdate,
  onBulkUpdate,
  selectedUsers,
  className
}) => {
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [statusStats, setStatusStats] = useState({
    active: 0,
    pending: 0,
    inactive: 0,
    suspended: 0
  });

  // Calculate status statistics
  useEffect(() => {
    const stats = users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, { active: 0, pending: 0, inactive: 0, suspended: 0 });
    
    setStatusStats(stats);
  }, [users]);

  // Handle bulk status change
  const handleBulkStatusChange = async (newStatus: UserStatus) => {
    if (selectedUsers.length === 0) {
      toast.error('Selecione pelo menos um usuário');
      return;
    }

    setLoading(true);
    try {
      await userService.bulkUpdateStatus(selectedUsers, newStatus);
      onBulkUpdate(selectedUsers, newStatus);
      toast.success(`${selectedUsers.length} usuário(s) atualizados para ${statusOptions.find(s => s.value === newStatus)?.label}!`);
    } catch (error) {
      toast.error('Erro ao atualizar usuários em massa');
      console.error(error);
    }
    setLoading(false);
  };

  // Filter users by status
  const filteredUsers = statusFilter === 'all' 
    ? users 
    : users.filter(user => user.status === statusFilter);

  return (
    <Container className={className}>
      <Header>
        <Title>
          <Users size={20} />
          Gerenciamento de Status
        </Title>
        <ActionButton onClick={onRefresh} disabled={loading}>
          {loading ? <LoadingSpinner /> : <RotateCcw size={16} />}
          Atualizar
        </ActionButton>
      </Header>

      {/* Status Statistics */}
      <StatusGrid>
        {statusOptions.map((option, index) => (
          <StatusCard
            key={option.value}
            status={option.value}
            onClick={() => setStatusFilter(statusFilter === option.value ? 'all' : option.value)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <StatusIcon status={option.value}>
              {option.icon}
            </StatusIcon>
            <StatusInfo>
              <StatusLabel>{option.label}</StatusLabel>
              <StatusCount>{statusStats[option.value]}</StatusCount>
              <StatusDescription>{option.description}</StatusDescription>
            </StatusInfo>
          </StatusCard>
        ))}
      </StatusGrid>

      {/* Quick Filters */}
      <QuickFilters>
        <FilterButton
          active={statusFilter === 'all'}
          onClick={() => setStatusFilter('all')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Users size={14} />
          Todos ({users.length})
        </FilterButton>
        {statusOptions.map(option => (
          <FilterButton
            key={option.value}
            active={statusFilter === option.value}
            status={option.value}
            onClick={() => setStatusFilter(statusFilter === option.value ? 'all' : option.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {option.icon}
            {option.label} ({statusStats[option.value]})
          </FilterButton>
        ))}
      </QuickFilters>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <BulkActions
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BulkActionsHeader>
              <BulkActionsTitle>
                <CheckCircle size={16} />
                {selectedUsers.length} usuário(s) selecionado(s)
              </BulkActionsTitle>
            </BulkActionsHeader>
            
            <BulkActionsGrid>
              {statusOptions.map(option => (
                <BulkActionButton
                  key={option.value}
                  status={option.value}
                  onClick={() => handleBulkStatusChange(option.value)}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {option.icon}
                  {option.label}
                </BulkActionButton>
              ))}
            </BulkActionsGrid>
          </BulkActions>
        )}
      </AnimatePresence>

      {/* Status Info */}
      {statusFilter !== 'all' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            background: statusOptions.find(s => s.value === statusFilter)?.bgColor,
            border: `1px solid ${statusOptions.find(s => s.value === statusFilter)?.color}33`,
            color: 'white',
            fontSize: '0.9rem'
          }}
        >
          <strong>Filtro Ativo:</strong> Mostrando {filteredUsers.length} usuário(s) com status "{statusOptions.find(s => s.value === statusFilter)?.label}"
        </motion.div>
      )}
    </Container>
  );
};

export default StatusManager;