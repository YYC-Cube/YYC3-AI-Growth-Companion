# YYC3-XY-角色信息管理器技术文档

> @file YYC3-XY-角色信息管理器技术文档.md
> @description 详细说明角色信息管理器的架构设计、功能实现、API接口和使用方法
> @author YYC³
> @version 1.0.0
> @created 2025-01-30
> @updated 2025-01-30
> @status published
> @tags 角色管理,架构设计,技术文档,YYC³

---

## 目录

1. [系统概述](#系统概述)
2. [架构设计](#架构设计)
3. [核心模块](#核心模块)
4. [数据结构](#数据结构)
5. [API接口](#api接口)
6. [UI组件](#ui组件)
7. [验证机制](#验证机制)
8. [集成指南](#集成指南)
9. [使用示例](#使用示例)
10. [最佳实践](#最佳实践)

---

## 系统概述

### 1.1 功能定位

角色信息管理器是YYC³小语AI应用的核心组件，负责统一管理AI角色的配置信息、状态同步和用户个性化设置。系统采用单例模式确保角色配置的全局一致性，并提供完整的验证和自动修复机制。

### 1.2 核心特性

- **单例模式管理**：确保角色配置全局唯一性和一致性
- **性别差异化配置**：支持男女角色的独立配置和自动选择
- **动态主题生成**：基于角色属性自动生成个性化主题
- **表情上下文管理**：根据交互触发场景选择合适的表情
- **完整验证机制**：提供错误、警告和建议三级验证反馈
- **自动修复功能**：智能检测并修复角色配置问题
- **用户数据同步**：与用户档案信息实时同步更新

### 1.3 技术栈

- **编程语言**：TypeScript
- **框架**：React
- **状态管理**：React Hooks (useState, useEffect)
- **设计模式**：Singleton Pattern
- **数据验证**：自定义验证器类
- **UI组件**：Shadcn/ui

---

## 架构设计

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      应用层 (UI Components)                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         RoleInfoManager (角色信息管理器UI)                │  │
│  │  - 角色信息展示                                          │  │
│  │  - 编辑表单                                              │  │
│  │  - 验证结果展示                                          │  │
│  │  - 自动修复操作                                          │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    业务逻辑层 (Business Logic)                 │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐ │
│  │ CharacterManager    │  │ CharacterInfoValidator         │ │
│  │ - 角色配置管理       │  │ - 配置验证                      │ │
│  │ - 缓存管理           │  │ - 一致性检查                    │ │
│  │ - 用户数据同步       │  │ - 自动修复                      │ │
│  │ - 主题生成           │  │ - 验证报告                      │ │
│  └─────────────────────┘  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      数据层 (Data Layer)                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              CharacterConfig (角色配置数据)               │  │
│  │  - 基本信息                                              │  │
│  │  - 主题配置                                              │  │
│  │  - 表情配置                                              │  │
│  │  - 个性配置                                              │  │
│  │  - 语音设置                                              │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 设计模式

#### 2.2.1 单例模式 (Singleton Pattern)

**应用场景**：CharacterManager 和 CharacterInfoValidator

**实现原理**：

```typescript
export class CharacterManager {
  private static instance: CharacterManager
  private characterCache: Map<string, CharacterConfig> = new Map()

  private constructor() {
    this.initializeCharacters()
  }

  static getInstance(): CharacterManager {
    if (!CharacterManager.instance) {
      CharacterManager.instance = new CharacterManager()
    }
    return CharacterManager.instance
  }
}
```

**优势**：

- 确保全局只有一个实例
- 提供全局访问点
- 延迟初始化，节省资源
- 避免配置不一致问题

#### 2.2.2 工厂模式 (Factory Pattern)

**应用场景**：角色配置创建和个性化定制

**实现原理**：

```typescript
getCharacterForUser(child?: Child | null): CharacterConfig {
  if (!child) {
    return this.characterCache.get('female')!
  }

  const gender = child.gender === 'male' || child.gender === 'female'
    ? child.gender
    : 'female'

  const character = this.characterCache.get(gender)!

  return {
    ...character,
    name: child.name || character.defaultName,
    age: child.birthday ? this.calculateAge(child.birthday) : character.age,
    birthday: child.birthday ? {
      lunar: this.convertToLunar(child.birthday),
      solar: child.birthday.toISOString().split('T')[0]
    } : character.birthday,
    zodiac: child.birthday ? this.calculateZodiac(child.birthday) : character.zodiac
  }
}
```

### 2.3 数据流设计

```
用户档案数据 (Child)
      ↓
CharacterManager.getCharacterForUser()
      ↓
角色配置 (CharacterConfig)
      ↓
CharacterInfoValidator.validateCharacterConfig()
      ↓
验证结果 (ValidationResult)
      ↓
UI展示 (RoleInfoManager)
```

---

## 核心模块

### 3.1 CharacterManager (角色管理器)

#### 3.1.1 模块职责

- 管理所有AI角色的配置信息
- 提供角色配置的缓存机制
- 实现角色配置的初始化和更新
- 根据用户信息自动选择合适的角色
- 生成个性化主题和表情配置

#### 3.1.2 核心方法

##### getInstance()

获取角色管理器的单例实例。

```typescript
static getInstance(): CharacterManager
```

**返回值**：CharacterManager 实例

**示例**：

```typescript
const characterManager = CharacterManager.getInstance()
```

##### getCharacterByGender()

根据性别获取角色配置。

```typescript
getCharacterByGender(gender: 'male' | 'female'): CharacterConfig
```

**参数**：

- `gender`: 性别 ('male' | 'female')

**返回值**：CharacterConfig 角色配置对象

**异常**：当找不到对应性别的角色配置时抛出错误

**示例**：

```typescript
const maleCharacter = characterManager.getCharacterByGender('male')
const femaleCharacter = characterManager.getCharacterByGender('female')
```

##### getCharacterForUser()

根据用户信息自动选择并定制角色配置。

```typescript
getCharacterForUser(child?: Child | null): CharacterConfig
```

**参数**：

- `child`: 用户档案信息 (可选)

**返回值**：CharacterConfig 个性化角色配置对象

**功能说明**：

- 如果没有提供用户信息，返回默认女性角色
- 根据用户性别选择对应角色
- 使用用户姓名更新角色名称
- 根据用户生日计算年龄、星座和农历生日
- 生成包含用户信息的个性化角色配置

**示例**：

```typescript
const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const personalizedCharacter = characterManager.getCharacterForUser(child)
```

##### getCurrentCharacter()

获取当前激活的角色配置。

```typescript
getCurrentCharacter(): CharacterConfig | null
```

**返回值**：当前角色配置，如果没有则返回 null

##### setCurrentChild()

设置当前用户档案。

```typescript
setCurrentChild(child: Child | null): void
```

**参数**：

- `child`: 用户档案信息

**功能说明**：

- 更新当前用户档案
- 根据用户信息自动更新角色配置
- 触发角色配置的重新计算

##### getCurrentChild()

获取当前用户档案。

```typescript
getCurrentChild(): Child | null
```

**返回值**：当前用户档案，如果没有则返回 null

##### updateCharacter()

更新角色配置信息。

```typescript
updateCharacter(updates: Partial<CharacterConfig>): void
```

**参数**：

- `updates`: 部分角色配置更新

**功能说明**：

- 更新当前角色配置的指定字段
- 保持未指定字段不变
- 触发配置变更事件

##### getTheme()

获取角色主题配置。

```typescript
getTheme(): ThemeConfig
```

**返回值**：主题配置对象

##### getExpression()

根据触发场景获取表情配置。

```typescript
getExpression(trigger: ExpressionTrigger): ExpressionConfig
```

**参数**：

- `trigger`: 表情触发场景

**返回值**：表情配置对象

**触发场景类型**：

- `greeting`: 问候
- `celebration`: 庆祝
- `encouragement`: 鼓励
- `comfort`: 安慰
- `thinking`: 思考
- `listening`: 聆听

#### 3.1.3 私有方法

##### initializeCharacters()

初始化所有角色配置。

```typescript
private initializeCharacters(): void
```

**功能说明**：

- 创建男性角色配置
- 创建女性角色配置
- 将配置存储到缓存中

##### calculateAge()

根据生日计算年龄。

```typescript
private calculateAge(birthday: Date): number
```

**参数**：

- `birthday`: 生日日期

**返回值**：年龄（周岁）

##### calculateZodiac()

根据生日计算星座。

```typescript
private calculateZodiac(birthday: Date): string
```

**参数**：

- `birthday`: 生日日期

**返回值**：星座名称

##### convertToLunar()

将公历日期转换为农历日期。

```typescript
private convertToLunar(date: Date): string
```

**参数**：

- `date`: 公历日期

**返回值**：农历日期字符串

#### 3.1.4 角色配置初始化实现

##### 沫语（小语）角色配置

```typescript
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
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-008.png',
      description: '沫语问候时的表情'
    },
    {
      id: 'celebration',
      name: '庆祝',
      trigger: 'celebration',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-009.png',
      description: '沫语庆祝时的表情'
    },
    {
      id: 'encouragement',
      name: '鼓励',
      trigger: 'encouragement',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-010.png',
      description: '沫语鼓励时的表情'
    },
    {
      id: 'comfort',
      name: '安慰',
      trigger: 'comfort',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-011.png',
      description: '沫语安慰时的表情'
    },
    {
      id: 'thinking',
      name: '思考',
      trigger: 'thinking',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-012.png',
      description: '沫语思考时的表情'
    },
    {
      id: 'listening',
      name: '聆听',
      trigger: 'listening',
      imagePath: '/public/role-photos/girl/xiaoyu-lolita-pink-013.png',
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
  avatarPath: '/public/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
  images: {
    homePage: '/public/role-photos/girl/xiaoyu-lolita-pink-001.png',
    growthRecord: '/public/role-photos/girl/xiaoyu-lolita-pink-002.png',
    profileInfo: '/public/role-photos/girl/xiaoyu-lolita-pink-003.png',
    settings: '/public/role-photos/girl/xiaoyu-lolita-pink-004.png',
    aiAvatar: '/public/role-photos/girl/ai-avatars/girl-xiaoyu-lolita-pink-001.png',
    jointAvatar: '/public/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
    additionalImages: [
      '/public/role-photos/girl/xiaoyu-lolita-pink-005.png',
      '/public/role-photos/girl/xiaoyu-lolita-pink-006.png',
      '/public/role-photos/girl/xiaoyu-lolita-pink-007.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-008.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-009.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-010.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-011.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-012.png',
      '/public/role-photos/girl/xiaoyu-lolita-blue-013.png'
    ]
  },
  createdAt: new Date('2025-01-30'),
  updatedAt: new Date('2025-01-30')
}
```

##### 沫言（小言）角色配置

```typescript
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
      imagePath: '/public/role-photos/boy/xiaoyan-casual-008.png',
      description: '沫言问候时的表情'
    },
    {
      id: 'celebration',
      name: '庆祝',
      trigger: 'celebration',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-009.png',
      description: '沫言庆祝时的表情'
    },
    {
      id: 'encouragement',
      name: '鼓励',
      trigger: 'encouragement',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-010.png',
      description: '沫言鼓励时的表情'
    },
    {
      id: 'comfort',
      name: '安慰',
      trigger: 'comfort',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-011.png',
      description: '沫言安慰时的表情'
    },
    {
      id: 'thinking',
      name: '思考',
      trigger: 'thinking',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-012.png',
      description: '沫言思考时的表情'
    },
    {
      id: 'listening',
      name: '聆听',
      trigger: 'listening',
      imagePath: '/public/role-photos/boy/xiaoyan-casual-013.png',
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
  avatarPath: '/public/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
  images: {
    homePage: '/public/role-photos/boy/xiaoyan-casual-001.png',
    growthRecord: '/public/role-photos/boy/xiaoyan-casual-002.png',
    profileInfo: '/public/role-photos/boy/xiaoyan-casual-003.png',
    settings: '/public/role-photos/boy/xiaoyan-casual-004.png',
    aiAvatar: '/public/role-photos/boy/ai-avatars/boy-xiaoyan-casual-001.png',
    jointAvatar: '/public/role-photos/joint-avatars/xiaoyan-boy-xiaoyu-girl-cute-001-joint-avatar.png',
    additionalImages: [
      '/public/role-photos/boy/xiaoyan-casual-005.png',
      '/public/role-photos/boy/xiaoyan-casual-006.png',
      '/public/role-photos/boy/xiaoyan-casual-007.png',
      '/public/role-photos/boy/xiaoyan-cool-008.png',
      '/public/role-photos/boy/xiaoyan-cool-009.png',
      '/public/role-photos/boy/xiaoyan-cool-010.png',
      '/public/role-photos/boy/xiaoyan-cool-011.png',
      '/public/role-photos/boy/xiaoyan-cool-012.png',
      '/public/role-photos/boy/xiaoyan-cool-013.png'
    ]
  },
  createdAt: new Date('2025-01-30'),
  updatedAt: new Date('2025-01-30')
}
```

##### 角色配置初始化方法实现

```typescript
private initializeCharacters(): void {
  this.characterCache.set('xiaoyu', xiaoyuConfig)
  this.characterCache.set('xiaoyan', xiaoyanConfig)
  this.characterCache.set('female', xiaoyuConfig)
  this.characterCache.set('male', xiaoyanConfig)
}
```

##### 性别自动映射函数

```typescript
getCharacterByGender(gender: 'male' | 'female'): CharacterConfig {
  const character = this.characterCache.get(gender)
  
  if (!character) {
    throw new Error(`找不到性别为 ${gender} 的角色配置`)
  }
  
  return character
}

getCharacterForUser(child?: Child | null): CharacterConfig {
  if (!child) {
    return this.characterCache.get('female')!
  }

  const gender = child.gender === 'male' || child.gender === 'female'
    ? child.gender
    : 'female'

  const character = this.characterCache.get(gender)!

  return {
    ...character,
    name: child.name || character.defaultName,
    age: child.birthday ? this.calculateAge(child.birthday) : character.age,
    birthday: child.birthday ? {
      lunar: this.convertToLunar(child.birthday),
      solar: child.birthday.toISOString().split('T')[0]
    } : character.birthday,
    zodiac: child.birthday ? this.calculateZodiac(child.birthday) : character.zodiac
  }
}
```

##### 全局UI元素自动映射

```typescript
interface CharacterImages {
  homePage: string
  growthRecord: string
  profileInfo: string
  settings: string
  aiAvatar: string
  jointAvatar: string
  additionalImages: string[]
}

function getCharacterImages(gender: 'male' | 'female'): CharacterImages {
  const character = CharacterManager.getInstance().getCharacterByGender(gender)
  return character.images
}

function getCharacterAvatar(gender: 'male' | 'female'): string {
  const character = CharacterManager.getInstance().getCharacterByGender(gender)
  return character.avatarPath
}

function getCharacterTheme(gender: 'male' | 'female'): ThemeConfig {
  const character = CharacterManager.getInstance().getCharacterByGender(gender)
  const currentThemeId = character.currentTheme || character.themes[0].id
  const theme = character.themes.find(t => t.id === currentThemeId)
  return theme || character.themes[0]
}
```

### 3.2 CharacterInfoValidator (角色信息验证器)

#### 3.2.1 模块职责

- 验证角色配置的完整性和准确性
- 检查角色配置与用户档案的一致性
- 提供详细的验证报告
- 自动修复角色配置问题
- 生成改进建议

#### 3.2.2 核心方法

##### getInstance()

获取角色信息验证器的单例实例。

```typescript
static getInstance(): CharacterInfoValidator
```

**返回值**：CharacterInfoValidator 实例

##### validateCharacterConfig()

验证角色配置的完整性和准确性。

```typescript
validateCharacterConfig(character: CharacterConfig): ValidationResult
```

**参数**：

- `character`: 角色配置对象

**返回值**：ValidationResult 验证结果对象

**验证项**：

1. **基本信息验证**
   - 必需字段存在性检查
   - 字段类型验证
   - 字段值范围验证

2. **主题配置验证**
   - 主题颜色格式验证
   - 字体配置有效性检查
   - 主题一致性验证

3. **表情配置验证**
   - 表情图片路径有效性
   - 表情触发场景完整性
   - 表情配置一致性

4. **个性配置验证**
   - 个性特征值范围检查
   - 个性配置合理性
   - 个性描述完整性

5. **语音设置验证**
   - 语音配置有效性
   - 语音参数范围检查
   - 语音配置一致性

6. **图片路径验证**
   - 图片文件存在性
   - 图片格式有效性
   - 图片路径正确性

**返回值结构**：

```typescript
interface ValidationResult {
  isValid: boolean                    // 是否通过验证
  errors: ValidationError[]           // 错误列表
  warnings: ValidationWarning[]       // 警告列表
  suggestions: ValidationSuggestion[] // 建议列表
}
```

**示例**：

```typescript
const character = characterManager.getCharacterByGender('female')
const validationResult = characterValidator.validateCharacterConfig(character)

if (validationResult.isValid) {
  console.log('角色配置验证通过')
} else {
  console.error('验证失败:')
  validationResult.errors.forEach(error => {
    console.error(`- ${error.field}: ${error.message}`)
  })
}
```

##### validateChildCharacterConsistency()

验证角色配置与用户档案的一致性。

```typescript
validateChildCharacterConsistency(child: Child, character: CharacterConfig): ValidationResult
```

**参数**：

- `child`: 用户档案信息
- `character`: 角色配置对象

**返回值**：ValidationResult 验证结果对象

**验证项**：

1. 性别一致性检查
2. 姓名同步验证
3. 年龄一致性验证
4. 生日信息一致性检查
5. 星座信息验证

**示例**：

```typescript
const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const character = characterManager.getCharacterForUser(child)
const validationResult = characterValidator.validateChildCharacterConsistency(child, character)

if (!validationResult.isValid) {
  console.warn('角色配置与用户档案不一致')
  validationResult.warnings.forEach(warning => {
    console.warn(`- ${warning.field}: ${warning.message}`)
  })
}
```

##### autoFixCharacterConfig()

自动修复角色配置问题。

```typescript
autoFixCharacterConfig(character: CharacterConfig): CharacterConfig
```

**参数**：

- `character`: 角色配置对象

**返回值**：修复后的角色配置对象

**自动修复项**：

1. **基本信息修复**
   - 添加缺失的必需字段
   - 修正无效的字段值
   - 设置合理的默认值

2. **主题配置修复**
   - 修正无效的颜色值
   - 补充缺失的主题配置
   - 统一主题格式

3. **表情配置修复**
   - 修正无效的表情路径
   - 补充缺失的表情配置
   - 统一表情格式

4. **个性配置修复**
   - 修正超出范围的个性值
   - 补充缺失的个性配置
   - 统一个性格式

5. **语音设置修复**
   - 修正无效的语音参数
   - 补充缺失的语音配置
   - 统一语音格式

6. **图片路径修复**
   - 修正无效的图片路径
   - 统一图片路径格式
   - 添加默认图片

**示例**：

```typescript
const character = characterManager.getCharacterByGender('female')
const fixedCharacter = characterValidator.autoFixCharacterConfig(character)

// 重新验证修复后的配置
const validationResult = characterValidator.validateCharacterConfig(fixedCharacter)
console.log('修复后验证结果:', validationResult.isValid)
```

##### generateValidationReport()

生成详细的验证报告。

```typescript
generateValidationReport(validationResult: ValidationResult): string
```

**参数**：

- `validationResult`: 验证结果对象

**返回值**：格式化的验证报告字符串

**报告格式**：

```
角色配置验证报告
==================

验证状态: 通过/失败

错误 (0):
- 无错误

警告 (0):
- 无警告

建议 (0):
- 无建议
```

**示例**：

```typescript
const character = characterManager.getCharacterByGender('female')
const validationResult = characterValidator.validateCharacterConfig(character)
const report = characterValidator.generateValidationReport(validationResult)

console.log(report)
```

#### 3.2.3 私有方法

##### validateBasicInfo()

验证角色基本信息。

```typescript
private validateBasicInfo(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateThemes()

验证主题配置。

```typescript
private validateThemes(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateExpressions()

验证表情配置。

```typescript
private validateExpressions(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validatePersonality()

验证个性配置。

```typescript
private validatePersonality(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateVoiceSettings()

验证语音设置。

```typescript
private validateVoiceSettings(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

##### validateImagePaths()

验证图片路径。

```typescript
private validateImagePaths(
  character: CharacterConfig,
  errors: ValidationError[],
  warnings: ValidationWarning[],
  suggestions: ValidationSuggestion[]
): void
```

---

## 数据结构

### 4.1 CharacterConfig (角色配置)

```typescript
interface CharacterConfig {
  // 基本信息
  id: string                          // 角色唯一标识
  name: string                        // 角色名称
  defaultName: string                 // 默认名称
  gender: 'male' | 'female'           // 性别
  age: number                         // 年龄
  birthday?: BirthdayInfo             // 生日信息
  zodiac?: string                     // 星座
  
  // 主题配置
  themes: ThemeConfig[]               // 主题配置列表
  currentTheme?: string               // 当前主题ID
  
  // 表情配置
  expressions: ExpressionConfig[]     // 表情配置列表
  
  // 个性配置
  personality: PersonalityConfig      // 个性配置
  
  // 语音设置
  voiceSettings: VoiceSettings        // 语音设置
  
  // 图片路径
  avatarPath: string                  // 头像路径
  images: CharacterImages             // 角色图片集合
  
  // 元数据
  createdAt: Date                     // 创建时间
  updatedAt: Date                     // 更新时间
}
```

### 4.2 BirthdayInfo (生日信息)

```typescript
interface BirthdayInfo {
  lunar: string                       // 农历生日 (格式: "YYYY-MM-DD")
  solar: string                       // 公历生日 (格式: "YYYY-MM-DD")
}
```

### 4.3 ThemeConfig (主题配置)

```typescript
interface ThemeConfig {
  id: string                          // 主题ID
  name: string                        // 主题名称
  description: string                 // 主题描述
  
  // 颜色配置
  colors: {
    primary: string                   // 主色调
    secondary: string                 // 次要色调
    accent: string                    // 强调色
    background: string                // 背景色
    surface: string                   // 表面色
    text: string                      // 文本色
    textSecondary: string             // 次要文本色
  }
  
  // 字体配置
  typography: {
    fontFamily: string                // 字体族
    fontSize: {
      xs: string                      // 超小字号
      sm: string                      // 小字号
      md: string                      // 中等字号
      lg: string                      // 大字号
      xl: string                      // 超大字号
    }
    fontWeight: {
      normal: string                  // 正常字重
      medium: string                  // 中等字重
      bold: string                    // 粗体字重
    }
  }
  
  // 间距配置
  spacing: {
    xs: string                        // 超小间距
    sm: string                        // 小间距
    md: string                        // 中等间距
    lg: string                        // 大间距
    xl: string                        // 超大间距
  }
  
  // 阴影配置
  shadows: {
    sm: string                        // 小阴影
    md: string                        // 中等阴影
    lg: string                        // 大阴影
  }
  
  // 圆角配置
  borderRadius: {
    sm: string                        // 小圆角
    md: string                        // 中等圆角
    lg: string                        // 大圆角
    full: string                      // 完全圆角
  }
}
```

### 4.4 ExpressionConfig (表情配置)

```typescript
interface ExpressionConfig {
  id: string                          // 表情ID
  name: string                        // 表情名称
  trigger: ExpressionTrigger          // 触发场景
  
  // 表情图片
  images: {
    normal: string                    // 正常状态图片
    animated?: string                // 动画图片
    thumbnail?: string               // 缩略图
  }
  
  // 表情描述
  description: string                 // 表情描述
  
  // 使用场景
  contexts: string[]                  // 适用场景列表
  
  // 动画配置
  animation?: {
    duration: number                  // 动画时长 (ms)
    delay?: number                    // 延迟时间 (ms)
    easing?: string                   // 缓动函数
  }
}

type ExpressionTrigger = 
  | 'greeting'                        // 问候
  | 'celebration'                     // 庆祝
  | 'encouragement'                   // 鼓励
  | 'comfort'                         // 安慰
  | 'thinking'                        // 思考
  | 'listening'                       // 聆听
```

### 4.5 PersonalityConfig (个性配置)

```typescript
interface PersonalityConfig {
  // 个性特征值 (0-100)
  traits: {
    friendliness: number              // 友善度
    intelligence: number              // 智力
    creativity: number                // 创造力
    patience: number                  // 耐心
    humor: number                     // 幽默感
    empathy: number                   // 同理心
    curiosity: number                 // 好奇心
    confidence: number                // 自信度
  }
  
  // 个性描述
  description: string                 // 个性描述
  
  // 个性标签
  tags: string[]                      // 个性标签
  
  // 对话风格
  conversationStyle: {
    tone: string                      // 语气
    formality: 'formal' | 'casual' | 'friendly'  // 正式程度
    emojiUsage: 'frequent' | 'moderate' | 'rare' // 表情使用频率
  }
}
```

### 4.6 VoiceSettings (语音设置)

```typescript
interface VoiceSettings {
  // 语音配置
  voice: {
    id: string                        // 语音ID
    name: string                      // 语音名称
    gender: 'male' | 'female' | 'neutral'  // 性别
    language: string                  // 语言
    accent?: string                   // 口音
  }
  
  // 语音参数
  parameters: {
    rate: number                      // 语速 (0.5-2.0)
    pitch: number                     // 音调 (0.5-2.0)
    volume: number                    // 音量 (0.0-1.0)
  }
  
  // 语音效果
  effects?: {
    reverb?: number                   // 混响 (0.0-1.0)
    echo?: number                     // 回声 (0.0-1.0)
  }
}
```

### 4.7 CharacterImages (角色图片集合)

```typescript
interface CharacterImages {
  // 头像图片
  avatar: {
    small: string                     // 小头像
    medium: string                    // 中等头像
    large: string                     // 大头像
  }
  
  // 表情图片
  expressions: {
    [key: string]: string             // 表情ID -> 图片路径
  }
  
  // 场景图片
  scenes: {
    [key: string]: string             // 场景ID -> 图片路径
  }
  
  // 动画图片
  animations: {
    [key: string]: string             // 动画ID -> 图片路径
  }
}
```

### 4.8 ValidationResult (验证结果)

```typescript
interface ValidationResult {
  isValid: boolean                    // 是否通过验证
  errors: ValidationError[]           // 错误列表
  warnings: ValidationWarning[]       // 警告列表
  suggestions: ValidationSuggestion[] // 建议列表
}

interface ValidationError {
  field: string                       // 字段名
  message: string                     // 错误信息
  code?: string                       // 错误代码
  severity: 'critical' | 'high' | 'medium' | 'low'  // 严重程度
}

interface ValidationWarning {
  field: string                       // 字段名
  message: string                     // 警告信息
  code?: string                       // 警告代码
  severity: 'high' | 'medium' | 'low'  // 严重程度
}

interface ValidationSuggestion {
  field: string                       // 字段名
  message: string                     // 建议信息
  code?: string                       // 建议代码
  priority: 'high' | 'medium' | 'low'  // 优先级
}
```

### 4.9 Child (用户档案)

```typescript
interface Child {
  id: string                          // 用户ID
  name: string                        // 用户姓名
  gender: 'male' | 'female' | 'other'  // 性别
  birthday?: Date                     // 生日
  avatar?: string                     // 头像
  createdAt: Date                     // 创建时间
  updatedAt: Date                     // 更新时间
}
```

---

## API接口

### 5.1 角色管理器API

#### 5.1.1 获取角色管理器实例

```typescript
const characterManager = CharacterManager.getInstance()
```

#### 5.1.2 根据性别获取角色配置

```typescript
const character = characterManager.getCharacterByGender('female')
```

**参数**：

- `gender`: 'male' | 'female'

**返回值**：CharacterConfig

**异常**：当找不到对应性别的角色配置时抛出错误

#### 5.1.3 根据用户信息获取个性化角色配置

```typescript
const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const personalizedCharacter = characterManager.getCharacterForUser(child)
```

**参数**：

- `child`: Child | null

**返回值**：CharacterConfig

#### 5.1.4 获取当前角色配置

```typescript
const currentCharacter = characterManager.getCurrentCharacter()
```

**返回值**：CharacterConfig | null

#### 5.1.5 设置当前用户档案

```typescript
characterManager.setCurrentChild(child)
```

**参数**：

- `child`: Child | null

#### 5.1.6 获取当前用户档案

```typescript
const currentChild = characterManager.getCurrentChild()
```

**返回值**：Child | null

#### 5.1.7 更新角色配置

```typescript
characterManager.updateCharacter({
  name: '新名称',
  age: 6
})
```

**参数**：

- `updates`: Partial<CharacterConfig>

#### 5.1.8 获取主题配置

```typescript
const theme = characterManager.getTheme()
```

**返回值**：ThemeConfig

#### 5.1.9 根据触发场景获取表情配置

```typescript
const expression = characterManager.getExpression('greeting')
```

**参数**：

- `trigger`: ExpressionTrigger

**返回值**：ExpressionConfig

### 5.2 验证器API

#### 5.2.1 获取验证器实例

```typescript
const characterValidator = CharacterInfoValidator.getInstance()
```

#### 5.2.2 验证角色配置

```typescript
const validationResult = characterValidator.validateCharacterConfig(character)
```

**参数**：

- `character`: CharacterConfig

**返回值**：ValidationResult

#### 5.2.3 验证角色配置与用户档案的一致性

```typescript
const validationResult = characterValidator.validateChildCharacterConsistency(child, character)
```

**参数**：

- `child`: Child
- `character`: CharacterConfig

**返回值**：ValidationResult

#### 5.2.4 自动修复角色配置

```typescript
const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
```

**参数**：

- `character`: CharacterConfig

**返回值**：CharacterConfig

#### 5.2.5 生成验证报告

```typescript
const report = characterValidator.generateValidationReport(validationResult)
```

**参数**：

- `validationResult`: ValidationResult

**返回值**：string

---

## UI组件

### 6.1 RoleInfoManager (角色信息管理器组件)

#### 6.1.1 组件概述

RoleInfoManager 是角色信息管理的UI组件，提供角色信息的展示、编辑、验证和同步功能。

#### 6.1.2 组件属性

```typescript
interface RoleInfoManagerProps {
  child?: Child | null               // 用户档案信息
  onSave?: (data: Partial<Child>) => Promise<void>  // 保存回调
  onCancel?: () => void              // 取消回调
}
```

#### 6.1.3 组件状态

```typescript
const [character, setCharacter] = useState<CharacterConfig | null>(null)
const [isEditing, setIsEditing] = useState(false)
const [formData, setFormData] = useState<Partial<Child>>({})
const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
const [showValidation, setShowValidation] = useState(false)
const [isLoading, setIsLoading] = useState(false)
```

#### 6.1.4 核心功能

##### 角色信息展示

展示当前角色的基本信息、主题配置、表情配置和个性配置。

```typescript
{character && (
  <div className="character-info">
    <div className="character-avatar">
      <img src={character.avatarPath} alt={character.name} />
    </div>
    <div className="character-details">
      <h2>{character.name}</h2>
      <p>性别: {character.gender === 'male' ? '男' : '女'}</p>
      <p>年龄: {character.age}岁</p>
      {character.zodiac && <p>星座: {character.zodiac}</p>}
    </div>
  </div>
)}
```

##### 编辑模式

提供表单编辑用户档案信息，包括姓名、性别和生日。

```typescript
{isEditing && (
  <form onSubmit={handleSave}>
    <div className="form-group">
      <label>姓名</label>
      <input
        type="text"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      {validationErrors.name && (
        <span className="error">{validationErrors.name}</span>
      )}
    </div>
    
    <div className="form-group">
      <label>性别</label>
      <select
        value={formData.gender || 'female'}
        onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
      >
        <option value="male">男</option>
        <option value="female">女</option>
      </select>
    </div>
    
    <div className="form-group">
      <label>生日</label>
      <input
        type="date"
        value={formData.birthday ? formData.birthday.toISOString().split('T')[0] : ''}
        onChange={(e) => setFormData({ ...formData, birthday: e.target.value ? new Date(e.target.value) : undefined })}
      />
    </div>
    
    <div className="form-actions">
      <button type="submit" disabled={isLoading}>保存</button>
      <button type="button" onClick={handleCancel}>取消</button>
    </div>
  </form>
)}
```

##### 验证结果展示

展示角色配置的验证结果，包括错误、警告和建议。

```typescript
{showValidation && validationResult && (
  <div className="validation-result">
    <h3>验证结果</h3>
    
    {validationResult.errors.length > 0 && (
      <div className="validation-errors">
        <h4>错误 ({validationResult.errors.length})</h4>
        <ul>
          {validationResult.errors.map((error, index) => (
            <li key={index} className="error">
              <strong>{error.field}:</strong> {error.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.warnings.length > 0 && (
      <div className="validation-warnings">
        <h4>警告 ({validationResult.warnings.length})</h4>
        <ul>
          {validationResult.warnings.map((warning, index) => (
            <li key={index} className="warning">
              <strong>{warning.field}:</strong> {warning.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.suggestions.length > 0 && (
      <div className="validation-suggestions">
        <h4>建议 ({validationResult.suggestions.length})</h4>
        <ul>
          {validationResult.suggestions.map((suggestion, index) => (
            <li key={index} className="suggestion">
              <strong>{suggestion.field}:</strong> {suggestion.message}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
```

##### 自动修复功能

提供一键自动修复角色配置问题的功能。

```typescript
<button onClick={handleAutoFix} className="auto-fix-button">
  自动修复
</button>

const handleAutoFix = () => {
  if (!character) return
  
  const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
  setCharacter(fixedCharacter)
  
  // 重新验证
  const validation = characterValidator.validateCharacterConfig(fixedCharacter)
  setValidationResult(validation)
}
```

#### 6.1.5 事件处理

##### 保存处理

```typescript
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // 验证表单数据
  const errors = validateFormData(formData)
  if (Object.keys(errors).length > 0) {
    setValidationErrors(errors)
    return
  }
  
  setIsLoading(true)
  
  try {
    if (onSave) {
      await onSave(formData)
    }
    
    // 更新角色配置
    if (formData.name || formData.gender || formData.birthday) {
      const updatedChild = { ...child, ...formData }
      characterManager.setCurrentChild(updatedChild)
      const updatedCharacter = characterManager.getCharacterForUser(updatedChild)
      setCharacter(updatedCharacter)
    }
    
    setIsEditing(false)
    setValidationErrors({})
  } catch (error) {
    console.error('保存失败:', error)
  } finally {
    setIsLoading(false)
  }
}
```

##### 取消处理

```typescript
const handleCancel = () => {
  setIsEditing(false)
  setFormData(child ? {
    id: child.id,
    name: child.name || "",
    gender: child.gender || "female",
    birthday: child.birthday
  } : {})
  setValidationErrors({})
}
```

##### 验证处理

```typescript
const handleValidate = () => {
  if (!character) return
  
  const validation = characterValidator.validateCharacterConfig(character)
  setValidationResult(validation)
  setShowValidation(true)
}
```

#### 6.1.6 使用示例

```typescript
import RoleInfoManager from '@/components/character/RoleInfoManager'

function ProfilePage() {
  const [child, setChild] = useState<Child | null>(null)
  
  const handleSave = async (data: Partial<Child>) => {
    // 保存用户档案
    await updateChildProfile(data)
    setChild({ ...child, ...data })
  }
  
  return (
    <div className="profile-page">
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

---

## 验证机制

### 7.1 验证级别

角色信息验证器提供三个验证级别：

#### 7.1.1 错误 (Errors)

**定义**：必须修复的严重问题，会导致系统功能异常。

**示例**：

- 缺少必需字段
- 字段类型不匹配
- 字段值超出有效范围
- 图片文件不存在

**处理方式**：必须修复后才能继续使用。

#### 7.1.2 警告 (Warnings)

**定义**：建议修复的问题，不影响基本功能，但可能导致体验下降。

**示例**：

- 角色配置与用户档案不一致
- 主题配置不完整
- 表情配置缺失
- 个性特征值异常

**处理方式**：建议修复，但不强制要求。

#### 7.1.3 建议 (Suggestions)

**定义**：优化建议，可以提升用户体验或系统性能。

**示例**：

- 建议使用更合适的主题颜色
- 建议添加更多表情配置
- 建议调整语音参数
- 建议优化个性特征值

**处理方式**：可选修复，根据实际需求决定。

### 7.2 验证流程

```
角色配置输入
      ↓
基本信息验证
      ↓
主题配置验证
      ↓
表情配置验证
      ↓
个性配置验证
      ↓
语音设置验证
      ↓
图片路径验证
      ↓
生成验证结果
      ↓
显示验证报告
```

### 7.3 验证规则

#### 7.3.1 基本信息验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| id | 必须存在且非空 | Error |
| name | 必须存在且长度1-50 | Error |
| defaultName | 必须存在且长度1-50 | Error |
| gender | 必须是 'male' 或 'female' | Error |
| age | 必须是正整数且0-18 | Error |
| birthday | 格式必须为 YYYY-MM-DD | Warning |
| zodiac | 必须是有效的星座名称 | Warning |

#### 7.3.2 主题配置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| themes | 必须至少包含一个主题 | Error |
| themes[].id | 必须唯一且非空 | Error |
| themes[].colors | 必须包含所有必需颜色 | Error |
| themes[].colors.* | 必须是有效的颜色值 | Error |
| currentTheme | 必须是有效的主题ID | Warning |

#### 7.3.3 表情配置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| expressions | 必须至少包含一个表情 | Error |
| expressions[].id | 必须唯一且非空 | Error |
| expressions[].trigger | 必须是有效的触发场景 | Error |
| expressions[].images | 必须包含正常状态图片 | Error |
| expressions[].images.* | 图片文件必须存在 | Error |

#### 7.3.4 个性配置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| personality.traits | 必须包含所有个性特征 | Error |
| personality.traits.* | 值必须在0-100之间 | Error |
| personality.description | 长度建议10-200 | Suggestion |
| personality.tags | 建议包含3-5个标签 | Suggestion |

#### 7.3.5 语音设置验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| voiceSettings.voice.id | 必须存在且非空 | Error |
| voiceSettings.voice.gender | 必须是 'male'、'female' 或 'neutral' | Error |
| voiceSettings.parameters.rate | 必须在0.5-2.0之间 | Error |
| voiceSettings.parameters.pitch | 必须在0.5-2.0之间 | Error |
| voiceSettings.parameters.volume | 必须在0.0-1.0之间 | Error |

#### 7.3.6 图片路径验证规则

| 字段 | 验证规则 | 错误级别 |
|------|----------|----------|
| avatarPath | 图片文件必须存在 | Error |
| images.avatar.* | 图片文件必须存在 | Error |
| images.expressions.* | 图片文件必须存在 | Error |
| images.scenes.* | 图片文件必须存在 | Warning |

### 7.4 自动修复机制

#### 7.4.1 修复策略

自动修复机制采用以下策略：

1. **必需字段修复**：为缺失的必需字段添加默认值
2. **类型修复**：将无效的字段值转换为有效类型
3. **范围修复**：将超出范围的值调整到有效范围内
4. **路径修复**：修正无效的文件路径
5. **一致性修复**：确保相关字段之间的一致性

#### 7.4.2 修复示例

```typescript
// 原始配置（有问题）
const invalidCharacter = {
  id: '',                          // 缺少ID
  name: '',                        // 缺少名称
  gender: 'unknown',               // 无效的性别
  age: -1,                         // 无效的年龄
  themes: [],                      // 缺少主题
  expressions: [],                 // 缺少表情
  personality: {
    traits: {
      friendliness: 150,           // 超出范围
      intelligence: -10            // 超出范围
    }
  }
}

// 自动修复后
const fixedCharacter = characterValidator.autoFixCharacterConfig(invalidCharacter)

// 修复结果
{
  id: 'character_1234567890',      // 自动生成ID
  name: '默认角色',                 // 使用默认名称
  gender: 'female',                // 修正为默认性别
  age: 1,                          // 修正为默认年龄
  themes: [/* 默认主题 */],        // 添加默认主题
  expressions: [/* 默认表情 */],    // 添加默认表情
  personality: {
    traits: {
      friendliness: 100,           // 修正为最大值
      intelligence: 0              // 修正为最小值
    }
  }
}
```

---

## 集成指南

### 8.1 基础集成

#### 8.1.1 安装依赖

角色信息管理器依赖以下库：

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "typescript": "^5.0.0"
  }
}
```

#### 8.1.2 导入模块

```typescript
// 导入角色管理器
import { CharacterManager } from '@/lib/character-manager'

// 导入角色信息验证器
import { CharacterInfoValidator } from '@/lib/character-validator'

// 导入UI组件
import RoleInfoManager from '@/components/character/RoleInfoManager'
```

### 8.2 在页面中使用

#### 8.2.1 个人信息页面

```typescript
'use client'

import { useState, useEffect } from 'react'
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'
import RoleInfoManager from '@/components/character/RoleInfoManager'

export default function ProfilePage() {
  const [child, setChild] = useState<Child | null>(null)
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  
  useEffect(() => {
    // 获取角色管理器实例
    const characterManager = CharacterManager.getInstance()
    
    // 获取当前用户档案
    const currentChild = characterManager.getCurrentChild()
    setChild(currentChild)
    
    // 获取当前角色配置
    const currentCharacter = characterManager.getCurrentCharacter()
    setCharacter(currentCharacter)
  }, [])
  
  const handleSave = async (data: Partial<Child>) => {
    // 保存用户档案
    await updateChildProfile(data)
    
    // 更新角色配置
    const characterManager = CharacterManager.getInstance()
    const updatedChild = { ...child, ...data }
    characterManager.setCurrentChild(updatedChild)
    const updatedCharacter = characterManager.getCharacterForUser(updatedChild)
    setCharacter(updatedCharacter)
    setChild(updatedChild)
  }
  
  return (
    <div className="profile-page">
      <h1>个人信息</h1>
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

#### 8.2.2 设置页面

```typescript
'use client'

import { useState, useEffect } from 'react'
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'

export default function SettingsPage() {
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  
  useEffect(() => {
    const characterManager = CharacterManager.getInstance()
    const currentCharacter = characterManager.getCurrentCharacter()
    setCharacter(currentCharacter)
  }, [])
  
  const handleValidate = () => {
    if (!character) return
    
    const characterValidator = CharacterInfoValidator.getInstance()
    const validation = characterValidator.validateCharacterConfig(character)
    setValidationResult(validation)
  }
  
  const handleAutoFix = () => {
    if (!character) return
    
    const characterValidator = CharacterInfoValidator.getInstance()
    const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
    
    const characterManager = CharacterManager.getInstance()
    characterManager.updateCharacter(fixedCharacter)
    setCharacter(fixedCharacter)
    
    // 重新验证
    const validation = characterValidator.validateCharacterConfig(fixedCharacter)
    setValidationResult(validation)
  }
  
  return (
    <div className="settings-page">
      <h1>角色设置</h1>
      
      <div className="settings-actions">
        <button onClick={handleValidate}>验证配置</button>
        <button onClick={handleAutoFix}>自动修复</button>
      </div>
      
      {validationResult && (
        <div className="validation-result">
          <h2>验证结果</h2>
          {/* 显示验证结果 */}
        </div>
      )}
    </div>
  )
}
```

### 8.3 与AI角色系统集成

#### 8.3.1 获取角色信息

```typescript
import { CharacterManager } from '@/lib/character-manager'

export function getAICharacterInfo() {
  const characterManager = CharacterManager.getInstance()
  const character = characterManager.getCurrentCharacter()
  
  if (!character) {
    throw new Error('未找到角色配置')
  }
  
  return {
    name: character.name,
    gender: character.gender,
    age: character.age,
    personality: character.personality,
    voiceSettings: character.voiceSettings
  }
}
```

#### 8.3.2 根据场景获取表情

```typescript
import { CharacterManager } from '@/lib/character-manager'

export function getExpressionForTrigger(trigger: ExpressionTrigger) {
  const characterManager = CharacterManager.getInstance()
  const expression = characterManager.getExpression(trigger)
  
  return expression.images.normal
}
```

#### 8.3.3 获取主题配置

```typescript
import { CharacterManager } from '@/lib/character-manager'

export function getThemeConfig() {
  const characterManager = CharacterManager.getInstance()
  const theme = characterManager.getTheme()
  
  return theme
}
```

### 8.4 与用户档案系统集成

#### 8.4.1 初始化角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'

export async function initializeCharacterForChild(child: Child) {
  const characterManager = CharacterManager.getInstance()
  
  // 设置当前用户档案
  characterManager.setCurrentChild(child)
  
  // 获取个性化角色配置
  const character = characterManager.getCharacterForUser(child)
  
  // 验证角色配置
  const characterValidator = CharacterInfoValidator.getInstance()
  const validation = characterValidator.validateChildCharacterConsistency(child, character)
  
  if (!validation.isValid) {
    console.warn('角色配置验证失败:', validation.errors)
  }
  
  return character
}
```

#### 8.4.2 更新用户档案

```typescript
import { CharacterManager } from '@/lib/character-manager'

export async function updateChildProfile(child: Child) {
  // 保存用户档案到数据库
  await saveChildToDatabase(child)
  
  // 更新角色配置
  const characterManager = CharacterManager.getInstance()
  characterManager.setCurrentChild(child)
  
  // 获取更新后的角色配置
  const character = characterManager.getCharacterForUser(child)
  
  return character
}
```

---

## 使用示例

### 9.1 基础使用

#### 9.1.1 获取角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'

// 获取角色管理器实例
const characterManager = CharacterManager.getInstance()

// 获取女性角色配置
const femaleCharacter = characterManager.getCharacterByGender('female')

console.log('角色名称:', femaleCharacter.name)
console.log('角色年龄:', femaleCharacter.age)
console.log('角色性别:', femaleCharacter.gender)
```

#### 9.1.2 根据用户信息获取个性化角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'

const characterManager = CharacterManager.getInstance()

const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const personalizedCharacter = characterManager.getCharacterForUser(child)

console.log('个性化角色名称:', personalizedCharacter.name)  // 输出: 小明
console.log('角色年龄:', personalizedCharacter.age)          // 输出: 6
console.log('角色星座:', personalizedCharacter.zodiac)       // 输出: 金牛座
```

### 9.2 验证使用

#### 9.2.1 验证角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'

const characterManager = CharacterManager.getInstance()
const characterValidator = CharacterInfoValidator.getInstance()

// 获取角色配置
const character = characterManager.getCharacterByGender('female')

// 验证角色配置
const validationResult = characterValidator.validateCharacterConfig(character)

// 检查验证结果
if (validationResult.isValid) {
  console.log('角色配置验证通过')
} else {
  console.error('角色配置验证失败:')
  validationResult.errors.forEach(error => {
    console.error(`- ${error.field}: ${error.message}`)
  })
}

// 显示警告
if (validationResult.warnings.length > 0) {
  console.warn('警告:')
  validationResult.warnings.forEach(warning => {
    console.warn(`- ${warning.field}: ${warning.message}`)
  })
}

// 显示建议
if (validationResult.suggestions.length > 0) {
  console.info('建议:')
  validationResult.suggestions.forEach(suggestion => {
    console.info(`- ${suggestion.field}: ${suggestion.message}`)
  })
}
```

#### 9.2.2 验证角色配置与用户档案的一致性

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'

const characterManager = CharacterManager.getInstance()
const characterValidator = CharacterInfoValidator.getInstance()

const child = {
  id: 'child-001',
  name: '小明',
  gender: 'male',
  birthday: new Date('2018-05-15')
}

const character = characterManager.getCharacterForUser(child)

// 验证一致性
const validationResult = characterValidator.validateChildCharacterConsistency(child, character)

if (!validationResult.isValid) {
  console.error('角色配置与用户档案不一致:')
  validationResult.errors.forEach(error => {
    console.error(`- ${error.field}: ${error.message}`)
  })
}
```

### 9.3 自动修复使用

#### 9.3.1 自动修复角色配置

```typescript
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'

const characterManager = CharacterManager.getInstance()
const characterValidator = CharacterInfoValidator.getInstance()

// 获取角色配置
const character = characterManager.getCharacterByGender('female')

// 自动修复
const fixedCharacter = characterValidator.autoFixCharacterConfig(character)

// 重新验证
const validationResult = characterValidator.validateCharacterConfig(fixedCharacter)

if (validationResult.isValid) {
  console.log('修复成功，角色配置验证通过')
  
  // 更新角色配置
  characterManager.updateCharacter(fixedCharacter)
} else {
  console.error('修复失败，仍有错误:')
  validationResult.errors.forEach(error => {
    console.error(`- ${error.field}: ${error.message}`)
  })
}
```

### 9.4 UI组件使用

#### 9.4.1 基础使用

```typescript
import RoleInfoManager from '@/components/character/RoleInfoManager'

export default function ProfilePage() {
  const child = {
    id: 'child-001',
    name: '小明',
    gender: 'male',
    birthday: new Date('2018-05-15')
  }
  
  const handleSave = async (data: Partial<Child>) => {
    console.log('保存数据:', data)
    // 保存逻辑...
  }
  
  return (
    <div className="profile-page">
      <h1>个人信息</h1>
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

#### 9.4.2 高级使用

```typescript
'use client'

import { useState, useEffect } from 'react'
import { CharacterManager } from '@/lib/character-manager'
import { CharacterInfoValidator } from '@/lib/character-validator'
import RoleInfoManager from '@/components/character/RoleInfoManager'

export default function AdvancedProfilePage() {
  const [child, setChild] = useState<Child | null>(null)
  const [character, setCharacter] = useState<CharacterConfig | null>(null)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  
  useEffect(() => {
    const characterManager = CharacterManager.getInstance()
    const currentChild = characterManager.getCurrentChild()
    setChild(currentChild)
    
    const currentCharacter = characterManager.getCurrentCharacter()
    setCharacter(currentCharacter)
    
    // 自动验证
    if (currentCharacter) {
      const characterValidator = CharacterInfoValidator.getInstance()
      const validation = characterValidator.validateCharacterConfig(currentCharacter)
      setValidationResult(validation)
    }
  }, [])
  
  const handleSave = async (data: Partial<Child>) => {
    // 保存用户档案
    await updateChildProfile(data)
    
    // 更新角色配置
    const characterManager = CharacterManager.getInstance()
    const updatedChild = { ...child, ...data }
    characterManager.setCurrentChild(updatedChild)
    const updatedCharacter = characterManager.getCharacterForUser(updatedChild)
    setCharacter(updatedCharacter)
    setChild(updatedChild)
    
    // 重新验证
    const characterValidator = CharacterInfoValidator.getInstance()
    const validation = characterValidator.validateCharacterConfig(updatedCharacter)
    setValidationResult(validation)
  }
  
  const handleAutoFix = () => {
    if (!character) return
    
    const characterValidator = CharacterInfoValidator.getInstance()
    const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
    
    const characterManager = CharacterManager.getInstance()
    characterManager.updateCharacter(fixedCharacter)
    setCharacter(fixedCharacter)
    
    // 重新验证
    const validation = characterValidator.validateCharacterConfig(fixedCharacter)
    setValidationResult(validation)
  }
  
  return (
    <div className="advanced-profile-page">
      <h1>个人信息管理</h1>
      
      <div className="page-actions">
        <button onClick={handleAutoFix}>自动修复</button>
      </div>
      
      {validationResult && (
        <div className="validation-summary">
          <h2>验证摘要</h2>
          <p>状态: {validationResult.isValid ? '通过' : '失败'}</p>
          <p>错误: {validationResult.errors.length}</p>
          <p>警告: {validationResult.warnings.length}</p>
          <p>建议: {validationResult.suggestions.length}</p>
        </div>
      )}
      
      <RoleInfoManager
        child={child}
        onSave={handleSave}
      />
    </div>
  )
}
```

---

## 最佳实践

### 10.1 性能优化

#### 10.1.1 缓存角色配置

角色管理器内置缓存机制，避免重复计算和加载。

```typescript
// 获取角色管理器实例（单例）
const characterManager = CharacterManager.getInstance()

// 角色配置会被缓存，多次调用不会重复计算
const character1 = characterManager.getCharacterByGender('female')
const character2 = characterManager.getCharacterByGender('female')
// character1 === character2 (引用相同)
```

#### 10.1.2 延迟初始化

角色管理器采用延迟初始化，只在第一次使用时才创建实例。

```typescript
// 角色管理器不会立即初始化
const characterManager = CharacterManager.getInstance()

// 第一次调用时才初始化
const character = characterManager.getCharacterByGender('female')
```

#### 10.1.3 避免频繁验证

验证操作可能比较耗时，建议在关键时刻进行验证，而不是每次更新都验证。

```typescript
// 不推荐：每次更新都验证
function updateCharacter(updates: Partial<CharacterConfig>) {
  const updatedCharacter = { ...character, ...updates }
  const validationResult = characterValidator.validateCharacterConfig(updatedCharacter)
  // ...
}

// 推荐：只在关键时刻验证
function updateCharacter(updates: Partial<CharacterConfig>) {
  const updatedCharacter = { ...character, ...updates }
  setCharacter(updatedCharacter)
}

function saveCharacter() {
  const validationResult = characterValidator.validateCharacterConfig(character)
  if (validationResult.isValid) {
    // 保存角色配置
  }
}
```

### 10.2 错误处理

#### 10.2.1 捕获异常

角色管理器的方法可能会抛出异常，建议使用 try-catch 捕获。

```typescript
try {
  const character = characterManager.getCharacterByGender('female')
} catch (error) {
  console.error('获取角色配置失败:', error)
  // 处理错误，例如显示错误消息或使用默认配置
}
```

#### 10.2.2 验证结果检查

在使用角色配置之前，建议先验证配置的有效性。

```typescript
const character = characterManager.getCharacterByGender('female')
const validationResult = characterValidator.validateCharacterConfig(character)

if (!validationResult.isValid) {
  console.error('角色配置无效:', validationResult.errors)
  // 处理错误，例如自动修复或使用默认配置
  const fixedCharacter = characterValidator.autoFixCharacterConfig(character)
  return fixedCharacter
}

return character
```

### 10.3 数据同步

#### 10.3.1 用户档案更新后同步角色配置

当用户档案更新后，需要同步更新角色配置。

```typescript
async function updateChildProfile(child: Child) {
  // 保存用户档案
  await saveChildToDatabase(child)
  
  // 同步更新角色配置
  const characterManager = CharacterManager.getInstance()
  characterManager.setCurrentChild(child)
  
  // 获取更新后的角色配置
  const updatedCharacter = characterManager.getCharacterForUser(child)
  
  return updatedCharacter
}
```

#### 10.3.2 角色配置更新后验证一致性

角色配置更新后，建议验证与用户档案的一致性。

```typescript
function updateCharacter(updates: Partial<CharacterConfig>) {
  const updatedCharacter = { ...character, ...updates }
  
  // 更新角色配置
  characterManager.updateCharacter(updatedCharacter)
  
  // 验证与用户档案的一致性
  const child = characterManager.getCurrentChild()
  if (child) {
    const validationResult = characterValidator.validateChildCharacterConsistency(
      child,
      updatedCharacter
    )
    
    if (!validationResult.isValid) {
      console.warn('角色配置与用户档案不一致:', validationResult.warnings)
    }
  }
}
```

### 10.4 用户体验

#### 10.4.1 提供自动修复选项

当角色配置存在问题时，提供自动修复选项，提升用户体验。

```typescript
if (!validationResult.isValid) {
  return (
    <div className="validation-error">
      <p>角色配置存在问题</p>
      <button onClick={handleAutoFix}>自动修复</button>
    </div>
  )
}
```

#### 10.4.2 显示详细的验证结果

提供详细的验证结果，帮助用户了解问题所在。

```typescript
{validationResult && (
  <div className="validation-result">
    {validationResult.errors.length > 0 && (
      <div className="validation-errors">
        <h3>错误 ({validationResult.errors.length})</h3>
        <ul>
          {validationResult.errors.map((error, index) => (
            <li key={index}>
              <strong>{error.field}:</strong> {error.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.warnings.length > 0 && (
      <div className="validation-warnings">
        <h3>警告 ({validationResult.warnings.length})</h3>
        <ul>
          {validationResult.warnings.map((warning, index) => (
            <li key={index}>
              <strong>{warning.field}:</strong> {warning.message}
            </li>
          ))}
        </ul>
      </div>
    )}
    
    {validationResult.suggestions.length > 0 && (
      <div className="validation-suggestions">
        <h3>建议 ({validationResult.suggestions.length})</h3>
        <ul>
          {validationResult.suggestions.map((suggestion, index) => (
            <li key={index}>
              <strong>{suggestion.field}:</strong> {suggestion.message}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)}
```

### 10.5 安全性

#### 10.5.1 输入验证

在保存用户输入之前，进行严格的输入验证。

```typescript
function validateFormData(formData: Partial<Child>): Record<string, string> {
  const errors: Record<string, string> = {}
  
  if (!formData.name || formData.name.trim().length === 0) {
    errors.name = '姓名不能为空'
  }
  
  if (formData.name && formData.name.length > 50) {
    errors.name = '姓名长度不能超过50个字符'
  }
  
  if (!formData.gender) {
    errors.gender = '性别不能为空'
  }
  
  return errors
}
```

#### 10.5.2 数据清理

在保存数据之前，清理和格式化数据。

```typescript
function sanitizeFormData(formData: Partial<Child>): Partial<Child> {
  const sanitized: Partial<Child> = {}
  
  if (formData.name) {
    sanitized.name = formData.name.trim()
  }
  
  if (formData.gender) {
    sanitized.gender = formData.gender
  }
  
  if (formData.birthday) {
    sanitized.birthday = new Date(formData.birthday)
  }
  
  return sanitized
}
```

---

## 附录

### A. 错误代码

| 错误代码 | 描述 | 严重程度 |
|----------|------|----------|
| ERR_001 | 缺少必需字段 | Critical |
| ERR_002 | 字段类型不匹配 | Critical |
| ERR_003 | 字段值超出范围 | Critical |
| ERR_004 | 图片文件不存在 | Critical |
| ERR_005 | 主题配置无效 | High |
| ERR_006 | 表情配置无效 | High |
| ERR_007 | 个性配置无效 | High |
| ERR_008 | 语音配置无效 | High |
| WARN_001 | 角色配置与用户档案不一致 | Medium |
| WARN_002 | 主题配置不完整 | Medium |
| WARN_003 | 表情配置缺失 | Medium |
| WARN_004 | 个性特征值异常 | Medium |
| SUGG_001 | 建议使用更合适的主题颜色 | Low |
| SUGG_002 | 建议添加更多表情配置 | Low |
| SUGG_003 | 建议调整语音参数 | Low |
| SUGG_004 | 建议优化个性特征值 | Low |

### B. 星座计算

| 日期范围 | 星座 |
|----------|------|
| 1月1日 - 1月19日 | 摩羯座 |
| 1月20日 - 2月18日 | 水瓶座 |
| 2月19日 - 3月20日 | 双鱼座 |
| 3月21日 - 4月19日 | 白羊座 |
| 4月20日 - 5月20日 | 金牛座 |
| 5月21日 - 6月21日 | 双子座 |
| 6月22日 - 7月22日 | 巨蟹座 |
| 7月23日 - 8月22日 | 狮子座 |
| 8月23日 - 9月22日 | 处女座 |
| 9月23日 - 10月23日 | 天秤座 |
| 10月24日 - 11月22日 | 天蝎座 |
| 11月23日 - 12月21日 | 射手座 |
| 12月22日 - 12月31日 | 摩羯座 |

### C. 相关文档

- [YYC3-XY-架构类-UI-UX全量设计体系整合文档.md](./YYC3-XY-架构类-UI-UX全量设计体系整合文档.md)
- [YYC3-XY-AI角色与浮窗系统设计衔接方案.md](./YYC3-XY-AI角色与浮窗系统设计衔接方案.md)
- [YYC3-XY-项目页面清单文档.md](./YYC3-XY-项目页面清单文档.md)

### D. 更新日志

#### v1.0.0 (2025-01-30)

- 初始版本发布
- 实现角色管理器核心功能
- 实现角色信息验证器
- 实现角色信息管理器UI组件
- 提供完整的API接口文档
- 提供详细的使用示例
- 提供最佳实践指南

---

<div align="center">

> 「***智能插拔式移动AI系统***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」
> **GitHub**: <https://github.com/YYC-Cube/yyc3_xiaoyu_ai> | **官网**: <https://yyc3.ai>

</div>
