import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Search,
  Eye, Grid, List,
  X, RefreshCw, Heart
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin';

// ============ INTERFACES ============
interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url?: string;
  category: 'events' | 'training' | 'performances' | 'academy' | 'competitions';
  photographer?: string;
  event_date?: string;
  location?: string;
  is_featured: boolean;
  status: 'active' | 'inactive';
  sort_order: number;
  views: number;
  likes: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface GalleryFilters {
  search?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// ============ STYLED COMPONENTS ============
const Container = styled.div`
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 5px;
`;

const ControlsBar = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  width: 20px;
  height: 20px;
`;

const FilterSelect = styled.select`
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  min-width: 150px;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const ActionButton = styled(motion.button)`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &.primary {
    background: linear-gradient(45deg, #ffd700, #ffed4e);
    color: #333;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  &.danger {
    background: linear-gradient(45deg, #ff4757, #ff6b7a);
    color: white;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 71, 87, 0.3);
    }
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 4px;
`;

const ViewButton = styled.button<{ $active: boolean }>`
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'transparent'};
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const GalleryCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: #ffd700;
  }
`;

const GalleryImage = styled.div`
  position: relative;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.5));
  }
`;

const GalleryOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  display: flex;
  gap: 5px;
`;

const OverlayButton = styled(motion.button)`
  width: 35px;
  height: 35px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;

const GalleryInfo = styled.div`
  padding: 15px;
`;

const GalleryTitle = styled.h3`
  margin: 0 0 5px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
`;

const GalleryMeta = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
`;

const GalleryStats = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => props.$status === 'active' ? '#27ae60' : '#e74c3c'};
  color: white;
`;

const CategoryBadge = styled.span<{ $category: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${props => {
    switch (props.$category) {
      case 'events': return '#3498db';
      case 'training': return '#e67e22';
      case 'performances': return '#9b59b6';
      case 'academy': return '#2ecc71';
      case 'competitions': return '#f39c12';
      default: return '#95a5a6';
    }
  }};
  color: white;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  color: white;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: white;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  min-height: 100px;
  resize: vertical;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const Select = styled.select`
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: #ffd700;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  cursor: pointer;
`;

const FormActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
`;

const PaginationButton = styled.button<{ $active?: boolean }>`
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: ${props => props.$active ? '#ffd700' : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$active ? '#333' : 'white'};
  cursor: pointer;
  
  &:hover {
    background: ${props => props.$active ? '#ffed4e' : 'rgba(255, 255, 255, 0.2)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ============ COMPONENT ============
const GalleryManager: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<GalleryFilters>({
    page: 1,
    limit: 12
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_images: 0
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    featured: 0
  });

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    image_url: string;
    category: 'events' | 'training' | 'performances' | 'academy' | 'competitions';
    photographer: string;
    location: string;
    is_featured: boolean;
    status: 'active' | 'inactive';
    tags: string;
  }>({
    title: '',
    description: '',
    image_url: '',
    category: 'academy',
    photographer: '',
    location: '',
    is_featured: false,
    status: 'active',
    tags: ''
  });

  // Load gallery items
  const loadGalleryItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getGalleryItems(filters);
      setGalleryItems(response.images || []);
      setPagination(response.pagination || {
        current_page: 1,
        total_pages: 1,
        total_images: 0
      });
    } catch (error) {
      console.error('Erro ao carregar galeria:', error);
      toast.error('Erro ao carregar itens da galeria');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load stats
  const loadStats = useCallback(async () => {
    try {
      const response = await adminService.getGalleryStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, []);

  useEffect(() => {
    loadGalleryItems();
    loadStats();
  }, [loadGalleryItems, loadStats]);

  // Handle search
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  // Handle filter change
  const handleFilterChange = (key: keyof GalleryFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      if (editingItem) {
        await adminService.updateGalleryItem(editingItem.id, submitData);
        toast.success('Item da galeria atualizado com sucesso!');
      } else {
        await adminService.createGalleryItem(submitData);
        toast.success('Item da galeria criado com sucesso!');
      }

      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadGalleryItems();
      loadStats();
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast.error('Erro ao salvar item da galeria');
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) {
      return;
    }

    try {
      await adminService.deleteGalleryItem(id);
      toast.success('Item excluído com sucesso!');
      loadGalleryItems();
      loadStats();
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast.error('Erro ao excluir item');
    }
  };

  // Handle edit
  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      image_url: item.image_url,
      category: item.category,
      photographer: item.photographer || '',
      location: item.location || '',
      is_featured: item.is_featured,
      status: item.status,
      tags: item.tags?.join(', ') || ''
    });
    setShowModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: 'academy' as const,
      photographer: '',
      location: '',
      is_featured: false,
      status: 'active' as const,
      tags: ''
    });
  };

  // Handle new item
  const handleNew = () => {
    setEditingItem(null);
    resetForm();
    setShowModal(true);
  };

  return (
    <Container>
      <Header>
        <Title>Gestão de Galeria</Title>
        <HeaderActions>
          <ActionButton 
            className="primary" 
            onClick={handleNew}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={20} />
            Nova Imagem
          </ActionButton>
          <ActionButton 
            className="secondary"
            onClick={loadGalleryItems}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={20} />
            Atualizar
          </ActionButton>
        </HeaderActions>
      </Header>

      <StatsBar>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatValue>{stats.total}</StatValue>
          <StatLabel>Total de Imagens</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatValue>{stats.active}</StatValue>
          <StatLabel>Imagens Ativas</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatValue>{stats.featured}</StatValue>
          <StatLabel>Imagens Destacadas</StatLabel>
        </StatCard>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatValue>{stats.inactive}</StatValue>
          <StatLabel>Imagens Inativas</StatLabel>
        </StatCard>
      </StatsBar>

      <ControlsBar>
        <SearchBox>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Buscar por título, descrição..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </SearchBox>
        
        <FilterSelect
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
        >
          <option value="">Todas as categorias</option>
          <option value="events">Eventos</option>
          <option value="training">Treinamentos</option>
          <option value="performances">Apresentações</option>
          <option value="academy">Academia</option>
          <option value="competitions">Competições</option>
        </FilterSelect>

        <FilterSelect
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </FilterSelect>

        <ViewToggle>
          <ViewButton
            $active={viewMode === 'grid'}
            onClick={() => setViewMode('grid')}
          >
            <Grid size={16} />
          </ViewButton>
          <ViewButton
            $active={viewMode === 'list'}
            onClick={() => setViewMode('list')}
          >
            <List size={16} />
          </ViewButton>
        </ViewToggle>
      </ControlsBar>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <RefreshCw size={40} style={{ animation: 'spin 1s linear infinite' }} />
          <div style={{ marginTop: '20px' }}>Carregando galeria...</div>
        </div>
      ) : (
        <>
          <GalleryGrid>
            <AnimatePresence>
              {galleryItems.map((item) => (
                <GalleryCard
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <GalleryImage
                    style={{ backgroundImage: `url(${item.image_url})` }}
                  >
                    <GalleryOverlay>
                      <OverlayButton
                        onClick={() => handleEdit(item)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Edit size={16} />
                      </OverlayButton>
                      <OverlayButton
                        onClick={() => handleDelete(item.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={16} />
                      </OverlayButton>
                    </GalleryOverlay>
                  </GalleryImage>
                  
                  <GalleryInfo>
                    <GalleryTitle>{item.title}</GalleryTitle>
                    <GalleryMeta>
                      {item.photographer && `Por ${item.photographer}`}
                      {item.location && ` • ${item.location}`}
                    </GalleryMeta>
                    
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                      <StatusBadge $status={item.status}>
                        {item.status === 'active' ? 'Ativo' : 'Inativo'}
                      </StatusBadge>
                      <CategoryBadge $category={item.category}>
                        {item.category}
                      </CategoryBadge>
                      {item.is_featured && (
                        <CategoryBadge $category="featured">
                          Destaque
                        </CategoryBadge>
                      )}
                    </div>
                    
                    <GalleryStats>
                      <span>
                        <Eye size={14} style={{ marginRight: '5px' }} />
                        {item.views}
                      </span>
                      <span>
                        <Heart size={14} style={{ marginRight: '5px' }} />
                        {item.likes}
                      </span>
                    </GalleryStats>
                  </GalleryInfo>
                </GalleryCard>
              ))}
            </AnimatePresence>
          </GalleryGrid>

          {pagination.total_pages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
              >
                Anterior
              </PaginationButton>
              
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(page => (
                <PaginationButton
                  key={page}
                  $active={page === pagination.current_page}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.total_pages}
              >
                Próxima
              </PaginationButton>
            </Pagination>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false);
                setEditingItem(null);
                resetForm();
              }
            }}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalHeader>
                <ModalTitle>
                  {editingItem ? 'Editar Imagem' : 'Nova Imagem'}
                </ModalTitle>
                <CloseButton
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                    resetForm();
                  }}
                >
                  <X size={24} />
                </CloseButton>
              </ModalHeader>

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label>Título *</Label>
                  <Input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Digite o título da imagem"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Descrição</Label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Digite uma descrição para a imagem"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>URL da Imagem *</Label>
                  <Input
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Categoria</Label>
                  <Select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                  >
                    <option value="academy">Academia</option>
                    <option value="events">Eventos</option>
                    <option value="training">Treinamentos</option>
                    <option value="performances">Apresentações</option>
                    <option value="competitions">Competições</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Fotógrafo</Label>
                  <Input
                    type="text"
                    value={formData.photographer}
                    onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                    placeholder="Nome do fotógrafo"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Local</Label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Local onde foi tirada a foto"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Tags</Label>
                  <Input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="capoeira, roda, berimbau (separadas por vírgula)"
                  />
                </FormGroup>

                <FormGroup>
                  <CheckboxLabel>
                    <Checkbox
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                    />
                    Imagem destacada
                  </CheckboxLabel>
                </FormGroup>

                <FormGroup>
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                  </Select>
                </FormGroup>

                <FormActions>
                  <ActionButton
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </ActionButton>
                  <ActionButton
                    type="submit"
                    className="primary"
                  >
                    {editingItem ? 'Atualizar' : 'Criar'}
                  </ActionButton>
                </FormActions>
              </Form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default GalleryManager;