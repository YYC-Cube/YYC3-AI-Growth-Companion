import { mockCultureItems } from '../../data/mockData';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  tags?: string[];
  content?: string; // Rich text content
  relatedItems?: string[];
}

export interface CultureCategory {
  id: string;
  name: string;
  icon: string;
}

class ContentService {
  private items: ContentItem[] = mockCultureItems;

  async getContentList(category?: string): Promise<ContentItem[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (category && category !== 'all') {
          resolve(this.items.filter(item => item.category === category));
        } else {
          resolve(this.items);
        }
      }, 300);
    });
  }

  async getContentById(id: string): Promise<ContentItem | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.items.find(item => item.id === id));
      }, 200);
    });
  }

  async getCategories(): Promise<CultureCategory[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Extract unique categories from items or use predefined ones
        const uniqueCategories = Array.from(new Set(this.items.map(item => item.category)));
        const categories = uniqueCategories.map(cat => ({
          id: cat,
          name: cat, // You might want a mapping for display names
          icon: '🏛️'
        }));
        // Add 'all' category
        resolve([{ id: 'all', name: '全部', icon: '🔍' }, ...categories]);
      }, 100);
    });
  }
}

export const contentService = new ContentService();
