/**
 * CharacterInfoValidator - 角色信息验证器
 * 负责验证角色配置的完整性和准确性，提供自动修复功能
 * 
 * @author YYC³
 * @version 1.0.0
 */

import type { CharacterConfig, Child, ThemeConfig, ExpressionConfig, PersonalityConfig, VoiceSettings, CharacterImages } from '../../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
}

export interface ValidationSuggestion {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export class CharacterInfoValidator {
  private static instance: CharacterInfoValidator;

  private constructor() {}

  /**
   * 获取验证器单例实例
   */
  static getInstance(): CharacterInfoValidator {
    if (!CharacterInfoValidator.instance) {
      CharacterInfoValidator.instance = new CharacterInfoValidator();
    }
    return CharacterInfoValidator.instance;
  }

  /**
   * 验证角色配置的完整性和准确性
   */
  validateCharacterConfig(character: CharacterConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    this.validateBasicInfo(character, errors, warnings, suggestions);
    this.validateThemes(character, errors, warnings, suggestions);
    this.validateExpressions(character, errors, warnings, suggestions);
    this.validatePersonality(character, errors, warnings, suggestions);
    this.validateVoiceSettings(character, errors, warnings, suggestions);
    this.validateImagePaths(character, errors, warnings, suggestions);

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * 验证角色配置与用户档案的一致性
   */
  validateChildCharacterConsistency(child: Child, character: CharacterConfig): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const suggestions: ValidationSuggestion[] = [];

    // 1. 性别一致性检查
    if (child.gender !== character.gender && (child.gender === 'male' || child.gender === 'female')) {
      warnings.push({
        field: 'gender',
        message: `用户性别 (${child.gender}) 与角色性别 (${character.gender}) 不一致`
      });
      suggestions.push({
        field: 'gender',
        message: '建议重新生成适合该性别的角色配置'
      });
    }

    // 2. 姓名同步验证
    if (child.name && character.name !== child.name) {
      warnings.push({
        field: 'name',
        message: `用户姓名 (${child.name}) 与角色名称 (${character.name}) 不一致`
      });
    }

    // 3. 年龄一致性验证
    if (child.birthday) {
      const today = new Date();
      const birthDate = new Date(child.birthday);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      calculatedAge = Math.max(0, calculatedAge);

      if (Math.abs(calculatedAge - character.age) > 1) {
        warnings.push({
          field: 'age',
          message: `根据生日计算的年龄 (${calculatedAge}) 与角色年龄 (${character.age}) 差异较大`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    };
  }

  /**
   * 自动修复角色配置问题
   */
  autoFixCharacterConfig(character: CharacterConfig): CharacterConfig {
    const fixed = JSON.parse(JSON.stringify(character)) as CharacterConfig;

    // 1. 基本信息修复
    if (!fixed.defaultName) fixed.defaultName = fixed.name || '未命名';
    if (!fixed.name) fixed.name = fixed.defaultName;
    if (fixed.age < 0) fixed.age = 1;
    
    // 2. 主题配置修复
    if (!fixed.themes || fixed.themes.length === 0) {
        // 添加默认主题
        fixed.themes = [{
            id: 'default',
            name: '默认主题',
            description: '自动生成的默认主题',
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
        }];
    }
    if (!fixed.currentTheme) fixed.currentTheme = fixed.themes[0].id;

    // 3. 表情配置修复
    // 确保有基本的表情配置
    const requiredTriggers = ['greeting', 'celebration', 'encouragement', 'comfort', 'thinking', 'listening'];
    if (!fixed.expressions) fixed.expressions = [];
    
    requiredTriggers.forEach(trigger => {
        if (!fixed.expressions.find(e => e.trigger === trigger)) {
            // 如果缺失，尝试使用现有的第一个表情，或者创建一个占位
            const fallback = fixed.expressions[0] || {
                id: `default-${trigger}`,
                name: trigger,
                trigger: trigger,
                imagePath: '/placeholder.svg',
                description: `Default ${trigger} expression`
            };
            fixed.expressions.push({
                ...fallback,
                id: `${trigger}-autofix`,
                trigger: trigger as any,
                name: trigger
            });
        }
    });

    // 4. 图片路径修复
    if (!fixed.avatarPath) fixed.avatarPath = '/placeholder-user.jpg';
    if (!fixed.images) {
        fixed.images = {
            homePage: '/placeholder.svg',
            growthRecord: '/placeholder.svg',
            profileInfo: '/placeholder.svg',
            settings: '/placeholder.svg',
            aiAvatar: fixed.avatarPath,
            jointAvatar: '/placeholder.svg',
            additionalImages: []
        };
    }
    // 确保所有必需的图片字段都有值
    const imageKeys: (keyof CharacterImages)[] = ['homePage', 'growthRecord', 'profileInfo', 'settings', 'aiAvatar', 'jointAvatar'];
    imageKeys.forEach(key => {
        if (!fixed.images[key]) {
            fixed.images[key] = '/placeholder.svg';
        }
    });

    return fixed;
  }

  /**
   * 生成详细的验证报告
   */
  generateValidationReport(result: ValidationResult): string {
    let report = '角色配置验证报告\n==================\n\n';
    report += `验证状态: ${result.isValid ? '通过' : '失败'}\n\n`;

    report += `错误 (${result.errors.length}):\n`;
    if (result.errors.length === 0) {
      report += '- 无错误\n';
    } else {
      result.errors.forEach(err => report += `- ${err.field}: ${err.message}\n`);
    }
    report += '\n';

    report += `警告 (${result.warnings.length}):\n`;
    if (result.warnings.length === 0) {
      report += '- 无警告\n';
    } else {
      result.warnings.forEach(warn => report += `- ${warn.field}: ${warn.message}\n`);
    }
    report += '\n';

    report += `建议 (${result.suggestions.length}):\n`;
    if (result.suggestions.length === 0) {
      report += '- 无建议\n';
    } else {
      result.suggestions.forEach(sugg => report += `- ${sugg.field}: ${sugg.message}\n`);
    }

    return report;
  }

  // --- 私有验证方法 ---

  private validateBasicInfo(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.id) errors.push({ field: 'id', message: '角色ID不能为空' });
    if (!character.name) errors.push({ field: 'name', message: '角色名称不能为空' });
    if (!character.gender) errors.push({ field: 'gender', message: '角色性别不能为空' });
    if (character.age < 0) errors.push({ field: 'age', message: '年龄不能为负数' });
  }

  private validateThemes(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.themes || character.themes.length === 0) {
      errors.push({ field: 'themes', message: '必须至少包含一个主题配置' });
    } else {
      character.themes.forEach((theme, index) => {
        if (!theme.id) errors.push({ field: `themes[${index}].id`, message: '主题ID不能为空' });
        // 简单验证颜色格式
        if (theme.colors && !/^#[0-9A-Fa-f]{6}$/.test(theme.colors.primary)) {
           warnings.push({ field: `themes[${index}].colors.primary`, message: '主色调格式建议为十六进制颜色码 (e.g. #FF0000)' });
        }
      });
    }
  }

  private validateExpressions(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.expressions || character.expressions.length === 0) {
      warnings.push({ field: 'expressions', message: '建议配置角色表情' });
    }
    const requiredTriggers = ['greeting', 'celebration', 'encouragement', 'comfort', 'thinking', 'listening'];
    const existingTriggers = character.expressions?.map(e => e.trigger) || [];
    
    requiredTriggers.forEach(trigger => {
        if (!existingTriggers.includes(trigger as any)) {
            suggestions.push({ field: 'expressions', message: `建议添加 '${trigger}' 场景的表情` });
        }
    });
  }

