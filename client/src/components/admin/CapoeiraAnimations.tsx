import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Users, 
  Calendar,
  TrendingUp,
  Heart
} from 'lucide-react';

// Animações específicas
const berimbauSway = keyframes`
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
`;

const gingazoom = keyframes`
  0%, 100% { transform: scale(1) rotate(0deg); }
  25% { transform: scale(1.05) rotate(-1deg); }
  50% { transform: scale(1.1) rotate(0deg); }
  75% { transform: scale(1.05) rotate(1deg); }
`;

const cordaoFlow = keyframes`
  0% { 
    transform: translateY(0px) rotate(0deg);
    filter: hue-rotate(0deg);
  }
  33% { 
    transform: translateY(-5px) rotate(120deg);
    filter: hue-rotate(120deg);
  }
  66% { 
    transform: translateY(5px) rotate(240deg);
    filter: hue-rotate(240deg);
  }
  100% { 
    transform: translateY(0px) rotate(360deg);
    filter: hue-rotate(360deg);
  }
`;

const ataqueFlow = keyframes`
  0%, 100% { 
    transform: translateX(0px) scaleX(1);
    opacity: 0.8;
  }
  50% { 
    transform: translateX(10px) scaleX(1.1);
    opacity: 1;
  }
`;

const Container = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  padding: 20px 0;
`;

const AnimationCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  border-radius: 20px;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6b35, #f7931e, #ffcd3c);
    animation: ${cordaoFlow} 3s infinite;
  }
`;

