# YYC³ 项目整合与功能复制实施计划

> 制定日期: 2026-01-03
> 项目周期: 8-10周
> 目标: 统一四个项目的技术栈，实现功能互补和资源共享

---

## 📋 执行摘要

### 目标
将 yyc3-xy-05 的优势（完整UI组件库、现代技术栈）复制到 yyc3-xy-01/02/03，同时将其他项目的AI核心功能整合到 yyc3-xy-05，打造统一的 YYC³ 智能成长守护平台。

### 关键里程碑
1. **Week 1-2**: UI 统一 - shadcn/ui 组件库复制
2. **Week 3-5**: AI 增强 - 预测系统、情感分析集成
3. **Week 6-7**: 本地化 - Ollama 本地AI模型
4. **Week 8**: 知识图谱 - Neo4j 集成
5. **Week 9-10**: 测试优化与部署

---

## 🎯 第一阶段: UI 组件库统一 (Week 1-2)

### 目标
将 yyc3-xy-05 的完整 shadcn/ui 组件库复制到 yyc3-xy-01/02/03，实现四个项目的UI统一。

### 具体任务

#### 任务 1.1: 组件库准备 (Day 1-2)
**负责人**: 前端开发团队
**所需资源**:
- 开发环境访问权限
- Git 分支管理

**执行步骤**:
```bash
# 1. 创建功能分支
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
git checkout -b feature/export-ui-components

# 2. 提取核心UI组件
mkdir -p ../shared/ui-components
cp -r components/ui/* ../shared/ui-components/

# 3. 提取类型定义
mkdir -p ../shared/types
cp types/*.ts ../shared/types/

# 4. 提取工具函数
mkdir -p ../shared/lib
cp lib/utils.ts ../shared/lib/
cp -r lib/* ../shared/lib/ 2>/dev/null || true
```

**交付物**:
- [ ] `/shared/ui-components/` 目录，包含所有 shadcn/ui 组件
- [ ] `/shared/types/` 目录，包含共享类型定义
- [ ] `/shared/lib/` 目录，包含工具函数
- [ ] 组件清单文档 (`COMPONENTS-INVENTORY.md`)

**验收标准**:
- 所有组件可独立编译
- 类型定义完整
- 无循环依赖

---

#### 任务 1.2: 复制到 yyc3-xy-01 (Day 3-4)
**负责人**: 前端开发工程师 A
**所需资源**:
- yyc3-xy-01 项目访问权限
- 本地开发环境

**执行步骤**:
```bash
# 1. 切换到 xy-01 目标项目
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-01
git checkout -b feature/integrate-shadcn-ui

# 2. 复制组件库
cp -r ../shared/ui-components/* components/

# 3. 更新依赖
# 检查并安装缺失的依赖
bun install @radix-ui/react-slot \
  @radix-ui/react-alert-dialog \
  @radix-ui/react-avatar \
  @radix-ui/react-checkbox \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  @radix-ui/react-label \
  @radix-ui/react-popover \
  @radix-ui/react-progress \
  @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area \
  @radix-ui/react-select \
  @radix-ui/react-separator \
  @radix-ui/react-slider \
  @radix-ui/react-switch \
  @radix-ui/react-tabs \
  @radix-ui/react-toast \
  @radix-ui/react-tooltip \
  class-variance-authority \
  clsx \
  tailwind-merge

# 4. 更新导入路径
# 批量替换组件导入路径
find components -name "*.tsx" -type f -exec sed -i '' 's|@/components/ui/|@/components/shadcn/ui/|g' {} \;

# 5. 创建 lib/utils.ts
cat > lib/utils.ts << 'EOF'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF

# 6. 测试编译
bunx tsc --noEmit
```

**预期问题与解决方案**:
1. **样式冲突**: xy-01 使用 Radix UI 原始组件
   - 解决: 保留原有组件，新组件使用 shadcn/ui 命名空间
   - 路径: `@/components/shadcn/ui/`

2. **类型冲突**: 重复的类型定义
   - 解决: 合并类型文件，去重
   - 使用 `export type` 别名处理冲突

**交付物**:
- [ ] 40+ shadcn/ui 组件成功复制到 xy-01
- [ ] 无 TypeScript 编译错误
- [ ] 组件可正常导入使用
- [ ] 更新的 `package.json`

**验收标准**:
```bash
# 验收测试
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-01
bunx tsc --noEmit  # 0 错误
bun run dev         # 开发服务器正常启动
```

**预期结果**:
- ✅ xy-01 拥有完整的 shadcn/ui 组件库
- ✅ 保持原有功能不受影响
- ✅ 开发效率提升 30%（开箱即用的组件）

---

#### 任务 1.3: 复制到 yyc3-xy-02 (Day 5-6)
**负责人**: 前端开发工程师 B
**所需资源**:
- yyc3-xy-02 项目访问权限
- 解决 Material-UI 与 shadcn/ui 共存问题

