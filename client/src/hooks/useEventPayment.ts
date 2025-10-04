import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: string;
  max_participants: number;
  image_url?: string;
}

interface PaymentData {
  amount: number;
  currency: string;
  event_id: number;
  user_id: number;
  description: string;
  receipt_email: string;
}

interface PaymentIntent {
  client_secret: string;
  id: string;
}

export const useEventPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Inicializar Stripe
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_default');

  const createPaymentIntent = async (paymentData: PaymentData): Promise<PaymentIntent> => {
    try {
      setError(null);
      
      const response = await api.post('/payments/create-payment-intent', paymentData);
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao criar intenção de pagamento');
      }

      return response.data.payment_intent;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao processar pagamento';
      setError(errorMessage);
      throw error;
    }
  };

  const confirmPayment = async (
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/payments/confirm-payment', {
        payment_intent_id: paymentIntentId,
        payment_method_id: paymentMethodId
      });

      if (response.data.success) {
        setSuccess(true);
        return true;
      } else {
        throw new Error(response.data.error || 'Erro ao confirmar pagamento');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao confirmar pagamento';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const processEventPayment = async (
    event: Event,
    userEmail: string,
    userId: number,
    paymentMethodId: string
  ): Promise<{ success: boolean; registrationId?: number }> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // 1. Criar intenção de pagamento
      const paymentData: PaymentData = {
        amount: event.price * 100, // Converter para centavos
        currency: 'brl',
        event_id: event.id,
        user_id: userId,
        description: `Inscrição no evento: ${event.title}`,
        receipt_email: userEmail
      };

      const paymentIntent = await createPaymentIntent(paymentData);

      // 2. Confirmar pagamento
      const paymentConfirmed = await confirmPayment(
        paymentIntent.id,
        paymentMethodId
      );

      if (paymentConfirmed) {
        // 3. Registrar inscrição no evento (isso deve ser feito automaticamente pelo webhook)
        try {
          const registrationResponse = await api.post('/events/register', {
            event_id: event.id
          });
          
          return {
            success: true,
            registrationId: registrationResponse.data.registration?.id
          };
        } catch (registrationError) {
          // Mesmo se a inscrição falhar aqui, o pagamento foi processado
          // O webhook deve resolver isso
          console.warn('Erro ao registrar inscrição, mas pagamento foi processado:', registrationError);
          return { success: true };
        }
      }

      return { success: false };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao processar pagamento do evento';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const calculateEventPrice = (event: Event): { 
    subtotal: number;
    fees: number;
    total: number;
    formattedSubtotal: string;
    formattedFees: string;
    formattedTotal: string;
  } => {
    const subtotal = event.price;
    const fees = Math.round(subtotal * 0.03); // 3% de taxa
    const total = subtotal + fees;

    const formatPrice = (amount: number) => 
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(amount);

    return {
      subtotal,
      fees,
      total,
      formattedSubtotal: formatPrice(subtotal),
      formattedFees: formatPrice(fees),
      formattedTotal: formatPrice(total)
    };
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    // Estados
    loading,
    error,
    success,
    
    // Funções
    createPaymentIntent,
    confirmPayment,
    processEventPayment,
    calculateEventPrice,
    reset,
    
    // Stripe
    stripePromise
  };
};