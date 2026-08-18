---
@file: 099-YYC3-XY-架构类-生产环境部署指南.md
@description: YYC3-XY项目架构类生产环境部署指南文档
@author: YYC³
@version: v1.0.0
@created: 2025-12-28
@updated: 2025-12-28
@status: published
@tags: 系统架构,技术设计,架构文档
---

# 生产环境部署指南 (DOC-DEPLOY-001)

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「言启象限，语枢未来」
> 「Words Initiate Quadrants, Language Serves as Core for the Future」
> 「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」

---

## 📋 文档信息

| 属性 | 内容 |
|------|------|
| **文档标题** | YYC³ AI小语系统生产环境部署指南 |
| **文档版本** | v1.0.0 |
| **创建时间** | 2025-12-08 |
| **最后更新** | 2025-12-08 |
| **适用对象** | 运维团队、DevOps工程师 |
| **部署平台** | Vercel, AWS, Azure, GCP |

---

## 🎯 部署概述

YYC³ AI小语系统生产环境部署采用云原生架构，确保高可用性、安全性和可扩展性。本指南详细说明了从准备到投产的完整部署流程。

### 部署核心要求
- **高可用性**: 99.9%+ 系统可用性
- **安全性**: 符合儿童数据保护法规
- **可扩展性**: 支持平滑扩容
- **监控**: 全方位监控和告警
- **备份**: 完整的数据备份策略

---

## 🏗️ 系统架构

### 1. 生产环境架构

#### 1.1 高可用架构
```typescript
// 生产环境架构配置
interface ProductionArchitecture {
  frontend: {
    cdn: 'Cloudflare';
    loadBalancer: 'Application Load Balancer';
    webServers: {
      provider: 'Vercel Edge Network';
      regions: ['asia', 'europe', 'north-america'];
      instances: 3;
      autoScaling: true;
    };
  };

  backend: {
    apiServers: {
      provider: 'Vercel Serverless Functions';
      regions: ['iad1', 'sfo1', 'hkg1'];
      concurrency: 1000;
      timeout: 30;
    };

    aiServices: {
      primary: 'OpenAI GPT-4';
      fallback: 'Azure OpenAI';
      loadBalancing: 'weighted_round_robin';
      healthChecks: true;
    };
  };

  database: {
    primary: {
      provider: 'Supabase (PostgreSQL)';
      region: 'us-east-1';
      instanceType: 'db.m6g.2xlarge';
      multiAZ: true;
      backupRetention: '30_days';
    };

    cache: {
      provider: 'Upstash Redis';
      clusterMode: 'enabled';
      nodeCount: 3;
      region: 'global';
    };
  };

  storage: {
    files: 'Vercel Blob Storage';
    cdn: 'Cloudflare R2';
    encryption: 'AES-256';
    redundancy: 'geo-distributed';
  };

  monitoring: {
    metrics: 'Vercel Analytics';
    logs: 'Vercel Log Drains';
    alerts: 'PagerDuty + Slack';
    uptime: 'UptimeRobot';
  };
}
```

### 2. 网络架构

#### 2.1 网络安全配置
```typescript
// 网络安全配置
interface NetworkSecurityConfig {
  firewalls: {
    webApplicationFirewall: {
      provider: 'Cloudflare WAF';
      rules: ['OWASP_MODSECURITY_CORE', 'COPPA_COMPLIANCE'];
      ddosProtection: 'always_on';
      rateLimiting: {
        requestsPerMinute: 1000;
        burstLimit: 2000;
      };
    };

    networkFirewall: {
      inboundPorts: [443, 80];
      outboundPorts: [443, 53];
      ipWhitelist: ['office_ip_range'];
    };
  };

  sslTls: {
    certificateType: 'wildcard_ssl';
    minVersion: 'TLS_1_3';
    cipherSuites: [
      'TLS_AES_256_GCM_SHA384',
      'TLS_CHACHA20_POLY1305_SHA256'
    ];
    hstsPolicy: 'max-age=31536000; includeSubDomains; preload';
  };

  cdn: {
    provider: 'Cloudflare';
    caching: {
      staticAssets: '365_days';
      apiResponses: '5_minutes';
      personalizedContent: 'no_cache';
    };
    compression: 'gzip_brotli';
    minification: 'html_css_js';
  };
}
```

---

## 🚀 部署准备

### 1. 环境配置

