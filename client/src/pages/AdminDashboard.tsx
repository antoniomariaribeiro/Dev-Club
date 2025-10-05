import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Users, Calendar, ShoppingCart, Image, Settings, 
  Activity, Monitor, TrendingUp 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import RealTimeDashboard from '../components/admin/RealTimeDashboard';
import AdminAnalytics from '../components/admin/AdminAnalytics';
import SimpleDashboard from '../components/admin/SimpleDashboard';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
`;

const Sidebar = styled.div`
  width: 280px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  overflow-y: auto;
`;

const SidebarHeader = styled.div`
  text-align: center;
  margin-bottom: 30px;
  color: white;
  
  h2 {
    margin: 10px 0;
    font-size: 1.5rem;
    background: linear-gradient(45deg, #fff, #e0e7ff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    opacity: 0.7;
    font-size: 0.9rem;
  }
`;

const NavSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.div`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
  padding-left: 12px;
`;

const NavItem = styled(motion.div)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  margin: 8px 0;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  transition: all 0.3s ease;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
`;



const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('realtime');

  const mainViews = [
    {
      id: 'simple',
      label: 'Dashboard Simples (Teste)',
      icon: Monitor,
      description: 'Dashboard com dados reais da API'
    },
    {
      id: 'realtime',
      label: 'Dashboard Tempo Real',
      icon: Activity,
      description: 'Monitore a atividade em tempo real'
    },
    {
      id: 'analytics',
      label: 'Análises Avançadas',
      icon: TrendingUp,
      description: 'Relatórios e gráficos detalhados'
    },
    {
      id: 'overview',
      label: 'Visão Geral',
      icon: Monitor,
      description: 'Resumo executivo do sistema'
    }
  ];

  const managementViews = [
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      description: 'Gerenciar alunos e professores'
    },
    {
      id: 'events',
      label: 'Eventos',
      icon: Calendar,
      description: 'Aulas e eventos da academia'
    },
    {
      id: 'products',
      label: 'Produtos',
      icon: ShoppingCart,
      description: 'Catálogo e vendas'
    },
    {
      id: 'gallery',
      label: 'Galeria',
      icon: Image,
      description: 'Fotos e mídia'
    }
  ];

  const systemViews = [
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      description: 'Configurações do sistema'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'realtime':
        return <RealTimeDashboard />;
      
      case 'simple':
        return <SimpleDashboard />;
      
      case 'analytics':
        return (
          <div style={{ padding: '20px' }}>
            <h2 style={{ 
              color: 'white', 
              marginBottom: '20px',
              fontSize: '2rem',
              background: 'linear-gradient(45deg, #fff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Análises Avançadas
            </h2>
            <AdminAnalytics />
          </div>
        );
      
      case 'overview':
        return (
          <div style={{ padding: '20px', color: 'white' }}>
            <h2 style={{ 
              marginBottom: '20px',
              fontSize: '2rem',
              background: 'linear-gradient(45deg, #fff, #e0e7ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Visão Geral do Sistema
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px'
            }}>
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '25px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  248
                </div>
                <div style={{ opacity: 0.8 }}>Alunos Ativos</div>
              </motion.div>
              
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '25px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  12
                </div>
                <div style={{ opacity: 0.8 }}>Eventos Este Mês</div>
              </motion.div>
              
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '25px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  R$ 15.4k
                </div>
                <div style={{ opacity: 0.8 }}>Vendas do Mês</div>
              </motion.div>
              
              <motion.div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: '25px',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  textAlign: 'center'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '10px' }}>
                  94%
                </div>
                <div style={{ opacity: 0.8 }}>Taxa de Presença</div>
              </motion.div>
            </div>
          </div>
        );
      
      default:
        return (
          <div style={{ padding: '20px', color: 'white' }}>
            <h2>Funcionalidade em desenvolvimento</h2>
            <p>Esta seção será implementada em breve.</p>
          </div>
        );
    }
  };

  return (
    <PageContainer>
      <Sidebar>
        <SidebarHeader>
          <h2>Capoeira Pro</h2>
          <p>Painel Admin</p>
        </SidebarHeader>

        <NavSection>
          <SectionTitle>Dashboard</SectionTitle>
          {mainViews.map((view) => (
            <NavItem
              key={view.id}
              active={activeView === view.id}
              onClick={() => setActiveView(view.id)}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <view.icon size={18} />
              <span>{view.label}</span>
            </NavItem>
          ))}
        </NavSection>

        <NavSection>
          <SectionTitle>Gerenciamento</SectionTitle>
          {managementViews.map((view) => (
            <NavItem
              key={view.id}
              active={activeView === view.id}
              onClick={() => setActiveView(view.id)}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <view.icon size={18} />
              <span>{view.label}</span>
            </NavItem>
          ))}
        </NavSection>

        <NavSection>
          <SectionTitle>Sistema</SectionTitle>
          {systemViews.map((view) => (
            <NavItem
              key={view.id}
              active={activeView === view.id}
              onClick={() => setActiveView(view.id)}
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <view.icon size={18} />
              <span>{view.label}</span>
            </NavItem>
          ))}
        </NavSection>

        <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
          <div style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            fontSize: '0.8rem',
            textAlign: 'center',
            padding: '10px'
          }}>
            Logado como: <br />
            <strong>{user?.name}</strong>
          </div>
        </div>
      </Sidebar>

      <MainContent>
        {renderContent()}
      </MainContent>
    </PageContainer>
  );
};

export default AdminDashboard;