/**
 * Growth System Configuration
 * 沫语成长守护体系 - 系统配置
 * 映射Python系统的配置数据
 */

import { GrowthStage, AgeStageConfig, CulturalElement, DevelopmentDimension } from '../../types/growth-system';

/**
 * 核心配置
 */
export const SYSTEM_CONFIG = {
  systemName: '沫语成长守护体系',
  systemVersion: '2.0.0',
  currentYear: new Date().getFullYear(),
  
  coreElements: {
    character: '小龙女沫语（射手座·成长守护使）',
    culturalBase: '河洛文化·古都洛阳',
    culturalSymbols: [
      '牡丹国色', '言启智云', '语枢未来',
      '明珠使者', '智能同行', '河洛新章'
    ]
  }
} as const;

/**
 * 文化元素配置
 */
export const CULTURAL_ELEMENTS: Record<string, CulturalElement> = {
  '牡丹国色': {
    name: '牡丹国色',
    description: '洛阳牡丹，国色天香，象征富贵吉祥',
    images: []
  },
  '言启智云': {
    name: '言启智云',
    description: '语言开启智慧之门，云端知识滋养成长'
  },
  '语枢未来': {
    name: '语枢未来',
    description: '语言枢纽，连接现在与未来'
  },
  '明珠使者': {
    name: '明珠使者',
    description: '如明珠般闪耀，传递爱与智慧'
  },
  '智能同行': {
    name: '智能同行',
    description: 'AI智能陪伴，共同成长'
  },
  '河洛新章': {
    name: '河洛新章',
    description: '河洛文化新篇章，传承与创新'
  }
};

/**
 * 文化寄语配置
 */
export const CULTURAL_MESSAGES: Record<number, string> = {
  0: '启元初绽，如牡丹初开，生命之光闪耀河洛大地',
  1: '萌智初醒，言启智云，智慧之芽悄然萌发',
  2: '学步观春，河洛春色，每一步都是成长的印记',
  3: '探趣洛城，古都风华，探索世界的奇妙旅程',
  4: '言启智云，语言之门开启，智慧之光闪耀',
  5: '语枢萌芽，语言枢纽初成，思维之翼展开',
  6: '入学明礼，河洛少年，明礼修身，志向高远',
  7: '学科启途，知识海洋，扬帆起航',
  8: '兴趣深耕，多元发展，天赋绽放',
  9: '河洛少年，文化传承，创新未来',
  10: '智能同行，AI相伴，智慧成长',
  11: '未来雏型，梦想启航，志向远大',
  12: '初中文枢，承上启下，知识深化',
  13: '青春履新，活力四射，探索未知',
  14: '牡丹韶华，青春绽放，美丽人生',
  15: '高中进阶，学业精进，能力提升',
  16: '志向明途，目标明确，奋发向前',
  17: '冲刺征途，全力以赴，追逐梦想',
  18: '成人礼赞，成熟稳重，担当责任',
  19: '大学新章，知识殿堂，探索真理',
  20: '社会洞察，认知世界，洞察人生',
  21: '毕业启程，扬帆远航，创造未来'
};

/**
 * 年龄阶段配置生成器
 */
