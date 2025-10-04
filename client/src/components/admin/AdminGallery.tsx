import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff, 
  Camera, 
  Search,
  Heart,
  Calendar
} from 'lucide-react';
import { adminService } from '../../services/admin';

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
  updated_at: string;
  is_featured: boolean;
  is_public: boolean;
}

interface GalleryStats {
  total_photos: number;
  public_photos: number;
  private_photos: number;
  featured_photos: number;
  total_views: number;
  total_likes: number;
  categories: Record<string, number>;
  photographers: Record<string, number>;
  monthly_uploads: Record<string, number>;
  top_photos: Array<{
    id: number;
    title: string;
    views: number;
    likes: number;
    total_engagement: number;
  }>;
}

const Container = styled.div`
  padding: 0;
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border-left: 4px solid;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatCardNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatCardLabel = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ControlsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  
  input {
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  
  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #6c757d;
    width: 1rem;
    height: 1rem;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover {
    background: #0056b3;
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PhotoCard = styled(motion.div)`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const PhotoImage = styled.div<{ image: string }>`
  height: 200px;
  background: url(${props => props.image}) center center;
  background-size: cover;
  position: relative;
  
  .badges {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    display: flex;
    gap: 0.5rem;
    
    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      
      &.featured {
        background: #ffc107;
        color: #212529;
      }
      
      &.public {
        background: #28a745;
        color: white;
      }
      
      &.private {
        background: #dc3545;
        color: white;
      }
    }
  }
`;

