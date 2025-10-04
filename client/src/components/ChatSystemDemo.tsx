import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const DemoContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const DemoHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const DemoTitle = styled.h1`
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const DemoDescription = styled.p`
  color: #7f8c8d;
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled(motion.div)`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 2rem;
  border-radius: 12px;
  border-left: 4px solid #667eea;
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #5a6c7d;
  line-height: 1.5;
`;

const APISection = styled.div`
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
`;

const APITitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const APIList = styled.div`
  display: grid;
  gap: 1rem;
`;

const APIItem = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #27ae60;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const APIMethod = styled.span<{ method: string }>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.75rem;
  color: white;
  background: ${props => {
    switch(props.method) {
      case 'GET': return '#28a745';
      case 'POST': return '#007bff';
      case 'PATCH': return '#ffc107';
      default: return '#6c757d';
    }
  }};
`;

const APIPath = styled.code`
  font-family: 'Courier New', monospace;
  color: #2c3e50;
  font-weight: 500;
`;

const StatusBadge = styled.span`
  background: #d4edda;
  color: #155724;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const NextStepsSection = styled.div`
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
`;

const NextStepsTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
`;

const NextStepsList = styled.ul`
  text-align: left;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
`;

const ChatSystemDemo: React.FC = () => {
  const [selectedAPI, setSelectedAPI] = useState<string | null>(null);

  const features = [
    {
      icon: "💬",
      title: "Mensagens em Tempo Real",
      description: "Sistema de chat com atualizações automáticas e notificações instantâneas para comunicação entre alunos e instrutores."
    },
    {
      icon: "🏠",
      title: "Salas Organizadas",
      description: "Diferentes salas de chat como Geral, Instrutores, Eventos e Iniciantes para segmentar conversas por tópico."
    },
    {
      icon: "👥",
      title: "Presença Online",
      description: "Visualização de usuários online, status de presença e última atividade para melhor engajamento."
    },
    {
      icon: "🛡️",
      title: "Moderação Avançada",
      description: "Painel administrativo completo com estatísticas, criação de salas e ferramentas de moderação."
    },
    {
      icon: "📊",
      title: "Analytics Detalhado",
      description: "Relatórios de atividade, mensagens por dia, salas mais ativas e métricas de engajamento."
    },
    {
      icon: "🎨",
      title: "Interface Moderna",
      description: "Design responsivo com animações suaves, temas personalizáveis e experiência de usuário intuitiva."
    }
  ];

  const apis = [
    { method: "GET", path: "/api/chat/rooms", description: "Listar salas de chat" },
    { method: "GET", path: "/api/chat/rooms/:roomId/messages", description: "Obter mensagens de uma sala" },
    { method: "POST", path: "/api/chat/rooms/:roomId/messages", description: "Enviar nova mensagem" },
    { method: "GET", path: "/api/chat/online-users", description: "Listar usuários online" },
    { method: "PATCH", path: "/api/chat/users/:userId/status", description: "Atualizar status do usuário" },
    { method: "POST", path: "/api/chat/rooms", description: "Criar nova sala (admin)" },
    { method: "GET", path: "/api/admin/chat/stats", description: "Estatísticas do chat (admin)" }
  ];

  return (
    <DemoContainer>
      <DemoHeader>
        <DemoTitle>Sistema de Chat - Capoeira Nacional</DemoTitle>
        <DemoDescription>
          Sistema completo de mensagens em tempo real para comunicação entre alunos, 
          instrutores e administradores da academia, com salas organizadas e ferramentas 
          avançadas de moderação.
        </DemoDescription>
      </DemoHeader>

      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDescription>{feature.description}</FeatureDescription>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      <APISection>
        <APITitle>APIs Implementadas</APITitle>
        <APIList>
          {apis.map((api, index) => (
            <APIItem
              key={index}
              onClick={() => setSelectedAPI(selectedAPI === api.path ? null : api.path)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <APIMethod method={api.method}>{api.method}</APIMethod>
                <APIPath>{api.path}</APIPath>
              </div>
              <StatusBadge>✅ Implementado</StatusBadge>
            </APIItem>
          ))}
        </APIList>
      </APISection>

      <NextStepsSection>
        <NextStepsTitle>Status da Implementação</NextStepsTitle>
        <NextStepsList>
          <li>✅ <strong>Backend APIs:</strong> 7 endpoints completos para chat, salas e moderação</li>
          <li>✅ <strong>Dados Mock:</strong> Mensagens, salas e usuários de exemplo implementados</li>
          <li>✅ <strong>Interface de Chat:</strong> Componente React completo com design moderno</li>
          <li>✅ <strong>Painel Admin:</strong> Gestão de salas, estatísticas e ferramentas de moderação</li>
          <li>✅ <strong>Integração:</strong> Chat integrado no dashboard administrativo</li>
          <li>🔄 <strong>WebSocket:</strong> Socket.IO para comunicação em tempo real (em progresso)</li>
          <li>⏳ <strong>Notificações:</strong> Sistema de notificações push para novas mensagens</li>
          <li>⏳ <strong>Anexos:</strong> Suporte para envio de imagens e arquivos</li>
        </NextStepsList>
      </NextStepsSection>
    </DemoContainer>
  );
};

export default ChatSystemDemo;