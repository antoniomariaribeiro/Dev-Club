import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Star } from 'lucide-react';
import { theme, Container, Button } from '../styles/theme';

const EventsContainer = styled.div`
  padding: ${theme.spacing.xxl} 0;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%);
  color: white;
  padding: ${theme.spacing.xxl} 0;
  text-align: center;

  h1 {
    font-size: 3rem;
    margin-bottom: ${theme.spacing.lg};

    @media (max-width: ${theme.breakpoints.tablet}) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FilterSection = styled.div`
  padding: ${theme.spacing.xl} 0;
  display: flex;
  justify-content: center;
  gap: ${theme.spacing.md};
  flex-wrap: wrap;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  background: ${props => props.$active ? theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? 'white' : theme.colors.primary};
  border: 2px solid ${theme.colors.primary};
  padding: ${theme.spacing.sm} ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${theme.colors.primary};
    color: white;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl} 0;
`;

const EventCard = styled(motion.div)`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .event-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .event-content {
    padding: ${theme.spacing.lg};
  }

  .event-badge {
    background: ${theme.colors.secondary};
    color: white;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.md};
    display: inline-block;
  }

  .event-title {
    color: ${theme.colors.text.primary};
    font-size: 1.5rem;
    margin-bottom: ${theme.spacing.sm};
  }

  .event-description {
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.lg};
    line-height: 1.6;
  }

  .event-details {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.sm};
    margin-bottom: ${theme.spacing.lg};
  }

  .event-detail {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;

    svg {
      color: ${theme.colors.primary};
      width: 16px;
      height: 16px;
    }
  }

  .event-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.md};
  }
`;

const Events: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('todos');

  const eventCategories = [
    { key: 'todos', label: 'Todos os Eventos' },
    { key: 'workshops', label: 'Workshops' },
    { key: 'rodas', label: 'Rodas de Capoeira' },
    { key: 'batizados', label: 'Batizados' },
    { key: 'apresentacoes', label: 'Apresentações' },
  ];

  const mockEvents = [
    {
      id: 1,
      title: 'Roda de Capoeira - Domingo',
      description: 'Roda tradicional de capoeira aberta ao público. Venha jogar, cantar e tocar com nossa comunidade.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'rodas',
      date: '2024-10-06',
      time: '15:00',
      location: 'Academia Capoeira Nacional',
      participants: 25,
      price: 'Gratuito',
      featured: true,
    },
    {
      id: 2,
      title: 'Workshop de Instrumentos',
      description: 'Aprenda a tocar berimbau, atabaque e pandeiro. Workshop para todos os níveis.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'workshops',
      date: '2024-10-12',
      time: '14:00',
      location: 'Sala de Instrumentos',
      participants: 15,
      price: 'R$ 50,00',
      featured: false,
    },
    {
      id: 3,
      title: 'Batizado e Troca de Cordas 2024',
      description: 'Evento especial para graduação de alunos. Cerimônia tradicional com mestres convidados.',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'batizados',
      date: '2024-11-15',
      time: '09:00',
      location: 'Centro Cultural',
      participants: 100,
      price: 'R$ 80,00',
      featured: true,
    },
    {
      id: 4,
      title: 'Apresentação Cultural - Shopping',
      description: 'Apresentação de capoeira no shopping center. Demonstração da arte para o público geral.',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'apresentacoes',
      date: '2024-10-20',
      time: '16:00',
      location: 'Shopping Center',
      participants: 12,
      price: 'Gratuito',
      featured: false,
    },
  ];

  const filteredEvents = activeFilter === 'todos' 
    ? mockEvents 
    : mockEvents.filter(event => event.category === activeFilter);

  return (
    <EventsContainer>
      <HeroSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Eventos da Academia</h1>
            <p>
              Participe de nossas rodas, workshops e eventos especiais. 
              Conecte-se com a comunidade da capoeira e aprofunde seus conhecimentos.
            </p>
          </motion.div>
        </Container>
      </HeroSection>

      <Container>
        <FilterSection>
          {eventCategories.map(category => (
            <FilterButton
              key={category.key}
              $active={activeFilter === category.key}
              onClick={() => setActiveFilter(category.key)}
            >
              {category.label}
            </FilterButton>
          ))}
        </FilterSection>

        <EventsGrid>
          {filteredEvents.map((event, index) => (
            <EventCard
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {event.featured && (
                <div className="event-badge">
                  <Star size={14} style={{ marginRight: '4px', display: 'inline' }} />
                  Destaque
                </div>
              )}
              
              <img src={event.image} alt={event.title} className="event-image" />
              
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-details">
                  <div className="event-detail">
                    <Calendar />
                    <span>{new Date(event.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="event-detail">
                    <Clock />
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <MapPin />
                    <span>{event.location}</span>
                  </div>
                  <div className="event-detail">
                    <Users />
                    <span>{event.participants} participantes esperados</span>
                  </div>
                </div>

                <div className="event-price">{event.price}</div>

                <Button size="md" style={{ width: '100%' }}>
                  Inscrever-se
                </Button>
              </div>
            </EventCard>
          ))}
        </EventsGrid>
      </Container>
    </EventsContainer>
  );
};

export default Events;