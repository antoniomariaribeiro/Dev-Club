import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, ShoppingCart, TrendingUp, 
  Eye, Clock, UserPlus, Wifi, RotateCw
} from 'lucide-react';
import { adminService } from '../../services/admin';
import DashboardCharts from './DashboardCharts';
import RealTimeNotifications from './RealTimeNotifications';
import AdvancedMetrics from './AdvancedMetrics';
import AdvancedFilters from './AdvancedFiltersComponent';

// Animações
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;



// Styled Components
const DashboardContainer = styled(motion.div)`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    margin-bottom: 20px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  backdrop-filter: blur(10px);
`;

const StatusDot = styled.div<{ isOnline: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#10b981' : '#ef4444'};
  animation: ${props => props.isOnline ? pulse : 'none'} 2s infinite;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 10px;
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StatIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const StatChange = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: ${props => props.isPositive ? '#10b981' : '#ef4444'};
  margin-top: 10px;
`;

const RealtimeSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const ActivityFeed = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 20px;
`;

const ActivityTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
`;

const AutoRefresh = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 5px;
  opacity: 0.7;
  transition: all 0.3s ease;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div<{ type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  background: ${props => {
    switch(props.type) {
      case 'user': return '#3b82f6';
      case 'event': return '#10b981';
      case 'sale': return '#f59e0b';
      default: return '#6b7280';
    }
  }};
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.95rem;
  margin-bottom: 5px;
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  opacity: 0.6;
`;

const QuickStats = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const QuickStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
`;

// Interfaces
interface DashboardStats {
  totalUsers: number;
  activeEvents: number;
  totalSales: number;
  revenue: number;
  todayVisits: number;
  onlineUsers: number;
  newRegistrations: number;
  pendingOrders: number;
}

interface Activity {
  id: string;
  type: 'user' | 'event' | 'sale';
  message: string;
  timestamp: Date;
  user?: string;
}

const RealTimeDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeEvents: 0,
    totalSales: 0,
    revenue: 0,
    todayVisits: 0,
    onlineUsers: 0,
    newRegistrations: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'user',
      message: 'Novo usuário cadastrado: João Silva',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      user: 'João Silva'
    },
    {
      id: '2',
      type: 'event',
      message: 'Inscrição confirmada no evento "Roda de Capoeira"',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
      id: '3',
      type: 'sale',
      message: 'Nova venda: Cordão Dourado - R$ 45,00',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
    },
    {
      id: '4',
      type: 'user',
      message: 'Login realizado: Maria Santos',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      user: 'Maria Santos'
    }
  ]);

  const [isOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Buscar dados reais do dashboard
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      
      // Mapear dados da API para interface local
      setStats({
        totalUsers: data.totalUsers || 0,
        activeEvents: data.activeEvents || 0,
        totalSales: data.totalProducts || 0, // Usando produtos como proxy para vendas
        revenue: data.totalRevenue || 0,
        todayVisits: Math.floor(Math.random() * 1000) + 500, // Mock para visitas
        onlineUsers: Math.floor(Math.random() * 50) + 10, // Mock para usuários online
        newRegistrations: data.newUsersThisMonth || 0,
        pendingOrders: Math.floor(Math.random() * 20) + 5 // Mock para pedidos pendentes
      });
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas:', err);
      setError('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Simular atualizações em tempo real
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      // Simular novas atividades
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: ['user', 'event', 'sale'][Math.floor(Math.random() * 3)] as any,
        message: generateRandomActivity(),
        timestamp: new Date()
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 9)]);

      // Simular mudanças nas estatísticas
      setStats(prev => ({
        ...prev,
        onlineUsers: prev.onlineUsers + Math.floor(Math.random() * 3) - 1,
        todayVisits: prev.todayVisits + Math.floor(Math.random() * 5),
        newRegistrations: prev.newRegistrations + (Math.random() > 0.8 ? 1 : 0),
      }));

      setLastUpdate(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const generateRandomActivity = (): string => {
    const activities = [
      'Nova inscrição no evento "Batizado 2025"',
      'Usuário visualizou galeria de fotos',
      'Venda realizada: Berimbau Premium - R$ 120,00',
      'Novo comentário no evento',
      'Login realizado no sistema',
      'Download de certificado',
      'Pagamento confirmado via PIX'
    ];
    return activities[Math.floor(Math.random() * activities.length)];
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Agora mesmo';
    if (minutes === 1) return 'há 1 minuto';
    if (minutes < 60) return `há ${minutes} minutos`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return 'há 1 hora';
    return `há ${hours} horas`;
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  const handleRefresh = async () => {
    await fetchDashboardStats();
  };

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <Title>Dashboard em Tempo Real</Title>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleRefresh}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            disabled={loading}
          >
            <RotateCw 
              size={14} 
              style={{ 
                animation: loading ? `${spin} 1s linear infinite` : 'none' 
              }} 
            />
            Atualizar
          </button>
          <StatusIndicator>
            <StatusDot isOnline={isOnline} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            <Wifi size={16} />
          </StatusIndicator>
        </div>
      </Header>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px',
          color: '#ef4444'
        }}>
          ❌ {error}
        </div>
      )}

      <StatsGrid>
        <StatCard
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StatHeader>
            <StatIcon color="#3b82f6">
              <Users />
            </StatIcon>
            <div style={{ textAlign: 'right' }}>
              <StatValue>{loading ? '...' : stats.totalUsers.toLocaleString()}</StatValue>
              <StatLabel>Usuários Totais</StatLabel>
            </div>
          </StatHeader>
          <StatChange isPositive={true}>
            <TrendingUp size={14} />
            +{stats.newRegistrations} hoje
          </StatChange>
        </StatCard>

        <StatCard
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StatHeader>
            <StatIcon color="#10b981">
              <Eye />
            </StatIcon>
            <div style={{ textAlign: 'right' }}>
              <StatValue>{loading ? '...' : stats.onlineUsers}</StatValue>
              <StatLabel>Usuários Online</StatLabel>
            </div>
          </StatHeader>
          <StatChange isPositive={true}>
            <UserPlus size={14} />
            {stats.todayVisits} visitas hoje
          </StatChange>
        </StatCard>

        <StatCard
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StatHeader>
            <StatIcon color="#f59e0b">
              <Calendar />
            </StatIcon>
            <div style={{ textAlign: 'right' }}>
              <StatValue>{loading ? '...' : stats.activeEvents}</StatValue>
              <StatLabel>Eventos Ativos</StatLabel>
            </div>
          </StatHeader>
          <StatChange isPositive={true}>
            <Clock size={14} />
            3 eventos esta semana
          </StatChange>
        </StatCard>

        <StatCard
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <StatHeader>
            <StatIcon color="#ef4444">
              <ShoppingCart />
            </StatIcon>
            <div style={{ textAlign: 'right' }}>
              <StatValue>R$ {loading ? '...' : (stats.revenue / 1000).toFixed(1)}k</StatValue>
              <StatLabel>Receita Total</StatLabel>
            </div>
          </StatHeader>
          <StatChange isPositive={true}>
            <TrendingUp size={14} />
            +{stats.pendingOrders} pedidos pendentes
          </StatChange>
        </StatCard>
      </StatsGrid>

      <RealtimeSection>
        <ActivityFeed
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ActivityHeader>
            <ActivityTitle>Atividade em Tempo Real</ActivityTitle>
            <AutoRefresh onClick={toggleAutoRefresh}>
              <RotateCw style={{ animation: autoRefresh ? 'spin 2s linear infinite' : 'none' }} />
              {autoRefresh ? 'Auto' : 'Manual'}
            </AutoRefresh>
          </ActivityHeader>
          
          <AnimatePresence>
            {activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActivityIcon type={activity.type}>
                  {activity.type === 'user' && <Users />}
                  {activity.type === 'event' && <Calendar />}
                  {activity.type === 'sale' && <ShoppingCart />}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.message}</ActivityText>
                  <ActivityTime>{formatTime(activity.timestamp)}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </AnimatePresence>
        </ActivityFeed>

        <QuickStats
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ActivityTitle style={{ marginBottom: '20px' }}>Resumo Rápido</ActivityTitle>
          
          <QuickStatItem>
            <span>Última atualização</span>
            <span>{lastUpdate.toLocaleTimeString()}</span>
          </QuickStatItem>
          
          <QuickStatItem>
            <span>Novos usuários hoje</span>
            <span style={{ color: '#10b981' }}>+{stats.newRegistrations}</span>
          </QuickStatItem>
          
          <QuickStatItem>
            <span>Taxa de conversão</span>
            <span>3.4%</span>
          </QuickStatItem>
          
          <QuickStatItem>
            <span>Tempo médio online</span>
            <span>12min 34s</span>
          </QuickStatItem>
          
          <QuickStatItem>
            <span>Eventos desta semana</span>
            <span style={{ color: '#f59e0b' }}>3</span>
          </QuickStatItem>
          
          <QuickStatItem>
            <span>Pedidos pendentes</span>
            <span style={{ color: '#ef4444' }}>{stats.pendingOrders}</span>
          </QuickStatItem>
        </QuickStats>
      </RealtimeSection>

      {/* Filtros Avançados */}
      <AdvancedFilters 
        onFiltersChange={(filters) => {
          console.log('Filtros aplicados:', filters);
          // Aqui você pode implementar a lógica para filtrar os dados
        }}
        showUserFilters={true}
        showEventFilters={true}
        showDateFilters={true}
      />

      {/* Métricas Avançadas */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ 
          color: 'white', 
          marginBottom: '20px', 
          fontSize: '1.8rem',
          background: 'linear-gradient(45deg, #fff, #e0e7ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📈 Métricas Avançadas
        </h2>
        <AdvancedMetrics stats={{
          totalUsers: stats.totalUsers,
          activeEvents: stats.activeEvents,
          revenue: stats.revenue,
          newRegistrations: stats.newRegistrations
        }} />
      </div>

      {/* Seção de Gráficos */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ 
          color: 'white', 
          marginBottom: '20px', 
          fontSize: '1.8rem',
          background: 'linear-gradient(45deg, #fff, #e0e7ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📊 Análises e Gráficos
        </h2>
        <DashboardCharts stats={{
          totalUsers: stats.totalUsers,
          activeEvents: stats.activeEvents,
          totalSales: stats.totalSales,
          revenue: stats.revenue,
          newRegistrations: stats.newRegistrations
        }} />
      </div>

      {/* Sistema de Notificações */}
      <RealTimeNotifications />
    </DashboardContainer>
  );
};

export default RealTimeDashboard;