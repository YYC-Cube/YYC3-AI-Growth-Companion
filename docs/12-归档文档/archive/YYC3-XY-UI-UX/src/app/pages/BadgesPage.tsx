import React, { useState, useEffect, useMemo } from 'react';
import { 
  Badge, BadgeSeries, BadgeCategory, BadgeRarity, BadgeLevel, BadgeGroup 
} from '../../types/badge';
import { badgeService } from '../../services/badge/badgeService';
import { BadgeCard } from '../components/business/badges/BadgeCard';
import { BadgeSeriesCard } from '../components/business/badges/BadgeSeriesCard';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Search, Filter, Share2, Lock, Trophy } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';

const BadgesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([]);
  const [badgeGroups, setBadgeGroups] = useState<BadgeGroup[]>([]);
  const [stats, setStats] = useState<any>(null);
  
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [activeTab, setActiveTab] = useState('series');
  const [searchText, setSearchText] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [badges, earned, groups, statistics] = await Promise.all([
        badgeService.getAllBadges(),
        badgeService.getUserBadges(),
        badgeService.getBadgeGroups(),
        badgeService.getBadgeStats()
      ]);
      
      setAllBadges(badges);
      setEarnedBadges(earned);
      setBadgeGroups(groups);
      setStats(statistics);
    } catch (error) {
      console.error("Failed to load badge data", error);
    } finally {
      setLoading(false);
    }
  };

  const isBadgeEarned = (badgeId: string) => {
    return earnedBadges.some(b => b.id === badgeId);
  };

  const filteredBadges = useMemo(() => {
    return allBadges.filter(badge => {
      // Search text
      if (searchText && !badge.title.toLowerCase().includes(searchText.toLowerCase()) && !badge.description.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      // Series
      if (selectedSeries !== 'all' && badge.series !== selectedSeries) {
        return false;
      }
      // Category
      if (selectedCategory !== 'all' && badge.category !== selectedCategory) {
        return false;
      }
      // Rarity
      if (selectedRarity !== 'all' && badge.rarity !== selectedRarity) {
        return false;
      }
      return true;
    });
  }, [allBadges, searchText, selectedSeries, selectedCategory, selectedRarity]);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setIsModalOpen(true);
  };

  const handleGroupClick = (groupId: string) => {
    setSelectedSeries(groupId);
    setActiveTab('all');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            勋章殿堂
          </h1>
          <p className="text-muted-foreground">
            记录你的成长足迹，探索每一个精彩瞬间
          </p>
        </div>
        
        {stats && (
          <div className="flex gap-4 bg-slate-50 p-3 rounded-lg border">
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-primary">{stats.earned}</div>
              <div className="text-xs text-muted-foreground">已获勋章</div>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-muted-foreground">总勋章数</div>
            </div>
            <div className="w-px bg-slate-200" />
            <div className="text-center px-2">
              <div className="text-2xl font-bold text-yellow-500">{stats.totalPoints}</div>
              <div className="text-xs text-muted-foreground">成就点数</div>
            </div>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="series">套系概览</TabsTrigger>
            <TabsTrigger value="all">所有勋章</TabsTrigger>
          </TabsList>

          <div className="flex flex-wrap gap-2">
             <div className="relative w-full md:w-64">
               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input 
                 placeholder="搜索勋章..." 
                 className="pl-9"
                 value={searchText}
                 onChange={(e) => setSearchText(e.target.value)}
               />
             </div>
             {activeTab === 'all' && (
               <>
                 <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                   <SelectTrigger className="w-[130px]">
                     <SelectValue placeholder="分类" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">所有分类</SelectItem>
                     <SelectItem value="learning">学习成就</SelectItem>
                     <SelectItem value="culture">文化探索</SelectItem>
                     <SelectItem value="social">社交互动</SelectItem>
                     <SelectItem value="creative">创意制作</SelectItem>
                   </SelectContent>
                 </Select>
                 <Select value={selectedRarity} onValueChange={setSelectedRarity}>
                   <SelectTrigger className="w-[130px]">
                     <SelectValue placeholder="稀有度" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="all">所有稀有度</SelectItem>
                     <SelectItem value="common">普通</SelectItem>
                     <SelectItem value="rare">稀有</SelectItem>
                     <SelectItem value="epic">史诗</SelectItem>
                     <SelectItem value="legendary">传说</SelectItem>
                   </SelectContent>
                 </Select>
               </>
             )}
          </div>
        </div>

        <TabsContent value="series" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badgeGroups.map(group => (
              <BadgeSeriesCard 
                key={group.id} 
                group={group} 
                onClick={handleGroupClick}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {filteredBadges.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredBadges.map(badge => (
                <BadgeCard 
                  key={badge.id}
                  badge={badge}
                  isEarned={isBadgeEarned(badge.id)}
                  onClick={handleBadgeClick}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-muted-foreground">
              没有找到匹配的勋章
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Badge Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedBadge && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center flex flex-col items-center gap-2">
                   <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-2 ${isBadgeEarned(selectedBadge.id) ? 'bg-primary/10' : 'bg-slate-100 grayscale'}`}>
                     {selectedBadge.icon.startsWith('/') ? (
                        <img src={selectedBadge.icon} alt={selectedBadge.title} className="w-full h-full object-cover rounded-full" onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/100x100?text=Badge';
                        }}/>
                     ) : (
                        <span>{selectedBadge.icon}</span>
                     )}
                   </div>
                   {selectedBadge.title}
                </DialogTitle>
                <DialogDescription className="text-center">
                  {isBadgeEarned(selectedBadge.id) ? selectedBadge.description : (selectedBadge.isHidden ? selectedBadge.hiddenDescription : selectedBadge.description)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-slate-50 p-3 rounded border">
                    <span className="text-muted-foreground block mb-1">等级</span>
                    <span className="font-medium capitalize">{selectedBadge.level}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border">
                    <span className="text-muted-foreground block mb-1">稀有度</span>
                    <span className="font-medium capitalize">{selectedBadge.rarity}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded border">
                    <span className="text-muted-foreground block mb-1">点数</span>
                    <span className="font-medium">{selectedBadge.metadata.points}</span>
                  </div>
                   <div className="bg-slate-50 p-3 rounded border">
                    <span className="text-muted-foreground block mb-1">状态</span>
                    <span className={`font-medium ${isBadgeEarned(selectedBadge.id) ? 'text-green-600' : 'text-slate-500'}`}>
                      {isBadgeEarned(selectedBadge.id) ? '已获得' : '未解锁'}
                    </span>
                  </div>
                </div>

                {!isBadgeEarned(selectedBadge.id) && (
                  <div className="bg-slate-50 p-4 rounded border">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" /> 解锁条件
                    </h4>
                    <ul className="text-sm space-y-2">
                      {selectedBadge.unlockConditions.map((condition, index) => (
                        <li key={index} className="flex items-start gap-2 text-muted-foreground">
                          <span className="mt-1">•</span>
                          <span>{condition.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <DialogFooter className="sm:justify-center">
                {isBadgeEarned(selectedBadge.id) && (
                  <Button className="w-full sm:w-auto" variant="outline">
                    <Share2 className="w-4 h-4 mr-2" />
                    分享成就
                  </Button>
                )}
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
                  关闭
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BadgesPage;