#### 1.1 生产环境变量
```bash
# 生产环境变量 (.env.production)
NODE_ENV=production

# 应用配置
NEXT_PUBLIC_APP_URL=https://yyc3-ai.example.com
NEXT_PUBLIC_API_URL=https://api.yyc3-ai.example.com

# 数据库配置
DATABASE_URL=postgresql://user:password@host:5432/dbname
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=anon_key
SUPABASE_SERVICE_ROLE_KEY=service_role_key

# Redis 配置
REDIS_URL=redis://user:password@host:6379

# AI 服务配置
OPENAI_API_KEY=prod_openai_key
OPENAI_ORG_ID=prod_openai_org
AZURE_SPEECH_KEY=prod_azure_speech_key
AZURE_SPEECH_REGION=prod_azure_region

# 安全配置
JWT_SECRET=prod_jwt_secret_key
ENCRYPTION_KEY=prod_encryption_key
SESSION_SECRET=prod_session_secret

# 监控配置
SENTRY_DSN=prod_sentry_dsn
VERCEL_ANALYTICS_ID=prod_analytics_id
LOG_LEVEL=warn

# CORS 配置
ALLOWED_ORIGINS=https://yyc3-ai.example.com,https://admin.yyc3-ai.example.com

# 邮件服务配置
SMTP_HOST=smtp.provider.com
SMTP_PORT=587
SMTP_USER=noreply@yyc3-ai.example.com
SMTP_PASS=prod_smtp_password

# 文件存储配置
STORAGE_ENDPOINT=https://storage.provider.com
STORAGE_ACCESS_KEY=prod_storage_key
STORAGE_SECRET_KEY=prod_storage_secret
```

### 2. 构建配置

#### 2.1 Next.js 生产配置
```javascript
// next.config.js
const nextConfig = {
  // 生产环境优化
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 图片优化
  images: {
    domains: ['images.yyc3-ai.example.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 实验性功能
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },

  // 安全头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: https://images.yyc3-ai.example.com",
              "connect-src 'self' https://api.openai.com https://api.supabase.co",
              "frame-src 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
```

---

## 🌐 Vercel 部署

### 1. Vercel 配置

#### 1.1 vercel.json 配置
```json
{
  "version": 2,
  "name": "yyc3-xy-ai",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1", "sfo1", "hkg1"],
  "framework": "nextjs",
  "installCommand": "bun install",
  "buildCommand": "bun run build",
  "outputDirectory": ".next",
  "domains": ["yyc3-ai.example.com"],
  "build": {
    "env": {
      "NEXT_PUBLIC_APP_URL": "https://yyc3-ai.example.com"
    }
  }
}
```

### 2. 部署命令

#### 2.1 生产部署流程
```bash
#!/bin/bash
# deploy-production.sh

echo "🚀 Starting YYC³ AI小语生产环境部署..."

# 1. 环境检查
echo "📋 检查部署环境..."
bun --version
node --version

# 2. 依赖安装
echo "📦 安装依赖..."
bun install --production=false

# 3. 代码质量检查
echo "🔍 运行代码质量检查..."
bun run lint
bun run type-check

# 4. 运行测试
echo "🧪 运行测试套件..."
bun run test:unit
bun run test:integration

# 5. 构建应用
echo "🔨 构建生产版本..."
bun run build

# 6. 安全检查
echo "🔒 运行安全检查..."
bun run security:audit

# 7. 部署到 Vercel
echo "🌐 部署到 Vercel..."
vercel --prod

# 8. 部署后验证
echo "✅ 验证部署..."
curl -f https://yyc3-ai.example.com/api/health

echo "🎉 部署完成！"
```

---

## ☁️ 云服务配置

### 1. Supabase 数据库

#### 1.1 生产数据库配置
```sql
-- Supabase 生产环境配置
-- 启用 Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 创建 RLS 策略
CREATE POLICY "Users can view own data" ON users
  FOR ALL TO authenticated_users
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE TO authenticated_users
  USING (auth.uid() = id);

-- 创建索引
CREATE INDEX idx_users_age ON users(age);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_ai_messages_user_id ON ai_messages(user_id);

-- 启用备份
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /var/lib/postgresql/archive/%f';
```

### 2. Redis 缓存配置

