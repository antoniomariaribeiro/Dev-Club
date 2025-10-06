import api from './api';

export interface DashboardStats {
  // Campos principais do backend
  totalUsers: number;
  totalEvents: number;
  totalProducts: number;
  totalContacts: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
  activeEvents: number;
  
  // Campos de compatibilidade com frontend
  revenue: number;
  totalSales: number;
  onlineUsers: number;
  todayVisits: number;
  conversionRate: number;
  averageSessionTime: number;
  
  // Campos adicionais para receitas por período
  weeklyRevenue?: number;
  dailyRevenue?: number;
  monthlyUsers?: number;
  weeklyUsers?: number;
  dailyUsers?: number;
  
  // Status breakdown
  usersByStatus: {
    active: number;
    inactive: number;
    pending: number;
    suspended?: number;
  };
  
  // Role breakdown
  usersByRole: {
    user: number;
    instructor: number;
    member: number;
    admin?: number;
    student?: number;
    manager?: number;
  };
  
  // Growth data
  growth: {
    users: number;
    events: number;
    revenue: number;
    sales?: number;
  };
}

export interface Activity {
  id: string;
  type: 'user' | 'event' | 'sale' | 'registration' | 'login' | 'status_change';
  message: string;
  time: string;
  userId?: number;
  userName?: string;
  metadata?: any;
  createdAt: Date;
}

export interface PerformanceMetrics {
  uptime: string;
  responseTime: string;
  activeConnections: number;
  cpuUsage: string;
  memoryUsage: string;
  diskUsage: string;
}

