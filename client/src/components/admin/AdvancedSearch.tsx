import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, X, Clock, Star, ChevronDown, 
  Calendar, MapPin, Phone, Mail, User, Users,
  Save, RefreshCw
} from 'lucide-react';
// ============ TYPES ============
type UserStatus = 'active' | 'inactive' | 'pending' | 'suspended';

// ============ INTERFACES ============
export interface SearchFilters {
  status?: UserStatus | 'all';
  role?: string | 'all';
  dateRange?: {
    start: string;
    end: string;
  };
  age?: {
    min: number;
    max: number;
  };
  location?: string;
  hasPhone?: boolean;
  hasEmail?: boolean;
  registrationPeriod?: 'today' | 'week' | 'month' | 'year' | 'all';
}

interface SavedFilter {
  id: string;
  name: string;
  filters: SearchFilters;
  query: string;
  createdAt: Date;
  isFavorite: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'user' | 'email' | 'phone' | 'location';
  count?: number;
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClearFilters: () => void;
  suggestions?: SearchSuggestion[];
  totalResults?: number;
  isLoading?: boolean;
  className?: string;
}

// ============ STYLED COMPONENTS ============


const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
`;

const SearchContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 24px;
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #4A90E2;
    box-shadow: 0 8px 32px rgba(74, 144, 226, 0.2);
  }
`;

const SearchHeader = styled.div`
  position: relative;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
`;

const MainSearchBox = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #4A90E2;
    background: #fafbff;
  }
`;

const SearchIcon = styled(Search)`
  color: #64748b;
  margin-right: 12px;
  transition: color 0.3s ease;

  ${MainSearchBox}:focus-within & {
    color: #4A90E2;
    animation: ${pulse} 2s infinite;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 16px 0;
  border: none;
  outline: none;
  font-size: 16px;
  background: transparent;
  color: #1e293b;

  &::placeholder {
    color: #64748b;
    font-weight: 400;
  }
`;

const QuickFilters = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const QuickFilterChip = styled(motion.button)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${props => props.active ? '#4A90E2' : '#e2e8f0'};
  background: ${props => props.active ? '#4A90E2' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#3b82f6' : '#f8fafc'};
    transform: translateY(-1px);
  }
`;

const FilterToggle = styled(motion.button)<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.active ? '#4A90E2' : 'white'};
  color: ${props => props.active ? 'white' : '#64748b'};
  border: 2px solid ${props => props.active ? '#4A90E2' : '#e2e8f0'};
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  margin-left: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? '#3b82f6' : '#f8fafc'};
    transform: translateY(-1px);
  }
`;

const FilterPanel = styled(motion.div)`
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  padding: 24px;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const FilterGroup = styled.div`
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #1e293b;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #1e293b;
  font-size: 14px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4A90E2;
  }
`;

const RangeContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
  margin-top: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: #4A90E2;
`;

// Sugestões e Histórico
const SuggestionsContainer = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`;

const SuggestionGroup = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const SuggestionHeader = styled.div`
  padding: 12px 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8fafc;
`;

const SuggestionItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const SuggestionIcon = styled.div<{ type: string }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.type) {
      case 'user':
        return 'background: linear-gradient(135deg, #667eea, #764ba2);';
      case 'email':
        return 'background: linear-gradient(135deg, #f093fb, #f5576c);';
      case 'phone':
        return 'background: linear-gradient(135deg, #4facfe, #00f2fe);';
      case 'location':
        return 'background: linear-gradient(135deg, #43e97b, #38f9d7);';
      default:
        return 'background: #e2e8f0;';
    }
  }}
`;

const SuggestionContent = styled.div`
  flex: 1;
`;

const SuggestionText = styled.div`
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
`;

const SuggestionCount = styled.div`
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
`;

// Filtros Salvos
const SavedFiltersSection = styled.div`
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
  background: white;
`;

const SavedFiltersHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 12px;
`;

const SavedFiltersTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0;
`;

const SavedFiltersGrid = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SavedFilterChip = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  color: #64748b;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e2e8f0;
    color: #374151;
  }

  .star {
    color: #d1d5db;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
`;