#### 2.1 Redis 生产配置
```typescript
// Redis 生产配置
const redisConfig = {
  client: {
    url: process.env.REDIS_URL,
    connectTimeout: 10000,
    lazyConnect: true,
    maxRetriesPerRequest: 3,
    retryDelayOnFailover: 100,
  },

  options: {
    ttl: 3600, // 1小时默认TTL
    enableAutoPipelining: true,
    enableOfflineQueue: false,
    keyPrefix: 'yyc3:',
  },

  clustering: {
    enabled: true,
    nodes: [
      { host: 'redis-1.example.com', port: 6379 },
      { host: 'redis-2.example.com', port: 6379 },
      { host: 'redis-3.example.com', port: 6379 },
    ],
    options: {
      enableOfflineQueue: false,
      maxRedirections: 3,
      retryDelayOnFailover: 100,
    },
  },
};
```

---

## 🔒 安全配置

### 1. API 安全

#### 1.1 API 安全中间件
```typescript
// API 安全中间件配置
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

// 速率限制
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 1000, // 每个IP最多1000个请求
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

// 安全头
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
});

// CORS 配置
const corsOptions = {
  origin: ['https://yyc3-ai.example.com', 'https://admin.yyc3-ai.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  optionsSuccessStatus: 200,
};

// 应用中间件
app.use(rateLimiter);
app.use(securityHeaders);
app.use(cors(corsOptions));
```

### 2. 数据加密

#### 2.2 加密服务配置
```typescript
// 数据加密服务
class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;
  private readonly ivLength = 16;

  private getKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;
    if (!key || key.length !== 64) {
      throw new Error('Invalid encryption key');
    }
    return Buffer.from(key, 'hex');
  }

  encrypt(data: string): string {
    const key = this.getKey();
    const iv = crypto.randomBytes(this.ivLength);

    const cipher = crypto.createCipher(this.algorithm, key);
    cipher.setAAD(Buffer.from('yyc3-ai'));

    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }

  decrypt(encryptedData: string): string {
    const key = this.getKey();
    const [ivHex, authTagHex, encrypted] = encryptedData.split(':');

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipher(this.algorithm, key);
    decipher.setAAD(Buffer.from('yyc3-ai'));
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
```

---

## 📊 监控配置

### 1. 应用监控

#### 1.1 Vercel Analytics 配置
```typescript
// 生产环境监控配置
const monitoringConfig = {
  analytics: {
    enabled: true,
    sampleRate: 0.1, // 采样率，控制成本
    trackWebVitals: true,
    trackInteractions: true,
  },

  errorTracking: {
    enabled: true,
    dsn: process.env.SENTRY_DSN,
    environment: 'production',
    sampleRate: 0.1,
    maxBreadcrumbs: 50,
  },

  performance: {
    enabled: true,
    databaseSlowQueryThreshold: 1000, // 毫秒
    apiSlowResponseThreshold: 500, // 毫秒
    memoryUsageThreshold: 0.8, // 80%
    cpuUsageThreshold: 0.8, // 80%
  },

  alerts: {
    enabled: true,
    webhookUrls: [
      'https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK'
    ],
    emailRecipients: ['alerts@yyc3-ai.example.com'],
    smsRecipients: ['+1234567890'],
  },
};
```

### 2. 日志配置

#### 2.2 结构化日志
```typescript
// 生产环境日志配置
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'yyc3-ai',
    environment: process.env.NODE_ENV,
  },
  transports: [
    // 控制台输出（开发环境）
    ...(process.env.NODE_ENV !== 'production' ? [
      new winston.transports.Console({
        format: winston.format.simple(),
      }),
    ] : []),

    // 文件输出（生产环境）
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
      new winston.transports.File({
        filename: 'logs/combined.log',
        maxsize: 10485760, // 10MB
        maxFiles: 10,
      }),
    ] : []),

    // 外部日志服务
    new winston.transports.Http({
      host: 'logs.logstash.example.com',
      port: 5000,
      level: 'info',
      format: winston.format.json(),
    }),
  ],
});
```

---

## 🔄 CI/CD 流水线

### 1. GitHub Actions 配置

#### 1.1 生产部署流水线
```yaml
# .github/workflows/deploy-production.yml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Run lint
        run: bun run lint

      - name: Run type check
        run: bun run type-check

      - name: Run tests
        run: bun run test

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest

      - name: Install dependencies
        run: bun install --frozen-lockfile

      - name: Security audit
        run: bun audit --audit-level high

      - name: OWASP ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.7.0
        with:
          target: https://yyc3-ai.example.com

  build-and-deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Setup Vercel CLI
        run: npm install -g vercel@latest

      - name: Pull Vercel Environment Information
        run: vercel pull pull --environment=production --teamId=$VERCEL_ORG_ID --projectId=$VERCEL_PROJECT_ID
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

      - name: Build Project
        run: vercel build --prod

      - name: Deploy Project
        run: vercel --prod --prebuilt
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}

      - name: Run Post-Deployment Tests
        run: |
          sleep 60
          curl -f https://yyc3-ai.example.com/api/health
          curl -f https://yyc3-ai.example.com/
```

