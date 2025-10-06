import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Edit, Trash2, DollarSign, 
  MapPin, Star, Search,
  Save, X, Upload
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

// ============ TYPES ============
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  old_price?: number;
  category: string;
  stock_quantity: number;
  weight?: number;
  images?: string[];
  status: 'active' | 'inactive';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface NewProduct {
  name: string;
  description: string;
  price: number;
  old_price?: number;
  category: string;
  stock_quantity: number;
  weight?: number;
  status: 'active' | 'inactive';
  is_featured: boolean;
}

// ============ STYLED COMPONENTS ============
const Container = styled.div`
  padding: 20px;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const Controls = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
`;

const SearchBar = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 15px 12px 45px;
  border: 2px solid rgba(255, 255, 255, 0.2);
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
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
`;

const FilterSelect = styled.select`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
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
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #333;
        `;
      case 'danger':
        return `
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const ProductCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }
`;

const ProductImage = styled.div<{ imageUrl?: string }>`
  height: 200px;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover`
    : 'linear-gradient(45deg, #667eea, #764ba2)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 4rem;
`;

const ProductContent = styled.div`
  padding: 20px;
`;

const ProductTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #ffd700;
`;

const ProductMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 15px 0;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  
  ${props => {
    switch (props.status) {
      case 'active':
        return 'background: #10b981; color: white;';
      case 'inactive':
        return 'background: #6b7280; color: white;';
      default:
        return 'background: #374151; color: white;';
    }
  }}
`;

const FeaturedBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #f59e0b;
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 15px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${props => props.fullWidth && 'grid-column: 1 / -1;'}
`;

const Label = styled.label`
  font-weight: 600;
  color: #ffd700;
`;

const Input = styled.input`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const TextArea = styled.textarea`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
  }
`;

const Select = styled.select`
  padding: 12px 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
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

const ImageUpload = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.1);
  }
  
  input[type="file"] {
    display: none;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.7);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  
  svg {
    font-size: 4rem;
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  h3 {
    font-size: 1.5rem;
    margin: 0 0 10px 0;
  }
  
  p {
    font-size: 1rem;
    margin: 0;
  }
`;

const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .current-price {
    font-size: 1.2rem;
    font-weight: 600;
    color: #10b981;
  }
  
  .old-price {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: line-through;
  }
`;

const StockIndicator = styled.div<{ stock: number }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  
  ${props => {
    if (props.stock === 0) return 'color: #ef4444;';
    if (props.stock < 10) return 'color: #f59e0b;';
    return 'color: #10b981;';
  }}
`;

