import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string, data?: any) => void;
  goBack: () => void;
  goHome: () => void;
  canGoBack: boolean;
  navigationData: any;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<string[]>(['home']);
  const [navigationData, setNavigationData] = useState<any>(null);

  const currentPage = history[history.length - 1] || 'home';
  const canGoBack = history.length > 1;

  const navigateTo = (page: string, data?: any) => {
    setHistory(prev => [...prev, page]);
    if (data) {
      setNavigationData(data);
    }
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const goHome = () => {
    setHistory(['home']);
  };

  return (
    <NavigationContext.Provider value={{ 
      currentPage, 
      navigateTo, 
      goBack, 
      goHome, 
      canGoBack, 
      navigationData 
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
