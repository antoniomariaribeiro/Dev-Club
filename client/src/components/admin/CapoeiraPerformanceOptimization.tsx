import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Zap,
  Database,
  Monitor,
  Cpu,
  HardDrive,
  Activity,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const Container = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
`;

const PerformanceCard = styled(motion.div)`
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusIndicator = styled.div<{ status: 'good' | 'warning' | 'critical' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => {
    switch (props.status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
    }
  }};
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin: 10px 0;
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  margin: 10px 0;
  overflow: hidden;
`;

const Progress = styled(motion.div)<{ value: number; color: string }>`
  height: 100%;
  width: ${props => props.value}%;
  background: ${props => props.color};
  border-radius: 3px;
`;

const OptimizationList = styled.div`
  margin-top: 15px;
`;

const OptimizationItem = styled(motion.div)<{ implemented: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 8px;
  color: ${props => props.implemented ? '#10b981' : 'rgba(255, 255, 255, 0.8)'};
  border-left: 3px solid ${props => props.implemented ? '#10b981' : '#f59e0b'};
`;

const OptimizeButton = styled(motion.button)`
  background: linear-gradient(45deg, #10b981, #059669);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 16px;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  width: 100%;
  justify-content: center;
`;

const LoadingSpinner = styled(motion.div)`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
`;

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  databaseQueries: number;
  cacheHitRate: number;
  memoryUsage: number;
  cpuUsage: number;
  networkLatency: number;
  bundleSize: number;
}

