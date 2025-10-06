import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { theme, Container, Button, Input } from '../styles/theme';
import api from '../services/api';

interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  old_price?: number;
  category: string;
  brand?: string;
  sku?: string;
  stock_quantity: number;
  weight?: number;
  images?: string[];
  status: 'active' | 'inactive';
  is_featured: boolean;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

const ShopContainer = styled.div`
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${theme.spacing.md};

  .filters {
    display: flex;
    gap: ${theme.spacing.md};
    flex-wrap: wrap;
  }

  .search-box {
    display: flex;
    align-items: center;
    position: relative;
    
    input {
      padding-left: 40px;
      min-width: 250px;
    }

    svg {
      position: absolute;
      left: 12px;
      color: ${theme.colors.text.secondary};
    }
  }
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

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.xl};
  padding: ${theme.spacing.xl} 0;
`;

const ProductCard = styled(motion.div)`
  background: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .product-image {
    width: 100%;
    height: 250px;
    object-fit: cover;
  }

  .product-badge {
    position: absolute;
    top: ${theme.spacing.md};
    right: ${theme.spacing.md};
    background: ${theme.colors.secondary};
    color: white;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius.sm};
    font-size: 0.75rem;
    font-weight: 600;
  }

  .product-content {
    padding: ${theme.spacing.lg};
  }

  .product-category {
    color: ${theme.colors.text.secondary};
    font-size: 0.875rem;
    text-transform: uppercase;
    margin-bottom: ${theme.spacing.sm};
  }

  .product-title {
    color: ${theme.colors.text.primary};
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: ${theme.spacing.sm};
  }

  .product-description {
    color: ${theme.colors.text.secondary};
    margin-bottom: ${theme.spacing.md};
    line-height: 1.6;
  }

  .product-rating {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.md};
    
    .stars {
      display: flex;
      gap: 2px;
    }
    
    .rating-text {
      color: ${theme.colors.text.secondary};
      font-size: 0.875rem;
    }
  }

  .product-price {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.lg};

    .current-price {
      font-size: 1.5rem;
      font-weight: 700;
      color: ${theme.colors.primary};
    }

    .old-price {
      font-size: 1rem;
      color: ${theme.colors.text.secondary};
      text-decoration: line-through;
    }
  }

  .add-to-cart {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${theme.spacing.sm};
  }
`;

const Shop: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { key: 'todos', label: 'Todos os Produtos' },
    { key: 'instrumentos', label: 'Instrumentos' },
    { key: 'roupas', label: 'Roupas' },
    { key: 'acessorios', label: 'Acessórios' },
    { key: 'musica', label: 'Música' },
    { key: 'livros', label: 'Livros & CDs' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products', {
        params: {
          limit: 50,
          status: 'active'
        }
      });
      setProducts(response.data.products || response.data);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast.error('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeFilter === 'todos' || product.category === activeFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.short_description && product.short_description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });



  return (
    <ShopContainer>
      <HeroSection>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Loja Academia Capoeira Nacional</h1>
            <p>
              Produtos oficiais e equipamentos de capoeira. 
              Tudo o que você precisa para sua jornada na arte da capoeira.
            </p>
          </motion.div>
        </Container>
      </HeroSection>

      <Container>
        <FilterSection>
          <div className="filters">
            {categories.map(category => (
              <FilterButton
                key={category.key}
                $active={activeFilter === category.key}
                onClick={() => setActiveFilter(category.key)}
              >
                {category.label}
              </FilterButton>
            ))}
          </div>

          <div className="search-box">
            <Search size={20} />
            <Input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </FilterSection>

        <ProductsGrid>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1' }}>
              <div>Carregando produtos...</div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1' }}>
              <h3>Nenhum produto encontrado</h3>
              <p>Tente ajustar os filtros ou termo de busca.</p>
            </div>
          ) : (
            filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div style={{ position: 'relative' }}>
                  {product.is_featured && (
                    <div className="product-badge">Destaque</div>
                  )}
                  <img 
                    src={product.images?.[0] ? `/uploads/products/${product.images[0]}` : '/default-product.png'}
                    alt={product.name} 
                    className="product-image" 
                  />
                </div>
                
                <div className="product-content">
                  <div className="product-category">
                    {categories.find(c => c.key === product.category)?.label || product.category}
                  </div>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">
                    {product.short_description || product.description}
                  </p>
                  
                  {product.tags && product.tags.length > 0 && (
                    <div className="product-tags" style={{ marginBottom: '12px' }}>
                      {product.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} style={{ 
                          fontSize: '11px', 
                          background: theme.colors.primary + '20', 
                          color: theme.colors.primary,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginRight: '4px'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="product-price">
                    <div>
                      <span className="current-price">R$ {product.price.toFixed(2)}</span>
                      {product.old_price && (
                        <span className="old-price" style={{ marginLeft: '8px' }}>
                          R$ {product.old_price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: theme.colors.text.secondary, marginBottom: '12px' }}>
                    Estoque: {product.stock_quantity} unidades
                    {product.brand && ` • Marca: ${product.brand}`}
                  </div>

                  <Button 
                    className="add-to-cart"
                    variant={product.stock_quantity > 0 ? 'primary' : 'outline'}
                    disabled={product.stock_quantity === 0}
                  >
                    <ShoppingCart size={18} />
                    {product.stock_quantity > 0 ? 'Adicionar ao Carrinho' : 'Sem Estoque'}
                  </Button>
                </div>
              </ProductCard>
            ))
          )}
        </ProductsGrid>
      </Container>
    </ShopContainer>
  );
};

export default Shop;