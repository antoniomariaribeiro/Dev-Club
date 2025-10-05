import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Plus, Edit3, Trash2, Eye, Search,
  Tag, Layers, Star, TrendingUp,
  X, Save, PackagePlus, Minus
} from 'lucide-react';
import toast from 'react-hot-toast';

// ============ TIPOS ============
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'uniforme' | 'cordas' | 'instrumentos' | 'acessorios' | 'livros';
  stock: number;
  minStock: number;
  status: 'disponivel' | 'indisponivel' | 'pre-venda';
  image?: string;
  rating: number;
  totalSales: number;
  createdAt: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: 'uniforme' | 'cordas' | 'instrumentos' | 'acessorios' | 'livros';
  stock: number;
  minStock: number;
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

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
`;

const ProductCard = styled(motion.div)`
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

const ProductImage = styled.div<{ hasImage?: boolean }>`
  height: 200px;
  background: ${props => props.hasImage 
    ? `url(${props.hasImage}) center/cover` 
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  position: relative;
  
  .status-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .stock-alert {
    position: absolute;
    top: 15px;
    left: 15px;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.75rem;
    font-weight: 600;
    background: rgba(255, 107, 107, 0.9);
    color: white;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;

const ProductContent = styled.div`
  padding: 25px;
`;

const ProductHeader = styled.div`
  margin-bottom: 15px;
  
  h3 {
    margin: 0 0 8px 0;
    font-size: 1.3rem;
    color: #ffd700;
  }
  
  .category {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    background: rgba(255, 215, 0, 0.2);
    color: #ffd700;
    border: 1px solid rgba(255, 215, 0, 0.3);
    text-transform: capitalize;
  }
`;

const ProductDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin: 15px 0;
  font-size: 0.9rem;
  
  .detail {
    display: flex;
    align-items: center;
    gap: 8px;
    color: rgba(255, 255, 255, 0.8);
    
    svg {
      color: #ffd700;
      min-width: 16px;
    }
  }
`;

const ProductDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductActions = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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

const PriceTag = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2ecc71;
  margin: 10px 0;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 5px 0;
  
  .stars {
    color: #ffd700;
  }
  
  .rating-text {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
  }
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

// ============ DADOS MOCK ============
const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Abadá Tradicional',
    description: 'Uniforme oficial de capoeira em tecido 100% algodão, disponível em várias cores.',
    price: 89.90,
    category: 'uniforme',
    stock: 25,
    minStock: 10,
    status: 'disponivel',
    rating: 4.8,
    totalSales: 156,
    createdAt: '2024-10-15'
  },
  {
    id: 2,
    name: 'Berimbau Profissional',
    description: 'Berimbau artesanal com biriba selecionada, arame de aço e cabaça natural.',
    price: 280.00,
    category: 'instrumentos',
    stock: 3,
    minStock: 5,
    status: 'disponivel',
    rating: 4.9,
    totalSales: 43,
    createdAt: '2024-09-20'
  },
  {
    id: 3,
    name: 'Cordão Verde',
    description: 'Cordão de graduação em algodão trançado, cor verde para aluno graduado.',
    price: 35.00,
    category: 'cordas',
    stock: 0,
    minStock: 20,
    status: 'indisponivel',
    rating: 4.6,
    totalSales: 89,
    createdAt: '2024-11-01'
  },
  {
    id: 4,
    name: 'Pandeiro Luthier',
    description: 'Pandeiro profissional 10 polegadas com pele natural e platinelas de bronze.',
    price: 450.00,
    category: 'instrumentos',
    stock: 8,
    minStock: 3,
    status: 'disponivel',
    rating: 5.0,
    totalSales: 27,
    createdAt: '2024-08-10'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'disponivel': return '#2ecc71';
    case 'indisponivel': return '#e74c3c';
    case 'pre-venda': return '#f39c12';
    default: return '#2ecc71';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'disponivel': return 'Disponível';
    case 'indisponivel': return 'Indisponível';
    case 'pre-venda': return 'Pré-venda';
    default: return 'Disponível';
  }
};

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'uniforme': return '👕';
    case 'cordas': return '🎗️';
    case 'instrumentos': return '🎵';
    case 'acessorios': return '🎒';
    case 'livros': return '📚';
    default: return '📦';
  }
};

