import { useState, useEffect } from 'react';
import { adminService, AdminStats } from '../services/admin';

interface UseDashboardStatsReturn {
  stats: AdminStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas:', err);
      setError(err.response?.data?.message || 'Erro ao carregar estatísticas');
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch };
};

interface UseChartDataReturn {
  data: any;
  loading: boolean;
  error: string | null;
  refetch: (type: 'users' | 'events' | 'revenue', period: string) => void;
}

export const useChartData = (initialType: 'users' | 'events' | 'revenue', initialPeriod: string = '30d'): UseChartDataReturn => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChartData = async (type: 'users' | 'events' | 'revenue', period: string) => {
    try {
      setLoading(true);
      setError(null);
      const chartData = await adminService.getChartData(type, period);
      setData(chartData);
    } catch (err: any) {
      console.error('Erro ao buscar dados do gráfico:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dados do gráfico');
    } finally {
      setLoading(false);
    }
  };

  const refetch = (type: 'users' | 'events' | 'revenue', period: string) => {
    fetchChartData(type, period);
  };

  useEffect(() => {
    fetchChartData(initialType, initialPeriod);
  }, [initialType, initialPeriod]);

  return { data, loading, error, refetch };
};