const CapoeiraPerformanceOptimization: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 2.3,
    apiResponseTime: 150,
    databaseQueries: 12,
    cacheHitRate: 78,
    memoryUsage: 65,
    cpuUsage: 42,
    networkLatency: 45,
    bundleSize: 1.2
  });

  const [optimizing, setOptimizing] = useState<string | null>(null);
  const [implementedOptimizations, setImplementedOptimizations] = useState<Set<string>>(
    new Set(['lazy-loading', 'image-compression'])
  );

  // Simulação de métricas em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        apiResponseTime: Math.max(50, prev.apiResponseTime + (Math.random() - 0.5) * 20),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        cpuUsage: Math.max(20, Math.min(80, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        networkLatency: Math.max(20, prev.networkLatency + (Math.random() - 0.5) * 10)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Função para otimizar performance
  const optimizeFeature = useCallback(async (feature: string) => {
    setOptimizing(feature);
    
    // Simular otimização
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setImplementedOptimizations(prev => {
      const newSet = new Set(prev);
      newSet.add(feature);
      return newSet;
    });
    
    // Melhorar métricas após otimização
    switch (feature) {
      case 'database-optimization':
        setMetrics(prev => ({
          ...prev,
          apiResponseTime: prev.apiResponseTime * 0.7,
          databaseQueries: Math.max(3, prev.databaseQueries - 3)
        }));
        break;
      case 'caching':
        setMetrics(prev => ({
          ...prev,
          cacheHitRate: Math.min(95, prev.cacheHitRate + 15),
          pageLoadTime: prev.pageLoadTime * 0.8
        }));
        break;
      case 'bundle-optimization':
        setMetrics(prev => ({
          ...prev,
          bundleSize: prev.bundleSize * 0.6,
          pageLoadTime: prev.pageLoadTime * 0.7
        }));
        break;
      case 'cdn':
        setMetrics(prev => ({
          ...prev,
          networkLatency: prev.networkLatency * 0.5,
          pageLoadTime: prev.pageLoadTime * 0.8
        }));
        break;
    }
    
    setOptimizing(null);
  }, []);

  // Memoizar status das métricas
  const performanceStatus = useMemo(() => {
    const getStatus = (value: number, thresholds: { good: number; warning: number }) => {
      if (value <= thresholds.good) return 'good';
      if (value <= thresholds.warning) return 'warning';
      return 'critical';
    };

    return {
      pageLoad: getStatus(metrics.pageLoadTime, { good: 2, warning: 4 }),
      apiResponse: getStatus(metrics.apiResponseTime, { good: 100, warning: 300 }),
      memory: getStatus(metrics.memoryUsage, { good: 70, warning: 85 }),
      cpu: getStatus(metrics.cpuUsage, { good: 50, warning: 75 })
    };
  }, [metrics]);

  const optimizations = [
    {
      id: 'lazy-loading',
      name: 'Lazy Loading de Componentes',
      description: 'Carregamento sob demanda de componentes',
      impact: 'Alto'
    },
    {
      id: 'image-compression',
      name: 'Compressão de Imagens',
      description: 'Otimização automática de imagens',
      impact: 'Médio'
    },
    {
      id: 'database-optimization',
      name: 'Otimização de Queries',
      description: 'Indexação e otimização de consultas',
      impact: 'Alto'
    },
    {
      id: 'caching',
      name: 'Sistema de Cache',
      description: 'Cache de dados e componentes',
      impact: 'Alto'
    },
    {
      id: 'bundle-optimization',
      name: 'Code Splitting',
      description: 'Divisão inteligente do bundle',
      impact: 'Médio'
    },
    {
      id: 'cdn',
      name: 'CDN Implementation',
      description: 'Distribuição global de conteúdo',
      impact: 'Alto'
    }
  ];

  return (
    <Container
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tempo de Carregamento */}
      <PerformanceCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <Zap size={20} />
            Tempo de Carregamento
          </CardTitle>
          <StatusIndicator status={performanceStatus.pageLoad as 'good' | 'warning' | 'critical'} />
        </CardHeader>
        
        <MetricValue>{metrics.pageLoadTime.toFixed(1)}s</MetricValue>
        <MetricLabel>Carregamento da página</MetricLabel>
        
        <ProgressBar>
          <Progress 
            value={Math.min(100, (5 - metrics.pageLoadTime) * 20)}
            color={performanceStatus.pageLoad === 'good' ? '#10b981' : 
                   performanceStatus.pageLoad === 'warning' ? '#f59e0b' : '#ef4444'}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (5 - metrics.pageLoadTime) * 20)}%` }}
            transition={{ duration: 1 }}
          />
        </ProgressBar>
      </PerformanceCard>

      {/* API Response Time */}
      <PerformanceCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <Database size={20} />
            Tempo de API
          </CardTitle>
          <StatusIndicator status={performanceStatus.apiResponse as 'good' | 'warning' | 'critical'} />
        </CardHeader>
        
        <MetricValue>{Math.round(metrics.apiResponseTime)}ms</MetricValue>
        <MetricLabel>Resposta da API</MetricLabel>
        
        <ProgressBar>
          <Progress 
            value={Math.max(0, 100 - metrics.apiResponseTime / 5)}
            color={performanceStatus.apiResponse === 'good' ? '#10b981' : 
                   performanceStatus.apiResponse === 'warning' ? '#f59e0b' : '#ef4444'}
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, 100 - metrics.apiResponseTime / 5)}%` }}
            transition={{ duration: 1 }}
          />
        </ProgressBar>
      </PerformanceCard>

      {/* Uso de Memória */}
      <PerformanceCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <Monitor size={20} />
            Memória
          </CardTitle>
          <StatusIndicator status={performanceStatus.memory as 'good' | 'warning' | 'critical'} />
        </CardHeader>
        
        <MetricValue>{Math.round(metrics.memoryUsage)}%</MetricValue>
        <MetricLabel>Uso de memória</MetricLabel>
        
        <ProgressBar>
          <Progress 
            value={metrics.memoryUsage}
            color={performanceStatus.memory === 'good' ? '#10b981' : 
                   performanceStatus.memory === 'warning' ? '#f59e0b' : '#ef4444'}
            initial={{ width: 0 }}
            animate={{ width: `${metrics.memoryUsage}%` }}
            transition={{ duration: 1 }}
          />
        </ProgressBar>
      </PerformanceCard>

      {/* Cache Hit Rate */}
      <PerformanceCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <HardDrive size={20} />
            Cache
          </CardTitle>
          <StatusIndicator status={metrics.cacheHitRate > 80 ? 'good' : 'warning'} />
        </CardHeader>
        
        <MetricValue>{Math.round(metrics.cacheHitRate)}%</MetricValue>
        <MetricLabel>Taxa de acerto do cache</MetricLabel>
        
        <ProgressBar>
          <Progress 
            value={metrics.cacheHitRate}
            color={metrics.cacheHitRate > 80 ? '#10b981' : '#f59e0b'}
            initial={{ width: 0 }}
            animate={{ width: `${metrics.cacheHitRate}%` }}
            transition={{ duration: 1 }}
          />
        </ProgressBar>
      </PerformanceCard>

      {/* CPU Usage */}
      <PerformanceCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CardHeader>
          <CardTitle>
            <Cpu size={20} />
            CPU
          </CardTitle>
          <StatusIndicator status={performanceStatus.cpu as 'good' | 'warning' | 'critical'} />
        </CardHeader>
        
        <MetricValue>{Math.round(metrics.cpuUsage)}%</MetricValue>
        <MetricLabel>Uso da CPU</MetricLabel>
        
        <ProgressBar>
          <Progress 
            value={metrics.cpuUsage}
            color={performanceStatus.cpu === 'good' ? '#10b981' : 
                   performanceStatus.cpu === 'warning' ? '#f59e0b' : '#ef4444'}
            initial={{ width: 0 }}
            animate={{ width: `${metrics.cpuUsage}%` }}
            transition={{ duration: 1 }}
          />
        </ProgressBar>
      </PerformanceCard>

      {/* Otimizações Disponíveis */}
      <PerformanceCard
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ gridColumn: 'span 2' }}
      >
        <CardHeader>
          <CardTitle>
            <Activity size={20} />
            Otimizações de Performance
          </CardTitle>
        </CardHeader>
        
        <OptimizationList>
          {optimizations.map((opt) => (
            <OptimizationItem
              key={opt.id}
              implemented={implementedOptimizations.has(opt.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              {implementedOptimizations.has(opt.id) ? (
                <CheckCircle size={16} />
              ) : (
                <AlertTriangle size={16} />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600' }}>{opt.name}</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{opt.description}</div>
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                Impacto: {opt.impact}
              </div>
              {!implementedOptimizations.has(opt.id) && (
                <OptimizeButton
                  onClick={() => optimizeFeature(opt.id)}
                  disabled={optimizing === opt.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    width: 'auto',
                    marginTop: 0,
                    marginLeft: '10px',
                    opacity: optimizing === opt.id ? 0.7 : 1 
                  }}
                >
                  {optimizing === opt.id ? (
                    <>
                      <LoadingSpinner
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Otimizando...
                    </>
                  ) : (
                    <>
                      <Zap size={14} />
                      Otimizar
                    </>
                  )}
                </OptimizeButton>
              )}
            </OptimizationItem>
          ))}
        </OptimizationList>
      </PerformanceCard>
    </Container>
  );
};

export default CapoeiraPerformanceOptimization;