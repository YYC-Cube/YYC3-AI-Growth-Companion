# 环境变量配置文档

## 📋 概述

本文档详细说明小语智能成长守护系统所需的所有环境变量配置，包括不同环境的配置策略和最佳实践。

---

## 📁 配置文件说明

### 文件列表

| 文件名 | 环境 | 说明 |
|--------|------|------|
| `.env.sample` | 模板 | 环境变量配置模板，包含所有可用变量 |
| `.env.development` | 开发 | 本地开发环境配置 |
| `.env.test` | 测试 | 测试环境配置 |
| `.env.production` | 生产 | 生产环境配置（包含敏感信息） |
| `.env` | 当前 | 当前环境配置（不提交到Git） |

### 使用方法

```bash
# 1. 复制模板文件
cp .env.sample .env

# 2. 编辑配置
vim .env  # 或使用任何文本编辑器

# 3. 验证配置
npm run validate:env  # 验证环境变量是否正确

# 4. 启动应用
npm run dev          # 开发环境
npm run dev:test     # 测试环境
npm run start        # 生产环境
```

---

## 🔧 配置分类详解

### 1. 环境配置

#### NODE_ENV

- **类型**: `string`
- **可选值**: `development` | `test` | `production`
- **默认值**: `development`
- **说明**: 应用运行环境
- **示例**:

  ```env
  NODE_ENV=production
  ```

#### APP_NAME

- **类型**: `string`
- **默认值**: `XiaoYu_Growth_Guardian`
- **说明**: 应用名称
- **示例**:

  ```env
  APP_NAME=XiaoYu_Growth_Guardian_Dev
  ```

#### APP_VERSION

- **类型**: `string`
- **默认值**: `1.0.0`
- **说明**: 应用版本号
- **示例**:

  ```env
  APP_VERSION=1.0.0
  ```

---

### 2. 服务器配置

#### PORT

- **类型**: `number`
- **默认值**: `4000`
- **说明**: 后端服务器端口
- **建议**:
  - 开发环境: `4000`
  - 测试环境: `4001`
  - 生产环境: `80` 或 `443`

#### VITE_PORT

- **类型**: `number`
- **默认值**: `5173`
- **说明**: 前端开发服务器端口

#### CORS_ORIGIN

- **类型**: `string` (逗号分隔)
- **说明**: 允许的跨域来源
- **示例**:

  ```env
  CORS_ORIGIN=http://localhost:5173,http://localhost:3000
  ```

- **⚠️ 安全提示**: 生产环境必须指定具体域名，不要使用 `*`

---

### 3. 数据库配置

#### MONGODB_URI

- **类型**: `string`
- **格式**: `mongodb://[username:password@]host[:port]/database[?options]`
- **说明**: MongoDB连接字符串
- **示例**:

  ```env
  # 开发环境
  MONGODB_URI=mongodb://localhost:27017/xiaoyu_dev
  
  # 生产环境（副本集）
  MONGODB_URI=mongodb://user:pass@host1:27017,host2:27017,host3:27017/xiaoyu?replicaSet=rs0
  ```

#### MONGODB_DB_NAME

- **类型**: `string`
- **默认值**: `xiaoyu_growth_guardian`
- **说明**: 数据库名称
- **建议**:
  - 开发环境: `xiaoyu_dev`
  - 测试环境: `xiaoyu_test`
  - 生产环境: `xiaoyu_production`

---

### 4. AI服务配置

#### OPENAI_API_KEY

