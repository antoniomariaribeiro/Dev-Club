import { useState, useCallback } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

export interface BulkSelection<T = any> {
  selectedItems: Set<number>;
  isAllSelected: boolean;
  selectItem: (id: number) => void;
  selectAll: (items: T[]) => void;
  deselectAll: () => void;
  toggleItem: (id: number) => void;
  getSelectedCount: () => number;
  isSelected: (id: number) => boolean;
}

export interface BulkOperations {
  bulkUpdate: (ids: number[], data: any) => Promise<void>;
  bulkDelete: (ids: number[]) => Promise<void>;
  bulkExport: (ids: number[], format: 'csv' | 'excel') => Promise<void>;
}

export interface UseBulkOperationsProps<T> {
  items: T[];
  onUpdate?: (ids: number[], data: any) => Promise<void>;
  onDelete?: (ids: number[]) => Promise<void>;
  onExport?: (ids: number[], format: 'csv' | 'excel') => Promise<void>;
  entityName?: string;
}

export function useBulkOperations<T extends { id: number }>({
  items,
  onUpdate,
  onDelete,
  onExport,
  entityName = 'items'
}: UseBulkOperationsProps<T>) {
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const { warning, error: showError, success } = useNotifications();

  // Seleção individual
  const selectItem = useCallback((id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  }, []);

  // Desselecionar item
  const deselectItem = useCallback((id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  }, []);

  // Toggle item
  const toggleItem = useCallback((id: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Selecionar todos
  const selectAll = useCallback((itemList: T[] = items) => {
    setSelectedItems(new Set(itemList.map(item => item.id)));
  }, [items]);

  // Desselecionar todos
  const deselectAll = useCallback(() => {
    setSelectedItems(new Set());
  }, []);

  // Verificar se item está selecionado
  const isSelected = useCallback((id: number) => {
    return selectedItems.has(id);
  }, [selectedItems]);

  // Contar selecionados
  const getSelectedCount = useCallback(() => {
    return selectedItems.size;
  }, [selectedItems]);

  // Verificar se todos estão selecionados
  const isAllSelected = items.length > 0 && selectedItems.size === items.length;

  // Operação de atualização em lote
  const bulkUpdate = useCallback(async (updateData: any) => {
    if (selectedItems.size === 0) {
      warning('Seleção Vazia', 'Nenhum item selecionado');
      return;
    }

    if (!onUpdate) {
      showError('Operação Indisponível', 'Operação de atualização não disponível');
      return;
    }

    setIsProcessing(true);
    try {
      const ids = Array.from(selectedItems);
      await onUpdate(ids, updateData);
      
      success(
        'Atualização Concluída',
        `${ids.length} ${entityName} ${ids.length === 1 ? 'atualizado' : 'atualizados'} com sucesso`
      );
      
      deselectAll();
    } catch (error) {
      console.error('Erro na atualização em lote:', error);
      showError('Erro na Atualização', 'Erro ao atualizar itens selecionados');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItems, onUpdate, entityName, deselectAll, warning, showError, success]);

  // Operação de exclusão em lote
  const bulkDelete = useCallback(async () => {
    if (selectedItems.size === 0) {
      warning('Seleção Vazia', 'Nenhum item selecionado');
      return;
    }

    if (!onDelete) {
      showError('Operação Indisponível', 'Operação de exclusão não disponível');
      return;
    }

    const ids = Array.from(selectedItems);
    const confirmMessage = `Tem certeza que deseja excluir ${ids.length} ${entityName}? Esta ação não pode ser desfeita.`;
    
    if (!window.confirm(confirmMessage)) {
      return;
    }

    setIsProcessing(true);
    try {
      await onDelete(ids);
      
      success(
        'Exclusão Concluída',
        `${ids.length} ${entityName} ${ids.length === 1 ? 'excluído' : 'excluídos'} com sucesso`
      );
      
      deselectAll();
    } catch (error) {
      console.error('Erro na exclusão em lote:', error);
      showError('Erro na Exclusão', 'Erro ao excluir itens selecionados');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItems, onDelete, entityName, deselectAll, warning, showError, success]);

  // Operação de exportação
  const bulkExport = useCallback(async (format: 'csv' | 'excel' = 'csv') => {
    const ids = selectedItems.size > 0 ? Array.from(selectedItems) : items.map(item => item.id);
    
    if (ids.length === 0) {
      warning('Sem Dados', 'Nenhum item para exportar');
      return;
    }

    if (!onExport) {
      showError('Operação Indisponível', 'Operação de exportação não disponível');
      return;
    }

    setIsProcessing(true);
    try {
      await onExport(ids, format);
      
      success(
        'Exportação Concluída',
        `${ids.length} ${entityName} exportados com sucesso (${format.toUpperCase()})`
      );
    } catch (error) {
      console.error('Erro na exportação:', error);
      showError('Erro na Exportação', 'Erro ao exportar dados');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedItems, items, onExport, entityName, warning, showError, success]);

  // Ações de seleção rápida
  const selectVisible = useCallback(() => {
    selectAll(items);
  }, [selectAll, items]);

  const selectNone = useCallback(() => {
    deselectAll();
  }, [deselectAll]);

  const invertSelection = useCallback(() => {
    setSelectedItems(prev => {
      const newSet = new Set<number>();
      items.forEach(item => {
        if (!prev.has(item.id)) {
          newSet.add(item.id);
        }
      });
      return newSet;
    });
  }, [items]);

  return {
    // Estado da seleção
    selectedItems: Array.from(selectedItems),
    selectedCount: getSelectedCount(),
    isAllSelected,
    isProcessing,
    
    // Métodos de seleção
    selectItem,
    deselectItem,
    toggleItem,
    selectAll,
    deselectAll,
    isSelected,
    getSelectedCount,
    
    // Ações de seleção rápida
    selectVisible,
    selectNone,
    invertSelection,
    
    // Operações em lote
    bulkUpdate,
    bulkDelete,
    bulkExport,
    
    // Interface de seleção para componentes
    selection: {
      selectedItems: new Set(selectedItems),
      isAllSelected,
      selectItem,
      selectAll,
      deselectAll,
      toggleItem,
      getSelectedCount,
      isSelected
    } as BulkSelection<T>
  };
}

// Hook auxiliar para gerenciar estado de filtros
export function useFilterState<T>(initialFilters: T) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [isFiltered, setIsFiltered] = useState(false);

  const updateFilter = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setFilters(prev => {
      const updated = { ...prev, [key]: value };
      
      // Verificar se há filtros ativos
      const hasActiveFilters = Object.entries(updated).some(([filterKey, filterValue]) => {
        if (filterKey === 'page' || filterKey === 'limit') return false;
        
        if (typeof filterValue === 'string') return filterValue.trim() !== '';
        if (typeof filterValue === 'number') return filterValue !== 0;
        if (Array.isArray(filterValue)) return filterValue.length > 0;
        if (typeof filterValue === 'object' && filterValue !== null) {
          return Object.values(filterValue).some(v => v !== '' && v !== null && v !== undefined);
        }
        
        return filterValue !== null && filterValue !== undefined && filterValue !== '';
      });
      
      setIsFiltered(hasActiveFilters);
      return updated;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setIsFiltered(false);
  }, [initialFilters]);

  const clearFilter = useCallback(<K extends keyof T>(key: K) => {
    updateFilter(key, initialFilters[key]);
  }, [initialFilters, updateFilter]);

  return {
    filters,
    isFiltered,
    updateFilter,
    resetFilters,
    clearFilter,
    setFilters
  };
}

// Utilitários para exportação
export const exportUtils = {
  // Converter dados para CSV
  toCSV: (data: any[], headers?: string[]) => {
    if (!data.length) return '';
    
    const keys = headers || Object.keys(data[0]);
    const csvHeaders = keys.join(',');
    
    const csvRows = data.map(row => 
      keys.map(key => {
        const value = row[key];
        if (value === null || value === undefined) return '';
        
        // Escapar aspas e vírgulas
        const stringValue = String(value).replace(/"/g, '""');
        return stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')
          ? `"${stringValue}"`
          : stringValue;
      }).join(',')
    );
    
    return [csvHeaders, ...csvRows].join('\n');
  },
  
  // Download de arquivo
  downloadFile: (content: string, filename: string, type: string = 'text/csv') => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  },
  
  // Gerar nome de arquivo com timestamp
  generateFilename: (prefix: string, format: string = 'csv') => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-');
    return `${prefix}_${timestamp}.${format}`;
  }
};

export default useBulkOperations;