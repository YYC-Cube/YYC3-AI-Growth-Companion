/**
 * NavigationContext - 全局导航状态管理
 * 提供页面导航、历史记录管理等功能
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface NavigationContextType {
  /** 当前页面标识 */
  currentPage: string;
  /** 导航到指定页面 */
  navigate: (page: string) => void;
  /** 返回上一页 */
  goBack: () => void;
  /** 返回首页 */
  goHome: () => void;
  /** 导航历史记录 */
  history: string[];
  /** 是否可以返回 */
  canGoBack: boolean;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

export interface NavigationProviderProps {
  children: React.ReactNode;
  initialPage?: string;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ 
  children, 
  initialPage = 'home' 
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [history, setHistory] = useState<string[]>([initialPage]);

  const navigate = useCallback((page: string) => {
    if (page === currentPage) return; // 避免重复导航
    
    setCurrentPage(page);
    setHistory(prev => [...prev, page]);
  }, [currentPage]);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // 移除当前页
      const previousPage = newHistory[newHistory.length - 1];
      setCurrentPage(previousPage);
      setHistory(newHistory);
    }
  }, [history]);

  const goHome = useCallback(() => {
    setCurrentPage('home');
    setHistory(['home']);
  }, []);

  const canGoBack = history.length > 1;

  const value: NavigationContextType = {
    currentPage,
    navigate,
    goBack,
    goHome,
    history,
    canGoBack
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * useNavigation Hook
 * 在组件中使用导航功能
 */
export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};
