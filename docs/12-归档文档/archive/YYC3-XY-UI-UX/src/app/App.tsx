import React, { useEffect } from 'react';
import { NavigationProvider, useNavigation } from '../contexts/NavigationContext';
import { Header } from './components/layout/Header';
import { WelcomeSection } from './components/layout/WelcomeSection';
import { SectionTitle } from './components/layout/SectionTitle';
import { GrowthCard } from './components/business/GrowthCard';
import { CultureCarousel } from './components/business/CultureCarousel';
import { LearningProgress } from './components/business/LearningProgress';
import { RecommendationCard } from './components/business/RecommendationCard';
import { GlobalNavigation } from './components/system/GlobalNavigation';
import { AIFloatWindow } from './components/system/AIFloatWindow';
import { SettingsPage } from './components/pages/SettingsPage';
import { NewHomePage } from './components/pages/NewHomePage';
import { VideoPage } from './components/pages/VideoPage';
import { TaskPage } from './components/pages/TaskPage';
import { CreatePage } from './components/pages/CreatePage';
import { SchedulePage } from './components/pages/SchedulePage';
import { MessageCenterPage } from './components/pages/MessageCenterPage';
import { AudioBookPage } from './components/pages/AudioBookPage';
import { PublicWelfarePage } from './components/pages/PublicWelfarePage';
import { PublicClassPage } from './components/pages/PublicClassPage';
import { GrowthRecordPage } from './components/pages/GrowthRecordPage';
import { GrowthSystemPage } from './components/pages/GrowthSystemPage';
import { BadgesPage } from './components/pages/BadgesPage';
import { CultureDetailPage } from './components/pages/CultureDetailPage';
import { CulturePage } from './components/pages/CulturePage';
import { CharacterSystemPage } from './components/pages/CharacterSystemPage';
import GrowthTreePage from './components/pages/GrowthTreePage';
import GrowthSystemIntegration from './components/integration/GrowthSystemIntegration';
import { characterManager } from '../services/character';
import { 
  mockUserData, 
  mockGrowthData, 
  mockCultureItems, 
  mockLearningProgress,
  mockRecommendations 
} from '../data/mockData';

