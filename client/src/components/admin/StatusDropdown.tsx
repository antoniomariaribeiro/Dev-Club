import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Clock, 
  Ban
} from 'lucide-react';

type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

interface StatusDropdownProps {
  currentStatus: UserStatus;
  userId: number;
  onStatusChange: (userId: number, status: UserStatus) => void;
  disabled?: boolean;
}

// ============ STYLED COMPONENTS ============
const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownTrigger = styled(motion.button)<{ disabled?: boolean }>`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover {
    background: ${props => props.disabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.3)'};
  }
`;

const DropdownContent = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  background: rgba(45, 55, 72, 0.98);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 8px;
  min-width: 180px;
  z-index: 1000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  margin-top: 4px;
`;

const DropdownItem = styled(motion.button)<{ 
  status: UserStatus;
  isActive?: boolean; 
}>`
  width: 100%;
  padding: 10px 12px;
  border: none;
  background: ${props => props.isActive ? 'rgba(255, 215, 0, 0.15)' : 'transparent'};
  color: white;
  text-align: left;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.isActive ? 'rgba(255, 215, 0, 0.25)' : 'rgba(255, 255, 255, 0.1)'};
  }
  
  &:not(:last-child) {
    margin-bottom: 2px;
  }
`;

const StatusIcon = styled.div<{ status: UserStatus }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return `
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        `;
      case 'inactive':
        return `
          background: rgba(107, 114, 128, 0.2);
          color: #6b7280;
        `;
      case 'pending':
        return `
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        `;
      case 'suspended':
        return `
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
        `;
    }
  }}
`;

const StatusText = styled.span`
  flex: 1;
  text-transform: capitalize;
`;

const StatusDescription = styled.span`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 8px 0;
`;

const DropdownHeader = styled.div`
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 8px;
`;

// ============ COMPONENT ============
const StatusDropdown: React.FC<StatusDropdownProps> = ({
  currentStatus,
  userId,
  onStatusChange,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Status options with descriptions
  const statusOptions = [
    {
      value: 'active' as UserStatus,
      label: 'Ativo',
      description: 'Usuário ativo no sistema',
      icon: <UserCheck size={14} />
    },
    {
      value: 'pending' as UserStatus,
      label: 'Pendente',
      description: 'Aguardando aprovação',
      icon: <Clock size={14} />
    },
    {
      value: 'inactive' as UserStatus,
      label: 'Inativo',
      description: 'Usuário temporariamente inativo',
      icon: <UserX size={14} />
    },
    {
      value: 'suspended' as UserStatus,
      label: 'Suspenso',
      description: 'Usuário suspenso do sistema',
      icon: <Ban size={14} />
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleStatusSelect = (status: UserStatus) => {
    if (status !== currentStatus && !disabled) {
      onStatusChange(userId, status);
    }
    setIsOpen(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <DropdownContainer ref={dropdownRef}>
      <DropdownTrigger
        disabled={disabled}
        onClick={handleToggle}
        whileHover={disabled ? {} : { scale: 1.05 }}
        whileTap={disabled ? {} : { scale: 0.95 }}
      >
        <MoreVertical size={14} />
      </DropdownTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownContent
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            <DropdownHeader>
              Alterar Status
            </DropdownHeader>
            
            {statusOptions.map((option) => (
              <DropdownItem
                key={option.value}
                status={option.value}
                isActive={currentStatus === option.value}
                onClick={() => handleStatusSelect(option.value)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                disabled={currentStatus === option.value}
              >
                <StatusIcon status={option.value}>
                  {option.icon}
                </StatusIcon>
                <div style={{ flex: 1 }}>
                  <StatusText>{option.label}</StatusText>
                  <div>
                    <StatusDescription>{option.description}</StatusDescription>
                  </div>
                </div>
                {currentStatus === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: '#ffd700' 
                    }}
                  />
                )}
              </DropdownItem>
            ))}
            
            <Divider />
            
            <DropdownItem
              status="inactive"
              onClick={() => setIsOpen(false)}
              style={{ 
                opacity: 0.7, 
                fontSize: '0.8rem',
                justifyContent: 'center',
                cursor: 'default'
              }}
            >
              <StatusText>Cancelar</StatusText>
            </DropdownItem>
          </DropdownContent>
        )}
      </AnimatePresence>
    </DropdownContainer>
  );
};

export default StatusDropdown;