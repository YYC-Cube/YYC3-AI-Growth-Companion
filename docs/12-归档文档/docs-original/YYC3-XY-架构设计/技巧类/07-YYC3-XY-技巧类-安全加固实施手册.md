# YYC³ AI小语智能成长守护系统 - 安全加固实施手册

@file 07-YYC3-XY-技巧类-安全加固实施手册.md
@description YYC³ AI小语智能成长守护系统安全加固实施手册，涵盖认证授权、数据加密、安全加固、漏洞防护等实战技巧
@author YYC³ Team
@version V1.0
@date 2025-12-25

---

## 文档概述

本文档提供YYC³ AI小语智能成长守护系统的安全加固实施指南，涵盖认证授权、数据加密、安全加固、漏洞防护等核心安全领域的实战技巧和最佳实践。

**文档类型**: 技巧类
**适用阶段**: 运维运营
**关联文档**: 
- 05-YYC3-XY-架构类-安全架构设计文档.md
- 05-YYC3-XY-技巧类-容器化部署最佳实践.md

---

## 目录

1. [安全加固概述](#1-安全加固概述)
2. [认证授权实施](#2-认证授权实施)
3. [数据加密配置](#3-数据加密配置)
4. [安全加固策略](#4-安全加固策略)
5. [漏洞防护措施](#5-漏洞防护措施)
6. [容器安全加固](#6-容器安全加固)
7. [密钥管理最佳实践](#7-密钥管理最佳实践)
8. [安全监控与审计](#8-安全监控与审计)
9. [安全合规性检查](#9-安全合规性检查)
10. [应急响应流程](#10-应急响应流程)
11. [安全加固检查表](#11-安全加固检查表)
12. [常见安全问题排查](#12-常见安全问题排查)

---

## 1. 安全加固概述

### 1.1 安全加固目标

YYC³ AI小语智能成长守护系统的安全加固实施遵循「五高五标五化」原则，确保系统具备：

- **高安全性**：多层次防护，纵深防御策略，抵御各类安全威胁
- **高可用性**：安全机制不影响系统正常运行，故障时快速恢复
- **高性能**：安全检查优化，最小化对系统性能的影响
- **高可扩展性**：安全组件可水平扩展，适应业务增长
- **高可维护性**：安全策略集中管理，便于审计和更新

### 1.2 安全加固原则

#### 1.2.1 最小权限原则

- 用户和系统组件仅获得完成任务所需的最小权限
- 实施细粒度的访问控制，避免过度授权
- 定期审查和回收不必要的权限

#### 1.2.2 纵深防御原则

- 在多个层面实施安全控制
- 单一安全机制失效时，其他机制仍能提供保护
- 包括网络层、应用层、数据层的安全措施

#### 1.2.3 默认安全原则

- 系统默认配置采用安全设置
- 避免不安全的默认值
- 新增功能默认启用安全措施

#### 1.2.4 失败安全原则

- 安全机制失效时，系统进入安全状态
- 避免因错误导致安全漏洞
- 实施安全降级策略

### 1.3 安全加固层次

```
┌─────────────────────────────────────────┐
│         应用安全层 (Application)          │
│  - 认证授权  - 输入验证  - 业务逻辑安全   │
├─────────────────────────────────────────┤
│         数据安全层 (Data)                 │
│  - 数据加密  - 访问控制  - 审计日志      │
├─────────────────────────────────────────┤
│         传输安全层 (Transport)           │
│  - TLS加密  - API安全  - 通信加密        │
├─────────────────────────────────────────┤
│         网络安全层 (Network)             │
│  - 防火墙  - DDoS防护  - 网络隔离       │
├─────────────────────────────────────────┤
│         基础设施层 (Infrastructure)      │
│  - 容器安全  - 主机加固  - 密钥管理      │
└─────────────────────────────────────────┘
```

### 1.4 安全威胁模型

#### 1.4.1 常见威胁类型

- **身份认证攻击**：暴力破解、凭证泄露、会话劫持
- **数据泄露**：敏感数据未加密、访问控制失效
- **注入攻击**：SQL注入、命令注入、LDAP注入
- **跨站脚本攻击(XSS)**：反射型、存储型、DOM型XSS
- **跨站请求伪造(CSRF)**：利用用户身份执行未授权操作
- **拒绝服务攻击(DoS)**：资源耗尽、服务不可用

#### 1.4.2 威胁缓解策略

- 实施多因素认证(MFA)
- 强制HTTPS传输
- 输入验证和输出编码
- CSRF令牌验证
- 速率限制和请求配额
- 实时监控和告警

---

## 2. 认证授权实施

### 2.1 JWT令牌管理

#### 2.1.1 令牌生成配置

**实施路径**: `backend/src/middleware/auth.ts:16-28`

```typescript
// 生成JWT令牌
export const generateToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    issuer: 'yyc3-ai-xiaoyu',
    audience: 'yyc3-ai-xiaoyu-users',
  });
};
```

**配置要点**:
- 令牌有效期: 默认7天，可通过环境变量`JWT_EXPIRES_IN`调整
- 发行者标识: `yyc3-ai-xiaoyu`
- 受众标识: `yyc3-ai-xiaoyu-users`
- 密钥管理: 必须通过环境变量`JWT_SECRET`配置，严禁硬编码

#### 2.1.2 刷新令牌机制

**实施路径**: `backend/src/middleware/auth.ts:30-42`

```typescript
// 生成刷新令牌
export const generateRefreshToken = (payload: JWTPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    issuer: 'yyc3-ai-xiaoyu',
    audience: 'yyc3-ai-xiaoyu-users',
  });
};
```

**配置要点**:
- 刷新令牌有效期: 默认30天
- 与访问令牌使用相同密钥
- 需配合黑名单机制实现令牌撤销

### 2.2 认证中间件配置

#### 2.2.1 标准认证中间件

**实施路径**: `backend/src/middleware/auth.ts:89-127`

```typescript
// 认证中间件
export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);

    if (!token) {
      throw createUnauthorizedError('No token provided');
    }

    const payload = verifyToken(token);
    const user = await getUserById(payload.userId);

    if (!user) {
      throw createUnauthorizedError('User not found');
    }

    // 检查用户是否被激活
    if (!user.is_active) {
      throw createForbiddenError('User account is deactivated');
    }

    // 将用户信息添加到请求对象
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // 记录最后登录时间（异步，不阻塞请求）
    setImmediate(async () => {
      try {
        await db.query(
          'UPDATE users SET last_login_at = NOW() WHERE id = $1',
          [user.id]
        );

        // 清除缓存
        await redis.del(`user:${user.id}`);
      } catch (error) {
        console.error('Error updating last login:', error);
      }
    });

    next();
  } catch (error) {
    next(error);
  }
};
```

**安全特性**:
- 令牌验证与用户状态检查
- 用户缓存机制（Redis，30分钟TTL）
- 异步更新最后登录时间
- 自动清理过期缓存

#### 2.2.2 角色权限控制

**实施路径**: `backend/src/middleware/auth.ts:144-162`

```typescript
// 角色检查中间件工厂
export const requireRole = (roles: string | string[]) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createUnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

// 管理员角色检查
export const requireAdmin = requireRole('admin');

// 家长角色检查
export const requireParent = requireRole('parent');

// 管理员或版主角色检查
export const requireModeratorOrAdmin = requireRole(['admin', 'moderator']);
```

**角色体系**:
- `admin`: 系统管理员，拥有所有权限
- `parent`: 家长用户，管理子女信息
- `moderator`: 内容审核员，审核用户生成内容

### 2.3 密码安全策略

#### 2.3.1 密码复杂度验证

**实施路径**: `backend/src/routes/auth.ts:18-23`

```typescript
body('password')
  .isLength({ min: 8 })
  .withMessage('Password must be at least 8 characters long')
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
```

**密码策略**:
- 最小长度: 8个字符
- 必须包含: 小写字母、大写字母、数字
- 建议添加: 特殊字符（可选）

#### 2.3.2 密码哈希存储

**实施路径**: `backend/src/controllers/authController.ts`

```typescript
import bcrypt from 'bcryptjs';

// 密码哈希
const hashedPassword = await bcrypt.hash(password, 10);

// 密码验证
const isMatch = await bcrypt.compare(password, user.password_hash);
```

**安全配置**:
- 哈希算法: bcrypt
- 工作因子: 10（可根据安全需求调整至12）
- 盐值: 自动生成并嵌入哈希值

---

## 3. 数据加密配置

### 3.1 传输层加密（TLS/SSL）

#### 3.1.1 Nginx SSL配置

**实施路径**: `config/nginx/nginx.conf:147-173`

```nginx
# HTTPS 配置 (生产环境)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name localhost;

    # SSL 配置
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;

    # SSL 优化
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # 其他配置与 HTTP 相同
    include /etc/nginx/conf.d/common.conf;
}
```

**配置要点**:
- 协议版本: 仅支持TLS 1.2和1.3
- 加密套件: 优先使用ECDHE前向安全套件
- 会话缓存: 10MB共享缓存
- HSTS: 强制HTTPS，有效期1年

#### 3.1.2 HTTP到HTTPS重定向

**实施路径**: `config/nginx/nginx.conf:176-181`

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name localhost;
    return 301 https://$server_name$request_uri;
}
```

**安全特性**:
- 永久重定向（301）
- 保留原始请求路径和查询参数

### 3.2 应用层加密

#### 3.2.1 敏感数据加密存储

**实施路径**: `backend/src/utils/encryption.ts`（建议创建）

```typescript
import crypto from 'crypto';

// 加密配置
const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

// 从环境变量获取加密密钥
const getEncryptionKey = (): Buffer => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error('ENCRYPTION_KEY environment variable is not defined');
  }
  return Buffer.from(key, 'hex');
};

// 加密函数
export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = crypto.pbkdf2Sync(
    getEncryptionKey(),
    salt,
    100000,
    KEY_LENGTH,
    'sha512'
  );

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

// 解密函数
export const decrypt = (encryptedData: string): string => {
  const buffer = Buffer.from(encryptedData, 'base64');

  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = buffer.subarray(TAG_POSITION, ENCRYPTED_POSITION);
  const encrypted = buffer.subarray(ENCRYPTED_POSITION);

  const key = crypto.pbkdf2Sync(
    getEncryptionKey(),
    salt,
    100000,
    KEY_LENGTH,
    'sha512'
  );

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final('utf8');
};
```

**加密策略**:
- 算法: AES-256-GCM（认证加密）
- 密钥派生: PBKDF2-SHA512，100,000次迭代
- 随机IV: 每次加密生成新IV
- 认证标签: GCM模式提供完整性保护

#### 3.2.2 数据库连接加密

**实施路径**: `backend/src/config/database.ts`

```typescript
import { Pool } from 'pg';

// 数据库连接池配置
export const db = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT,
  } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

**安全配置**:
- 生产环境强制SSL
- 证书验证: `rejectUnauthorized: true`
- 连接池限制: 最大20个连接

---

## 4. 安全加固策略

### 4.1 Web应用安全头部

#### 4.1.1 Nginx安全头部配置

**实施路径**: `config/nginx/nginx.conf:96-101`

```nginx
# 安全头部
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

**头部说明**:
- `X-Frame-Options`: 防止点击劫持，仅允许同源iframe
- `X-XSS-Protection`: 启用浏览器XSS过滤
- `X-Content-Type-Options`: 防止MIME类型嗅探
- `Referrer-Policy`: 控制Referer信息泄露
- `Content-Security-Policy`: 内容安全策略，防止XSS和数据注入

#### 4.1.2 服务器信息隐藏

**实施路径**: `config/nginx/nginx.conf:43`

```nginx
server_tokens off;
```

**安全效果**:
- 隐藏Nginx版本号
- 减少信息泄露风险

### 4.2 速率限制配置

#### 4.2.1 Nginx速率限制

**实施路径**: `config/nginx/nginx.conf:70-73`

```nginx
# 限流配置
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;
```

**限制策略**:
- API请求: 每秒10次
- 登录请求: 每秒1次
- 存储空间: 每个zone 10MB

#### 4.2.2 应用层速率限制

**实施路径**: `backend/src/middleware/rateLimiter.ts:34-42`

```typescript
// API速率限制器（更严格）
export const apiRateLimiter = createMemoryLimiter({
  windowMs: 60000, // 1分钟
  maxRequests: 60, // 60次请求
});

// 认证相关速率限制器
export const authRateLimiter = createMemoryLimiter({
  windowMs: 900000, // 15分钟
  maxRequests: 5, // 5次认证尝试
});
```

**限制策略**:
- API限流: 60次/分钟
- 认证限流: 5次/15分钟
- 失败阻塞: 窗口时间的2倍

### 4.3 输入验证与过滤

#### 4.3.1 邮箱验证

**实施路径**: `backend/src/routes/auth.ts:10-12`

```typescript
body('email')
  .isEmail()
  .withMessage('Please provide a valid email address')
  .normalizeEmail(),
```

#### 4.3.2 SQL注入防护

**实施路径**: `backend/src/middleware/auth.ts:73-80`

```typescript
const result = await db.query(
  'SELECT id, email, first_name, last_name, phone, avatar_url, role, is_active, email_verified, last_login_at, created_at, updated_at FROM users WHERE id = $1 AND is_active = true',
  [userId]
);
```

**防护措施**:
- 使用参数化查询
- 避免字符串拼接SQL
- 使用ORM工具（如适用）

---

## 5. 漏洞防护措施

### 5.1 XSS防护

#### 5.1.1 内容安全策略（CSP）

**实施路径**: `config/nginx/nginx.conf:101`

```nginx
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
```

**CSP策略**:
- 默认源: 仅允许同源
- 脚本源: 允许内联脚本（开发阶段）
- 数据源: 允许data:和blob:协议

#### 5.1.2 输出编码

**实施路径**: `frontend/src/utils/sanitize.ts`（建议创建）

```typescript
import DOMPurify from 'dompurify';

// HTML净化
export const sanitizeHTML = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

// URL编码
export const encodeURL = (url: string): string => {
  return encodeURIComponent(url);
};
```

### 5.2 CSRF防护

#### 5.2.1 SameSite Cookie配置

**实施路径**: `backend/src/middleware/session.ts`（建议创建）

```typescript
import session from 'express-session';

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24小时
  },
}));
```

**Cookie安全配置**:
- `secure`: 生产环境仅HTTPS传输
- `httpOnly`: 防止JavaScript访问
- `sameSite: strict`: 防止CSRF攻击

### 5.3 文件上传安全

#### 5.3.1 文件类型限制

**实施路径**: `backend/src/middleware/upload.ts`（建议创建）

```typescript
import multer from 'multer';
import path from 'path';

// 允许的文件类型
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// 文件大小限制（10MB）
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'));
    }
    cb(null, true);
  },
});

