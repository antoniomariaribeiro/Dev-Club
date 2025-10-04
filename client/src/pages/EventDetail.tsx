import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, ArrowLeft, User } from 'lucide-react';
import { theme, Container } from '../styles/theme';
import EventCheckoutNew from '../components/EventCheckoutNew';

const EventDetailContainer = styled(Container)`
  padding: 2rem;
  max-width: 1000px;
  margin: 2rem auto;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  padding: 0.5rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }
`;

const EventHeader = styled.div`
  position: relative;
  margin-bottom: 3rem;
`;

const EventImage = styled.div`
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, ${theme.colors.primary}20 0%, ${theme.colors.primaryLight}20 100%);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  background-image: url('https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80');
  background-size: cover;
  background-position: center;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 15px;
  }
`;

const EventBadge = styled.span<{ type: string }>`
  position: absolute;
  top: 20px;
  left: 20px;
  background: ${props => 
    props.type === 'workshop' ? '#FF6B6B' :
    props.type === 'roda' ? '#4ECDC4' :
    props.type === 'batizado' ? '#45B7D1' :
    props.type === 'troca-de-cordas' ? '#96CEB4' :
    '#FFA07A'
  };
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  z-index: 1;
`;

const EventTitle = styled.h1`
  font-size: 2.5rem;
  color: ${theme.colors.text.primary};
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const EventMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${theme.colors.text.secondary};
  font-size: 1rem;
`;

const EventContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const MainContent = styled.div`
  
`;

const Sidebar = styled.div`
  
`;

const Section = styled(motion.div)`
  margin-bottom: 3rem;

  h2 {
    color: ${theme.colors.primary};
    font-size: 1.8rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: ${theme.colors.text.secondary};
    line-height: 1.8;
    margin-bottom: 1rem;
  }
`;

const InfoCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
`;

const PriceInfo = styled.div`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, #4A7C59 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
  margin-bottom: 1.5rem;

  .price {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .description {
    opacity: 0.9;
    font-size: 0.9rem;
  }
`;

const RegisterButton = styled(motion.button)`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InstructorCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  background: ${theme.colors.primaryLight}30;
  padding: 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
`;

const InstructorAvatar = styled.div`
  width: 60px;
  height: 60px;
  background: ${theme.colors.primary};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const InstructorInfo = styled.div`
  flex: 1;

  h4 {
    color: ${theme.colors.primary};
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
  }

  p {
    margin: 0;
    color: ${theme.colors.text.secondary};
    font-size: 0.9rem;
  }
`;

// Mock data para o evento
const eventData = {
  id: 1,
  title: "Workshop de Capoeira Angola",
  description: "Um workshop intensivo focado nos fundamentos da Capoeira Angola, explorando movimentos tradicionais, música e filosofia desta arte ancestral.",
  event_date: "2024-02-15",
  location: "Academia Capoeira Nacional - Sorocaba",
  price: 50,
  max_participants: 30,
  status: "published" as const,
  is_featured: true,
  level: "all" as const,
  totalRegistrations: 18,
  // Propriedades específicas do componente
  type: "workshop",
  category: "workshop",
  date: "2024-02-15",
  time: "14:00",
  duration: "3 horas",
  capacity: 30,
  registered: 18,
  instructor: {
    name: "Mestre Bimba Jr.",
    title: "Contra-Mestre",
    experience: "15 anos de experiência"
  },
  detailedDescription: `
    Neste workshop especial, você terá a oportunidade de mergulhar profundamente na tradição da Capoeira Angola, uma das vertentes mais antigas e tradicionais da capoeira.

    Durante as 3 horas de atividades, você aprenderá:
    • Movimentos básicos da Capoeira Angola
    • Técnicas de ginga e deslocamentos
    • Instrumentos musicais tradicionais
    • Cantos e toques característicos
    • História e filosofia da Capoeira Angola
    • Prática na roda de capoeira

    O workshop é adequado para todos os níveis, desde iniciantes até praticantes experientes que desejam aprofundar seus conhecimentos na tradição angoleira.
  `,
  requirements: [
    "Roupas confortáveis para prática esportiva",
    "Toalha e água",
    "Disposição para aprender e se divertir"
  ],
  includes: [
    "Material didático",
    "Certificado de participação",
    "Lanche durante o intervalo"
  ]
};

const EventDetail: React.FC = () => {
  const navigate = useNavigate();
  const [event] = useState(eventData); // Em uma aplicação real, você buscaria os dados da API
  const [isRegistered, setIsRegistered] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const handleRegister = () => {
    // Se o evento for pago, abre o modal de checkout
    if (event.price > 0) {
      setShowCheckout(true);
    } else {
      // Se for gratuito, inscreve diretamente
      setIsRegistered(true);
      alert('Inscrição realizada com sucesso! Você receberá um e-mail de confirmação.');
    }
  };

  const handlePaymentSuccess = () => {
    setIsRegistered(true);
    setShowCheckout(false);
    alert('Pagamento realizado com sucesso! Sua inscrição foi confirmada.');
  };

  const handleGoBack = () => {
    navigate('/eventos');
  };

  return (
    <EventDetailContainer>
      <BackButton onClick={handleGoBack}>
        <ArrowLeft size={20} />
        Voltar aos Eventos
      </BackButton>

      <EventHeader>
        <EventImage>
          <EventBadge type={event.type}>
            {event.type === 'workshop' ? 'Workshop' :
             event.type === 'roda' ? 'Roda' :
             event.type === 'batizado' ? 'Batizado' :
             'Evento'}
          </EventBadge>
        </EventImage>
        
        <EventTitle>{event.title}</EventTitle>
        
        <EventMeta>
          <MetaItem>
            <Calendar size={20} />
            {new Date(event.event_date).toLocaleDateString('pt-BR')}
          </MetaItem>
          <MetaItem>
            <Clock size={20} />
            {event.time} ({event.duration})
          </MetaItem>
          <MetaItem>
            <MapPin size={20} />
            {event.location}
          </MetaItem>
          <MetaItem>
            <Users size={20} />
            {event.registered}/{event.capacity} inscritos
          </MetaItem>
        </EventMeta>
      </EventHeader>

      <EventContent>
        <MainContent>
          <Section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2>Sobre o Evento</h2>
            <p>{event.description}</p>
            <p style={{ whiteSpace: 'pre-line' }}>{event.detailedDescription}</p>
          </Section>

          <Section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2>O que você precisa trazer</h2>
            <ul>
              {event.requirements.map((req, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', color: theme.colors.text.secondary }}>
                  {req}
                </li>
              ))}
            </ul>
          </Section>

          <Section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2>O que está incluído</h2>
            <ul>
              {event.includes.map((item, index) => (
                <li key={index} style={{ marginBottom: '0.5rem', color: theme.colors.text.secondary }}>
                  {item}
                </li>
              ))}
            </ul>
          </Section>
        </MainContent>

        <Sidebar>
          <InfoCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PriceInfo>
              <div className="price">{event.price}</div>
              <div className="description">Por pessoa</div>
            </PriceInfo>

            <RegisterButton
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRegister}
              disabled={isRegistered || event.registered >= event.capacity}
            >
              {isRegistered ? 'Inscrito com Sucesso!' :
               event.registered >= event.capacity ? 'Lotado' :
               'Inscrever-se Agora'}
            </RegisterButton>
          </InfoCard>

          <InfoCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 style={{ color: theme.colors.primary, marginBottom: '1rem' }}>
              Instrutor
            </h3>
            <InstructorCard>
              <InstructorAvatar>
                <User size={24} />
              </InstructorAvatar>
              <InstructorInfo>
                <h4>{event.instructor.name}</h4>
                <p>{event.instructor.title}</p>
                <p>{event.instructor.experience}</p>
              </InstructorInfo>
            </InstructorCard>
          </InfoCard>

          <InfoCard
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 style={{ color: theme.colors.primary, marginBottom: '1rem' }}>
              Informações Adicionais
            </h3>
            <div style={{ fontSize: '0.9rem', color: theme.colors.text.secondary }}>
              <p><strong>Nível:</strong> Todos os níveis</p>
              <p><strong>Idioma:</strong> Português</p>
              <p><strong>Vagas limitadas:</strong> {event.capacity} participantes</p>
              <p><strong>Política de cancelamento:</strong> Cancelamento gratuito até 24h antes do evento</p>
            </div>
          </InfoCard>
        </Sidebar>
      </EventContent>

      <EventCheckoutNew
        event={event}
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSuccess={handlePaymentSuccess}
      />
    </EventDetailContainer>
  );
};

export default EventDetail;