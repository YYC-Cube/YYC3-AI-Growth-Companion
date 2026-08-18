import React from 'react';
import { Card } from '../foundation/Card';
import { Button } from '../foundation/Button';
import { characterManager } from '../../../services/character';

export interface NewHomePageProps {
  onNavigate: (page: string) => void;
}

export const NewHomePage: React.FC<NewHomePageProps> = ({ onNavigate }) => {
  // 获取当前角色配置
  const currentCharacter = characterManager.getCurrentCharacter();
  const characterImage = currentCharacter 
    ? characterManager.getCharacterImage('homePage')
    : '/role-photos/girl/xiaoyu-lolita-blue-011.png';
  const characterName = currentCharacter?.name || '小语';
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部栏 */}
      <div className="bg-white shadow-sm px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☀️</span>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold">23°C</span>
                <span className="text-xs text-gray-500">适宜室外</span>
              </div>
              <div className="text-xs text-gray-400">12月18日星期四</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="primary" className="text-sm px-4 py-1.5">登录</Button>
            <Button variant="primary" className="text-sm px-4 py-1.5 bg-green-500">注册</Button>
            <button 
              className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-100 transition-colors"
              onClick={() => onNavigate('messages')}
            >
              📬 消息中心
            </button>
            <button 
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-1 hover:bg-red-100 transition-colors"
              onClick={() => onNavigate('welfare')}
            >
              ❤️ 公益活动
            </button>
            <button 
              className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-sm flex items-center gap-1 hover:bg-orange-100 transition-colors"
              onClick={() => onNavigate('audiobook')}
            >
              📚 有声绘本
            </button>
            <button 
              className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded-lg text-sm flex items-center gap-1 hover:bg-purple-100 transition-colors"
              onClick={() => onNavigate('public_class')}
            >
              📖 公课堂
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧 - 角色形象 */}
          <div className="lg:col-span-1">
            <Card className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-4 mb-4">
                <div className="mb-3">
                  <img 
                    src={characterImage}
                    alt={characterName}
                    className="w-full max-w-xs mx-auto"
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-3">
                <p className="text-gray-700 mb-2">Hi, 云云！今天也一起加油吧！</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl p-6">
                <h3 className="mb-2">快乐学习助手</h3>
                <p className="text-sm opacity-90">万卷江开在云端</p>
              </div>
            </Card>
          </div>

          {/* 右侧 - 功能区 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 教室可引领到子栏目 */}
            <Card className="bg-blue-50 border-blue-200">
              <h3 className="mb-3 text-blue-900">🎓 教室可引领到子栏目</h3>
              <Button 
                variant="ghost" 
                className="text-blue-600 text-sm"
                onClick={() => {}}
              >
                去教室 →
              </Button>
            </Card>

            {/* 今日计划 */}
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  📋
                </div>
                <h3 className="text-gray-900">今日计划</h3>
              </div>
              
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  <span className="text-gray-700">背诵古诗《静夜思》</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600 text-sm">✓</span>
                  <span className="text-gray-500 text-sm">完成 10/36 日计划</span>
                </div>
              </div>
            </Card>

            {/* 作业中心 */}
            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50">
              <h3 className="mb-2 text-gray-900">作业中心</h3>
              <p className="text-gray-600 mb-4 text-sm">云云，保持学习，你能做到!</p>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">语文</span>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">数学</span>
              </div>
              <Button 
                variant="primary"
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600"
                onClick={() => onNavigate('task')}
              >
                开始作业 →
              </Button>
            </Card>

            {/* 快捷功能 - 优化为上下两排，大小一致 */}
            <div className="space-y-4">
              {/* 第一排 - 5个模块 */}
              <div className="grid grid-cols-5 gap-3">
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onNavigate('video')}
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    🎬
                  </div>
                  <p className="text-sm font-medium text-gray-700">视频工坊</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onNavigate('audiobook')}
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    📚
                  </div>
                  <p className="text-sm font-medium text-gray-700">有声绘本</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onNavigate('public_class')}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    📖
                  </div>
                  <p className="text-sm font-medium text-gray-700">公益课堂</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onNavigate('welfare')}
                >
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    ❤️
                  </div>
                  <p className="text-sm font-medium text-gray-700">公益活动</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onNavigate('messages')}
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    📬
                  </div>
                  <p className="text-sm font-medium text-gray-700">消息中心</p>
                </Card>
              </div>
              
              {/* 第二排 - 5个模块 */}
              <div className="grid grid-cols-5 gap-3">
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onNavigate('create')}
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    🎨
                  </div>
                  <p className="text-sm font-medium text-gray-700">创意制作</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                  onClick={() => onNavigate('schedule')}
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    📅
                  </div>
                  <p className="text-sm font-medium text-gray-700">智能课表</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105" 
                  onClick={() => onNavigate('growth_record')}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                    📊
                  </div>
                  <p className="text-sm font-medium text-gray-700">成长记录</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50" 
                  onClick={() => onNavigate('growth_system')}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-2xl">🌟</span>
                  </div>
                  <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">沫语成长守护</p>
                </Card>
                
                <Card 
                  className="text-center cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50"
                  onClick={() => onNavigate('badges')}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-2xl">🏆</span>
                  </div>
                  <p className="text-sm font-medium bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">勋章殿堂</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};