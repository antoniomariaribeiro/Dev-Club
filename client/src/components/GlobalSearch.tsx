import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../utils/icons';
import { adminService } from '../services/admin';

// Interfaces
interface SearchResult {
  id: number;
  type: 'user' | 'event' | 'product' | 'gallery' | 'contact';
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  metadata?: string;
  url?: string;
}

interface GlobalSearchProps {
  onNavigate?: (section: string, id?: number) => void;
}

// Styled Components
const SearchContainer = styled(motion.div)`
  position: relative;
  max-width: 500px;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 3rem 1rem 2.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 4px 20px rgba(79, 70, 229, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    color: #374151;
    background: #f3f4f6;
  }
`;

const ResultsDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #e5e7eb;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  backdrop-filter: blur(10px);
`;

const ResultSection = styled.div`
  padding: 0.5rem 0;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f3f4f6;
  }
`;

const SectionHeader = styled.div`
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ResultItem = styled(motion.div)`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #f8fafc;
  }

  &:active {
    background: #e2e8f0;
  }
`;

const ResultIcon = styled.div<{ $type: string }>`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
  font-size: 1.1rem;
  background: ${props => 
    props.$type === 'user' ? '#3b82f6' :
    props.$type === 'event' ? '#10b981' :
    props.$type === 'product' ? '#f59e0b' :
    props.$type === 'gallery' ? '#8b5cf6' :
    '#ef4444'};
`;

const ResultContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const ResultTitle = styled.div`
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  line-height: 1.3;
`;

const ResultSubtitle = styled.div`
  color: #6b7280;
  font-size: 0.8rem;
  margin-bottom: 0.125rem;
`;

const ResultDescription = styled.div`
  color: #9ca3af;
  font-size: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ResultMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #9ca3af;
  font-size: 0.7rem;
  margin-top: 0.25rem;
`;

const NavigateIcon = styled.div`
  color: #9ca3af;
  transition: all 0.2s ease;
  
  ${ResultItem}:hover & {
    color: #6b7280;
    transform: translateX(2px);
  }
`;

const LoadingSpinner = styled.div`
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6b7280;
`;

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
`;

const RecentSearches = styled.div`
  padding: 1rem;
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #6b7280;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
    color: #374151;
  }
`;

const Shortcuts = styled.div`
  padding: 0.5rem 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.75rem;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Shortcut = styled.span`
  background: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
`;