export const uploadMiddleware = upload.single('file');
```

**安全措施**:
- 限制文件类型（仅图片）
- 限制文件大小（10MB）
- 使用内存存储（避免磁盘遍历）

#### 5.3.2 文件名清理

```typescript
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// 生成安全的文件名
export const generateSafeFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  const basename = path.basename(originalName, ext);
  const sanitized = basename.replace(/[^a-zA-Z0-9]/g, '_');
  return `${uuidv4()}_${sanitized}${ext}`;
};
```

### 5.4 依赖漏洞扫描

#### 5.4.1 自动化扫描配置

**实施路径**: `.github/workflows/security-scan.yml`（建议创建）

```yaml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    - cron: '0 0 * * 0' # 每周日扫描

jobs:
  npm-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm audit --audit-level=moderate
      - run: npm audit fix

  snyk-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

**扫描策略**:
- 每次推送和PR时扫描
- 每周定时扫描
- 自动修复低危漏洞
- 高危漏洞阻断合并

---

## 6. 容器安全加固

### 6.1 容器镜像安全

#### 6.1.1 基础镜像选择

**实施路径**: `Dockerfile:1-3`

```dockerfile
# 使用官方最小化镜像
FROM node:20-alpine AS base

# 设置工作目录
WORKDIR /app

# 创建非root用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 安装安全更新
RUN apk update && apk upgrade --no-cache && \
    apk add --no-cache dumb-init
```

**配置要点**:
- 使用官方认证的基础镜像
- 选择最小化镜像（alpine）
- 避免使用`latest`标签，指定具体版本
- 定期更新基础镜像

#### 6.1.2 容器镜像扫描

**实施路径**: `.github/workflows/container-scan.yml`（建议创建）

```yaml
name: Container Security Scan

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * *'  # 每天扫描

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t yyc3-xy-ai:${{ github.sha }} .

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: yyc3-xy-ai:${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v2
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'
```

