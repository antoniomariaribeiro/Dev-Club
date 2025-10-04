import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Users, Calendar, ShoppingCart, Image, BarChart3, Settings, UserCheck, CreditCard } from 'lucide-react';
import { theme, Container } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  padding: ${theme.spacing.xl} 0;
  min-height: 90vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const WelcomeHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  
  h1 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.md};
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  p {
    color: ${theme.colors.text.secondary};
    font-size: 1.1rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: ${theme.spacing.lg};
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};
  border-left: 4px solid ${props => props.color || theme.colors.primary};
`;

const StatIcon = styled.div`
  background: ${props => props.color}20;
  color: ${props => props.color};
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatInfo = styled.div`
  flex: 1;
  
  h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: ${theme.colors.text.primary};
    margin-bottom: 4px;
  }
  
  p {
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
  }
`;

const QuickActionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xxl};
`;

const ActionCard = styled(motion.div)`
  background: white;
  padding: ${theme.spacing.lg};
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${theme.spacing.md};
`;

const ActionTitle = styled.h3`
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing.sm};
  font-size: 1.1rem;
`;

const ActionDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  const stats = [
    {
      icon: Users,
      title: '248',
      description: 'Alunos Ativos',
      color: '#2E7D32'
    },
    {
      icon: Calendar,
      title: '12',
      description: 'Eventos Este Mês',
      color: '#1976D2'
    },
    {
      icon: ShoppingCart,
      title: 'R$ 15.420',
      description: 'Vendas do Mês',
      color: '#F57C00'
    },
    {
      icon: UserCheck,
      title: '94%',
      description: 'Taxa de Presença',
      color: '#7B1FA2'
    }
  ];

  const quickActions = [
    {
      icon: Users,
      title: 'Gerenciar Usuários',
      description: 'Adicionar, editar e visualizar alunos',
      action: 'users'
    },
    {
      icon: Calendar,
      title: 'Eventos & Aulas',
      description: 'Criar e gerenciar eventos',
      action: 'events'
    },
    {
      icon: CreditCard,
      title: 'Pagamentos',
      description: 'Gerenciar transações e reembolsos',
      action: 'payments'
    },
    {
      icon: ShoppingCart,
      title: 'Loja & Produtos',
      description: 'Gerenciar catálogo de produtos',
      action: 'products'
    },
    {
      icon: Image,
      title: 'Galeria de Fotos',
      description: 'Adicionar fotos de eventos',
      action: 'gallery'
    },
    {
      icon: BarChart3,
      title: 'Relatórios',
      description: 'Visualizar estatísticas',
      action: 'reports'
    },
    {
      icon: Settings,
      title: 'Configurações',
      description: 'Configurar academia',
      action: 'settings'
    }
  ];

  return (
    <PageContainer>
      <Container>
        <WelcomeHeader>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Painel Administrativo</h1>
            <p>Bem-vindo(a), <strong>{user?.name}</strong>! Gerencie sua Academia Capoeira Nacional</p>
          </motion.div>
        </WelcomeHeader>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              color={stat.color}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <StatIcon color={stat.color}>
                <stat.icon size={24} />
              </StatIcon>
              <StatInfo>
                <h3>{stat.title}</h3>
                <p>{stat.description}</p>
              </StatInfo>
            </StatCard>
          ))}
        </StatsGrid>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 style={{ 
            textAlign: 'center', 
            color: theme.colors.primary, 
            marginBottom: theme.spacing.xl,
            fontSize: '2rem',
            fontWeight: 600
          }}>
            Ações Rápidas
          </h2>
          
          <QuickActionsGrid>
            {quickActions.map((action, index) => (
              <ActionCard
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedAction(action.action)}
              >
                <ActionIcon>
                  <action.icon size={20} />
                </ActionIcon>
                <ActionTitle>{action.title}</ActionTitle>
                <ActionDescription>{action.description}</ActionDescription>
              </ActionCard>
            ))}
          </QuickActionsGrid>
        </motion.div>

        {selectedAction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'white',
              padding: theme.spacing.xl,
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{ color: theme.colors.primary, marginBottom: theme.spacing.md }}>
              Funcionalidade Selecionada
            </h3>
            <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.lg }}>
              Você selecionou: <strong>{quickActions.find(a => a.action === selectedAction)?.title}</strong>
            </p>
            <p style={{ color: theme.colors.text.secondary, fontStyle: 'italic' }}>
              Esta funcionalidade será implementada em breve...
            </p>
            <button
              onClick={() => setSelectedAction(null)}
              style={{
                background: theme.colors.primary,
                color: 'white',
                border: 'none',
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                borderRadius: '8px',
                marginTop: theme.spacing.md,
                cursor: 'pointer'
              }}
            >
              Fechar
            </button>
          </motion.div>
        )}
      </Container>
    </PageContainer>
  );
};

export default AdminDashboard;