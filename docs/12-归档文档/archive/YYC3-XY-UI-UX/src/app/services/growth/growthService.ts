import { v4 as uuidv4 } from 'uuid';

// Mock data types
export interface GrowthNode {
  id: string;
  age: number;
  content: {
    title: string;
    description: string;
    type: 'cultural' | 'academic' | 'social' | 'health' | 'perception';
    milestones: string[];
    smartTags?: string[];
  };
  metadata: {
    created: string;
    updated: string;
  };
}

class GrowthService {
  private growthData: GrowthNode[] = [
    {
      id: '1',
      age: 3,
      content: {
        title: '第一次背诵古诗',
        description: '在幼儿园学会了《咏鹅》，虽然发音还有点稚嫩，但是非常有感情。',
        type: 'cultural',
        milestones: ['诗词启蒙'],
        smartTags: ['古诗', '语言能力']
      },
      metadata: {
        created: '2023-05-15T10:00:00Z',
        updated: '2023-05-15T10:00:00Z'
      }
    },
    {
      id: '2',
      age: 4,
      content: {
        title: '参观龙门石窟',
        description: '周末全家去龙门石窟游玩，对大佛非常感兴趣，问了很多问题。',
        type: 'cultural',
        milestones: ['文化探索'],
        smartTags: ['龙门石窟', '历史兴趣']
      },
      metadata: {
        created: '2024-04-10T14:30:00Z',
        updated: '2024-04-10T14:30:00Z'
      }
    },
    {
      id: '3',
      age: 6,
      content: {
        title: '小学入学第一天',
        description: '背着新书包去上学，认识了新朋友，很开心。',
        type: 'social',
        milestones: ['入学'],
        smartTags: ['社交', '适应新环境']
      },
      metadata: {
        created: '2025-09-01T08:00:00Z',
        updated: '2025-09-01T08:00:00Z'
      }
    }
  ];

  async getGrowthTree(): Promise<GrowthNode[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.growthData]);
      }, 500);
    });
  }

  async getGrowthTimeline(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          phases: {
            0: { name: '感知启蒙期', color: '#ffadd2', icon: '👶' },
            1: { name: '感知启蒙期', color: '#ffadd2', icon: '👶' },
            2: { name: '感知启蒙期', color: '#ffadd2', icon: '👶' },
            3: { name: '感知启蒙期', color: '#ffadd2', icon: '👶' },
            4: { name: '文化浸润期', color: '#b37feb', icon: '🎨' },
            5: { name: '文化浸润期', color: '#b37feb', icon: '🎨' },
            6: { name: '文化浸润期', color: '#b37feb', icon: '🎨' },
            7: { name: '学业发展期', color: '#69c0ff', icon: '📚' },
            // ... more phases
          }
        });
      }, 500);
    });
  }

  async getGrowthStatistics(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalRecords: this.growthData.length,
          milestones: this.growthData.reduce((acc, curr) => acc + curr.content.milestones.length, 0),
          culturalActivities: this.growthData.filter(n => n.content.type === 'cultural').length,
          attachmentCounts: { photos: 12, videos: 3 },
          growthAreas: [
            { category: '文化认知', count: 2, trend: 'up' },
            { category: '社交能力', count: 1, trend: 'up' },
            { category: '学业发展', count: 0, trend: 'stable' }
          ]
        });
      }, 500);
    });
  }

  async addGrowthRecord(record: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord: GrowthNode = {
          id: uuidv4(),
          age: record.age || 6,
          content: {
            title: record.title,
            description: record.description,
            type: record.type,
            milestones: record.milestones || [],
            smartTags: record.tags || []
          },
          metadata: {
            created: new Date().toISOString(),
            updated: new Date().toISOString()
          }
        };
        this.growthData.push(newRecord);
        resolve();
      }, 500);
    });
  }
}

export const growthService = new GrowthService();
