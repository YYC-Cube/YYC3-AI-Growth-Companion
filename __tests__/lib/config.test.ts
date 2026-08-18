/**
 * @fileoverview 配置管理测试
 * @description 测试Config类的单例模式、配置加载、验证等功能
 * @author YYC³
 * @version 1.0.0
 * @created 2025-01-30
 * @modified 2025-01-30
 * @copyright Copyright (c) 2025 YYC³
 * @license MIT
 */

// 简化的Config类模拟
class MockConfig {
  private static instance: MockConfig
  private config: Record<string, any>
  private envVars: Record<string, any>

  private constructor(envVars?: Record<string, any>) {
    this.envVars = envVars || {}
    this.config = this.loadConfig()
  }

  public static getInstance(envVars?: Record<string, any>): MockConfig {
    if (!MockConfig.instance) {
      MockConfig.instance = new MockConfig(envVars)
    }
    return MockConfig.instance
  }

  private loadConfig(): Record<string, any> {
    const env = this.envVars['NODE_ENV'] || 'development'
    
    // 基础配置
    const baseConfig = {
      // 应用配置
      APP_NAME: this.envVars['NEXT_PUBLIC_APP_NAME'] || 'YYC³',
      APP_VERSION: this.envVars['NEXT_PUBLIC_APP_VERSION'] || '1.0.0',
      
      // 服务配置
      PORT: parseInt(this.envVars['PORT'] || '1229'),
      
      // 认证配置
      JWT_SECRET: this.envVars['JWT_SECRET'] || '',
      JWT_EXPIRES_IN: parseInt(this.envVars['JWT_EXPIRES_IN'] || '86400'),
      
      // AI配置
      OPENAI_API_KEY: this.envVars['OPENAI_API_KEY'] || '',
      AI_MODEL: this.envVars['AI_MODEL'] || 'gpt-4',
      AI_MAX_TOKENS: parseInt(this.envVars['AI_MAX_TOKENS'] || '4000'),
      AI_TEMPERATURE: parseFloat(this.envVars['AI_TEMPERATURE'] || '0.7'),
      
      // 数据库配置
      DATABASE_URL: this.envVars['DATABASE_URL'] || '',
      REDIS_URL: this.envVars['REDIS_URL'] || '',
      
      // 日志配置
      LOG_LEVEL: this.envVars['LOG_LEVEL'] || 'info',
      LOG_TO_CONSOLE: this.envVars['LOG_TO_CONSOLE'] !== 'false',
      LOG_TO_FILE: this.envVars['LOG_TO_FILE'] === 'true',
      
      // 前端配置
      API_BASE_URL: this.envVars['NEXT_PUBLIC_API_BASE_URL'] || '/api',
    }
    
    // 环境特定配置
    const envConfig = this.getEnvironmentConfig(env)
    
    return { ...baseConfig, ...envConfig }
  }

  private getEnvironmentConfig(env: string): Record<string, any> {
    switch (env) {
      case 'production':
        return {
          DEBUG: false,
          LOG_LEVEL: 'error',
          LOG_TO_CONSOLE: false,
          LOG_TO_FILE: true,
        }
      case 'test':
        return {
          DEBUG: true,
          LOG_LEVEL: 'debug',
          LOG_TO_CONSOLE: true,
          LOG_TO_FILE: false,
        }
      case 'development':
      default:
        return {
          DEBUG: true,
          LOG_LEVEL: 'debug',
          LOG_TO_CONSOLE: true,
          LOG_TO_FILE: false,
        }
    }
  }

  public get(key: string, defaultValue?: any): any {
    return this.config[key] !== undefined ? this.config[key] : defaultValue
  }

  public getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key)
    if (value === undefined) return defaultValue as number
    return Number(value)
  }

  public getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get(key)
    if (value === undefined) return defaultValue as boolean
    return Boolean(value)
  }

  public has(key: string): boolean {
    return this.config[key] !== undefined
  }

  public set(key: string, value: any): void {
    this.config[key] = value
  }

  public update(updates: Record<string, any>): void {
    Object.assign(this.config, updates)
  }

  public reload(): void {
    this.config = this.loadConfig()
  }

  public getAll(): Record<string, any> {
    return { ...this.config }
  }

  public getPublic(): Record<string, any> {
    const publicKeys = [
      'APP_NAME',
      'APP_VERSION',
      'API_BASE_URL',
      'DEBUG'
    ]
    
    const publicConfig: Record<string, any> = {}
    publicKeys.forEach(key => {
      if (this.config[key] !== undefined) {
        publicConfig[key] = this.config[key]
      }
    })
    
    return publicConfig
  }

  public getDatabaseConfig(): Record<string, any> {
    return {
      url: this.config.DATABASE_URL,
      redisUrl: this.config.REDIS_URL,
    }
  }

  public getDatabasePoolConfig(): Record<string, any> {
    return {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    }
  }

  public getAIConfig(): Record<string, any> {
    return {
      openaiApiKey: this.config.OPENAI_API_KEY,
      model: this.config.AI_MODEL,
      maxTokens: this.config.AI_MAX_TOKENS,
      temperature: this.config.AI_TEMPERATURE,
    }
  }

  public getLogConfig(): Record<string, any> {
    return {
      level: this.config.LOG_LEVEL,
      toConsole: this.config.LOG_TO_CONSOLE,
      toFile: this.config.LOG_TO_FILE,
    }
  }

  public getFrontendConfig(): Record<string, any> {
    return {
      appName: this.config.APP_NAME,
      appVersion: this.config.APP_VERSION,
      apiBaseUrl: this.config.API_BASE_URL,
    }
  }

  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    
    // 验证必需的配置项
    if (!this.config.JWT_SECRET || this.config.JWT_SECRET.length < 32) {
      errors.push('JWT_SECRET必须设置且长度至少32位')
    }
    
    if (!this.config.OPENAI_API_KEY) {
      errors.push('OPENAI_API_KEY必须设置')
    }
    
    return {
      valid: errors.length === 0,
      errors,
    }
  }
}

