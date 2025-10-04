import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const AdminLayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
`;

const Sidebar = styled.nav`
  width: 280px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: white;
  padding: 1.5rem 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarHeader = styled.div`
  padding: 0 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
`;

const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #f8f9fa;
`;

const SidebarSubtitle = styled.p`
  font-size: 0.875rem;
  color: #adb5bd;
  margin: 0.25rem 0 0 0;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.25rem;
`;

const NavLink = styled.button<{ active?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.5rem;
  background: ${props => props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  color: ${props => props.active ? '#ffffff' : '#adb5bd'};
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  transition: all 0.2s ease;
  border-left: ${props => props.active ? '4px solid #007bff' : '4px solid transparent'};

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #ffffff;
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
`;

const ContentHeader = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

const ContentTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #343a40;
  margin: 0 0 0.5rem 0;
`;

const ContentSubtitle = styled.p`
  color: #6c757d;
  margin: 0;
  font-size: 1rem;
`;

const ContentBody = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 2rem;
`;

interface AdminLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  title: string;
  subtitle?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'users', label: 'Usuários', icon: '👥' },
  { id: 'events', label: 'Eventos & Aulas', icon: '📅' },
  { id: 'payments', label: 'Pagamentos', icon: '💳' },
  { id: 'products', label: 'Loja & Produtos', icon: '🛍️' },
  { id: 'gallery', label: 'Galeria', icon: '🖼️' },
  { id: 'chat', label: 'Chat', icon: '💬' },
  { id: 'reports', label: 'Relatórios', icon: '📈' },
  { id: 'settings', label: 'Configurações', icon: '⚙️' }
];

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeSection,
  onSectionChange,
  title,
  subtitle
}) => {
  return (
    <AdminLayoutContainer>
      <Sidebar>
        <SidebarHeader>
          <SidebarTitle>Painel Admin</SidebarTitle>
          <SidebarSubtitle>Academia Capoeira Nacional</SidebarSubtitle>
        </SidebarHeader>

        <NavList>
          {menuItems.map((item) => (
            <NavItem key={item.id}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: "tween", duration: 0.2 }}
              >
                <NavLink
                  active={activeSection === item.id}
                  onClick={() => onSectionChange(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </motion.div>
            </NavItem>
          ))}
        </NavList>
      </Sidebar>

      <MainContent>
        <ContentHeader>
          <ContentTitle>{title}</ContentTitle>
          {subtitle && <ContentSubtitle>{subtitle}</ContentSubtitle>}
        </ContentHeader>

        <ContentBody>
          {children}
        </ContentBody>
      </MainContent>
    </AdminLayoutContainer>
  );
};

export default AdminLayout;