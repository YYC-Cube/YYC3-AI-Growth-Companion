# P2优先级功能集成指南

> **更新日期**: 2024年11月26日  
> **状态**: 功能已实现，需要安装依赖和配置

---

## 📋 功能清单

### ✅ 已实现功能

1. **语音波形可视化组件** - `VoiceWaveform.tsx`
2. **Redis分布式缓存** - `RedisCache.ts`, `CacheSync.ts`
3. **分布式追踪（OpenTelemetry）** - `TracingSetup.ts`, `TraceMiddleware.ts`

---

## 🔧 安装依赖

### 后端依赖（apps/server）

```bash
cd apps/server
npm install redis
npm install @opentelemetry/sdk-node @opentelemetry/auto-instrumentations-node @opentelemetry/exporter-otlp-http @opentelemetry/api @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-base
```

### 前端依赖（apps/web）

语音波形可视化组件使用浏览器原生API，**无需额外依赖**。

---

## 📝 配置说明

### 1. Redis缓存配置

在 `.env` 文件中添加：

```env
# Redis配置
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### 2. OpenTelemetry追踪配置

在 `.env` 文件中添加：

```env
# OpenTelemetry追踪配置
ENABLE_TRACING=true
SERVICE_NAME=xiaoyu-ai
SERVICE_VERSION=1.0.0
OTLP_ENDPOINT=http://localhost:4318
```

---

## 🚀 使用指南

### 1. 语音波形可视化组件

#### 在VoiceRecorder中使用

```tsx
import { VoiceWaveform } from '../components/VoiceWaveform'

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecognize,
  // ...其他props
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(false)

  const startRecording = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    setStream(mediaStream)
    setIsRecording(true)
  }

  return (
    <div>
      {/* 波形可视化 */}
      <VoiceWaveform
        audioSource={stream}
        isActive={isRecording}
        color="#3b82f6"
        backgroundColor="#f3f4f6"
        height={100}
        showGrid={true}
      />
      
      {/* 其他UI */}
    </div>
  )
}
```

#### 在VoicePlayer中使用

```tsx
import { VoiceWaveform } from '../components/VoiceWaveform'
import { useRef } from 'react'

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  text,
  // ...其他props
}) => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div>
      {/* 波形可视化 */}
      {audioRef.current && (
        <VoiceWaveform
          audioSource={audioRef.current}
          isActive={isPlaying}
          color="#10b981"
          height={80}
        />
      )}
      
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        src={audioUrl}
      />
    </div>
  )
}
```

---

### 2. Redis分布式缓存

#### 基本使用

```typescript
import { RedisCache } from './cache/RedisCache'

// 创建Redis缓存实例
const cache = new RedisCache({
  redisUrl: 'redis://localhost:6379',
  enableSync: true,
  maxSize: 10000,
  ttl: 3600000, // 1小时
})

// 设置缓存
cache.set('user:123', { name: '小语', age: 3 }, 3600000)

// 获取缓存
const user = cache.get('user:123')

// 删除缓存
cache.delete('user:123')

// 清空缓存
cache.clear()

// 获取统计信息
const stats = cache.getStats()
console.log('缓存命中率:', stats.hitRate)

// 健康检查
const isHealthy = await cache.healthCheck()
```

#### 在MusicService中使用

```typescript
import { RedisCache } from '../cache/RedisCache'

export class MusicService {
  private searchCache: RedisCache<MusicTrack[]>

  constructor() {
    // 使用Redis缓存替代本地缓存
    this.searchCache = new RedisCache<MusicTrack[]>({
      redisUrl: process.env.REDIS_URL,
      enableSync: true,
      maxSize: 500,
      ttl: 3600000,
    })
  }

  async searchMusic(query: string, limit: number = 10): Promise<MusicTrack[]> {
    const cacheKey = `search_${query}_${limit}`
    
    // 从Redis缓存获取
    const cached = this.searchCache.get(cacheKey)
    if (cached) {
      return cached
    }

    // 执行搜索...
    const results = await this.performSearch(query, limit)
    
    // 写入Redis缓存
    this.searchCache.set(cacheKey, results)
    
    return results
  }
}
```

#### 缓存同步

```typescript
import { CacheSync } from './cache/CacheSync'

// 创建缓存同步管理器
const cacheSync = new CacheSync({
  redisUrl: 'redis://localhost:6379',
  channel: 'xiaoyu:cache:sync',
})

// 订阅缓存更新事件
await cacheSync.subscribeUpdates((data) => {
  console.log('缓存更新:', data.key, data.operation)
  // 处理缓存更新
})

// 发布缓存更新
await cacheSync.publishUpdate('user:123', 'set')
```

---

### 3. 分布式追踪（OpenTelemetry）

#### 初始化追踪（在应用启动时）

```typescript
// apps/server/src/index.ts
import { initTracing, shutdownTracing } from './monitoring/tracing/TracingSetup'
import { traceMiddleware } from './monitoring/tracing/TraceMiddleware'

