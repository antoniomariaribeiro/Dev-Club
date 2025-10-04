import React, { createContext, useContext, useState, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../utils/icons';

// Tipos de notificação
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Styled Components
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
  width: 100%;

  @media (max-width: 480px) {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    max-width: none;
  }
`;

const NotificationCard = styled(motion.div)<{ $type: NotificationType }>`
  background: white;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-left: 4px solid ${props => 
    props.$type === 'success' ? '#10b981' :
    props.$type === 'error' ? '#ef4444' :
    props.$type === 'warning' ? '#f59e0b' : '#3b82f6'};
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  backdrop-filter: blur(10px);
  animation: ${slideIn} 0.3s ease-out;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => 
      props.$type === 'success' ? '#10b981' :
      props.$type === 'error' ? '#ef4444' :
      props.$type === 'warning' ? '#f59e0b' : '#3b82f6'};
    animation: ${props => props.$type !== 'error' ? 'progress 5s linear' : 'none'};
  }

  @keyframes progress {
    from { transform: scaleX(1); }
    to { transform: scaleX(0); }
  }

  &.exiting {
    animation: ${slideOut} 0.3s ease-in;
  }
`;

const IconContainer = styled.div<{ $type: NotificationType }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => 
    props.$type === 'success' ? '#10b981' :
    props.$type === 'error' ? '#ef4444' :
    props.$type === 'warning' ? '#f59e0b' : '#3b82f6'};
  background: ${props => 
    props.$type === 'success' ? '#10b98110' :
    props.$type === 'error' ? '#ef444410' :
    props.$type === 'warning' ? '#f59e0b10' : '#3b82f610'};
  flex-shrink: 0;
  margin-top: 0.2rem;
`;

const NotificationContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NotificationTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
`;

const NotificationMessage = styled.p`
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
`;

const ActionButton = styled.button<{ $type: NotificationType }>`
  background: none;
  border: 1px solid ${props => 
    props.$type === 'success' ? '#10b981' :
    props.$type === 'error' ? '#ef4444' :
    props.$type === 'warning' ? '#f59e0b' : '#3b82f6'};
  color: ${props => 
    props.$type === 'success' ? '#10b981' :
    props.$type === 'error' ? '#ef4444' :
    props.$type === 'warning' ? '#f59e0b' : '#3b82f6'};
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => 
      props.$type === 'success' ? '#10b981' :
      props.$type === 'error' ? '#ef4444' :
      props.$type === 'warning' ? '#f59e0b' : '#3b82f6'};
    color: white;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  margin-top: 0.1rem;
  flex-shrink: 0;

  &:hover {
    color: #6b7280;
    background: #f3f4f6;
  }
`;

// Hook personalizado
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      ...notificationData,
      id,
      duration: notificationData.duration ?? (notificationData.type === 'error' ? 0 : 5000)
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove se tiver duração definida
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }
  }, [removeNotification]);

  const success = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'success', title, message, duration });
  }, [addNotification]);

  const error = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'error', title, message, duration });
  }, [addNotification]);

  const warning = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'warning', title, message, duration });
  }, [addNotification]);

  const info = useCallback((title: string, message: string, duration?: number) => {
    addNotification({ type: 'info', title, message, duration });
  }, [addNotification]);

    const getIcon = (type: NotificationType) => {
      switch (type) {
        case 'success': 
          return <Icons.FiCheckCircle />;
        case 'error': 
          return <Icons.FiAlertCircle />;
        case 'warning': 
          return <Icons.FiAlertTriangle />;
        case 'info': 
          return <Icons.FiInfo />;
        default: 
          return <Icons.FiInfo />;
      }
    };  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        removeNotification, 
        success, 
        error, 
        warning, 
        info 
      }}
    >
      {children}
      
      <NotificationContainer>
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              $type={notification.type}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <IconContainer $type={notification.type}>
                {getIcon(notification.type)}
              </IconContainer>
              
              <NotificationContent>
                <NotificationTitle>{notification.title}</NotificationTitle>
                <NotificationMessage>{notification.message}</NotificationMessage>
                
                {notification.action && (
                  <ActionButton 
                    $type={notification.type}
                    onClick={notification.action.onClick}
                  >
                    {notification.action.label}
                  </ActionButton>
                )}
              </NotificationContent>
              
              <CloseButton onClick={() => removeNotification(notification.id)}>
                <Icons.FiX size={16} />
              </CloseButton>
            </NotificationCard>
          ))}
        </AnimatePresence>
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;