const PhotoInfo = styled.div`
  padding: 1rem;
  
  .title {
    font-weight: 600;
    color: #212529;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: #6c757d;
    margin-bottom: 0.75rem;
    
    .item {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      
      svg {
        width: 0.75rem;
        height: 0.75rem;
      }
    }
  }
  
  .category {
    display: inline-block;
    background: #e9ecef;
    color: #495057;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.75rem;
    font-weight: 500;
    margin-bottom: 0.75rem;
  }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0 1rem 1rem;
  
  button {
    flex: 1;
    padding: 0.5rem;
    border: 1px solid;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25rem;
    
    svg {
      width: 0.875rem;
      height: 0.875rem;
    }
    
    &.edit {
      border-color: #17a2b8;
      color: #17a2b8;
      background: white;
      
      &:hover {
        background: #17a2b8;
        color: white;
      }
    }
    
    &.toggle {
      border-color: #ffc107;
      color: #856404;
      background: white;
      
      &:hover {
        background: #ffc107;
        color: #212529;
      }
    }
    
    &.visibility {
      border-color: #6f42c1;
      color: #6f42c1;
      background: white;
      
      &:hover {
        background: #6f42c1;
        color: white;
      }
    }
    
    &.delete {
      border-color: #dc3545;
      color: #dc3545;
      background: white;
      
      &:hover {
        background: #dc3545;
        color: white;
      }
    }
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  
  h3 {
    margin: 0 0 1.5rem;
    color: #212529;
  }
  
  .form-group {
    margin-bottom: 1rem;
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 0.875rem;
      
      &:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      }
    }
    
    textarea {
      resize: vertical;
      min-height: 80px;
    }
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  
  .checkbox-group {
    display: flex;
    gap: 1rem;
    
    label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: normal;
      cursor: pointer;
    }
  }
  
  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    
    button {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 4px;
      font-weight: 600;
      cursor: pointer;
      
      &.save {
        background: #007bff;
        color: white;
        
        &:hover {
          background: #0056b3;
        }
      }
      
      &.cancel {
        background: #6c757d;
        color: white;
        
        &:hover {
          background: #545b62;
        }
      }
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #64748b;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const AdminGallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [stats, setStats] = useState<GalleryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null);

  const loadPhotos = useCallback(async () => {
    try {
      setLoading(true);

      const response = await adminService.getGalleryItems({
        search: searchTerm || undefined,
        category: categoryFilter || undefined,
        status: visibilityFilter || undefined
      });
      setPhotos(response.images || []);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, categoryFilter, visibilityFilter]);

  const loadStats = useCallback(async () => {
    try {
      const response = await adminService.getGalleryStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }, []);

  useEffect(() => {
    loadPhotos();
    loadStats();
  }, [loadPhotos, loadStats]);

  const handleToggleFeatured = async (photoId: number) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      await adminService.updateGalleryItem(photoId, { is_featured: !photo?.is_featured });
      loadPhotos();
    } catch (error) {
      console.error('Erro ao alterar destaque:', error);
    }
  };

  const handleToggleVisibility = async (photoId: number) => {
    try {
      const photo = photos.find(p => p.id === photoId);
      await adminService.updateGalleryItem(photoId, { is_public: !photo?.is_public });
      loadPhotos();
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta foto?')) {
      return;
    }

    try {
      await adminService.deleteGalleryItem(photoId);
      loadPhotos();
      loadStats();
    } catch (error) {
      console.error('Erro ao excluir foto:', error);
    }
  };

  const handleSavePhoto = async (formData: any) => {
    try {
      if (editingPhoto) {
        await adminService.updateGalleryItem(editingPhoto.id, formData);
      } else {
        await adminService.createGalleryItem(formData);
      }
      
      setShowModal(false);
      setEditingPhoto(null);
      loadPhotos();
      loadStats();
    } catch (error) {
      console.error('Erro ao salvar foto:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
    <Container>
      {stats && (
        <StatsCards>
          <StatCard
            style={{ borderLeftColor: '#007bff' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatCardNumber style={{ color: '#007bff' }}>{stats.total_photos}</StatCardNumber>
            <StatCardLabel>Total de Fotos</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#28a745' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatCardNumber style={{ color: '#28a745' }}>{stats.public_photos}</StatCardNumber>
            <StatCardLabel>Fotos Públicas</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#ffc107' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatCardNumber style={{ color: '#e0a800' }}>{stats.featured_photos}</StatCardNumber>
            <StatCardLabel>Fotos em Destaque</StatCardLabel>
          </StatCard>
          
          <StatCard
            style={{ borderLeftColor: '#17a2b8' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatCardNumber style={{ color: '#17a2b8' }}>{stats.total_views.toLocaleString()}</StatCardNumber>
            <StatCardLabel>Total de Visualizações</StatCardLabel>
          </StatCard>
        </StatsCards>
      )}

      <ControlsBar>
        <h2>📷 Gerenciamento de Galeria</h2>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBox>
            <Search />
            <input
              type="text"
              placeholder="Buscar fotos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
          
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            <option value="workshops">Workshops</option>
            <option value="eventos">Eventos</option>
            <option value="batizado">Batizado</option>
            <option value="treinos">Treinos</option>
            <option value="apresentações">Apresentações</option>
            <option value="festival">Festival</option>
            <option value="aulas">Aulas</option>
            <option value="instrumentos">Instrumentos</option>
          </FilterSelect>
          
          <FilterSelect
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
          >
            <option value="">Todas as Visibilidades</option>
            <option value="true">Públicas</option>
            <option value="false">Privadas</option>
          </FilterSelect>
          
          <AddButton onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Nova Foto
          </AddButton>
        </div>
      </ControlsBar>

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          Carregando galeria...
        </LoadingContainer>
      ) : photos.length === 0 ? (
        <LoadingContainer>
          Nenhuma foto encontrada
        </LoadingContainer>
      ) : (
        <PhotoGrid>
          {photos.map((photo, index) => (
            <PhotoCard
              key={photo.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PhotoImage image={photo.thumbnail_url}>
                <div className="badges">
                  {photo.is_featured && <span className="badge featured">Destaque</span>}
                  <span className={`badge ${photo.is_public ? 'public' : 'private'}`}>
                    {photo.is_public ? 'Pública' : 'Privada'}
                  </span>
                </div>
              </PhotoImage>
              
              <PhotoInfo>
                <div className="title">{photo.title}</div>
                
                <div className="meta">
                  <div className="item">
                    <Heart />
                    <span>{photo.likes} curtidas</span>
                  </div>
                  <div className="item">
                    <Eye />
                    <span>{photo.views} views</span>
                  </div>
                  <div className="item">
                    <Camera />
                    <span>{photo.photographer}</span>
                  </div>
                  <div className="item">
                    <Calendar />
                    <span>{formatDate(photo.created_at)}</span>
                  </div>
                </div>
                
                <div className="category">{getCategoryLabel(photo.category)}</div>
              </PhotoInfo>
              
              <PhotoActions>
                <button
                  className="edit"
                  onClick={() => {
                    setEditingPhoto(photo);
                    setShowModal(true);
                  }}
                >
                  <Edit />
                  Editar
                </button>
                
                <button
                  className="toggle"
                  onClick={() => handleToggleFeatured(photo.id)}
                >
                  {photo.is_featured ? <StarOff /> : <Star />}
                  {photo.is_featured ? 'Remover' : 'Destacar'}
                </button>
                
                <button
                  className="visibility"
                  onClick={() => handleToggleVisibility(photo.id)}
                >
                  {photo.is_public ? <EyeOff /> : <Eye />}
                  {photo.is_public ? 'Ocultar' : 'Publicar'}
                </button>
                
                <button
                  className="delete"
                  onClick={() => handleDelete(photo.id)}
                >
                  <Trash2 />
                  Excluir
                </button>
              </PhotoActions>
            </PhotoCard>
          ))}
        </PhotoGrid>
      )}

      {showModal && (
        <PhotoFormModal
          photo={editingPhoto}
          onSave={handleSavePhoto}
          onClose={() => {
            setShowModal(false);
            setEditingPhoto(null);
          }}
        />
      )}
    </Container>
  );
};

interface PhotoFormModalProps {
  photo: Photo | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

const PhotoFormModal: React.FC<PhotoFormModalProps> = ({ photo, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: photo?.title || '',
    description: photo?.description || '',
    image_url: photo?.image_url || '',
    thumbnail_url: photo?.thumbnail_url || '',
    category: photo?.category || 'eventos',
    photographer: photo?.photographer || '',
    camera_settings: photo?.camera_settings || '',
    location: photo?.location || '',
    tags: photo?.tags.join(', ') || '',
    is_featured: photo?.is_featured || false,
    is_public: photo?.is_public !== false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };
    
    onSave(submitData);
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>{photo ? 'Editar Foto' : 'Nova Foto'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
          
          <div className="form-group">
            <label>URL da Imagem *</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Categoria *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                <option value="eventos">Eventos</option>
                <option value="workshops">Workshops</option>
                <option value="batizado">Batizado</option>
                <option value="treinos">Treinos</option>
                <option value="apresentações">Apresentações</option>
                <option value="festival">Festival</option>
                <option value="aulas">Aulas</option>
                <option value="instrumentos">Instrumentos</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Fotógrafo</label>
              <input
                type="text"
                value={formData.photographer}
                onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Configurações da Câmera</label>
              <input
                type="text"
                value={formData.camera_settings}
                onChange={(e) => setFormData(prev => ({ ...prev, camera_settings: e.target.value }))}
                placeholder="Ex: Canon 5D, 85mm f/1.4"
              />
            </div>
            
            <div className="form-group">
              <label>Local</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              placeholder="capoeira, evento, roda, música"
            />
          </div>
          
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
              />
              Foto em destaque
            </label>
            
            <label>
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
              />
              Foto pública
            </label>
          </div>
          
          <div className="actions">
            <button type="button" className="cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="save">
              {photo ? 'Salvar Alterações' : 'Adicionar Foto'}
            </button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AdminGallery;