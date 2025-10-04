import React from 'react';
import styled from 'styled-components';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';
import { theme, Container } from '../../styles/theme';

const FooterContainer = styled.footer`
  background: ${theme.colors.text.primary};
  color: ${theme.colors.text.white};
  padding: ${theme.spacing.xxl} 0 ${theme.spacing.lg};
  margin-top: ${theme.spacing.xxl};
`;

const FooterContent = styled(Container)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};

  @media (max-width: ${theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.lg};
  }
`;

const FooterSection = styled.div`
  h3 {
    color: ${theme.colors.primary};
    font-size: 1.25rem;
    margin-bottom: ${theme.spacing.md};
    font-weight: 600;
  }

  p {
    color: ${theme.colors.text.white};
    opacity: 0.9;
    line-height: 1.6;
    margin-bottom: ${theme.spacing.sm};
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.white};
  opacity: 0.9;

  svg {
    color: ${theme.colors.primary};
    flex-shrink: 0;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${theme.colors.primary};
  color: white;
  border-radius: ${theme.borderRadius.full};
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.primaryLight};
    transform: translateY(-2px);
  }
`;

const QuickLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};

  a {
    color: ${theme.colors.text.white};
    text-decoration: none;
    opacity: 0.9;
    transition: all 0.3s ease;

    &:hover {
      color: ${theme.colors.primary};
      opacity: 1;
    }
  }
`;

const ClassSchedule = styled.div`
  .schedule-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${theme.spacing.sm} 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    &:last-child {
      border-bottom: none;
    }

    .day {
      font-weight: 500;
      color: ${theme.colors.primary};
    }

    .time {
      color: ${theme.colors.text.white};
      opacity: 0.9;
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: ${theme.spacing.lg};
  text-align: center;
  color: ${theme.colors.text.white};
  opacity: 0.7;
  font-size: 0.9rem;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        {/* Seção Sobre */}
        <FooterSection>
          <h3>Capoeira Pro</h3>
          <p>
            Venha descobrir a arte da capoeira em nossa academia! 
            Oferecemos aulas para todas as idades e níveis, 
            desde iniciantes até mestres.
          </p>
          <p>
            Mais que uma arte marcial, a capoeira é uma expressão 
            cultural que une música, dança e filosofia de vida.
          </p>
          
          <SocialLinks>
            <SocialLink href="https://facebook.com/capoeirapro" target="_blank" rel="noopener noreferrer">
              <Facebook size={20} />
            </SocialLink>
            <SocialLink href="https://instagram.com/capoeirapro" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} />
            </SocialLink>
            <SocialLink href="https://youtube.com/capoeirapro" target="_blank" rel="noopener noreferrer">
              <Youtube size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        {/* Contato */}
        <FooterSection>
          <h3>Contato</h3>
          <ContactInfo>
            <ContactItem>
              <MapPin size={18} />
              <div>
                <p>Rua da Capoeira, 123<br />
                Bairro Cultural<br />
                Sua Cidade - Estado<br />
                CEP: 12345-678</p>
              </div>
            </ContactItem>
            
            <ContactItem>
              <Phone size={18} />
              <p>(11) 99999-9999</p>
            </ContactItem>
            
            <ContactItem>
              <Mail size={18} />
              <p>contato@capoeirapro.com</p>
            </ContactItem>
          </ContactInfo>
        </FooterSection>

        {/* Links Rápidos */}
        <FooterSection>
          <h3>Links Rápidos</h3>
          <QuickLinks>
            <a href="/">Início</a>
            <a href="/sobre">Sobre Nós</a>
            <a href="/eventos">Eventos</a>
            <a href="/galeria">Galeria</a>
            <a href="/loja">Loja</a>
            <a href="/contato">Contato</a>
          </QuickLinks>
        </FooterSection>

        {/* Horários */}
        <FooterSection>
          <h3>Horários de Funcionamento</h3>
          <ClassSchedule>
            <div className="schedule-item">
              <span className="day">Segunda</span>
              <span className="time">06:00 - 22:00</span>
            </div>
            <div className="schedule-item">
              <span className="day">Terça</span>
              <span className="time">06:00 - 22:00</span>
            </div>
            <div className="schedule-item">
              <span className="day">Quarta</span>
              <span className="time">06:00 - 22:00</span>
            </div>
            <div className="schedule-item">
              <span className="day">Quinta</span>
              <span className="time">06:00 - 22:00</span>
            </div>
            <div className="schedule-item">
              <span className="day">Sexta</span>
              <span className="time">06:00 - 22:00</span>
            </div>
            <div className="schedule-item">
              <span className="day">Sábado</span>
              <span className="time">08:00 - 18:00</span>
            </div>
            <div className="schedule-item">
              <span className="day">Domingo</span>
              <span className="time">08:00 - 16:00</span>
            </div>
          </ClassSchedule>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <p>&copy; 2024 Capoeira Pro. Todos os direitos reservados. Desenvolvido com ❤️ para a comunidade da capoeira.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;