- **类型**: `string`
- **必需**: ✅ 是
- **说明**: OpenAI API密钥
- **获取**: [OpenAI Platform](https://platform.openai.com/api-keys)
- **示例**:

  ```env
  OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxx
  ```

- **⚠️ 安全提示**:
  - 切勿提交到版本控制
  - 定期轮换密钥
  - 限制API额度

#### OPENAI_MODEL

- **类型**: `string`
- **默认值**: `gpt-4-turbo-preview`
- **可选值**:
  - `gpt-4-turbo-preview` (最强，推荐)
  - `gpt-4` (稳定)
  - `gpt-3.5-turbo` (经济)
- **说明**: 使用的OpenAI模型

#### OPENAI_TEMPERATURE

- **类型**: `number`
- **范围**: `0.0 - 2.0`
- **默认值**: `0.7`
- **说明**: 生成文本的随机性
  - `0.0`: 确定性最高
  - `1.0`: 平衡
  - `2.0`: 创造性最高

---

### 5. Qdrant 向量数据库配置

#### QDRANT_URL

- **类型**: `string`
- **默认值**: `http://localhost:6333`
- **说明**: Qdrant服务器地址
- **示例**:

  ```env
  QDRANT_URL=http://localhost:6333
  ```

#### QDRANT_API_KEY

- **类型**: `string`
- **必需**: 生产环境必需
- **说明**: Qdrant API密钥

#### QDRANT_COLLECTION_NAME

- **类型**: `string`
- **默认值**: `xiaoyu_knowledge_base`
- **说明**: 向量集合名称

---

### 6. 认证和安全配置

#### JWT_SECRET

- **类型**: `string`
- **必需**: ✅ 是
- **长度**: 最少64字符
- **说明**: JWT签名密钥
- **生成方法**:

  ```bash
  # 使用OpenSSL生成
  openssl rand -base64 64
  
  # 使用Node.js生成
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- **⚠️ 安全提示**:
  - 使用强随机字符串
  - 不同环境使用不同密钥
  - 切勿提交到版本控制
  - 定期轮换（需要用户重新登录）

#### JWT_EXPIRES_IN

- **类型**: `string`
- **默认值**: `7d`
- **格式**:
  - `s`: 秒
  - `m`: 分钟
  - `h`: 小时
  - `d`: 天
- **示例**:

  ```env
  JWT_EXPIRES_IN=7d       # 7天
  JWT_EXPIRES_IN=24h      # 24小时
  JWT_EXPIRES_IN=3600s    # 3600秒
  ```

#### BCRYPT_ROUNDS

- **类型**: `number`
- **默认值**: `10`
- **说明**: 密码加密轮次
- **建议**:
  - 开发环境: `10`
  - 生产环境: `12-14`
- **注意**: 数值越大越安全，但加密时间越长

---

### 7. Redis配置

#### REDIS_ENABLED

- **类型**: `boolean`
- **默认值**: `false`
- **说明**: 是否启用Redis
- **用途**:
  - Session存储
  - 缓存
  - 队列

#### REDIS_HOST

- **类型**: `string`
- **默认值**: `localhost`
- **说明**: Redis主机地址

#### REDIS_PORT

- **类型**: `number`
- **默认值**: `6379`
- **说明**: Redis端口

---

### 8. 文件存储配置

#### STORAGE_TYPE

- **类型**: `string`
- **可选值**: `local` | `s3` | `oss`
- **默认值**: `local`
- **说明**: 文件存储类型
- **建议**:
  - 开发环境: `local`
  - 生产环境: `oss` 或 `s3`

#### MAX_FILE_SIZE

- **类型**: `number` (字节)
- **默认值**: `10485760` (10MB)
- **说明**: 文件最大大小
- **转换**:

  ```
  1MB = 1048576 字节
  10MB = 10485760 字节
  50MB = 52428800 字节
  ```

#### ALLOWED_FILE_TYPES

- **类型**: `string` (逗号分隔)
- **默认值**: `image/jpeg,image/png,image/gif,image/webp,video/mp4,audio/mpeg`
- **说明**: 允许上传的文件类型

---

### 9. 日志配置

#### LOG_LEVEL

- **类型**: `string`
- **可选值**: `error` | `warn` | `info` | `debug`
- **默认值**: `info`
- **说明**: 日志级别
- **建议**:
  - 开发环境: `debug`
  - 测试环境: `info`
  - 生产环境: `warn`

#### LOG_PATH

- **类型**: `string`
- **默认值**: `./logs`
- **说明**: 日志文件路径
- **建议**: 生产环境使用绝对路径 `/var/log/xiaoyu`

---

### 10. 前端环境变量 (VITE_前缀)

#### VITE_API_BASE_URL

- **类型**: `string`
- **必需**: ✅ 是
- **说明**: API基础URL
- **示例**:

  ```env
  # 开发环境
  VITE_API_BASE_URL=http://localhost:4000/api
  
  # 生产环境
  VITE_API_BASE_URL=https://api.xiaoyu.com/api
  ```

#### VITE_WS_URL

- **类型**: `string`
- **必需**: ✅ 是
- **说明**: WebSocket服务器地址
- **示例**:

  ```env
  VITE_WS_URL=http://localhost:4000
  ```

---

### 11. 功能开关

所有功能开关都是 `boolean` 类型，使用 `true` 或 `false`。

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `ENABLE_CULTURAL_HERITAGE` | `true` | 文化传承模块 |
| `ENABLE_PREDICTION` | `true` | 预测分析 |
| `ENABLE_RAG` | `true` | RAG知识检索 |
| `ENABLE_SMART_REPORTS` | `true` | 智能报告 |
| `ENABLE_REALTIME_NOTIFICATIONS` | `true` | 实时通知 |
| `ENABLE_COLLABORATION` | `false` | 多用户协作（未来） |
| `ENABLE_PAYMENT` | `false` | 付费功能（未来） |

---

## 🔒 安全最佳实践

### 1. 环境变量保护

```bash
# 添加到 .gitignore
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.sample" >> .gitignore
```

### 2. 密钥管理

**开发环境**:

```bash
# 使用本地 .env 文件
cp .env.sample .env
```

**生产环境**:

```bash
# 使用密钥管理服务
# AWS Secrets Manager
# Azure Key Vault
# Google Secret Manager
# HashiCorp Vault
```

### 3. 密钥生成

```bash
# JWT密钥
openssl rand -base64 64

# Session密钥
openssl rand -base64 32

# 加密密钥
openssl rand -hex 32
```

### 4. 定期轮换

- JWT密钥: 每6个月
- API密钥: 每3个月
- 数据库密码: 每年

---

## 🚀 部署配置

### Docker部署

使用 `docker-compose.yml` 管理环境变量:

```yaml
version: '3.8'

services:
  backend:
    build: .
    env_file:
      - .env.production
    environment:
      - NODE_ENV=production
```

### Kubernetes部署

使用 ConfigMap 和 Secret:

```yaml
# ConfigMap（非敏感信息）
apiVersion: v1
kind: ConfigMap
metadata:
  name: xiaoyu-config
data:
  NODE_ENV: "production"
  PORT: "4000"

---

# Secret（敏感信息）
apiVersion: v1
kind: Secret
metadata:
  name: xiaoyu-secret
type: Opaque
stringData:
  MONGODB_URI: "mongodb://..."
  OPENAI_API_KEY: "sk-..."
  JWT_SECRET: "..."
```

---

## ✅ 环境变量验证

### 手动验证

```bash
# 检查必需变量
npm run validate:env
```

### 代码验证

```typescript
// apps/server/src/config/validate.ts
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.string().transform(Number),
  MONGODB_URI: z.string().url(),
  OPENAI_API_KEY: z.string().min(20),
  JWT_SECRET: z.string().min(64),
  // ... 更多验证
})