**扫描工具推荐**:
- Trivy: 全面的容器安全扫描工具
- Clair: 容器漏洞分析工具
- Docker Scout: Docker官方安全扫描工具

### 6.2 容器运行时安全

#### 6.2.1 容器权限限制

**实施路径**: `docker-compose.yml:15-25`

```yaml
services:
  backend:
    image: yyc3-xy-ai:latest
    restart: unless-stopped
    # 非root用户运行
    user: "1001:1001"
    # 只读文件系统
    read_only: true
    # 临时目录可写
    tmpfs:
      - /tmp
      - /app/logs
    # 资源限制
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
    # 安全选项
    security_opt:
      - no-new-privileges:true
    # 能力限制
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
```

**安全配置要点**:
- 使用非root用户运行容器
- 设置只读文件系统（只读根文件系统）
- 限制容器能力（drop所有，只添加必需的）
- 设置资源限制（CPU、内存）
- 禁用特权模式

#### 6.2.2 网络隔离配置

**实施路径**: `docker-compose.yml:30-40`

```yaml
services:
  backend:
    networks:
      - backend-network
      - frontend-network
    # 禁止容器间直接通信
    network_mode: bridge

  database:
    networks:
      - backend-network
    # 只允许backend访问
    expose:
      - "5432"

networks:
  backend-network:
    driver: bridge
    internal: true  # 内部网络，不访问外网
  frontend-network:
    driver: bridge
```

**网络隔离策略**:
- 创建独立的网络段
- 数据库服务不暴露到公网
- 限制容器间通信
- 使用内部网络隔离敏感服务

### 6.3 容器安全检查清单

```bash
# 容器安全检查脚本
#!/bin/bash

echo "=== 容器安全检查 ==="

# 1. 检查是否以root用户运行
echo "检查容器用户权限..."
docker inspect --format='{{.Config.User}}' yyc3-xy-ai-backend

# 2. 检查特权模式
echo "检查特权模式..."
docker inspect --format='{{.HostConfig.Privileged}}' yyc3-xy-ai-backend

# 3. 检查能力限制
echo "检查容器能力..."
docker inspect --format='{{.HostConfig.CapAdd}}' yyc3-xy-ai-backend
docker inspect --format='{{.HostConfig.CapDrop}}' yyc3-xy-ai-backend

# 4. 检查只读文件系统
echo "检查只读文件系统..."
docker inspect --format='{{.HostConfig.ReadonlyRootfs}}' yyc3-xy-ai-backend

# 5. 检查资源限制
echo "检查资源限制..."
docker inspect --format='{{.HostConfig.Memory}}' yyc3-xy-ai-backend
docker inspect --format='{{.HostConfig.NanoCpus}}' yyc3-xy-ai-backend

echo "=== 检查完成 ==="
```

---

## 7. 密钥管理最佳实践

### 7.1 密钥存储策略

#### 7.1.1 环境变量管理

**实施路径**: `.env.example`

```bash
# JWT配置
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# 数据库配置
DATABASE_URL=postgresql://user:password@localhost:5432/yyc3_xiaoyu
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis配置
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# AI服务配置
OPENAI_API_KEY=sk-your-openai-api-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# 加密密钥
ENCRYPTION_KEY=your-32-character-encryption-key

# OAuth配置
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**安全要求**:
- 所有密钥通过环境变量配置
- `.env`文件添加到`.gitignore`
- 提供`.env.example`模板
- 密钥长度和复杂度符合安全标准
- 定期轮换密钥

#### 7.1.2 密钥轮换策略

**实施路径**: `backend/src/utils/keyRotation.ts`（建议创建）

```typescript
import crypto from 'crypto';

interface KeyRotationConfig {
  keyName: string;
  rotationInterval: number; // 轮换间隔（天）
  warningDays: number; // 提前警告天数
}

class KeyRotationManager {
  private keys: Map<string, { value: string; createdAt: Date; expiresAt: Date }> = new Map();

  /**
   * 生成新密钥
   */
  generateKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * 注册密钥
   */
  registerKey(keyName: string, config: KeyRotationConfig): void {
    const key = this.generateKey();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + config.rotationInterval * 24 * 60 * 60 * 1000);

    this.keys.set(keyName, {
      value: key,
      createdAt: now,
      expiresAt,
    });

    console.log(`密钥 ${keyName} 已注册，过期时间: ${expiresAt.toISOString()}`);
  }

  /**
   * 获取当前密钥
   */
  getCurrentKey(keyName: string): string | null {
    const keyData = this.keys.get(keyName);
    if (!keyData) {
      return null;
    }

    if (new Date() > keyData.expiresAt) {
      console.warn(`密钥 ${keyName} 已过期，需要轮换`);
      return null;
    }

    return keyData.value;
  }

  /**
   * 检查密钥是否需要轮换
   */
  needsRotation(keyName: string, warningDays: number): boolean {
    const keyData = this.keys.get(keyName);
    if (!keyData) {
      return true;
    }

    const warningDate = new Date(keyData.expiresAt.getTime() - warningDays * 24 * 60 * 60 * 1000);
    return new Date() > warningDate;
  }

  /**
   * 轮换密钥
   */
  rotateKey(keyName: string, config: KeyRotationConfig): string {
    const oldKey = this.keys.get(keyName);
    const newKey = this.generateKey();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + config.rotationInterval * 24 * 60 * 60 * 1000);

    this.keys.set(keyName, {
      value: newKey,
      createdAt: now,
      expiresAt,
    });

    console.log(`密钥 ${keyName} 已轮换`);
    
    if (oldKey) {
      console.log(`旧密钥创建时间: ${oldKey.createdAt.toISOString()}`);
    }

    return newKey;
  }
}

export const keyRotationManager = new KeyRotationManager();
```

**轮换策略**:
- JWT密钥: 每90天轮换
- API密钥: 每60天轮换
- 数据库密码: 每180天轮换
- 加密密钥: 每365天轮换

### 7.2 密钥访问控制

#### 7.2.1 最小权限原则

**实施路径**: `backend/src/config/permissions.ts`（建议创建）

```typescript
interface Permission {
  resource: string;
  action: string;
  condition?: (context: any) => boolean;
}

interface Role {
  name: string;
  permissions: Permission[];
}

const roles: Role[] = [
  {
    name: 'admin',
    permissions: [
      { resource: 'keys', action: 'read' },
      { resource: 'keys', action: 'write' },
      { resource: 'keys', action: 'delete' },
      { resource: 'users', action: 'manage' },
    ],
  },
  {
    name: 'developer',
    permissions: [
      { resource: 'keys', action: 'read', condition: (ctx) => ctx.keyType === 'api' },
      { resource: 'logs', action: 'read' },
    ],
  },
  {
    name: 'auditor',
    permissions: [
      { resource: 'keys', action: 'read', condition: (ctx) => ctx.keyType === 'audit' },
      { resource: 'audit-logs', action: 'read' },
    ],
  },
];

export function hasPermission(userRole: string, resource: string, action: string, context?: any): boolean {
  const role = roles.find(r => r.name === userRole);
  if (!role) {
    return false;
  }

  return role.permissions.some(perm => 
    perm.resource === resource && 
    perm.action === action &&
    (!perm.condition || perm.condition(context))
  );
}
```

#### 7.2.2 密钥审计日志

**实施路径**: `backend/src/middleware/keyAudit.ts`（建议创建）

```typescript
import { logger } from '@/config/logger';

interface KeyAccessEvent {
  keyId: string;
  userId: string;
  action: 'read' | 'write' | 'delete' | 'rotate';
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  reason?: string;
}

export function logKeyAccess(event: KeyAccessEvent): void {
  logger.info('Key Access Event', {
    keyId: maskKeyId(event.keyId),
    userId: event.userId,
    action: event.action,
    timestamp: event.timestamp.toISOString(),
    ipAddress: event.ipAddress,
    success: event.success,
    reason: event.reason,
  });
}

function maskKeyId(keyId: string): string {
  if (keyId.length <= 8) {
    return '***';
  }
  return `${keyId.substring(0, 4)}...${keyId.substring(keyId.length - 4)}`;
}

