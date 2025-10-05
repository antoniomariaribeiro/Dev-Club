import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, Calendar, Award, 
  Clock, Target, Zap, Activity, 
  Star, Trophy, BookOpen, Heart
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
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${props => props.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const MetricValue = styled.div`
  font-size: 2.4rem;
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
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
  margin: 12px 0;
`;

const ProgressBar = styled(motion.div)<{ color: string }>`
  height: 100%;
  background: ${props => props.color};
  border-radius: 3px;
`;

const GraduationBadge = styled.div`
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const SpecialMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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

const SpecialMetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
`;

const SpecialValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SpecialLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

interface CapoeiraMetricsProps {
  stats: {
    totalUsers: number;
    activeEvents: number;
    revenue: number;
    newRegistrations: number;
  };
}

const CapoeiraMetrics: React.FC<CapoeiraMetricsProps> = ({ stats }) => {
  const [metrics, setMetrics] = useState({
    retentionRate: 84.2,
    averageAttendance: 18.5,
    graduationRate: 12.8,
    instructorRating: 4.7,
    nextBatizado: 45,
    trainingHoursWeek: 24,
    memberSatisfaction: 92.5,
    eventParticipation: 68.3
  });

  useEffect(() => {
    // Simular atualizações das métricas em tempo real
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        retentionRate: Math.max(75, Math.min(95, prev.retentionRate + (Math.random() - 0.5) * 2)),
        averageAttendance: Math.max(10, Math.min(25, prev.averageAttendance + (Math.random() - 0.5) * 1)),
        graduationRate: Math.max(8, Math.min(20, prev.graduationRate + (Math.random() - 0.5) * 0.5)),
        instructorRating: Math.max(4.0, Math.min(5.0, prev.instructorRating + (Math.random() - 0.5) * 0.1)),
        memberSatisfaction: Math.max(80, Math.min(100, prev.memberSatisfaction + (Math.random() - 0.5) * 1)),
        eventParticipation: Math.max(50, Math.min(85, prev.eventParticipation + (Math.random() - 0.5) * 2))
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <MetricsContainer>
        {/* Taxa de Retenção de Alunos */}
        <MetricCard
          gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>{metrics.retentionRate.toFixed(1)}%</MetricValue>
              <MetricLabel>Taxa de Retenção</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Heart size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#10f981" 
              initial={{ width: 0 }}
              animate={{ width: `${metrics.retentionRate}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <TrendingUp size={12} />
              +2.3% este mês
            </MetricChange>
            <GraduationBadge>Excelente</GraduationBadge>
          </MetricFooter>
        </MetricCard>

        {/* Frequência Média de Treinos */}
        <MetricCard
          gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>{metrics.averageAttendance.toFixed(1)}</MetricValue>
              <MetricLabel>Presença Média/Aula</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Users size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#f59e0b" 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.averageAttendance / 25) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <TrendingUp size={12} />
              +1.2 esta semana
            </MetricChange>
            <span>Capacidade: 25</span>
          </MetricFooter>
        </MetricCard>

        {/* Taxa de Graduação */}
        <MetricCard
          gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>{metrics.graduationRate.toFixed(1)}%</MetricValue>
              <MetricLabel>Taxa de Graduação</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Award size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#10f981" 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.graduationRate / 20) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <Trophy size={12} />
              3 graduações este mês
            </MetricChange>
            <span>Meta: 15%</span>
          </MetricFooter>
        </MetricCard>

        {/* Avaliação dos Instrutores */}
        <MetricCard
          gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <MetricHeader>
            <div>
              <MetricValue>{metrics.instructorRating.toFixed(1)}/5</MetricValue>
              <MetricLabel>Avaliação Instrutores</MetricLabel>
            </div>
            <MetricIcon bg="rgba(255, 255, 255, 0.2)">
              <Star size={24} />
            </MetricIcon>
          </MetricHeader>
          <MetricProgress>
            <ProgressBar 
              color="#fbbf24" 
              initial={{ width: 0 }}
              animate={{ width: `${(metrics.instructorRating / 5) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </MetricProgress>
          <MetricFooter>
            <MetricChange isPositive={true}>
              <Star size={12} />
              Baseado em 47 avaliações
            </MetricChange>
            <GraduationBadge>★★★★★</GraduationBadge>
          </MetricFooter>
        </MetricCard>
      </MetricsContainer>

      {/* Métricas Especiais da Capoeira */}
      <div style={{ margin: '30px 0' }}>
        <h3 style={{ 
          color: 'white', 
          marginBottom: '20px',
          fontSize: '1.4rem',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          🥋 Métricas Específicas da Capoeira
        </h3>
        
        <SpecialMetricsGrid>
          <SpecialMetricCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SpecialValue>
              <Calendar size={20} />
              {metrics.nextBatizado}
            </SpecialValue>
            <SpecialLabel>Dias para Batizado</SpecialLabel>
          </SpecialMetricCard>

          <SpecialMetricCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SpecialValue>
              <Clock size={20} />
              {metrics.trainingHoursWeek}h
            </SpecialValue>
            <SpecialLabel>Horas de Treino/Semana</SpecialLabel>
          </SpecialMetricCard>

          <SpecialMetricCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SpecialValue>
              <Target size={20} />
              {metrics.memberSatisfaction.toFixed(0)}%
            </SpecialValue>
            <SpecialLabel>Satisfação dos Membros</SpecialLabel>
          </SpecialMetricCard>

          <SpecialMetricCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SpecialValue>
              <Activity size={20} />
              {metrics.eventParticipation.toFixed(0)}%
            </SpecialValue>
            <SpecialLabel>Participação em Eventos</SpecialLabel>
          </SpecialMetricCard>

          <SpecialMetricCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SpecialValue>
              <BookOpen size={20} />
              {stats.totalUsers}
            </SpecialValue>
            <SpecialLabel>Total de Capoeiristas</SpecialLabel>
          </SpecialMetricCard>

          <SpecialMetricCard
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <SpecialValue>
              <Zap size={20} />
              R$ {(stats.revenue / stats.totalUsers).toFixed(0)}
            </SpecialValue>
            <SpecialLabel>Ticket Médio</SpecialLabel>
          </SpecialMetricCard>
        </SpecialMetricsGrid>
      </div>
    </>
  );
};

export default CapoeiraMetrics;