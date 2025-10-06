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
import CompleteAdminDashboard from './pages/CompleteAdminDashboard';

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

// Layout para páginas com Header e Footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Header />
    <main style={{ minHeight: 'calc(100vh - 120px)' }}>
      {children}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <Router>
            <GlobalStyles />
            <div className="App">
              <Routes>
                {/* Rotas de Admin (SEM Header/Footer - tela inteira) */}
                <Route path="/admin" element={<AdminLogin />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/*" element={
                  <ProtectedRoute requireRole="admin">
                    <CompleteAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requireRole="admin">
                    <CompleteAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/painel" element={
                  <ProtectedRoute requireRole="admin">
                    <CompleteAdminDashboard />
                  </ProtectedRoute>
                } />

                
                {/* Rotas com Layout Principal (COM Header/Footer) */}
                <Route path="/" element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                } />
                <Route path="/sobre" element={
                  <MainLayout>
                    <About />
                  </MainLayout>
                } />
                <Route path="/eventos" element={
                  <MainLayout>
                    <Events />
                  </MainLayout>
                } />
                <Route path="/eventos/:id" element={
                  <MainLayout>
                    <EventDetail />
                  </MainLayout>
                } />
                <Route path="/galeria" element={
                  <MainLayout>
                    <Gallery />
                  </MainLayout>
                } />
                <Route path="/loja" element={
                  <MainLayout>
                    <Shop />
                  </MainLayout>
                } />
                <Route path="/contato" element={
                  <MainLayout>
                    <Contact />
                  </MainLayout>
                } />
                <Route path="/login" element={
                  <MainLayout>
                    <Login />
                  </MainLayout>
                } />
                
                {/* Rotas Protegidas com Layout */}
                <Route path="/dashboard" element={
                  <MainLayout>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </MainLayout>
                } />
                
                <Route path="/aluno" element={
                  <MainLayout>
                    <ProtectedRoute requireRole="student">
                      <StudentDashboard />
                    </ProtectedRoute>
                  </MainLayout>
                } />
                
                {/* 404 */}
                <Route path="*" element={
                  <MainLayout>
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                      <h2>Página não encontrada</h2>
                      <p>A página que você procura não existe.</p>
                      <a href="/">← Voltar ao Início</a>
                    </div>
                  </MainLayout>
                } />
              </Routes>
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