export function auditKeyAccess(req: any, res: any, next: any) {
  const originalSend = res.send;
  
  res.send = function(data) {
    if (req.path.startsWith('/api/keys/')) {
      logKeyAccess({
        keyId: req.params.keyId || 'unknown',
        userId: req.user?.id || 'anonymous',
        action: getActionFromMethod(req.method),
        timestamp: new Date(),
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
        success: res.statusCode < 400,
        reason: res.statusCode >= 400 ? 'Access denied' : undefined,
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
}

function getActionFromMethod(method: string): 'read' | 'write' | 'delete' | 'rotate' {
  switch (method) {
    case 'GET': return 'read';
    case 'POST': return 'write';
    case 'PUT': return 'write';
    case 'PATCH': return 'write';
    case 'DELETE': return 'delete';
    default: return 'read';
  }
}
```

---

## 8. 安全监控与审计

### 8.1 访问日志记录

#### 8.1.1 Nginx详细日志格式

**实施路径**: `config/nginx/nginx.conf:28-33`

```nginx
log_format security_log escape=json '$remote_addr - $remote_user [$time_local] '
    '"$request" $status $body_bytes_sent '
    '"$http_referer" "$http_user_agent" '
    'request_time=$request_time '
    'upstream_response_time=$upstream_response_time '
    'ssl_protocol=$ssl_protocol '
    'ssl_cipher=$ssl_cipher '
    'http_x_forwarded_for=$http_x_forwarded_for';

access_log /var/log/nginx/security.log security_log;
```

**日志字段说明**:
- 客户端IP地址和用户信息
- 请求方法和路径
- 响应状态码和字节数
- 请求时间（总时间、连接时间、头部时间、响应时间）
- SSL协议和加密套件
- 转发IP地址（用于代理场景）

#### 8.1.2 应用安全日志

**实施路径**: `backend/src/config/logger.ts`

```typescript
import winston from 'winston';

const securityLogFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const securityLogger = winston.createLogger({
  level: 'info',
  format: securityLogFormat,
  transports: [
    new winston.transports.File({ 
      filename: 'logs/security.log',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),
  ],
});

interface SecurityEvent {
  eventType: 'auth_success' | 'auth_failure' | 'permission_denied' | 'rate_limit_exceeded';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  details?: Record<string, any>;
}

export function logSecurityEvent(event: SecurityEvent): void {
  securityLogger.info({
    ...event,
    timestamp: event.timestamp.toISOString(),
  });
}
```

### 8.2 异常行为检测

#### 8.2.1 速率限制日志

**实施路径**: `backend/src/middleware/rateLimiter.ts:103-119`

```typescript
import { logSecurityEvent } from '@/config/logger';

export function logRateLimitExceeded(req: any, res: any): void {
  logSecurityEvent({
    eventType: 'rate_limit_exceeded',
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date(),
    details: {
      path: req.path,
      method: req.method,
      limit: req.rateLimit?.limit,
      current: req.rateLimit?.current,
      remaining: req.rateLimit?.remaining,
    },
  });
}
```

#### 8.2.2 失败登录监控

**实施路径**: `backend/src/controllers/authController.ts`（建议添加）

```typescript
import { logSecurityEvent } from '@/config/logger';

interface FailedLoginAttempt {
  email: string;
  ipAddress: string;
  timestamp: Date;
  userAgent: string;
}

const failedLoginAttempts = new Map<string, FailedLoginAttempt[]>();

export function trackFailedLogin(email: string, ipAddress: string, userAgent: string): void {
  const attempts = failedLoginAttempts.get(email) || [];
  attempts.push({
    email,
    ipAddress,
    timestamp: new Date(),
    userAgent,
  });

  // 只保留最近10次失败记录
  if (attempts.length > 10) {
    attempts.shift();
  }

  failedLoginAttempts.set(email, attempts);

  // 记录安全事件
  logSecurityEvent({
    eventType: 'auth_failure',
    ipAddress,
    userAgent,
    timestamp: new Date(),
    details: {
      email,
      attemptCount: attempts.length,
    },
  });

  // 如果5分钟内失败5次，触发告警
  const recentAttempts = attempts.filter(
    a => Date.now() - a.timestamp.getTime() < 5 * 60 * 1000
  );

  if (recentAttempts.length >= 5) {
    console.error(`检测到暴力破解攻击: ${email} from ${ipAddress}`);
    // 触发告警或临时封禁
  }
}
```

### 8.3 安全事件告警

#### 8.3.1 告警规则配置

**实施路径**: `config/prometheus/alerts.yml`（建议创建）

```yaml
groups:
  - name: security_alerts
    interval: 30s
    rules:
      - alert: HighFailedLoginRate
        expr: rate(failed_login_total[5m]) > 10
        for: 1m
        labels:
          severity: critical
          category: security
        annotations:
          summary: "High rate of failed login attempts"
          description: "Failed login rate is {{ $value }} per second"

      - alert: BruteForceAttackDetected
        expr: rate(failed_login_total[1m]) > 50
        for: 1m
        labels:
          severity: critical
          category: security
        annotations:
          summary: "Brute force attack detected"
          description: "Failed login rate is {{ $value }} per second"

      - alert: RateLimitExceeded
        expr: rate(rate_limit_exceeded_total[5m]) > 100
        for: 5m
        labels:
          severity: warning
          category: security
        annotations:
          summary: "High rate of rate limit violations"
          description: "Rate limit violations: {{ $value }} per second"
```

---

## 9. 安全合规性检查

### 9.1 OWASP Top 10 检查

#### 9.1.1 注入攻击检查

**检查项**:
- [ ] SQL注入防护：使用参数化查询
- [ ] 命令注入防护：避免直接执行用户输入
- [ ] LDAP注入防护：验证和清理LDAP查询
- [ ] NoSQL注入防护：使用安全的查询构建器

**验证方法**:
```bash
# 使用OWASP ZAP进行注入测试
zap-cli quick-scan --self-contained --start-options '-config api.disablekey=true' http://localhost:1229

# 手动测试SQL注入
curl -X POST http://localhost:1229/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@yyc3.com" OR "1"="1","password":"test"}'
```

#### 9.1.2 失效的访问控制检查

**检查项**:
- [ ] 水平权限检查：用户只能访问自己的数据
- [ ] 垂直权限检查：普通用户无法访问管理员功能
- [ ] API端点保护：所有敏感端点需要认证
- [ ] 资源所有权验证：验证用户对资源的所有权

**验证方法**:
```typescript
// 水平权限测试
describe('Horizontal Privilege Escalation', () => {
  it('用户A不能访问用户B的数据', async () => {
    const userA = await createTestUser('userA');
    const userB = await createTestUser('userB');
    
    const response = await request(app)
      .get(`/api/users/${userB.id}`)
      .set('Authorization', `Bearer ${userA.token}`);
    
    expect(response.status).toBe(403);
  });
});
```

### 9.2 数据保护合规

#### 9.2.1 GDPR合规检查

**检查项**:
- [ ] 数据最小化：只收集必要的数据
- [ ] 用户同意：明确获取用户同意
- [ ] 数据访问权：用户可以访问自己的数据
- [ ] 数据删除权：用户可以请求删除数据
- [ ] 数据可移植性：用户可以导出数据
- [ ] 数据保护影响评估（DPIA）

**实施示例**:
```typescript
// 数据导出功能
export async function exportUserData(userId: string): Promise<UserDataExport> {
  const user = await userRepository.findById(userId);
  const children = await childRepository.findByUserId(userId);
  const assessments = await assessmentRepository.findByUserId(userId);

  return {
    profile: {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    },
    children: children.map(c => ({
      name: c.name,
      birthDate: c.birthDate,
    })),
    assessments: assessments.map(a => ({
      date: a.date,
      type: a.type,
      score: a.score,
    })),
    exportedAt: new Date(),
  };
}

// 数据删除功能
export async function deleteUserData(userId: string): Promise<void> {
  await assessmentRepository.deleteByUserId(userId);
  await childRepository.deleteByUserId(userId);
  await userRepository.delete(userId);
  
  logSecurityEvent({
    eventType: 'data_deletion',
    userId,
    ipAddress: 'system',
    userAgent: 'system',
    timestamp: new Date(),
  });
}
```

#### 9.2.2 数据加密合规

**检查项**:
- [ ] 传输加密：所有数据传输使用TLS 1.3
- [ ] 存储加密：敏感数据使用AES-256加密
- [ ] 密钥管理：密钥定期轮换
- [ ] 加密算法：使用行业标准的加密算法

### 9.3 安全审计流程

#### 9.3.1 定期安全审计

**审计频率**:
- 代码安全审计：每季度
- 依赖漏洞扫描：每月
- 渗透测试：每半年
- 安全配置审查：每季度

**审计检查清单**:
```markdown
# 安全审计检查清单

## 认证授权
- [ ] 密码策略符合要求
- [ ] 多因素认证已启用
- [ ] 会话管理安全
- [ ] JWT令牌配置正确

## 数据保护
- [ ] 敏感数据已加密
- [ ] 数据备份已配置
- [ ] 数据访问已审计
- [ ] 数据删除已实施

## 网络安全
- [ ] TLS证书有效
- [ ] 安全头部已配置
- [ ] 防火墙规则正确
- [ ] DDoS防护已启用

## 应用安全
- [ ] 输入验证已实施
- [ ] 输出编码已配置
- [ ] CSRF防护已启用
- [ ] XSS防护已配置

## 容器安全
- [ ] 容器镜像已扫描
- [ ] 容器权限已限制
- [ ] 网络隔离已配置
- [ ] 资源限制已设置

## 监控告警
- [ ] 安全日志已启用
- [ ] 告警规则已配置
- [ ] 异常检测已实施
- [ ] 应急响应流程已制定
```

---

## 10. 应急响应流程

### 10.1 安全事件分类

#### 6.2.1 事件发现与确认

```bash
# 检查安全日志
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
tail -f /app/logs/security.log

# 检查异常进程
ps aux | grep -E '(nc|netcat|wget|curl)'

# 检查网络连接
netstat -antp | grep ESTABLISHED
ss -antp | grep ESTABLISHED
```

#### 6.2.2 事件遏制

```bash
# 封禁恶意IP
iptables -A INPUT -s <malicious_ip> -j DROP

# 限制API访问
nginx -s reload

# 暂停受影响服务
docker-compose stop <service_name>
```

#### 6.2.3 根因分析

```bash
# 分析访问日志
grep <malicious_ip> /var/log/nginx/access.log | awk '{print $7}' | sort | uniq

# 检查数据库异常
psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# 检查文件完整性
find /app -type f -mtime -1 -ls
```

#### 6.2.4 恢复与加固

```bash
# 恢复服务
docker-compose start <service_name>

# 验证服务状态
curl -f http://localhost:1229/health || exit 1

# 更新安全配置
# 修改密码、密钥、证书等
```

### 6.3 事后复盘

#### 6.3.1 事件报告模板

```markdown
# 安全事件报告

## 事件概述
- 事件ID: SEC-2025-001
- 事件等级: P0/P1/P2/P3
- 发生时间: YYYY-MM-DD HH:MM:SS
- 发现时间: YYYY-MM-DD HH:MM:SS

## 事件描述
[详细描述事件经过]

## 影响范围
- 受影响系统: [系统列表]
- 受影响用户: [用户数量/范围]
- 数据泄露情况: [是/否，详情]

## 根本原因
[分析根本原因]

## 处理措施
- 立即措施: [已采取的遏制措施]
- 临时措施: [临时解决方案]
- 长期措施: [永久性改进方案]

## 经验教训
[总结经验教训]

## 改进建议
[提出改进建议]
```

---

## 11. 安全加固检查表

### 11.1 五高五标五化安全检查表

#### 11.1.1 高安全性检查

**检查项**:
- [ ] **认证机制**
  - [ ] JWT令牌签名算法使用HS256或RS256
  - [ ] JWT令牌过期时间合理配置（建议7天）
  - [ ] 密码使用bcrypt加密，cost factor >= 10
  - [ ] 实现多因素认证（MFA）
  - [ ] 会话管理使用安全的cookie配置（HttpOnly, Secure, SameSite）

- [ ] **授权机制**
  - [ ] 实现基于角色的访问控制（RBAC）
  - [ ] API端点权限验证完整
  - [ ] 敏感操作需要二次验证
  - [ ] 实现最小权限原则

- [ ] **数据加密**
  - [ ] 传输层使用TLS 1.2或更高版本
  - [ ] 敏感数据使用AES-256加密
  - [ ] 数据库连接使用SSL/TLS
  - [ ] 密钥通过环境变量或密钥管理服务存储

- [ ] **漏洞防护**
  - [ ] 实现XSS防护（输入验证、输出编码）
  - [ ] 实现CSRF防护（CSRF Token）
  - [ ] 实现SQL注入防护（参数化查询）
  - [ ] 实现速率限制（防止暴力破解）
  - [ ] 实现文件上传安全检查

#### 11.1.2 高可用性检查

**检查项**:
- [ ] **服务可用性**
  - [ ] 实现健康检查端点
  - [ ] 配置自动重启策略
  - [ ] 实现负载均衡
  - [ ] 配置故障转移机制

- [ ] **数据备份**
  - [ ] 数据库定期备份（建议每日）
  - [ ] 备份数据加密存储
  - [ ] 实现备份恢复测试
  - [ ] 配置异地备份

#### 11.1.3 高性能检查

**检查项**:
- [ ] **性能优化**
  - [ ] 实现数据库查询优化（索引、缓存）
  - [ ] 实现API响应缓存
  - [ ] 使用CDN加速静态资源
  - [ ] 实现连接池管理

- [ ] **安全性能**
  - [ ] 安全检查不影响核心功能性能
  - [ ] 异步处理安全日志
  - [ ] 实现安全检查的缓存机制

#### 11.1.4 高可扩展性检查

**检查项**:
- [ ] **水平扩展**
  - [ ] 无状态服务设计
  - [ ] 实现服务自动扩缩容
  - [ ] 使用分布式缓存（Redis）
  - [ ] 实现分布式会话管理

- [ ] **安全扩展**
  - [ ] 安全组件可独立扩展
  - [ ] 实现分布式安全审计
  - [ ] 配置集中式密钥管理

#### 11.1.5 高可维护性检查

**检查项**:
- [ ] **代码质量**
  - [ ] 遵循代码规范和最佳实践
  - [ ] 实现安全相关的单元测试
  - [ ] 代码审查包含安全检查
  - [ ] 使用静态代码分析工具

- [ ] **文档管理**
  - [ ] 安全架构文档完整
  - [ ] 安全配置文档清晰
  - [ ] 应急响应流程文档化
  - [ ] 安全变更记录完整

#### 11.1.6 标准化检查

**检查项**:
- [ ] **安全标准**
  - [ ] 遵循OWASP Top 10安全标准
  - [ ] 符合NIST网络安全框架
  - [ ] 遵循CIS安全基准
  - [ ] 符合GDPR数据保护法规

- [ ] **代码标准**
  - [ ] 使用ESLint进行代码检查
  - [ ] 使用Prettier进行代码格式化
  - [ ] 遵循TypeScript类型安全
  - [ ] 使用安全编码规范

#### 11.1.7 规范化检查

**检查项**:
- [ ] **流程规范**
  - [ ] 安全开发流程（SDLC）完整
  - [ ] 代码审查流程包含安全检查
  - [ ] 部署流程包含安全验证
  - [ ] 变更管理流程规范

- [ ] **配置规范**
  - [ ] 环境变量配置规范
  - [ ] 密钥管理规范
  - [ ] 日志记录规范
  - [ ] 告警规则规范

#### 11.1.8 自动化检查

**检查项**:
- [ ] **安全自动化**
  - [ ] 自动化依赖漏洞扫描
  - [ ] 自动化安全测试
  - [ ] 自动化安全配置检查
  - [ ] 自动化安全合规审计

- [ ] **部署自动化**
  - [ ] CI/CD流水线包含安全检查
  - [ ] 自动化安全配置部署
  - [ ] 自动化密钥轮换
  - [ ] 自动化安全更新

#### 11.1.9 智能化检查

**检查项**:
- [ ] **智能监控**
  - [ ] 实现异常行为检测
  - [ ] 实现威胁情报集成
  - [ ] 实现自动化安全分析
  - [ ] 实现智能告警

- [ ] **智能防护**
  - [ ] 实现自适应访问控制
  - [ ] 实现智能风险评估
  [ ] 实现自动化响应机制

#### 11.1.10 可视化检查

**检查项**:
- [ ] **安全可视化**
  - [ ] 实现安全仪表板
  - [ ] 实现安全事件可视化
  - [ ] 实现安全趋势分析
  - [ ] 实现安全报告生成

- [ ] **监控可视化**
  - [ ] 实现实时监控大屏
  - [ ] 实现告警可视化
  - [ ] 实现性能指标可视化

#### 11.1.11 流程化检查

**检查项**:
- [ ] **安全流程**
  - [ ] 安全需求分析流程
  - [ ] 安全设计评审流程
  - [ ] 安全测试流程
  - [ ] 安全运维流程

- [ ] **应急流程**
  - [ ] 安全事件响应流程
  - [ ] 漏洞修复流程
  - [ ] 灾难恢复流程

#### 11.1.12 文档化检查

**检查项**:
- [ ] **安全文档**
  - [ ] 安全策略文档
  - [ ] 安全架构文档
  - [ ] 安全配置文档
  - [ ] 安全操作手册

- [ ] **审计文档**
  - [ ] 安全审计报告
  - [ ] 合规性评估报告
  - [ ] 风险评估报告

#### 11.1.13 工具化检查

**检查项**:
- [ ] **安全工具**
  - [ ] 依赖扫描工具（npm audit, Snyk）
  - [ ] 静态分析工具（ESLint, SonarQube）
  - [ ] 动态测试工具（OWASP ZAP）
  - [ ] 容器安全工具（Trivy, Clair）

- [ ] **监控工具**
  - [ ] 日志分析工具（ELK Stack）
  - [ ] 监控告警工具（Prometheus, Grafana）
  - [ ] 性能分析工具（New Relic, Datadog）

#### 11.1.14 数字化检查

**检查项**:
- [ ] **数字资产管理**
  - [ ] 数字资产清单
  - [ ] 数字资产分类
  - [ ] 数字资产价值评估

- [ ] **数字身份管理**
  - [ ] 数字身份认证
  - [ ] 数字身份授权
  - [ ] 数字身份审计

#### 11.1.15 生态化检查

**检查项**:
- [ ] **安全生态**
  - [ ] 集成威胁情报平台
  - [ ] 集成安全社区资源
  - [ ] 参与安全标准制定
  - [ ] 建立安全合作伙伴关系

- [ ] **技术生态**
  - [ ] 使用开源安全组件
  - [ ] 参与开源安全项目
  - [ ] 贡献安全最佳实践

### 11.2 安全配置检查清单

#### 11.2.1 认证授权配置

```bash
# 检查JWT配置
echo "检查JWT配置..."
grep -r "JWT_SECRET" .env
grep -r "JWT_EXPIRES_IN" .env

# 检查密码策略
echo "检查密码策略..."
grep -r "bcrypt" backend/src
grep -r "password.*min" backend/src

# 检查RBAC配置
echo "检查RBAC配置..."
ls -la backend/src/middleware/auth*
ls -la backend/src/utils/role*
```

**检查项**:
- [ ] JWT_SECRET已配置且长度 >= 32字符
- [ ] JWT_EXPIRES_IN已配置（建议7d）
- [ ] 密码使用bcrypt加密，cost factor >= 10
- [ ] 实现RBAC中间件
- [ ] 敏感API端点有权限验证

#### 11.2.2 数据加密配置

```bash
# 检查TLS配置
echo "检查TLS配置..."
grep -r "tls" nginx/nginx.conf
grep -r "ssl" nginx/nginx.conf

# 检查加密密钥
echo "检查加密密钥..."
grep -r "ENCRYPTION_KEY" .env

# 检查数据库SSL
echo "检查数据库SSL..."
grep -r "sslmode" .env
```

**检查项**:
- [ ] TLS证书已配置且有效
- [ ] 使用TLS 1.2或更高版本
- [ ] ENCRYPTION_KEY已配置且长度 >= 32字符
- [ ] 数据库连接使用SSL/TLS
- [ ] 敏感数据使用AES-256加密

#### 11.2.3 安全头部配置

```bash
# 检查安全头部
echo "检查安全头部..."
grep -r "X-Frame-Options" nginx/nginx.conf
grep -r "X-Content-Type-Options" nginx/nginx.conf
grep -r "X-XSS-Protection" nginx/nginx.conf
grep -r "Content-Security-Policy" nginx/nginx.conf
grep -r "Strict-Transport-Security" nginx/nginx.conf
```

**检查项**:
- [ ] X-Frame-Options已配置（DENY或SAMEORIGIN）
- [ ] X-Content-Type-Options已配置（nosniff）
- [ ] X-XSS-Protection已配置（1; mode=block）
- [ ] Content-Security-Policy已配置
- [ ] Strict-Transport-Security已配置

#### 11.2.4 速率限制配置

```bash
# 检查速率限制
echo "检查速率限制..."
grep -r "rateLimit" backend/src
grep -r "limit_req" nginx/nginx.conf
```

**检查项**:
- [ ] API速率限制已配置（建议100 req/min）
- [ ] 登录速率限制已配置（建议5 req/min）
- [ ] IP白名单/黑名单已配置
- [ ] 分布式速率限制已实现

#### 11.2.5 输入验证配置

```bash
# 检查输入验证
echo "检查输入验证..."
grep -r "zod" backend/src
grep -r "joi" backend/src
grep -r "validator" backend/src
```

**检查项**:
- [ ] 所有用户输入已验证
- [ ] 使用schema验证库（zod/joi）
- [ ] 实现输入清理和转义
- [ ] 文件上传已验证类型和大小

#### 11.2.6 容器安全配置

```bash
# 检查容器安全
echo "检查容器安全..."
docker inspect --format='{{.Config.User}}' yyc3-xy-ai-backend
docker inspect --format='{{.HostConfig.Privileged}}' yyc3-xy-ai-backend
docker inspect --format='{{.HostConfig.ReadonlyRootfs}}' yyc3-xy-ai-backend
```

**检查项**:
- [ ] 容器不以root用户运行
- [ ] 容器不使用特权模式
- [ ] 容器文件系统只读（如适用）
- [ ] 容器资源限制已配置
- [ ] 容器网络已隔离

#### 11.2.7 密钥管理配置

```bash
# 检查密钥管理
echo "检查密钥管理..."
ls -la .env
ls -la .env.example
grep -r "process.env" backend/src
```

**检查项**:
- [ ] .env文件已添加到.gitignore
- [ ] .env.example已提供
- [ ] 密钥通过环境变量配置
- [ ] 密钥轮换策略已实现
- [ ] 密钥访问日志已记录

#### 11.2.8 日志监控配置

```bash
# 检查日志配置
echo "检查日志配置..."
ls -la backend/src/utils/logger*
grep -r "winston" backend/src
grep -r "pino" backend/src
```

**检查项**:
- [ ] 安全日志已启用
- [ ] 日志级别已配置（建议info）
- [ ] 日志轮转已配置
- [ ] 敏感信息已脱敏
- [ ] 告警规则已配置

#### 11.2.9 备份恢复配置

```bash
# 检查备份配置
echo "检查备份配置..."
ls -la scripts/backup*
crontab -l | grep backup
```

**检查项**:
- [ ] 数据库定期备份已配置
- [ ] 备份数据加密存储
- [ ] 备份恢复测试已执行
- [ ] 异地备份已配置
- [ ] 备份保留策略已制定

#### 11.2.10 应急响应配置

```bash
# 检查应急响应配置
echo "检查应急响应配置..."
ls -la docs/incident-response*
ls -la scripts/emergency*
```

**检查项**:
- [ ] 应急响应流程已制定
- [ ] 应急联系人列表已更新
- [ ] 应急工具已准备
- [ ] 应急演练已执行
- [ ] 事件报告模板已准备

### 11.3 安全合规检查清单

#### 11.3.1 OWASP Top 10合规检查

**检查项**:
- [ ] **A01:2021 - 访问控制失效**
  - [ ] 实现适当的认证和授权机制
  - [ ] 验证用户权限
  - [ ] 实现会话管理

- [ ] **A02:2021 - 加密失效**
  - [ ] 使用强加密算法
  - [ ] 实现TLS/SSL
  - [ ] 安全存储密钥

- [ ] **A03:2021 - 注入**
  - [ ] 使用参数化查询
  - [ ] 实现输入验证
  - [ ] 使用ORM框架

- [ ] **A04:2021 - 不安全设计**
  - [ ] 实现威胁建模
  - [ ] 进行安全设计评审
  - [ ] 实现最小权限原则

- [ ] **A05:2021 - 安全配置错误**
  - [ ] 移除默认账户
  - [ ] 禁用不必要的服务
  - [ ] 定期更新软件

- [ ] **A06:2021 - 易受攻击和过时的组件**
  - [ ] 定期更新依赖
  - [ ] 扫描依赖漏洞
  - [ ] 移除未使用的依赖

- [ ] **A07:2021 - 身份识别和身份验证失败**
  - [ ] 实现强密码策略
  - [ ] 实现多因素认证
  - [ ] 实现账户锁定机制

- [ ] **A08:2021 - 软件和数据完整性失效**
  - [ ] 实现代码签名
  - [ ] 验证数据完整性
  - [ ] 实现安全更新机制

- [ ] **A09:2021 - 安全日志和监控失效**
  - [ ] 实现安全日志记录
  - [ ] 实现监控告警
  - [ ] 定期审计日志

- [ ] **A10:2021 - 服务端请求伪造（SSRF）**
  - [ ] 验证和清理URL
  - [ ] 限制网络访问
  - [ ] 实现白名单机制

#### 11.3.2 GDPR合规检查

**检查项**:
- [ ] **数据保护原则**
  - [ ] 数据最小化原则
  - [ ] 数据准确性原则
  - [ ] 数据存储限制原则

- [ ] **用户权利**
  - [ ] 数据访问权
  - [ ] 数据更正权
  - [ ] 数据删除权
  - [ ] 数据可携带权

- [ ] **数据安全**
  - [ ] 数据加密
  - [ ] 访问控制
  - [ ] 数据备份
  - [ ] 安全审计

- [ ] **合规文档**
  - [ ] 隐私政策
  - [ ] 数据处理协议
  - [ ] 数据影响评估
  - [ ] 数据泄露通知流程

#### 11.3.3 NIST网络安全框架合规检查

**检查项**:
- [ ] **识别（Identify）**
  - [ ] 资产管理
  - [ ] 商业环境
  - [ ] 治理
  - [ ] 风险评估
  - [ ] 风险管理策略

- [ ] **保护（Protect）**
  - [ ] 访问控制
  - [ ] 意识和培训
  - [ ] 数据安全
  - [ ] 信息保护流程和程序
  - [ ] 维护
  - [ ] 保护技术

- [ ] **检测（Detect）**
  - [ ] 异常和事件
  - [ ] 安全连续监控
  - [ ] 检测过程

- [ ] **响应（Respond）**
  - [ ] 响应计划
  - [ ] 通信
  - [ ] 分析
  - [ ] 缓解
  - [ ] 改进

- [ ] **恢复（Recover）**
  - [ ] 恢复计划
  - [ ] 改进
  - [ ] 通信

---

## 12. 常见安全问题排查

### 12.1 认证授权问题排查

#### 12.1.1 JWT令牌验证失败

**问题描述**: 用户登录后，API请求返回401 Unauthorized错误

**排查步骤**:

1. **检查JWT配置**
```bash
# 检查JWT_SECRET是否配置
grep JWT_SECRET .env

# 检查JWT_EXPIRES_IN是否配置
grep JWT_EXPIRES_IN .env

# 验证JWT_SECRET长度
echo $JWT_SECRET | wc -c
```

2. **检查JWT令牌生成**
```typescript
// backend/src/utils/jwt.ts
import jwt from 'jsonwebtoken';

export const generateToken = (payload: any): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  console.log('JWT_SECRET length:', secret.length);
  console.log('JWT_SECRET:', secret.substring(0, 10) + '...');
  
  return jwt.sign(payload, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
```

3. **检查JWT令牌验证**
```typescript
// backend/src/middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('Verifying token with JWT_SECRET length:', secret.length);
    
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

4. **测试JWT令牌**
```bash
# 生成测试令牌
curl -X POST http://localhost:1229/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 使用令牌访问受保护端点
curl -X GET http://localhost:1229/api/users/profile \
  -H "Authorization: Bearer <token>"
```

**解决方案**:
- 确保JWT_SECRET已配置且长度 >= 32字符
- 确保JWT_EXPIRES_IN已配置（建议7d）
- 确保JWT_SECRET在所有环境中一致
- 检查令牌是否过期

#### 12.1.2 密码哈希验证失败

**问题描述**: 用户登录时，密码验证失败

**排查步骤**:

1. **检查密码哈希配置**
```typescript
// backend/src/utils/password.ts
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  console.log('Verifying password...');
  console.log('Password length:', password.length);
  console.log('Hash:', hash.substring(0, 20) + '...');
  
  const result = await bcrypt.compare(password, hash);
  console.log('Verification result:', result);
  
  return result;
};
```

2. **检查用户注册流程**
```typescript
// backend/src/services/userService.ts
export const createUser = async (userData: any) => {
  const { email, password, name } = userData;
  
  console.log('Creating user:', email);
  
  // 检查邮箱是否已存在
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw new Error('Email already exists');
  }
  
  // 哈希密码
  const hashedPassword = await hashPassword(password);
  console.log('Password hashed successfully');
  
  // 创建用户
  const user = await userRepository.create({
    email,
    password: hashedPassword,
    name,
  });
  
  console.log('User created:', user.id);
  return user;
};
```

3. **测试密码哈希**
```bash
# 测试密码哈希
node -e "
const bcrypt = require('bcrypt');
const password = 'password123';
bcrypt.hash(password, 10).then(hash => {
  console.log('Hash:', hash);
  bcrypt.compare(password, hash).then(result => {
    console.log('Verification:', result);
  });
});
"
```

**解决方案**:
- 确保使用bcrypt进行密码哈希
- 确保cost factor >= 10
- 确保密码在存储前已哈希
- 检查密码长度和复杂度要求

#### 12.1.3 权限验证失败

**问题描述**: 用户访问API时返回403 Forbidden错误

**排查步骤**:

1. **检查RBAC配置**
```typescript
// backend/src/middleware/rbac.ts
export const requireRole = (...roles: string[]) => {
  return (req: any, res: any, next: any) => {
    const user = req.user;
    
    console.log('User role:', user.role);
    console.log('Required roles:', roles);
    
    if (!user || !user.role) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};
```

2. **检查用户角色分配**
```typescript
// backend/src/services/userService.ts
export const assignRole = async (userId: string, role: string) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  console.log('Assigning role:', role, 'to user:', userId);
  
  await userRepository.update(userId, { role });
  
  console.log('Role assigned successfully');
  return user;
};
```

3. **测试权限验证**
```bash
# 测试管理员权限
curl -X GET http://localhost:1229/api/admin/users \
  -H "Authorization: Bearer <admin_token>"

# 测试普通用户权限
curl -X GET http://localhost:1229/api/admin/users \
  -H "Authorization: Bearer <user_token>"
```

**解决方案**:
- 确保用户角色正确分配
- 确保RBAC中间件正确实现
- 确保API端点有适当的权限验证
- 检查角色定义和权限映射

### 12.2 数据加密问题排查

#### 12.2.1 TLS/SSL连接失败

**问题描述**: 客户端无法建立HTTPS连接

**排查步骤**:

1. **检查证书配置**
```bash
# 检查证书文件
ls -la /etc/nginx/ssl/
cat /etc/nginx/ssl/cert.pem
cat /etc/nginx/ssl/key.pem

# 检查证书有效期
openssl x509 -in /etc/nginx/ssl/cert.pem -noout -dates
```

2. **检查Nginx配置**
```nginx
# nginx/nginx.conf
server {
  listen 443 ssl http2;
  server_name api.yyc3-xiaoyu.com;

  ssl_certificate /etc/nginx/ssl/cert.pem;
  ssl_certificate_key /etc/nginx/ssl/key.pem;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers HIGH:!aNULL:!MD5;
  ssl_prefer_server_ciphers on;

  location / {
    proxy_pass http://backend:1229;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

3. **测试TLS连接**
```bash
# 测试TLS连接
openssl s_client -connect api.yyc3-xiaoyu.com:443 -servername api.yyc3-xiaoyu.com

# 检查TLS配置
nmap --script ssl-enum-ciphers -p 443 api.yyc3-xiaoyu.com
```

**解决方案**:
- 确保证书有效且未过期
- 确保证书链完整
- 确保使用TLS 1.2或更高版本
- 检查证书和私钥匹配

#### 12.2.2 数据加密失败

**问题描述**: 敏感数据加密/解密失败

**排查步骤**:

1. **检查加密配置**
```typescript
// backend/src/utils/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

export const encrypt = (text: string): string => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 characters');
  }

  const salt = crypto.randomBytes(SALT_LENGTH);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);

  const encrypted = Buffer.concat([
    cipher.update(text, 'utf8'),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
};

export const decrypt = (encryptedData: string): string => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 characters');
  }

  const buffer = Buffer.from(encryptedData, 'base64');

  const salt = buffer.subarray(0, SALT_LENGTH);
  const iv = buffer.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = buffer.subarray(TAG_POSITION, ENCRYPTED_POSITION);
  const encrypted = buffer.subarray(ENCRYPTED_POSITION);

  const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(key), iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final('utf8');
};
```

2. **测试加密/解密**
```bash
# 测试加密
node -e "
const { encrypt, decrypt } = require('./backend/src/utils/encryption');
const text = 'Hello, World!';
const encrypted = encrypt(text);
console.log('Encrypted:', encrypted);
const decrypted = decrypt(encrypted);
console.log('Decrypted:', decrypted);
"
```

**解决方案**:
- 确保ENCRYPTION_KEY已配置且长度为32字符
- 确保使用AES-256-GCM算法
- 确保IV和Tag正确处理
- 检查加密/解密流程一致性

### 12.3 漏洞防护问题排查

#### 12.3.1 XSS攻击检测

**问题描述**: 检测到潜在的XSS漏洞

**排查步骤**:

1. **检查输入验证**
```typescript
// backend/src/middleware/xss.ts
import DOMPurify from 'isomorphic-dompurify';

export const sanitizeInput = (input: string): string => {
  console.log('Sanitizing input:', input);
  const sanitized = DOMPurify.sanitize(input);
  console.log('Sanitized output:', sanitized);
  return sanitized;
};
```

2. **检查输出编码**
```typescript
// backend/src/utils/html.ts
import escape from 'escape-html';

export const escapeHtml = (unsafe: string): string => {
  console.log('Escaping HTML:', unsafe);
  const escaped = escape(unsafe);
  console.log('Escaped output:', escaped);
  return escaped;
};
```

3. **测试XSS防护**
```bash
# 测试XSS攻击
curl -X POST http://localhost:1229/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"<script>alert(1)</script>"}'
```

**解决方案**:
- 实现输入验证和清理
- 实现输出编码
- 使用CSP头部
- 实现X-XSS-Protection头部

#### 12.3.2 CSRF攻击检测

**问题描述**: 检测到潜在的CSRF漏洞

**排查步骤**:

1. **检查CSRF Token实现**
```typescript
// backend/src/middleware/csrf.ts
import crypto from 'crypto';

export const generateCsrfToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const validateCsrfToken = (token: string, sessionToken: string): boolean => {
  console.log('Validating CSRF token...');
  console.log('Token:', token);
  console.log('Session token:', sessionToken);
  
  const result = token === sessionToken;
  console.log('Validation result:', result);
  
  return result;
};
```

2. **检查CSRF中间件**
```typescript
// backend/src/middleware/csrf.ts
export const csrfMiddleware = (req: any, res: any, next: any) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const token = req.headers['x-csrf-token'];
  const sessionToken = req.session.csrfToken;

  if (!token || !sessionToken || !validateCsrfToken(token, sessionToken)) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }

  next();
};
```

3. **测试CSRF防护**
```bash
# 测试CSRF防护
curl -X POST http://localhost:1229/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User"}'
```

**解决方案**:
- 实现CSRF Token生成和验证
- 使用SameSite Cookie属性
- 实现CSRF中间件
- 检查敏感操作的CSRF保护

#### 12.3.3 SQL注入检测

**问题描述**: 检测到潜在的SQL注入漏洞

**排查步骤**:

1. **检查参数化查询**
```typescript
// backend/src/repositories/userRepository.ts
import { Pool } from 'pg';

export const findByEmail = async (email: string) => {
  const pool = new Pool();
  
  console.log('Finding user by email:', email);
  
  // 使用参数化查询
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  
  console.log('Query result:', result.rows.length);
  
  return result.rows[0];
};
```

2. **检查ORM使用**
```typescript
// backend/src/repositories/userRepository.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const findByEmail = async (email: string) => {
  console.log('Finding user by email:', email);
  
  // 使用ORM查询
  const user = await prisma.user.findUnique({
    where: { email },
  });
  
  console.log('Query result:', user ? 'found' : 'not found');
  
  return user;
};
```

3. **测试SQL注入**
```bash
# 测试SQL注入
curl -X POST http://localhost:1229/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com\' OR \'1\'=\'1","password":"password"}'
```

**解决方案**:
- 使用参数化查询
- 使用ORM框架
- 实现输入验证
- 避免字符串拼接SQL

### 12.4 性能问题排查

#### 12.4.1 安全检查影响性能

**问题描述**: 安全检查导致API响应时间过长

**排查步骤**:

1. **检查安全检查性能**
```typescript
// backend/src/middleware/performance.ts
export const performanceMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
    
    if (duration > 1000) {
      console.warn('Slow request detected:', req.path);
    }
  });
  
  next();
};
```

2. **优化安全检查**
```typescript
// backend/src/middleware/cache.ts
const cache = new Map();