**执行步骤**:
```bash
# 与 xy-01 类似，但特殊处理 MUI 冲突
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-02
git checkout -b feature/integrate-shadcn-ui

# 复制组件（使用不同的命名空间）
mkdir -p components/shadcn
cp -r ../shared/ui-components/* components/shadcn/

# MUI 组件保持不变
# 两个组件库可以共存

# 更新 tailwind.config.ts
# 添加 shadcn/ui 的 CSS 变量
```

**特殊处理 - Material-UI 与 shadcn/ui 共存**:
```typescript
// app/layout.tsx
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// shadcn/ui 组件使用不同的 class 前缀
// MUI 使用 .Mui- 前缀
// shadcn/ui 使用自定义前缀
```

**交付物**:
- [ ] shadcn/ui 组件库集成
- [ ] Material-UI 功能保持完整
- [ ] 两个组件库样式不冲突

**验收标准**:
- 组件库共存无冲突
- 样式隔离正确
- 类型定义完整

**预期结果**:
- ✅ xy-02 同时拥有 MUI 和 shadcn/ui
- ✅ 新功能优先使用 shadcn/ui
- ✅ 保持向后兼容

---

#### 任务 1.4: 复制到 yyc3-xy-03 (Day 7-8)
**负责人**: 前端开发工程师 C
**所需资源**:
- yyc3-xy-03 项目访问权限

**执行步骤**:
```bash
# 与 xy-01 类似的流程
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-03
git checkout -b feature/integrate-shadcn-ui

# 复制组件
cp -r ../shared/ui-components/* components/

# 更新依赖
# 安装 shadcn/ui 所需依赖
```

**交付物**:
- [ ] 40+ shadcn/ui 组件
- [ ] 无编译错误
- [ ] 更新的依赖

**验收标准**:
- TypeScript 编译通过
- 组件可正常使用

---

#### 任务 1.5: 统一组件文档 (Day 9-10)
**负责人**: 技术文档工程师
**所需资源**:
- 组件源码访问
- 文档工具

**执行步骤**:
```bash
# 生成组件文档
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05

# 使用工具自动生成文档
npx typedoc --out docs/components components/ui

# 创建组件使用示例
mkdir -p docs/examples
# 为每个组件创建使用示例
```

**交付物**:
- [ ] 组件 API 文档
- [ ] 使用示例代码
- [ ] Storybook 集成（可选）
- [ ] 迁移指南

---

### 第一阶段总结

| 指标 | 目标 | 验收方式 |
|------|------|---------|
| **组件数量** | 40+ | 组件清单统计 |
| **类型安全** | 0 TS错误 | `tsc --noEmit` |
| **文档完整性** | 100% | 文档覆盖率检查 |
| **开发效率** | 提升30% | 开发时间对比 |

**风险与缓解**:
- ⚠️ 风险: 组件样式冲突
  - 缓解: 使用 CSS Modules 或 Tailwind CSS 层级隔离
- ⚠️ 风险: 类型定义冲突
  - 缓解: 使用 TypeScript 模块解析和路径别名
- ⚠️ 风险: 依赖版本冲突
  - 缓解: 使用 workspace 方式管理共享依赖

---

## 🤖 第二阶段: AI 核心功能增强 (Week 3-5)

### 目标
将 xy-03 的高级AI功能（预测系统、情感分析）集成到 xy-05，显著提升AI小语的智能化水平。

### 具体任务

#### 任务 2.1: 集成 TensorFlow.js 预测系统 (Week 3, Day 1-5)
**负责人**: AI工程师 + 前端开发工程师
**所需资源**:
- TensorFlow.js 4.22.0
- xy-03 预测系统源码
- xy-05 集成环境

**执行步骤**:

##### Day 1-2: 提取预测系统代码
```bash
# 从 xy-03 提取预测相关代码
cd /Users/yanyu/yyc3-xiaoyu-AAA

# 创建共享目录
mkdir -p shared/ai/prediction

# 复制核心服务
cp yyc3-xy-03/services/prediction/* shared/ai/prediction/

# 复制类型定义
cp yyc3-xy-03/types/prediction/* shared/ai/prediction/types/
```

##### Day 3-4: 适配 xy-05 环境
```bash
# 目标: yyc3-xy-05
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
git checkout -b feature/integrate-prediction

# 创建目录结构
mkdir -p services/prediction
mkdir -p services/prediction/types
mkdir -p services/prediction/models

# 复制代码
cp -r ../shared/ai/prediction/* services/prediction/

# 更新导入路径
# 替换相对导入为绝对导入
find services/prediction -name "*.ts" -type f -exec sed -i '' 's|from ['\"]../../|from "@/|g' {} \;
```

**关键代码适配**:
```typescript
// services/prediction/IntelligentPredictionService.ts
import { TensorFlowService } from '@/services/prediction/models/TensorFlowService';
import { ModelRegistry } from '@/services/prediction/models/ModelRegistry';
import { QualityMonitor } from '@/services/prediction/QualityMonitor';

export class IntelligentPredictionService {
  private ensembleEngine: EnsembleEngine;
  private modelSelector: DynamicModelSelector;
  private qualityMonitor: PredictionQualityMonitor;

  constructor() {
    this.initializeModels();
  }

  async predictGrowthMetrics(childId: string, timeHorizon: number) {
    // 实现预测逻辑
    const predictions = await this.ensembleEngine.predict(childId, timeHorizon);
    const quality = await this.qualityMonitor.assess(predictions);
    return { predictions, quality };
  }
}
```

