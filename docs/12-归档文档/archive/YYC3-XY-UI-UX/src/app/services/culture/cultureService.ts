import { mockCultureItems } from '../../data/mockData';

export interface CultureContent {
  id: string;
  title: string;
  description: string;
  type: 'site' | 'food' | 'festival' | 'story';
  difficultyLevel: number;
  suitableAgeRange: [number, number];
  location?: string;
  detailedContent: string;
  multimedia: {
    images: string[];
    videos?: string[];
    audio?: string[];
    ar?: boolean;
  };
  knowledgePoints: {
    id: string;
    question: string;
    answer: string;
    explanation?: string;
  }[];
  interactiveElements: {
    id: string;
    title: string;
    description: string;
    type: 'game' | 'quiz' | 'craft' | 'ar' | 'video';
    duration?: number;
  }[];
  relatedContent: string[];
  learned: boolean;
  quizCompleted: boolean;
  interactiveCompleted: boolean;
  shared: boolean;
}

export type CultureType = CultureContent['type'];

class CultureService {
  private favorites: string[] = [];

  async getCultureDetail(id: string): Promise<CultureContent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock implementation
        resolve({
          id,
          title: '龙门石窟',
          description: '中国四大石窟之一，世界文化遗产。',
          type: 'site',
          difficultyLevel: 3,
          suitableAgeRange: [6, 12],
          location: '洛阳市洛龙区',
          detailedContent: '<p>龙门石窟是中国石刻艺术宝库之一，现为世界文化遗产...</p>',
          multimedia: {
            images: [
              'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=2940&auto=format&fit=crop',
              'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=2942&auto=format&fit=crop'
            ],
            ar: true
          },
          knowledgePoints: [
            { id: '1', question: '龙门石窟位于哪里？', answer: '洛阳', explanation: '位于洛阳南郊伊河两岸' }
          ],
          interactiveElements: [
            { id: '1', title: '修复佛像', description: '体验文物修复过程', type: 'game', duration: 15 }
          ],
          relatedContent: ['2', '3'],
          learned: false,
          quizCompleted: false,
          interactiveCompleted: false,
          shared: false
        });
      }, 500);
    });
  }

  async getUserFavorites(): Promise<string[]> {
    return Promise.resolve(this.favorites);
  }

  async addFavorite(id: string): Promise<void> {
    if (!this.favorites.includes(id)) {
      this.favorites.push(id);
    }
  }

  async removeFavorite(id: string): Promise<void> {
    this.favorites = this.favorites.filter(fid => fid !== id);
  }
}

export const cultureService = new CultureService();
