import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import api from '../services/api';

// Inicializar Stripe
const stripePromise = loadStripe('pk_test_51234567890abcdef...');

interface CheckoutProps {
  eventId: number;
  eventTitle: string;
  eventPrice: number;
  userId: number;
  userEmail: string;
  userName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutContainer = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 100%;
  margin: 0 auto;
`;

const CheckoutHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h2 {
    color: #2d3748;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #64748b;
    margin: 0;
  }
`;

const EventSummary = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  
  .event-title {
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .event-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #007bff;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const CardElementContainer = styled.div`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  transition: border-color 0.2s;
  
  &:focus-within {
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  .StripeElement {
    height: 20px;
    padding: 10px 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${props => props.variant === 'primary' ? `
    background: #007bff;
    color: white;
    
    &:hover:not(:disabled) {
      background: #0056b3;
    }
    
    &:disabled {
      background: #6c757d;
      cursor: not-allowed;
    }
  ` : `
    background: #e5e7eb;
    color: #374151;
    
    &:hover {
      background: #d1d5db;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '⚠️';
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CheckoutForm: React.FC<CheckoutProps> = ({
  eventId,
  eventTitle,
  eventPrice,
  userId,
  userEmail,
  userName,
  onSuccess,
  onCancel
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    // Criar Payment Intent quando o componente carrega
    const createPaymentIntent = async () => {
      try {
        const response = await api.post('/payments/create-payment-intent', {
          amount: eventPrice * 100, // Converter para centavos
          currency: 'brl',
          event_id: eventId,
          user_id: userId,
          user_email: userEmail,
          description: `Inscrição - ${eventTitle}`
        });

        setClientSecret(response.data.payment_intent.client_secret);
      } catch (error: any) {
        console.error('Erro ao criar Payment Intent:', error);
        setError('Erro ao inicializar pagamento. Tente novamente.');
      }
    };

    createPaymentIntent();
  }, [eventId, eventPrice, userId, userEmail, eventTitle]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Elemento do cartão não encontrado');
      setIsLoading(false);
      return;
    }

    try {
      // Confirmar pagamento com Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: userName,
            email: userEmail
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Confirmar pagamento no backend
        await api.post('/payments/confirm-payment', {
          payment_intent_id: paymentIntent.id,
          event_id: eventId,
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          event_title: eventTitle,
          amount: eventPrice * 100
        });

        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro no pagamento:', error);
      setError(error.message || 'Erro ao processar pagamento');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <CheckoutContainer
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <CheckoutHeader>
        <h2>💳 Finalizar Pagamento</h2>
        <p>Complete sua inscrição de forma segura</p>
      </CheckoutHeader>

      <EventSummary>
        <div className="event-title">{eventTitle}</div>
        <div className="event-price">{formatPrice(eventPrice)}</div>
      </EventSummary>

      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormLabel htmlFor="card-element">
            Informações do Cartão
          </FormLabel>
          <CardElementContainer>
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </CardElementContainer>
        </FormGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonGroup>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!stripe || isLoading || !clientSecret}
          >
            {isLoading && <LoadingSpinner />}
            {isLoading ? 'Processando...' : `Pagar ${formatPrice(eventPrice)}`}
          </Button>
        </ButtonGroup>
      </form>
    </CheckoutContainer>
  );
};

const EventCheckout: React.FC<CheckoutProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export default EventCheckout;