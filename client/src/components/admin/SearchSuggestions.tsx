import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, User, Mail, Phone, MapPin } from 'lucide-react';
import userService from '../../services/userService';

// ============ INTERFACES ============
interface SearchSuggestion {
  id: string;
  text: string;
  type: 'user' | 'email' | 'phone' | 'location' | 'recent';
  count?: number;
  priority?: number;
}

interface SearchAnalytics {
  query: string;
  count: number;
  lastSearched: Date;
  results: number;
}

interface SearchSuggestionsProps {
  query: string;
  onSuggestionSelect: (suggestion: SearchSuggestion) => void;
  isVisible: boolean;
  maxSuggestions?: number;
}

// ============ STYLED COMPONENTS ============
const SuggestionsContainer = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f8fafc;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
`;

const SuggestionSection = styled.div`
  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
`;

const SuggestionItem = styled(motion.div)<{ priority?: number }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  }

  ${props => props.priority && props.priority > 5 && `
    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(135deg, #4A90E2, #357ABD);
    }
  `}
`;

const SuggestionIcon = styled.div<{ type: string }>`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
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
      case 'recent':
        return 'background: linear-gradient(135deg, #ffeaa7, #fab1a0);';
      default:
        return 'background: linear-gradient(135deg, #e2e8f0, #cbd5e1);';
    }
  }}
`;

const SuggestionContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SuggestionText = styled.div`
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 2px;
  
  .highlight {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: white;
    padding: 1px 4px;
    border-radius: 3px;
    font-weight: 600;
  }
`;

const SuggestionMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
`;

const SuggestionCount = styled.span`
  background: #e2e8f0;
  color: #64748b;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
