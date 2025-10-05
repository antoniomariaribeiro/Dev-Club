import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { GlobalStyles } from './styles/theme';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';

// Pages - importação completa
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Gallery from './pages/Gallery';
import Shop from './pages/Shop';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminLogin from './pages/AdminLogin';
import ProfessionalAdminDashboard from './pages/ProfessionalAdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <GlobalStyles />
            <div className="App">
            <Header />
            
            <main style={{ minHeight: 'calc(100vh - 120px)' }}>
              <Routes>
                {/* Rotas Públicas */}
                <Route path="/" element={<Home />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/eventos" element={<Events />} />
                <Route path="/eventos/:id" element={<EventDetail />} />
                <Route path="/galeria" element={<Gallery />} />
                <Route path="/loja" element={<Shop />} />
                <Route path="/contato" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                
                {/* Rota de Login Admin */}
                <Route path="/admin" element={<AdminLogin />} />
                
                {/* Rotas Protegidas */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requireRole="admin">
                    <ProfessionalAdminDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/aluno" element={
                  <ProtectedRoute requireRole="student">
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                
                {/* 404 */}
                <Route path="*" element={
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Página não encontrada</h2>
                    <p>A página que você procura não existe.</p>
                    <a href="/">← Voltar ao Início</a>
                  </div>
                } />
              </Routes>
            </main>
            
            <Footer />
          </div>
          
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
        </Router>
      </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;