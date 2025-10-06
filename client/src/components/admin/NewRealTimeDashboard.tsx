import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, DollarSign, ArrowUpRight,
  UserPlus, ShoppingCart, Target, Wifi, RotateCw, Zap
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import dashboardService, { DashboardStats, Activity as ActivityType } from '../../services/dashboardService';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// ============ ANIMATIONS ============
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// ============ STYLED COMPONENTS ============
const DashboardContainer = styled.div`
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
  ${css`animation: ${fadeIn} 0.8s ease-out;`}
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const HeaderLeft = styled.div``;

const MainTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.8;
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

const RefreshButton = styled(motion.button)`
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    &:hover { transform: none; }
  }
`;

const SpinningIcon = styled.div<{ loading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.loading && css`animation: ${spin} 1s linear infinite;`}
`;

const StatusIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 0.9rem;
`;

const StatusDot = styled.div<{ isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isOnline ? '#10b981' : '#ef4444'};
  ${props => props.isOnline && css`animation: ${pulse} 2s infinite;`}
`;

// Métricas Cards
const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  position: relative;
  overflow: hidden;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(45deg, #ffd700, #ffed4e);
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: ${props => `linear-gradient(45deg, ${props.color}, ${props.color}dd)`};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 25px ${props => `${props.color}40`};
`;

const MetricContent = styled.div`
  flex: 1;
  text-align: right;
`;

const MetricValue = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 5px;
`;

const MetricLabel = styled.div`
  font-size: 0.95rem;
  opacity: 0.8;
  font-weight: 500;
`;

const MetricChange = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: 10px;
  color: ${props => props.isPositive ? '#10b981' : '#ef4444'};
`;

// Gráficos
const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
`;

const ChartTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  color: #ffd700;
`;

const ChartContainer = styled.div`
  height: 300px;
  canvas {
    max-height: 100% !important;
  }
`;

// Atividade em Tempo Real
const ActivitySection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActivityCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
`;

const ActivityHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`;

const ActivityTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  color: #ffd700;
`;

const AutoRefreshToggle = styled.button<{ active: boolean }>`
  padding: 8px 12px;
  background: ${props => props.active ? 'linear-gradient(45deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(45deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.2)'};
  }
`;

const ActivityList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.5);
    border-radius: 3px;
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
  
  ${props => {
    switch (props.type) {
      case 'user':
        return 'background: linear-gradient(45deg, #3b82f6, #2563eb);';
      case 'event':
        return 'background: linear-gradient(45deg, #10b981, #059669);';
      case 'sale':
        return 'background: linear-gradient(45deg, #f59e0b, #d97706);';
      default:
        return 'background: rgba(255, 255, 255, 0.1);';
    }
  }}
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 3px;
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  opacity: 0.6;
`;

// Performance Metrics
const PerformanceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const PerformanceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
`;

const PerformanceValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffd700;
  margin-bottom: 5px;
`;

const PerformanceLabel = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
`;