export const generateAgeStageConfig = (age: number): AgeStageConfig => {
  let stageName: string;
  let growthStage: GrowthStage;
  let developmentDimensions: string[];
  let coreFolders: string[];

  if (age === 0) {
    stageName = '0岁_启元初绽';
    growthStage = GrowthStage.INFANT;
    developmentDimensions = ['感知启蒙舱', '亲子共育录', '河洛自然志', '健康守护站', '生日纪念册'];
    coreFolders = ['新生儿记录', '喂养记录', '睡眠记录', '健康档案', '成长照片'];
  } else if (age >= 1 && age <= 3) {
    const stageNames = ['萌智初醒', '学步观春', '探趣洛城'];
    stageName = `${age}岁_${stageNames[age - 1]}`;
    growthStage = GrowthStage.INFANT;
    developmentDimensions = ['感知启蒙舱', '亲子共育录', '河洛自然志', '健康守护站', '生日纪念册'];
    coreFolders = ['语言发展', '认知能力', '社交活动', '兴趣爱好', '健康记录'];
  } else if (age >= 4 && age <= 6) {
    const stageNames = ['言启智云', '语枢萌芽', '入学明礼'];
    stageName = `${age}岁_${stageNames[age - 4]}`;
    growthStage = GrowthStage.PRESCHOOL;
    developmentDimensions = ['语枢启蒙舱', '兴趣探索舱', '社交萌芽社', '健康成长舱', '河洛文化廊'];
    coreFolders = ['学前准备', '安全教育', '习惯养成', '亲子游戏', '兴趣培养'];
  } else if (age >= 7 && age <= 12) {
    const stageNames: Record<number, string> = {
      7: '学科启途',
      8: '兴趣深耕',
      9: '河洛少年',
      10: '智能同行',
      11: '未来雏型',
      12: '初中文枢'
    };
    stageName = `${age}岁_${stageNames[age]}`;
    growthStage = GrowthStage.PRIMARY;
    developmentDimensions = ['学科启智云', '兴趣深耕坊', '社交成长营', '健康护航队', '国学传承阁'];
    coreFolders = ['学习记录', '课外活动', '成绩档案', '教师评语', '兴趣发展'];
  } else if (age >= 13 && age <= 18) {
    const stageNames: Record<number, string> = {
      13: '青春履新',
      14: '牡丹韶华',
      15: '高中进阶',
      16: '志向明途',
      17: '冲刺征途',
      18: '成人礼赞'
    };
    stageName = `${age}岁_${stageNames[age]}`;
    growthStage = GrowthStage.MIDDLE;
    developmentDimensions = ['青春赋能站', '学科冲刺舱', '社会洞察社', '生涯探索局', '智能同行舰'];
    coreFolders = ['学科笔记', '考试成绩', '社会实践', '升学规划', '成长感悟'];
  } else {
    const stageNames: Record<number, string> = {
      19: '大学新章',
      20: '社会洞察',
      21: '毕业启程'
    };
    stageName = `${age}岁_${stageNames[age]}`;
    growthStage = GrowthStage.ADULT;
    developmentDimensions = ['大学启航港', '职业探索舱', '独立成长录', '生涯锚定台', '河洛新青年'];
    coreFolders = ['专业学习', '实习经历', '职业规划', '毕业准备', '人生规划'];
  }

  const culturalMessage = CULTURAL_MESSAGES[age] || '记录成长的每一个精彩瞬间';

  return {
    age,
    stageName,
    growthStage,
    culturalMessage,
    developmentDimensions,
    coreFolders
  };
};

/**
 * 发展维度配置
 */
export const DEVELOPMENT_DIMENSIONS: Record<DevelopmentDimension, {
  name: string;
  description: string;
  stages: string[];
  icon: string;
  color: string;
}> = {
  '生活': {
    name: '生活维度',
    description: '日常生活能力和独立性发展',
    icon: '🏠',
    color: 'orange',
    stages: [
      '日常哺护', '起居训练', '校园作息',
      '家务参与', '独立出行', '自主规划',
      '独立生活', '职业准备'
    ]
  },
  '学习': {
    name: '学习维度',
    description: '知识学习和认知能力发展',
    icon: '📚',
    color: 'blue',
    stages: [
      '感知启蒙', '语言萌芽', '课堂专注',
      '思维拓展', '学科适应', '学科深化',
      '专业启蒙', '毕业设计'
    ]
  },
  '社交': {
    name: '社交维度',
    description: '社交能力和人际关系发展',
    icon: '👥',
    color: 'green',
    stages: [
      '亲子依恋', '同伴互动', '社交规则',
      '团队合作', '领导能力', '社会参与',
      '人脉建立', '职业社交'
    ]
  },
  '情感': {
    name: '情感维度',
    description: '情感表达和情绪管理能力发展',
    icon: '❤️',
    color: 'pink',
    stages: [
      '情绪识别', '情感表达', '情绪调节',
      '共情能力', '自我认知', '情感成熟',
      '情感独立', '情感智慧'
    ]
  },
  '文化': {
    name: '文化维度',
    description: '文化认同和文化传承',
    icon: '🏛️',
    color: 'purple',
    stages: [
      '河洛启蒙', '文化认知', '传统体验',
      '文化实践', '文化创新', '文化传承',
      '文化传播', '文化自信'
    ]
  }
};

