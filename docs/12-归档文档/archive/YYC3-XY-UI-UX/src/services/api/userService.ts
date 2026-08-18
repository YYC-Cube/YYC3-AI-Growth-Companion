import { BaseAPIService } from './baseService';
import { API_PATHS } from './config';
import { UserData, GrowthRecord } from '../../types';

export interface UserInfo extends UserData {
  preferences: UserPreferences;
  statistics: UserStatistics;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: 'zh-CN' | 'en-US';
  theme: 'light' | 'dark' | 'auto';
  voiceEnabled: boolean;
  voiceSpeed: number;
  fontSize: 'small' | 'medium' | 'large';
  culturalPreference?: string[];
}

export interface UserStatistics {
  totalInteractionTime: number;
  totalMessages: number;
  totalVoiceInteractions: number;
  favoriteTopics: string[];
  learningProgress: Record<string, number>;
}

export interface CreateUserRequest {
  name: string;
  age: number;
  guardian?: string;
  initialPreferences?: Partial<UserPreferences>;
}

export interface GrowthRecordQuery {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export class UserService extends BaseAPIService {
  protected async getMockData<T>(endpoint: string, options: RequestInit): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200));

    // Check if this is a user info request
    if (endpoint.includes('/users/') && options.method === 'GET') {
      const userId = endpoint.split('/').pop();
      return this.getMockUserInfo(userId!) as T;
    }

    // Check if this is a growth records request
    if (endpoint.includes('/growth-records')) {
      return this.getMockGrowthRecords() as T;
    }

    // Check if this is an update request
    if (options.method === 'PUT' && options.body) {
      const updates = JSON.parse(options.body as string);
      const userId = endpoint.split('/').find(part => part.length > 10) || 'user123';
      return { ...this.getMockUserInfo(userId), ...updates } as T;
    }

    return {} as T;
  }

  private getMockUserInfo(userId: string): UserInfo {
    return {
      id: userId,
      name: '云云',
      age: 8,
      avatar: '👧',
      growthStage: '小学低年级（7-9岁）',
      interests: ['绘画', '阅读', '音乐', '科学'],
      preferences: {
        language: 'zh-CN',
        theme: 'light',
        voiceEnabled: true,
        voiceSpeed: 1.0,
        fontSize: 'medium',
        culturalPreference: ['龙门石窟', '白马寺', '牡丹花会'],
      },
      statistics: {
        totalInteractionTime: 12600,
        totalMessages: 156,
        totalVoiceInteractions: 42,
        favoriteTopics: ['文化探索', '创意绘画', '科学实验'],
        learningProgress: {
          '语文': 75,
          '数学': 82,
          '英语': 68,
          '科学': 90,
        },
      },
      createdAt: '2025-12-01T00:00:00Z',
      updatedAt: new Date().toISOString(),
    };
  }

  private getMockGrowthRecords(): GrowthRecord[] {
    return [
      {
        id: 'record1',
        userId: 'user123',
        dimension: '学习能力',
        milestone: '完成了第一个编程项目',
        description: '使用Scratch创建了一个简单的动画',
        date: '2025-12-15',
        achievements: [],
      },
      {
        id: 'record2',
        userId: 'user123',
        dimension: '艺术素养',
        milestone: '绘画作品获奖',
        description: '在校园艺术展中获得二等奖',
        date: '2025-12-10',
        achievements: [],
      },
    ];
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    return this.get<UserInfo>(
      `${API_PATHS[this.apiVersion].USERS}/${userId}`
    );
  }

  async updateUserInfo(userId: string, data: Partial<UserInfo>): Promise<UserInfo> {
    return this.put<UserInfo>(
      `${API_PATHS[this.apiVersion].USERS}/${userId}`,
      data
    );
  }

  async createUser(data: CreateUserRequest): Promise<UserInfo> {
    return this.post<UserInfo>(
      API_PATHS[this.apiVersion].USERS,
      data
    );
  }

  async deleteUser(userId: string): Promise<void> {
    return this.delete<void>(
      `${API_PATHS[this.apiVersion].USERS}/${userId}`
    );
  }

  async getGrowthRecords(
    userId: string,
    params: GrowthRecordQuery
  ): Promise<GrowthRecord[]> {
    return this.get<GrowthRecord[]>(
      `${API_PATHS[this.apiVersion].USERS}/${userId}/growth-records`,
      params
    );
  }

  async updateUserPreferences(
    userId: string,
    preferences: UserPreferences
  ): Promise<void> {
    return this.put<void>(
      `${API_PATHS[this.apiVersion].USERS}/${userId}/preferences`,
      preferences
    );
  }
}

// 创建单例实例
export const userService = new UserService();