### 2. 环境管理

#### 2.2 环境变量管理
```yaml
# Vercel 环境变量配置
environments:
  production:
    NODE_ENV: production
    NEXT_PUBLIC_APP_URL: https://yyc3-ai.example.com
    DATABASE_URL: @database_url
    REDIS_URL: @redis_url
    OPENAI_API_KEY: @openai_api_key
    JWT_SECRET: @jwt_secret
    ENCRYPTION_KEY: @encryption_key
    SENTRY_DSN: @sentry_dsn

  staging:
    NODE_ENV: staging
    NEXT_PUBLIC_APP_URL: https://staging.yyc3-ai.example.com
    DATABASE_URL: @staging_database_url
    REDIS_URL: @staging_redis_url
    OPENAI_API_KEY: @staging_openai_api_key
    JWT_SECRET: @staging_jwt_secret
    ENCRYPTION_KEY: @staging_encryption_key
    SENTRY_DSN: @staging_sentry_dsn
```

---

## 🔧 运维操作

### 1. 健康检查

#### 1.1 健康检查端点
```typescript
// API 健康检查端点
export async function GET() {
  try {
    // 数据库连接检查
    const dbStatus = await checkDatabaseConnection();

    // Redis 连接检查
    const redisStatus = await checkRedisConnection();

    // AI 服务连接检查
    const aiStatus = await checkAIServicesConnection();

    // 系统资源检查
    const systemStatus = await checkSystemResources();

    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
        ai: aiStatus,
        system: systemStatus,
      },
      version: process.env.APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV,
    };

    // 如果所有服务都健康，返回 200
    if (dbStatus.healthy && redisStatus.healthy && aiStatus.healthy) {
      return NextResponse.json(healthStatus, { status: 200 });
    }

    // 否则返回 503
    return NextResponse.json(healthStatus, { status: 503 });

  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

### 2. 数据备份

#### 2.2 自动备份配置
```bash
#!/bin/bash
# backup-production-data.sh

echo "🔄 开始生产数据备份..."

# 数据库备份
echo "📊 备份数据库..."
pg_dump "$DATABASE_URL" > "backups/database-$(date +%Y%m%d_%H%M%S).sql"

# Redis 备份
echo "📦 备份 Redis缓存..."
redis-cli -u "$REDIS_URL" --rdb /tmp/redis-backup-$(date +%Y%m%d_%H%M%S).rdb

# 文件备份
echo "📁 备份文件存储..."
rsync -av storage/ backups/storage-$(date +%Y%m%d_%H%M%S)/

# 上传到云存储
echo "☁️ 上传备份到云存储..."
aws s3 sync backups/ s3://yyc3-backups/$(date +%Y-%m-%d)/

# 清理本地备份（保留7天）
find backups/ -type f -mtime +7 -delete

# 发送备份通知
echo "📧 发送备份完成通知..."
curl -X POST -H 'Content-Type: application/json' \
  -d '{"text": "生产数据备份完成", "channel": "#ops"}' \
  "$SLACK_WEBHOOK_URL"

echo "✅ 备份完成！"
```

---

## 📚 相关文档

- [安全架构文档](../SECURITY/01-SECURITY_ARCHITECTURE.md)
- [事件响应程序](../SECURITY/07-INCIDENT_RESPONSE.md)
- [监控指南](../SECURITY/06-SECURITY_MONITORING.md)
- [开发环境设置](../DEVELOPMENT/01-SETUP_GUIDE.md)
- [代码规范](../DEVELOPMENT/02-CODE_STANDARDS.md)

---

**部署要求**: 必须通过所有测试和安全检查才能部署到生产环境。

**监控要求**: 部署后必须确保所有监控和告警系统正常运行。

**备份要求**: 必须配置自动备份系统，确保数据安全可恢复。

---

> 「YanYuCloudCube」
> 「<admin@0379.email>」
> 「言启象限，语枢未来」
> 「Words Initiate Quadrants, Language Serves as Core for the Future」
> 「All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence」