const ActionButton = styled(motion.button)<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #4A90E2;
          color: white;
          border: 2px solid #4A90E2;
          &:hover { background: #3b82f6; }
        `;
      case 'danger':
        return `
          background: #ef4444;
          color: white;
          border: 2px solid #ef4444;
          &:hover { background: #dc2626; }
        `;
      default:
        return `
          background: white;
          color: #64748b;
          border: 2px solid #e2e8f0;
          &:hover { background: #f8fafc; color: #374151; }
        `;
    }
  }}
`;

const ResultsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  font-size: 14px;
  color: #64748b;
`;

// ============ COMPONENT ============
const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  onClearFilters,
  suggestions = [],
  totalResults = 0,
  isLoading = false,
  className
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({
    status: 'all',
    role: 'all',
    registrationPeriod: 'all'
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ============ QUICK FILTERS ============
  const quickFilters = [
    { key: 'active', label: 'Ativos', icon: Users, value: { status: 'active' as UserStatus } },
    { key: 'inactive', label: 'Inativos', icon: User, value: { status: 'inactive' as UserStatus } },
    { key: 'recent', label: 'Novos (7 dias)', icon: Calendar, value: { registrationPeriod: 'week' as const } },
    { key: 'phone', label: 'Com Telefone', icon: Phone, value: { hasPhone: true } },
    { key: 'email', label: 'Com Email', icon: Mail, value: { hasEmail: true } }
  ];

  // ============ HANDLERS ============
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
    setShowSuggestions(value.length > 0);
    
    // Debounced search
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        onSearch(value.trim(), filters);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [filters, onSearch]);

  const handleQuickFilter = (filterKey: string, filterValue: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...filterValue };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestions(false);
    onSearch(suggestion.text, filters);
    
    // Add to search history
    const newHistory = [suggestion.text, ...searchHistory.filter(h => h !== suggestion.text)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('search_history', JSON.stringify(newHistory));
  };

  const saveCurrentFilter = () => {
    const filterName = prompt('Nome para salvar este filtro:');
    if (!filterName) return;

    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters,
      query,
      createdAt: new Date(),
      isFavorite: false
    };

    const updatedFilters = [...savedFilters, newFilter];
    setSavedFilters(updatedFilters);
    localStorage.setItem('saved_filters', JSON.stringify(updatedFilters));
  };

  const applySavedFilter = (savedFilter: SavedFilter) => {
    setQuery(savedFilter.query);
    setFilters(savedFilter.filters);
    onSearch(savedFilter.query, savedFilter.filters);
  };

  const clearAllFilters = () => {
    const emptyFilters: SearchFilters = {
      status: 'all',
      role: 'all',
      registrationPeriod: 'all'
    };
    setFilters(emptyFilters);
    setQuery('');
    onClearFilters();
  };

  // ============ EFFECTS ============
  useEffect(() => {
    const savedHistory = localStorage.getItem('search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    const savedFiltersData = localStorage.getItem('saved_filters');
    if (savedFiltersData) {
      setSavedFilters(JSON.parse(savedFiltersData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============ COMPUTED VALUES ============
  const hasActiveFilters = useMemo(() => {
    return Object.entries(filters).some(([key, value]) => {
      if (key === 'status' || key === 'role' || key === 'registrationPeriod') {
        return value !== 'all';
      }
      return value !== undefined && value !== '' && value !== false;
    });
  }, [filters]);

  const filteredSuggestions = useMemo(() => {
    if (!query) return [];
    return suggestions.filter(s => 
      s.text.toLowerCase().includes(query.toLowerCase())
    );
  }, [suggestions, query]);

  // ============ RENDER ============
  return (
    <SearchContainer ref={containerRef} className={className}>
      <SearchHeader>
        <MainSearchBox>
          <SearchIcon size={20} />
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder="Buscar usuários por nome, email, telefone..."
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => setShowSuggestions(query.length > 0)}
          />
          <FilterToggle
            active={showFilters}
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter size={16} />
            Filtros
            {hasActiveFilters && <span style={{ color: '#ef4444' }}>●</span>}
            <ChevronDown 
              size={14} 
              style={{ 
                transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} 
            />
          </FilterToggle>
        </MainSearchBox>

        <QuickFilters>
          {quickFilters.map((filter) => {
            const Icon = filter.icon;
            const isActive = Object.entries(filter.value).every(([key, value]) => 
              filters[key as keyof SearchFilters] === value
            );
            
            return (
              <QuickFilterChip
                key={filter.key}
                active={isActive}
                onClick={() => handleQuickFilter(filter.key, filter.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon size={14} />
                {filter.label}
              </QuickFilterChip>
            );
          })}
        </QuickFilters>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {showSuggestions && (
            <SuggestionsContainer
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {searchHistory.length > 0 && (
                <SuggestionGroup>
                  <SuggestionHeader>
                    <Clock size={12} style={{ marginRight: 4 }} />
                    Pesquisas Recentes
                  </SuggestionHeader>
                  {searchHistory.slice(0, 3).map((item, index) => (
                    <SuggestionItem
                      key={`history-${index}`}
                      onClick={() => handleSuggestionClick({ id: `history-${index}`, text: item, type: 'user' })}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                    >
                      <SuggestionIcon type="user">
                        <Clock size={16} color="white" />
                      </SuggestionIcon>
                      <SuggestionContent>
                        <SuggestionText>{item}</SuggestionText>
                      </SuggestionContent>
                    </SuggestionItem>
                  ))}
                </SuggestionGroup>
              )}

              {filteredSuggestions.length > 0 && (
                <SuggestionGroup>
                  <SuggestionHeader>
                    <Search size={12} style={{ marginRight: 4 }} />
                    Sugestões
                  </SuggestionHeader>
                  {filteredSuggestions.slice(0, 5).map((suggestion) => (
                    <SuggestionItem
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      whileHover={{ backgroundColor: '#f8fafc' }}
                    >
                      <SuggestionIcon type={suggestion.type}>
                        {suggestion.type === 'user' && <User size={16} color="white" />}
                        {suggestion.type === 'email' && <Mail size={16} color="white" />}
                        {suggestion.type === 'phone' && <Phone size={16} color="white" />}
                        {suggestion.type === 'location' && <MapPin size={16} color="white" />}
                      </SuggestionIcon>
                      <SuggestionContent>
                        <SuggestionText>{suggestion.text}</SuggestionText>
                        {suggestion.count && (
                          <SuggestionCount>{suggestion.count} resultado{suggestion.count > 1 ? 's' : ''}</SuggestionCount>
                        )}
                      </SuggestionContent>
                    </SuggestionItem>
                  ))}
                </SuggestionGroup>
              )}
            </SuggestionsContainer>
          )}
        </AnimatePresence>
      </SearchHeader>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <FilterPanel
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterGrid>
              <FilterGroup>
                <FilterLabel>
                  <Users size={16} />
                  Status do Usuário
                </FilterLabel>
                <FilterSelect
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value === 'all' ? 'all' : e.target.value as UserStatus)}
                >
                  <option value="all">Todos os Status</option>
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                  <option value="pending">Pendente</option>
                  <option value="suspended">Suspenso</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  <User size={16} />
                  Tipo de Usuário
                </FilterLabel>
                <FilterSelect
                  value={filters.role || 'all'}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <option value="all">Todos os Tipos</option>
                  <option value="student">Aluno</option>
                  <option value="instructor">Instrutor</option>
                  <option value="admin">Administrador</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  <Calendar size={16} />
                  Data de Cadastro
                </FilterLabel>
                <FilterSelect
                  value={filters.registrationPeriod || 'all'}
                  onChange={(e) => handleFilterChange('registrationPeriod', e.target.value)}
                >
                  <option value="all">Qualquer Data</option>
                  <option value="today">Hoje</option>
                  <option value="week">Última Semana</option>
                  <option value="month">Último Mês</option>
                  <option value="year">Último Ano</option>
                </FilterSelect>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  <MapPin size={16} />
                  Localização
                </FilterLabel>
                <FilterInput
                  type="text"
                  placeholder="Digite uma cidade..."
                  value={filters.location || ''}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  Faixa Etária
                </FilterLabel>
                <RangeContainer>
                  <FilterInput
                    type="number"
                    placeholder="Min"
                    value={filters.age?.min || ''}
                    onChange={(e) => handleFilterChange('age', { 
                      ...filters.age, 
                      min: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                  <span>até</span>
                  <FilterInput
                    type="number"
                    placeholder="Max"
                    value={filters.age?.max || ''}
                    onChange={(e) => handleFilterChange('age', { 
                      ...filters.age, 
                      max: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                  />
                </RangeContainer>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Informações de Contato</FilterLabel>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={filters.hasPhone || false}
                    onChange={(e) => handleFilterChange('hasPhone', e.target.checked)}
                  />
                  Possui telefone
                </CheckboxContainer>
                <CheckboxContainer>
                  <Checkbox
                    type="checkbox"
                    checked={filters.hasEmail || false}
                    onChange={(e) => handleFilterChange('hasEmail', e.target.checked)}
                  />
                  Possui email
                </CheckboxContainer>
              </FilterGroup>
            </FilterGrid>

            <ActionButtons>
              <ActionButton onClick={saveCurrentFilter}>
                <Save size={16} />
                Salvar Filtro
              </ActionButton>
              <ActionButton variant="secondary" onClick={clearAllFilters}>
                <RefreshCw size={16} />
                Limpar Tudo
              </ActionButton>
            </ActionButtons>
          </FilterPanel>
        )}
      </AnimatePresence>

      {/* Saved Filters */}
      {savedFilters.length > 0 && (
        <SavedFiltersSection>
          <SavedFiltersHeader>
            <SavedFiltersTitle>Filtros Salvos</SavedFiltersTitle>
          </SavedFiltersHeader>
          <SavedFiltersGrid>
            {savedFilters.map((filter) => (
              <SavedFilterChip
                key={filter.id}
                onClick={() => applySavedFilter(filter)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                theme={{ isFavorite: filter.isFavorite }}
              >
                <Star size={12} className="star" />
                {filter.name}
                <X 
                  size={12}
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = savedFilters.filter(f => f.id !== filter.id);
                    setSavedFilters(updated);
                    localStorage.setItem('saved_filters', JSON.stringify(updated));
                  }}
                />
              </SavedFilterChip>
            ))}
          </SavedFiltersGrid>
        </SavedFiltersSection>
      )}

      {/* Results Info */}
      <ResultsInfo>
        {isLoading ? (
          <>
            <RefreshCw size={16} className="animate-spin" />
            Buscando...
          </>
        ) : (
          <>
            <Search size={16} />
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
            {query && ` para "${query}"`}
            {hasActiveFilters && ' com filtros aplicados'}
          </>
        )}
      </ResultsInfo>
    </SearchContainer>
  );
};

export default AdvancedSearch;