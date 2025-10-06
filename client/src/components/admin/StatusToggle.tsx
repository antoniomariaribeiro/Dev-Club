import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, UserX, Clock, Ban, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import userService from '../../services/userService';

type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

interface StatusToggleProps {
  userId: number;
  currentStatus: UserStatus;
  onStatusChange: (userId: number, newStatus: UserStatus) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ============ STYLED COMPONENTS ============
const ToggleContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ToggleButton = styled(motion.button)<{ status: UserStatus; size: string }>`
  display: flex;
  align-items: center;
  gap: ${props => props.size === 'sm' ? '4px' : props.size === 'lg' ? '10px' : '6px'};
  padding: ${props => 
    props.size === 'sm' ? '4px 8px' : 
    props.size === 'lg' ? '12px 16px' : 
    '8px 12px'};
  border: none;
  border-radius: ${props => props.size === 'sm' ? '6px' : props.size === 'lg' ? '10px' : '8px'};
  font-size: ${props => 
    props.size === 'sm' ? '0.75rem' : 
    props.size === 'lg' ? '1rem' : 
    '0.85rem'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return css`
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1));
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        `;
      case 'inactive':
        return css`
          background: linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(107, 114, 128, 0.1));
          color: #6b7280;
          border: 1px solid rgba(107, 114, 128, 0.3);
        `;
      case 'pending':
        return css`
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'suspended':
        return css`
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    ${props => {
      switch (props.status) {
        case 'active':
          return css`
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(16, 185, 129, 0.15));
            border-color: rgba(16, 185, 129, 0.5);
          `;
        case 'inactive':
          return css`
            background: linear-gradient(135deg, rgba(107, 114, 128, 0.3), rgba(107, 114, 128, 0.15));
            border-color: rgba(107, 114, 128, 0.5);
          `;
        case 'pending':
          return css`
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.15));
            border-color: rgba(245, 158, 11, 0.5);
          `;
        case 'suspended':
          return css`
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.15));
            border-color: rgba(239, 68, 68, 0.5);
          `;
      }
    }}
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusIcon = styled.div<{ size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size === 'sm' ? '14px' : props.size === 'lg' ? '20px' : '16px'};
  height: ${props => props.size === 'sm' ? '14px' : props.size === 'lg' ? '20px' : '16px'};
`;

const StatusText = styled.span`
  text-transform: capitalize;
  white-space: nowrap;
`;

