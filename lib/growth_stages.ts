// 成长阶段配置

import type { AgeStageConfig, DevelopmentDimension } from "@/types/growth"

// 发展维度配置（通用）
export const DEVELOPMENT_DIMENSIONS: Record<string, DevelopmentDimension> = {
  cognitive: {
    id: "cognitive",
    name: "认知发展",
    icon: "ri-brain-line",
    color: "blue",
    description: "思维、记忆、注意力、问题解决能力",
    indicators: ["观察力", "记忆力", "逻辑思维", "创造力"],
  },
  language: {
    id: "language",
    name: "语言能力",
    icon: "ri-chat-3-line",
    color: "green",
    description: "表达、理解、阅读、写作能力",
    indicators: ["口语表达", "词汇量", "阅读理解", "写作能力"],
  },
  motor: {
    id: "motor",
    name: "运动发展",
    icon: "ri-run-line",
    color: "orange",
    description: "大运动和精细运动能力",
    indicators: ["大肌肉运动", "精细动作", "协调性", "灵活性"],
  },
  social: {
    id: "social",
    name: "社交能力",
    icon: "ri-team-line",
    color: "purple",
    description: "人际交往、合作、共情能力",
    indicators: ["社交技能", "合作意识", "共情能力", "冲突解决"],
  },
  emotional: {
    id: "emotional",
    name: "情绪管理",
    icon: "ri-heart-pulse-line",
    color: "pink",
    description: "情绪识别、表达、调节能力",
    indicators: ["情绪认知", "情绪表达", "自我调节", "情感稳定"],
  },
  selfcare: {
    id: "selfcare",
    name: "生活自理",
    icon: "ri-hand-heart-line",
    color: "yellow",
    description: "日常生活技能和独立性",
    indicators: ["自理能力", "时间管理", "责任意识", "独立性"],
  },
  sensory: {
    id: "sensory",
    name: "感官发展",
    icon: "ri-eye-line",
    color: "brown",
    description: "视觉、听觉、触觉能力",
    indicators: ["视觉敏锐度", "听觉反应", "触觉敏感度"],
  },
}

