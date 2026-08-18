/**
 * @file global-ui-config.ts
 * @description 全局UI组件配置，统一管理全局UI组件的状态、样式和行为，确保应用界面一致性
 * @author YYC³团队 <admin@0379.email>
 * @version 1.0.0
 */

import { config } from '../config'

/**
 * 全局UI配置接口
 */
export interface GlobalUIConfig {
  // 按钮配置
  buttons: {
    // 功能按钮是否禁用
    functionButtonsDisabled: boolean
    // 禁用按钮样式类名
    disabledButtonClassName: string
    // 按钮尺寸变体
    sizes: {
      sm: string
      md: string
      lg: string
    }
    // 按钮样式变体
    variants: {
      default: string
      outline: string
      ghost: string
      destructive: string
    }
  }
  
  // 开关配置
  switches: {
    // 功能开关是否禁用
    functionSwitchesDisabled: boolean
    // 禁用开关样式类名
    disabledSwitchClassName: string
  }
  
  // 表单配置
  forms: {
    // 输入框是否禁用
    inputsDisabled: boolean
    // 禁用输入框样式类名
    disabledInputClassName: string
  }
  
  // 卡片配置
  cards: {
    // 统一卡片样式类名
    className: string
    // 卡片阴影配置
    shadow: string
  }
  
  // 动画配置
  animations: {
    // 页面过渡动画
    pageTransition: string
    // 组件出现动画
    componentEntrance: string
    // 按钮悬停动画
    buttonHover: string
  }
}

/**
 * 默认全局UI配置
 */
export const defaultGlobalUIConfig: GlobalUIConfig = {
  buttons: {
    functionButtonsDisabled: false, // 默认功能按钮可用
    disabledButtonClassName: 'opacity-50 cursor-not-allowed',
    sizes: {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-lg'
    },
    variants: {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
    }
  },
  
  switches: {
    functionSwitchesDisabled: false, // 默认功能开关可用
    disabledSwitchClassName: 'opacity-50 cursor-not-allowed'
  },
  
  forms: {
    inputsDisabled: false, // 输入框默认不禁用
    disabledInputClassName: 'opacity-50 cursor-not-allowed bg-muted'
  },
  
  cards: {
    className: 'bg-white rounded-3xl shadow-soft',
    shadow: 'shadow-soft'
  },
  
  animations: {
    pageTransition: 'duration-300 ease-in-out',
    componentEntrance: 'duration-500 ease-out',
    buttonHover: 'duration-200 ease-in-out'
  }
}

/**
 * 从统一配置获取UI配置
 */
const getUIConfigFromGlobal = (): GlobalUIConfig => {
  try {
    // 主干 lib/config 暂无 getUIConfig（xy-01 侧扩展），做能力探测而非依赖异常兜底
    const configWithUI = config as typeof config & {
      getUIConfig?: () => {
        theme: { primaryColor: string };
        animation: { duration: string };
      };
    };
    if (typeof configWithUI.getUIConfig !== 'function') {
      return defaultGlobalUIConfig;
    }
    const uiConfig = configWithUI.getUIConfig();

    // 将统一配置转换为全局UI配置格式
    return {
      buttons: {
        functionButtonsDisabled: false, // 可以从配置中获取
        disabledButtonClassName: 'opacity-50 cursor-not-allowed',
        sizes: {
          sm: 'h-8 px-3 text-xs',
          md: 'h-10 px-4 py-2',
          lg: 'h-12 px-6 text-lg'
        },
        variants: {
          default: `bg-[${uiConfig.theme.primaryColor}] text-primary-foreground hover:bg-primary/90`,
          outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
          ghost: 'hover:bg-accent hover:text-accent-foreground',
          destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
        }
      },

      switches: {
        functionSwitchesDisabled: false,
        disabledSwitchClassName: 'opacity-50 cursor-not-allowed'
      },

      forms: {
        inputsDisabled: false,
        disabledInputClassName: 'opacity-50 cursor-not-allowed bg-muted'
      },

      cards: {
        className: `bg-white rounded-3xl shadow-soft`,
        shadow: 'shadow-soft'
      },

      animations: {
        pageTransition: uiConfig.animation.duration,
        componentEntrance: 'duration-500 ease-out',
        buttonHover: 'duration-200 ease-in-out'
      }
    };
  } catch (_error) {
    // 如果获取配置失败，返回默认配置
    return defaultGlobalUIConfig;
  }
};

/**
 * 全局UI配置管理器类
 */
export class GlobalUIManager {
  private static instance: GlobalUIManager
  private config: GlobalUIConfig