// ============ MAIN COMPONENT ============
const ProductsManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const [formData, setFormData] = useState<NewProduct>({
    name: '',
    description: '',
    price: 0,
    old_price: undefined,
    category: '',
    stock_quantity: 0,
    weight: undefined,
    status: 'active',
    is_featured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Buscando produtos...');
      const response = await api.get('/api/products');
      console.log('Produtos recebidos:', response.data);
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = Array.from(new Set(products.map(product => product.category)));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (selectedImages.length + files.length > 10) {
      toast.error('Máximo 10 imagens permitidas');
      return;
    }
    
    setSelectedImages(prev => [...prev, ...files]);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        old_price: product.old_price || undefined,
        category: product.category,
        stock_quantity: product.stock_quantity,
        weight: product.weight || undefined,
        status: product.status,
        is_featured: product.is_featured
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        old_price: undefined,
        category: '',
        stock_quantity: 0,
        weight: undefined,
        status: 'active',
        is_featured: false
      });
    }
    setSelectedImages([]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedImages([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação client-side
    if (!formData.name.trim()) {
      toast.error('Nome do produto é obrigatório');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Descrição é obrigatória');
      return;
    }
    if (!formData.category.trim()) {
      toast.error('Categoria é obrigatória');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Preço deve ser maior que zero');
      return;
    }
    if (formData.stock_quantity < 0) {
      toast.error('Quantidade em estoque não pode ser negativa');
      return;
    }

    try {
      console.log('📦 Iniciando submissão do produto...');
      console.log('📝 Dados do form:', formData);
      console.log('🖼️ Imagens selecionadas:', selectedImages.length);
      
      let response;
      
      if (selectedImages.length > 0) {
        console.log('📤 Enviando com imagens usando FormData');
        // Se há imagens, usar FormData
        const submitData = new FormData();
        
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price.toString());
        if (formData.old_price) submitData.append('old_price', formData.old_price.toString());
        submitData.append('category', formData.category);
        submitData.append('stock_quantity', formData.stock_quantity.toString());
        if (formData.weight) submitData.append('weight', formData.weight.toString());
        submitData.append('status', 'active');
        submitData.append('is_featured', formData.is_featured.toString());

        // Add images
        selectedImages.forEach((image, index) => {
          console.log(`📷 Adicionando imagem ${index + 1}:`, image.name);
          submitData.append('images', image);
        });

        console.log('🔄 Fazendo requisição PUT/POST com FormData...');
        if (editingProduct) {
          console.log(`📍 URL: /api/admin/products/${editingProduct.id}`);
          response = await api.put(`/api/admin/products/${editingProduct.id}`, submitData);
        } else {
          console.log('📍 URL: /api/admin/products');
          response = await api.post('/api/admin/products', submitData);
        }
      } else {
        console.log('📤 Enviando sem imagens usando JSON');
        // Se não há imagens, usar JSON
        const jsonData = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          old_price: formData.old_price || null,
          category: formData.category,
          stock_quantity: formData.stock_quantity,
          weight: formData.weight || null,
          status: 'active',
          is_featured: formData.is_featured
        };

        console.log('🔄 Fazendo requisição PUT/POST com JSON:', jsonData);
        if (editingProduct) {
          console.log(`📍 URL: /api/admin/products/${editingProduct.id}`);
          response = await api.put(`/api/admin/products/${editingProduct.id}`, jsonData);
        } else {
          console.log('📍 URL: /api/admin/products');
          response = await api.post('/api/admin/products', jsonData);
        }
      }

      console.log('✅ Resposta da API:', response.data);
      toast.success(editingProduct ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
      closeModal();
      fetchProducts();
    } catch (error: any) {
      console.error('❌ Erro ao salvar produto:', error);
      console.log('📊 Status do erro:', error.response?.status);
      console.log('📄 Dados do erro:', error.response?.data);
      console.log('🔧 Headers da requisição:', error.config?.headers);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message ||
                          'Erro ao salvar produto';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      console.log('🗑️ Excluindo produto:', productId);
      const response = await api.delete(`/api/admin/products/${productId}`);
      console.log('✅ Produto excluído com sucesso:', response.data);
      toast.success('Produto excluído com sucesso!');
      fetchProducts();
    } catch (error: any) {
      console.error('❌ Erro ao excluir produto:', error);
      console.log('Status do erro:', error.response?.status);
      console.log('Dados do erro:', error.response?.data);
      
      // Se for erro de autenticação, não mostrar mensagem de erro aqui
      // pois o interceptor já vai tratar o redirecionamento
      if (error.response?.status !== 401) {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.error || 
                            'Erro ao excluir produto';
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Container>
      <Header>
        <Title>Gestão de Produtos</Title>
        <Button variant="primary" onClick={() => openModal()}>
          <Plus size={20} />
          Novo Produto
        </Button>
      </Header>

      <Controls>
        <SearchBar>
          <SearchIcon>
            <Search size={20} />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </FilterSelect>

        <FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os status</option>
          <option value="active">Ativo</option>
          <option value="inactive">Inativo</option>
        </FilterSelect>
      </Controls>

      {loading ? (
        <LoadingState>Carregando produtos...</LoadingState>
      ) : filteredProducts.length === 0 ? (
        <EmptyState>
          <Package />
          <h3>Nenhum produto encontrado</h3>
          <p>Adicione produtos ou ajuste os filtros</p>
        </EmptyState>
      ) : (
        <ProductsGrid>
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductImage 
                  imageUrl={product.images?.[0] ? `/uploads/products/${product.images[0]}` : undefined}
                >
                  {!product.images?.[0] && <Package />}
                </ProductImage>

                <ProductContent>
                  <ProductTitle>{product.name}</ProductTitle>
                  
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    margin: '0 0 15px 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {product.description}
                  </p>

                  <ProductMeta>
                    <MetaItem>
                      <DollarSign size={16} />
                      <PriceDisplay>
                        <span className="current-price">R$ {product.price.toFixed(2)}</span>
                        {product.old_price && (
                          <span className="old-price">R$ {product.old_price.toFixed(2)}</span>
                        )}
                      </PriceDisplay>
                    </MetaItem>

                    <MetaItem>
                      <MapPin size={16} />
                      {product.category}
                    </MetaItem>

                    <MetaItem>
                      <Package size={16} />
                      <StockIndicator stock={product.stock_quantity}>
                        {product.stock_quantity} em estoque
                      </StockIndicator>
                    </MetaItem>
                  </ProductMeta>

                  <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' }}>
                    <StatusBadge status={product.status}>
                      {product.status === 'active' ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                    {product.is_featured && (
                      <FeaturedBadge>
                        <Star size={12} fill="currentColor" />
                        Destaque
                      </FeaturedBadge>
                    )}
                  </div>

                  <ProductActions>
                    <Button onClick={() => openModal(product)}>
                      <Edit size={16} />
                      Editar
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(product.id)}>
                      <Trash2 size={16} />
                      Excluir
                    </Button>
                  </ProductActions>
                </ProductContent>
              </ProductCard>
            ))}
          </AnimatePresence>
        </ProductsGrid>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && closeModal()}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <h2>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</h2>
                <Button onClick={closeModal}>
                  <X size={20} />
                </Button>
              </ModalHeader>

              <form onSubmit={handleSubmit}>
                <FormGrid>
                  <FormGroup>
                    <Label>Nome do Produto *</Label>
                    <Input
                      type="text"
                      placeholder="Nome do produto"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Categoria *</Label>
                    <Select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      <option value="instrumentos">Instrumentos</option>
                      <option value="roupas">Roupas</option>
                      <option value="acessorios">Acessórios</option>
                      <option value="musica">Música</option>
                      <option value="livros">Livros e CDs</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <Label>Preço *</Label>
                    <Input
                      type="text"
                      placeholder="R$ 0,00"
                      value={formData.price ? `R$ ${formData.price.toFixed(2).replace('.', ',')}` : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const numericValue = parseFloat(value) / 100;
                        setFormData({ ...formData, price: numericValue || 0 });
                      }}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Preço Antigo</Label>
                    <Input
                      type="text"
                      placeholder="R$ 0,00"
                      value={formData.old_price ? `R$ ${formData.old_price.toFixed(2).replace('.', ',')}` : ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        const numericValue = parseFloat(value) / 100;
                        setFormData({ ...formData, old_price: numericValue || undefined });
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Quantidade em Estoque *</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock_quantity || ''}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Peso (kg)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.weight || ''}
                      onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || undefined })}
                    />
                  </FormGroup>

                  <FormGroup fullWidth>
                    <Label>Descrição *</Label>
                    <TextArea
                      placeholder="Descrição do produto"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                    />
                  </FormGroup>

                  <FormGroup fullWidth>
                    <Label>Imagens do Produto</Label>
                    <ImageUpload onClick={() => document.getElementById('imageInput')?.click()}>
                      <input
                        id="imageInput"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Upload size={24} style={{ marginBottom: '10px' }} />
                      <p>Clique para adicionar imagens (máx. 10)</p>
                    </ImageUpload>
                  </FormGroup>

                  <FormGroup>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    >
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                    </Select>
                  </FormGroup>

                  <FormGroup>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '30px' }}>
                      <input
                        type="checkbox"
                        id="featured"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      />
                      <Label htmlFor="featured">Produto em destaque</Label>
                    </div>
                  </FormGroup>
                </FormGrid>

                <div style={{ display: 'flex', gap: '15px', marginTop: '30px', justifyContent: 'flex-end' }}>
                  <Button type="button" onClick={closeModal}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="primary">
                    <Save size={20} />
                    {editingProduct ? 'Atualizar' : 'Criar'} Produto
                  </Button>
                </div>
              </form>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProductsManager;