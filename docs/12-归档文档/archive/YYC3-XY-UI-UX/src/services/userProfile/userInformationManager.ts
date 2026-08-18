import { userService, UserInfo } from '../api/userService';
import { GrowthStage } from '../../types';

export interface UserInformation {
  basicInfo: {
    id: string;
    name: string;
    nickname?: string;
    age: number;
    gender?: 'male' | 'female' | 'other';
    avatar?: string;
    birthDate?: string;
  };
  
  growthInfo: {
    currentStage: string;
    stageName: string;
    stageDescription: string;
    ageRange: string;
    characteristics: string[];
    progressToNextStage: number;
  };
  
  preferences: {
    language: 'zh-CN' | 'en-US';
    theme: 'light' | 'dark' | 'auto';
    voiceEnabled: boolean;
    voiceSpeed: number;
    fontSize: 'small' | 'medium' | 'large';
    culturalPreference?: string[];
    contentPreference?: string[];
  };
  
  statistics: {
    totalInteractionTime: number;
    totalMessages: number;
    totalVoiceInteractions: number;
    favoriteTopics: string[];
    learningProgress: Record<string, number>;
    lastActiveTime: string;
  };
  
  globalAvatar: {
    avatarId: string;
    avatarName: string;
    avatarImage: string;
    avatarType: '2d' | '3d' | 'emoji';
    customization: AvatarCustomization;
  };
  
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: string;
  };
}

export interface AvatarCustomization {
  hairColor?: string;
  hairStyle?: string;
  skinColor?: string;
  eyeColor?: string;
  clothing?: string;
  accessories?: string[];
  background?: string;
}

export class UserInformationManager {
  private storageKey = 'user_information';

  async getUserInformation(userId: string): Promise<UserInformation> {
    try {
      // First check local storage
      const localInfo = this.getLocalUserInformation();
      if (localInfo && localInfo.basicInfo.id === userId) {
        return localInfo;
      }

      // Try to fetch from API
      const userInfo = await userService.getUserInfo(userId);
      const userInformation = this.transformToUserInformation(userInfo);
      
      this.saveLocalUserInformation(userInformation);
      
      return userInformation;
    } catch (error) {
      console.warn('Failed to get user information from API, using fallback data:', error);
      
      // Try local storage first
      const localInfo = this.getLocalUserInformation();
      if (localInfo) {
        return localInfo;
      }
      
      // Return default user information as last resort
      return this.getDefaultUserInformation(userId);
    }
  }

  async updateUserInformation(
    userId: string,
    updates: Partial<UserInformation>
  ): Promise<UserInformation> {
    try {
      const currentInfo = await this.getUserInformation(userId);
      const updatedInfo = { ...currentInfo, ...updates };
      
      this.saveLocalUserInformation(updatedInfo);
      
      return updatedInfo;
    } catch (error) {
      console.error('Failed to update user information:', error);
      throw error;
    }
  }

  async updateGlobalAvatar(
    userId: string,
    avatar: UserInformation['globalAvatar']
  ): Promise<UserInformation> {
    return this.updateUserInformation(userId, { globalAvatar: avatar });
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<UserInformation['preferences']>
  ): Promise<UserInformation> {
    const currentInfo = await this.getUserInformation(userId);
    return this.updateUserInformation(userId, {
      preferences: { ...currentInfo.preferences, ...preferences },
    });
  }

