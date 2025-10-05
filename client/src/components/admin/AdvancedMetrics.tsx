import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Target, Clock, Users,
  Activity, BarChart3
} from 'lucide-react';

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin: 30px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin: 20px 0;
  }
`;

const MetricCard = styled(motion.div)<{ gradient: string }>`
  background: ${props => props.gradient};
  border-radius: 15px;
  padding: 25px;
  color: white;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.05);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
`;

const MetricHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const MetricIcon = styled.div<{ bg: string }>`
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const MetricValue = styled.div`
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 15px;
`;

const MetricFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const MetricChange = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.isPositive ? '#10f981' : '#ff5757'};
  font-weight: 600;
`;

const MetricProgress = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
  margin: 10px 0;
`;

const ProgressBar = styled(motion.div)<{ color: string }>`
  height: 100%;
  background: ${props => props.color};
  border-radius: 2px;
`;

const KPIGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin: 20px 0;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
`;

const KPICard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const KPIValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 8px;
`;

const KPILabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

interface AdvancedMetricsProps {
  stats: {
    totalUsers: number;
    activeEvents: number;
    revenue: number;
    newRegistrations: number;
  };
}

const AdvancedMetrics: React.FC<AdvancedMetricsProps> = ({ stats }) => {
  const [metrics, setMetrics] = useState({
    conversionRate: 3.4,
    averageSessionTime: 12.5,
    customerRetention: 87.2,
    growthRate: 15.8,
    satisfaction: 94.7,
    activeRate: 68.3
  });

  useEffect(() => {
    // Simular atualizações das métricas
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        conversionRate: prev.conversionRate + (Math.random() - 0.5) * 0.2,
        averageSessionTime: prev.averageSessionTime + (Math.random() - 0.5) * 1,
        customerRetention: Math.max(70, Math.min(95, prev.customerRetention + (Math.random() - 0.5) * 2)),
        growthRate: Math.max(0, prev.growthRate + (Math.random() - 0.5) * 3),
        satisfaction: Math.max(80, Math.min(100, prev.satisfaction + (Math.random() - 0.5) * 1)),
        activeRate: Math.max(50, Math.min(80, prev.activeRate + (Math.random() - 0.5) * 2))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MetricsContainer>
        {/* Taxa de Conversão */}
        <MetricCard
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>{metrics.conversionRate.toFixed(1)}%</MetricValue>
              <MetricLabel>Taxa de Conversão</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Target size={20} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#10f981" 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.conversionRate / 10) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <TrendingUp size={12} />
              +0.8% este mês
            </MetricChange>
            <span>Meta: 5%</span>
          </MetricFooter>
        </MetricCard>

        {/* Tempo Médio de Sessão */}
        <MetricCard
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>{metrics.averageSessionTime.toFixed(1)}min</MetricValue>
              <MetricLabel>Tempo Médio de Sessão</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Clock size={20} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#f59e0b" 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.averageSessionTime / 20) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <TrendingUp size={12} />
              +2.1min esta semana
            </MetricChange>
            <span>Ótimo!</span>
          </MetricFooter>
        </MetricCard>

        {/* Retenção de Clientes */}
        <MetricCard
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>{metrics.customerRetention.toFixed(1)}%</MetricValue>
              <MetricLabel>Retenção de Clientes</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Users size={20} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#10f981" 
              initial={{ width: 0 }}
              animate={{ width: `${metrics.customerRetention}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <TrendingUp size={12} />
              +3.2% este trimestre
            </MetricChange>
            <span>Excelente</span>
          </MetricFooter>
        </MetricCard>

        {/* Crescimento Mensal */}
        <MetricCard
          gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>+{metrics.growthRate.toFixed(1)}%</MetricValue>
              <MetricLabel>Crescimento Mensal</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Activity size={20} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#ec4899" 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.growthRate / 25) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <TrendingUp size={12} />
              Tendência positiva
            </MetricChange>
            <span>Meta: 12%</span>
          </MetricFooter>
        </MetricCard>
      </MetricsContainer>

      {/* KPIs Secundários */}
      <div style={{ margin: '30px 0' }}>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '20px',
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <BarChart3 size={24} />
          Indicadores de Performance
        </h3>
        
        <KPIGrid>
          <KPICard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <KPIValue>{metrics.satisfaction.toFixed(1)}%</KPIValue>
            <KPILabel>Satisfação</KPILabel>
          </KPICard>

          <KPICard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <KPIValue>{stats.totalUsers}</KPIValue>
            <KPILabel>Total de Membros</KPILabel>
          </KPICard>

          <KPICard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <KPIValue>R$ {(stats.revenue / 1000).toFixed(1)}k</KPIValue>
            <KPILabel>Receita Total</KPILabel>
          </KPICard>

          <KPICard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <KPIValue>{metrics.activeRate.toFixed(0)}%</KPIValue>
            <KPILabel>Taxa de Atividade</KPILabel>
          </KPICard>

          <KPICard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <KPIValue>{stats.activeEvents}</KPIValue>
            <KPILabel>Eventos Ativos</KPILabel>
          </KPICard>

          <KPICard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <KPIValue>+{stats.newRegistrations}</KPIValue>
            <KPILabel>Novos este mês</KPILabel>
          </KPICard>
        </KPIGrid>
      </div>
    </>
  );
};

export default AdvancedMetrics;