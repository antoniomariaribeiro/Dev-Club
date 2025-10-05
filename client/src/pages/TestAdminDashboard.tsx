import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 20px;
`;

const WelcomeCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 600px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(45deg, #fff, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.8;
  margin-bottom: 30px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
`;

const FeatureCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  
  h3 {
    color: #ffd700;
    margin-bottom: 10px;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const TestAdminDashboard: React.FC = () => {
  return (
    <PageContainer>
      <WelcomeCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title>🥋 Painel Administrativo</Title>
        <Subtitle>Academia de Capoeira Nacional - Dashboard Funcional</Subtitle>
        
        <FeatureGrid>
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h3>📊 Métricas</h3>
            <p>Acompanhe dados em tempo real da academia</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h3>👥 Usuários</h3>
            <p>Gerencie alunos e instrutores</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h3>📅 Eventos</h3>
            <p>Organize torneios e apresentações</p>
          </FeatureCard>
          
          <FeatureCard
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <h3>🛍️ Produtos</h3>
            <p>Controle estoque de equipamentos</p>
          </FeatureCard>
        </FeatureGrid>
      </WelcomeCard>
    </PageContainer>
  );
};

export default TestAdminDashboard;