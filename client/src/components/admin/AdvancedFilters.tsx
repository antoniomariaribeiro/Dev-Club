import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../../utils/icons';

interface FilterOption {
  label: string;
  value: string;
}



interface AdvancedFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
  onResetFilters: () => void;
}

// Styled Components
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FilterPanel = styled(motion.div)`
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
`;

const Content = styled.div`
  padding: 2rem;
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FilterLabel = styled.label`
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.9rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background: #f8fafc;
  }
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #667eea;
`;

const DateRangeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RangeSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RangeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    cursor: pointer;
    border: none;
  }
`;

const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #6b7280;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Tag = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$selected ? '#667eea' : '#f3f4f6'};
  color: ${props => props.$selected ? 'white' : '#374151'};
  border: 2px solid ${props => props.$selected ? '#667eea' : 'transparent'};

  &:hover {
    background: ${props => props.$selected ? '#5a67d8' : '#e5e7eb'};
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
  border-radius: 0 0 16px 16px;
`;

const ResetButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  background: white;
  color: #6b7280;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
    color: #374151;
  }
`;

const ApplyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
`;

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  onClose,
  onApplyFilters,
  onResetFilters
}) => {
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    userTypes: [] as string[],
    eventCategories: [] as string[],
    revenueRange: { min: 0, max: 100000 },
    status: '',
    searchTerm: '',
    tags: [] as string[]
  });

  const userTypeOptions: FilterOption[] = [
    { label: 'Administradores', value: 'admin' },
    { label: 'Estudantes', value: 'student' },
    { label: 'Instrutores', value: 'instructor' },
    { label: 'Visitantes', value: 'visitor' }
  ];

  const eventCategoryOptions: FilterOption[] = [
    { label: 'Workshops', value: 'workshop' },
    { label: 'Graduações', value: 'graduation' },
    { label: 'Competições', value: 'competition' },
    { label: 'Treinamentos', value: 'training' },
    { label: 'Eventos Especiais', value: 'special' }
  ];

  const statusOptions: FilterOption[] = [
    { label: 'Todos', value: '' },
    { label: 'Ativo', value: 'active' },
    { label: 'Inativo', value: 'inactive' },
    { label: 'Pendente', value: 'pending' },
    { label: 'Concluído', value: 'completed' }
  ];

  const availableTags = [
    'Capoeira', 'Música', 'História', 'Técnicas', 'Berimbau',
    'Pandeiro', 'Atabaque', 'Roda', 'Ginga', 'Esquiva',
    'Iniciante', 'Intermediário', 'Avançado', 'Regional', 'Angola'
  ];

  const handleUserTypeChange = (value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      userTypes: checked
        ? [...prev.userTypes, value]
        : prev.userTypes.filter(type => type !== value)
    }));
  };

  const handleEventCategoryChange = (value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      eventCategories: checked
        ? [...prev.eventCategories, value]
        : prev.eventCategories.filter(cat => cat !== value)
    }));
  };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      userTypes: [],
      eventCategories: [],
      revenueRange: { min: 0, max: 100000 },
      status: '',
      searchTerm: '',
      tags: []
    });
    onResetFilters();
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <FilterPanel
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={e => e.stopPropagation()}
        >
          <Header>
            <Title>
              <Icons.FiFilter />
              Filtros Avançados
            </Title>
            <CloseButton onClick={onClose}>
              <Icons.FiX size={24} />
            </CloseButton>
          </Header>

          <Content>
            <FilterGrid>
              <FilterGroup>
                <FilterLabel>
                  <Icons.FiSearch />
                  Termo de Busca
                </FilterLabel>
                <Input
                  type="text"
                  placeholder="Buscar por nome, email, título..."
                  value={filters.searchTerm}
                  onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  <Icons.FiCalendar />
                  Período
                </FilterLabel>
                <DateRangeContainer>
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                  />
                </DateRangeContainer>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  <Icons.FiUsers />
                  Tipos de Usuário
                </FilterLabel>
                <CheckboxGroup>
                  {userTypeOptions.map(option => (
                    <CheckboxItem key={option.value}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.userTypes.includes(option.value)}
                        onChange={e => handleUserTypeChange(option.value, e.target.checked)}
                      />
                      {option.label}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  <Icons.FiCalendar />
                  Categorias de Eventos
                </FilterLabel>
                <CheckboxGroup>
                  {eventCategoryOptions.map(option => (
                    <CheckboxItem key={option.value}>
                      <Checkbox
                        type="checkbox"
                        checked={filters.eventCategories.includes(option.value)}
                        onChange={e => handleEventCategoryChange(option.value, e.target.checked)}
                      />
                      {option.label}
                    </CheckboxItem>
                  ))}
                </CheckboxGroup>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>
                  <Icons.FiDollarSign />
                  Faixa de Receita
                </FilterLabel>
                <RangeSliderContainer>
                  <RangeSlider
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.revenueRange.min}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      revenueRange: { ...prev.revenueRange, min: parseInt(e.target.value) }
                    }))}
                  />
                  <RangeLabels>
                    <span>R$ {filters.revenueRange.min.toLocaleString('pt-BR')}</span>
                    <span>R$ {filters.revenueRange.max.toLocaleString('pt-BR')}</span>
                  </RangeLabels>
                  <RangeSlider
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={filters.revenueRange.max}
                    onChange={e => setFilters(prev => ({
                      ...prev,
                      revenueRange: { ...prev.revenueRange, max: parseInt(e.target.value) }
                    }))}
                  />
                </RangeSliderContainer>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Status</FilterLabel>
                <Select
                  value={filters.status}
                  onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FilterGroup>
            </FilterGrid>

            <FilterGroup style={{ marginTop: '2rem' }}>
              <FilterLabel>
                <Icons.FiTag />
                Tags
              </FilterLabel>
              <TagsContainer>
                {availableTags.map(tag => (
                  <Tag
                    key={tag}
                    $selected={filters.tags.includes(tag)}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Tag>
                ))}
              </TagsContainer>
            </FilterGroup>
          </Content>

          <Actions>
            <ResetButton onClick={handleResetFilters}>
              <Icons.FiRefreshCw />
              Limpar Filtros
            </ResetButton>
            <ApplyButton onClick={handleApplyFilters}>
              <Icons.FiFilter />
              Aplicar Filtros
            </ApplyButton>
          </Actions>
        </FilterPanel>
      </Overlay>
    </AnimatePresence>
  );
};

export default AdvancedFilters;