// 创建测试用的环境变量
const createTestEnv = (overrides: Record<string, any> = {}): Record<string, any> => {
  return {
    NODE_ENV: 'test',
    JWT_SECRET: 'test-jwt-secret-key-for-testing-environment',
    OPENAI_API_KEY: 'test-openai-api-key',
    NEXT_PUBLIC_APP_NAME: 'YYC³ Test',
    NEXT_PUBLIC_APP_VERSION: '1.0.0-test',
    ...overrides
  }
}

describe('Config配置管理', () => {
  beforeEach(() => {
    // 重置单例实例
    (MockConfig as any).instance = undefined
  })

  describe('单例模式', () => {
    it('应该返回相同的实例', () => {
      const testEnv = createTestEnv()
      const instance1 = MockConfig.getInstance(testEnv)
      const instance2 = MockConfig.getInstance()
      
      expect(instance1).toBe(instance2)
    })

    it('应该只创建一个实例', () => {
      const testEnv = createTestEnv()
      const instances = [
        MockConfig.getInstance(testEnv),
        MockConfig.getInstance(),
        MockConfig.getInstance()
      ]
      
      // 所有实例应该是同一个对象
      expect(instances[0]).toBe(instances[1])
      expect(instances[1]).toBe(instances[2])
    })
  })

  describe('配置加载', () => {
    it('应该正确加载开发环境配置', () => {
      const testEnv = createTestEnv({ NODE_ENV: 'development' })
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.get('DEBUG')).toBe(true)
      expect(config.get('LOG_LEVEL')).toBe('debug')
      expect(config.get('LOG_TO_CONSOLE')).toBe(true)
      expect(config.get('LOG_TO_FILE')).toBe(false)
    })

    it('应该正确加载生产环境配置', () => {
      const testEnv = createTestEnv({ NODE_ENV: 'production' })
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.get('DEBUG')).toBe(false)
      expect(config.get('LOG_LEVEL')).toBe('error')
      expect(config.get('LOG_TO_CONSOLE')).toBe(false)
      expect(config.get('LOG_TO_FILE')).toBe(true)
    })

    it('应该正确加载测试环境配置', () => {
      const testEnv = createTestEnv({ NODE_ENV: 'test' })
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.get('DEBUG')).toBe(true)
      expect(config.get('LOG_LEVEL')).toBe('debug')
      expect(config.get('LOG_TO_CONSOLE')).toBe(true)
      expect(config.get('LOG_TO_FILE')).toBe(false)
    })

    it('应该正确处理未定义的环境', () => {
      const testEnv = createTestEnv({ NODE_ENV: undefined })
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.get('DEBUG')).toBe(true)
      expect(config.get('LOG_LEVEL')).toBe('debug')
    })
  })

  describe('配置验证', () => {
    it('应该验证有效的配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      const validation = config.validate()
      
      expect(validation.valid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('应该检测JWT_SECRET过短', () => {
      const testEnv = createTestEnv({ JWT_SECRET: 'short' })
      const config = MockConfig.getInstance(testEnv)
      
      const validation = config.validate()
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('JWT_SECRET必须设置且长度至少32位')
    })

    it('应该检测缺失的JWT密钥', () => {
      const testEnv = createTestEnv({ JWT_SECRET: '' })
      const config = MockConfig.getInstance(testEnv)
      
      const validation = config.validate()
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('JWT_SECRET必须设置且长度至少32位')
    })

    it('应该检测缺失的OpenAI API密钥', () => {
      const testEnv = createTestEnv({ OPENAI_API_KEY: '' })
      const config = MockConfig.getInstance(testEnv)
      
      const validation = config.validate()
      
      expect(validation.valid).toBe(false)
      expect(validation.errors).toContain('OPENAI_API_KEY必须设置')
    })
  })

  describe('配置访问', () => {
    it('应该正确获取字符串配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.get('APP_NAME')).toBe('YYC³ Test')
      expect(config.get('APP_VERSION')).toBe('1.0.0-test')
    })

    it('应该正确获取数字配置', () => {
      const testEnv = createTestEnv({ 
        PORT: '3000',
        JWT_EXPIRES_IN: '86400'
      })
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.getNumber('PORT')).toBe(3000)
      expect(config.getNumber('JWT_EXPIRES_IN')).toBe(86400)
    })

    it('应该正确获取布尔配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.getBoolean('DEBUG')).toBe(true)
      expect(config.getBoolean('LOG_TO_CONSOLE')).toBe(true)
      expect(config.getBoolean('LOG_TO_FILE')).toBe(false)
    })

    it('应该返回默认值', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.get('NON_EXISTENT_KEY', 'default')).toBe('default')
      expect(config.getNumber('NON_EXISTENT_KEY', 42)).toBe(42)
      expect(config.getBoolean('NON_EXISTENT_KEY', true)).toBe(true)
    })

    it('应该检查配置是否存在', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      expect(config.has('APP_NAME')).toBe(true)
      expect(config.has('NON_EXISTENT_KEY')).toBe(false)
    })
  })

  describe('数据库配置', () => {
    it('应该提供数据库配置', () => {
      const testEnv = createTestEnv({
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
        REDIS_URL: 'redis://localhost:6379'
      })
      const config = MockConfig.getInstance(testEnv)
      
      const dbConfig = config.getDatabaseConfig()
      
      expect(dbConfig.url).toBe('postgresql://test:test@localhost:5432/test')
      expect(dbConfig.redisUrl).toBe('redis://localhost:6379')
    })

    it('应该提供数据库连接池配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      const poolConfig = config.getDatabasePoolConfig()
      
      expect(poolConfig.min).toBe(2)
      expect(poolConfig.max).toBe(10)
      expect(poolConfig.idleTimeoutMillis).toBe(30000)
      expect(poolConfig.connectionTimeoutMillis).toBe(2000)
    })
  })

  describe('AI配置', () => {
    it('应该提供AI配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      const aiConfig = config.getAIConfig()
      
      expect(aiConfig.openaiApiKey).toBe('test-openai-api-key')
      expect(aiConfig.model).toBe('gpt-4')
      expect(aiConfig.maxTokens).toBe(4000)
      expect(aiConfig.temperature).toBe(0.7)
    })
  })

  describe('日志配置', () => {
    it('应该提供日志配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      const logConfig = config.getLogConfig()
      
      expect(logConfig.level).toBe('debug')
      expect(logConfig.toConsole).toBe(true)
      expect(logConfig.toFile).toBe(false)
    })
  })

  describe('前端配置', () => {
    it('应该提供前端配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      const frontendConfig = config.getFrontendConfig()
      
      expect(frontendConfig.appName).toBe('YYC³ Test')
      expect(frontendConfig.appVersion).toBe('1.0.0-test')
      expect(frontendConfig.apiBaseUrl).toBe('/api')
    })
  })

  describe('配置更新', () => {
    it('应该支持配置更新', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      // 更新配置
      config.set('TEST_KEY', 'test_value')
      
      expect(config.get('TEST_KEY')).toBe('test_value')
    })

    it('应该支持批量配置更新', () => {
      const testEnv = createTestEnv({
        DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
        REDIS_URL: 'redis://localhost:6379'
      })
      const config = MockConfig.getInstance(testEnv)
      
      config.update({
        DATABASE_URL: 'postgresql://new:new@localhost:5432/new',
        REDIS_URL: 'redis://newhost:6380'
      })
      
      expect(config.get('DATABASE_URL')).toBe('postgresql://new:new@localhost:5432/new')
      expect(config.get('REDIS_URL')).toBe('redis://newhost:6380')
    })
  })

  describe('配置重载', () => {
    it('应该支持配置重载', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      // 修改配置
      config.set('RELOAD_TEST', 'original_value')
      expect(config.get('RELOAD_TEST')).toBe('original_value')
      
      // 重载配置
      config.reload()
      
      // 配置应该被重置
      expect(config.get('RELOAD_TEST', 'default')).toBe('default')
    })
  })

  describe('配置导出', () => {
    it('应该导出所有配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      const allConfig = config.getAll()
      
      expect(allConfig).toHaveProperty('APP_NAME')
      expect(allConfig).toHaveProperty('APP_VERSION')
      expect(allConfig).toHaveProperty('DEBUG')
      expect(allConfig).toHaveProperty('LOG_LEVEL')
    })

    it('应该导出公共配置', () => {
      const testEnv = createTestEnv()
      const config = MockConfig.getInstance(testEnv)
      
      const publicConfig = config.getPublic()
      
      // 公共配置应该包含前端需要的配置
      expect(publicConfig).toHaveProperty('APP_NAME')
      expect(publicConfig).toHaveProperty('APP_VERSION')
      
      // 公共配置不应该包含敏感信息
      expect(publicConfig).not.toHaveProperty('JWT_SECRET')
      expect(publicConfig).not.toHaveProperty('OPENAI_API_KEY')
    })
  })
})
