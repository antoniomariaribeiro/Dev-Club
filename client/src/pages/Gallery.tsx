import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Heart, Eye, Calendar, X } from 'lucide-react';
import { theme, Container } from '../styles/theme';

const GalleryContainer = styled.div`
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

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  padding: ${theme.spacing.xl} 0;
`;

const PhotoCard = styled(motion.div)`
  position: relative;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  .photo-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }

  .photo-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    color: white;
    padding: ${theme.spacing.lg};
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  &:hover .photo-overlay {
    transform: translateY(0);
  }

  .photo-title {
    font-weight: 600;
    margin-bottom: ${theme.spacing.xs};
  }

  .photo-info {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
    font-size: 0.875rem;
    opacity: 0.9;

    .info-item {
      display: flex;
      align-items: center;
      gap: ${theme.spacing.xs};
    }
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${theme.spacing.lg};
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;

  .modal-image {
    max-width: 100%;
    max-height: 100%;
    border-radius: ${theme.borderRadius.lg};
  }

  .close-button {
    position: absolute;
    top: -50px;
    right: 0;
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: ${theme.spacing.sm};

    &:hover {
      opacity: 0.7;
    }
  }

  .modal-info {
    position: absolute;
    bottom: -60px;
    left: 0;
    right: 0;
    color: white;
    text-align: center;

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: ${theme.spacing.sm};
    }

    .modal-date {
      opacity: 0.8;
    }
  }
`;

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('todas');
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const categories = [
    { key: 'todas', label: 'Todas as Fotos' },
    { key: 'treinos', label: 'Treinos' },
    { key: 'rodas', label: 'Rodas' },
    { key: 'eventos', label: 'Eventos' },
    { key: 'batizados', label: 'Batizados' },
    { key: 'apresentacoes', label: 'Apresentações' },
  ];

  const mockPhotos = [
    {
      id: 1,
      title: 'Roda de Capoeira - Domingo',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'rodas',
      date: '2024-09-29',
      views: 45,
      likes: 12,
    },
    {
      id: 2,
      title: 'Treino de Sequências',
      image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'treinos',
      date: '2024-09-27',
      views: 32,
      likes: 8,
    },
    {
      id: 3,
      title: 'Batizado 2024 - Cerimônia',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'batizados',
      date: '2024-09-15',
      views: 89,
      likes: 23,
    },
    {
      id: 4,
      title: 'Apresentação Cultural',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'apresentacoes',
      date: '2024-09-10',
      views: 67,
      likes: 19,
    },
    {
      id: 5,
      title: 'Workshop de Instrumentos',
      image: 'https://images.unsplash.com/photo-1571019613519-1b42c8e94393?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'eventos',
      date: '2024-09-05',
      views: 54,
      likes: 15,
    },
    {
      id: 6,
      title: 'Treino Infantil',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'treinos',
      date: '2024-08-30',
      views: 38,
      likes: 11,
    },
  ];

  const filteredPhotos = activeFilter === 'todas' 
    ? mockPhotos 
    : mockPhotos.filter(photo => photo.category === activeFilter);

  return (
    <GalleryContainer>
      <HeroSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Galeria da Academia</h1>
            <p>
              Reviva os melhores momentos da nossa comunidade. 
              Fotos de treinos, rodas, batizados e eventos especiais.
            </p>
          </motion.div>
        </Container>
      </HeroSection>

      <Container>
        <FilterSection>
          {categories.map(category => (
            <FilterButton
              key={category.key}
              $active={activeFilter === category.key}
              onClick={() => setActiveFilter(category.key)}
            >
              {category.label}
            </FilterButton>
          ))}
        </FilterSection>

        <PhotoGrid>
          {filteredPhotos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedPhoto(photo)}
            >
              <img src={photo.image} alt={photo.title} className="photo-image" />
              
              <div className="photo-overlay">
                <div className="photo-title">{photo.title}</div>
                <div className="photo-info">
                  <div className="info-item">
                    <Calendar size={14} />
                    <span>{new Date(photo.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="info-item">
                    <Eye size={14} />
                    <span>{photo.views}</span>
                  </div>
                  <div className="info-item">
                    <Heart size={14} />
                    <span>{photo.likes}</span>
                  </div>
                </div>
              </div>
            </PhotoCard>
          ))}
        </PhotoGrid>
      </Container>

      {selectedPhoto && (
        <Modal
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-button"
              onClick={() => setSelectedPhoto(null)}
            >
              <X size={24} />
            </button>
            
            <img 
              src={selectedPhoto.image} 
              alt={selectedPhoto.title} 
              className="modal-image"
            />
            
            <div className="modal-info">
              <div className="modal-title">{selectedPhoto.title}</div>
              <div className="modal-date">
                {new Date(selectedPhoto.date).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </ModalContent>
        </Modal>
      )}
    </GalleryContainer>
  );
};

export default Gallery;