const DropdownArrow = styled(ChevronDown)<{ open: boolean; size: string }>`
  width: ${props => props.size === 'sm' ? '12px' : props.size === 'lg' ? '16px' : '14px'};
  height: ${props => props.size === 'sm' ? '12px' : props.size === 'lg' ? '16px' : '14px'};
  transition: transform 0.3s ease;
  transform: ${props => props.open ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const Dropdown = styled(motion.div)<{ size: string }>`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${props => props.size === 'sm' ? '8px' : props.size === 'lg' ? '12px' : '10px'};
  padding: ${props => props.size === 'sm' ? '6px' : props.size === 'lg' ? '10px' : '8px'};
  min-width: ${props => props.size === 'sm' ? '140px' : props.size === 'lg' ? '180px' : '160px'};
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const DropdownItem = styled(motion.button)<{ 
  status: UserStatus; 
  active: boolean;
  size: string;
}>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${props => props.size === 'sm' ? '6px' : props.size === 'lg' ? '10px' : '8px'};
  padding: ${props => 
    props.size === 'sm' ? '6px 8px' : 
    props.size === 'lg' ? '12px 14px' : 
    '9px 12px'};
  border: none;
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  color: ${props => {
    if (props.active) return '#ffd700';
    switch (props.status) {
      case 'active': return '#10b981';
      case 'inactive': return '#6b7280';
      case 'pending': return '#f59e0b';
      case 'suspended': return '#ef4444';
      default: return 'white';
    }
  }};
  border-radius: ${props => props.size === 'sm' ? '4px' : props.size === 'lg' ? '8px' : '6px'};
  cursor: pointer;
  font-size: ${props => 
    props.size === 'sm' ? '0.75rem' : 
    props.size === 'lg' ? '0.95rem' : 
    '0.85rem'};
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${props => props.active 
      ? 'rgba(255, 215, 0, 0.2)' 
      : 'rgba(255, 255, 255, 0.05)'};
  }
  
  &:not(:last-child) {
    margin-bottom: 2px;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ItemContent = styled.div`
  flex: 1;
`;

const ItemLabel = styled.div`
  font-weight: 500;
`;

const ItemDescription = styled.div<{ size: string }>`
  font-size: ${props => 
    props.size === 'sm' ? '0.65rem' : 
    props.size === 'lg' ? '0.8rem' : 
    '0.7rem'};
  opacity: 0.7;
  margin-top: 2px;
`;

const ActiveIndicator = styled(Check)<{ size: string }>`
  width: ${props => props.size === 'sm' ? '12px' : props.size === 'lg' ? '16px' : '14px'};
  height: ${props => props.size === 'sm' ? '12px' : props.size === 'lg' ? '16px' : '14px'};
  color: #ffd700;
`;

const LoadingSpinner = styled.div<{ size: string }>`
  display: inline-block;
  width: ${props => props.size === 'sm' ? '12px' : props.size === 'lg' ? '16px' : '14px'};
  height: ${props => props.size === 'sm' ? '12px' : props.size === 'lg' ? '16px' : '14px'};
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: currentColor;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

// ============ STATUS OPTIONS ============
const statusOptions = [
  {
    value: 'active' as UserStatus,
    label: 'Ativo',
    description: 'Usuário ativo no sistema',
    icon: UserCheck
  },
  {
    value: 'pending' as UserStatus,
    label: 'Pendente',
    description: 'Aguardando aprovação',
    icon: Clock
  },
  {
    value: 'inactive' as UserStatus,
    label: 'Inativo',
    description: 'Temporariamente inativo',
    icon: UserX
  },
  {
    value: 'suspended' as UserStatus,
    label: 'Suspenso',
    description: 'Suspenso do sistema',
    icon: Ban
  }
];

// ============ MAIN COMPONENT ============
const StatusToggle: React.FC<StatusToggleProps> = ({
  userId,
  currentStatus,
  onStatusChange,
  disabled = false,
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentOption = statusOptions.find(option => option.value === currentStatus);

  const handleStatusUpdate = async (newStatus: UserStatus) => {
    if (newStatus === currentStatus || loading || disabled) return;

    setLoading(true);
    setIsOpen(false);

    try {
      await userService.updateUserStatus(userId, newStatus);
      onStatusChange(userId, newStatus);
      toast.success(`Status atualizado para ${statusOptions.find(s => s.value === newStatus)?.label}!`);
    } catch (error) {
      toast.error('Erro ao atualizar status');
      console.error(error);
    }
    
    setLoading(false);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('[data-status-toggle]')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <ToggleContainer data-status-toggle>
      <ToggleButton
        status={currentStatus}
        size={size}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled || loading}
        whileHover={disabled || loading ? {} : { scale: 1.02 }}
        whileTap={disabled || loading ? {} : { scale: 0.98 }}
      >
        <StatusIcon size={size}>
          {loading ? (
            <LoadingSpinner size={size} />
          ) : (
            currentOption && <currentOption.icon size={size === 'sm' ? 12 : size === 'lg' ? 18 : 14} />
          )}
        </StatusIcon>
        <StatusText>{currentOption?.label}</StatusText>
        <DropdownArrow open={isOpen} size={size} />
      </ToggleButton>

      <AnimatePresence>
        {isOpen && !disabled && (
          <Dropdown
            size={size}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {statusOptions.map((option) => (
              <DropdownItem
                key={option.value}
                status={option.value}
                active={currentStatus === option.value}
                size={size}
                onClick={() => handleStatusUpdate(option.value)}
                disabled={loading}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <StatusIcon size={size}>
                  <option.icon size={size === 'sm' ? 12 : size === 'lg' ? 16 : 14} />
                </StatusIcon>
                <ItemContent>
                  <ItemLabel>{option.label}</ItemLabel>
                  <ItemDescription size={size}>{option.description}</ItemDescription>
                </ItemContent>
                {currentStatus === option.value && (
                  <ActiveIndicator size={size} />
                )}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </AnimatePresence>
    </ToggleContainer>
  );
};

export default StatusToggle;