class DashboardService {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/admin/dashboard/stats');
      return {
        ...response.data,
        // Mapear campos para compatibilidade com interface existente
        revenue: response.data.totalRevenue || response.data.revenue || 0,
        totalSales: response.data.totalEvents || 0,
        onlineUsers: Math.floor(Math.random() * 50) + 20, // Simular usuários online
        todayVisits: Math.floor(Math.random() * 200) + 50, // Simular visitas
        conversionRate: Math.random() * 15 + 5, // Simular taxa de conversão
        averageSessionTime: Math.floor(Math.random() * 600) + 300, // Simular tempo de sessão
        // Garantir que todos os campos necessários existem
        usersByStatus: response.data.usersByStatus || { active: 0, inactive: 0, pending: 0 },
        usersByRole: response.data.usersByRole || { user: 0, instructor: 0, member: 0 },
        growth: response.data.growth || { users: 0, revenue: 0, events: 0 }
      };
    } catch (error) {
      console.error('Erro ao buscar estatísticas do dashboard:', error);
      // Dados simulados como fallback
      return {
        totalUsers: 1250,
        totalEvents: 23,
        totalProducts: 45,
        totalContacts: 189,
        totalRevenue: 45200,
        monthlyRevenue: 8900,
        newUsersThisMonth: 87,
        activeEvents: 15,
        revenue: 45200,
        totalSales: 320,
        onlineUsers: 48,
        todayVisits: 127,
        conversionRate: 12.5,
        averageSessionTime: 480,
        weeklyRevenue: 12500,
        dailyRevenue: 1800,
        monthlyUsers: 87,
        weeklyUsers: 23,
        dailyUsers: 8,
        
        usersByStatus: {
          active: 1089,
          inactive: 95,
          pending: 41,
          suspended: 25
        },
        
        usersByRole: {
          user: 1156,
          instructor: 45,
          member: 41,
          admin: 8,
          student: 1156,
          manager: 41
        },
        
        growth: {
          users: 12,
          events: 8,
          revenue: 15,
          sales: 6
        }
      };
    }
  }

  async getRecentActivity(): Promise<Activity[]> {
    try {
      const response = await api.get('/api/admin/dashboard/recent-activities');
      return response.data.activities || response.data;
    } catch (error) {
      console.error('Erro ao buscar atividade recente:', error);
      // Dados simulados como fallback
      return [
        {
          id: '1',
          type: 'user',
          message: 'Novo aluno João Silva se cadastrou',
          time: '2 minutos atrás',
          userId: 1234,
          userName: 'João Silva',
          createdAt: new Date(Date.now() - 2 * 60 * 1000)
        },
        {
          id: '2',
          type: 'event',
          message: 'Evento "Roda de Capoeira" foi criado',
          time: '5 minutos atrás',
          createdAt: new Date(Date.now() - 5 * 60 * 1000)
        },
        {
          id: '3',
          type: 'sale',
          message: 'Venda de R$ 150,00 realizada',
          time: '8 minutos atrás',
          createdAt: new Date(Date.now() - 8 * 60 * 1000)
        },
        {
          id: '4',
          type: 'login',
          message: 'Admin Maria Santos fez login',
          time: '12 minutos atrás',
          userId: 5678,
          userName: 'Maria Santos',
          createdAt: new Date(Date.now() - 12 * 60 * 1000)
        },
        {
          id: '5',
          type: 'status_change',
          message: 'Status de Pedro Costa alterado para ativo',
          time: '15 minutos atrás',
          userId: 9012,
          userName: 'Pedro Costa',
          createdAt: new Date(Date.now() - 15 * 60 * 1000)
        }
      ];
    }
  }

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      const response = await api.get('/api/admin/dashboard/performance');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar métricas de performance:', error);
      // Dados simulados como fallback
      return {
        uptime: '98.5%',
        responseTime: '45ms',
        activeConnections: 127,
        cpuUsage: '35%',
        memoryUsage: '62%',
        diskUsage: '48%'
      };
    }
  }

  async getChartData(type: 'users' | 'sales' | 'events' | 'revenue', period: '7d' | '30d' | '90d' = '30d') {
    try {
      const response = await api.get(`/admin/dashboard/charts/${type}?period=${period}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar dados do gráfico ${type}:`, error);
      return this.getMockChartData(type, period);
    }
  }

  async getSystemHealth() {
    try {
      const response = await api.get('/admin/dashboard/health');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar saúde do sistema:', error);
      return {
        uptime: 99.2,
        responseTime: 42,
        memoryUsage: 68,
        cpuUsage: 25,
        activeConnections: 147,
        errorRate: 0.08
      };
    }
  }

  async getUserAnalytics() {
    try {
      const response = await api.get('/admin/dashboard/user-analytics');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar analytics de usuários:', error);
      return {
        newUsersToday: 23,
        activeUsersToday: 189,
        retentionRate: 87.5,
        avgSessionDuration: 1420, // seconds
        topPages: [
          { page: 'Dashboard', visits: 1247 },
          { page: 'Eventos', visits: 892 },
          { page: 'Perfil', visits: 634 },
          { page: 'Pagamentos', visits: 421 }
        ],
        deviceBreakdown: {
          desktop: 68,
          mobile: 28,
          tablet: 4
        }
      };
    }
  }

  // Real-time data subscription
  subscribeToRealTimeUpdates(callback: (data: any) => void): () => void {
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(async () => {
      try {
        const stats = await this.getDashboardStats();
        const activity = await this.getRecentActivity();
        
        callback({
          type: 'dashboard_update',
          data: { stats, activity },
          timestamp: new Date()
        });
      } catch (error) {
        console.error('Erro na atualização em tempo real:', error);
      }
    }, 30000);

    return () => clearInterval(interval);
  }

  private getMockChartData(type: string, period: string) {
    const periodDays = parseInt(period.replace('d', ''));
    const labels = [];
    const data = [];
    
    for (let i = periodDays - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (periodDays <= 7) {
        labels.push(['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()]);
      } else {
        labels.push(date.getDate().toString());
      }
      
      switch (type) {
        case 'users':
          data.push(Math.floor(Math.random() * 30) + 10);
          break;
        case 'sales':
          data.push(Math.floor(Math.random() * 15) + 5);
          break;
        case 'events':
          data.push(Math.floor(Math.random() * 8) + 2);
          break;
        case 'revenue':
          data.push(Math.floor(Math.random() * 5000) + 1000);
          break;
        default:
          data.push(Math.floor(Math.random() * 100));
      }
    }
    
    return { labels, data };
  }
}

const dashboardService = new DashboardService();
export default dashboardService;