export function validateEnv() {
  try {
    envSchema.parse(process.env)
    console.log('✅ Environment variables validated')
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    process.exit(1)
  }
}
```

---

## 🐛 常见问题

### 1. 环境变量未生效

**问题**: 修改了 `.env` 文件但没有生效

**解决**:

```bash
# 重启开发服务器
npm run dev

# 或清除缓存
rm -rf node_modules/.cache
npm run dev
```

### 2. VITE_前缀变量

**问题**: 前端无法访问环境变量

**解决**: 前端环境变量必须以 `VITE_` 开头

```env
# ✅ 正确
VITE_API_BASE_URL=http://localhost:4000/api

# ❌ 错误（前端无法访问）
API_BASE_URL=http://localhost:4000/api
```

### 3. MongoDB连接失败

**问题**: `MongoServerError: Authentication failed`

**检查**:

```bash
# 1. 检查连接字符串
echo $MONGODB_URI

# 2. 测试连接
mongosh "$MONGODB_URI"

# 3. 检查用户权限
db.getUsers()
```

### 4. OpenAI API失败

**问题**: `Error: OpenAI API key is invalid`

**检查**:

```bash
# 1. 验证API key格式
echo $OPENAI_API_KEY | wc -c  # 应该大于20

# 2. 测试API
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"
```

---

## 📋 环境变量检查清单

### 开发环境

- [ ] `NODE_ENV=development`
- [ ] `MONGODB_URI` 指向本地数据库
- [ ] `OPENAI_API_KEY` 已配置
- [ ] `JWT_SECRET` 已设置
- [ ] `CORS_ORIGIN` 包含 `localhost:5173`
- [ ] `LOG_LEVEL=debug`

### 测试环境

- [ ] `NODE_ENV=test`
- [ ] 使用独立的测试数据库
- [ ] 所有必需变量已配置
- [ ] 启用监控和日志
- [ ] Redis已启用

### 生产环境

- [ ] `NODE_ENV=production`
- [ ] 所有密钥使用强随机字符串
- [ ] `COOKIE_SECURE=true`
- [ ] `ENABLE_HTTPS=true`
- [ ] SSL证书已配置
- [ ] 数据库使用副本集
- [ ] Redis已启用
- [ ] 文件存储使用云服务
- [ ] 监控和告警已启用
- [ ] 定期备份已配置
- [ ] `DEBUG=false`
- [ ] `ENABLE_API_DOCS=false`

---

## 📚 相关文档

- [部署指南](./03-DEPLOYMENT.md)
- [系统架构](./01-ARCHITECTURE.md)
- [开发指南](./04-DEVELOPMENT.md)

---

**文档版本**: v1.0  
**最后更新**: 2024年11月26日  
**维护者**: YYC³ Team
