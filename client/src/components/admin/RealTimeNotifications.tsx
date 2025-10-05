import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, X, CheckCircle, AlertTriangle, Info
} from 'lucide-react';



const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 350px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  
  @media (max-width: 768px) {
    width: 320px;
    right: 15px;
    top: 15px;
  }
  
  @media (max-width: 480px) {
    width: calc(100vw - 30px);
    right: 15px;
    left: 15px;
  }
`;

const NotificationPanel = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  color: #1f2937;
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const NotificationTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  border-radius: 4px;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const NotificationItem = styled(motion.div)<{ type: string }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  background: ${props => {
    switch (props.type) {
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'info': return 'rgba(59, 130, 246, 0.1)';
      default: return 'rgba(107, 114, 128, 0.1)';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
`;

const NotificationIcon = styled.div<{ type: string }>`
  color: ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  }};
  margin-top: 2px;
`;

const NotificationContent = styled.div`
  flex: 1;
`;

const NotificationText = styled.div`
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 4px;
`;

const NotificationTime = styled.div`
  font-size: 0.8rem;
  color: #6b7280;
`;

const NotificationBadge = styled.div`
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
`;

const FloatingButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  
  &:hover {
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 55px;
    height: 55px;
    bottom: 25px;
    right: 25px;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    bottom: 20px;
    right: 20px;
  }
`;

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'default';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const RealTimeNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Novo usuário cadastrado',
      message: 'Maria Silva se cadastrou na plataforma',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Evento quase lotado',
      message: 'Roda de Capoeira tem apenas 2 vagas restantes',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false
    },
    {
      id: '3',
      type: 'info',
      title: 'Meta de receita',
      message: 'Você atingiu 85% da meta mensal',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: false
    }
  ]);
  
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Simular novas notificações
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)] as any,
        title: generateRandomNotificationTitle(),
        message: generateRandomNotificationMessage(),
        timestamp: new Date(),
        read: false
      };
      
      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 30000); // Nova notificação a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  const generateRandomNotificationTitle = () => {
    const titles = [
      'Novo usuário cadastrado',
      'Pagamento aprovado',
      'Evento atualizado',
      'Meta atingida',
      'Inscrição confirmada',
      'Produto adicionado'
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const generateRandomNotificationMessage = () => {
    const messages = [
      'Um novo membro se juntou à academia',
      'Pagamento de mensalidade processado com sucesso',
      'Informações do evento foram atualizadas',
      'Parabéns! Você atingiu sua meta',
      'Nova inscrição para evento confirmada',
      'Novo produto adicionado ao catálogo'
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora';
    if (minutes < 60) return `${minutes}min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    return `${Math.floor(hours / 24)}d atrás`;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={16} />;
      case 'warning': return <AlertTriangle size={16} />;
      case 'info': return <Info size={16} />;
      default: return <Bell size={16} />;
    }
  };

  return (
    <>
      <FloatingButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <NotificationBadge
            style={{ position: 'absolute', top: '5px', right: '5px' }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </NotificationBadge>
        )}
      </FloatingButton>

      <AnimatePresence>
        {isOpen && (
          <NotificationContainer>
            <NotificationPanel
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <NotificationHeader>
                <NotificationTitle>
                  <Bell size={18} />
                  Notificações
                </NotificationTitle>
                <CloseButton onClick={() => setIsOpen(false)}>
                  <X size={18} />
                </CloseButton>
              </NotificationHeader>
              
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <NotificationItem
                    key={notification.id}
                    type={notification.type}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => markAsRead(notification.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <NotificationIcon type={notification.type}>
                      {getIcon(notification.type)}
                    </NotificationIcon>
                    <NotificationContent>
                      <NotificationText>
                        <strong>{notification.title}</strong>
                        <br />
                        {notification.message}
                      </NotificationText>
                      <NotificationTime>
                        {formatTime(notification.timestamp)}
                      </NotificationTime>
                    </NotificationContent>
                    {!notification.read && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                          marginTop: '6px'
                        }}
                      />
                    )}
                    <CloseButton
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                    >
                      <X size={14} />
                    </CloseButton>
                  </NotificationItem>
                ))}
              </AnimatePresence>
            </NotificationPanel>
          </NotificationContainer>
        )}
      </AnimatePresence>
    </>
  );
};

export default RealTimeNotifications;