/**
 * 里程碑配置
 */
export const MILESTONES_BY_AGE: Record<number, string[]> = {
  0: ['第一次呼吸', '第一次睁眼', '第一次微笑', '第一次抬头'],
  1: ['第一次叫妈妈/爸爸', '第一次独立站立', '第一次走路', '第一次说完整句子'],
  2: ['第一次自己吃饭', '第一次上厕所', '第一次画画', '第一次唱歌'],
  3: ['第一次上幼儿园', '第一次交朋友', '第一次表演', '第一次讲故事'],
  4: ['第一次写名字', '第一次骑自行车', '第一次游泳', '第一次做手工'],
  5: ['第一次上小学', '第一次考试', '第一次得奖', '第一次当班长'],
  6: ['第一次参加比赛', '第一次做演讲', '第一次组织活动', '第一次帮助他人'],
  7: ['第一次独立完成作业', '第一次参加社团', '第一次参加运动会', '第一次做实验'],
  8: ['第一次参加夏令营', '第一次学乐器', '第一次参加文艺演出', '第一次写日记'],
  9: ['第一次参加竞赛', '第一次担任组长', '第一次参加社会实践活动', '第一次做志愿者'],
  10: ['第一次独立出行', '第一次参加国际交流活动', '第一次发表文章', '第一次获得专利'],
  11: ['第一次参加中考', '第一次获得重要奖项', '第一次参加领导力培训', '第一次做项目'],
  12: ['第一次上高中', '第一次住校', '第一次参加社团活动', '第一次做研究'],
  13: ['第一次参加辩论赛', '第一次组织大型活动', '第一次参加国际比赛', '第一次发表演讲'],
  14: ['第一次获得奖学金', '第一次参加实习', '第一次做家教', '第一次参加公益活动'],
  15: ['第一次参加高考', '第一次获得重要证书', '第一次参加学术会议', '第一次发表论文'],
  16: ['第一次上大学', '第一次独立生活', '第一次参加社会实践', '第一次做兼职'],
  17: ['第一次参加专业竞赛', '第一次获得实习机会', '第一次参加学术研究', '第一次参加创业项目'],
  18: ['第一次参加毕业典礼', '第一次获得学位', '第一次参加求职面试', '第一次获得工作offer'],
  19: ['第一次参加工作', '第一次独立完成项目', '第一次获得晋升', '第一次参加专业培训'],
  20: ['第一次获得重要成就', '第一次参加国际会议', '第一次发表重要成果', '第一次获得行业认可'],
  21: ['第一次获得重要奖项', '第一次实现重要目标', '第一次获得重要荣誉', '第一次开启新征程']
};

/**
 * 角色核心项目配置
 */
export const ROLE_CORE_ITEMS = {
  recorder: {
    medical_health: ['疫苗接种时间线', '常规体检数据追踪', '常见不适记录', '口腔发育轨迹'],
    first_champion: ['首次身体控制', '首次语言表达', '首次自主生活技能', '首次社交行为'],
    milestone_matrix: ['认知发展', '情绪表达', '创造力萌芽', '季节感知'],
    life_rhythm: ['阶段性睡眠模式', '饮食偏好变化', '昼夜情绪波动规律']
  },
  observer: {
    behavioral_records: ['行为观察日志', '兴趣点追踪', '社交互动记录', '学习方式偏好'],
    environmental_response: ['环境适应性', '新情境反应', '分离焦虑记录', '陌生人反应']
  },
  guide: {
    educational_planning: ['启蒙教育计划', '能力培养目标', '兴趣发展方向', '价值观引导'],
    activity_design: ['游戏活动设计', '探索活动安排', '社交活动组织', '文化体验活动']
  },
  protector: {
    safety_records: ['安全事件记录', '预防措施文档', '应急处理预案', '健康监护日志'],
    growth_monitoring: ['发育指标追踪', '健康评估记录', '营养摄入记录', '睡眠质量监测']
  }
} as const;
