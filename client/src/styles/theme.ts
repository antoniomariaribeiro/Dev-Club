import styled, { createGlobalStyle } from 'styled-components';

// Cores do tema
export const theme = {
  colors: {
    // Cores principais - tons claros e elegantes
    primary: '#2E7D32',      // Verde da capoeira
    primaryLight: '#66BB6A', // Verde mais claro
    primaryDark: '#1B5E20',  // Verde mais escuro
    
    secondary: '#FF8F00',    // Laranja/dourado
    secondaryLight: '#FFB74D',
    secondaryDark: '#E65100',
    
    // Tons neutros claros
    background: '#FAFAFA',   // Branco quente
    surface: '#FFFFFF',      // Branco puro
    paper: '#F5F5F5',        // Cinza muito claro
    
    // Textos
    text: {
      primary: '#2C3E50',    // Azul escuro elegante
      secondary: '#546E7A',  // Cinza azulado
      light: '#78909C',      // Cinza claro
      white: '#FFFFFF'
    },
    
    // Estados
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    
    // Gradientes
    gradients: {
      primary: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
      secondary: 'linear-gradient(135deg, #FF8F00 0%, #FFB74D 100%)',
      hero: 'linear-gradient(135deg, rgba(46, 125, 50, 0.9) 0%, rgba(102, 187, 106, 0.9) 100%)'
    }
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%'
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)'
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  }
};

// Estilos globais
export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: ${theme.spacing.md};
  }

  h1 { font-size: 2.5rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.5rem; }
  h4 { font-size: 1.25rem; }
  h5 { font-size: 1rem; }
  h6 { font-size: 0.875rem; }

  p {
    margin-bottom: ${theme.spacing.md};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: ${theme.colors.primaryDark};
    }
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  input, textarea, select {
    font-family: inherit;
    outline: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  // Scrollbar personalizada
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.paper};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary};
    border-radius: ${theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primaryDark};
  }

  // Animações
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  // Classes utilitárias
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  .slide-in-up {
    animation: slideInUp 0.6s ease-out;
  }

  .slide-in-down {
    animation: slideInDown 0.6s ease-out;
  }

  .scale-in {
    animation: scaleIn 0.6s ease-out;
  }

  // Responsividade
  @media (max-width: ${theme.breakpoints.tablet}) {
    h1 { font-size: 2rem; }
    h2 { font-size: 1.75rem; }
    h3 { font-size: 1.25rem; }
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    h1 { font-size: 1.75rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.125rem; }
  }
`;

// Componentes reutilizáveis
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${theme.spacing.md};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0 ${theme.spacing.sm};
  }
`;

export const Button = styled.button<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}>`
  padding: ${props => {
    switch (props.size) {
      case 'sm': return '8px 16px';
      case 'lg': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  
  font-size: ${props => {
    switch (props.size) {
      case 'sm': return '0.875rem';
      case 'lg': return '1.125rem';
      default: return '1rem';
    }
  }};
  
  font-weight: 500;
  border-radius: ${theme.borderRadius.md};
  transition: all 0.3s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: white;
          &:hover { background: ${theme.colors.secondaryDark}; }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          &:hover { 
            background: ${theme.colors.primary}; 
            color: white;
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          &:hover { background: rgba(46, 125, 50, 0.1); }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primaryDark}; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:active {
    transform: translateY(1px);
  }
`;

export const Card = styled.div`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: ${theme.shadows.sm};
  padding: ${theme.spacing.lg};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${theme.shadows.md};
    transform: translateY(-2px);
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.paper};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: ${theme.colors.surface};

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.text.light};
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: ${theme.spacing.md};
  border: 2px solid ${theme.colors.paper};
  border-radius: ${theme.borderRadius.md};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
  background: ${theme.colors.surface};

  &:focus {
    border-color: ${theme.colors.primary};
  }

  &::placeholder {
    color: ${theme.colors.text.light};
  }
`;

export const Badge = styled.span<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' }>`
  display: inline-block;
  padding: 4px 8px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: ${theme.borderRadius.sm};
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `background: ${theme.colors.secondary}; color: white;`;
      case 'success':
        return `background: ${theme.colors.success}; color: white;`;
      case 'warning':
        return `background: ${theme.colors.warning}; color: white;`;
      case 'error':
        return `background: ${theme.colors.error}; color: white;`;
      default:
        return `background: ${theme.colors.primary}; color: white;`;
    }
  }}
`;