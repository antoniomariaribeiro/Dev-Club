import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Search } from 'lucide-react';
import { theme, Container, Button, Input } from '../styles/theme';

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
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { key: 'todos', label: 'Todos os Produtos' },
    { key: 'uniformes', label: 'Uniformes' },
    { key: 'instrumentos', label: 'Instrumentos' },
    { key: 'acessorios', label: 'Acessórios' },
    { key: 'livros', label: 'Livros & CDs' },
  ];

  const mockProducts = [
    {
      id: 1,
      name: 'Abadá Tradicional Branco',
      description: 'Uniforme tradicional de capoeira em algodão 100%. Resistente e confortável para treinos.',
      image: 'https://images.unsplash.com/photo-1574755393849-623942496936?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'uniformes',
      currentPrice: 89.90,
      oldPrice: 120.00,
      rating: 4.8,
      reviews: 45,
      inStock: true,
      featured: true,
    },
    {
      id: 2,
      name: 'Berimbau Completo',
      description: 'Berimbau tradicional com verga, cabaça, arame e acessórios. Ideal para rodas e treinos.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'instrumentos',
      currentPrice: 299.90,
      oldPrice: null,
      rating: 4.9,
      reviews: 28,
      inStock: true,
      featured: false,
    },
    {
      id: 3,
      name: 'Cordão Graduação Verde',
      description: 'Cordão oficial para graduação. Material resistente e cores vibrantes.',
      image: 'https://images.unsplash.com/photo-1571019613519-1b42c8e94393?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'acessorios',
      currentPrice: 25.90,
      oldPrice: 35.00,
      rating: 4.6,
      reviews: 67,
      inStock: true,
      featured: false,
    },
    {
      id: 4,
      name: 'Atabaque Médio',
      description: 'Atabaque artesanal em madeira e couro natural. Som potente para rodas.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'instrumentos',
      currentPrice: 459.90,
      oldPrice: null,
      rating: 4.7,
      reviews: 19,
      inStock: false,
      featured: true,
    },
    {
      id: 5,
      name: 'Camiseta Academia Nacional',
      description: 'Camiseta oficial da Academia Capoeira Nacional. 100% algodão.',
      image: 'https://images.unsplash.com/photo-1574755393849-623942496936?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'uniformes',
      currentPrice: 39.90,
      oldPrice: 49.90,
      rating: 4.4,
      reviews: 89,
      inStock: true,
      featured: false,
    },
    {
      id: 6,
      name: 'Pandeiro Profissional',
      description: 'Pandeiro com pele natural e platinelas de qualidade. Som cristalino.',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'instrumentos',
      currentPrice: 189.90,
      oldPrice: 220.00,
      rating: 4.8,
      reviews: 34,
      inStock: true,
      featured: false,
    },
  ];

  const filteredProducts = mockProducts.filter(product => {
    const matchesCategory = activeFilter === 'todos' || product.category === activeFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        fill={index < Math.floor(rating) ? theme.colors.secondary : 'none'}
        color={index < Math.floor(rating) ? theme.colors.secondary : theme.colors.text.secondary}
      />
    ));
  };

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
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div style={{ position: 'relative' }}>
                {product.featured && (
                  <div className="product-badge">Destaque</div>
                )}
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              
              <div className="product-content">
                <div className="product-category">{categories.find(c => c.key === product.category)?.label}</div>
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="rating-text">
                    {product.rating} ({product.reviews} avaliações)
                  </span>
                </div>

                <div className="product-price">
                  <div>
                    <span className="current-price">R$ {product.currentPrice.toFixed(2)}</span>
                    {product.oldPrice && (
                      <span className="old-price" style={{ marginLeft: '8px' }}>
                        R$ {product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <Button 
                  className="add-to-cart"
                  variant={product.inStock ? 'primary' : 'outline'}
                  disabled={!product.inStock}
                >
                  <ShoppingCart size={18} />
                  {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
                </Button>
              </div>
            </ProductCard>
          ))}
        </ProductsGrid>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h3>Nenhum produto encontrado</h3>
            <p>Tente ajustar os filtros ou termo de busca.</p>
          </div>
        )}
      </Container>
    </ShopContainer>
  );
};

export default Shop;