// ============ COMPONENT ============
const NewRealTimeDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalEvents: 0,
    totalProducts: 0,
    totalContacts: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    newUsersThisMonth: 0,
    activeEvents: 0,
    revenue: 0,
    totalSales: 0,
    onlineUsers: 0,
    todayVisits: 0,
    conversionRate: 0,
    averageSessionTime: 0,
    weeklyRevenue: 0,
    dailyRevenue: 0,
    monthlyUsers: 0,
    weeklyUsers: 0,
    dailyUsers: 0,
    usersByStatus: {
      active: 0,
      inactive: 0,
      pending: 0
    },
    usersByRole: {
      user: 0,
      instructor: 0,
      member: 0
    },
    growth: {
      users: 0,
      events: 0,
      revenue: 0
    }
  });
  
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  
  // Dados dos gráficos
  const [chartData, setChartData] = useState({
    users: { labels: [], data: [] },
    sales: { labels: [], data: [] },
    events: { labels: [], data: [] }
  });

  // ============ FUNÇÕES ============
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Buscar estatísticas
      const statsData = await dashboardService.getDashboardStats();
      setStats(statsData);
      
      // Buscar atividade recente
      const activitiesData = await dashboardService.getRecentActivity();
      setActivities(activitiesData);
      
      // Buscar dados dos gráficos
      const usersChart = await dashboardService.getChartData('users', '7d');
      const salesChart = await dashboardService.getChartData('sales', '7d');
      const eventsChart = await dashboardService.getChartData('events', '7d');
      
      setChartData({
        users: usersChart,
        sales: salesChart,
        events: eventsChart
      });
      
      setLastUpdate(new Date());
      setIsOnline(true);
      
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setError('Erro ao carregar dados');
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };

  // ============ EFEITOS ============
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh a cada 30 segundos
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  // Verificar conexão
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ============ CONFIGURAÇÕES DOS GRÁFICOS ============
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      y: {
        ticks: { color: 'white' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  const lineChartData = {
    labels: chartData.users.labels,
    datasets: [
      {
        label: 'Novos Usuários',
        data: chartData.users.data,
        borderColor: '#ffd700',
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const doughnutData = {
    labels: ['Alunos', 'Instrutores', 'Administradores'],
    datasets: [{
      data: [stats.totalUsers * 0.7, stats.totalUsers * 0.25, stats.totalUsers * 0.05],
      backgroundColor: ['#10b981', '#3b82f6', '#ffd700'],
      borderWidth: 0
    }]
  };

  // ============ RENDER ============
  return (
    <DashboardContainer>
      <Header>
        <HeaderLeft>
          <MainTitle>🎯 Dashboard em Tempo Real</MainTitle>
          <Subtitle>
            Monitoramento ao vivo • Última atualização: {lastUpdate.toLocaleTimeString('pt-BR')}
          </Subtitle>
        </HeaderLeft>
        
        <HeaderRight>
          <StatusIndicator>
            <StatusDot isOnline={isOnline} />
            <span>{isOnline ? 'Online' : 'Offline'}</span>
            <Wifi size={16} />
          </StatusIndicator>
          
          <RefreshButton
            onClick={fetchDashboardData}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SpinningIcon loading={loading}>
              <RotateCw size={16} />
            </SpinningIcon>
            Atualizar
          </RefreshButton>
        </HeaderRight>
      </Header>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'linear-gradient(45deg, #ef4444, #dc2626)',
            padding: '15px 20px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}
        >
          ⚠️ {error} - Os dados podem não estar atualizados
        </motion.div>
      )}

      {/* Métricas Principais */}
      <MetricsGrid>
        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MetricHeader>
            <MetricIcon color="#10b981">
              <Users size={28} />
            </MetricIcon>
            <MetricContent>
              <MetricValue>{loading ? '...' : stats.totalUsers.toLocaleString()}</MetricValue>
              <MetricLabel>Total de Usuários</MetricLabel>
            </MetricContent>
          </MetricHeader>
          <MetricChange isPositive={true}>
            <ArrowUpRight size={14} />
            +{stats.onlineUsers} online agora
          </MetricChange>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricHeader>
            <MetricIcon color="#3b82f6">
              <Calendar size={28} />
            </MetricIcon>
            <MetricContent>
              <MetricValue>{loading ? '...' : stats.activeEvents}</MetricValue>
              <MetricLabel>Eventos Ativos</MetricLabel>
            </MetricContent>
          </MetricHeader>
          <MetricChange isPositive={true}>
            <ArrowUpRight size={14} />
            Crescimento mensal
          </MetricChange>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <MetricHeader>
            <MetricIcon color="#f59e0b">
              <DollarSign size={28} />
            </MetricIcon>
            <MetricContent>
              <MetricValue>
                R$ {loading ? '...' : (stats.revenue / 1000).toFixed(1)}k
              </MetricValue>
              <MetricLabel>Receita do Mês</MetricLabel>
            </MetricContent>
          </MetricHeader>
          <MetricChange isPositive={true}>
            <ArrowUpRight size={14} />
            {stats.conversionRate}% conversão
          </MetricChange>
        </MetricCard>

        <MetricCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <MetricHeader>
            <MetricIcon color="#ef4444">
              <Target size={28} />
            </MetricIcon>
            <MetricContent>
              <MetricValue>{loading ? '...' : stats.totalSales}</MetricValue>
              <MetricLabel>Vendas Realizadas</MetricLabel>
            </MetricContent>
          </MetricHeader>
          <MetricChange isPositive={true}>
            <ArrowUpRight size={14} />
            {stats.todayVisits} visitas hoje
          </MetricChange>
        </MetricCard>
      </MetricsGrid>

      {/* Gráficos */}
      <ChartsSection>
        <ChartCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartTitle>📈 Crescimento de Usuários (7 dias)</ChartTitle>
          <ChartContainer>
            <Line data={lineChartData} options={chartOptions} />
          </ChartContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartTitle>👥 Distribuição por Perfil</ChartTitle>
          <ChartContainer>
            <Doughnut 
              data={doughnutData} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'bottom',
                    labels: { color: 'white', padding: 20 }
                  }
                }
              }} 
            />
          </ChartContainer>
        </ChartCard>
      </ChartsSection>

      {/* Atividade e Performance */}
      <ActivitySection>
        <ActivityCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ActivityHeader>
            <ActivityTitle>⚡ Atividade em Tempo Real</ActivityTitle>
            <AutoRefreshToggle active={autoRefresh} onClick={toggleAutoRefresh}>
              <Zap size={14} />
              {autoRefresh ? 'Auto' : 'Manual'}
            </AutoRefreshToggle>
          </ActivityHeader>
          
          <ActivityList>
            {activities.map((activity, index) => (
              <ActivityItem
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ActivityIcon type={activity.type}>
                  {activity.type === 'user' && <UserPlus size={20} />}
                  {activity.type === 'event' && <Calendar size={20} />}
                  {activity.type === 'sale' && <ShoppingCart size={20} />}
                </ActivityIcon>
                <ActivityContent>
                  <ActivityText>{activity.message}</ActivityText>
                  <ActivityTime>{activity.time}</ActivityTime>
                </ActivityContent>
              </ActivityItem>
            ))}
          </ActivityList>
        </ActivityCard>

        <ActivityCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ActivityHeader>
            <ActivityTitle>🚀 Performance do Sistema</ActivityTitle>
          </ActivityHeader>
          
          <PerformanceGrid>
            <PerformanceCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 }}
            >
              <PerformanceValue>{Math.round(stats.averageSessionTime / 60)}min</PerformanceValue>
              <PerformanceLabel>Tempo Médio de Sessão</PerformanceLabel>
            </PerformanceCard>
            
            <PerformanceCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 }}
            >
              <PerformanceValue>{stats.conversionRate}%</PerformanceValue>
              <PerformanceLabel>Taxa de Conversão</PerformanceLabel>
            </PerformanceCard>
            
            <PerformanceCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 }}
            >
              <PerformanceValue>98.5%</PerformanceValue>
              <PerformanceLabel>Uptime do Sistema</PerformanceLabel>
            </PerformanceCard>
            
            <PerformanceCard
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
            >
              <PerformanceValue>24ms</PerformanceValue>
              <PerformanceLabel>Tempo de Resposta</PerformanceLabel>
            </PerformanceCard>
          </PerformanceGrid>
        </ActivityCard>
      </ActivitySection>
    </DashboardContainer>
  );
};

export default NewRealTimeDashboard;