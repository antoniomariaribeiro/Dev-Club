import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../utils/icons';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  isAllSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onBulkUpdate?: (data: any) => void;
  onBulkDelete?: () => void;
  onBulkExport?: (format: 'csv' | 'excel') => void;
  isProcessing?: boolean;
  entityName?: string;
  customActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

// Styled Components
const Container = styled(motion.div)`
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 12px 12px;
  margin-bottom: 1rem;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SelectionInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-weight: 500;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const SelectionControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const SelectAllButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
  }
`;

const SelectionText = styled.span`
  font-size: 1rem;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const ActionButton = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  background: ${props => {
    switch (props.$variant) {
      case 'primary': return 'rgba(59, 130, 246, 0.9)';
      case 'danger': return 'rgba(239, 68, 68, 0.9)';
      default: return 'rgba(255, 255, 255, 0.2)';
    }
  }};
  border: 2px solid ${props => {
    switch (props.$variant) {
      case 'primary': return 'rgba(59, 130, 246, 0.3)';
      case 'danger': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(255, 255, 255, 0.3)';
    }
  }};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => {
      switch (props.$variant) {
        case 'primary': return 'rgba(59, 130, 246, 1)';
        case 'danger': return 'rgba(239, 68, 68, 1)';
        default: return 'rgba(255, 255, 255, 0.3)';
      }
    }};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const CloseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: rotate(90deg);
  }
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled(ActionButton)`
  padding: 0.5rem;
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  min-width: 180px;
  z-index: 1000;
`;

const DropdownItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #374151;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  isAllSelected,
  onSelectAll,
  onDeselectAll,
  onBulkUpdate,
  onBulkDelete,
  onBulkExport,
  isProcessing = false,
  entityName = 'itens',
  customActions = []
}) => {
  const [showExportMenu, setShowExportMenu] = React.useState(false);

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  const handleExportCSV = () => {
    onBulkExport?.('csv');
    setShowExportMenu(false);
  };

  const handleExportExcel = () => {
    onBulkExport?.('excel');
    setShowExportMenu(false);
  };

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <Container
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Content>
            <SelectionInfo>
              <SelectionControls>
                <SelectAllButton
                  onClick={handleSelectAllToggle}
                  title={isAllSelected ? 'Desmarcar todos' : 'Marcar todos'}
                >
                  {isAllSelected ? 
                    <Icons.FiCheckSquare size={20} /> : 
                    <Icons.FiSquare size={20} />
                  }
                </SelectAllButton>
                
                <SelectionText>
                  {selectedCount} de {totalCount} {entityName} selecionados
                  {isAllSelected && ' (todos)'}
                </SelectionText>
              </SelectionControls>
            </SelectionInfo>

            <Actions>
              {/* Ações customizadas */}
              {customActions.map((action, index) => (
                <ActionButton
                  key={index}
                  $variant={action.variant}
                  onClick={action.onClick}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? <LoadingSpinner /> : action.icon}
                  {action.label}
                </ActionButton>
              ))}

              {/* Editar em lote */}
              {onBulkUpdate && (
                <ActionButton
                  $variant="primary"
                  onClick={() => onBulkUpdate({})}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? <LoadingSpinner /> : <Icons.FiEdit size={16} />}
                  Editar
                </ActionButton>
              )}

              {/* Exportar */}
              {onBulkExport && (
                <DropdownContainer>
                  <DropdownButton
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={isProcessing}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isProcessing ? <LoadingSpinner /> : <Icons.FiDownload size={16} />}
                    Exportar
                  </DropdownButton>

                  <AnimatePresence>
                    {showExportMenu && (
                      <DropdownMenu
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.15 }}
                      >
                        <DropdownItem onClick={handleExportCSV}>
                          <Icons.FiDownload />
                          Exportar CSV
                        </DropdownItem>
                        <DropdownItem onClick={handleExportExcel}>
                          <Icons.FiDownload />
                          Exportar Excel
                        </DropdownItem>
                      </DropdownMenu>
                    )}
                  </AnimatePresence>
                </DropdownContainer>
              )}

              {/* Excluir */}
              {onBulkDelete && (
                <ActionButton
                  $variant="danger"
                  onClick={onBulkDelete}
                  disabled={isProcessing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isProcessing ? <LoadingSpinner /> : <Icons.FiTrash2 size={16} />}
                  Excluir
                </ActionButton>
              )}

              {/* Fechar */}
              <CloseButton
                onClick={onDeselectAll}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Icons.FiX size={18} />
              </CloseButton>
            </Actions>
          </Content>
        </Container>
      )}
    </AnimatePresence>
  );
};

export default BulkActionsBar;