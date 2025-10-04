import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import api from '../../services/api';

interface Payment {
  id: string;
  stripe_payment_intent_id: string;
  user_id: number;
  user_name: string;
  user_email: string;
  event_id: number;
  event_title: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_method_details: any;
  description: string;
  receipt_email: string;
  created_at: string;
  updated_at: string;
}

interface PaymentStats {
  total_payments: number;
  succeeded_payments: number;
  pending_payments: number;
  failed_payments: number;
  total_revenue: number;
  average_ticket: number;
  monthly_revenue: Record<string, number>;
  success_rate: string;
}

const Container = styled.div`
  padding: 0;
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatCardNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatCardLabel = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const PaymentsTable = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 150px 120px 120px 100px 80px 120px;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
  border-bottom: 1px solid #e9ecef;
`;

const TableRow = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 150px 120px 120px 100px 80px 120px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  align-items: center;
  
  &:hover {
    background: #f8f9fa;
  }
`;

const PaymentUser = styled.div`
  .name {
    font-weight: 600;
    color: #212529;
    margin-bottom: 0.25rem;
  }
  
  .email {
    font-size: 0.75rem;
    color: #6c757d;
  }
`;

const EventInfo = styled.div`
  font-size: 0.875rem;
  color: #495057;
`;

const Amount = styled.div`
  font-weight: 600;
  color: #28a745;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  
  background: ${props => {
    switch (props.status) {
      case 'succeeded': return '#d4edda';
      case 'requires_payment_method': return '#fff3cd';
      case 'processing': return '#d1ecf1';
      case 'canceled': return '#f8d7da';
      case 'refunded': return '#e2e3e5';
      default: return '#f8f9fa';
    }
  }};
  
  color: ${props => {
    switch (props.status) {
      case 'succeeded': return '#155724';
      case 'requires_payment_method': return '#856404';
      case 'processing': return '#0c5460';
      case 'canceled': return '#721c24';
      case 'refunded': return '#383d41';
      default: return '#6c757d';
    }
  }};
`;

const PaymentMethod = styled.div`
  font-size: 0.75rem;
  color: #6c757d;
`;

const ActionButton = styled.button<{ variant: 'danger' | 'info' }>`
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  background: ${props => props.variant === 'danger' ? '#dc3545' : '#17a2b8'};
  color: white;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #64748b;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AdminPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isRefunding, setIsRefunding] = useState<string | null>(null);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '20',
        ...(statusFilter && { status: statusFilter })
      });

      const response = await api.get(`/admin/payments?${params}`);
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  const loadStats = useCallback(async () => {
    try {
      const response = await api.get('/admin/payments/stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, []);

  useEffect(() => {
    loadPayments();
    loadStats();
  }, [loadPayments, loadStats]);

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm('Tem certeza que deseja reembolsar este pagamento?')) {
      return;
    }

    try {
      setIsRefunding(paymentId);
      await api.post(`/admin/payments/${paymentId}/refund`, {
        reason: 'requested_by_customer'
      });
      
      // Recarregar dados
      loadPayments();
      loadStats();
      
      alert('Reembolso processado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao processar reembolso:', error);
      alert(error.response?.data?.error || 'Erro ao processar reembolso');
    } finally {
      setIsRefunding(null);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'succeeded': return 'Pago';
      case 'requires_payment_method': return 'Pendente';
      case 'processing': return 'Processando';
      case 'canceled': return 'Cancelado';
      case 'refunded': return 'Reembolsado';
      default: return status;
    }
  };

  return (
    <Container>
      {stats && (
        <StatsCards>
          <StatCard
            style={{ borderLeftColor: '#007bff' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCardNumber style={{ color: '#007bff' }}>{stats.total_payments}</StatCardNumber>
            <StatCardLabel>Total de Pagamentos</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#28a745' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCardNumber style={{ color: '#28a745' }}>{stats.succeeded_payments}</StatCardNumber>
            <StatCardLabel>Pagamentos Confirmados</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#ffc107' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCardNumber style={{ color: '#e0a800' }}>
              {formatPrice(stats.total_revenue)}
            </StatCardNumber>
            <StatCardLabel>Receita Total</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#17a2b8' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatCardNumber style={{ color: '#17a2b8' }}>{stats.success_rate}%</StatCardNumber>
            <StatCardLabel>Taxa de Sucesso</StatCardLabel>
          </StatCard>
        </StatsCards>
      )}

      <ControlsBar>
        <h2>💳 Gerenciamento de Pagamentos</h2>
        
        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="succeeded">Pagos</option>
          <option value="requires_payment_method">Pendentes</option>
          <option value="processing">Processando</option>
          <option value="canceled">Cancelados</option>
          <option value="refunded">Reembolsados</option>
        </FilterSelect>
      </ControlsBar>

      <PaymentsTable>
        <TableHeader>
          <div>Cliente / Evento</div>
          <div>Valor</div>
          <div>Status</div>
          <div>Método</div>
          <div>Data</div>
          <div>ID</div>
          <div>Ações</div>
        </TableHeader>
        
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            Carregando pagamentos...
          </LoadingContainer>
        ) : payments.length === 0 ? (
          <LoadingContainer>
            Nenhum pagamento encontrado
          </LoadingContainer>
        ) : (
          payments.map((payment, index) => (
            <TableRow
              key={payment.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div>
                <PaymentUser>
                  <div className="name">{payment.user_name}</div>
                  <div className="email">{payment.user_email}</div>
                </PaymentUser>
                <EventInfo>{payment.event_title}</EventInfo>
              </div>
              
              <Amount>{formatPrice(payment.amount)}</Amount>
              
              <StatusBadge status={payment.status}>
                {getStatusLabel(payment.status)}
              </StatusBadge>
              
              <PaymentMethod>
                {payment.payment_method === 'card' ? '💳 Cartão' : 
                 payment.payment_method === 'pix' ? '🔸 PIX' : 
                 payment.payment_method}
                {payment.payment_method_details?.card && (
                  <div>**** {payment.payment_method_details.card.last4}</div>
                )}
              </PaymentMethod>
              
              <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                {formatDate(payment.created_at)}
              </div>
              
              <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                {payment.id.slice(-8)}
              </div>
              
              <div>
                {payment.status === 'succeeded' && (
                  <ActionButton
                    variant="danger"
                    onClick={() => handleRefund(payment.id)}
                    disabled={isRefunding === payment.id}
                  >
                    {isRefunding === payment.id ? '...' : 'Reembolsar'}
                  </ActionButton>
                )}
              </div>
            </TableRow>
          ))
        )}
      </PaymentsTable>
    </Container>
  );
};

export default AdminPayments;