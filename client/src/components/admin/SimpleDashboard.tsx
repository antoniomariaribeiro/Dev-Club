import React, { useState, useEffect } from 'react';
import { adminService, AdminStats } from '../../services/admin';

const SimpleDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Buscando estatísticas...');
      
      const data = await adminService.getDashboardStats();
      console.log('✅ Dados recebidos:', data);
      
      setStats(data);
    } catch (err: any) {
      console.error('❌ Erro ao buscar estatísticas:', err);
      setError(err.response?.data?.message || err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>⏳ Carregando estatísticas...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>❌ Erro</h2>
        <p style={{ color: '#ef4444' }}>{error}</p>
        <button 
          onClick={fetchStats}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🔄 Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2>📊 Dashboard - Estatísticas Reais</h2>
      
      {stats && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>👥 Usuários</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalUsers}</p>
            <small>Novos este mês: {stats.newUsersThisMonth}</small>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>📅 Eventos</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalEvents}</p>
            <small>Ativos: {stats.activeEvents}</small>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>🛍️ Produtos</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalProducts}</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>📞 Contatos</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>{stats.totalContacts}</p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '20px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h3>💰 Receita Total</h3>
            <p style={{ fontSize: '2rem', margin: '10px 0' }}>
              R$ {(stats.totalRevenue || 0).toLocaleString('pt-BR', { 
                minimumFractionDigits: 2,
                maximumFractionDigits: 2 
              })}
            </p>
            <small>Este mês: R$ {(stats.monthlyRevenue || 0).toLocaleString('pt-BR', { 
              minimumFractionDigits: 2,
              maximumFractionDigits: 2 
            })}</small>
          </div>
        </div>
      )}
      
      <button 
        onClick={fetchStats}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        🔄 Atualizar Dados
      </button>
    </div>
  );
};

export default SimpleDashboard;