export const cacheMiddleware = (req: any, res: any, next: any) => {
  const key = req.originalUrl;
  
  if (cache.has(key)) {
    console.log('Cache hit:', key);
    return res.json(cache.get(key));
  }
  
  const originalJson = res.json.bind(res);
  res.json = (data: any) => {
    cache.set(key, data);
    console.log('Cache set:', key);
    return originalJson(data);
  };
  
  next();
};
```

**解决方案**:
- 实现安全检查缓存
- 异步处理安全日志
- 优化数据库查询
- 使用CDN加速静态资源

### 12.5 监控告警问题排查

#### 12.5.1 安全告警未触发

**问题描述**: 安全事件发生时未收到告警

**排查步骤**:

1. **检查告警配置**
```yaml
# prometheus/alerts.yml
groups:
  - name: security_alerts
    interval: 30s
    rules:
      - alert: HighFailedLoginRate
        expr: rate(failed_login_total[5m]) > 10
        for: 1m
        labels:
          severity: critical
          category: security
        annotations:
          summary: "High rate of failed login attempts"
          description: "Failed login rate is {{ $value }} per second"
```

2. **检查告警路由**
```yaml
# alertmanager/alertmanager.yml
route:
  group_by: ['alertname', 'severity']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 12h
  receiver: 'default'

