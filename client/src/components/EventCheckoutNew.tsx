import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { useEventPayment } from '../hooks/useEventPayment';
import { useAuth } from '../contexts/AuthContext';

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

interface EventCheckoutProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  padding: 0;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  
  h2 {
    margin: 0 0 0.5rem;
    color: #1f2937;
    font-size: 1.5rem;
    font-weight: 700;
  }
  
  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }
`;

const ModalBody = styled.div`
  padding: 2rem;
`;

const EventSummary = styled.div`
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    margin: 0 0 1rem;
    color: #1f2937;
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

const EventDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    font-weight: 600;
  }
  
  span:first-child {
    color: #6b7280;
  }
  
  span:last-child {
    color: #1f2937;
    font-weight: 500;
  }
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
  }
`;

const CardElementContainer = styled.div`
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  
  .StripeElement {
    width: 100%;
  }
  
  .StripeElement--focus {
    border-color: #3b82f6;
  }
  
  .StripeElement--invalid {
    border-color: #ef4444;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant: 'primary' | 'secondary' }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid #d1d5db'};
  background: ${props => props.variant === 'primary' ? '#3b82f6' : 'white'};
  color: ${props => props.variant === 'primary' ? 'white' : '#374151'};
  
  &:hover {
    background: ${props => props.variant === 'primary' ? '#2563eb' : '#f3f4f6'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-top: 1rem;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff40;
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CheckoutFormComponent: React.FC<{ 
  event: Event; 
  onSuccess: () => void; 
  onClose: () => void;
}> = ({ event, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { 
    loading, 
    error, 
    success, 
    processEventPayment, 
    calculateEventPrice
  } = useEventPayment();
  
  const [processing, setProcessing] = useState(false);
  
  const priceInfo = calculateEventPrice(event);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      return;
    }

    setProcessing(true);

    try {
      // Criar método de pagamento
      const { error: methodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user.name,
          email: user.email,
        },
      });

      if (methodError) {
        throw new Error(methodError.message);
      }

      if (!paymentMethod) {
        throw new Error('Erro ao criar método de pagamento');
      }

      // Processar pagamento do evento
      const result = await processEventPayment(
        event,
        user.email,
        user.id,
        paymentMethod.id
      );

      if (result.success) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Erro no pagamento:', error);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <EventSummary>
        <h3>{event.title}</h3>
        <EventDetail>
          <span>Data:</span>
          <span>{formatDate(event.date)} às {event.time}</span>
        </EventDetail>
        <EventDetail>
          <span>Local:</span>
          <span>{event.location}</span>
        </EventDetail>
        <EventDetail>
          <span>Subtotal:</span>
          <span>{priceInfo.formattedSubtotal}</span>
        </EventDetail>
        <EventDetail>
          <span>Taxa de processamento:</span>
          <span>{priceInfo.formattedFees}</span>
        </EventDetail>
        <EventDetail>
          <span>Total:</span>
          <span>{priceInfo.formattedTotal}</span>
        </EventDetail>
      </EventSummary>

      {success ? (
        <SuccessMessage>
          🎉 Pagamento realizado com sucesso! Sua inscrição foi confirmada.
        </SuccessMessage>
      ) : (
        <CheckoutForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="card-element">
              Informações do Cartão
            </label>
            <CardElementContainer>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                  },
                }}
              />
            </CardElementContainer>
          </FormGroup>

          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}

          <ButtonGroup>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
              disabled={processing || loading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={!stripe || processing || loading}
            >
              {(processing || loading) && <LoadingSpinner />}
              {processing || loading ? 'Processando...' : `Pagar ${priceInfo.formattedTotal}`}
            </Button>
          </ButtonGroup>
        </CheckoutForm>
      )}
    </>
  );
};

const EventCheckout: React.FC<EventCheckoutProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const { stripePromise } = useEventPayment();

  if (!isOpen) return null;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContainer
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <h2>Finalizar Inscrição</h2>
          <p>Complete o pagamento para confirmar sua inscrição no evento</p>
        </ModalHeader>
        
        <ModalBody>
          <Elements stripe={stripePromise}>
            <CheckoutFormComponent
              event={event}
              onSuccess={onSuccess}
              onClose={onClose}
            />
          </Elements>
        </ModalBody>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default EventCheckout;