const IconContainer = styled(motion.div)<{ color: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  animation: ${gingazoom} 4s infinite ease-in-out;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const StatNumber = styled(motion.h3)`
  font-size: 2.5rem;
  font-weight: bold;
  margin: 10px 0;
  background: linear-gradient(45deg, #fff, #ff6b35, #f7931e);
  background-size: 200% 200%;
  animation: ${cordaoFlow} 2s infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  margin: 0;
  font-weight: 500;
`;

const PerformanceBar = styled(motion.div)`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin: 15px 0;
  overflow: hidden;
  position: relative;
`;

const PerformanceProgress = styled(motion.div)<{ width: number; color: string }>`
  height: 100%;
  width: ${props => props.width}%;
  background: ${props => props.color};
  border-radius: 10px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: ${ataqueFlow} 2s infinite;
  }
`;

const BerimbauIcon = styled.div`
  font-size: 2rem;
  animation: ${berimbauSway} 3s infinite ease-in-out;
  margin: 10px 0;
`;

const GradaçãoIndicator = styled(motion.div)<{ level: number }>`
  display: flex;
  align-items: center;
  margin: 10px 0;
  
  .cordao {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    background: ${props => {
      const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#000000'];
      return colors[props.level % colors.length];
    }};
    animation: ${cordaoFlow} 3s infinite;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  }
  
  .level-text {
    color: white;
    font-weight: 600;
  }
`;

interface AnimationStats {
  totalUsers: number;
  activeEvents: number;
  revenue: number;
  newRegistrations: number;
}

interface Props {
  stats: AnimationStats;
}

const CapoeiraAnimations: React.FC<Props> = ({ stats }) => {
  const [animationTrigger, setAnimationTrigger] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger(prev => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Variantes simplificadas para evitar conflitos de tipo
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const cardVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  const numberVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1 }
  };

  return (
    <Container
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      key={animationTrigger}
    >
      {/* Alunos Ativos */}
      <AnimationCard
        variants={cardVariants}
        whileHover={{ 
          scale: 1.05,
          rotateY: 5,
          z: 50
        }}
        whileTap={{ scale: 0.95 }}
      >
        <IconContainer 
          color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
        >
          <Users color="white" size={28} />
        </IconContainer>
        
        <StatNumber
          variants={numberVariants}
          whileHover={{ scale: 1.1 }}
        >
          {stats.totalUsers}
        </StatNumber>
        <StatLabel>Capoeiristas Ativos</StatLabel>
        
        <PerformanceBar>
          <PerformanceProgress 
            width={85}
            color="linear-gradient(90deg, #667eea, #764ba2)"
            initial={{ width: 0 }}
            animate={{ width: 85 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </PerformanceBar>
        
        <BerimbauIcon>🪘</BerimbauIcon>
      </AnimationCard>

      {/* Eventos/Rodas */}
      <AnimationCard
        variants={cardVariants}
        whileHover={{ 
          scale: 1.05,
          rotateY: -5,
          z: 50
        }}
      >
        <IconContainer 
          color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
          whileHover={{ rotate: -360 }}
          transition={{ duration: 0.8 }}
        >
          <Calendar color="white" size={28} />
        </IconContainer>
        
        <StatNumber
          variants={numberVariants}
          whileHover={{ scale: 1.1 }}
        >
          {stats.activeEvents}
        </StatNumber>
        <StatLabel>Rodas e Eventos</StatLabel>
        
        <PerformanceBar>
          <PerformanceProgress 
            width={92}
            color="linear-gradient(90deg, #f093fb, #f5576c)"
            initial={{ width: 0 }}
            animate={{ width: 92 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
        </PerformanceBar>
        
        <GradaçãoIndicator level={2}>
          <div className="cordao"></div>
          <span className="level-text">Próxima Roda</span>
        </GradaçãoIndicator>
      </AnimationCard>

      {/* Receita/Mensalidades */}
      <AnimationCard
        variants={cardVariants}
        whileHover={{ 
          scale: 1.05,
          rotateY: 5,
          z: 50
        }}
      >
        <IconContainer 
          color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
          whileHover={{ 
            rotate: 360,
            scale: 1.2 
          }}
          transition={{ duration: 0.8 }}
        >
          <Trophy color="white" size={28} />
        </IconContainer>
        
        <StatNumber
          variants={numberVariants}
          whileHover={{ scale: 1.1 }}
        >
          R$ {(stats.revenue / 1000).toFixed(1)}k
        </StatNumber>
        <StatLabel>Receita Mensal</StatLabel>
        
        <PerformanceBar>
          <PerformanceProgress 
            width={78}
            color="linear-gradient(90deg, #4facfe, #00f2fe)"
            initial={{ width: 0 }}
            animate={{ width: 78 }}
            transition={{ duration: 2, delay: 1.4 }}
          />
        </PerformanceBar>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          🥇
        </motion.div>
      </AnimationCard>

      {/* Novos Alunos */}
      <AnimationCard
        variants={cardVariants}
        whileHover={{ 
          scale: 1.05,
          rotateY: -5,
          z: 50
        }}
      >
        <IconContainer 
          color="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          whileHover={{ 
            rotate: 360,
            boxShadow: "0 20px 40px rgba(250, 112, 154, 0.4)" 
          }}
          transition={{ duration: 0.8 }}
        >
          <Star color="white" size={28} />
        </IconContainer>
        
        <StatNumber
          variants={numberVariants}
          whileHover={{ scale: 1.1 }}
        >
          +{stats.newRegistrations}
        </StatNumber>
        <StatLabel>Novos Capoeiristas</StatLabel>
        
        <PerformanceBar>
          <PerformanceProgress 
            width={95}
            color="linear-gradient(90deg, #fa709a, #fee140)"
            initial={{ width: 0 }}
            animate={{ width: 95 }}
            transition={{ duration: 2, delay: 1.6 }}
          />
        </PerformanceBar>
        
        <GradaçãoIndicator level={0}>
          <div className="cordao"></div>
          <span className="level-text">Cordão Crua</span>
        </GradaçãoIndicator>
      </AnimationCard>

      {/* Performance Geral */}
      <AnimationCard
        variants={cardVariants}
        whileHover={{ 
          scale: 1.05,
          rotateY: 5,
          z: 50
        }}
      >
        <IconContainer 
          color="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
          whileHover={{ 
            rotate: 360,
            scale: 1.3
          }}
          transition={{ duration: 0.8 }}
        >
          <TrendingUp color="white" size={28} />
        </IconContainer>
        
        <StatNumber
          variants={numberVariants}
          whileHover={{ scale: 1.1 }}
        >
          94%
        </StatNumber>
        <StatLabel>Performance da Academia</StatLabel>
        
        <PerformanceBar>
          <PerformanceProgress 
            width={94}
            color="linear-gradient(90deg, #a8edea, #fed6e3)"
            initial={{ width: 0 }}
            animate={{ width: 94 }}
            transition={{ duration: 2, delay: 1.8 }}
          />
        </PerformanceBar>
        
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ⚡
        </motion.div>
      </AnimationCard>

      {/* Satisfação dos Alunos */}
      <AnimationCard
        variants={cardVariants}
        whileHover={{ 
          scale: 1.05,
          rotateY: -5,
          z: 50
        }}
      >
        <IconContainer 
          color="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
          whileHover={{ 
            rotate: 360,
            boxShadow: "0 20px 40px rgba(252, 182, 159, 0.4)"
          }}
          transition={{ duration: 0.8 }}
        >
          <Heart color="white" size={28} />
        </IconContainer>
        
        <StatNumber
          variants={numberVariants}
          whileHover={{ scale: 1.1 }}
        >
          98%
        </StatNumber>
        <StatLabel>Satisfação dos Alunos</StatLabel>
        
        <PerformanceBar>
          <PerformanceProgress 
            width={98}
            color="linear-gradient(90deg, #ffecd2, #fcb69f)"
            initial={{ width: 0 }}
            animate={{ width: 98 }}
            transition={{ duration: 2, delay: 2 }}
          />
        </PerformanceBar>
        
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💚 Axé!
        </motion.div>
      </AnimationCard>
    </Container>
  );
};

export default CapoeiraAnimations;