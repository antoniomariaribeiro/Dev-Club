import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Users, Star, DollarSign } from 'lucide-react';
import { theme, Container, Button } from '../styles/theme';
import api from '../services/api';
import { toast } from 'react-hot-toast';

// ============ INTERFACES ============
interface Event {
  id: number;
  title: string;
  description: string;
  event_date: string;
  end_date?: string;
  location: string;
  price: number;
  max_participants: number;
  level?: string;
  status: string;
  is_featured: boolean;
  image?: string;
  requirements?: string;
  what_to_bring?: string;
  instructor?: string;
  registrations_count?: number;
  created_at: string;
}

// ============ STYLED COMPONENTS ============
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

const EventCard = styled(motion.div)<{ $featured?: boolean }>`
  background: white;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  transition: all 0.3s ease;
  border: ${props => props.$featured ? `3px solid ${theme.colors.primary}` : '1px solid #e0e0e0'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.lg};
  }
`;

const EventImage = styled.div<{ $src?: string }>`
  height: 250px;
  background: ${props => props.$src 
    ? `url(${props.$src}) center/cover` 
    : `linear-gradient(45deg, ${theme.colors.primary}, ${theme.colors.primaryLight})`
  };
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${theme.colors.primary};
  color: white;
  padding: 5px 12px;
  border-radius: ${theme.borderRadius.sm};
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const EventContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const EventTitle = styled.h3`
  margin-bottom: ${theme.spacing.sm};
  color: ${theme.colors.text.primary};
  font-size: 1.4rem;
`;

const EventDescription = styled.p`
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.md};
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  color: ${theme.colors.text.secondary};
  font-size: 0.95rem;

  svg {
    color: ${theme.colors.primary};
  }
`;

const EventActions = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
  margin-top: ${theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  font-size: 1.2rem;
  color: ${theme.colors.text.secondary};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xxl} 0;
  color: ${theme.colors.text.secondary};

  h3 {
    margin-bottom: ${theme.spacing.md};
    font-size: 1.5rem;
  }
`;

// ============ COMPONENT ============
const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { key: 'all', label: 'Todos os Eventos' },
    { key: 'featured', label: 'Destaque' },
    { key: 'beginner', label: 'Iniciante' },
    { key: 'intermediate', label: 'Intermediário' },
    { key: 'advanced', label: 'Avançado' }
  ];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      let url = '/api/events?status=published';
      
      if (activeFilter === 'featured') {
        url += '&featured=true';
      } else if (activeFilter !== 'all') {
        url += `&level=${activeFilter}`;
      }

      const response = await api.get(url);
      setEvents(response.data.events || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Gratuito' : `R$ ${price.toFixed(2)}`;
  };

  const getImageUrl = (image?: string) => {
    if (!image) return undefined;
    return image.startsWith('http') ? image : `http://localhost:5000${image}`;
  };

  return (
    <EventsContainer>
      <HeroSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>Eventos da Academia</h1>
            <p>
              Participe de nossas rodas, workshops e eventos especiais. Conecte-se 
              com a comunidade da capoeira e aprofunde seus conhecimentos.
            </p>
          </motion.div>
        </Container>
      </HeroSection>

      <Container>
        <FilterSection>
          {filters.map((filter) => (
            <FilterButton
              key={filter.key}
              $active={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            >
              {filter.label}
            </FilterButton>
          ))}
        </FilterSection>

        {loading ? (
          <LoadingContainer>
            Carregando eventos...
          </LoadingContainer>
        ) : events.length === 0 ? (
          <EmptyState>
            <h3>Nenhum evento encontrado</h3>
            <p>Não há eventos disponíveis no momento.</p>
          </EmptyState>
        ) : (
          <EventsGrid>
            {events.map((event, index) => (
              <EventCard
                key={event.id}
                $featured={event.is_featured}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <EventImage $src={getImageUrl(event.image)}>
                  {!event.image && '🥋'}
                  {event.is_featured && (
                    <FeaturedBadge>
                      <Star size={16} />
                      Destaque
                    </FeaturedBadge>
                  )}
                </EventImage>

                <EventContent>
                  <EventTitle>{event.title}</EventTitle>
                  <EventDescription>{event.description}</EventDescription>

                  <EventMeta>
                    <MetaItem>
                      <Calendar size={18} />
                      {formatDate(event.event_date)}
                    </MetaItem>
                    
                    <MetaItem>
                      <Clock size={18} />
                      {formatTime(event.event_date)}
                    </MetaItem>
                    
                    <MetaItem>
                      <MapPin size={18} />
                      {event.location}
                    </MetaItem>
                    
                    <MetaItem>
                      <DollarSign size={18} />
                      {formatPrice(event.price)}
                    </MetaItem>
                    
                    {event.max_participants && (
                      <MetaItem>
                        <Users size={18} />
                        {event.registrations_count || 0} / {event.max_participants} participantes
                      </MetaItem>
                    )}
                    
                    {event.level && (
                      <MetaItem>
                        <Star size={18} />
                        Nível: {event.level === 'beginner' ? 'Iniciante' : 
                                event.level === 'intermediate' ? 'Intermediário' : 
                                event.level === 'advanced' ? 'Avançado' : 'Todos os níveis'}
                      </MetaItem>
                    )}
                  </EventMeta>

                  <EventActions>
                    <Button variant="primary" style={{ flex: 1 }}>
                      Inscrever-se
                    </Button>
                    <Button variant="secondary">
                      Detalhes
                    </Button>
                  </EventActions>
                </EventContent>
              </EventCard>
            ))}
          </EventsGrid>
        )}
      </Container>
    </EventsContainer>
  );
};

export default Events;