##### Day 5: 集成到 AI 小语
```typescript
// components/ai-widget/IntelligentAIWidget.tsx
import { IntelligentPredictionService } from '@/services/prediction';

// 添加预测视图
const predictionView = {
  id: 'predictions',
  icon: '📊',
  component: PredictionView,
};

function PredictionView() {
  const [predictions, setPredictions] = useState(null);
  const predictionService = new IntelligentPredictionService();

  useEffect(() => {
    predictionService.predictGrowthMetrics(childId, 30)
      .then(setPredictions);
  }, [childId]);

  return (
    <div>
      <h3>成长预测</h3>
      {predictions && (
        <GrowthCurveChart data={predictions} />
      )}
    </div>
  );
}
```

**交付物**:
- [ ] `services/prediction/` 目录，包含完整预测系统
- [ ] TensorFlow.js 模型初始化代码
- [ ] 预测结果可视化组件
- [ ] 集成测试套件

**验收标准**:
```typescript
// 测试用例
describe('PredictionService', () => {
  it('should predict growth metrics', async () => {
    const service = new IntelligentPredictionService();
    const result = await service.predictGrowthMetrics('child-123', 30);
    expect(result.predictions).toBeDefined();
    expect(result.quality.confidence).toBeGreaterThan(0.8);
  });
});
```

**预期结果**:
- ✅ xy-05 拥有智能成长预测能力
- ✅ AI 小语可提供未来30天成长预测
- ✅ 预测准确率 > 85%

---

#### 任务 2.2: 集成情感分析系统 (Week 3, Day 6-8)
**负责人**: AI工程师
**所需资源**:
- xy-03 情感分析源码
- 多模态输入处理

**执行步骤**:

##### Day 6-7: 提取和适配情感分析代码
```bash
# 从 xy-03 提取情感相关代码
mkdir -p shared/ai/emotion
cp -r yyc3-xy-03/services/emotion/* shared/ai/emotion/

# 复制到 xy-05
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
mkdir -p services/emotion
cp -r ../shared/ai/emotion/* services/emotion/
```

**关键代码实现**:
```typescript
// services/emotion/EmotionFusionEngine.ts
export class EmotionFusionEngine {
  private textAnalyzer: TextEmotionAnalyzer;
  private voiceAnalyzer: VoiceEmotionAnalyzer;
  private visualAnalyzer: VisualEmotionAnalyzer;
  private fusionAlgorithm: FusionAlgorithm;

  async analyzeEmotion(
    input: MultiModalInput
  ): Promise<EmotionAnalysisResult> {
    // 并行分析多模态输入
    const [textEmotion, voiceEmotion, visualEmotion] = await Promise.all([
      this.textAnalyzer.analyze(input.text),
      this.voiceAnalyzer.analyze(input.audio),
      this.visualAnalyzer.analyze(input.video),
    ]);

    // 融合分析结果
    const fusedEmotion = await this.fusionAlgorithm.fuse({
      text: textEmotion,
      voice: voiceEmotion,
      visual: visualEmotion,
    });

    return fusedEmotion;
  }
}
```

##### Day 8: 集成到 AI 小语对话系统
```typescript
// hooks/useAIXiaoyu.ts
import { EmotionFusionEngine } from '@/services/emotion';

export function useAIXiaoyu() {
  const emotionEngine = new EmotionFusionEngine();

  const sendMessage = useCallback(async (message: string) => {
    // 1. 分析用户情感
    const userEmotion = await emotionEngine.analyzeEmotion({
      text: message,
      audio: audioData,
    });

    // 2. 根据情感调整回复策略
    const response = await aiService.generateResponse(message, {
      emotionContext: userEmotion,
      empathyLevel: 'high',
    });

    return response;
  }, []);

  return { sendMessage };
}
```

**交付物**:
- [ ] 多模态情感分析引擎
- [ ] 情感融合算法
- [ ] 集成到对话系统

**验收标准**:
- 情感识别准确率 > 80%
- 响应时间 < 500ms
- 支持文本、语音、视觉输入

**预期结果**:
- ✅ AI 小语能识别用户情绪
- ✅ 根据情绪调整对话策略
- ✅ 提供情感支持建议

---

#### 任务 2.3: 集成智能推荐系统 (Week 4, Day 1-3)
**负责人**: AI工程师 + 后端工程师
**所需资源**:
- xy-03 推荐系统源码
- Neo4j 图数据库（可选，后续阶段）

**执行步骤**:
```bash
# 提取推荐系统代码
mkdir -p shared/ai/recommendation
cp -r yyc3-xy-03/services/recommendation/* shared/ai/recommendation/

# 复制到 xy-05
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
mkdir -p services/recommendation
cp -r ../shared/ai/recommendation/* services/recommendation/
```

