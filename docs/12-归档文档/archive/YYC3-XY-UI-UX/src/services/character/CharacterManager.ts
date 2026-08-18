/**
 * CharacterManager - 角色信息管理器
 * 负责管理AI角色配置、状态同步和个性化设置
 * 采用单例模式确保角色配置的全局一致性
 * 
 * @author YYC³
 * @version 1.0.0
 */

import type { CharacterConfig, Child, BirthdayInfo, ThemeConfig, ExpressionConfig, ExpressionTrigger } from '../../types';

export class CharacterManager {
  private static instance: CharacterManager;
  private characterCache: Map<string, CharacterConfig> = new Map();
  private currentChild: Child | null = null;
  private currentCharacter: CharacterConfig | null = null;

  private constructor() {
    this.initializeCharacters();
  }

  /**
   * 获取角色管理器的单例实例
   */
  static getInstance(): CharacterManager {
    if (!CharacterManager.instance) {
      CharacterManager.instance = new CharacterManager();
    }
    return CharacterManager.instance;
  }

  /**
   * 初始化所有角色配置
   */
  private initializeCharacters(): void {
    // 沫语（小语）- 女性角色配置
    const xiaoyuConfig: CharacterConfig = {
      id: 'xiaoyu',
      name: '小语',
      defaultName: '沫语',
      gender: 'female',
      age: 1,
      birthday: {
        lunar: '十一月初十',
        solar: '2024-12-10'
      },
      zodiac: '射手座',
      themes: [
        {
          id: 'xiaoyu-pink',
          name: '粉红洛丽塔',
          description: '沫语的粉红洛丽塔主题',
          colors: {
            primary: '#FFB6C1',
            secondary: '#FFC0CB',
            accent: '#FF69B4',
            background: '#FFF0F5',
            surface: '#FFFFFF',
            text: '#333333',
            textSecondary: '#666666'
          },
          typography: {
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '1.875rem'
            },
            fontWeight: {
              normal: '400',
              medium: '500',
              semibold: '600',
              bold: '700'
            }
          }
        },
        {
          id: 'xiaoyu-blue',
          name: '蓝色洛丽塔',
          description: '沫语的蓝色洛丽塔主题',
          colors: {
            primary: '#87CEEB',
            secondary: '#B0E0E6',
            accent: '#4682B4',
            background: '#F0F8FF',
            surface: '#FFFFFF',
            text: '#333333',
            textSecondary: '#666666'
          },
          typography: {
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '1.875rem'
            },
            fontWeight: {
              normal: '400',
              medium: '500',
              semibold: '600',
              bold: '700'
            }
          }
        }
      ],
      currentTheme: 'xiaoyu-pink',
      expressions: [
        {
          id: 'greeting',
          name: '问候',
          trigger: 'greeting',
          imagePath: '/role-photos/girl/xiaoyu-lolita-pink-008.png',
          description: '沫语问候时的表情'
        },
        {
          id: 'celebration',
          name: '庆祝',
          trigger: 'celebration',
          imagePath: '/role-photos/girl/xiaoyu-lolita-pink-009.png',
          description: '沫语庆祝时的表情'
        },
        {
          id: 'encouragement',
          name: '鼓励',
          trigger: 'encouragement',
          imagePath: '/role-photos/girl/xiaoyu-lolita-pink-010.png',
          description: '沫语鼓励时的表情'
        },
        {
          id: 'comfort',
          name: '安慰',
          trigger: 'comfort',
          imagePath: '/role-photos/girl/xiaoyu-lolita-pink-011.png',
          description: '沫语安慰时的表情'
        },
        {
          id: 'thinking',
          name: '思考',
          trigger: 'thinking',
          imagePath: '/role-photos/girl/xiaoyu-lolita-pink-012.png',
          description: '沫语思考时的表情'
        },
        {
          id: 'listening',
          name: '聆听',
          trigger: 'listening',
          imagePath: '/role-photos/girl/xiaoyu-lolita-pink-013.png',
          description: '沫语聆听时的表情'
        }
      ],
      personality: {
        traits: {
          friendliness: 0.95,
          curiosity: 0.9,
          empathy: 0.85,
          creativity: 0.8,
          patience: 0.75,
          playfulness: 0.9
        },
        description: '沫语是一个活泼可爱的小女孩，充满好奇心和创造力，喜欢与人交流，富有同理心。',
        preferences: ['粉色', '洛丽塔风格', '童话故事', '音乐', '绘画'],
        dislikes: ['孤独', '黑暗', '严厉的批评']
      },
      voiceSettings: {
        enabled: true,
        voiceId: 'xiaoyu-female',
        pitch: 1.2,
        speed: 1.0,
        volume: 0.9,
        language: 'zh-CN',
        accent: 'standard'
      },
      avatarPath: '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
      images: {
        homePage: '/role-photos/girl/xiaoyu-lolita-pink-001.png',
        growthRecord: '/role-photos/girl/xiaoyu-lolita-pink-002.png',
        profileInfo: '/role-photos/girl/xiaoyu-lolita-pink-003.png',
        settings: '/role-photos/girl/xiaoyu-lolita-pink-004.png',
        aiAvatar: '/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
        jointAvatar: '/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
        additionalImages: [
          '/role-photos/girl/xiaoyu-lolita-pink-005.png',
          '/role-photos/girl/xiaoyu-lolita-pink-006.png',
          '/role-photos/girl/xiaoyu-lolita-pink-007.png',
          '/role-photos/girl/xiaoyu-lolita-blue-008.png',
          '/role-photos/girl/xiaoyu-lolita-blue-009.png',
          '/role-photos/girl/xiaoyu-lolita-blue-010.png',
          '/role-photos/girl/xiaoyu-lolita-blue-011.png',
          '/role-photos/girl/xiaoyu-lolita-blue-012.png',
          '/role-photos/girl/xiaoyu-lolita-blue-013.png'
        ]
      },
      createdAt: new Date('2025-01-30'),
      updatedAt: new Date('2025-01-30')
    };

    // 沫言（小言）- 男性角色配置
    const xiaoyanConfig: CharacterConfig = {
      id: 'xiaoyan',
      name: '小言',
      defaultName: '沫言',
      gender: 'male',
      age: 10,
      birthday: {
        lunar: '八月十九',
        solar: '2015-10-01'
      },
      zodiac: '天秤座',
      themes: [
        {
          id: 'xiaoyan-casual',
          name: '休闲风格',
          description: '沫言的休闲风格主题',
          colors: {
            primary: '#4A90E2',
            secondary: '#5BA3F5',
            accent: '#2E7D32',
            background: '#F5F5F5',
            surface: '#FFFFFF',
            text: '#333333',
            textSecondary: '#666666'
          },
          typography: {
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '1.875rem'
            },
            fontWeight: {
              normal: '400',
              medium: '500',
              semibold: '600',
              bold: '700'
            }
          }
        },
        {
          id: 'xiaoyan-cool',
          name: '酷炫风格',
          description: '沫言的酷炫风格主题',
          colors: {
            primary: '#2C3E50',
            secondary: '#34495E',
            accent: '#E74C3C',
            background: '#ECF0F1',
            surface: '#FFFFFF',
            text: '#2C3E50',
            textSecondary: '#7F8C8D'
          },
          typography: {
            fontFamily: 'Noto Sans SC, sans-serif',
            fontSize: {
              xs: '0.75rem',
              sm: '0.875rem',
              base: '1rem',
              lg: '1.125rem',
              xl: '1.25rem',
              '2xl': '1.5rem',
              '3xl': '1.875rem'
            },
            fontWeight: {
              normal: '400',
              medium: '500',
              semibold: '600',
              bold: '700'
            }
          }
        }
      ],
      currentTheme: 'xiaoyan-casual',
      expressions: [
        {
          id: 'greeting',
          name: '问候',
          trigger: 'greeting',
          imagePath: '/role-photos/boy/xiaoyan-casual-008.png',
          description: '沫言问候时的表情'
        },
        {
          id: 'celebration',
          name: '庆祝',
          trigger: 'celebration',
          imagePath: '/role-photos/boy/xiaoyan-casual-009.png',
          description: '沫言庆祝时的表情'
        },
        {
          id: 'encouragement',
          name: '鼓励',
          trigger: 'encouragement',
          imagePath: '/role-photos/boy/xiaoyan-casual-010.png',
          description: '沫言鼓励时的表情'
        },
        {
          id: 'comfort',
          name: '安慰',
          trigger: 'comfort',
          imagePath: '/role-photos/boy/xiaoyan-casual-011.png',
          description: '沫言安慰时的表情'
        },
        {
          id: 'thinking',
          name: '思考',
          trigger: 'thinking',
          imagePath: '/role-photos/boy/xiaoyan-casual-012.png',
          description: '沫言思考时的表情'
        },
        {
          id: 'listening',
          name: '聆听',
          trigger: 'listening',
          imagePath: '/role-photos/boy/xiaoyan-casual-013.png',
          description: '沫言聆听时的表情'
        }
      ],
      personality: {
        traits: {
          friendliness: 0.85,
          curiosity: 0.8,
          empathy: 0.75,
          creativity: 0.85,
          patience: 0.7,
          playfulness: 0.75
        },
        description: '沫言是一个聪明活泼的小男孩，富有创造力和好奇心，喜欢探索新事物，善于思考。',
        preferences: ['蓝色', '科技', '探索', '运动', '音乐'],
        dislikes: ['无聊', '重复', '不公正']
      },
      voiceSettings: {
        enabled: true,
        voiceId: 'xiaoyan-male',
        pitch: 1.0,
        speed: 1.1,
        volume: 0.85,
        language: 'zh-CN',
        accent: 'standard'
      },
      avatarPath: '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
      images: {
        homePage: '/role-photos/boy/xiaoyan-casual-001.png',
        growthRecord: '/role-photos/boy/xiaoyan-casual-002.png',
        profileInfo: '/role-photos/boy/xiaoyan-casual-003.png',
        settings: '/role-photos/boy/xiaoyan-casual-004.png',
        aiAvatar: '/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
        jointAvatar: '/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
        additionalImages: [
          '/role-photos/boy/xiaoyan-casual-005.png',
          '/role-photos/boy/xiaoyan-casual-006.png',
          '/role-photos/boy/xiaoyan-casual-007.png',
          '/role-photos/boy/xiaoyan-cool-008.png',
          '/role-photos/boy/xiaoyan-cool-009.png',
          '/role-photos/boy/xiaoyan-cool-010.png',
          '/role-photos/boy/xiaoyan-cool-011.png',
          '/role-photos/boy/xiaoyan-cool-012.png',
          '/role-photos/boy/xiaoyan-cool-013.png'
        ]
      },
      createdAt: new Date('2025-01-30'),
      updatedAt: new Date('2025-01-30')
    };

    // 缓存角色配置
    this.characterCache.set('xiaoyu', xiaoyuConfig);
    this.characterCache.set('xiaoyan', xiaoyanConfig);
    this.characterCache.set('female', xiaoyuConfig);
    this.characterCache.set('male', xiaoyanConfig);
  }

  /**
   * 根据性别获取角色配置
   */
  getCharacterByGender(gender: 'male' | 'female'): CharacterConfig {
    const character = this.characterCache.get(gender);
    
    if (!character) {
      throw new Error(`找不到性别为 ${gender} 的角色配置`);
    }
    
    return character;
  }

  /**
   * 根据用户信息获取个性化角色配置
   */
  getCharacterForUser(child?: Child | null): CharacterConfig {
    if (!child) {
      return this.characterCache.get('female')!;
    }

    const gender = child.gender === 'male' || child.gender === 'female'
      ? child.gender
      : 'female';

    const character = this.characterCache.get(gender)!;

    return {
      ...character,
      name: child.name || character.defaultName,
      age: child.birthday ? this.calculateAge(child.birthday) : character.age,
      birthday: child.birthday ? {
        lunar: this.convertToLunar(child.birthday),
        solar: child.birthday.toISOString().split('T')[0]
      } : character.birthday,
      zodiac: child.birthday ? this.calculateZodiac(child.birthday) : character.zodiac
    };
  }

  /**
   * 获取当前角色配置
   */
  getCurrentCharacter(): CharacterConfig | null {
    return this.currentCharacter;
  }

  /**
   * 设置当前用户档案
   */
  setCurrentChild(child: Child | null): void {
    this.currentChild = child;
    this.currentCharacter = this.getCharacterForUser(child);
  }

  /**
   * 获取当前用户档案
   */
  getCurrentChild(): Child | null {
    return this.currentChild;
  }

  /**
   * 更新角色配置
   */
  updateCharacter(updates: Partial<CharacterConfig>): void {
    if (this.currentCharacter) {
      this.currentCharacter = { ...this.currentCharacter, ...updates };
    }
  }

  /**
   * 获取主题配置
   */
  getTheme(): ThemeConfig {
    if (!this.currentCharacter) {
      return this.characterCache.get('female')!.themes[0];
    }

    const currentThemeId = this.currentCharacter.currentTheme || this.currentCharacter.themes[0].id;
    const theme = this.currentCharacter.themes.find(t => t.id === currentThemeId);
    return theme || this.currentCharacter.themes[0];
  }

  /**
   * 根据触发场景获取表情配置
   */
  getExpression(trigger: ExpressionTrigger): ExpressionConfig {
    if (!this.currentCharacter) {
      const defaultCharacter = this.characterCache.get('female')!;
      const expression = defaultCharacter.expressions.find(e => e.trigger === trigger);
      return expression || defaultCharacter.expressions[0];
    }

    const expression = this.currentCharacter.expressions.find(e => e.trigger === trigger);
    return expression || this.currentCharacter.expressions[0];
  }

  /**
   * 计算年龄
   */
  private calculateAge(birthday: Date): number {
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return Math.max(0, age);
  }

  /**
   * 计算星座
   */
  private calculateZodiac(birthday: Date): string {
    const month = birthday.getMonth() + 1;
    const day = birthday.getDate();

    const zodiacSigns = [
      { sign: '摩羯座', start: { month: 12, day: 22 }, end: { month: 1, day: 19 } },
      { sign: '水瓶座', start: { month: 1, day: 20 }, end: { month: 2, day: 18 } },
      { sign: '双鱼座', start: { month: 2, day: 19 }, end: { month: 3, day: 20 } },
      { sign: '白羊座', start: { month: 3, day: 21 }, end: { month: 4, day: 19 } },
      { sign: '金牛座', start: { month: 4, day: 20 }, end: { month: 5, day: 20 } },
      { sign: '双子座', start: { month: 5, day: 21 }, end: { month: 6, day: 21 } },
      { sign: '巨蟹座', start: { month: 6, day: 22 }, end: { month: 7, day: 22 } },
      { sign: '狮子座', start: { month: 7, day: 23 }, end: { month: 8, day: 22 } },
      { sign: '处女座', start: { month: 8, day: 23 }, end: { month: 9, day: 22 } },
      { sign: '天秤座', start: { month: 9, day: 23 }, end: { month: 10, day: 23 } },
      { sign: '天蝎座', start: { month: 10, day: 24 }, end: { month: 11, day: 22 } },
      { sign: '射手座', start: { month: 11, day: 23 }, end: { month: 12, day: 21 } },
    ];

    for (const zodiac of zodiacSigns) {
      if (
        (month === zodiac.start.month && day >= zodiac.start.day) ||
        (month === zodiac.end.month && day <= zodiac.end.day)
      ) {
        return zodiac.sign;
      }
    }

    return '摩羯座'; // 默认返回摩羯座（12月22日-1月19日）
  }

  /**
   * 将公历日期转换为农历日期（简化版本）
   */
  private convertToLunar(date: Date): string {
    // 这里是简化实现，实际应使用专业的农历转换库
    // 返回格式示例："十一月初十"
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const lunarMonths = ['正月', '二月', '三月', '四月', '五月', '六月', 
                         '七月', '八月', '九月', '十月', '十一月', '腊月'];
    const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                       '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                       '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
    
    return `${lunarMonths[month - 1]}${lunarDays[day - 1]}`;
  }

  /**
   * 获取角色图片（根据场景）
   */
  getCharacterImage(scene: keyof CharacterImages): string {
    if (!this.currentCharacter) {
      return this.characterCache.get('female')!.images[scene] || '';
    }
    return this.currentCharacter.images[scene] || '';
  }

  /**
   * 获取角色头像
   */
  getCharacterAvatar(): string {
    if (!this.currentCharacter) {
      return this.characterCache.get('female')!.avatarPath;
    }
    return this.currentCharacter.avatarPath;
  }
}

// 导出单例实例
export const characterManager = CharacterManager.getInstance();
