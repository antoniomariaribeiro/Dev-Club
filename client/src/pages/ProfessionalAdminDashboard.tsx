import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, ShoppingCart, TrendingUp, Clock, 
  DollarSign, AlertTriangle,
  BarChart3, PieChart, Bell, Image
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ============ TIPOS ============
interface DashboardStats {
  users: {
    total: number;
    active: number;
    new: number;
    byGraduation: { [key: string]: number };
  };
  events: {
    total: number;
    upcoming: number;
    thisMonth: number;
    attendance: number;
  };
  products: {
    total: number;
    inStock: number;
    lowStock: number;
    revenue: number;
  };
  financial: {
    monthlyRevenue: number;
    yearlyRevenue: number;
    pendingPayments: number;
    growthRate: number;
  };
}

// ============ STYLED COMPONENTS ============
const DashboardContainer = styled(motion.div)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  
  h1 {
    font-size: 2.5rem;
    margin: 0;
    background: linear-gradient(45deg, #fff, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
`;

const ActionButton = styled(motion.button)`
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
  font-weight: 500;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffd700;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #fff;
`;

const StatSubtitle = styled.div`
  font-size: 0.9rem;
  opacity: 0.7;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-height: 300px;
`;

const RecentActivity = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ActivityItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid #ffd700;
`;

const ActivityTime = styled.span`
  font-size: 0.8rem;
  opacity: 0.7;
  min-width: 60px;
`;

// ============ DADOS MOCK ============
const mockStats: DashboardStats = {
  users: {
    total: 156,
    active: 134,
    new: 12,
    byGraduation: {
      'Iniciante': 45,
      'Batizado': 38,
      'Graduado': 34,
      'Formado': 28,
      'Professor': 11
    }
  },
  events: {
    total: 28,
    upcoming: 5,
    thisMonth: 8,
    attendance: 89
  },
  products: {
    total: 67,
    inStock: 54,
    lowStock: 8,
    revenue: 15420
  },
  financial: {
    monthlyRevenue: 18750,
    yearlyRevenue: 187500,
    pendingPayments: 3250,
    growthRate: 12.5
  }
};

const recentActivities = [
  { id: 1, type: 'user', message: 'João Silva se inscreveu no evento "Roda de Capoeira"', time: '2min' },
  { id: 2, type: 'sale', message: 'Venda de berimbau Premium - R$ 450,00', time: '15min' },
  { id: 3, type: 'event', message: 'Novo evento "Batizado 2025" criado', time: '1h' },
  { id: 4, type: 'user', message: 'Maria Santos atualizou perfil', time: '2h' },
  { id: 5, type: 'product', message: 'Estoque baixo: Cordão Amarelo (3 unidades)', time: '3h' }
];

// ============ COMPONENTE PRINCIPAL ============
const ProfessionalAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [loading, setLoading] = useState(false);
  // Simular carregamento de dados
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setStats(mockStats);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);



  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <div>
          <h1>🥋 Dashboard Administrativo</h1>
          <p style={{ margin: 0, opacity: 0.8 }}>
            Bem-vindo, {user?.name || 'Administrador'}
          </p>
        </div>
        
        <QuickActions>
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.alert('Funcionalidade em desenvolvimento')}
          >
            <Users size={16} />
            Usuários
          </ActionButton>
          
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.alert('Funcionalidade em desenvolvimento')}
          >
            <Calendar size={16} />
            Eventos
          </ActionButton>
          
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.alert('Funcionalidade em desenvolvimento')}
          >
            <ShoppingCart size={16} />
            Produtos
          </ActionButton>
          
          <ActionButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.alert('Funcionalidade em desenvolvimento')}
          >
            <Image size={16} />
            Galeria
          </ActionButton>
        </QuickActions>
      </Header>

      {/* Cards de Estatísticas */}
      <StatsGrid>
        <StatCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <StatHeader>
            <StatTitle>Alunos Ativos</StatTitle>
            <StatIcon>
              <Users size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{loading ? '...' : stats.users.total}</StatValue>
          <StatSubtitle>
            <TrendingUp size={14} />
            +{stats.users.new} novos este mês
          </StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatTitle>Eventos Ativos</StatTitle>
            <StatIcon>
              <Calendar size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{loading ? '...' : stats.events.total}</StatValue>
          <StatSubtitle>
            <Clock size={14} />
            {stats.events.upcoming} próximos eventos
          </StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatTitle>Receita Mensal</StatTitle>
            <StatIcon>
              <DollarSign size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>
            {loading ? '...' : `R$ ${stats.financial.monthlyRevenue.toLocaleString()}`}
          </StatValue>
          <StatSubtitle>
            <TrendingUp size={14} />
            +{stats.financial.growthRate}% vs mês anterior
          </StatSubtitle>
        </StatCard>

        <StatCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatTitle>Produtos em Estoque</StatTitle>
            <StatIcon>
              <ShoppingCart size={20} />
            </StatIcon>
          </StatHeader>
          <StatValue>{loading ? '...' : stats.products.total}</StatValue>
          <StatSubtitle>
            <AlertTriangle size={14} style={{ color: '#ff6b6b' }} />
            {stats.products.lowStock} com estoque baixo
          </StatSubtitle>
        </StatCard>
      </StatsGrid>

      {/* Seção de Gráficos */}
      <ChartsSection>
        <ChartCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} />
            Evolução de Alunos
          </h3>
          <div style={{ 
            height: '200px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            border: '2px dashed rgba(255,255,255,0.2)'
          }}>
            📊 Gráfico de Evolução de Alunos<br/>
            <small style={{ opacity: 0.7 }}>Em desenvolvimento</small>
          </div>
        </ChartCard>

        <ChartCard
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PieChart size={20} />
            Distribuição por Graduação
          </h3>
          <div style={{ 
            height: '200px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '10px',
            border: '2px dashed rgba(255,255,255,0.2)'
          }}>
            🎯 Gráfico de Graduações<br/>
            <small style={{ opacity: 0.7 }}>Em desenvolvimento</small>
          </div>
        </ChartCard>
      </ChartsSection>

      {/* Atividades Recentes */}
      <RecentActivity
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
      >
        <h3 style={{ margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={20} />
          Atividades Recentes
        </h3>
        
        <AnimatePresence>
          {recentActivities.map((activity, index) => (
            <ActivityItem
              key={activity.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <ActivityTime>{activity.time}</ActivityTime>
              <div>{activity.message}</div>
            </ActivityItem>
          ))}
        </AnimatePresence>
      </RecentActivity>
    </DashboardContainer>
  );
};

export default ProfessionalAdminDashboard;