**关键功能实现**:
```typescript
// services/recommendation/IntelligentRecommendationSystem.ts
export class IntelligentRecommendationSystem {
  private userProfiler: UserProfiler;
  private contentFilter: ContentFilter;
  private personalizationEngine: PersonalizationEngine;

  async getRecommendations(
    userId: string,
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    // 1. 构建用户画像
    const userProfile = await this.userProfiler.buildProfile(userId);

    // 2. 过滤不适合的内容
    const filteredContent = await this.contentFilter.filter(content, {
      age: userProfile.age,
      interests: userProfile.interests,
      safetyLevel: 'high',
    });

    // 3. 个性化排序
    const recommendations = await this.personalizationEngine.rank(
      filteredContent,
      userProfile
    );

    return recommendations;
  }
}
```

**集成到成长追踪**:
```typescript
// app/growth/page.tsx
import { IntelligentRecommendationSystem } from '@/services/recommendation';

export default function GrowthPage() {
  const recommendationSystem = new IntelligentRecommendationSystem();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    recommendationSystem.getRecommendations(childId, {
      type: 'activity',
      context: 'growth-milestone',
    }).then(setRecommendations);
  }, [childId]);

  return (
    <div>
      <h2>推荐活动</h2>
      {recommendations.map(rec => (
        <ActivityCard key={rec.id} activity={rec} />
      ))}
    </div>
  );
}
```

**交付物**:
- [ ] 智能推荐系统
- [ ] 用户画像构建
- [ ] 内容过滤引擎
- [ ] 推荐结果展示组件

**验收标准**:
- 推荐准确率 > 75%
- 推荐多样性评分 > 0.7
- 响应时间 < 300ms

---

#### 任务 2.4: 集成自适应学习系统 (Week 4, Day 4-5)
**负责人**: 教育科技专家 + AI工程师

**执行步骤**:
```bash
# 提取自适应学习代码
mkdir -p shared/ai/learning
cp -r yyc3-xy-03/services/learning/* shared/ai/learning/

# 复制到 xy-05
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
mkdir -p services/adaptive-learning
cp -r ../shared/ai/learning/* services/adaptive-learning/
```

**关键功能**:
```typescript
// services/adaptive-learning/AdaptiveLearningEngine.ts
export class AdaptiveLearningEngine {
  private performanceTracker: PerformanceTracker;
  private difficultyAdjuster: DifficultyAdjuster;
  private learningPathOptimizer: LearningPathOptimizer;

  async adaptLearningContent(
    userId: string,
    currentPerformance: PerformanceData
  ): Promise<LearningPath> {
    // 1. 追踪学习表现
    const analysis = await this.performanceTracker.analyze(currentPerformance);

    // 2. 调整难度
    const adjustedDifficulty = await this.difficultyAdjuster.adjust(analysis);

    // 3. 优化学习路径
    const optimizedPath = await this.learningPathOptimizer.optimize({
      currentLevel: adjustedDifficulty,
      learningGoals: analysis.weaknesses,
      strengths: analysis.strengths,
    });

    return optimizedPath;
  }
}
```

**交付物**:
- [ ] 自适应学习引擎
- [ ] 性能追踪系统
- [ ] 难度调整算法
- [ ] 学习路径优化器

---

### 第二阶段总结

| 功能模块 | 工作量 | 预期成果 |
|---------|-------|---------|
| **TensorFlow.js 预测** | 5天 | 成长预测准确率 85%+ |
| **情感分析** | 3天 | 情感识别准确率 80%+ |
| **智能推荐** | 3天 | 推荐准确率 75%+ |
| **自适应学习** | 2天 | 个性化学习路径 |

**风险与缓解**:
- ⚠️ 风险: TensorFlow.js 模型文件较大
  - 缓解: 使用动态导入，按需加载
  - 缓解: 模型量化和压缩
- ⚠️ 风险: 多模态情感分析性能
  - 缓解: 使用 Web Workers 并行处理
  - 缓解: 实现结果缓存机制

---

## 🏠 第三阶段: 本地AI模型集成 (Week 6-7)

### 目标
集成 Ollama 本地AI模型，提供隐私保护、离线可用的AI能力。

### 具体任务

#### 任务 3.1: 集成 Ollama 管理服务 (Week 6, Day 1-3)
**负责人**: 后端工程师 + DevOps
**所需资源**:
- Ollama 安装包
- xy-01 OllamaService 源码

**执行步骤**:

##### Day 1: Ollama 服务部署
```bash
# 1. 安装 Ollama（开发环境）
curl -fsSL https://ollama.com/install.sh | sh

# 2. 启动 Ollama 服务
ollama serve &

# 3. 下载基础模型
ollama pull llama2:7b
ollama pull mistral:7b

# 4. 验证安装
ollama list
```

**Docker 部署（生产环境）**:
```yaml
# docker-compose.ollama.yml
version: '3.8'
services:
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_MODELS=mistral:7b,llama2:7b
    restart: unless-stopped

volumes:
  ollama_data:
```

##### Day 2-3: 集成 Ollama 管理服务
```bash
# 从 xy-01 复制 Ollama 服务
cd /Users/yanyu/yyc3-xiaoyu-AAA
mkdir -p shared/ai/ollama
cp yyc3-xy-01/services/OllamaService.ts shared/ai/ollama/

# 复制到 xy-05
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
git checkout -b feature/integrate-ollama
mkdir -p services/ollama
cp ../shared/ai/ollama/* services/ollama/
```