receivers:
  - name: 'default'
    email_configs:
      - to: 'security@yyc3-xiaoyu.com'
        from: 'alertmanager@yyc3-xiaoyu.com'
        smarthost: 'smtp.gmail.com:587'
        auth_username: 'alertmanager@yyc3-xiaoyu.com'
        auth_password: 'your-password'
```

3. **测试告警**
```bash
# 触发测试告警
curl -X POST http://localhost:1229/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

# 检查告警状态
curl http://localhost:9093/api/v1/alerts
```

**解决方案**:
- 确保告警规则正确配置
- 确保告警路由正确配置
- 检查告警通知渠道
- 测试告警触发条件

---

## 附录

### A. 安全配置检查清单

- [ ] JWT密钥已通过环境变量配置
- [ ] SSL/TLS证书已配置且有效
- [ ] 所有安全头部已启用
- [ ] 速率限制已配置
- [ ] 输入验证已实施
- [ ] 密码复杂度策略已启用
- [ ] 文件上传限制已配置
- [ ] 安全日志已启用
- [ ] 告警规则已配置
- [ ] 应急响应流程已制定

### B. 安全工具推荐

| 工具类型 | 推荐工具 | 用途 |
|---------|---------|------|
| 依赖扫描 | npm audit, Snyk | 检测依赖漏洞 |
| 静态分析 | ESLint, SonarQube | 代码质量检查 |
| 动态测试 | OWASP ZAP | 渗透测试 |
| 容器安全 | Trivy, Clair | 容器镜像扫描 |
| 日志分析 | ELK Stack, Splunk | 日志分析与监控 |
| WAF | ModSecurity, AWS WAF | Web应用防火墙 |

### C. 参考资源

- OWASP Top 10: https://owasp.org/www-project-top-ten/
- NIST Cybersecurity Framework: https://www.nist.gov/cyberframework
- CIS Benchmarks: https://www.cisecurity.org/cis-benchmarks
- JWT Best Practices: https://tools.ietf.org/html/rfc8725

---

**文档版本历史**

| 版本 | 日期 | 修改内容 | 修改人 |
|------|------|---------|--------|
| V1.0 | 2025-12-25 | 初始版本创建 | YYC³ Team |

---

**文档审核记录**

| 审核人 | 审核日期 | 审核结论 | 备注 |
|--------|---------|---------|------|
| - | - | - | - |

---

**文档归档信息**

- 归档路径: `/docs/YYC3-XY-架构设计/技巧类/07-YYC3-XY-技巧类-安全加固实施手册.md`
- 归档日期: 2025-12-25
- 归档人: YYC³ Team
