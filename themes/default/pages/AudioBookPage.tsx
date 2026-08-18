import React, { useState } from 'react';
import { PageNavigation } from '../layout/PageNavigation';
import { Search, ChevronLeft, Heart, Play } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  category: string;
  image: string;
  isFavorite: boolean;
  categoryBadge: string;
  badgeIcon: string;
}

interface Category {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
}

export const AudioBookPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: 'all', label: '全部', icon: '🌟', isActive: true },
    { id: 'story', label: '故事', icon: '📚', isActive: false },
    { id: 'poem', label: '诗歌', icon: '📖', isActive: false },
    { id: 'emotion', label: '情绪管理', icon: '💝', isActive: false },
    { id: 'habit', label: '习惯养成', icon: '⏰', isActive: false },
    { id: 'tradition', label: '传统文化', icon: '🏮', isActive: false },
    { id: 'english', label: '英语启蒙', icon: '🔤', isActive: false },
    { id: 'math', label: '数学启蒙', icon: '🎓', isActive: false },
    { id: 'music', label: '音乐欣赏', icon: '🎵', isActive: false },
  ]);

  const [books] = useState<Book[]>([
    {
      id: '1',
      title: '小熊的星星梦',
      category: 'AI绘本',
      image: '',
      isFavorite: false,
      categoryBadge: 'AI绘本',
      badgeIcon: '🤖',
    },
    {
      id: '2',
      title: '勇敢的小兔子',
      category: 'AI绘本',
      image: '',
      isFavorite: true,
      categoryBadge: 'AI绘本',
      badgeIcon: '🤖',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => ({
        ...cat,
        isActive: cat.id === categoryId,
      }))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 pb-20">
      {/* 导航栏 */}
      <PageNavigation title="有声绘本" icon="📖" />

      {/* Search Bar */}
      <div className="bg-white shadow-sm sticky top-[64px] z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索绘本..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-purple-300 transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white shadow-sm sticky top-[128px] z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  category.isActive
                    ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="text-base">{category.icon}</span>
                <span className="text-sm">{category.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Featured Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">⭐</span>
            <h3 className="text-gray-900">今日推荐</h3>
          </div>

          <div className="bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-4xl">📖</span>
                <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs">
                  AI绘本
                </div>
              </div>
              <h2 className="mb-2">小熊的星星梦</h2>
              <p className="text-white/90 text-sm mb-4">
                一只小熊想要摘下天上最亮的星星，开启了一段奇妙的冒险之旅...
              </p>
              <button className="px-6 py-2.5 bg-white text-orange-600 rounded-full hover:shadow-lg transition-all flex items-center gap-2">
                <Play className="w-4 h-4" fill="currentColor" />
                <span>开始阅读</span>
              </button>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute right-4 top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute left-1/2 bottom-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Book Grid */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">📚</span>
            <h3 className="text-gray-900">精选绘本</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group cursor-pointer"
              >
                <div className="relative aspect-[3/4] bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 flex items-center justify-center">
                  <div className="text-6xl">📖</div>
                  
                  {/* Favorite Button */}
                  <button
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      book.isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={book.isFavorite ? 'currentColor' : 'none'}
                    />
                  </button>

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-xs flex items-center gap-1">
                    <span>{book.badgeIcon}</span>
                    <span>{book.categoryBadge}</span>
                  </div>

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>

                <div className="p-3">
                  <h4 className="text-gray-900 mb-1 line-clamp-1">{book.title}</h4>
                  <p className="text-xs text-gray-500">{book.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State for More Content */}
        <div className="text-center py-8">
          <div className="text-5xl mb-3">🎨</div>
          <p className="text-gray-500 text-sm">更多精彩绘本即将上线</p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};