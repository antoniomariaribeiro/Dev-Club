import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirecionar baseado no role do usuário
  if (user.role === 'admin') {
    return <Navigate to="/admin" replace />;
  } else if (user.role === 'student') {
    return <Navigate to="/aluno" replace />;
  }

  return null;
};

export default Dashboard;