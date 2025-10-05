import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, Plus, Edit3, Trash2, Eye, Search,
  Calendar, Tag, Heart, Download,
  X, Save, ImagePlus
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============ TIPOS ============
interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: 'roda' | 'evento' | 'graduacao' | 'treino' | 'mestre';
  tags: string[];
  likes: number;
  downloads: number;
  uploadDate: string;
  photographer?: string;
  isPublic: boolean;
}

interface GalleryFormData {
  title: string;
  description: string;
  category: 'roda' | 'evento' | 'graduacao' | 'treino' | 'mestre';
  tags: string;
  photographer: string;
  isPublic: boolean;
}

// ============ STYLED COMPONENTS ============
const Container = styled.div`
  padding: 30px;
  min-height: 100vh;
  background: transparent;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
  
  h1 {
    font-size: 2.2rem;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 15px;
    color: white;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  input {
    padding: 12px 15px 12px 45px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 0.9rem;
    width: 250px;
    backdrop-filter: blur(10px);
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
  }
  
  .search-icon {
    position: absolute;
    left: 15px;
    color: rgba(255, 255, 255, 0.6);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
  
  option {
    background: #333;
    color: white;
  }
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #333;
          &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4); }
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ff6b6b, #ff5252);
          color: white;
          &:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4); }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover { background: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }
        `;
    }
  }}
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
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
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }
`;

const ImageContainer = styled.div<{ imageUrl?: string }>`
  height: 250px;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
  
  &:hover .overlay {
    opacity: 1;
  }
  
  .category-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(255, 215, 0, 0.9);
    color: #333;
    text-transform: capitalize;
  }
  
  .public-badge {
    position: absolute;
    top: 15px;
    left: 15px;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(46, 204, 113, 0.9);
    color: white;
  }
`;

const GalleryContent = styled.div`
  padding: 20px;
