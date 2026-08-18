import React from 'react';
import { motion } from 'motion/react';
import { Home, BarChart3, Compass, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export interface GlobalNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  className?: string;
}

export const GlobalNavigation: React.FC<GlobalNavigationProps> = ({ currentPage, onNavigate, className = '' }) => {
  const { isCyberpunk } = useTheme();

  const items = [
    { key: 'home', icon: Home, label: '首页', color: isCyberpunk ? '#00f0ff' : '#10b981' },
    { key: 'growth', icon: BarChart3, label: '成长', color: isCyberpunk ? '#ff00ff' : '#059669' },
    { key: 'culture', icon: Compass, label: '探索', color: isCyberpunk ? '#00ff41' : '#14b8a6' },
    { key: 'profile', icon: User, label: '我的', color: isCyberpunk ? '#ffff00' : '#047857' },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 glass-nav py-2 px-6 z-50 ${className}`}>
      <div className="max-w-lg mx-auto flex justify-around items-center relative">
        {items.map((item) => {
          const isActive = currentPage === item.key;
          const IconComp = item.icon;
          return (
            <motion.button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex flex-col items-center gap-0.5 py-1.5 px-4 relative rounded-2xl transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className={`absolute inset-0 backdrop-blur-sm rounded-2xl ${
                    isCyberpunk
                      ? 'bg-[rgba(0,240,255,0.1)] border border-[rgba(0,240,255,0.3)]'
                      : 'bg-emerald-100/60 border border-emerald-200/40'
                  }`}
                  style={isActive && isCyberpunk ? { boxShadow: '0 0 15px rgba(0, 240, 255, 0.15)' } : undefined}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  color: isActive ? item.color : isCyberpunk ? '#666688' : '#9ca3af',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative z-10"
              >
                <IconComp size={22} />
              </motion.div>
              <span
                className={`text-[10px] relative z-10 transition-colors ${
                  isActive
                    ? isCyberpunk ? 'text-[#00f0ff]' : 'text-emerald-700'
                    : isCyberpunk ? 'text-[#666688]' : 'text-gray-400'
                }`}
                style={{ fontWeight: isActive ? 600 : 400 }}
              >
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
