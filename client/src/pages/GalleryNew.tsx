import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, Eye, Camera } from 'lucide-react';
import { theme, Container } from '../styles/theme';
import api from '../services/api';

interface Photo {
  id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  category: string;
  event_id?: number;
  photographer: string;
  camera_settings: string;
  location: string;
  likes: number;
  views: number;
  tags: string[];
  created_at: string;
  is_featured: boolean;
}

const PageContainer = styled.div`
  padding: ${theme.spacing.xl} 0;
  min-height: 90vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing.xxl};
  
  h1 {
    color: ${theme.colors.primary};
    margin-bottom: ${theme.spacing.md};
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  p {
    color: ${theme.colors.text.secondary};
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: ${theme.spacing.xl};
  padding: 1.5rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid #e9ecef;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: ${theme.colors.primary};
      box-shadow: 0 0 0 3px ${theme.colors.primary}20;
    }
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${theme.colors.text.secondary};
    width: 1rem;
    height: 1rem;
  }
`;

const CategoryFilter = styled.select`
  padding: 0.75rem;
  border: 1px solid #e9ecef;
  border-radius: 0.5rem;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FeaturedToggle = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.active ? theme.colors.primary : '#e9ecef'};
  background: ${props => props.active ? theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.colors.text.secondary};
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: ${theme.colors.primary};
    color: ${props => props.active ? 'white' : theme.colors.primary};
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: ${theme.spacing.xl};
`;

const PhotoCard = styled(motion.div)`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const PhotoImage = styled.div<{ image: string }>`
  height: 250px;
  background: url(${props => props.image}) center center;
  background-size: cover;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 100%);
  }
`;

const PhotoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  color: white;
  z-index: 1;
  
  .category {
    background: ${theme.colors.primary};
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    display: inline-block;
    margin-bottom: 0.5rem;
  }
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
`;

const PhotoInfo = styled.div`
  padding: 1.5rem;
  
  .description {
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.5;
  }
  
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: ${theme.colors.text.secondary};
    
    .left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      svg {
        width: 0.875rem;
        height: 0.875rem;
      }
    }
    
    .stats {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .stat {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid ${theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${theme.colors.text.secondary};
  
  svg {
    width: 4rem;
    height: 4rem;
    margin-bottom: 1rem;
    opacity: 0.5;
  }
  
  h3 {
    margin-bottom: 0.5rem;
    color: ${theme.colors.text.primary};
  }
`;

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (showFeaturedOnly) params.append('featured', 'true');
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await api.get(`/gallery?${params}`);
      setPhotos(response.data.photos);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, showFeaturedOnly, searchTerm]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleLike = async (photoId: number) => {
    try {
      await api.post(`/gallery/${photoId}/like`);
      
      // Atualizar localmente
      setPhotos(prev => prev.map(photo => 
        photo.id === photoId 
          ? { ...photo, likes: photo.likes + 1 }
          : photo
      ));
    } catch (error) {
      console.error('Erro ao curtir foto:', error);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'workshops': 'Workshops',
      'eventos': 'Eventos',
      'batizado': 'Batizado',
      'treinos': 'Treinos',
      'apresentações': 'Apresentações',
      'festival': 'Festival',
      'aulas': 'Aulas',
      'instrumentos': 'Instrumentos'
    };
    return labels[category] || category;
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1>🖼️ Galeria de Fotos</h1>
            <p>
              Momentos especiais da nossa academia de capoeira capturados em imagens.
              Reviva os melhores momentos dos nossos eventos, treinos e apresentações.
            </p>
          </motion.div>
        </Header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <FiltersBar>
            <SearchBox>
              <Search />
              <input
                type="text"
                placeholder="Buscar fotos por título, descrição ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            
            <CategoryFilter
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">Todas as Categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {getCategoryLabel(category)}
                </option>
              ))}
            </CategoryFilter>
            
            <FeaturedToggle
              active={showFeaturedOnly}
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
            >
              <Filter size={16} />
              Apenas Destaques
            </FeaturedToggle>
          </FiltersBar>
        </motion.div>

        {loading ? (
          <LoadingContainer>
            <div className="spinner" />
          </LoadingContainer>
        ) : photos.length === 0 ? (
          <EmptyState>
            <Camera />
            <h3>Nenhuma foto encontrada</h3>
            <p>Tente ajustar os filtros ou buscar por outros termos.</p>
          </EmptyState>
        ) : (
          <PhotoGrid>
            {photos.map((photo, index) => (
              <PhotoCard
                key={photo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => handleLike(photo.id)}
              >
                <PhotoImage image={photo.thumbnail_url}>
                  <PhotoOverlay>
                    <div className="category">{getCategoryLabel(photo.category)}</div>
                    <h3>{photo.title}</h3>
                  </PhotoOverlay>
                </PhotoImage>
                
                <PhotoInfo>
                  <div className="description">{photo.description}</div>
                  <div className="meta">
                    <div className="left">
                      <Camera />
                      <span>{photo.photographer}</span>
                    </div>
                    <div className="stats">
                      <div className="stat">
                        <Heart size={14} />
                        <span>{photo.likes}</span>
                      </div>
                      <div className="stat">
                        <Eye size={14} />
                        <span>{photo.views}</span>
                      </div>
                    </div>
                  </div>
                </PhotoInfo>
              </PhotoCard>
            ))}
          </PhotoGrid>
        )}
      </Container>
    </PageContainer>
  );
};

export default Gallery;