**关键代码实现**:
```typescript
// services/ollama/OllamaService.ts
export class OllamaService {
  private baseUrl: string = 'http://localhost:11434';
  private currentModel: string = 'llama2:7b';

  async chat(messages: Message[]): Promise<string> {
    const response = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.currentModel,
        messages: messages,
        stream: false,
      }),
    });

    const data = await response.json();
    return data.message.content;
  }

  async switchModel(model: string): Promise<void> {
    await this.ensureModelDownloaded(model);
    this.currentModel = model;
  }

  private async ensureModelDownloaded(model: string): Promise<void> {
    const models = await this.listModels();
    if (!models.includes(model)) {
      await this.downloadModel(model);
    }
  }

  async getHealthStatus(): Promise<HealthStatus> {
    // 实现健康检查
    return {
      status: 'healthy',
      model: this.currentModel,
      memory: process.memoryUsage(),
    };
  }
}
```

**交付物**:
- [ ] Ollama 服务管理类
- [ ] 模型管理界面
- [ ] 健康监控端点

**验收标准**:
- Ollama 服务正常运行
- 模型下载和管理功能正常
- 响应时间 < 2s

---

#### 任务 3.2: 创建本地AI适配层 (Week 6, Day 4-5)
**负责人**: AI工程师

**执行步骤**:
```typescript
// services/ai/LocalAIAdapter.ts
export class LocalAIAdapter {
  private ollamaService: OllamaService;
  private fallbackToAPI: boolean = true;

  async generateResponse(
    prompt: string,
    context: ConversationContext
  ): Promise<string> {
    try {
      // 优先使用本地模型
      const response = await this.ollamaService.chat([
        { role: 'system', content: this.buildSystemPrompt(context) },
        { role: 'user', content: prompt },
      ]);

      return response;
    } catch (error) {
      // 本地模型失败，回退到API
      if (this.fallbackToAPI) {
        console.warn('Local model failed, falling back to API');
        return this.generateWithAPI(prompt, context);
      }
      throw error;
    }
  }

  private buildSystemPrompt(context: ConversationContext): string {
    return `你是小语，一个温暖的AI陪伴助手。
孩子年龄：${context.childAge}岁
当前情绪：${context.emotion}
请用适合的语气回复。`;
  }
}
```

**交付物**:
- [ ] 本地AI适配器
- [ ] 智能回退机制
- [ ] 上下文管理

---

#### 任务 3.3: 创建模型管理界面 (Week 7, Day 1-2)
**负责人**: 前端工程师

**执行步骤**:
```typescript
// app/settings/models/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { OllamaService } from '@/services/ollama/OllamaService';

export default function ModelManagementPage() {
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState('');
  const [downloading, setDownloading] = useState(false);

  const ollamaService = new OllamaService();

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    const availableModels = await ollamaService.listModels();
    setModels(availableModels);
  };

  const downloadModel = async (modelName: string) => {
    setDownloading(true);
    try {
      await ollamaService.downloadModel(modelName);
      await loadModels();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h2>AI 模型管理</h2>

      <div className="model-list">
        {models.map(model => (
          <ModelCard
            key={model.name}
            model={model}
            isCurrent={model.name === currentModel}
            onSelect={() => setCurrentModel(model.name)}
          />
        ))}
      </div>

      <ModelMarketplace onDownload={downloadModel} />
    </div>
  );
}
```

**交付物**:
- [ ] 模型管理界面
- [ ] 模型市场页面
- [ ] 下载进度显示

---

#### 任务 3.4: 实现离线模式 (Week 7, Day 3-4)
**负责人**: 全栈工程师

**执行步骤**:
```typescript
// hooks/useOfflineMode.ts
export function useOfflineMode() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineCapabilities, setOfflineCapabilities] = useState({
    chat: false,
    predictions: false,
    recommendations: false,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkOfflineCapabilities = async () => {
    const hasLocalModels = await ollamaService.hasModels();
    const hasCachedData = await checkCache();

    setOfflineCapabilities({
      chat: hasLocalModels,
      predictions: hasCachedData.predictions,
      recommendations: hasCachedData.recommendations,
    });
  };

  return {
    isOnline,
    offlineCapabilities,
    syncData: async () => {
      // 实现数据同步逻辑
    },
  };
}
```

**交付物**:
- [ ] 离线模式检测
- [ ] 离线功能管理
- [ ] 数据同步机制
- [ ] 离线提示UI

---

### 第三阶段总结

| 功能 | 工作量 | 预期成果 |
|------|-------|---------|
| **Ollama 集成** | 3天 | 本地AI模型管理 |
| **AI 适配层** | 2天 | 本地/云端智能切换 |
| **模型管理界面** | 2天 | 可视化模型管理 |
| **离线模式** | 2天 | 完全离线可用 |

**验收标准**:
- ✅ 支持本地模型运行
- ✅ 离线模式可用
- ✅ 智能回退机制正常
- ✅ 数据同步可靠

---

## 🕸️ 第四阶段: 知识图谱集成 (Week 8)

### 目标
集成 Neo4j 知识图谱，提供智能知识管理和推理能力。

### 具体任务

#### 任务 4.1: Neo4j 环境搭建 (Day 1-2)
**负责人**: 后端工程师 + DevOps

**执行步骤**:
```bash
# 1. Docker 部署 Neo4j
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  -v neo4j_data:/data \
  neo4j:latest

# 2. 验证连接
curl http://localhost:7474

# 3. 创建数据库 schema
# 使用 Cypher 查询语言创建图结构
```

**图数据库 Schema 设计**:
```cypher
// 创建节点
CREATE (u1:User {id: 'user1', name: 'Alice'})
CREATE (c1:Child {id: 'child1', name: 'Bob', age: 5})
CREATE (m1:Milestone {id: 'milestone1', name: '会走路', category: 'motor'})
CREATE (k1:Knowledge {id: 'knowledge1', title: '儿童心理学', domain: 'education'})

// 创建关系
CREATE (c1)-[:HAS_MILESTONE]->(m1)
CREATE (u1)-[:PARENT_OF]->(c1)
CREATE (m1)-[:REQUIRES_KNOWLEDGE]->(k1)
```

**交付物**:
- [ ] Neo4j Docker 配置
- [ ] 数据库 Schema 定义
- [ ] 连接池配置

---

#### 任务 4.2: 知识图谱服务集成 (Day 3-4)
**负责人**: AI工程师

**执行步骤**:
```bash
# 从 xy-01 复制知识图谱代码
mkdir -p shared/ai/knowledge-graph
cp -r yyc3-xy-01/services/KnowledgeManager.ts shared/ai/knowledge-graph/

# 复制到 xy-05
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
git checkout -b feature/integrate-knowledge-graph
mkdir -p services/knowledge-graph
cp -r ../shared/ai/knowledge-graph/* services/knowledge-graph/
```

**关键代码实现**:
```typescript
// services/knowledge-graph/KnowledgeManager.ts
import neo4j from 'neo4j-driver';

export class KnowledgeManager {
  private driver: neo4j.Driver;

  constructor() {
    this.driver = neo4j.driver(
      'bolt://localhost:7687',
      neo4j.auth.basic('neo4j', 'password')
    );
  }

  async queryKnowledge(
    entity: string,
    relationType: string
  ): Promise<KnowledgeNode[]> {
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (a {name: $entity})-[r:${relationType}*1..2]-(b)
        RETURN a, r, b
        LIMIT 10
      `, { entity });

      return result.records.map(record => record.toObject());
    } finally {
      await session.close();
    }
  }

  async addKnowledgeNode(node: KnowledgeNode): Promise<void> {
    const session = this.driver.session();
    try {
      await session.run(`
        MERGE (k:Knowledge {id: $id})
        SET k += $properties
      `, { id: node.id, properties: node });
    } finally {
      await session.close();
    }
  }
}
```

**交付物**:
- [ ] Neo4j 连接管理
- [ ] 知识查询服务
- [ ] 图谱可视化组件
- [ ] 知识推荐引擎

---

#### 任务 4.3: 集成到推荐系统 (Day 5)
**负责人**: AI工程师

**执行步骤**:
```typescript
// 增强推荐系统，使用知识图谱
import { KnowledgeManager } from '@/services/knowledge-graph';

export class EnhancedRecommendationSystem extends IntelligentRecommendationSystem {
  private knowledgeManager: KnowledgeManager;