// 七大成长阶段配置
export const AGE_STAGES: Record<string, AgeStageConfig> = {
  "0-3": {
    id: "0-3",
    name: "感官启蒙期",
    subtitle: "探索世界的开始",
    ageRange: "0-3岁",
    color: "blue",
    icon: "ri-flower-line",
    description: "通过感官探索世界，建立安全依恋，发展基础运动和语言能力",
    focusAreas: ["视觉发展", "听觉发展", "触觉发展", "大运动", "语言启蒙", "依恋关系"],
    milestones: [
      "3个月：能抬头看物体",
      "6个月：会翻身、坐立",
      "12个月：开始走路、叫爸妈",
      "18个月：能说简单词汇",
      "24个月：会跑跳、玩简单游戏",
      "36个月：能表达需求、穿简单衣服",
    ],
    developmentDimensions: [
      DEVELOPMENT_DIMENSIONS.motor,
      DEVELOPMENT_DIMENSIONS.language,
      DEVELOPMENT_DIMENSIONS.sensory,
      DEVELOPMENT_DIMENSIONS.emotional,
    ],
  },

  "3-6": {
    id: "3-6",
    name: "游戏化学习期",
    subtitle: "在玩中学，在学中玩",
    ageRange: "3-6岁",
    color: "green",
    icon: "ri-gamepad-line",
    description: "通过游戏学习社交规则，发展想象力和创造力，培养学习兴趣",
    focusAreas: ["社交技能", "想象力", "规则意识", "兴趣培养", "学前准备"],
    milestones: [
      "3岁：能说完整句子、玩角色游戏",
      "4岁：会讲故事、画简单图画",
      "5岁：认识颜色形状、会数数",
      "6岁：准备入学、建立初步学习习惯",
    ],
    developmentDimensions: [
      DEVELOPMENT_DIMENSIONS.social,
      DEVELOPMENT_DIMENSIONS.cognitive,
      DEVELOPMENT_DIMENSIONS.language,
      DEVELOPMENT_DIMENSIONS.emotional,
    ],
  },

  "6-9": {
    id: "6-9",
    name: "学术奠基期",
    subtitle: "建立学习基础",
    ageRange: "6-9岁",
    color: "orange",
    icon: "ri-book-open-line",
    description: "系统学习基础知识，培养学习习惯，发展自律能力",
    focusAreas: ["读写能力", "数学思维", "学习习惯", "专注力", "自律性"],
    milestones: ["6岁：适应小学生活", "7岁：掌握基础拼音和数学", "8岁：独立完成作业", "9岁：建立学习方法"],
    developmentDimensions: [
      DEVELOPMENT_DIMENSIONS.cognitive,
      DEVELOPMENT_DIMENSIONS.language,
      DEVELOPMENT_DIMENSIONS.selfcare,
      DEVELOPMENT_DIMENSIONS.social,
    ],
  },

  "9-12": {
    id: "9-12",
    name: "思维建构期",
    subtitle: "发展抽象思维",
    ageRange: "9-12岁",
    color: "purple",
    icon: "ri-lightbulb-flash-line",
    description: "发展抽象思维和逻辑推理，培养批判性思维和问题解决能力",
    focusAreas: ["逻辑思维", "问题解决", "独立思考", "兴趣深化", "自我认知"],
    milestones: ["9岁：理解抽象概念", "10岁：独立学习能力", "11岁：形成学习风格", "12岁：准备青春期转变"],
    developmentDimensions: [
      DEVELOPMENT_DIMENSIONS.cognitive,
      DEVELOPMENT_DIMENSIONS.social,
      DEVELOPMENT_DIMENSIONS.emotional,
      DEVELOPMENT_DIMENSIONS.selfcare,
    ],
  },

  "12-15": {
    id: "12-15",
    name: "青春转型期",
    subtitle: "身心的蜕变",
    ageRange: "12-15岁",
    color: "pink",
    icon: "ri-heart-line",
    description: "应对生理和心理变化，建立自我认同，发展人际关系",
    focusAreas: ["自我认同", "情绪管理", "同伴关系", "价值观", "学业压力"],
    milestones: ["12岁：进入青春期", "13岁：探索自我身份", "14岁：建立价值观", "15岁：发展独立人格"],
    developmentDimensions: [
      DEVELOPMENT_DIMENSIONS.emotional,
      DEVELOPMENT_DIMENSIONS.social,
      DEVELOPMENT_DIMENSIONS.cognitive,
      DEVELOPMENT_DIMENSIONS.selfcare,
    ],
  },

  "15-18": {
    id: "15-18",
    name: "生涯定位期",
    subtitle: "规划未来方向",
    ageRange: "15-18岁",
    color: "red",
    icon: "ri-compass-3-line",
    description: "探索兴趣和能力，规划学业和职业，准备独立生活",
    focusAreas: ["生涯规划", "学业选择", "能力发展", "目标设定", "责任意识"],
    milestones: ["15岁：探索兴趣方向", "16岁：确定学业路径", "17岁：准备升学考试", "18岁：成人礼、大学规划"],
    developmentDimensions: [
      DEVELOPMENT_DIMENSIONS.cognitive,
      DEVELOPMENT_DIMENSIONS.selfcare,
      DEVELOPMENT_DIMENSIONS.emotional,
      DEVELOPMENT_DIMENSIONS.social,
    ],
  },

  "18-22": {
    id: "18-22",
    name: "成人成才期",
    subtitle: "独立与成长",
    ageRange: "18-22岁",
    color: "indigo",
    icon: "ri-rocket-line",
    description: "发展专业能力，建立成人关系，实现经济独立，找到人生方向",
    focusAreas: ["专业发展", "职业准备", "财务管理", "成人关系", "人生目标"],
    milestones: ["18岁：大学入学", "20岁：专业学习深化", "21岁：实习与就业准备", "22岁：毕业、职业起步"],
    developmentDimensions: [
      DEVELOPMENT_DIMENSIONS.cognitive,
      DEVELOPMENT_DIMENSIONS.social,
      DEVELOPMENT_DIMENSIONS.selfcare,
      DEVELOPMENT_DIMENSIONS.emotional,
    ],
  },
}