const AppContent: React.FC = () => {
  const { currentPage, navigateTo, goBack, navigationData } = useNavigation();
  
  // 处理 selectedCultureId
  const selectedCultureId = navigationData?.cultureId || 'culture-longmen';

  // 辅助导航函数，兼容之前的接口
  const handleNavigate = (page: string, data?: any) => {
    navigateTo(page, data);
  };

  // 初始化默认角色配置
  useEffect(() => {
    // 设置默认女性角色
    characterManager.setCurrentChild(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 pb-20">
      {/* 新版首页 */}
      {currentPage === 'home' && (
        <NewHomePage onNavigate={handleNavigate} />
      )}

      {/* 视频工坊 */}
      {currentPage === 'video' && (
        <VideoPage />
      )}

      {/* 作业任务 */}
      {currentPage === 'task' && (
        <TaskPage />
      )}

      {/* 创意工坊 */}
      {currentPage === 'create' && (
        <CreatePage />
      )}

      {/* 智能课表 */}
      {currentPage === 'schedule' && (
        <SchedulePage />
      )}
      
      {/* 旧版首页 - 保留作为参考或备用 */}
      {currentPage === 'old_home' && (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <WelcomeSection userData={mockUserData} />
          
          <section className="mb-8">
            <SectionTitle 
              title="成长记录" 
              subtitle="记录每一个成长的瞬间"
              onMore={() => handleNavigate('growth')} 
            />
            <GrowthCard
              ageStage={mockGrowthData.stage}
              growthData={mockGrowthData}
              onViewDetails={() => handleNavigate('growth')}
            />
          </section>
          
          <section className="mb-8">
            <SectionTitle 
              title="河洛文化探索" 
              subtitle="探索洛阳千年文化底蕴"
              onMore={() => handleNavigate('culture')} 
            />
            <CultureCarousel items={mockCultureItems} />
          </section>
          
          <section className="mb-8">
            <SectionTitle 
              title="学习进度" 
              subtitle="持续学习，不断进步"
              onMore={() => handleNavigate('learning')} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLearningProgress.map((progress, index) => (
                <LearningProgress
                  key={index}
                  {...progress}
                  onContinue={() => console.log(`Continue ${progress.subject}`)}
                />
              ))}
            </div>
          </section>
          
          <section className="mb-8">
            <SectionTitle title="为你推荐" subtitle="基于你的年龄和兴趣推荐" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mockRecommendations.map((rec) => (
                <RecommendationCard
                  key={rec.id}
                  {...rec}
                  onClick={() => console.log(`Clicked ${rec.title}`)}
                />
              ))}
            </div>
          </section>
        </main>
      )}

      {currentPage === 'growth' && (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">成长记录</h1>
            <p className="text-gray-600">记录每一个成长的瞬间，见证进步的力量</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GrowthCard
              ageStage={mockGrowthData.stage}
              growthData={mockGrowthData}
            />
          </div>
          
          <div className="mt-8 bg-white rounded-xl p-6 shadow-md">
            <h3 className="mb-4">成长维度详情</h3>
            {mockGrowthData.dimensions.map((dimension, index) => (
              <div key={index} className="mb-6 last:mb-0">
                <div className="flex justify-between items-center mb-3">
                  <h4>{dimension.name}</h4>
                  <span className="text-purple-600 font-bold">{dimension.progress}%</span>
                </div>
                <div className="space-y-2">
                  {dimension.items.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 rounded-lg ${item.completed ? 'bg-green-50' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{item.completed ? '✅' : '⭕'}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.title}</p>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                          {item.date && (
                            <p className="text-gray-500 text-xs mt-1">完成于 {item.date}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {currentPage === 'culture' && (
        <CulturePage onNavigate={handleNavigate} />
      )}

      {currentPage === 'learning' && (
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-gray-900 mb-2">学习中心</h1>
            <p className="text-gray-600">持续学习，不断进步，成就更好的自己</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLearningProgress.map((progress, index) => (
              <LearningProgress
                key={index}
                {...progress}
                onContinue={() => console.log(`Continue ${progress.subject}`)}
              />
            ))}
          </div>
        </main>
      )}

      {currentPage === 'profile' && (
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-6xl shadow-lg">
                {mockUserData.avatar}
              </div>
              <div>
                <h2 className="text-gray-900 mb-2">{mockUserData.name}</h2>
                <p className="text-gray-600 mb-1">{mockUserData.age}岁 · {mockUserData.growthStage}</p>
                <p className="text-gray-500 text-sm">加入时间：2025年12月</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <p className="text-3xl font-bold text-purple-600 mb-1">15</p>
                <p className="text-gray-600 text-sm">学习天数</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-xl">
                <p className="text-3xl font-bold text-pink-600 mb-1">8</p>
                <p className="text-gray-600 text-sm">完成课程</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <p className="text-3xl font-bold text-orange-600 mb-1">4</p>
                <p className="text-gray-600 text-sm">获得成就</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <p className="text-3xl font-bold text-blue-600 mb-1">12</p>
                <p className="text-gray-600 text-sm">文化探索</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="mb-4">成就徽章</h3>
            <div className="grid grid-cols-4 gap-4">
              {mockGrowthData.achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center p-4 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg mb-2">
                    {achievement.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-900 text-center">{achievement.title}</p>
                  <p className="text-xs text-gray-500">{achievement.earnedDate}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* Settings Page */}
      {currentPage === 'settings' && (
        <SettingsPage userId={mockUserData.id} onNavigate={handleNavigate} />
      )}
      
      {/* Message Center Page */}
      {currentPage === 'messages' && (
        <MessageCenterPage />
      )}
      
      {/* Audio Book Page */}
      {currentPage === 'audiobook' && (
        <AudioBookPage />
      )}
      
      {/* Public Welfare Page */}
      {currentPage === 'welfare' && (
        <PublicWelfarePage />
      )}
      
      {/* Public Class Page */}
      {currentPage === 'public_class' && (
        <PublicClassPage />
      )}
      
      {/* 成长记录页面 */}
      {currentPage === 'growth_record' && (
        <GrowthRecordPage onBack={goBack} />
      )}
      
      {/* 沫语成长守护体系 */}
      {currentPage === 'growth_system' && (
        <GrowthSystemPage onBack={goBack} />
      )}
      
      {/* 成就徽章页面 */}
      {currentPage === 'badges' && (
        <BadgesPage />
      )}
      
      {/* 文化详情页面 */}
      {currentPage === 'culture_detail' && (
        <CultureDetailPage cultureId={selectedCultureId} onBack={goBack} />
      )}

      {/* 角色信息管理页面 */}
      {currentPage === 'character_system' && (
        <CharacterSystemPage />
      )}

      {/* 成长树页面 */}
      {currentPage === 'growth_tree' && (
        <GrowthTreePage onNavigate={handleNavigate} />
      )}

      {/* 成长系统集成页面 */}
      {currentPage === 'growth_integration' && (
        <GrowthSystemIntegration />
      )}
      
      {/* 全局底部导航栏 - 除首页外所有页面显示 */}
      {currentPage !== 'home' && (
        <GlobalNavigation currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      
      <AIFloatWindow />
    </div>
  );
};

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
}

export default App;
