// Mock Data for Xiaoyu AI Application
import { UserData, GrowthRecord, CultureItem, LearningProgressData, Recommendation } from '../types';

export const mockUserData: UserData = {
  id: '1',
  name: '小明',
  age: 8,
  avatar: '👦',
  growthStage: '小学低年级（7-9岁）',
};

export const mockGrowthData: GrowthRecord = {
  id: 'growth-1',
  age: 8,
  stage: '小学低年级（7-9岁）',
  lastUpdated: '2025-12-28',
  dimensions: [
    {
      name: '认知发展',
      progress: 75,
      items: [
        { id: '1', title: '数学逻辑能力', description: '能够进行简单的加减乘除运算', completed: true, date: '2025-12-20' },
        { id: '2', title: '空间想象力', description: '能够理解基本的几何图形', completed: true },
        { id: '3', title: '记忆力训练', description: '能够记住10个以上的词语', completed: false },
      ],
    },
    {
      name: '语言表达',
      progress: 80,
      items: [
        { id: '4', title: '汉字认读', description: '认识500个常用汉字', completed: true, date: '2025-12-15' },
        { id: '5', title: '口语表达', description: '能够流利地讲述一个故事', completed: true },
        { id: '6', title: '写作能力', description: '能够写出简单的日记', completed: false },
      ],
    },
    {
      name: '社交能力',
      progress: 65,
      items: [
        { id: '7', title: '团队协作', description: '能够与同学合作完成任务', completed: true },
        { id: '8', title: '情绪管理', description: '学会控制自己的情绪', completed: false },
        { id: '9', title: '礼貌待人', description: '主动问候长辈', completed: true },
      ],
    },
  ],
  achievements: [
    { id: 'ach-1', title: '阅读小能手', icon: '📚', earnedDate: '2025-12-15' },
    { id: 'ach-2', title: '数学小天才', icon: '🧮', earnedDate: '2025-12-10' },
    { id: 'ach-3', title: '友谊之星', icon: '⭐', earnedDate: '2025-12-05' },
    { id: 'ach-4', title: '文化探索者', icon: '🏛️', earnedDate: '2025-12-01' },
  ],
};

export const mockCultureItems: CultureItem[] = [
  {
    id: 'culture-1',
    title: '龙门石窟',
    description: '龙门石窟是中国四大石窟之一，始建于北魏时期，拥有丰富的佛教艺术珍品。',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800',
    category: '历史遗迹',
    tags: ['历史', '艺术', '佛教', '世界遗产'],
  },
  {
    id: 'culture-2',
    title: '白马寺',
    description: '白马寺是中国第一座官办佛教寺院，被誉为"中国佛教的祖庭"。',
    image: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800',
    category: '宗教建筑',
    tags: ['宗教', '历史', '建筑', '佛教'],
  },
  {
    id: 'culture-3',
    title: '牡丹花会',
    description: '洛阳牡丹花会是每年春季举办的大型文化活动，展示各种名贵牡丹品种。',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800',
    category: '民俗活动',
    tags: ['花卉', '民俗', '春季', '文化'],
  },
  {
    id: 'culture-4',
    title: '洛阳水席',
    description: '洛阳水席是洛阳传统美食，有24道菜肴，道道有汤，是中国宴席文化的代表。',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
    category: '传统美食',
    tags: ['美食', '传统', '文化'],
  },
];

export const mockLearningProgress: LearningProgressData[] = [
  {
    subject: '语文',
    progress: 75,
    lessons: [
      { id: 'l1', title: '古诗词欣赏', duration: 30, completed: true, locked: false },
      { id: 'l2', title: '成语故事', duration: 25, completed: true, locked: false },
      { id: 'l3', title: '阅读理解', duration: 40, completed: false, locked: false },
      { id: 'l4', title: '作文写作', duration: 45, completed: false, locked: false },
      { id: 'l5', title: '汉字书写', duration: 30, completed: false, locked: true },
    ],
    currentLesson: { id: 'l3', title: '阅读理解', duration: 40, completed: false, locked: false },
  },
  {
    subject: '数学',
    progress: 60,
    lessons: [
      { id: 'm1', title: '加减法练习', duration: 30, completed: true, locked: false },
      { id: 'm2', title: '乘法口诀', duration: 35, completed: true, locked: false },
      { id: 'm3', title: '几何图形', duration: 40, completed: false, locked: false },
      { id: 'm4', title: '应用题解析', duration: 45, completed: false, locked: true },
      { id: 'm5', title: '数学思维', duration: 50, completed: false, locked: true },
    ],
    currentLesson: { id: 'm3', title: '几何图形', duration: 40, completed: false, locked: false },
  },
  {
    subject: '英语',
    progress: 45,
    lessons: [
      { id: 'e1', title: '字母认读', duration: 20, completed: true, locked: false },
      { id: 'e2', title: '日常对话', duration: 30, completed: false, locked: false },
      { id: 'e3', title: '单词记忆', duration: 25, completed: false, locked: false },
      { id: 'e4', title: '简单语法', duration: 35, completed: false, locked: true },
      { id: 'e5', title: '英文儿歌', duration: 20, completed: false, locked: true },
    ],
    currentLesson: { id: 'e2', title: '日常对话', duration: 30, completed: false, locked: false },
  },
];

export const mockRecommendations: Recommendation[] = [
  {
    id: 'rec-1',
    type: 'content',
    title: '洛阳历史故事',
    description: '探索洛阳千年古都的历史传说',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400',
  },
  {
    id: 'rec-2',
    type: 'content',
    title: '牡丹知识小百科',
    description: '了解牡丹的种类和养护知识',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
  },
  {
    id: 'rec-3',
    type: 'action',
    title: '今日成长打卡',
    description: '记录今天的学习成果',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400',
  },
  {
    id: 'rec-4',
    type: 'question',
    title: '趣味知识问答',
    description: '测试你对河洛文化的了解',
    image: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=400',
  },
];
