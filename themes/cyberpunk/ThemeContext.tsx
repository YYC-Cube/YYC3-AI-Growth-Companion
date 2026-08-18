import React, { createContext, useContext, useState, useCallback } from 'react';

type ThemeMode = 'liquid-glass' | 'cyberpunk';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  isCyberpunk: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('xy-theme');
      return (saved === 'liquid-glass' || saved === 'cyberpunk') ? saved : 'cyberpunk';
    } catch {
      return 'cyberpunk';
    }
  });

  const handleSetTheme = useCallback((newTheme: ThemeMode) => {
    setTheme(newTheme);
    try { localStorage.setItem('xy-theme', newTheme); } catch { /* noop */ }
  }, []);

  const toggleTheme = useCallback(() => {
    handleSetTheme(theme === 'cyberpunk' ? 'liquid-glass' : 'cyberpunk');
  }, [theme, handleSetTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme, isCyberpunk: theme === 'cyberpunk' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
