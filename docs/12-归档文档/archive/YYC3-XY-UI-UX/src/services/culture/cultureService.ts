interface CultureItem {
  id: string;
  title: string;
  description: string;
  type: string;
  ageRange: [number, number];
}

export const cultureService = {
  getCultureList: async (filter: { suitableAgeRange?: [number, number] }): Promise<CultureItem[]> => {
    // Mock data
    const items: CultureItem[] = [
      { id: '1', title: '洛阳牡丹', description: '了解牡丹的历史', type: 'flower', ageRange: [3, 99] },
      { id: '2', title: '龙门石窟', description: '探索石刻艺术', type: 'heritage', ageRange: [5, 99] },
      { id: '3', title: '白马寺', description: '佛教祖庭', type: 'temple', ageRange: [6, 99] },
      { id: '4', title: '唐三彩', description: '多彩的陶器', type: 'art', ageRange: [4, 99] },
    ];

    if (filter.suitableAgeRange) {
      const [min, max] = filter.suitableAgeRange;
      return items.filter(item => 
        item.ageRange[0] <= max && item.ageRange[1] >= min
      );
    }
    return items;
  }
};
