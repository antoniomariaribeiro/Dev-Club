import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, ShoppingCart, Image, 
  BarChart3, Home, LogOut, Menu, X, 
  Globe, Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import NewRealTimeDashboard from '../components/admin/NewRealTimeDashboard';
import SuperAdvancedUsersManagement from '../components/admin/SuperAdvancedUsersManagement';
import EventsManager from '../components/admin/EventsManager';
import ProductsManager from '../components/admin/ProductsManager';
const GalleryManagement = () => (
  <div style={{color: 'white', padding: '30px'}}>
    <h2 style={{margin: '0 0 20px 0', fontSize: '2rem'}}>🖼️ Gestão de Galeria</h2>
    <p style={{opacity: 0.8}}>Sistema de gestão de galeria em desenvolvimento...</p>
  </div>
);

// Componentes de navegação do site
const SiteNavigation = () => (
  <div style={{color: 'white', padding: '30px'}}>
    <h2 style={{margin: '0 0 20px 0', fontSize: '2rem'}}>🌐 Navegação do Site</h2>
    <div style={{display: 'grid', gap: '15px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'}}>
      <a href="/" target="_blank" style={{
        display: 'block', padding: '20px', background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px', textDecoration: 'none', color: 'white',
        border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease'
      }}>
        🏠 Página Inicial
      </a>
      <a href="/sobre" target="_blank" style={{
        display: 'block', padding: '20px', background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px', textDecoration: 'none', color: 'white',
        border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease'
      }}>
        ℹ️ Sobre Nós
      </a>
      <a href="/eventos" target="_blank" style={{
        display: 'block', padding: '20px', background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px', textDecoration: 'none', color: 'white',
        border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease'
      }}>
        � Eventos
      </a>
      <a href="/galeria" target="_blank" style={{
        display: 'block', padding: '20px', background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px', textDecoration: 'none', color: 'white',
        border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease'
      }}>
        🖼️ Galeria
      </a>
      <a href="/loja" target="_blank" style={{
        display: 'block', padding: '20px', background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px', textDecoration: 'none', color: 'white',
        border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease'
      }}>
        🛍️ Loja
      </a>
      <a href="/contato" target="_blank" style={{
        display: 'block', padding: '20px', background: 'rgba(255,255,255,0.1)', 
        borderRadius: '10px', textDecoration: 'none', color: 'white',
        border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s ease'
      }}>
        📞 Contato
      </a>
    </div>
  </div>
);

const SiteSettings = () => (
  <div style={{color: 'white', padding: '30px'}}>
    <h2 style={{margin: '0 0 20px 0', fontSize: '2rem'}}>⚙️ Configurações do Site</h2>
    <p style={{opacity: 0.8}}>Configurações gerais do sistema em desenvolvimento...</p>
  </div>
);

const Analytics = () => (
  <div style={{color: 'white', padding: '30px'}}>
    <h2 style={{margin: '0 0 20px 0', fontSize: '2rem'}}>📊 Analytics</h2>
    <p style={{opacity: 0.8}}>Relatórios e análises em desenvolvimento...</p>
  </div>
);

// ============ STYLED COMPONENTS ============
const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Sidebar = styled(motion.div)<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '280px' : '70px'};
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px;
  transition: all 0.3s ease;
  position: relative;
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.isOpen ? '0' : '-280px'};
    width: 280px;
    z-index: 1000;
    height: 100vh;
  }
`;

const SidebarHeader = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'space-between' : 'center'};
  margin-bottom: 30px;
  color: white;
  
  h2 {
    margin: 0;
    font-size: 1.3rem;
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
`;

const ToggleButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled(motion.div)<{ active: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  justify-content: ${props => props.isOpen ? 'flex-start' : 'center'};
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.2)' : 'transparent'};
  border-left: ${props => props.active ? '3px solid #ffd700' : '3px solid transparent'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(3px);
  }
  
  span {
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity 0.3s ease;
    white-space: nowrap;
  }
  
  .icon {
    min-width: 20px;
    color: ${props => props.active ? '#ffd700' : 'white'};
  }
`;

const MainContent = styled.div<{ sidebarOpen: boolean }>`
  flex: 1;
  padding: 0;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const UserInfo = styled.div<{ isOpen: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  justify-content: ${props => props.isOpen ? 'flex-start' : 'center'};
  
  .user-details {
    opacity: ${props => props.isOpen ? 1 : 0};
    transition: opacity 0.3s ease;
    
    .name {
      font-weight: 600;
      font-size: 0.9rem;
    }
    
    .role {
      font-size: 0.8rem;
      opacity: 0.7;
    }
  }
`;

// ============ INTERFACE ============
interface AdminPage {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

const adminPages: AdminPage[] = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: <Home size={20} className="icon" />,
    component: <NewRealTimeDashboard />
  },
  {
    id: 'users',
    name: 'Usuários',
    icon: <Users size={20} className="icon" />,
    component: <SuperAdvancedUsersManagement />
  },
  {
    id: 'events',
    name: 'Eventos',
    icon: <Calendar size={20} className="icon" />,
    component: <EventsManager />
  },
  {
    id: 'products',
    name: 'Produtos',
    icon: <ShoppingCart size={20} className="icon" />,
    component: <ProductsManager />
  },
  {
    id: 'gallery',
    name: 'Galeria',
    icon: <Image size={20} className="icon" />,
    component: <GalleryManagement />
  },
  {
    id: 'site',
    name: 'Navegação',
    icon: <Globe size={20} className="icon" />,
    component: <SiteNavigation />
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: <BarChart3 size={20} className="icon" />,
    component: <Analytics />
  },
  {
    id: 'settings',
    name: 'Configurações',
    icon: <Settings size={20} className="icon" />,
    component: <SiteSettings />
  }
];

// ============ COMPONENTE PRINCIPAL ============
const CompleteAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
  };

  const currentComponent = adminPages.find(page => page.id === currentPage)?.component;

  return (
    <AdminContainer>
      {/* Overlay para mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SidebarHeader isOpen={sidebarOpen}>
          <h2>🥋 Admin Panel</h2>
          <ToggleButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </ToggleButton>
        </SidebarHeader>

        <NavList>
          {adminPages.map((page) => (
            <NavItem
              key={page.id}
              active={currentPage === page.id}
              isOpen={sidebarOpen}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setCurrentPage(page.id);
                // Fechar sidebar no mobile após seleção
                if (window.innerWidth <= 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              {page.icon}
              <span>{page.name}</span>
            </NavItem>
          ))}
          
          <NavItem
            active={false}
            isOpen={sidebarOpen}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}
          >
            <LogOut size={20} className="icon" />
            <span>Sair</span>
          </NavItem>
        </NavList>

        <UserInfo isOpen={sidebarOpen}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#333',
            fontWeight: 'bold',
            fontSize: '0.9rem'
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="user-details">
            <div className="name">{user?.name || 'Administrador'}</div>
            <div className="role">Administrador</div>
          </div>
        </UserInfo>
      </Sidebar>

      {/* Conteúdo Principal */}
      <MainContent sidebarOpen={sidebarOpen}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentComponent}
          </motion.div>
        </AnimatePresence>
      </MainContent>
    </AdminContainer>
  );
};

export default CompleteAdminDashboard;