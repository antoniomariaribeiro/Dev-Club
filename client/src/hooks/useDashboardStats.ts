import { useState, useEffect } from 'react';
import api from '../services/api';

interface DashboardStats {
  totalUsers: number;
  activeEvents: number;
  totalProducts: number;
  totalPhotos: number;
  monthlyRevenue: number;
  newContacts: number;
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeEvents: 0,
    totalProducts: 0,
    totalPhotos: 0,
    monthlyRevenue: 0,
    newContacts: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/dashboard/stats');
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
        setError('Erro ao carregar estatísticas');
        // Manter valores padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};