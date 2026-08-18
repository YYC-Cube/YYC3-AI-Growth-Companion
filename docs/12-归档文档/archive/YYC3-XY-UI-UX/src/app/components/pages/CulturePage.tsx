import React, { useState, useEffect } from 'react';
import { contentService, ContentItem, CultureCategory } from '../../services/content/contentService';
import { CultureCarousel } from '../business/CultureCarousel';
import { Badge } from '../foundation/Badge';

export const CulturePage: React.FC<{ onNavigate?: (page: string, data?: any) => void }> = ({ onNavigate }) => {
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
        contentService.getCategories()
      ]);
      setItems(fetchedItems);
      setCategories(fetchedCategories);
    } catch (error) {
      console.error('Failed to load culture data', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const handleItemClick = (item: ContentItem) => {
    onNavigate?.('culture_detail', { cultureId: item.id });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-purple-600 animate-pulse">加载文化探索中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 max-w-6xl">
          <h1 className="text-xl font-bold text-gray-900">河洛文化探索</h1>
          <p className="text-sm text-gray-500">探索洛阳千年文化底蕴，感受华夏文明魅力</p>
          
          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto mt-4 pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{category.icon}</span>
                <span className="text-sm font-medium">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-8">
        {/* Featured Carousel */}
        {selectedCategory === 'all' && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🌟</span> 精选推荐
            </h2>
            <CultureCarousel items={items.slice(0, 5)} />
          </section>
        )}

        {/* Content Grid */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-xl">📚</span> 
            {categories.find(c => c.id === selectedCategory)?.name || '全部'}内容
            <span className="text-gray-400 text-sm font-normal ml-2">({filteredItems.length})</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="default" size="sm" className="bg-white/90 backdrop-blur-sm shadow-sm text-gray-800">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  
                  {item.tags && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-50 text-gray-500 rounded-lg text-xs font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between items-center">
                    <span className="text-xs text-gray-400">1.2k 人已学习</span>
                    <span className="text-sm text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                      开始探索 →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
