import React from 'react';
import { motion } from 'motion/react';
import { Home, BarChart3, Compass, User } from 'lucide-react';

export interface GlobalNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  className?: string;
}

export const GlobalNavigation: React.FC<GlobalNavigationProps> = ({ currentPage, onNavigate, className = '' }) => {
  const items = [
    { key: 'home', icon: Home, label: '首页', color: '#10b981' },
    { key: 'growth', icon: BarChart3, label: '成长', color: '#059669' },
    { key: 'culture', icon: Compass, label: '探索', color: '#14b8a6' },
    { key: 'profile', icon: User, label: '我的', color: '#047857' },
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
                  className="absolute inset-0 bg-emerald-100/60 backdrop-blur-sm rounded-2xl border border-emerald-200/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  color: isActive ? item.color : '#9ca3af',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className="relative z-10"
              >
                <IconComp size={22} />
              </motion.div>
              <span
                className={`text-[10px] relative z-10 transition-colors ${isActive ? 'text-emerald-700' : 'text-gray-400'}`}
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