`;

const PopularityIndicator = styled.div<{ level: number }>`
  display: flex;
  align-items: center;
  gap: 2px;
  
  .bar {
    width: 2px;
    height: 8px;
    background: #cbd5e1;
    border-radius: 1px;
    
    &.active {
      background: linear-gradient(135deg, #4A90E2, #357ABD);
    }
  }
`;

const TrendingBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
`;

const EmptyState = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const LoadingState = styled.div`
  padding: 16px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Spinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top: 2px solid #4A90E2;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// ============ COMPONENT ============
const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionSelect,
  isVisible,
  maxSuggestions = 8
}) => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchAnalytics[]>([]);

  // ============ UTILS ============
  const highlightMatch = (text: string, query: string): string => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    return text.replace(regex, '<span class="highlight">$1</span>');
  };

  const getPopularityLevel = (count: number): number => {
    if (count >= 50) return 5;
    if (count >= 20) return 4;
    if (count >= 10) return 3;
    if (count >= 5) return 2;
    if (count >= 1) return 1;
    return 0;
  };

  const calculatePriority = useCallback((suggestion: SearchSuggestion): number => {
    let priority = 0;
    
    // Base score by type
    switch (suggestion.type) {
      case 'user': priority += 10; break;
      case 'email': priority += 8; break;
      case 'phone': priority += 6; break;
      case 'location': priority += 4; break;
      case 'recent': priority += 12; break;
    }
    
    // Count-based score
    if (suggestion.count) {
      priority += Math.min(suggestion.count, 20);
    }
    
    // Query match score
    const queryLower = query.toLowerCase();
    const textLower = suggestion.text.toLowerCase();
    
    if (textLower.startsWith(queryLower)) priority += 15;
    else if (textLower.includes(queryLower)) priority += 10;
    
    return priority;
  }, [query]);

  // ============ DATA FETCHING ============
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Get search suggestions from API
      const response = await userService.getSearchSuggestions(searchQuery);
      
      // Combine with search history
      const historySuggestions = searchHistory
        .filter(h => h.query.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3)
        .map(h => ({
          id: `history-${h.query}`,
          text: h.query,
          type: 'recent' as const,
          count: h.results,
          priority: calculatePriority({
            id: '',
            text: h.query,
            type: 'recent',
            count: h.results
          })
        }));
      
      // Create suggestions array
      const allSuggestions = [
        ...historySuggestions,
        ...response.map((item: any) => ({
          ...item,
          priority: calculatePriority(item)
        }))
      ];
      
      // Sort by priority and limit
      const sortedSuggestions = allSuggestions
        .sort((a, b) => (b.priority || 0) - (a.priority || 0))
        .slice(0, maxSuggestions);
      
      setSuggestions(sortedSuggestions);
      
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchHistory, maxSuggestions, calculatePriority]);

  // ============ EFFECTS ============
  useEffect(() => {
    // Load search history from localStorage
    const stored = localStorage.getItem('search_analytics');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSearchHistory(parsed.map((item: any) => ({
          ...item,
          lastSearched: new Date(item.lastSearched)
        })));
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, fetchSuggestions]);

  // ============ HANDLERS ============
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onSuggestionSelect(suggestion);
    
    // Update search analytics
    const now = new Date();
    const existingIndex = searchHistory.findIndex(h => h.query === suggestion.text);
    
    let updatedHistory;
    if (existingIndex >= 0) {
      updatedHistory = [...searchHistory];
      updatedHistory[existingIndex] = {
        ...updatedHistory[existingIndex],
        count: updatedHistory[existingIndex].count + 1,
        lastSearched: now
      };
    } else {
      updatedHistory = [
        ...searchHistory,
        {
          query: suggestion.text,
          count: 1,
          lastSearched: now,
          results: suggestion.count || 0
        }
      ];
    }
    
    // Keep only last 50 searches
    updatedHistory = updatedHistory
      .sort((a, b) => b.lastSearched.getTime() - a.lastSearched.getTime())
      .slice(0, 50);
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('search_analytics', JSON.stringify(updatedHistory));
  };

  // ============ GROUPED SUGGESTIONS ============
  const groupedSuggestions = {
    recent: suggestions.filter(s => s.type === 'recent'),
    users: suggestions.filter(s => s.type === 'user'),
    contacts: suggestions.filter(s => ['email', 'phone'].includes(s.type)),
    locations: suggestions.filter(s => s.type === 'location')
  };

  // ============ RENDER ============
  if (!isVisible) return null;

  return (
    <SuggestionsContainer
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading && (
        <LoadingState>
          <Spinner />
          Buscando sugestões...
        </LoadingState>
      )}

      {!isLoading && suggestions.length === 0 && query.trim() && (
        <EmptyState>
          Nenhuma sugestão encontrada para "{query}"
        </EmptyState>
      )}

      {!isLoading && suggestions.length > 0 && (
        <>
          {/* Recent Searches */}
          {groupedSuggestions.recent.length > 0 && (
            <SuggestionSection>
              <SectionHeader>
                <Clock size={12} />
                Pesquisas Recentes
              </SectionHeader>
              {groupedSuggestions.recent.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  priority={suggestion.priority}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SuggestionIcon type={suggestion.type}>
                    <Clock size={16} color="white" />
                  </SuggestionIcon>
                  <SuggestionContent>
                    <SuggestionText
                      dangerouslySetInnerHTML={{ 
                        __html: highlightMatch(suggestion.text, query) 
                      }}
                    />
                    <SuggestionMeta>
                      {suggestion.count && suggestion.count > 0 && (
                        <SuggestionCount>
                          {suggestion.count} resultado{suggestion.count > 1 ? 's' : ''}
                        </SuggestionCount>
                      )}
                      <PopularityIndicator level={getPopularityLevel(suggestion.count || 0)}>
                        {[1, 2, 3, 4, 5].map(i => (
                          <div 
                            key={i} 
                            className={`bar ${i <= getPopularityLevel(suggestion.count || 0) ? 'active' : ''}`}
                          />
                        ))}
                      </PopularityIndicator>
                    </SuggestionMeta>
                  </SuggestionContent>
                </SuggestionItem>
              ))}
            </SuggestionSection>
          )}

          {/* Users */}
          {groupedSuggestions.users.length > 0 && (
            <SuggestionSection>
              <SectionHeader>
                <User size={12} />
                Usuários
              </SectionHeader>
              {groupedSuggestions.users.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  priority={suggestion.priority}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SuggestionIcon type={suggestion.type}>
                    <User size={16} color="white" />
                  </SuggestionIcon>
                  <SuggestionContent>
                    <SuggestionText
                      dangerouslySetInnerHTML={{ 
                        __html: highlightMatch(suggestion.text, query) 
                      }}
                    />
                    <SuggestionMeta>
                      {suggestion.count && (
                        <>
                          <SuggestionCount>
                            {suggestion.count} usuário{suggestion.count > 1 ? 's' : ''}
                          </SuggestionCount>
                          {suggestion.count >= 10 && (
                            <TrendingBadge>
                              <TrendingUp size={10} />
                              Popular
                            </TrendingBadge>
                          )}
                        </>
                      )}
                    </SuggestionMeta>
                  </SuggestionContent>
                </SuggestionItem>
              ))}
            </SuggestionSection>
          )}

          {/* Contacts */}
          {groupedSuggestions.contacts.length > 0 && (
            <SuggestionSection>
              <SectionHeader>
                <Mail size={12} />
                Contatos
              </SectionHeader>
              {groupedSuggestions.contacts.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  priority={suggestion.priority}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SuggestionIcon type={suggestion.type}>
                    {suggestion.type === 'email' && <Mail size={16} color="white" />}
                    {suggestion.type === 'phone' && <Phone size={16} color="white" />}
                  </SuggestionIcon>
                  <SuggestionContent>
                    <SuggestionText
                      dangerouslySetInnerHTML={{ 
                        __html: highlightMatch(suggestion.text, query) 
                      }}
                    />
                    <SuggestionMeta>
                      <span>{suggestion.type === 'email' ? 'Email' : 'Telefone'}</span>
                      {suggestion.count && (
                        <SuggestionCount>
                          {suggestion.count} resultado{suggestion.count > 1 ? 's' : ''}
                        </SuggestionCount>
                      )}
                    </SuggestionMeta>
                  </SuggestionContent>
                </SuggestionItem>
              ))}
            </SuggestionSection>
          )}

          {/* Locations */}
          {groupedSuggestions.locations.length > 0 && (
            <SuggestionSection>
              <SectionHeader>
                <MapPin size={12} />
                Localizações
              </SectionHeader>
              {groupedSuggestions.locations.map((suggestion) => (
                <SuggestionItem
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  priority={suggestion.priority}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <SuggestionIcon type={suggestion.type}>
                    <MapPin size={16} color="white" />
                  </SuggestionIcon>
                  <SuggestionContent>
                    <SuggestionText
                      dangerouslySetInnerHTML={{ 
                        __html: highlightMatch(suggestion.text, query) 
                      }}
                    />
                    <SuggestionMeta>
                      <span>Localização</span>
                      {suggestion.count && (
                        <SuggestionCount>
                          {suggestion.count} usuário{suggestion.count > 1 ? 's' : ''}
                        </SuggestionCount>
                      )}
                    </SuggestionMeta>
                  </SuggestionContent>
                </SuggestionItem>
              ))}
            </SuggestionSection>
          )}
        </>
      )}
    </SuggestionsContainer>
  );
};

export default SearchSuggestions;