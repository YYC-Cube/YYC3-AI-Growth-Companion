import { AvatarCustomization } from '../userProfile/userInformationManager';

export interface AvatarType {
  id: string;
  name: string;
  type: '2d' | '3d' | 'emoji';
  description: string;
  thumbnail: string;
  previewImages: string[];
}

export interface CustomizationOption {
  category: string;
  name: string;
  options: CustomizationItem[];
}

export interface CustomizationItem {
  id: string;
  name: string;
  value: string;
  image?: string;
  price?: number;
  unlockCondition?: string;
}

export interface GlobalAvatar {
  avatarId: string;
  avatarName: string;
  avatarImage: string;
  avatarType: '2d' | '3d' | 'emoji';
  customization: AvatarCustomization;
}

export const AVATAR_TYPES: AvatarType[] = [
  {
    id: '2d_cartoon',
    name: '2D卡通',
    type: '2d',
    description: '可爱的2D卡通风格头像',
    thumbnail: '/images/avatars/types/2d_cartoon_thumb.png',
    previewImages: [
      '/images/avatars/types/2d_cartoon_1.png',
      '/images/avatars/types/2d_cartoon_2.png',
      '/images/avatars/types/2d_cartoon_3.png',
    ],
  },
  {
    id: 'emoji_style',
    name: '表情符号',
    type: 'emoji',
    description: '可爱的表情符号风格',
    thumbnail: '/images/avatars/types/emoji_style_thumb.png',
    previewImages: [
      '/images/avatars/types/emoji_style_1.png',
      '/images/avatars/types/emoji_style_2.png',
    ],
  },
];

export const CUSTOMIZATION_OPTIONS: CustomizationOption[] = [
  {
    category: 'hairColor',
    name: '发色',
    options: [
      { id: 'black', name: '黑色', value: '#000000' },
      { id: 'brown', name: '棕色', value: '#8B4513' },
      { id: 'blonde', name: '金色', value: '#FFD700' },
      { id: 'red', name: '红色', value: '#FF0000' },
      { id: 'blue', name: '蓝色', value: '#0000FF' },
    ],
  },
  {
    category: 'hairStyle',
    name: '发型',
    options: [
      { id: 'short', name: '短发', value: 'short' },
      { id: 'long', name: '长发', value: 'long' },
      { id: 'curly', name: '卷发', value: 'curly' },
      { id: 'ponytail', name: '马尾', value: 'ponytail' },
    ],
  },
  {
    category: 'clothing',
    name: '服装',
    options: [
      { id: 'casual', name: '休闲', value: 'casual' },
      { id: 'formal', name: '正式', value: 'formal' },
      { id: 'sport', name: '运动', value: 'sport' },
      { id: 'traditional', name: '传统', value: 'traditional' },
    ],
  },
];

export class AvatarSystemManager {
  private storagePath = 'user_avatars';

  getAvatarTypes(): AvatarType[] {
    return AVATAR_TYPES;
  }

  getCustomizationOptions(): CustomizationOption[] {
    return CUSTOMIZATION_OPTIONS;
  }

  async createCustomAvatar(
    userId: string,
    baseAvatarId: string,
    customization: AvatarCustomization
  ): Promise<GlobalAvatar> {
    this.validateCustomization(customization);
    
    const customAvatar = await this.generateCustomAvatar(
      baseAvatarId,
      customization
    );
    
    await this.saveUserAvatar(userId, customAvatar);
    
    return customAvatar;
  }

  async getUserAvatar(userId: string): Promise<GlobalAvatar> {
    if (typeof window === 'undefined') {
      return this.getDefaultAvatar();
    }

    const avatarData = localStorage.getItem(`${this.storagePath}/${userId}`);
    
    if (!avatarData) {
      return this.getDefaultAvatar();
    }
    
    return JSON.parse(avatarData);
  }

  async saveUserAvatar(userId: string, avatar: GlobalAvatar): Promise<void> {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(`${this.storagePath}/${userId}`, JSON.stringify(avatar));
  }

  private async generateCustomAvatar(
    baseAvatarId: string,
    customization: AvatarCustomization
  ): Promise<GlobalAvatar> {
    const avatarId = `custom_${Date.now()}`;
    const avatarName = `自定义头像_${new Date().toLocaleDateString()}`;
    
    return {
      avatarId,
      avatarName,
      avatarImage: this.getEmojiForCustomization(customization),
      avatarType: '2d',
      customization,
    };
  }

  private getEmojiForCustomization(customization: AvatarCustomization): string {
    const emojis = ['👦', '👧', '🧒', '👶', '🧑', '👨', '👩', '🧔', '👱', '👴', '👵'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  }

  private validateCustomization(customization: AvatarCustomization): void {
    const validCategories = CUSTOMIZATION_OPTIONS.map(opt => opt.category);
    
    Object.keys(customization).forEach(key => {
      if (!validCategories.includes(key)) {
        throw new Error(`Invalid customization category: ${key}`);
      }
    });
  }

  private getDefaultAvatar(): GlobalAvatar {
    return {
      avatarId: 'default',
      avatarName: '默认头像',
      avatarImage: '👦',
      avatarType: '2d',
      customization: {},
    };
  }
}

export const avatarSystemManager = new AvatarSystemManager();