// ============ COMPONENTE PRINCIPAL ============
const ProductsManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'uniforme',
    stock: 0,
    minStock: 5
  });

  // Filtrar produtos
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  // Abrir modal para criar/editar
  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        minStock: product.minStock
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: 'uniforme',
        stock: 0,
        minStock: 5
      });
    }
    setShowModal(true);
  };

  // Salvar produto
  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(product => 
        product.id === editingProduct.id 
          ? { 
              ...product, 
              ...formData,
              status: formData.stock > 0 ? 'disponivel' : 'indisponivel'
            }
          : product
      ));
      toast.success('Produto atualizado com sucesso!');
    } else {
      const newProduct: Product = {
        id: Date.now(),
        ...formData,
        status: formData.stock > 0 ? 'disponivel' : 'indisponivel',
        rating: 0,
        totalSales: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      toast.success('Produto criado com sucesso!');
    }
    setShowModal(false);
  };

  // Excluir produto
  const handleDeleteProduct = (productId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      setProducts(products.filter(product => product.id !== productId));
      toast.success('Produto excluído com sucesso!');
    }
  };

  // Renderizar estrelas
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        size={14} 
        fill={i < Math.floor(rating) ? '#ffd700' : 'none'}
        color="#ffd700"
      />
    ));
  };

  return (
    <Container>
      <Header>
        <h1>
          <Package size={32} />
          Gerenciar Produtos
        </h1>
        
        <Controls>
          <SearchBar>
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBar>
          
          <Button
            variant="primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} />
            Novo Produto
          </Button>
        </Controls>
      </Header>

      <ProductsGrid>
        <AnimatePresence>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ProductImage>
                {product.stock <= product.minStock && product.stock > 0 && (
                  <div className="stock-alert">Estoque Baixo!</div>
                )}
                <div style={{ fontSize: '4rem' }}>
                  {getCategoryIcon(product.category)}
                </div>
                <div 
                  className="status-badge"
                  style={{ 
                    background: getStatusColor(product.status) + '20',
                    color: getStatusColor(product.status),
                    border: `1px solid ${getStatusColor(product.status)}40`
                  }}
                >
                  {getStatusText(product.status)}
                </div>
              </ProductImage>
              
              <ProductContent>
                <ProductHeader>
                  <h3>{product.name}</h3>
                  <div className="category">{product.category}</div>
                </ProductHeader>
                
                <PriceTag>R$ {product.price.toFixed(2)}</PriceTag>
                
                <Rating>
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">
                    {product.rating.toFixed(1)} ({product.totalSales} vendas)
                  </span>
                </Rating>
                
                <ProductDescription>{product.description}</ProductDescription>
                
                <ProductDetails>
                  <div className="detail">
                    <Layers size={16} />
                    Estoque: {product.stock}
                  </div>
                  <div className="detail">
                    <Minus size={16} />
                    Min: {product.minStock}
                  </div>
                  <div className="detail">
                    <Tag size={16} />
                    {product.category}
                  </div>
                  <div className="detail">
                    <TrendingUp size={16} />
                    {product.totalSales} vendas
                  </div>
                </ProductDetails>
                
                <ProductActions>
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
                    onClick={() => handleOpenModal(product)}
                  >
                    <Edit3 size={16} />
                  </ActionButton>
                  
                  <ActionButton
                    variant="delete"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ProductActions>
              </ProductContent>
            </ProductCard>
          ))}
        </AnimatePresence>
      </ProductsGrid>

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
                  <PackagePlus size={24} style={{ marginRight: '10px' }} />
                  {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                </h2>
                <Button onClick={() => setShowModal(false)}>
                  <X size={20} />
                </Button>
              </div>

              <FormGrid>
                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Nome do Produto</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nome do produto"
                  />
                </FormGroup>

                <FormGroup style={{ gridColumn: '1 / -1' }}>
                  <label>Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva o produto..."
                  />
                </FormGroup>

                <FormGroup>
                  <label>Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Categoria</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="uniforme">Uniforme</option>
                    <option value="cordas">Cordas</option>
                    <option value="instrumentos">Instrumentos</option>
                    <option value="acessorios">Acessórios</option>
                    <option value="livros">Livros</option>
                  </select>
                </FormGroup>

                <FormGroup>
                  <label>Estoque Atual</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </FormGroup>

                <FormGroup>
                  <label>Estoque Mínimo</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({...formData, minStock: parseInt(e.target.value) || 0})}
                    min="0"
                  />
                </FormGroup>
              </FormGrid>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '30px' }}>
                <Button onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" onClick={handleSaveProduct}>
                  <Save size={20} />
                  {editingProduct ? 'Atualizar' : 'Criar'} Produto
                </Button>
              </div>
            </Modal>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default ProductsManagement;