  async getKnowledgeBasedRecommendations(
    context: RecommendationContext
  ): Promise<KnowledgeRecommendation[]> {
    // 1. 查询知识图谱
    const knowledge = await this.knowledgeManager.queryKnowledge(
      context.topic,
      'RELATED_TO'
    );

    // 2. 基于知识图谱推荐
    const recommendations = knowledge.map(k => ({
      type: 'knowledge',
      title: k.title,
      relevance: this.calculateRelevance(k, context),
    }));

    return recommendations;
  }
}
```

**交付物**:
- [ ] 知识图谱增强的推荐
- [ ] 知识可视化界面
- [ ] 推理结果展示

---

### 第四阶段总结

| 功能 | 工作量 | 预期成果 |
|------|-------|---------|
| **Neo4j 部署** | 2天 | 图数据库运行 |
| **知识图谱服务** | 2天 | 知识管理API |
| **推荐增强** | 1天 | 基于图谱的推荐 |

**验收标准**:
- ✅ Neo4j 服务正常运行
- ✅ 知识图谱查询响应 < 200ms
- ✅ 推荐准确率提升 10%

---

## 🎮 第五阶段: 游戏化系统集成 (Week 9, Day 1-3)

### 目标
集成 xy-01 的徽章系统，增加用户粘性和参与度。

### 具体任务

#### 任务 5.1: 徽章系统实现
**负责人**: 前端工程师 + 游戏化设计师

**执行步骤**:
```bash
# 从 xy-01 复制徽章系统
mkdir -p shared/gamification
cp -r yyc3-xy-01/components/gamification/* shared/gamification/

# 复制到 xy-05
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05
git checkout -b feature/gamification
mkdir -p components/gamification
cp -r ../shared/gamification/* components/gamification/
```

**核心组件实现**:
```typescript
// components/gamification/BadgeSystem.tsx
export function BadgeSystem({ userId }: { userId: string }) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userProgress, setUserProgress] = useState<Progress>({});

  useEffect(() => {
    // 加载用户徽章和进度
    loadBadges();
  }, [userId]);

  return (
    <div className="badge-system">
      <BadgeGrid badges={badges} userProgress={userProgress} />
      <ProgressTracker progress={userProgress} />
      <AchievementPopup achievements={recentAchievements} />
    </div>
  );
}
```

**交付物**:
- [ ] 徽章组件库
- [ ] 进度追踪系统
- [ ] 成就解锁动画
- [ ] 积分系统

---

## ✅ 第六阶段: 测试与优化 (Week 9-10)

### 目标
全面测试、性能优化、Bug修复。

### 具体任务

#### 任务 6.1: 单元测试 (Day 1-2)
```bash
# 为新集成的功能编写测试
cd /Users/yanyu/yyc3-xiaoyu-AAA/yyc3-xy-05

# 测试预测系统
cat > services/prediction/__tests__/IntelligentPredictionService.test.ts << 'EOF'
import { describe, it, expect } from 'bun:test';
import { IntelligentPredictionService } from '../IntelligentPredictionService';

describe('IntelligentPredictionService', () => {
  it('should predict growth metrics', async () => {
    const service = new IntelligentPredictionService();
    const result = await service.predictGrowthMetrics('test-child', 30);
    expect(result.predictions).toBeDefined();
    expect(result.predictions.length).toBeGreaterThan(0);
  });
});
EOF

# 运行测试
bun test
```

#### 任务 6.2: 集成测试 (Day 3-4)
```typescript
// 创建集成测试场景
describe('AI Integration Tests', () => {
  it('should use local Ollama model when available', async () => {
    // 测试本地AI模型切换
  });

  it('should fallback to API when local model fails', async () => {
    // 测试回退机制
  });

  it('should provide emotion-aware responses', async () => {
    // 测试情感分析
  });
});
```

#### 任务 6.3: 性能优化 (Day 5-6)
```typescript
// 性能优化清单
const optimizations = [
  '代码分割 - 动态导入大型模块',
  '懒加载 - TensorFlow.js 模型按需加载',
  '缓存 - Redis 缓存频繁查询',
  'Web Workers - 情感分析并行处理',
  '服务端渲染 - 首屏优化',
  '图片优化 - Next.js Image 组件',
];
```

#### 任务 6.4: 用户验收测试 (Day 7)
**测试场景**:
1. 父母登录并添加孩子信息
2. 查看成长预测和推荐
3. 与AI小语对话（情感识别）
4. 切换到本地AI模型
5. 查看知识图谱推荐
6. 解锁徽章成就

---

## 📊 整体项目进度跟踪

### 里程碑时间表

| 里程碑 | 周 | 关键交付物 | 成功标准 |
|--------|-----|---------|---------|
| **M1: UI统一** | Week 1-2 | shadcn/ui集成到所有项目 | 0 TS错误，组件可用 |
| **M2: AI增强** | Week 3-5 | 预测、情感、推荐系统 | 功能测试通过 |
| **M3: 本地化** | Week 6-7 | Ollama集成 | 离线模式可用 |
| **M4: 知识图谱** | Week 8 | Neo4j集成 | 查询响应<200ms |
| **M5: 游戏化** | Week 9 | 徽章系统 | 用户参与度+30% |
| **M6: 测试优化** | Week 9-10 | 全面测试 | 测试覆盖率>80% |

### 风险管理

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|---------|
| **TensorFlow.js 性能** | 中 | 高 | 按需加载、模型压缩 |
| **Ollama 模型兼容性** | 低 | 中 | 提前测试、回退机制 |
| **Neo4j 部署复杂度** | 中 | 中 | Docker简化、专业支持 |
| **组件库冲突** | 中 | 高 | 命名空间隔离、渐进迁移 |
| **数据同步** | 低 | 高 | 冲突解决机制、定期同步 |

---

## 📈 预期成果与ROI

### 定量指标

| 指标 | 当前值 | 目标值 | 提升幅度 |
|------|-------|--------|---------|
| **UI组件一致性** | 40% | 100% | +60% |
| **AI功能完整度** | 60% | 95% | +35% |
| **离线可用性** | 0% | 90% | +90% |
| **响应时间** | 800ms | 400ms | -50% |
| **用户留存率** | 45% | 65% | +20% |
| **开发效率** | 基线 | +40% | +40% |

### 定性成果

1. **技术统一**: 四个项目使用统一的UI组件库和技术栈
2. **功能增强**: xy-05 拥有完整的AI能力
3. **隐私保护**: 本地AI模型确保数据隐私
4. **智能升级**: 知识图谱提供智能推荐
5. **用户粘性**: 游戏化系统提升参与度

---

## 🛠️ 实施所需资源

### 人力资源

| 角色 | 人数 | 投入时间 | 主要职责 |
|------|------|---------|---------|
| **前端开发工程师** | 3 | 100% | UI集成、组件开发 |
| **后端开发工程师** | 2 | 100% | API开发、服务集成 |
| **AI工程师** | 2 | 100% | AI模型集成、算法优化 |
| **DevOps工程师** | 1 | 50% | 环境配置、部署 |
| **测试工程师** | 1 | 80% | 测试用例、质量保证 |
| **产品经理** | 1 | 60% | 需求管理、验收 |

**总计**: 10人 × 8-10周

### 技术资源

| 资源 | 配置 | 用途 |
|------|------|------|
| **开发服务器** | 16核/32GB RAM | 本地开发和测试 |
| **GPU服务器** | NVIDIA T4 或更高 | TensorFlow.js 加速 |
| **Neo4j服务器** | 8核/32GB RAM | 知识图谱 |
| **Ollama服务器** | 16核/64GB RAM | 本地AI模型 |
| **PostgreSQL** | 生产配置 | 主数据库 |
| **Redis** | 生产配置 | 缓存和会话 |

---

## 📝 代码规范与最佳实践

### Git 工作流

```bash
# 功能分支命名规范
feature/integrate-shadcn-ui
feature/integrate-prediction
feature/integrate-ollama
feature/integrate-knowledge-graph

# 发布分支
release/v1.0.0-ui-unified
release/v2.0.0-ai-enhanced

# 主分支保护
main - 生产环境
develop - 开发环境
```

### 代码审查清单

- [ ] TypeScript 类型检查通过
- [ ] ESLint 检查通过
- [ ] 单元测试覆盖率 > 80%
- [ ] 性能测试通过
- [ ] 文档更新完整
- [ ] 安全审查通过

---

## 🎯 验收标准

### 第一阶段: UI统一
```bash
# 验收脚本
#!/bin/bash

for project in xy-01 xy-02 xy-03; do
  cd /Users/yanyu/yyc3-xiaoyu-AAA/$project

  echo "Testing $project..."

  # 1. TypeScript 编译
  bunx tsc --noEmit
  [ $? -eq 0 ] || echo "❌ TS compilation failed"

  # 2. 组件导入测试
  node -e "require('./components/ui/button')" 2>/dev/null
  [ $? -eq 0 ] || echo "❌ Component import failed"

  # 3. 样式检查
  bunx tailwindcss --check
  [ $? -eq 0 ] || echo "⚠️  Tailwind check warnings"

  echo "✅ $project validation complete"
done
```

### 第二阶段: AI增强
```typescript
// 验收测试套件
describe('AI Enhancement Acceptance', () => {
  test('Prediction accuracy > 85%', async () => {
    const service = new IntelligentPredictionService();
    const result = await service.predictGrowthMetrics('test-child', 30);
    expect(result.quality.accuracy).toBeGreaterThan(0.85);
  });

  test('Emotion recognition accuracy > 80%', async () => {
    const engine = new EmotionFusionEngine();
    const result = await engine.analyzeEmotion(testInput);
    expect(result.confidence).toBeGreaterThan(0.80);
  });

  test('Recommendation diversity score > 0.7', async () => {
    const system = new IntelligentRecommendationSystem();
    const results = await system.getRecommendations('test-user', context);
    const diversity = calculateDiversity(results);
    expect(diversity).toBeGreaterThan(0.7);
  });
});
```

### 第三阶段: 本地化
```bash
# 验收脚本
#!/bin/bash

# 1. Ollama 服务检查
curl -f http://localhost:11434/api/tags || exit 1

# 2. 离线模式测试
bun test src/services/ollama/offline.test.ts

# 3. 性能基准测试
bun test src/services/ollama/benchmark.test.ts
```

---

## 📞 沟通与协作机制

### 每日站会 (Daily Standup)
- 时间: 每天上午 9:30，15分钟
- 参与者: 全体开发人员
- 内容:
  - 昨天完成的工作
  - 今天计划的工作
  - 遇到的阻碍

### 每周评审 (Weekly Review)
- 时间: 每周五下午 4:00，1小时
- 参与者: 全体开发人员 + 产品经理
- 内容:
  - 本周成果展示
  - 问题讨论
  - 下周计划调整

### 技术评审 (Technical Review)
- 时间: 每个阶段结束时
- 参与者: 技术团队负责人
- 内容:
  - 代码质量评审
  - 架构设计讨论
  - 性能评估

---

## 🎉 最终交付物

### 代码仓库
- [ ] 四个项目的更新代码
- [ ] 共享组件库 (`/shared/`)
- [ ] 完整的类型定义
- [ ] 集成测试套件

### 文档
- [ ] 架构设计文档
- [ ] API 接口文档
- [ ] 组件使用指南
- [ ] 部署运维手册

### 工具与脚本
- [ ] 自动化部署脚本
- [ ] 监控仪表板
- [ ] CI/CD 流水线
- [ ] 性能监控工具

---

## 📞 联系方式

**项目负责人**: [待定]
**技术支持**: [待定]
**问题反馈**: [待定]

---

> 本实施计划是动态文档，将根据实际执行情况持续更新。
> 最后更新: 2026-01-03
