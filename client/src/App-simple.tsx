import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalStyles } from './styles/theme';

// Pages - importação simplificada
import Home from './pages/Home';

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
      <AuthProvider>
        <Router>
          <GlobalStyles />
          <div className="App">
            <header style={{ padding: '20px', background: '#2E7D32', color: 'white', textAlign: 'center' }}>
              <h1>🥋 Capoeira Pro</h1>
              <nav>
                <a href="/" style={{ color: 'white', margin: '0 10px' }}>Início</a>
                <a href="/sobre" style={{ color: 'white', margin: '0 10px' }}>Sobre</a>
                <a href="/eventos" style={{ color: 'white', margin: '0 10px' }}>Eventos</a>
                <a href="/contato" style={{ color: 'white', margin: '0 10px' }}>Contato</a>
                <a href="/login" style={{ color: 'white', margin: '0 10px' }}>Login</a>
              </nav>
            </header>
            
            <main style={{ minHeight: 'calc(100vh - 120px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={
                  <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Página em Desenvolvimento</h2>
                    <p>Esta página será implementada em breve!</p>
                    <a href="/">← Voltar ao Início</a>
                  </div>
                } />
              </Routes>
            </main>
            
            <footer style={{ padding: '20px', background: '#333', color: 'white', textAlign: 'center' }}>
              <p>&copy; 2024 Capoeira Pro - Site Profissional de Capoeira</p>
            </footer>
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
    </QueryClientProvider>
  );
}

export default App;