import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import AdminUsers from '../components/admin/AdminUsers';
import AdminEvents from '../components/admin/AdminEvents';
import AdminPayments from '../components/admin/AdminPayments';
import AdminGallery from '../components/admin/AdminGallery';
import AdminChat from '../components/admin/AdminChat';
import AdminContacts from '../components/admin/AdminContacts';
import AdvancedAnalytics from '../components/admin/AdvancedAnalytics';
import GlobalSearch from '../components/GlobalSearch';
import { useDashboardStats } from '../hooks/useAdminStats';
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
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

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
  Legend,
  Filler
);

// Interfaces para dados dos gráficos
interface UserGrowthData {
  month: string;
  users: number;
  new_users: number;
}

// interface EventPerformanceData {
//   categories: Array<{
//     name: string;
//     total_events: number;
//     avg_participants: number;
//     revenue: number;
//     satisfaction: number;
//   }>;
//   monthly_revenue: Array<{
//     month: string;
//     revenue: number;
//   }>;
// }

// Função setEventPerformanceData comentada para evitar erro
// const setEventPerformanceData = (data: EventPerformanceData | null) => {};

interface RegistrationAnalysisData {
  status_distribution: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  conversion_rates: Array<{
    month: string;
    applications: number;
    approved: number;
    rate: number;
  }>;
  peak_hours: Array<{
    hour: string;
    registrations: number;
  }>;
}

interface FinancialData {
  monthly_revenue: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
  revenue_sources: Array<{
    source: string;
    amount: number;
    percentage: number;
  }>;
  expense_categories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

const DashboardContainer = styled.div`
  display: grid;
  gap: 2rem;
  padding: 1rem;
`;

const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const DashboardTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
`;

const Tab = styled.button<{ active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background: ${props => props.active ? '#007bff' : 'transparent'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border-radius: 8px 8px 0 0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f1f5f9'};
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  border-left: 4px solid;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.875rem;
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
`;

const ChartCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  
  h3 {
    margin: 0 0 1.5rem 0;
    color: #2d3748;
    font-size: 1.25rem;
    font-weight: 600;
  }
`;

const ChartContainer = styled.div`
  position: relative;
  height: 300px;
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #64748b;
`;

const WelcomeCard = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const WelcomeTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const WelcomeSubtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
`;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { stats, loading } = useDashboardStats();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Estados para dados dos gráficos
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthData[]>([]);

