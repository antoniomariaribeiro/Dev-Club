import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { theme, Container, Button, Input, Card } from '../styles/theme';
import { useAuth } from '../contexts/AuthContext';

const RegisterContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.background};
  padding: ${theme.spacing.xl} 0;
`;

const RegisterCard = styled(Card)`
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
  name: yup.string().required('Nome é obrigatório').min(2, 'Nome muito curto'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phone: yup.string().notRequired()
});

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema) as any
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegisterContainer>
      <Container>
        <RegisterCard>
          <h1>Criar Conta</h1>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                {...register('name')}
                placeholder="Seu nome completo"
              />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </div>

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
                {...register('phone')}
                placeholder="Telefone (opcional)"
              />
              {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
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
              {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          </Form>

          <p style={{ marginTop: theme.spacing.lg, color: theme.colors.text.secondary }}>
            Já tem uma conta?{' '}
            <Link to="/login" style={{ color: theme.colors.primary }}>
              Entrar
            </Link>
          </p>
        </RegisterCard>
      </Container>
    </RegisterContainer>
  );
};

export default Register;