  private constructor() {
    // 尝试从统一配置获取，如果失败则使用默认配置
    this.config = getUIConfigFromGlobal();
  }

  /**
   * 获取全局UI管理器实例
   */
  static getInstance(): GlobalUIManager {
    if (!GlobalUIManager.instance) {
      GlobalUIManager.instance = new GlobalUIManager()
    }
    return GlobalUIManager.instance
  }

  /**
   * 获取当前UI配置
   */
  getConfig(): GlobalUIConfig {
    return { ...this.config }
  }

  /**
   * 更新UI配置
   */
  updateConfig(newConfig: Partial<GlobalUIConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('Global UI config updated:', newConfig)
  }

  /**
   * 重置UI配置为默认值
   */
  resetToDefault(): void {
    this.config = { ...defaultGlobalUIConfig }
    console.log('Global UI config reset to default')
  }

  /**
   * 获取按钮样式类名
   */
  getButtonClassName(variant: keyof GlobalUIConfig['buttons']['variants'] = 'default', size: keyof GlobalUIConfig['buttons']['sizes'] = 'md', disabled: boolean = false): string {
    const { variants, sizes, disabledButtonClassName, functionButtonsDisabled } = this.config.buttons
    
    let className = `${variants[variant]} ${sizes[size]}`
    
    if (disabled || functionButtonsDisabled) {
      className += ` ${disabledButtonClassName}`
    }
    
    return className
  }

  /**
   * 获取开关样式类名
   */
  getSwitchClassName(disabled: boolean = false): string {
    const { disabledSwitchClassName, functionSwitchesDisabled } = this.config.switches
    
    if (disabled || functionSwitchesDisabled) {
      return disabledSwitchClassName
    }
    
    return ''
  }

  /**
   * 获取输入框样式类名
   */
  getInputClassName(disabled: boolean = false): string {
    const { disabledInputClassName, inputsDisabled } = this.config.forms
    
    if (disabled || inputsDisabled) {
      return disabledInputClassName
    }
    
    return ''
  }

  /**
   * 获取卡片样式类名
   */
  getCardClassName(): string {
    return this.config.cards.className
  }

  /**
   * 获取动画样式类名
   */
  getAnimationClassName(type: keyof GlobalUIConfig['animations']): string {
    return this.config.animations[type]
  }

  /**
   * 检查功能按钮是否禁用
   */
  areFunctionButtonsDisabled(): boolean {
    return this.config.buttons.functionButtonsDisabled
  }

  /**
   * 检查功能开关是否禁用
   */
  areFunctionSwitchesDisabled(): boolean {
    return this.config.switches.functionSwitchesDisabled
  }

  /**
   * 设置功能按钮禁用状态
   */
  setFunctionButtonsDisabled(disabled: boolean): void {
    this.config.buttons.functionButtonsDisabled = disabled
    console.log(`Function buttons ${disabled ? 'disabled' : 'enabled'}`)
  }

  /**
   * 设置功能开关禁用状态
   */
  setFunctionSwitchesDisabled(disabled: boolean): void {
    this.config.switches.functionSwitchesDisabled = disabled
    console.log(`Function switches ${disabled ? 'disabled' : 'enabled'}`)
  }
}

// 导出全局UI管理器实例
export const globalUIManager = GlobalUIManager.getInstance()

// 导出便捷函数
export const getButtonClassName = (variant?: keyof GlobalUIConfig['buttons']['variants'], size?: keyof GlobalUIConfig['buttons']['sizes'], disabled?: boolean) => 
  globalUIManager.getButtonClassName(variant, size, disabled)

export const getSwitchClassName = (disabled?: boolean) => 
  globalUIManager.getSwitchClassName(disabled)

export const getInputClassName = (disabled?: boolean) => 
  globalUIManager.getInputClassName(disabled)

export const getCardClassName = () => 
  globalUIManager.getCardClassName()

export const getAnimationClassName = (type: keyof GlobalUIConfig['animations']) => 
  globalUIManager.getAnimationClassName(type)

export const areFunctionButtonsDisabled = () => 
  globalUIManager.areFunctionButtonsDisabled()

export const areFunctionSwitchesDisabled = () => 
  globalUIManager.areFunctionSwitchesDisabled()

export const setFunctionButtonsDisabled = (disabled: boolean) => 
  globalUIManager.setFunctionButtonsDisabled(disabled)

export const setFunctionSwitchesDisabled = (disabled: boolean) => 
  globalUIManager.setFunctionSwitchesDisabled(disabled)