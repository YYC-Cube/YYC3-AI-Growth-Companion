/**
 * @file global-ui-components.tsx
 * @description YYC³ AI小语智能成长守护系统全局UI组件库，提供统一的UI组件确保应用界面一致性
 * @author YYC³团队 <admin@0379.email>
 * @version 1.0.0
 */

import React, { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { globalUIManager, type GlobalUIConfig } from './global-ui-config'

/**
 * 统一按钮组件
 */
export interface GlobalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof GlobalUIConfig['buttons']['variants']
  size?: keyof GlobalUIConfig['buttons']['sizes']
  children: ReactNode
  disabled?: boolean
  forceDisabled?: boolean // 强制禁用，覆盖全局配置
}

export const GlobalButton = React.forwardRef<HTMLButtonElement, GlobalButtonProps>(
  ({ className, variant = 'default', size = 'md', disabled, forceDisabled, children, ...props }, ref) => {
    const config = globalUIManager.getConfig()
    const isDisabled = disabled || forceDisabled || config.buttons.functionButtonsDisabled
    
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none',
          config.buttons.variants[variant],
          config.buttons.sizes[size],
          (isDisabled || config.buttons.functionButtonsDisabled) && config.buttons.disabledButtonClassName,
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

GlobalButton.displayName = 'GlobalButton'

/**
 * 统一开关组件
 */
export interface GlobalSwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  disabled?: boolean
  forceDisabled?: boolean // 强制禁用，覆盖全局配置
}

export const GlobalSwitch = React.forwardRef<HTMLInputElement, GlobalSwitchProps>(
  ({ className, checked, onCheckedChange, disabled, forceDisabled, ...props }, ref) => {
    const config = globalUIManager.getConfig()
    const isDisabled = disabled || forceDisabled || config.switches.functionSwitchesDisabled
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isDisabled) return
      onCheckedChange?.(e.target.checked)
    }
    
    return (
      <label className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-primary' : 'bg-input',
        isDisabled && config.switches.disabledSwitchClassName,
        className
      )}>
        <input
          type="checkbox"
          className="sr-only"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          disabled={isDisabled}
          {...props}
        />
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-background transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1',
            isDisabled && 'opacity-50'
          )}
        />
      </label>
    )
  }
)

GlobalSwitch.displayName = 'GlobalSwitch'

/**
 * 统一输入框组件
 */
export interface GlobalInputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean
  forceDisabled?: boolean // 强制禁用，覆盖全局配置
}

export const GlobalInput = React.forwardRef<HTMLInputElement, GlobalInputProps>(
  ({ className, disabled, forceDisabled, ...props }, ref) => {
    const config = globalUIManager.getConfig()
    const isDisabled = disabled || forceDisabled || config.forms.inputsDisabled
    
    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed',
          (isDisabled || config.forms.inputsDisabled) && config.forms.disabledInputClassName,
          className
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      />
    )
  }
)

GlobalInput.displayName = 'GlobalInput'

/**
 * 统一卡片组件
 */
export interface GlobalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const GlobalCard = React.forwardRef<HTMLDivElement, GlobalCardProps>(
  ({ className, children, ...props }, ref) => {
    const config = globalUIManager.getConfig()
    
    return (
      <div
        ref={ref}
        className={cn(
          config.cards.className,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

GlobalCard.displayName = 'GlobalCard'

/**
 * 统一设置项组件
 */
export interface GlobalSettingsItemProps {
  icon: string
  iconColor: string
  title: string
  subtitle: string | ReactNode
  hasArrow?: boolean
  action?: ReactNode
  hasBorder?: boolean
}

export const GlobalSettingsItem: React.FC<GlobalSettingsItemProps> = ({
  icon,
  iconColor,
  title,
  subtitle,
  hasArrow,
  action,
  hasBorder
}) => {
  return (
    <div
      className={cn(
        'flex justify-between items-center py-2 rounded-lg px-2 -mx-2',
        hasBorder && 'border-t pt-4 border-slate-50/50'
      )}
    >
      <div className="flex items-center gap-3">
        <i className={`${icon} text-2xl ${iconColor}`} />
        <div>
          <p className="font-bold">{title}</p>
          {typeof subtitle === 'string' ? (
            <p className="text-sm text-slate-500">{subtitle}</p>
          ) : (
            <div className="text-sm text-slate-500">{subtitle}</div>
          )}
        </div>
      </div>
      {hasArrow && <i className="ri-arrow-right-s-line text-xl text-slate-400" />}
      {action}
    </div>
  )
}

/**
 * 统一设置区域组件
 */
export interface GlobalSettingsSectionProps {
  title: string
  icon: string
  iconColor: string
  children: ReactNode
  index?: number
}

export const GlobalSettingsSection: React.FC<GlobalSettingsSectionProps> = ({
  title,
  icon,
  iconColor,
  children,
  index = 0
}) => {
  void index; // Mark as intentionally unused for future use
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
        <i className={`${icon} ${iconColor}`} />
        {title}
      </h2>

      <GlobalCard>
        <div className="p-6 space-y-4">
          {children}
        </div>
      </GlobalCard>
    </section>
  )
}

/**
 * 统一功能按钮组件 - 默认禁用状态
 */
export interface GlobalFunctionButtonProps extends Omit<GlobalButtonProps, 'disabled'> {
  // 默认为禁用状态，除非明确启用
  enabled?: boolean
}

export const GlobalFunctionButton: React.FC<GlobalFunctionButtonProps> = ({
  enabled = false,
  ...props
}) => {
  return (
    <GlobalButton
      {...props}
      disabled={!enabled}
    />
  )
}

/**
 * 统一功能开关组件 - 默认禁用状态
 */
export interface GlobalFunctionSwitchProps extends Omit<GlobalSwitchProps, 'disabled'> {
  // 默认为禁用状态，除非明确启用
  enabled?: boolean
}

export const GlobalFunctionSwitch: React.FC<GlobalFunctionSwitchProps> = ({
  enabled = false,
  ...props
}) => {
  return (
    <GlobalSwitch
      {...props}
      disabled={!enabled}
    />
  )
}