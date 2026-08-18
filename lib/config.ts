/**
 * YYC³-XY-AI 配置文件
 *
 * 本文件包含项目全局配置，包括：
 * - 环境变量配置
 * - 日志配置
 * - API 配置
 * - 数据库配置
 */

// 环境变量说明：Next.js 自动加载 .env/.env.local，无需 dotenv
//（原 dotenv 导入会进入客户端 bundle 并导致构建失败）

/**
 * 获取环境变量
 */
function getEnvVar(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

/**
 * 获取数字环境变量
 */
function getEnvNumber(key: string, defaultValue: number = 0): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

/**
 * 获取布尔环境变量
 */
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = process.env[key];
  return value ? value.toLowerCase() === 'true' : defaultValue;
}

/**
 * 配置对象
 */
const config = {
  /**
   * 环境配置
   */
  env: {
    nodeEnv: getEnvVar('NODE_ENV', 'development'),
    isDevelopment: getEnvVar('NODE_ENV', 'development') === 'development',
    isProduction: getEnvVar('NODE_ENV', 'development') === 'production',
    isTest: getEnvVar('NODE_ENV', 'development') === 'test',
  },

  /**
   * 端口配置
   */
  port: {
    app: getEnvNumber('PORT', 3000),
    api: getEnvNumber('API_PORT', 3001),
    database: getEnvNumber('DATABASE_PORT', 5432),
  },

  /**
   * 日志配置
   */
  logger: {
    level: getEnvVar('LOG_LEVEL', 'debug'),
    file: getEnvVar('LOG_FILE', 'logs/app.log'),
    maxSize: getEnvNumber('LOG_MAX_SIZE', 20), // MB
    maxFiles: getEnvNumber('LOG_MAX_FILES', 14), // days
    service: 'yyc3-xy-ai',
  },

  /**
   * API 配置
   */
  api: {
    baseUrl: getEnvVar('API_BASE_URL', 'http://localhost:3001'),
    timeout: getEnvNumber('API_TIMEOUT', 30000), // ms
  },

  /**
   * 数据库配置
   */
  database: {
    url: getEnvVar('DATABASE_URL', 'sqlite:./data/database.db'),
    neo4j: {
      uri: getEnvVar('NEO4J_URI', 'bolt://localhost:7687'),
      username: getEnvVar('NEO4J_USERNAME', 'neo4j'),
      password: getEnvVar('NEO4J_PASSWORD', 'password'),
    },
  },

  /**
   * AI 配置
   */
  ai: {
    openaiApiKey: getEnvVar('OPENAI_API_KEY', ''),
    model: getEnvVar('OPENAI_MODEL', 'gpt-4'),
    temperature: getEnvNumber('OPENAI_TEMPERATURE', 7) / 10,
    maxTokens: getEnvNumber('OPENAI_MAX_TOKENS', 2048),
  },

  /**
   * 获取日志配置
   */
  getLoggerConfig() {
    return {
      level: this.logger.level,
      file: this.logger.file,
      maxSize: this.logger.maxSize,
      maxFiles: this.logger.maxFiles,
      service: this.logger.service,
    };
  },

  /**
   * 获取节点环境
   */
  getNodeEnv() {
    return this.env.nodeEnv;
  },

  /**
   * 获取数据库 URL
   */
  getDatabaseUrl() {
    return this.database.url;
  },

  /**
   * 获取 Neo4j 配置
   */
  getNeo4jConfig() {
    return {
      uri: this.database.neo4j.uri,
      username: this.database.neo4j.username,
      password: this.database.neo4j.password,
    };
  },

  /**
   * 获取 AI 配置
   */
  getAIConfig() {
    return {
      apiKey: this.ai.openaiApiKey,
      model: this.ai.model,
      temperature: this.ai.temperature,
      maxTokens: this.ai.maxTokens,
    };
  },
};

// 导出配置
export { config };
export default config;
