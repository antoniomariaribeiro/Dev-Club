import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styled from 'styled-components';
import { theme } from '../styles/theme';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: Array<'admin' | 'student'>;
  requireRole?: 'admin' | 'student';
}

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.1rem;
  color: ${theme.colors.text.secondary};
`;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles = [], requireRole }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingContainer>Carregando...</LoadingContainer>;
  }

  if (!token || !user) {
    // Redirecionar para login, salvando a rota atual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificar se o usuário tem a role necessária
  if (requireRole && user.role !== requireRole) {
    // Se não tem permissão, redirecionar para dashboard geral
    return <Navigate to="/dashboard" replace />;
  }
  
  if (roles.length > 0 && !roles.includes(user.role)) {
    // Se não tem permissão, redirecionar para dashboard geral
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;