import React from 'react';
import styled from 'styled-components';
import { theme, Container } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

const PageContainer = styled.div`
  padding: ${theme.spacing.xxl} 0;
  min-height: 60vh;
`;

const WelcomeHeader = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xl};
  
  h1 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.md};
  }
  
  p {
    color: ${theme.colors.text.secondary};
  }
`;

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <PageContainer>
      <Container>
        <WelcomeHeader>
          <h1>Área do Aluno</h1>
          <p>Bem-vindo(a), {user?.name}! Esta é sua área pessoal.</p>
          <p style={{ marginTop: theme.spacing.md, fontStyle: 'italic' }}>
            Painel do aluno em desenvolvimento...
          </p>
        </WelcomeHeader>
      </Container>
    </PageContainer>
  );
};

export default StudentDashboard;