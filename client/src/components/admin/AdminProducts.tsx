import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { adminService } from '../../services/admin';

// Interfaces
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  is_active: boolean;
  image?: File | null;
}

interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  out_of_stock: number;
  low_stock: number;
  total_value: number;
  categories: Array<{ category: string; count: number }>;
}

// Styled Components
const Container = styled.div`
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const ControlsBar = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 300px;
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  min-width: 150px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const AddButton = styled.button`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }
`;

const StatsCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)<{ color: string }>`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border-left: 4px solid ${props => props.color};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6c757d;
  font-size: 0.875rem;
  font-weight: 500;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImage = styled.div<{ imageUrl?: string }>`
  width: 100%;
  height: 200px;
  background: ${props => props.imageUrl 
    ? `url(${props.imageUrl}) center/cover` 
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 3rem;
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.5rem 0;
`;

const ProductDescription = styled.p`
  color: #6c757d;
  font-size: 0.875rem;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProductPrice = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #28a745;
`;

const ProductStock = styled.div<{ isLow?: boolean; isOut?: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => {
    if (props.isOut) return '#dc3545';
    if (props.isLow) return '#ffc107';
    return '#28a745';
  }};
`;

const ProductCategory = styled.span`
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatusBadge = styled.span<{ active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${props => props.active ? '#d4edda' : '#f8d7da'};
  color: ${props => props.active ? '#155724' : '#721c24'};
`;

const ProductActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'danger' | 'warning' }>`
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'danger':
        return `
          background: #dc3545;
          color: white;
          &:hover { background: #c82333; }
        `;
      case 'warning':
        return `
          background: #ffc107;
          color: #212529;
          &:hover { background: #e0a800; }
        `;
      default:
        return `
          background: #007bff;
          color: white;
          &:hover { background: #0056b3; }
        `;
    }
  }}
`;

// Modal Components
const ModalOverlay = styled(motion.div)`
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

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem;
  border-radius: 4px;
  
  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#e9ecef'};
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
  }
`;

const FormTextarea = styled.textarea<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#e9ecef'};
  border-radius: 0.5rem;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
    box-shadow: 0 0 0 3px ${props => props.hasError ? 'rgba(220, 53, 69, 0.1)' : 'rgba(0, 123, 255, 0.1)'};
  }
`;

const FormSelect = styled.select<{ hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.hasError ? '#dc3545' : '#e9ecef'};
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#dc3545' : '#007bff'};
  }
`;

const FileInput = styled.input`
  padding: 0.75rem;
  border: 2px dashed #e9ecef;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background: #f8f9ff;
  }
`;

const FormError = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e5e5;
`;

const SubmitButton = styled.button<{ loading?: boolean }>`
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: ${props => props.loading ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.loading ? 0.7 : 1};
  transition: all 0.2s ease;

  &:hover {
    transform: ${props => props.loading ? 'none' : 'translateY(-2px)'};
    box-shadow: ${props => props.loading ? 'none' : '0 4px 12px rgba(40, 167, 69, 0.3)'};
  }
`;

const CancelButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #545b62;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  color: #6c757d;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
`;

// Toast notification hook (simplified)
const useToast = () => {
  return {
    showToast: (type: 'success' | 'error' | 'info', message: string) => {
      // Simple alert for now - can be replaced with proper toast library
      if (type === 'error') {
        alert(`Erro: ${message}`);
      } else {
        alert(message);
      }
    }
  };
};

const AdminProducts: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  
  // Form data
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: 'uniforme',
    stock: 0,
    is_active: true,
    image: null
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Hooks
  const { showToast } = useToast();
  
  // Load data functions
  const loadProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const filters = {
        ...(search && { search }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(stockFilter && { stock_status: stockFilter })
      };
      
      const response = await adminService.getProducts(filters);
      setProducts(response.products);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      showToast('error', 'Erro ao carregar produtos');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [search, categoryFilter, statusFilter, stockFilter, showToast]);

  const loadStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const response = await adminService.getProductStats();
      setStats(response);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      showToast('error', 'Erro ao carregar estatísticas');
    } finally {
      setIsLoadingStats(false);
    }
  }, [showToast]);

  // Effects
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Form validation
  const validateForm = (data: ProductFormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    if (!data.name.trim()) errors.name = 'Nome é obrigatório';
    if (!data.description.trim()) errors.description = 'Descrição é obrigatória';
    if (data.price < 0) errors.price = 'Preço deve ser maior ou igual a zero';
    if (data.stock < 0) errors.stock = 'Estoque deve ser maior ou igual a zero';
    if (!data.category) errors.category = 'Categoria é obrigatória';
    
    return errors;
  };

  // Form handlers
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, image: file }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: 'uniforme',
      stock: 0,
      is_active: true,
      image: null
    });
    setFormErrors({});
  };

  // CRUD operations
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await adminService.createProduct(formData);
      showToast('success', 'Produto criado com sucesso!');
      setShowAddModal(false);
      resetForm();
      loadProducts();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao criar produto:', error);
      showToast('error', error.response?.data?.message || 'Erro ao criar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct) return;
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await adminService.updateProduct(editingProduct.id, formData);
      showToast('success', 'Produto atualizado com sucesso!');
      setShowEditModal(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao editar produto:', error);
      showToast('error', error.response?.data?.message || 'Erro ao editar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      is_active: product.is_active,
      image: null
    });
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Tem certeza que deseja deletar este produto?')) {
      try {
        await adminService.deleteProduct(productId);
        showToast('success', 'Produto deletado com sucesso!');
        loadProducts();
        loadStats();
      } catch (error: any) {
        console.error('Erro ao deletar produto:', error);
        showToast('error', error.response?.data?.message || 'Erro ao deletar produto');
      }
    }
  };

  const handleToggleProductStatus = async (productId: number, currentStatus: boolean) => {
    try {
      await adminService.updateProduct(productId, { is_active: !currentStatus });
      showToast('success', `Produto ${!currentStatus ? 'ativado' : 'desativado'} com sucesso!`);
      loadProducts();
      loadStats();
    } catch (error: any) {
      console.error('Erro ao alterar status:', error);
      showToast('error', error.response?.data?.message || 'Erro ao alterar status do produto');
    }
  };

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: 'out', label: 'Sem estoque', isOut: true };
    if (stock <= 5) return { status: 'low', label: 'Estoque baixo', isLow: true };
    return { status: 'ok', label: 'Em estoque' };
  };

  const categories = [
    { value: 'uniforme', label: 'Uniformes' },
    { value: 'instrumento', label: 'Instrumentos' },
    { value: 'acessorio', label: 'Acessórios' },
    { value: 'livro', label: 'Livros' },
    { value: 'dvd', label: 'DVDs' },
    { value: 'outros', label: 'Outros' }
  ];

  return (
    <Container>
      <Header>
        <Title>Gerenciar Produtos</Title>
        <AddButton onClick={() => setShowAddModal(true)}>
          ➕ Novo Produto
        </AddButton>
      </Header>

      {/* Stats Cards */}
      <StatsCards>
        {isLoadingStats ? (
          <>
            {[...Array(4)].map((_, i) => (
              <StatCard key={i} color="#e9ecef" />
            ))}
          </>
        ) : stats ? (
          <>
            <StatCard color="#007bff">
              <StatNumber>{stats.total}</StatNumber>
              <StatLabel>Total de Produtos</StatLabel>
            </StatCard>
            <StatCard color="#28a745">
              <StatNumber>{stats.active}</StatNumber>
              <StatLabel>Produtos Ativos</StatLabel>
            </StatCard>
            <StatCard color="#ffc107">
              <StatNumber>{stats.low_stock}</StatNumber>
              <StatLabel>Estoque Baixo</StatLabel>
            </StatCard>
            <StatCard color="#17a2b8">
              <StatNumber>{formatCurrency(stats.total_value)}</StatNumber>
              <StatLabel>Valor Total</StatLabel>
            </StatCard>
          </>
        ) : null}
      </StatsCards>

      {/* Controls */}
      <ControlsBar>
        <SearchInput
          type="text"
          placeholder="Buscar produtos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <FilterSelect
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas as categorias</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
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
        
        <FilterSelect
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
        >
          <option value="">Todo estoque</option>
          <option value="in_stock">Em estoque</option>
          <option value="low_stock">Estoque baixo</option>
          <option value="out_of_stock">Sem estoque</option>
        </FilterSelect>
      </ControlsBar>

      {/* Products Grid */}
      {isLoadingProducts ? (
        <LoadingSpinner>Carregando produtos...</LoadingSpinner>
      ) : products.length === 0 ? (
        <NoResults>Nenhum produto encontrado</NoResults>
      ) : (
        <ProductGrid>
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            
            return (
              <ProductCard
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductImage imageUrl={product.image_url}>
                  {!product.image_url && '📦'}
                </ProductImage>
                
                <ProductInfo>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <ProductName>{product.name}</ProductName>
                    <StatusBadge active={product.is_active}>
                      {product.is_active ? 'Ativo' : 'Inativo'}
                    </StatusBadge>
                  </div>
                  
                  <ProductCategory>{categories.find(cat => cat.value === product.category)?.label}</ProductCategory>
                  
                  <ProductDescription>{product.description}</ProductDescription>
                  
                  <ProductMeta>
                    <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
                    <ProductStock 
                      isLow={stockStatus.isLow} 
                      isOut={stockStatus.isOut}
                    >
                      {product.stock} unid.
                    </ProductStock>
                  </ProductMeta>
                  
                  <div style={{ fontSize: '0.75rem', color: '#6c757d', marginBottom: '1rem' }}>
                    Status: {stockStatus.label}
                  </div>
                  
                  <ProductActions>
                    <ActionButton onClick={() => openEditModal(product)}>
                      ✏️ Editar
                    </ActionButton>
                    <ActionButton
                      variant="warning"
                      onClick={() => handleToggleProductStatus(product.id, product.is_active)}
                    >
                      {product.is_active ? '⏸️ Pausar' : '▶️ Ativar'}
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      🗑️ Excluir
                    </ActionButton>
                  </ProductActions>
                </ProductInfo>
              </ProductCard>
            );
          })}
        </ProductGrid>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowAddModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Novo Produto</ModalTitle>
              <CloseButton onClick={() => setShowAddModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <Form onSubmit={handleCreateProduct}>
                <FormGroup>
                  <FormLabel>Nome do Produto *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    hasError={!!formErrors.name}
                    placeholder="Nome do produto"
                  />
                  {formErrors.name && <FormError>{formErrors.name}</FormError>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Descrição *</FormLabel>
                  <FormTextarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    hasError={!!formErrors.description}
                    placeholder="Descreva o produto..."
                  />
                  {formErrors.description && <FormError>{formErrors.description}</FormError>}
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <FormLabel>Preço *</FormLabel>
                    <FormInput
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      hasError={!!formErrors.price}
                      placeholder="0.00"
                    />
                    {formErrors.price && <FormError>{formErrors.price}</FormError>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Estoque *</FormLabel>
                    <FormInput
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      hasError={!!formErrors.stock}
                      placeholder="0"
                    />
                    {formErrors.stock && <FormError>{formErrors.stock}</FormError>}
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <FormLabel>Categoria *</FormLabel>
                  <FormSelect
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    hasError={!!formErrors.category}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </FormSelect>
                  {formErrors.category && <FormError>{formErrors.category}</FormError>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Imagem do Produto</FormLabel>
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </FormGroup>

                <FormGroup>
                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    />
                    <FormLabel style={{ margin: 0 }}>Produto ativo</FormLabel>
                  </CheckboxContainer>
                </FormGroup>
              </Form>
            </ModalBody>
            
            <ModalFooter>
              <CancelButton type="button" onClick={() => setShowAddModal(false)}>
                Cancelar
              </CancelButton>
              <SubmitButton 
                type="submit" 
                onClick={handleCreateProduct}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Criando...' : 'Criar Produto'}
              </SubmitButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEditModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader>
              <ModalTitle>Editar Produto</ModalTitle>
              <CloseButton onClick={() => setShowEditModal(false)}>×</CloseButton>
            </ModalHeader>
            
            <ModalBody>
              <Form onSubmit={handleEditProduct}>
                <FormGroup>
                  <FormLabel>Nome do Produto *</FormLabel>
                  <FormInput
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    hasError={!!formErrors.name}
                    placeholder="Nome do produto"
                  />
                  {formErrors.name && <FormError>{formErrors.name}</FormError>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Descrição *</FormLabel>
                  <FormTextarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    hasError={!!formErrors.description}
                    placeholder="Descreva o produto..."
                  />
                  {formErrors.description && <FormError>{formErrors.description}</FormError>}
                </FormGroup>

                <FormRow>
                  <FormGroup>
                    <FormLabel>Preço *</FormLabel>
                    <FormInput
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                      hasError={!!formErrors.price}
                      placeholder="0.00"
                    />
                    {formErrors.price && <FormError>{formErrors.price}</FormError>}
                  </FormGroup>

                  <FormGroup>
                    <FormLabel>Estoque *</FormLabel>
                    <FormInput
                      type="number"
                      min="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                      hasError={!!formErrors.stock}
                      placeholder="0"
                    />
                    {formErrors.stock && <FormError>{formErrors.stock}</FormError>}
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <FormLabel>Categoria *</FormLabel>
                  <FormSelect
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    hasError={!!formErrors.category}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </FormSelect>
                  {formErrors.category && <FormError>{formErrors.category}</FormError>}
                </FormGroup>

                <FormGroup>
                  <FormLabel>Imagem do Produto</FormLabel>
                  <FileInput
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {editingProduct.image_url && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <img 
                        src={editingProduct.image_url} 
                        alt="Imagem atual"
                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem' }}
                      />
                    </div>
                  )}
                </FormGroup>

                <FormGroup>
                  <CheckboxContainer>
                    <Checkbox
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    />
                    <FormLabel style={{ margin: 0 }}>Produto ativo</FormLabel>
                  </CheckboxContainer>
                </FormGroup>
              </Form>
            </ModalBody>
            
            <ModalFooter>
              <CancelButton type="button" onClick={() => setShowEditModal(false)}>
                Cancelar
              </CancelButton>
              <SubmitButton 
                type="submit" 
                onClick={handleEditProduct}
                loading={isSubmitting}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Atualizando...' : 'Atualizar Produto'}
              </SubmitButton>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default AdminProducts;