import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Menu, X, User, LogOut } from 'lucide-react';
import { theme, Container } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: ${theme.colors.surface};
  box-shadow: ${theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.md};
`;

const Logo = styled(Link)`
  font-size: 1.3rem;
  font-weight: bold;
  color: ${theme.colors.primary};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};

  &:hover {
    color: ${theme.colors.primaryDark};
  }

  img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 280px;
    background: ${theme.colors.surface};
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: ${theme.spacing.xl};
    box-shadow: ${theme.shadows.lg};
    transform: translateX(${props => props.isOpen ? '0' : '100%'});
    transition: transform 0.3s ease;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.spacing.md};
    width: 100%;
    margin-top: ${theme.spacing.xxl};
  }
`;

const NavLink = styled(Link)`
  color: ${theme.colors.text.primary};
  font-weight: 500;
  text-decoration: none;
  padding: ${theme.spacing.sm} 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    color: ${theme.colors.primary};
    border-bottom-color: ${theme.colors.primary};
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    padding: ${theme.spacing.md} 0;
    border-bottom: 1px solid ${theme.colors.paper};
    border-radius: 0;

    &:hover {
      border-bottom-color: ${theme.colors.paper};
      background: rgba(46, 125, 50, 0.1);
    }
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    margin-top: ${theme.spacing.lg};
    padding-top: ${theme.spacing.lg};
    border-top: 1px solid ${theme.colors.paper};
  }
`;

const UserButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: transparent;
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  transition: background 0.3s ease;

  &:hover {
    background: rgba(46, 125, 50, 0.1);
  }
`;

const MenuButton = styled.button`
  display: none;
  background: transparent;
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
    z-index: 101;
  }
`;

const CloseButton = styled.button`
  display: none;
  position: absolute;
  top: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  background: transparent;
  color: ${theme.colors.text.primary};
  padding: ${theme.spacing.sm};

  @media (max-width: ${theme.breakpoints.tablet}) {
    display: flex;
    align-items: center;
  }
`;

const Overlay = styled.div<{ isOpen: boolean }>`
  display: none;
  
  @media (max-width: ${theme.breakpoints.tablet}) {
    display: ${props => props.isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    flex-direction: column;
    width: 100%;
    gap: ${theme.spacing.sm};
  }
`;

const LoginButton = styled(Link)`
  color: ${theme.colors.primary};
  font-weight: 500;
  text-decoration: none;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  transition: background 0.3s ease;

  &:hover {
    background: rgba(46, 125, 50, 0.1);
  }

  @media (max-width: ${theme.breakpoints.tablet}) {
    width: 100%;
    text-align: left;
  }
`;



const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleDashboard = () => {
    if (user?.role === 'admin') {
      navigate('/admin');
    } else if (user?.role === 'student') {
      navigate('/aluno');
    } else {
      navigate('/dashboard');
    }
    setIsMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <Logo to="/">
            <img 
              src="/logo.png" 
              alt="Academia Capoeira Nacional Logo" 
            />
            Academia Capoeira Nacional
          </Logo>

          <Nav isOpen={isMenuOpen}>
            <CloseButton onClick={closeMenu}>
              <X size={24} />
            </CloseButton>

            <NavLinks>
              <NavLink to="/" onClick={closeMenu}>Início</NavLink>
              <NavLink to="/sobre" onClick={closeMenu}>Sobre</NavLink>
              <NavLink to="/eventos" onClick={closeMenu}>Eventos</NavLink>
              <NavLink to="/galeria" onClick={closeMenu}>Galeria</NavLink>
              <NavLink to="/loja" onClick={closeMenu}>Loja</NavLink>
              <NavLink to="/contato" onClick={closeMenu}>Contato</NavLink>
            </NavLinks>

            <UserMenu>
              {user ? (
                <>
                  <UserButton onClick={handleDashboard}>
                    <User size={18} />
                    <span>{user.name}</span>
                  </UserButton>
                  <UserButton onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Sair</span>
                  </UserButton>
                </>
              ) : (
                <AuthButtons>
                  <LoginButton to="/login" onClick={closeMenu}>
                    Entrar
                  </LoginButton>
                </AuthButtons>
              )}
            </UserMenu>
          </Nav>

          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu size={24} />
          </MenuButton>
        </HeaderContent>
      </HeaderContainer>

      <Overlay isOpen={isMenuOpen} onClick={closeMenu} />
    </>
  );
};

export default Header;