`;

const GalleryHeader = styled.div`
  margin-bottom: 15px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.2rem;
    color: #ffd700;
    line-height: 1.3;
  }
  
  .photographer {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
  
  .tag {
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const GalleryStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  
  .stat {
    display: flex;
    align-items: center;
    gap: 5px;
    
    svg {
      color: #ffd700;
    }
  }
`;

const GalleryDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ActionButton = styled(motion.button)<{ variant?: 'edit' | 'delete' | 'view' }>`
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.variant) {
      case 'edit':
        return `background: rgba(52, 152, 219, 0.2); color: #3498db; &:hover { background: rgba(52, 152, 219, 0.3); }`;
      case 'delete':
        return `background: rgba(231, 76, 60, 0.2); color: #e74c3c; &:hover { background: rgba(231, 76, 60, 0.3); }`;
      default:
        return `background: rgba(46, 204, 113, 0.2); color: #2ecc71; &:hover { background: rgba(46, 204, 113, 0.3); }`;
    }
  }}
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const Modal = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 30px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  label {
    font-weight: 600;
    color: #ffd700;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  input, select, textarea {
    padding: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 0.9rem;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus {
      outline: none;
      border-color: #ffd700;
      box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  select option {
    background: #333;
    color: white;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 5px;
  
  input[type="checkbox"] {
    width: auto;
    margin: 0;
  }
  
  label {
    margin: 0;
    font-weight: normal;
    cursor: pointer;
  }
`;

// ============ DADOS MOCK ============
const mockGalleryItems: GalleryItem[] = [
  {
    id: 1,
    title: 'Roda de Capoeira no Parque',
    description: 'Momento especial da roda mensal realizada no Parque Ibirapuera com grande participação.',
    imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400',
    category: 'roda',
    tags: ['capoeira', 'roda', 'parque', 'comunidade'],
    likes: 45,
    downloads: 12,
    uploadDate: '2024-12-10',
    photographer: 'João Silva',
    isPublic: true
  },
  {
    id: 2,
    title: 'Cerimônia de Graduação',
    description: 'Batizado e troca de cordas com a presença do Mestre Bimba Jr.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    category: 'graduacao',
    tags: ['batizado', 'graduacao', 'mestre', 'cordas'],
    likes: 78,
    downloads: 23,
    uploadDate: '2024-11-25',
    photographer: 'Maria Santos',
    isPublic: true
  },
  {
    id: 3,
    title: 'Treino de Instrumentos',
    description: 'Aula especial focada no aprendizado dos instrumentos tradicionais.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
    category: 'treino',
    tags: ['instrumentos', 'berimbau', 'pandeiro', 'treino'],
    likes: 32,
    downloads: 8,
    uploadDate: '2024-12-05',
    photographer: 'Carlos Mendes',
    isPublic: false
  },
  {
    id: 4,
    title: 'Apresentação Cultural',
    description: 'Show de capoeira no festival de cultura brasileira.',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    category: 'evento',
    tags: ['apresentacao', 'festival', 'cultura', 'show'],
    likes: 56,
    downloads: 18,
    uploadDate: '2024-11-30',
    photographer: 'Ana Costa',
    isPublic: true
  }
];

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'roda': return '⭕';
    case 'evento': return '🎉';
    case 'graduacao': return '🎓';
    case 'treino': return '💪';
    case 'mestre': return '👨‍🏫';
    default: return '📸';
  }
};

// ============ COMPONENTE PRINCIPAL ============
const GalleryManagement: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState<GalleryFormData>({
    title: '',
    description: '',
    category: 'roda',
    tags: '',
    photographer: '',
    isPublic: true
  });

  // Filtrar itens
  useEffect(() => {
    let filtered = galleryItems.filter(item => 
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
       item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (categoryFilter === '' || item.category === categoryFilter)
    );
    setFilteredItems(filtered);
  }, [galleryItems, searchTerm, categoryFilter]);

  // Abrir modal para criar/editar
  const handleOpenModal = (item?: GalleryItem) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        tags: item.tags.join(', '),
        photographer: item.photographer || '',
        isPublic: item.isPublic
      });
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        description: '',
        category: 'roda',
        tags: '',
        photographer: '',
        isPublic: true
      });
    }
    setShowModal(true);
  };

  // Salvar item
  const handleSaveItem = () => {
    const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    if (editingItem) {
      setGalleryItems(galleryItems.map(item => 
        item.id === editingItem.id 
          ? { 
              ...item, 
              ...formData,
              tags: tagsArray
            }
          : item
      ));
      toast.success('Item da galeria atualizado com sucesso!');
    } else {
      const newItem: GalleryItem = {
        id: Date.now(),
        ...formData,
        tags: tagsArray,
        imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400',
        likes: 0,
        downloads: 0,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setGalleryItems([...galleryItems, newItem]);
      toast.success('Novo item adicionado à galeria!');
    }
    setShowModal(false);
  };

  // Excluir item
  const handleDeleteItem = (itemId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este item da galeria?')) {
      setGalleryItems(galleryItems.filter(item => item.id !== itemId));
      toast.success('Item removido da galeria!');
    }
  };

  return (
    <Container>
      <Header>
        <h1>
          <ImageIcon size={32} />
          Gerenciar Galeria
        </h1>
        
        <Controls>
          <SearchBar>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar fotos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <FilterSelect
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            <option value="roda">Roda</option>
            <option value="evento">Evento</option>
            <option value="graduacao">Graduação</option>
            <option value="treino">Treino</option>
            <option value="mestre">Mestre</option>
          </FilterSelect>
          
          <Button
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} />
            Adicionar Foto
          </Button>
        </Controls>
      </Header>

      <GalleryGrid>
        <AnimatePresence>
          {filteredItems.map((item) => (
            <GalleryCard
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ImageContainer imageUrl={item.imageUrl}>
                <div className="category-badge">
                  {getCategoryIcon(item.category)} {item.category}
                </div>
                {item.isPublic && (
                  <div className="public-badge">Público</div>
                )}
                <div className="overlay">
                  <ActionButton
                    variant="view"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Eye size={16} />
                  </ActionButton>
                  <ActionButton
                    variant="edit"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleOpenModal(item)}
                  >
                    <Edit3 size={16} />
                  </ActionButton>
                  <ActionButton
                    variant="delete"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </div>
              </ImageContainer>
              
              <GalleryContent>
                <GalleryHeader>
                  <h3>{item.title}</h3>
                  {item.photographer && (
                    <div className="photographer">por {item.photographer}</div>
                  )}
                </GalleryHeader>
                
                <GalleryDescription>{item.description}</GalleryDescription>
                
                <TagsContainer>
                  {item.tags.map((tag, index) => (
                    <span key={index} className="tag">#{tag}</span>
                  ))}
                </TagsContainer>
                
                <GalleryStats>
                  <div className="stat">
                    <Heart size={16} />
                    {item.likes}
                  </div>
                  <div className="stat">
                    <Download size={16} />
                    {item.downloads}
                  </div>
                  <div className="stat">
                    <Calendar size={16} />
                    {new Date(item.uploadDate).toLocaleDateString('pt-BR')}
                  </div>
                </GalleryStats>
              </GalleryContent>
            </GalleryCard>
          ))}
        </AnimatePresence>
      </GalleryGrid>

      {/* Modal de Criar/Editar */}
      <AnimatePresence>
        {showModal && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <Modal
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#ffd700' }}>
                  <ImagePlus size={24} style={{ marginRight: '10px' }} />
                  {editingItem ? 'Editar Foto' : 'Nova Foto'}
                </h2>
                <Button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </Button>
              </div>

              <FormGrid>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Título da Foto</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Título da foto"
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva a foto..."
                  />
                </FormGroup>

                <FormGroup>
                  <label>Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="roda">Roda</option>
                    <option value="evento">Evento</option>
                    <option value="graduacao">Graduação</option>
                    <option value="treino">Treino</option>
                    <option value="mestre">Mestre</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Fotógrafo</label>
                  <input
                    type="text"
                    value={formData.photographer}
                    onChange={(e) => setFormData({...formData, photographer: e.target.value})}
                    placeholder="Nome do fotógrafo"
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>
                    <Tag size={16} />
                    Tags (separadas por vírgula)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                    placeholder="capoeira, roda, mestre, graduação..."
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <CheckboxGroup>
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => setFormData({...formData, isPublic: e.target.checked})}
                    />
                    <label htmlFor="isPublic">Tornar foto pública na galeria</label>
                  </CheckboxGroup>
                </FormGroup>
              </FormGrid>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <Button onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSaveItem}>
                  <Save size={20} />
                  {editingItem ? 'Atualizar' : 'Adicionar'} Foto
                </Button>
              </div>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default GalleryManagement;