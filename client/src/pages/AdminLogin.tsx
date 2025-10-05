import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const LoginCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  width: 100%;
  max-width: 400px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
  
  .shield-icon {
    margin: 0 auto 15px;
    width: 60px;
    height: 60px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    
    svg {
      width: 30px;
      height: 30px;
      color: #ffd700;
    }
  }
  
  h1 {
    margin: 0 0 10px;
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(45deg, #fff, #ffd700);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  p {
    margin: 0;
    opacity: 0.8;
    font-size: 1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InputGroup = styled.div`
  position: relative;
  
  .input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.6);
    z-index: 1;
  }
  
  input {
    width: 100%;
    padding: 15px 15px 15px 50px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: white;
    font-size: 1rem;
    box-sizing: border-box;
    transition: all 0.3s ease;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
  }
`;

const LoginButton = styled(motion.button)`
  width: 100%;
  padding: 15px;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  border: none;
  border-radius: 10px;
  color: #333;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(255, 215, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: 'admin@admin.com',
    password: 'admin123'
  });
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Se já está logado como admin, redirecionar
  if (user && user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast.success('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <PageContainer>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header>
          <div className="shield-icon">
            <Shield />
          </div>
          <h1>Painel Administrativo</h1>
          <p>Acesso exclusivo para administradores</p>
        </Header>

        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email do administrador"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <InputGroup>
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </InputGroup>

          <LoginButton
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Entrando...' : 'Entrar no Painel'}
            <ArrowRight size={20} />
          </LoginButton>
        </Form>
      </LoginCard>
    </PageContainer>
  );
};

export default AdminLogin;