// 在应用启动时初始化
initTracing({
  serviceName: 'xiaoyu-ai',
  serviceVersion: '1.0.0',
  otlpEndpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4318',
  enabled: process.env.ENABLE_TRACING === 'true',
})

// 在Express中使用追踪中间件
app.use(traceMiddleware)

// 应用关闭时清理
process.on('SIGTERM', async () => {
  await shutdownTracing()
  process.exit(0)
})
```

#### 创建自定义Span

```typescript
import { createSpan } from './monitoring/tracing/TraceMiddleware'

// 在业务逻辑中创建span
async function processMusicRecommendation(userId: string) {
  return createSpan('music.recommendation', async (span) => {
    span.setAttributes({
      'user.id': userId,
      'recommendation.type': 'emotion',
    })

    // 执行推荐逻辑
    const result = await musicService.recommendMusicByEmotion({
      emotion: 'happy',
      ageRange: '0-3',
    })

    span.setAttributes({
      'recommendation.count': result.tracks.length,
      'recommendation.confidence': result.confidence,
    })

    return result
  })
}
```

#### 追踪配置示例（Jaeger）

如果需要使用Jaeger作为追踪后端：

1. **启动Jaeger**（使用Docker）:

```bash
docker run -d --name jaeger \
  -e COLLECTOR_OTLP_ENABLED=true \
  -p 16686:16686 \
  -p 4317:4317 \
  -p 4318:4318 \
  jaegertracing/all-in-one:latest
```

2. **访问Jaeger UI**: <http://localhost:16686>

3. **配置OTLP端点**:

```env
OTLP_ENDPOINT=http://localhost:4318
```

---

## 🧪 测试

### 测试语音波形可视化

```tsx
import { render, screen } from '@testing-library/react'
import { VoiceWaveform } from './VoiceWaveform'

test('renders waveform component', () => {
  render(<VoiceWaveform isActive={true} />)
  const canvas = screen.getByRole('img', { hidden: true })
  expect(canvas).toBeInTheDocument()
})
```

### 测试Redis缓存

```typescript
import { RedisCache } from './cache/RedisCache'

describe('RedisCache', () => {
  let cache: RedisCache<string>

  beforeEach(() => {
    cache = new RedisCache({
      redisUrl: 'redis://localhost:6379',
      enableSync: false, // 测试时禁用同步
    })
  })

  afterEach(async () => {
    await cache.close()
  })

  test('should set and get value', () => {
    cache.set('test', 'value')
    expect(cache.get('test')).toBe('value')
  })
})
```

### 测试分布式追踪

```typescript
import { initTracing } from './monitoring/tracing/TracingSetup'

describe('Tracing', () => {
  beforeAll(() => {
    initTracing({
      enabled: true,
      serviceName: 'test-service',
    })
  })

  test('should create span', async () => {
    // 测试span创建
  })
})
```

---

## 🔍 故障排查

### Redis连接失败

**问题**: Redis连接失败，缓存降级到本地

**解决方案**:

1. 检查Redis服务是否运行: `redis-cli ping`
2. 检查连接配置是否正确
3. 检查防火墙设置
4. Redis连接失败时会自动降级到本地缓存，不影响功能

### OpenTelemetry追踪不工作

**问题**: 追踪数据没有发送到后端

**解决方案**:

1. 检查 `ENABLE_TRACING` 环境变量是否为 `true`
2. 检查OTLP端点是否可访问
3. 检查Jaeger或其他追踪后端是否运行
4. 查看控制台日志是否有错误信息

### 语音波形不显示

**问题**: 波形组件不显示或不动画

**解决方案**:

1. 检查浏览器是否支持Web Audio API
2. 检查音频源是否正确传递
3. 检查 `isActive` prop是否为 `true`
4. 检查浏览器控制台是否有错误

---

## 📊 性能优化建议

### Redis缓存优化

1. **合理设置TTL**: 根据数据更新频率设置合适的过期时间
2. **使用连接池**: 生产环境建议使用Redis连接池
3. **监控缓存命中率**: 定期检查缓存统计信息
4. **设置最大内存**: 防止Redis内存溢出

### 追踪性能优化

1. **采样率**: 生产环境建议设置采样率（如10%）
2. **批量导出**: 使用BatchSpanProcessor批量导出span
3. **异步处理**: 追踪不应阻塞主业务流程

---

## 📚 相关文档

- [Redis官方文档](https://redis.io/docs/)
- [OpenTelemetry文档](https://opentelemetry.io/docs/)
- [Web Audio API文档](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

**文档版本**: v1.0  
**最后更新**: 2024年11月26日
