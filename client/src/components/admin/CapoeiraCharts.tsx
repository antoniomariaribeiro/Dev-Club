import React from 'react';
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
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
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
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
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
  display: flex;
  align-items: center;
  gap: 8px;
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

const WideChartContainer = styled(motion.div)`
  grid-column: 1 / -1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

interface CapoeiraChartsProps {
  stats: {
    totalUsers: number;
    activeEvents: number;
    totalSales: number;
    revenue: number;
    newRegistrations: number;
  };
}

const CapoeiraCharts: React.FC<CapoeiraChartsProps> = ({ stats }) => {
  // Dados simulados para gráficos específicos de capoeira
  const graduationData = {
    labels: ['Crua', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'],
    datasets: [
      {
        label: 'Alunos por Graduação',
        data: [8, 6, 4, 3, 2, 1, 1, 0],
        backgroundColor: [
          '#f3f4f6', // Crua
          '#fbbf24', // Amarela  
          '#f97316', // Laranja
          '#22c55e', // Verde
          '#3b82f6', // Azul
          '#8b5cf6', // Roxa
          '#a3a3a3', // Marrom
          '#1f2937', // Preta
        ],
        borderColor: [
          '#d1d5db',
          '#f59e0b',
          '#ea580c',
          '#16a34a',
          '#2563eb',
          '#7c3aed',
          '#737373',
          '#111827',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Frequência de treinos por dia da semana
  const trainingFrequencyData = {
    labels: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'],
    datasets: [
      {
        label: 'Presença Média',
        data: [18, 15, 20, 17, 22, 25, 8],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#f59e0b',
        pointBorderColor: '#fff',
        pointRadius: 6,
      },
    ],
  };

  // Heatmap de atividades (simulado com gráfico de barras horizontal)
  const activityHeatmapData = {
    labels: ['6h', '7h', '8h', '18h', '19h', '20h', '21h'],
    datasets: [
      {
        label: 'Atividade por Horário',
        data: [2, 5, 3, 15, 20, 18, 12],
        backgroundColor: [
          'rgba(59, 130, 246, 0.3)',
          'rgba(59, 130, 246, 0.5)',
          'rgba(59, 130, 246, 0.4)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.7)',
        ],
        borderColor: [
          '#3b82f6',
          '#3b82f6',
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
          '#ef4444',
          '#f59e0b',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Radar chart para performance de instrutores
  const instructorPerformanceData = {
    labels: ['Técnica', 'Didática', 'Motivação', 'Pontualidade', 'Criatividade', 'Liderança'],
    datasets: [
      {
        label: 'Mestre João',
        data: [95, 88, 92, 96, 85, 90],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#10b981',
      },
      {
        label: 'Professora Maria',
        data: [90, 94, 88, 92, 96, 87],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6',
      },
    ],
  };

  // Progressão de alunos ao longo do tempo
  const studentProgressData = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out'],
    datasets: [
      {
        label: 'Graduações Conquistadas',
        data: [2, 3, 1, 4, 2, 3, 5, 2, 1, 3],
        backgroundColor: '#f59e0b',
        borderColor: '#d97706',
        borderWidth: 2,
      },
      {
        label: 'Novos Alunos',
        data: [5, 8, 3, 7, 6, 9, 12, 4, 6, 8],
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 2,
      },
    ],
  };

  // Tipos de eventos mais populares
  const eventTypesData = {
    labels: ['Roda', 'Batizado', 'Workshop', 'Aula Especial', 'Encontro'],
    datasets: [
      {
        data: [35, 20, 15, 20, 10],
        backgroundColor: [
          '#f59e0b',
          '#ef4444',
          '#3b82f6',
          '#10b981',
          '#8b5cf6',
        ],
        borderColor: [
          '#d97706',
          '#dc2626',
          '#2563eb',
          '#059669',
          '#7c3aed',
        ],
        borderWidth: 2,
      },
    ],
  };

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

  const radarOptions = {
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
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        pointLabels: {
          color: 'white',
          font: {
            size: 11,
          },
        },
        ticks: {
          color: 'white',
          backdropColor: 'transparent',
        },
        min: 0,
        max: 100,
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
        {/* Distribuição por Graduação */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ChartTitle>🥋 Distribuição por Graduação</ChartTitle>
          <div style={{ height: '300px' }}>
            <Doughnut data={graduationData} options={doughnutOptions} />
          </div>
        </ChartContainer>

        {/* Tipos de Eventos Populares */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ChartTitle>🎉 Eventos Mais Populares</ChartTitle>
          <div style={{ height: '300px' }}>
            <PolarArea data={eventTypesData} options={doughnutOptions} />
          </div>
        </ChartContainer>

        {/* Atividade por Horário */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ChartTitle>⏰ Picos de Atividade</ChartTitle>
          <div style={{ height: '300px' }}>
            <Bar 
              data={activityHeatmapData} 
              options={{
                ...chartOptions,
                indexAxis: 'y' as const,
              }} 
            />
          </div>
        </ChartContainer>

        {/* Performance dos Instrutores */}
        <ChartContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ChartTitle>👥 Performance dos Instrutores</ChartTitle>
          <div style={{ height: '300px' }}>
            <Radar data={instructorPerformanceData} options={radarOptions} />
          </div>
        </ChartContainer>
      </ChartGrid>

      {/* Gráficos Largos */}
      <WideChartContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <ChartTitle>📊 Frequência de Treinos por Dia da Semana</ChartTitle>
        <div style={{ height: '250px' }}>
          <Line data={trainingFrequencyData} options={chartOptions} />
        </div>
      </WideChartContainer>

      <WideChartContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <ChartTitle>📈 Progressão de Alunos e Graduações</ChartTitle>
        <div style={{ height: '250px' }}>
          <Bar data={studentProgressData} options={chartOptions} />
        </div>
      </WideChartContainer>
    </>
  );
};

export default CapoeiraCharts;