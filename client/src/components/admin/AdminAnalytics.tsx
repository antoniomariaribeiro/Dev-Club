import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Users, ShoppingCart,
  ArrowUp, ArrowDown, Eye
} from 'lucide-react';// Interfaces
interface ChartData {
    label: string;
    value: number;
    color: string;
}

interface MetricProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
  format?: 'number' | 'currency' | 'percentage';
}// Styled Components
const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ChartCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 25px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.2rem;
  color: white;
`;

const BarChart = styled.div`
  display: flex;
  align-items: end;
  gap: 8px;
  height: 200px;
  padding: 20px 0;
`;

const Bar = styled(motion.div) <{ height: number; color: string }>`
  flex: 1;
  background: ${props => props.color};
  height: ${props => props.height}%;
  border-radius: 4px 4px 0 0;
  position: relative;
  min-height: 20px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding-bottom: 5px;
  color: white;
  font-size: 0.8rem;
`;



const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const MetricCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 15px;
`;

const MetricIcon = styled.div<{ color: string }>`
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
`;

const MetricContent = styled.div`
  flex: 1;
`;

const MetricValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`;

const MetricChange = styled.div<{ isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: ${props => props.isPositive ? '#10b981' : '#ef4444'};
  margin-top: 5px;
`;

// Componente de Gráfico de Barras
const SimpleBarChart: React.FC<{ data: ChartData[]; title: string }> = ({ data, title }) => {
    const maxValue = Math.max(...data.map(item => item.value));

    return (
        <ChartCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <ChartTitle>{title}</ChartTitle>
            <BarChart>
                {data.map((item, index) => (
                    <Bar
                        key={index}
                        height={(item.value / maxValue) * 100}
                        color={item.color}
                        initial={{ height: 0 }}
                        animate={{ height: (item.value / maxValue) * 100 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        {item.value}
                    </Bar>
                ))}
            </BarChart>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                {data.map((item, index) => (
                    <div key={index} style={{ flex: 1, textAlign: 'center', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                        {item.label}
                    </div>
                ))}
            </div>
        </ChartCard>
    );
};

// Componente de Métrica
const MetricComponent: React.FC<MetricProps> = ({
    title,
    value,
    change,
    icon,
    color,
    format = 'number'
}) => {
    const formatValue = (val: string | number): string => {
        if (typeof val === 'string') return val;

        switch (format) {
            case 'currency':
                return `R$ ${val.toLocaleString()}`;
            case 'percentage':
                return `${val}%`;
            default:
                return val.toLocaleString();
        }
    };

    return (
        <MetricCard
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <MetricIcon color={color}>
                {icon}
            </MetricIcon>
            <MetricContent>
                <MetricValue>{formatValue(value)}</MetricValue>
                <MetricLabel>{title}</MetricLabel>
                <MetricChange isPositive={change >= 0}>
                    {change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    {Math.abs(change)}% vs ontem
                </MetricChange>
            </MetricContent>
        </MetricCard>
    );
};

// Componente Principal
const AdminAnalytics: React.FC = () => {
    const [realtimeData, setRealtimeData] = useState({
        visitorsToday: 1247,
        salesThisWeek: 18,
        activeUsers: 23,
        conversion: 3.4
    });

    // Dados para gráficos
    const weeklyVisitors = [
        { label: 'Dom', value: 120, color: '#3b82f6' },
        { label: 'Seg', value: 180, color: '#10b981' },
        { label: 'Ter', value: 160, color: '#f59e0b' },
        { label: 'Qua', value: 220, color: '#ef4444' },
        { label: 'Qui', value: 190, color: '#8b5cf6' },
        { label: 'Sex', value: 240, color: '#06b6d4' },
        { label: 'Sáb', value: 200, color: '#84cc16' }
    ];

    const eventRegistrations = [
        { label: 'Jan', value: 45, color: '#3b82f6' },
        { label: 'Fev', value: 62, color: '#10b981' },
        { label: 'Mar', value: 38, color: '#f59e0b' },
        { label: 'Abr', value: 75, color: '#ef4444' },
        { label: 'Mai', value: 58, color: '#8b5cf6' },
        { label: 'Jun', value: 82, color: '#06b6d4' }
    ];

    // Simulação de dados em tempo real
    useEffect(() => {
        const interval = setInterval(() => {
            setRealtimeData(prev => ({
                ...prev,
                activeUsers: prev.activeUsers + Math.floor(Math.random() * 3) - 1,
                visitorsToday: prev.visitorsToday + Math.floor(Math.random() * 5),
                conversion: +(prev.conversion + (Math.random() - 0.5) * 0.1).toFixed(1)
            }));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <MetricsGrid>
                <MetricComponent
                    title="Visitantes Hoje"
                    value={realtimeData.visitorsToday}
                    change={12.5}
                    icon={<Eye />}
                    color="#3b82f6"
                />
                <MetricComponent
                    title="Vendas Semana"
                    value={realtimeData.salesThisWeek}
                    change={8.3}
                    icon={<ShoppingCart />}
                    color="#10b981"
                    format="number"
                />
                <MetricComponent
                    title="Usuários Online"
                    value={realtimeData.activeUsers}
                    change={-2.1}
                    icon={<Users />}
                    color="#f59e0b"
                />
                <MetricComponent
                    title="Taxa Conversão"
                    value={realtimeData.conversion}
                    change={5.7}
                    icon={<TrendingUp />}
                    color="#ef4444"
                    format="percentage"
                />
            </MetricsGrid>

            <ChartsContainer>
                <SimpleBarChart
                    data={weeklyVisitors}
                    title="Visitantes por Dia da Semana"
                />
                <SimpleBarChart
                    data={eventRegistrations}
                    title="Inscrições em Eventos (2024)"
                />
            </ChartsContainer>
        </div>
    );
};

export default AdminAnalytics;