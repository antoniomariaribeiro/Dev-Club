import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme, Container, Button, Input, Card } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

const LoginContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background};
  padding: ${theme.spacing.xl} 0;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  text-align: center;

  h1 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.xl};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const ErrorMessage = styled.p`
  color: ${theme.colors.error};
  font-size: 0.875rem;
  margin-top: ${theme.spacing.xs};
`;

const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória')
});

type LoginFormData = yup.InferType<typeof schema>;

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Tentando fazer login com:', { email: data.email, password: data.password ? '***' : 'empty' });
    setIsSubmitting(true);
    
    try {
      await login(data.email, data.password);
      console.log('Login bem-sucedido, redirecionando para:', from);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erro no login:', error);
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginContainer>
      <Container>
        <LoginCard>
          <h1>Entrar</h1>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                {...register('email')}
                type="email"
                placeholder="Seu email"
              />
              {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
            </div>

            <div>
              <Input
                {...register('password')}
                type="password"
                placeholder="Sua senha"
              />
              {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
            </div>

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </Form>

          <p style={{ marginTop: theme.spacing.lg, color: theme.colors.text.secondary, fontSize: '0.9rem' }}>
            Entre em contato com a administração para criar uma conta
          </p>
        </LoginCard>
      </Container>
    </LoginContainer>
  );
};

export default Login;