// 根据出生日期计算当前阶段
export function calculateAgeStage(birthDate: Date): string {
  const now = new Date()
  const ageInMonths = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
  const ageInYears = ageInMonths / 12

  if (ageInYears < 3) return "0-3"
  if (ageInYears < 6) return "3-6"
  if (ageInYears < 9) return "6-9"
  if (ageInYears < 12) return "9-12"
  if (ageInYears < 15) return "12-15"
  if (ageInYears < 18) return "15-18"
  return "18-22"
}

// 计算精确年龄
export function calculateAge(birthDate: Date): { years: number; months: number; days: number } {
  const now = new Date()
  let years = now.getFullYear() - birthDate.getFullYear()
  let months = now.getMonth() - birthDate.getMonth()
  let days = now.getDate() - birthDate.getDate()

  if (days < 0) {
    months--
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += lastMonth.getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

export class GrowthStageManager {
  private currentChildBirthDate: Date | null = null
  private onStageChangeCallbacks: ((stage: string) => void)[] = []

  // 设置当前儿童出生日期
  setChildBirthDate(birthDate: Date) {
    this.currentChildBirthDate = birthDate
    const newStage = this.getCurrentStage()
    if (newStage) {
      this.notifyStageChange(newStage)
    }
  }

  // 获取当前阶段
  getCurrentStage(): string | null {
    if (!this.currentChildBirthDate) return null
    return calculateAgeStage(this.currentChildBirthDate)
  }

  // 获取当前阶段配置
  getCurrentStageConfig(): AgeStageConfig | null {
    const stageId = this.getCurrentStage()
    return stageId ? AGE_STAGES[stageId] : null
  }

  // 获取精确年龄
  getExactAge(): { years: number; months: number; days: number } | null {
    if (!this.currentChildBirthDate) return null
    return calculateAge(this.currentChildBirthDate)
  }

  // 获取月龄
  getAgeInMonths(): number | null {
    if (!this.currentChildBirthDate) return null
    const now = new Date()
    return Math.floor((now.getTime() - this.currentChildBirthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  }

  // 检查是否即将进入下一阶段(30天内)
  isApproachingNextStage(): { approaching: boolean; daysUntil: number; nextStage: string | null } {
    if (!this.currentChildBirthDate) {
      return { approaching: false, daysUntil: 0, nextStage: null }
    }

    const currentStage = this.getCurrentStage()
    const stageOrder = ["0-3", "3-6", "6-9", "9-12", "12-15", "15-18", "18-22"]
    const currentIndex = stageOrder.indexOf(currentStage || "")

    if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
      return { approaching: false, daysUntil: 0, nextStage: null }
    }

    const nextStage = stageOrder[currentIndex + 1]
    const stageStartAges: Record<string, number> = {
      "0-3": 0,
      "3-6": 3,
      "6-9": 6,
      "9-12": 9,
      "12-15": 12,
      "15-18": 15,
      "18-22": 18,
    }

    const nextStageStartAge = stageStartAges[nextStage]
    const birthDate = this.currentChildBirthDate
    const nextStageDate = new Date(birthDate)
    nextStageDate.setFullYear(birthDate.getFullYear() + nextStageStartAge)

    const now = new Date()
    const daysUntil = Math.ceil((nextStageDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
      approaching: daysUntil > 0 && daysUntil <= 30,
      daysUntil: Math.max(0, daysUntil),
      nextStage,
    }
  }

  // 获取当前阶段的里程碑进度
  getMilestoneProgress(): { completed: number; total: number; upcoming: string[] } {
    const stageConfig = this.getCurrentStageConfig()
    if (!stageConfig) {
      return { completed: 0, total: 0, upcoming: [] }
    }

    const milestones = stageConfig.milestones || []
    const ageInMonths = this.getAgeInMonths() || 0

    // 解析里程碑月龄
    const parsedMilestones = milestones.map((m) => {
      const match = m.match(/^(\d+)个?月?岁?：(.+)$/)
      if (match) {
        const ageNum = Number.parseInt(match[1])
        const isYears = m.includes("岁")
        return {
          monthAge: isYears ? ageNum * 12 : ageNum,
          description: match[2],
        }
      }
      return { monthAge: 0, description: m }
    })

    const completed = parsedMilestones.filter((m) => m.monthAge <= ageInMonths).length
    const upcoming = parsedMilestones
      .filter((m) => m.monthAge > ageInMonths)
      .slice(0, 3)
      .map((m) => m.description)

    return {
      completed,
      total: milestones.length,
      upcoming,
    }
  }

  // 注册阶段变化回调
  onStageChange(callback: (stage: string) => void) {
    this.onStageChangeCallbacks.push(callback)
    return () => {
      const index = this.onStageChangeCallbacks.indexOf(callback)
      if (index > -1) {
        this.onStageChangeCallbacks.splice(index, 1)
      }
    }
  }

  private notifyStageChange(stage: string) {
    this.onStageChangeCallbacks.forEach((callback) => callback(stage))
  }
}

let stageManagerInstance: GrowthStageManager | null = null

export function getGrowthStageManager(): GrowthStageManager {
  // 在服务器端每次返回新实例，避免SSR问题
  if (typeof window === "undefined") {
    return new GrowthStageManager()
  }

  // 客户端使用单例
  if (!stageManagerInstance) {
    stageManagerInstance = new GrowthStageManager()
  }
  return stageManagerInstance
}

export function getStageRecommendations(stageId: string): {
  activities: string[]
  books: string[]
  skills: string[]
  warnings: string[]
} {
  const recommendations: Record<
    string,
    {
      activities: string[]
      books: string[]
      skills: string[]
      warnings: string[]
    }
  > = {
    "0-3": {
      activities: ["感官游戏", "亲子阅读", "音乐启蒙", "户外探索", "积木搭建"],
      books: ["《猜猜我有多爱你》", "《好饿的毛毛虫》", "《小熊宝宝绘本》"],
      skills: ["抬头", "翻身", "坐立", "爬行", "走路", "简单词汇"],
      warnings: ["注意安全防护", "避免小物件误食", "保证充足睡眠"],
    },
    "3-6": {
      activities: ["角色扮演", "绘画手工", "运动游戏", "数学启蒙", "科学实验"],
      books: ["《小王子》", "《安徒生童话》", "《神奇校车》"],
      skills: ["社交技能", "规则意识", "自理能力", "学前准备"],
      warnings: ["关注社交发展", "培养学习兴趣", "避免过度学科学习"],
    },
    "6-9": {
      activities: ["阅读培养", "数学思维", "科学探索", "体育运动", "艺术创作"],
      books: ["《窗边的小豆豆》", "《夏洛的网》", "《时代广场的蟋蟀》"],
      skills: ["读写能力", "计算能力", "学习习惯", "时间管理"],
      warnings: ["关注学业压力", "保证运动时间", "培养阅读兴趣"],
    },
    "9-12": {
      activities: ["逻辑游戏", "编程入门", "科学项目", "团队运动", "阅读拓展"],
      books: ["《哈利波特》", "《三体》少年版", "《人类简史》青少版"],
      skills: ["抽象思维", "独立学习", "批判思考", "自我管理"],
      warnings: ["关注心理变化", "预防网络沉迷", "保持亲子沟通"],
    },
    "12-15": {
      activities: ["深度阅读", "艺术创作", "社会实践", "职业探索", "运动健身"],
      books: ["《活着》", "《平凡的世界》", "《苏菲的世界》"],
      skills: ["情绪管理", "人际交往", "自我认知", "学业规划"],
      warnings: ["青春期心理辅导", "关注同伴影响", "保持开放沟通"],
    },
    "15-18": {
      activities: ["学业深化", "社团活动", "志愿服务", "升学准备", "兴趣发展"],
      books: ["《月亮与六便士》", "《百年孤独》", "《时间简史》"],
      skills: ["目标规划", "压力管理", "决策能力", "独立思考"],
      warnings: ["关注升学压力", "支持兴趣发展", "尊重个人选择"],
    },
    "18-22": {
      activities: ["专业学习", "实习实践", "人际拓展", "技能提升", "未来规划"],
      books: ["《原则》", "《思考快与慢》", "《人类群星闪耀时》"],
      skills: ["专业能力", "社会适应", "财务管理", "职业发展"],
      warnings: ["支持独立", "保持联系", "适度放手"],
    },
  }

  return recommendations[stageId] || recommendations["0-3"]
}