  private getLocalUserInformation(): UserInformation | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  private saveLocalUserInformation(info: UserInformation): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(info));
  }

  private transformToUserInformation(apiData: UserInfo): UserInformation {
    return {
      basicInfo: {
        id: apiData.id,
        name: apiData.name,
        age: apiData.age,
        avatar: apiData.avatar,
      },
      growthInfo: {
        currentStage: apiData.growthStage,
        stageName: this.getStageName(apiData.growthStage),
        stageDescription: this.getStageDescription(apiData.growthStage),
        ageRange: this.getStageAgeRange(apiData.growthStage),
        characteristics: this.getStageCharacteristics(apiData.growthStage),
        progressToNextStage: 0,
      },
      preferences: {
        language: apiData.preferences?.language || 'zh-CN',
        theme: apiData.preferences?.theme || 'light',
        voiceEnabled: apiData.preferences?.voiceEnabled ?? true,
        voiceSpeed: apiData.preferences?.voiceSpeed || 1.0,
        fontSize: apiData.preferences?.fontSize || 'medium',
        culturalPreference: apiData.preferences?.culturalPreference,
      },
      statistics: {
        totalInteractionTime: apiData.statistics?.totalInteractionTime || 0,
        totalMessages: apiData.statistics?.totalMessages || 0,
        totalVoiceInteractions: apiData.statistics?.totalVoiceInteractions || 0,
        favoriteTopics: apiData.statistics?.favoriteTopics || [],
        learningProgress: apiData.statistics?.learningProgress || {},
        lastActiveTime: new Date().toISOString(),
      },
      globalAvatar: {
        avatarId: 'default',
        avatarName: '默认头像',
        avatarImage: apiData.avatar || '👦',
        avatarType: '2d',
        customization: {},
      },
      metadata: {
        createdAt: apiData.createdAt,
        updatedAt: apiData.updatedAt,
        version: '1.0',
      },
    };
  }

  private getStageName(stage: string): string {
    const stageNames: Record<string, string> = {
      '幼儿期（0-3岁）': '幼儿期',
      '学龄前期（3-6岁）': '学龄前期',
      '小学低年级（7-9岁）': '小学低年级',
      '小学高年级（10-12岁）': '小学高年级',
      '初中阶段（13-15岁）': '初中阶段',
    };
    return stageNames[stage] || stage;
  }

  private getStageDescription(stage: string): string {
    const descriptions: Record<string, string> = {
      '幼儿期（0-3岁）': '探索世界的开始，感知能力快速发展',
      '学龄前期（3-6岁）': '好奇心旺盛，想象力丰富',
      '小学低年级（7-9岁）': '建立学习基础，培养良好习惯',
      '小学高年级（10-12岁）': '能力发展期，逻辑思维形成',
      '初中阶段（13-15岁）': '独立思考，价值观形成',
    };
    return descriptions[stage] || '成长发展期';
  }

  private getStageAgeRange(stage: string): string {
    const ageRanges: Record<string, string> = {
      '幼儿期（0-3岁）': '0-3岁',
      '学龄前期（3-6岁）': '3-6岁',
      '小学低年级（7-9岁）': '7-9岁',
      '小学高年级（10-12岁）': '10-12岁',
      '初中阶段（13-15岁）': '13-15岁',
    };
    return ageRanges[stage] || '未知';
  }

  private getStageCharacteristics(stage: string): string[] {
    const characteristics: Record<string, string[]> = {
      '幼儿期（0-3岁）': ['感官发展', '语言启蒙', '情感依恋'],
      '学龄前期（3-6岁）': ['好奇心强', '模仿学习', '社交萌芽'],
      '小学低年级（7-9岁）': ['逻辑思维', '知识积累', '规则意识'],
      '小学高年级（10-12岁）': ['独立思考', '兴趣培养', '团队合作'],
      '初中阶段（13-15岁）': ['批判性思维', '自我认知', '价值观念'],
    };
    return characteristics[stage] || ['成长发展'];
  }

  private getDefaultUserInformation(userId: string): UserInformation {
    return {
      basicInfo: {
        id: userId,
        name: '云云',
        age: 8,
        avatar: '👧',
      },
      growthInfo: {
        currentStage: '小学低年级（7-9岁）',
        stageName: '小学低年级',
        stageDescription: '建立学习基础，培养良好习惯',
        ageRange: '7-9岁',
        characteristics: ['逻辑思维', '知识积累', '规则意识'],
        progressToNextStage: 0,
      },
      preferences: {
        language: 'zh-CN',
        theme: 'light',
        voiceEnabled: true,
        voiceSpeed: 1.0,
        fontSize: 'medium',
        culturalPreference: ['龙门石窟', '白马寺', '牡丹花会'],
        contentPreference: ['绘画', '阅读', '音乐', '科学'],
      },
      statistics: {
        totalInteractionTime: 0,
        totalMessages: 0,
        totalVoiceInteractions: 0,
        favoriteTopics: [],
        learningProgress: {},
        lastActiveTime: new Date().toISOString(),
      },
      globalAvatar: {
        avatarId: 'default',
        avatarName: '默认头像',
        avatarImage: '👧',
        avatarType: '2d',
        customization: {},
      },
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: '1.0',
      },
    };
  }
}

export const userInformationManager = new UserInformationManager();