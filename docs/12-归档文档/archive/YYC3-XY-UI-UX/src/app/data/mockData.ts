import React from 'react';

export const mockUserData = {
  id: 'u1',
  name: 'Moyu',
  avatar: '👧',
  age: 6,
  growthStage: '文化浸润期'
};

export const mockGrowthData = {
  stage: '文化浸润期',
  age: 6,
  lastUpdated: new Date().toISOString(),
  dimensions: [
    {
      name: '文化认知',
      progress: 75,
      items: [
        { id: '1', title: '背诵古诗', description: '背诵《静夜思》', completed: true, date: '2023-01-01' },
        { id: '2', title: '了解造纸术', description: '阅读四大发明绘本', completed: false }
      ]
    },
    {
      name: '社交能力',
      progress: 60,
      items: [
        { id: '3', title: '结交新朋友', description: '在公园认识新朋友', completed: true, date: '2023-02-01' }
      ]
    }
  ],
  achievements: [
    { id: 'a1', title: '小小诗人', icon: '📜', earnedDate: '2023-01-15' },
    { id: 'a2', title: '探险家', icon: '🧭', earnedDate: '2023-03-20' },
    { id: 'a3', title: '友谊之星', icon: '⭐', earnedDate: '2023-04-01' },
    { id: 'a4', title: '健康宝宝', icon: '🍎', earnedDate: '2023-05-10' }
  ]
};

export const mockCultureItems = [
  {
    id: 'culture-longmen',
    title: '龙门石窟',
    description: '中国石刻艺术宝库',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=2070&auto=format&fit=crop',
    category: '历史遗迹',
    tags: ['佛教', '艺术', '世界遗产']
  },
  {
    id: 'culture-peony',
    title: '洛阳牡丹',
    description: '唯有牡丹真国色，花开时节动京城',
    image: 'https://images.unsplash.com/photo-1562639410-3f728c707e25?q=80&w=2070&auto=format&fit=crop',
    category: '自然景观',
    tags: ['花卉', '国花', '春季']
  },
  {
    id: 'culture-museum',
    title: '洛阳博物馆',
    description: '感受千年帝都的文化积淀',
    image: 'https://images.unsplash.com/photo-1554907984-15263bfd63bd?q=80&w=2070&auto=format&fit=crop',
    category: '博物馆',
    tags: ['文物', '历史', '教育']
  }
];

export const mockLearningProgress = [
  {
    subject: '语文',
    progress: 80,
    lessons: [
      { id: 'l1', title: '第一课', duration: 30, completed: true, locked: false },
      { id: 'l2', title: '第二课', duration: 45, completed: false, locked: false }
    ],
    currentLesson: { id: 'l2', title: '第二课', duration: 45, completed: false, locked: false }
  },
  {
    subject: '数学',
    progress: 50,
    lessons: [
      { id: 'm1', title: '加法', duration: 30, completed: true, locked: false },
      { id: 'm2', title: '减法', duration: 45, completed: false, locked: false }
    ],
    currentLesson: { id: 'm2', title: '减法', duration: 45, completed: false, locked: false }
  }
];

export const mockRecommendations = [
  {
    id: 'r1',
    title: '白马寺一日游',
    subtitle: '了解中国第一古刹',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?q=80&w=2070&auto=format&fit=crop',
    type: 'activity'
  },
  {
    id: 'r2',
    title: '唐三彩制作',
    subtitle: '体验传统手工艺',
    image: 'https://images.unsplash.com/photo-1459908676235-d5f02a50184b?q=80&w=2070&auto=format&fit=crop',
    type: 'workshop'
  },
  {
    id: 'r3',
    title: '洛阳水席',
    subtitle: '品尝千年味道',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
    type: 'food'
  },
  {
    id: 'r4',
    title: '隋唐洛阳城',
    subtitle: '梦回大唐盛世',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=2076&auto=format&fit=crop',
    type: 'scenic'
  }
];
