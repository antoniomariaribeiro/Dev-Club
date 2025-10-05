import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Tag, 
  X, ChevronDown, SlidersHorizontal 
} from 'lucide-react';

const FilterContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  color: white;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const FilterTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: background 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FilterLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
`;

const SearchInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px 10px 40px;
  color: white;
  font-size: 0.9rem;
  width: 100%;
  position: relative;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.6);
  }
`;

const Select = styled.select`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  font-size: 0.9rem;
  width: 100%;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #2d3748;
    color: white;
  }
`;

const DateInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: white;
  font-size: 0.9rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
  }
`;

const FilterTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
`;

const FilterTag = styled(motion.span)`
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid rgba(59, 130, 246, 0.3);
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

const ApplyButton = styled.button`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

interface FilterItem {
  id: string;
  label: string;
  value: any;
  type: 'text' | 'select' | 'date' | 'daterange';
}

interface FilterOptions {
  search?: string;
  category?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  userRole?: string;
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  showUserFilters?: boolean;
  showEventFilters?: boolean;
  showDateFilters?: boolean;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFiltersChange,
  showUserFilters = true,
  showEventFilters = true,
  showDateFilters = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    userRole: ''
  });
  
  const [activeFilters, setActiveFilters] = useState<FilterItem[]>([]);

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Atualizar filtros ativos
    updateActiveFilters(newFilters);
  };

  const updateActiveFilters = (currentFilters: FilterOptions) => {
    const active: FilterItem[] = [];
    
    if (currentFilters.search) {
      active.push({ id: 'search', label: `Busca: "${currentFilters.search}"`, value: currentFilters.search, type: 'text' });
    }
    
    if (currentFilters.category) {
      active.push({ id: 'category', label: `Categoria: ${currentFilters.category}`, value: currentFilters.category, type: 'select' });
    }
    
    if (currentFilters.status) {
      active.push({ id: 'status', label: `Status: ${currentFilters.status}`, value: currentFilters.status, type: 'select' });
    }
    
    if (currentFilters.userRole) {
      active.push({ id: 'userRole', label: `Tipo: ${currentFilters.userRole}`, value: currentFilters.userRole, type: 'select' });
    }
    
    if (currentFilters.dateFrom) {
      active.push({ id: 'dateFrom', label: `A partir de: ${currentFilters.dateFrom}`, value: currentFilters.dateFrom, type: 'date' });
    }
    
    if (currentFilters.dateTo) {
      active.push({ id: 'dateTo', label: `Até: ${currentFilters.dateTo}`, value: currentFilters.dateTo, type: 'date' });
    }
    
    setActiveFilters(active);
  };

  const removeFilter = (filterId: string) => {
    const newFilters = { ...filters };
    
    switch (filterId) {
      case 'search':
        newFilters.search = '';
        break;
      case 'category':
        newFilters.category = '';
        break;
      case 'status':
        newFilters.status = '';
        break;
      case 'userRole':
        newFilters.userRole = '';
        break;
      case 'dateFrom':
        newFilters.dateFrom = '';
        break;
      case 'dateTo':
        newFilters.dateTo = '';
        break;
    }
    
    setFilters(newFilters);
    updateActiveFilters(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters: FilterOptions = {
      search: '',
      category: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      userRole: ''
    };
    setFilters(emptyFilters);
    setActiveFilters([]);
    onFiltersChange(emptyFilters);
  };

  const applyFilters = () => {
    onFiltersChange(filters);
  };

  return (
    <FilterContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <FilterHeader>
        <FilterTitle>
          <SlidersHorizontal size={18} />
          Filtros Avançados
        </FilterTitle>
        <ToggleButton onClick={() => setIsExpanded(!isExpanded)}>
          <Filter size={16} />
          {isExpanded ? 'Ocultar' : 'Mostrar'}
          <ChevronDown 
            size={16} 
            style={{ 
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }} 
          />
        </ToggleButton>
      </FilterHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterGrid>
              {/* Busca textual */}
              <FilterGroup>
                <FilterLabel>Buscar</FilterLabel>
                <SearchWrapper>
                  <Search size={16} />
                  <SearchInput
                    type="text"
                    placeholder="Pesquisar por nome, email..."
                    value={filters.search || ''}
                    onChange={(e) => updateFilter('search', e.target.value)}
                  />
                </SearchWrapper>
              </FilterGroup>

              {/* Filtros de evento */}
              {showEventFilters && (
                <>
                  <FilterGroup>
                    <FilterLabel>Categoria</FilterLabel>
                    <Select
                      value={filters.category || ''}
                      onChange={(e) => updateFilter('category', e.target.value)}
                    >
                      <option value="">Todas as categorias</option>
                      <option value="roda">Roda de Capoeira</option>
                      <option value="aula">Aula</option>
                      <option value="workshop">Workshop</option>
                      <option value="batizado">Batizado</option>
                      <option value="encontro">Encontro</option>
                    </Select>
                  </FilterGroup>

                  <FilterGroup>
                    <FilterLabel>Status</FilterLabel>
                    <Select
                      value={filters.status || ''}
                      onChange={(e) => updateFilter('status', e.target.value)}
                    >
                      <option value="">Todos os status</option>
                      <option value="active">Ativo</option>
                      <option value="inactive">Inativo</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </Select>
                  </FilterGroup>
                </>
              )}

              {/* Filtros de usuário */}
              {showUserFilters && (
                <FilterGroup>
                  <FilterLabel>Tipo de Usuário</FilterLabel>
                  <Select
                    value={filters.userRole || ''}
                    onChange={(e) => updateFilter('userRole', e.target.value)}
                  >
                    <option value="">Todos os tipos</option>
                    <option value="student">Aluno</option>
                    <option value="instructor">Instrutor</option>
                    <option value="admin">Administrador</option>
                  </Select>
                </FilterGroup>
              )}

              {/* Filtros de data */}
              {showDateFilters && (
                <>
                  <FilterGroup>
                    <FilterLabel>Data Inicial</FilterLabel>
                    <DateInput
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => updateFilter('dateFrom', e.target.value)}
                    />
                  </FilterGroup>

                  <FilterGroup>
                    <FilterLabel>Data Final</FilterLabel>
                    <DateInput
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => updateFilter('dateTo', e.target.value)}
                    />
                  </FilterGroup>
                </>
              )}
            </FilterGrid>

            <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
              <ApplyButton onClick={applyFilters}>
                Aplicar Filtros
              </ApplyButton>
              
              {activeFilters.length > 0 && (
                <button
                  onClick={clearAllFilters}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    padding: '10px 15px',
                    cursor: 'pointer'
                  }}
                >
                  Limpar Tudo
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tags de filtros ativos */}
      {activeFilters.length > 0 && (
        <FilterTags>
          <AnimatePresence>
            {activeFilters.map((filter) => (
              <FilterTag
                key={filter.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Tag size={12} />
                {filter.label}
                <ClearButton onClick={() => removeFilter(filter.id)}>
                  <X size={12} />
                </ClearButton>
              </FilterTag>
            ))}
          </AnimatePresence>
        </FilterTags>
      )}
    </FilterContainer>
  );
};

export default AdvancedFilters;