  private validatePersonality(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (!character.personality) {
        warnings.push({ field: 'personality', message: '缺失个性配置' });
        return;
    }
    const { traits } = character.personality;
    if (traits) {
        Object.entries(traits).forEach(([trait, value]) => {
            if (value < 0 || value > 1) {
                errors.push({ field: `personality.traits.${trait}`, message: '个性特征值必须在 0 到 1 之间' });
            }
        });
    }
  }

  private validateVoiceSettings(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    if (character.voiceSettings) {
        if (character.voiceSettings.volume < 0 || character.voiceSettings.volume > 1) {
            errors.push({ field: 'voiceSettings.volume', message: '音量必须在 0 到 1 之间' });
        }
        if (character.voiceSettings.speed <= 0) {
            errors.push({ field: 'voiceSettings.speed', message: '语速必须大于 0' });
        }
    }
  }

  private validateImagePaths(
    character: CharacterConfig,
    errors: ValidationError[],
    warnings: ValidationWarning[],
    suggestions: ValidationSuggestion[]
  ): void {
    const validatePath = (path: string, fieldName: string) => {
        if (!path) {
            errors.push({ field: fieldName, message: '图片路径不能为空' });
        } else if (!path.startsWith('/') && !path.startsWith('http')) {
             warnings.push({ field: fieldName, message: '图片路径建议以 / 或 http 开头' });
        }
    };

    validatePath(character.avatarPath, 'avatarPath');
    if (character.images) {
        validatePath(character.images.homePage, 'images.homePage');
        validatePath(character.images.growthRecord, 'images.growthRecord');
    }
  }
}

export const characterValidator = CharacterInfoValidator.getInstance();