  const [registrationAnalysisData, setRegistrationAnalysisData] = useState<RegistrationAnalysisData | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);

  // Carregar dados dos gráficos com dados mockados por enquanto
  useEffect(() => {
    const loadChartData = async () => {
      try {
        setChartsLoading(true);
        
        // Dados mockados para desenvolvimento
        const mockUserGrowth: UserGrowthData[] = [
          { month: 'Jan', users: 150, new_users: 25 },
          { month: 'Fev', users: 180, new_users: 30 },
          { month: 'Mar', users: 220, new_users: 40 },
          { month: 'Abr', users: 260, new_users: 35 },
          { month: 'Mai', users: 300, new_users: 40 },
          { month: 'Jun', users: 350, new_users: 50 }
        ];

        const mockRegistrations: RegistrationAnalysisData = {
          status_distribution: [
            { status: 'approved', count: 85, percentage: 70 },
            { status: 'pending', count: 25, percentage: 20 },
            { status: 'rejected', count: 12, percentage: 10 }
          ],
          conversion_rates: [
            { month: 'Jan', applications: 50, approved: 35, rate: 70 },
            { month: 'Fev', applications: 60, approved: 45, rate: 75 },
            { month: 'Mar', applications: 70, approved: 56, rate: 80 }
          ],
          peak_hours: [
            { hour: '18:00', registrations: 45 },
            { hour: '19:00', registrations: 38 },
            { hour: '20:00', registrations: 32 }
          ]
        };

        const mockFinancial: FinancialData = {
          monthly_revenue: [
            { month: 'Jan', revenue: 5000, expenses: 3000, profit: 2000 },
            { month: 'Fev', revenue: 6000, expenses: 3200, profit: 2800 },
            { month: 'Mar', revenue: 7500, expenses: 3500, profit: 4000 }
          ],
          revenue_sources: [
            { source: 'Mensalidades', amount: 15000, percentage: 60 },
            { source: 'Eventos', amount: 7500, percentage: 30 },
            { source: 'Produtos', amount: 2500, percentage: 10 }
          ],
          expense_categories: [
            { category: 'Aluguel', amount: 5000, percentage: 50 },
            { category: 'Equipamentos', amount: 2000, percentage: 20 },
            { category: 'Marketing', amount: 1500, percentage: 15 },
            { category: 'Outros', amount: 1500, percentage: 15 }
          ]
        };

        setUserGrowthData(mockUserGrowth);
        setRegistrationAnalysisData(mockRegistrations);
        setFinancialData(mockFinancial);
      } catch (error) {
        console.error('Erro ao carregar dados dos gráficos:', error);
      } finally {
        setChartsLoading(false);
      }
    };

    if (activeTab === 'charts') {
      loadChartData();
    }
  }, [activeTab]);

  // Configurações dos gráficos
  const getUserGrowthChartData = () => ({
    labels: userGrowthData.map(item => item.month),
    datasets: [
      {
        label: 'Total de Usuários',
        data: userGrowthData.map(item => item.users),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Novos Usuários',
        data: userGrowthData.map(item => item.new_users),
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  });

  const getRegistrationStatusChartData = () => {
    if (!registrationAnalysisData) return { labels: [], datasets: [] };
    
    return {
      labels: registrationAnalysisData.status_distribution.map(item => {
        switch(item.status) {
          case 'approved': return 'Aprovadas';
          case 'pending': return 'Pendentes';
          case 'rejected': return 'Rejeitadas';
          case 'cancelled': return 'Canceladas';
          default: return item.status;
        }
      }),
      datasets: [
        {
          data: registrationAnalysisData.status_distribution.map(item => item.count),
          backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#6c757d'],
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  const getRevenueChartData = () => {
    if (!financialData) return { labels: [], datasets: [] };
    
    return {
      labels: financialData.monthly_revenue.map(item => item.month),
      datasets: [
        {
          label: 'Receita',
          data: financialData.monthly_revenue.map(item => item.revenue),
          backgroundColor: 'rgba(0, 123, 255, 0.8)',
          borderColor: '#007bff',
          borderWidth: 1
        },
        {
          label: 'Despesas',
          data: financialData.monthly_revenue.map(item => item.expenses),
          backgroundColor: 'rgba(220, 53, 69, 0.8)',
          borderColor: '#dc3545',
          borderWidth: 1
        },
        {
          label: 'Lucro',
          data: financialData.monthly_revenue.map(item => item.profit),
          backgroundColor: 'rgba(40, 167, 69, 0.8)',
          borderColor: '#28a745',
          borderWidth: 1
        }
      ]
    };
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case 'users':
        return 'Gerenciamento de Usuários';
      case 'events':
        return 'Eventos e Aulas';
      case 'payments':
        return 'Gerenciamento de Pagamentos';
      case 'gallery':
        return 'Galeria de Fotos';
      case 'chat':
        return 'Sistema de Chat';
      case 'products':
        return 'Loja e Produtos';
      case 'reports':
        return 'Relatórios e Analytics';
      case 'settings':
        return 'Configurações do Sistema';
      default:
        return 'Dashboard Administrativo';
    }
  };

  const getSectionSubtitle = () => {
    switch (activeSection) {
      case 'users':
        return 'Gerencie todos os usuários da plataforma';
      case 'events':
        return 'Controle eventos, aulas e inscrições';
      case 'payments':
        return 'Controle transações, reembolsos e estatísticas financeiras';
      case 'gallery':
        return 'Organize fotos, categorias e visibilidade das imagens';
      case 'chat':
        return 'Gerencie salas de chat, mensagens e moderação';
      case 'products':
        return 'Administre produtos e estoque da loja';
      case 'reports':
        return 'Visualize relatórios e análises detalhadas';
      case 'settings':
        return 'Configure parâmetros do sistema';
      default:
        return 'Visão geral e estatísticas da academia';
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <AdminUsers />;
      case 'events':
        return <AdminEvents />;
      case 'payments':
        return <AdminPayments />;
      case 'gallery':
        return <AdminGallery />;
      case 'contacts':
        return <AdminContacts />;
      case 'chat':
        return <AdminChat />;
      case 'products':
        return <div>Componente de Produtos em desenvolvimento...</div>;
      case 'reports':
        return <AdvancedAnalytics />;
      case 'settings':
        return <div>Componente de Configurações em desenvolvimento...</div>;
      default:
        return (
          <DashboardContainer>
            <HeaderSection>
              <DashboardTitle>Dashboard Administrativo</DashboardTitle>
              <GlobalSearch 
                onNavigate={(section, id) => {
                  if (section && id) {
                    // Navegar para a seção específica com o item selecionado
                    setActiveSection(section.slice(0, -1)); // Remove 's' do final (ex: 'users' -> 'user')
                  }
                }}
              />
            </HeaderSection>

            <TabsContainer>
              <Tab 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              >
                📊 Visão Geral
              </Tab>
              <Tab 
                active={activeTab === 'charts'} 
                onClick={() => setActiveTab('charts')}
              >
                📈 Gráficos Avançados
              </Tab>
            </TabsContainer>

            {activeTab === 'overview' && (
              <>
                <WelcomeCard
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <WelcomeTitle>Bem-vindo, {user?.name}!</WelcomeTitle>
                  <WelcomeSubtitle>
                    Gerencie toda a Academia Capoeira Nacional em um só lugar
                  </WelcomeSubtitle>
                </WelcomeCard>

                <StatsGrid>
                  <StatCard
                    style={{ borderLeftColor: '#007bff' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <StatNumber style={{ color: '#007bff' }}>
                      {loading ? '...' : stats?.totalUsers || 0}
                    </StatNumber>
                    <StatLabel>Total de Usuários</StatLabel>
                  </StatCard>

                  <StatCard
                    style={{ borderLeftColor: '#28a745' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <StatNumber style={{ color: '#28a745' }}>
                      {loading ? '...' : stats?.totalEvents || 0}
                    </StatNumber>
                    <StatLabel>Total de Eventos</StatLabel>
                  </StatCard>

                  <StatCard
                    style={{ borderLeftColor: '#ffc107' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <StatNumber style={{ color: '#e0a800' }}>
                      {loading ? '...' : `R$ ${(stats?.monthlyRevenue || 0).toLocaleString()}`}
                    </StatNumber>
                    <StatLabel>Receita Mensal</StatLabel>
                  </StatCard>

                  <StatCard
                    style={{ borderLeftColor: '#dc3545' }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <StatNumber style={{ color: '#dc3545' }}>
                      {loading ? '...' : stats?.totalContacts || 0}
                    </StatNumber>
                    <StatLabel>Total de Contatos</StatLabel>
                  </StatCard>
                </StatsGrid>
              </>
            )}

            {activeTab === 'charts' && (
              <ChartsGrid>
                {chartsLoading ? (
                  <LoadingContainer>
                    <div>🔄 Carregando gráficos avançados...</div>
                  </LoadingContainer>
                ) : (
                  <>
                    <ChartCard
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 }}
                    >
                      <h3>📈 Crescimento de Usuários</h3>
                      <ChartContainer>
                        <Line 
                          data={getUserGrowthChartData()}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top' as const,
                              },
                              title: {
                                display: false
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                grid: {
                                  color: 'rgba(0,0,0,0.1)'
                                }
                              },
                              x: {
                                grid: {
                                  color: 'rgba(0,0,0,0.1)'
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
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <h3>📋 Status das Inscrições</h3>
                      <ChartContainer>
                        <Doughnut 
                          data={getRegistrationStatusChartData()}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom' as const,
                              }
                            }
                          }}
                        />
                      </ChartContainer>
                    </ChartCard>

                    <ChartCard
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      style={{ gridColumn: 'span 2' }}
                    >
                      <h3>💰 Performance Financeira</h3>
                      <ChartContainer>
                        <Bar 
                          data={getRevenueChartData()}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'top' as const,
                              }
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                ticks: {
                                  callback: function(value) {
                                    return 'R$ ' + value?.toLocaleString();
                                  }
                                }
                              }
                            }
                          }}
                        />
                      </ChartContainer>
                    </ChartCard>
                  </>
                )}
              </ChartsGrid>
            )}
          </DashboardContainer>
        );
    }
  };

  return (
    <AdminLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      title={getSectionTitle()}
      subtitle={getSectionSubtitle()}
    >
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;