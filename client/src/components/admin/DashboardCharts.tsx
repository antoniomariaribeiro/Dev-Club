import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 15px;
    border-radius: 10px;
  }
`;

const ChartTitle = styled.h3`
  color: white;
  margin-bottom: 20px;
  font-size: 1.2rem;
`;

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
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

interface DashboardChartsProps {
  stats: {
    totalUsers: number;
    activeEvents: number;
    totalSales: number;
    revenue: number;
    newRegistrations: number;
  };
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ stats }) => {
  // Dados para gráfico de linha - Usuários ao longo do tempo
  const userGrowthData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Usuários Cadastrados',
        data: [65, 85, 120, 140, 180, 220, stats.totalUsers],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Usuários Ativos',
        data: [45, 65, 85, 100, 130, 160, Math.floor(stats.totalUsers * 0.7)],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Dados para gráfico de barras - Receita mensal
  const revenueData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Receita (R$)',
        data: [1200, 1800, 2400, 2100, 2800, 3200, stats.revenue],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
        ],
        borderColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#ec4899',
          '#22c55e',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Dados para gráfico de rosca - Distribuição de eventos
  const eventsData = {
    labels: ['Eventos Ativos', 'Eventos Concluídos', 'Eventos Planejados'],
    datasets: [
      {
        data: [stats.activeEvents, 15, 8],
        backgroundColor: [
          '#10b981',
          '#3b82f6',
          '#f59e0b',
        ],
        borderColor: [
          '#059669',
          '#2563eb',
          '#d97706',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  // Opções para os gráficos com tema escuro
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'white',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        titleColor: 'white',
        bodyColor: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      y: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
      tooltip: {
        titleColor: 'white',
        bodyColor: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      },
    },
  };

  return (
    <>
      <ChartGrid>
        {/* Gráfico de crescimento de usuários */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ChartTitle>📈 Crescimento de Usuários</ChartTitle>
          <div style={{ height: '300px' }}>
            <Line data={userGrowthData} options={chartOptions} />
          </div>
        </ChartContainer>

        {/* Gráfico de receita mensal */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChartTitle>💰 Receita Mensal</ChartTitle>
          <div style={{ height: '300px' }}>
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </ChartContainer>

        {/* Gráfico de distribuição de eventos */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ChartTitle>📅 Distribuição de Eventos</ChartTitle>
          <div style={{ height: '300px' }}>
            <Doughnut data={eventsData} options={doughnutOptions} />
          </div>
        </ChartContainer>

        {/* Gráfico de performance semanal */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ChartTitle>🎯 Performance Semanal</ChartTitle>
          <div style={{ height: '300px' }}>
            <Line 
              data={{
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [
                  {
                    label: 'Inscrições',
                    data: [12, 19, 8, 15, 25, 22, 18],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.4,
                  },
                  {
                    label: 'Aulas',
                    data: [8, 12, 6, 10, 15, 18, 12],
                    borderColor: '#ec4899',
                    backgroundColor: 'rgba(236, 72, 153, 0.1)',
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }} 
              options={chartOptions} 
            />
          </div>
        </ChartContainer>
      </ChartGrid>
    </>
  );
};

export default DashboardCharts;