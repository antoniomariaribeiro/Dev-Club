import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 280px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const SidebarTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const RoomList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
`;

const RoomItem = styled(motion.div)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const RoomIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  font-weight: 600;
  font-size: 1.1rem;
`;

const RoomInfo = styled.div`
  flex: 1;
`;

const RoomName = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

const RoomMembers = styled.div`
  font-size: 0.875rem;
  opacity: 0.7;
`;

const OnlineUsers = styled.div`
  padding: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const OnlineTitle = styled.h3`
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const OnlineUser = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
`;

const UserStatus = styled.div<{ status: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.5rem;
  background: ${props => {
    switch(props.status) {
      case 'online': return '#4CAF50';
      case 'away': return '#FF9800';
      default: return '#9E9E9E';
    }
  }};
`;

const UserName = styled.span`
  color: white;
  font-size: 0.875rem;
`;

const ChatMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChatTitle = styled.h1`
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const ChatDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0 0 0;
  font-size: 0.875rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled(motion.div)<{ isOwn?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  ${props => props.isOwn && 'flex-direction: row-reverse;'}
`;

const MessageAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const MessageContent = styled.div<{ isOwn?: boolean }>`
  max-width: 70%;
`;

const MessageHeader = styled.div<{ isOwn?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  ${props => props.isOwn && 'justify-content: flex-end;'}
`;

const MessageAuthor = styled.span`
  color: white;
  font-weight: 500;
  font-size: 0.875rem;
`;

const MessageTime = styled.span`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
`;

const MessageBubble = styled.div<{ isOwn?: boolean }>`
  background: ${props => props.isOwn ? 
    'linear-gradient(45deg, #667eea, #764ba2)' : 
    'rgba(255, 255, 255, 0.15)'
  };
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  ${props => props.isOwn ? 'border-top-right-radius: 0.25rem;' : 'border-top-left-radius: 0.25rem;'}
  padding: 0.75rem 1rem;
  color: white;
  word-wrap: break-word;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const MessageInput = styled.div`
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const InputContainer = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-end;
`;

const Input = styled.textarea`
  flex: 1;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  resize: none;
  min-height: 44px;
  max-height: 120px;
  outline: none;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.25);
  }
`;

const SendButton = styled(motion.button)`
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 2rem;
  font-style: italic;
`;

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  members_count: number;
  last_activity: string;
}

interface ChatMessage {
  id: number;
  room_id: string;
  user_id: number;
  user_name: string;
  message: string;
  timestamp: string;
  type: string;
}

interface ChatOnlineUser {
  user_id: number;
  user_name: string;
  status: 'online' | 'away' | 'offline';
  room_id: string | null;
}

const Chat: React.FC = () => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<ChatOnlineUser[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock user (normalmente viria do contexto de auth)
  const currentUser = {
    id: 1,
    name: "Antonio Maria"
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/rooms');
      const data = await response.json();
      
      if (data.success) {
        setRooms(data.data);
        if (data.data.length > 0 && !activeRoom) {
          setActiveRoom(data.data[0]);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
    }
  }, [activeRoom]);

  const fetchMessages = useCallback(async (roomId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/rooms/${roomId}/messages`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    }
  }, []);

  const fetchOnlineUsers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5000/api/chat/online-users');
      const data = await response.json();
      
      if (data.success) {
        setOnlineUsers(data.data);
      }
    } catch (error) {
      console.error('Erro ao carregar usuários online:', error);
    }
  }, []);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeRoom) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/rooms/${activeRoom.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          user_id: currentUser.id,
          user_name: currentUser.name
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, data.data]);
        setMessageText('');
        scrollToBottom();
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };

  const handleRoomChange = (room: ChatRoom) => {
    setActiveRoom(room);
    fetchMessages(room.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchRooms(),
        fetchOnlineUsers()
      ]);
      setLoading(false);
    };

    loadInitialData();
  }, [fetchRooms, fetchOnlineUsers]);

  useEffect(() => {
    if (activeRoom) {
      fetchMessages(activeRoom.id);
    }
  }, [activeRoom, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling para atualizações (em produção usar WebSockets)
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeRoom) {
        fetchMessages(activeRoom.id);
      }
      fetchOnlineUsers();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeRoom, fetchMessages, fetchOnlineUsers]);

  if (loading) {
    return (
      <ChatContainer>
        <LoadingMessage>
          Carregando chat...
        </LoadingMessage>
      </ChatContainer>
    );
  }

  return (
    <ChatContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Chat</SidebarTitle>
        </SidebarHeader>
        
        <RoomList>
          {rooms.map((room) => (
            <RoomItem
              key={room.id}
              active={activeRoom?.id === room.id}
              onClick={() => handleRoomChange(room)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RoomIcon>
                {room.name.charAt(0).toUpperCase()}
              </RoomIcon>
              <RoomInfo>
                <RoomName>{room.name}</RoomName>
                <RoomMembers>{room.members_count} membros</RoomMembers>
              </RoomInfo>
            </RoomItem>
          ))}
        </RoomList>

        <OnlineUsers>
          <OnlineTitle>Online ({onlineUsers.filter(u => u.status === 'online').length})</OnlineTitle>
          {onlineUsers.map((user) => (
            <OnlineUser key={user.user_id}>
              <UserStatus status={user.status} />
              <UserName>{user.user_name}</UserName>
            </OnlineUser>
          ))}
        </OnlineUsers>
      </Sidebar>

      <ChatMain>
        <ChatHeader>
          <ChatTitle>{activeRoom?.name || 'Selecione uma sala'}</ChatTitle>
          {activeRoom && (
            <ChatDescription>{activeRoom.description}</ChatDescription>
          )}
        </ChatHeader>

        <MessagesContainer>
          <AnimatePresence>
            {messages.map((message) => {
              const isOwn = message.user_id === currentUser.id;
              return (
                <Message
                  key={message.id}
                  isOwn={isOwn}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <MessageAvatar>
                    {message.user_name.charAt(0).toUpperCase()}
                  </MessageAvatar>
                  <MessageContent isOwn={isOwn}>
                    <MessageHeader isOwn={isOwn}>
                      <MessageAuthor>{message.user_name}</MessageAuthor>
                      <MessageTime>{formatTime(message.timestamp)}</MessageTime>
                    </MessageHeader>
                    <MessageBubble isOwn={isOwn}>
                      {message.message}
                    </MessageBubble>
                  </MessageContent>
                </Message>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </MessagesContainer>

        <MessageInput>
          <InputContainer onSubmit={sendMessage}>
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              rows={1}
            />
            <SendButton
              type="submit"
              disabled={!messageText.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ➤
            </SendButton>
          </InputContainer>
        </MessageInput>
      </ChatMain>
    </ChatContainer>
  );
};

export default Chat;