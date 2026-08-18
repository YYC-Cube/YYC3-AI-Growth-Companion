import React from 'react';
import { motion } from 'motion/react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, toggleTheme, isCyberpunk } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
        isCyberpunk ? 'theme-toggle-cyber' : 'theme-toggle-glass'
      } ${className}`}
      title={`切换到${isCyberpunk ? '液态玻璃' : '赛博朋克'}风格`}
      aria-label={`当前: ${theme === 'cyberpunk' ? '赛博朋克' : '液态玻璃'}，点击切换`}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="text-lg"
      >
        {isCyberpunk ? '⚡' : '🌊'}
      </motion.span>
    </motion.button>
  );
};
