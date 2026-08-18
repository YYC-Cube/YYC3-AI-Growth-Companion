import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { contentService, ContentItem, CultureCategory } from '../../services/content/contentService';
import { CultureCarousel } from '../business/CultureCarousel';
import { Compass, Sparkles } from 'lucide-react';

export interface CulturePageProps {
  onNavigate?: (page: string, data?: Record<string, unknown>) => void;
}

export const CulturePage: React.FC<CulturePageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [categories, setCategories] = useState<CultureCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedItems, fetchedCategories] = await Promise.all([
        contentService.getContentList('all'),
        contentService.getCategories(),
      ]);
      setItems(fetchedItems);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load culture data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' ? items : items.filter((item) => item.category === selectedCategory);

  const handleItemClick = (item: ContentItem) => {
    onNavigate?.('culture_detail', { cultureId: item.id });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-emerald-600 flex items-center gap-2"
        >
          <Compass size={20} className="animate-spin" />
          加载文化探索中...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="glass-header sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <h1 className="text-gray-800" style={{ fontWeight: 600, fontSize: '1.25rem' }}>河洛文化探索</h1>
          <p className="text-sm text-gray-400">探索洛阳千年文化底蕴，感受华夏文明魅力</p>

          <div className="flex gap-2 overflow-x-auto mt-4 pb-2 glass-scroll">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl whitespace-nowrap transition-all flex-shrink-0 text-sm ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-md shadow-emerald-500/20'
                    : 'bg-white/40 backdrop-blur-md text-gray-600 hover:bg-white/60 border border-white/50'
                }`}
                style={{ fontWeight: 500 }}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-8">
        {selectedCategory === 'all' && (
          <section>
            <h2 className="text-gray-800 mb-4 flex items-center gap-2" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
              <Sparkles size={18} className="text-emerald-500" /> 精选推荐
            </h2>
            <CultureCarousel items={items.slice(0, 5)} />
          </section>
        )}

        <section>
          <h2 className="text-gray-800 mb-4 flex items-center gap-2" style={{ fontWeight: 600, fontSize: '1.125rem' }}>
            📚 {categories.find((c) => c.id === selectedCategory)?.name || '全部'}内容
            <span className="text-gray-400 text-sm ml-2" style={{ fontWeight: 400 }}>({filteredItems.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => handleItemClick(item)}
                className="glass-card overflow-hidden cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/50 backdrop-blur-md rounded-xl text-xs text-gray-700 border border-white/50" style={{ fontWeight: 500 }}>
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1" style={{ fontWeight: 600 }}>
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">{item.description}</p>

                  {item.tags && (
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-50/60 text-emerald-600 rounded-lg text-xs backdrop-blur-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-white/30 flex justify-between items-center">
                    <span className="text-xs text-gray-400">1.2k 人已学习</span>
                    <span className="text-sm text-emerald-600 group-hover:translate-x-1 transition-transform" style={{ fontWeight: 500 }}>
                      开始探索 →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
