import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import {
  Line,
  Doughnut,
  Radar
} from 'react-chartjs-2';
import { Icons } from '../../utils/icons';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Interfaces
interface AnalyticsData {
  revenue: {
    total: number;
    monthly: Array<{ month: string; value: number }>;
    growth: number;
  };
  users: {
    total: number;
    active: number;
    newThisMonth: number;
    retention: number;
  };
  events: {
    total: number;
    upcoming: number;
    avgAttendance: number;
    categories: Array<{ name: string; count: number; revenue: number }>;
  };
  engagement: {
    pageViews: number;
    sessions: number;
    avgSessionDuration: string;
    bounceRate: number;
  };
}

interface TimeRange {
  label: string;
  value: string;
  days: number;
}

// Styled Components
const Container = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const AnalyticsTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => 
    props.$variant === 'primary' 
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'white'
  };
  color: ${props => props.$variant === 'primary' ? 'white' : '#374151'};
  border: 2px solid ${props => props.$variant === 'primary' ? 'transparent' : '#e1e5e9'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div<{ $color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color};
  color: white;
  font-size: 1.2rem;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
`;

const StatChange = styled.div<{ $positive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
`;

const ChartContainer = styled.div`
  height: 300px;
  position: relative;
`;

const DetailedSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const TableCard = styled(ChartCard)`
  padding: 1.5rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: #f8fafc;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;

  &:hover {
    background: #f8fafc;
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const TableCell = styled.td`
  padding: 1rem 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
`;

const Badge = styled.span<{ $variant: 'success' | 'warning' | 'error' | 'info' }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$variant) {
      case 'success': return '#dcfce7';
      case 'warning': return '#fef3c7';
      case 'error': return '#fee2e2';
      case 'info': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'success': return '#166534';
      case 'warning': return '#92400e';
      case 'error': return '#991b1b';
      case 'info': return '#1e40af';
      default: return '#374151';
    }
  }};
`;

const LoadingOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(4px);
  border-radius: 16px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AdvancedAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const timeRanges: TimeRange[] = [
    { label: 'Últimos 7 dias', value: '7d', days: 7 },
    { label: 'Últimos 30 dias', value: '30d', days: 30 },
    { label: 'Últimos 90 dias', value: '90d', days: 90 },
    { label: 'Últimos 12 meses', value: '12m', days: 365 }
  ];

  // Simular carregamento de dados
  const loadData = async () => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: AnalyticsData = {
      revenue: {
        total: 156780,
        growth: 23.5,
        monthly: [
          { month: 'Jan', value: 12500 },
          { month: 'Fev', value: 14200 },
          { month: 'Mar', value: 13800 },
          { month: 'Abr', value: 15900 },
          { month: 'Mai', value: 18200 },
          { month: 'Jun', value: 21300 }
        ]
      },
      users: {
        total: 1247,
        active: 892,
        newThisMonth: 156,
        retention: 87.3
      },
      events: {
        total: 48,
        upcoming: 12,
        avgAttendance: 34.5,
        categories: [
          { name: 'Workshops', count: 18, revenue: 45600 },
          { name: 'Graduações', count: 8, revenue: 32400 },
          { name: 'Competições', count: 12, revenue: 28900 },
          { name: 'Treinamentos', count: 10, revenue: 19800 }
        ]
      },
      engagement: {
        pageViews: 89456,
        sessions: 23891,
        avgSessionDuration: '4m 32s',
        bounceRate: 34.2
      }
    };
    
    setData(mockData);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const refreshData = () => {
    loadData();
  };

  const exportData = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!data) {
    return (
      <Container>
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      </Container>
    );
  }

  // Dados para gráficos
  const revenueChartData = {
    labels: data.revenue.monthly.map(item => item.month),
    datasets: [
      {
        label: 'Receita',
        data: data.revenue.monthly.map(item => item.value),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const eventCategoriesData = {
    labels: data.events.categories.map(cat => cat.name),
    datasets: [
      {
        data: data.events.categories.map(cat => cat.count),
        backgroundColor: [
          '#667eea',
          '#f093fb',
          '#4facfe',
          '#43e97b'
        ],
        borderWidth: 0
      }
    ]
  };

  const engagementRadarData = {
    labels: ['Visualizações', 'Sessões', 'Duração', 'Retenção', 'Conversão'],
    datasets: [
      {
        label: 'Engajamento',
        data: [85, 92, 78, 87, 73],
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        borderColor: '#667eea',
        borderWidth: 2,
        pointBackgroundColor: '#667eea'
      }
    ]
  };

  const topEvents = [
    { name: 'Workshop de Capoeira Avançada', participants: 45, revenue: 2250, status: 'success' },
    { name: 'Graduação de Cordéis', participants: 38, revenue: 1900, status: 'success' },
    { name: 'Roda Comunitária', participants: 52, revenue: 0, status: 'info' },
    { name: 'Competição Regional', participants: 28, revenue: 1400, status: 'warning' },
    { name: 'Treinamento Intensivo', participants: 22, revenue: 1100, status: 'success' }
  ];

  return (
    <Container>
      <Header>
        <AnalyticsTitle>📊 Analytics Avançados</AnalyticsTitle>
        <Controls>
          <Select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
          >
            {timeRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </Select>
          <Button onClick={refreshData} disabled={loading}>
            <Icons.FiRefreshCw />
            Atualizar
          </Button>
          <Button $variant="primary" onClick={exportData}>
            <Icons.FiDownload />
            Exportar
          </Button>
        </Controls>
      </Header>

      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}

      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatHeader>
            <StatIcon $color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
              <Icons.FiDollarSign />
            </StatIcon>
          </StatHeader>
          <StatValue>R$ {data.revenue.total.toLocaleString('pt-BR')}</StatValue>
          <StatLabel>Receita Total</StatLabel>
          <StatChange $positive={data.revenue.growth > 0}>
            <Icons.FiTrendingUp />
            +{data.revenue.growth}% vs mês anterior
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatHeader>
            <StatIcon $color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
              <Icons.FiUsers />
            </StatIcon>
          </StatHeader>
          <StatValue>{data.users.total.toLocaleString('pt-BR')}</StatValue>
          <StatLabel>Usuários Totais</StatLabel>
          <StatChange $positive={true}>
            <Icons.FiTrendingUp />
            +{data.users.newThisMonth} novos este mês
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatHeader>
            <StatIcon $color="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
              <Icons.FiCalendar />
            </StatIcon>
          </StatHeader>
          <StatValue>{data.events.total}</StatValue>
          <StatLabel>Eventos Realizados</StatLabel>
          <StatChange $positive={true}>
            <Icons.FiTarget />
            {data.events.upcoming} próximos eventos
          </StatChange>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatHeader>
            <StatIcon $color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)">
              <Icons.FiActivity />
            </StatIcon>
          </StatHeader>
          <StatValue>{data.users.retention}%</StatValue>
          <StatLabel>Taxa de Retenção</StatLabel>
          <StatChange $positive={data.users.retention > 80}>
            <Icons.FiEye />
            {data.users.active} usuários ativos
          </StatChange>
        </StatCard>
      </StatsGrid>

      <ChartsGrid>
        <ChartCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChartHeader>
            <ChartTitle>📈 Evolução da Receita</ChartTitle>
            <Icons.FiBarChart />
          </ChartHeader>
          <ChartContainer>
            <Line 
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0,0,0,0.05)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </ChartContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <ChartHeader>
            <ChartTitle>🎯 Categorias de Eventos</ChartTitle>
            <Icons.FiPieChart />
          </ChartHeader>
          <ChartContainer>
            <Doughnut 
              data={eventCategoriesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const
                  }
                }
              }}
            />
          </ChartContainer>
        </ChartCard>

        <ChartCard
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <ChartHeader>
            <ChartTitle>🎖️ Análise de Engajamento</ChartTitle>
            <Icons.FiTarget />
          </ChartHeader>
          <ChartContainer>
            <Radar 
              data={engagementRadarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  r: {
                    beginAtZero: true,
                    max: 100
                  }
                }
              }}
            />
          </ChartContainer>
        </ChartCard>
      </ChartsGrid>

      <DetailedSection>
        <TableCard
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <ChartHeader>
            <ChartTitle>🏆 Top Eventos</ChartTitle>
            <Icons.FiInfo />
          </ChartHeader>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Evento</TableHeader>
                <TableHeader>Participantes</TableHeader>
                <TableHeader>Receita</TableHeader>
                <TableHeader>Status</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {topEvents.map((event, index) => (
                <TableRow key={index}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.participants}</TableCell>
                  <TableCell>
                    {event.revenue > 0 
                      ? `R$ ${event.revenue.toLocaleString('pt-BR')}`
                      : 'Gratuito'
                    }
                  </TableCell>
                  <TableCell>
                    <Badge $variant={event.status as any}>
                      {event.status === 'success' ? 'Concluído' :
                       event.status === 'warning' ? 'Em andamento' :
                       event.status === 'info' ? 'Planejado' : 'Cancelado'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        </TableCard>

        <TableCard
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9 }}
        >
          <ChartHeader>
            <ChartTitle>📊 Métricas de Performance</ChartTitle>
            <Icons.FiActivity />
          </ChartHeader>
          <div style={{ padding: '1rem 0' }}>
            <StatValue style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
              {data.engagement.pageViews.toLocaleString('pt-BR')}
            </StatValue>
            <StatLabel>Visualizações de Página</StatLabel>
            
            <StatValue style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: '1.5rem' }}>
              {data.engagement.sessions.toLocaleString('pt-BR')}
            </StatValue>
            <StatLabel>Sessões de Usuário</StatLabel>
            
            <StatValue style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: '1.5rem' }}>
              {data.engagement.avgSessionDuration}
            </StatValue>
            <StatLabel>Duração Média da Sessão</StatLabel>
            
            <StatValue style={{ fontSize: '1.5rem', marginBottom: '0.5rem', marginTop: '1.5rem' }}>
              {data.engagement.bounceRate}%
            </StatValue>
            <StatLabel>Taxa de Rejeição</StatLabel>
          </div>
        </TableCard>
      </DetailedSection>
    </Container>
  );
};

export default AdvancedAnalytics;