// Component
const GlobalSearch: React.FC<GlobalSearchProps> = ({ onNavigate }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Carregar buscas recentes do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('admin-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Salvar buscas recentes
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)]
      .slice(0, 5); // Manter apenas 5 buscas recentes
    
    setRecentSearches(updated);
    localStorage.setItem('admin-recent-searches', JSON.stringify(updated));
  };

  // Buscar resultados
  const searchData = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Buscar em paralelo em todas as entidades
      const [users, events, products, gallery, contacts] = await Promise.allSettled([
        adminService.getUsers({ search: searchQuery, limit: 3 }),
        adminService.getEvents({ search: searchQuery, limit: 3 }),
        adminService.getProducts({ search: searchQuery, limit: 3 }),
        adminService.getGalleryItems({ search: searchQuery, limit: 3 }),
        adminService.getContacts({ search: searchQuery, limit: 3 })
      ]);

      const searchResults: SearchResult[] = [];

      // Processar usuários
      if (users.status === 'fulfilled' && users.value.users) {
        users.value.users.forEach((user: any) => {
          searchResults.push({
            id: user.id,
            type: 'user',
            title: user.name,
            subtitle: user.email,
            description: `${user.role} - Graduação: ${user.belt || 'N/A'}`,
            metadata: `Ativo desde ${new Date(user.created_at).toLocaleDateString('pt-BR')}`
          });
        });
      }

      // Processar eventos
      if (events.status === 'fulfilled' && events.value.events) {
        events.value.events.forEach((event: any) => {
          searchResults.push({
            id: event.id,
            type: 'event',
            title: event.title,
            subtitle: `${event.category} - ${event.location}`,
            description: event.description,
            metadata: `${new Date(event.date).toLocaleDateString('pt-BR')} - ${event.max_participants} vagas`
          });
        });
      }

      // Processar produtos
      if (products.status === 'fulfilled' && products.value.products) {
        products.value.products.forEach((product: any) => {
          searchResults.push({
            id: product.id,
            type: 'product',
            title: product.name,
            subtitle: `R$ ${product.price} - ${product.category}`,
            description: product.short_description,
            metadata: `Estoque: ${product.stock_quantity} unidades`
          });
        });
      }

      // Processar galeria
      if (gallery.status === 'fulfilled' && gallery.value.images) {
        gallery.value.images.forEach((image: any) => {
          searchResults.push({
            id: image.id,
            type: 'gallery',
            title: image.title,
            subtitle: image.category,
            description: image.description,
            image: image.thumbnail_url || image.image_url,
            metadata: `${image.views} visualizações - ${image.likes} curtidas`
          });
        });
      }

      // Processar contatos
      if (contacts.status === 'fulfilled' && contacts.value.contacts) {
        contacts.value.contacts.forEach((contact: any) => {
          searchResults.push({
            id: contact.id,
            type: 'contact',
            title: contact.name,
            subtitle: contact.email,
            description: contact.message,
            metadata: `${contact.status} - ${contact.interest_type}`
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce da busca
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() && query.length >= 2) {
        searchData(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Atalhos de teclado
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (event.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

    const getResultIcon = (type: string) => {
      switch (type) {
        case 'user': return <Icons.FiUsers />;
        case 'event': return <Icons.FiCalendar />;
        case 'product': return <Icons.FiShoppingBag />;
        case 'gallery': return <Icons.FiImage />;
        case 'contact': return <Icons.FiMessageSquare />;
        default: return <Icons.FiSearch />;
      }
    };  const getSectionName = (type: string) => {
    switch (type) {
      case 'user': return 'Usuários';
      case 'event': return 'Eventos';
      case 'product': return 'Produtos';
      case 'gallery': return 'Galeria';
      case 'contact': return 'Contatos';
      default: return 'Resultados';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    saveRecentSearch(query);
    setIsOpen(false);
    setQuery('');
    
    if (onNavigate) {
      onNavigate(`${result.type}s`, result.id);
    }
  };

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery);
    setIsOpen(true);
  };

  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) acc[result.type] = [];
    acc[result.type].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  return (
    <SearchContainer ref={searchRef}>
      <SearchIcon>
        <Icons.FiSearch size={20} />
      </SearchIcon>
      
      <SearchInput
        ref={inputRef}
        type="text"
        placeholder="Buscar usuários, eventos, produtos... (Ctrl+K)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
      />
      
      {query && (
        <ClearButton onClick={() => {
          setQuery('');
          setResults([]);
          inputRef.current?.focus();
        }}>
          <Icons.FiX size={16} />
        </ClearButton>
      )}

      <AnimatePresence>
        {isOpen && (
          <ResultsDropdown
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {loading ? (
              <LoadingSpinner>
                <div>Buscando...</div>
              </LoadingSpinner>
            ) : query.length >= 2 && results.length > 0 ? (
              <>
                {Object.entries(groupedResults).map(([type, typeResults]) => (
                  <ResultSection key={type}>
                    <SectionHeader>
                      {getResultIcon(type)}
                      {getSectionName(type)} ({typeResults.length})
                    </SectionHeader>
                    {typeResults.map((result) => (
                      <ResultItem
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleResultClick(result)}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ResultIcon $type={result.type}>
                          {getResultIcon(result.type)}
                        </ResultIcon>
                        <ResultContent>
                          <ResultTitle>{result.title}</ResultTitle>
                          <ResultSubtitle>{result.subtitle}</ResultSubtitle>
                          {result.description && (
                            <ResultDescription>{result.description}</ResultDescription>
                          )}
                          {result.metadata && (
                            <ResultMeta>
                              <Icons.FiClock size={12} />
                              {result.metadata}
                            </ResultMeta>
                          )}
                        </ResultContent>
                        <NavigateIcon>
                          <Icons.FiArrowRight size={16} />
                        </NavigateIcon>
                      </ResultItem>
                    ))}
                  </ResultSection>
                ))}
              </>
            ) : query.length >= 2 && results.length === 0 && !loading ? (
              <EmptyState>
                Nenhum resultado encontrado para "{query}"
              </EmptyState>
            ) : !query && recentSearches.length > 0 ? (
              <RecentSearches>
                <SectionHeader>
                  <Icons.FiClock />
                  Buscas Recentes
                </SectionHeader>
                {recentSearches.map((recent, index) => (
                  <RecentItem
                    key={index}
                    onClick={() => handleRecentClick(recent)}
                  >
                    <Icons.FiSearch size={14} />
                    {recent}
                  </RecentItem>
                ))}
              </RecentSearches>
            ) : (
              <EmptyState>
                Digite pelo menos 2 caracteres para buscar
              </EmptyState>
            )}
            
            <Shortcuts>
              <span>Atalhos:</span>
              <span><Shortcut>Ctrl</Shortcut> + <Shortcut>K</Shortcut> para focar</span>
              <span><Shortcut>Esc</Shortcut> para fechar</span>
            </Shortcuts>
          </ResultsDropdown>
        )}
      </AnimatePresence>
    </SearchContainer>
  );
};

export default GlobalSearch;