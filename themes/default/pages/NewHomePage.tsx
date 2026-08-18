import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import xiaoyuHomeImage from 'figma:asset/4a906e3a628c931914b1098cb25edfc99fd533d8.png';
import { characterManager } from '../../../services/character';
import { Leaf, Sparkles, BookOpen, Palette, Calendar, MessageSquare, Heart, Mic, Film, Award, TreePine, BarChart3, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';

export interface NewHomePageProps {
  onNavigate: (page: string) => void;
}

const springConfig = { type: 'spring' as const, stiffness: 300, damping: 24 };

const TypewriterText: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      {!done && <span className="typing-cursor" />}
    </span>
  );
};

export const NewHomePage: React.FC<NewHomePageProps> = ({ onNavigate }) => {
  const currentCharacter = characterManager.getCurrentCharacter();
  const characterName = currentCharacter?.name || '小语';

  const quickFeatures = [
    { id: 'video', icon: <Film size={22} />, label: '视频工坊', color: 'from-emerald-400 to-teal-500', delay: 0 },
    { id: 'audiobook', icon: <BookOpen size={22} />, label: '有声绘本', color: 'from-green-400 to-emerald-500', delay: 0.05 },
    { id: 'public_class', icon: <GraduationCap size={22} />, label: '公益课堂', color: 'from-teal-400 to-cyan-500', delay: 0.1 },
    { id: 'welfare', icon: <Heart size={22} />, label: '公益活动', color: 'from-emerald-500 to-green-600', delay: 0.15 },
    { id: 'messages', icon: <MessageSquare size={22} />, label: '消息中心', color: 'from-green-500 to-teal-500', delay: 0.2 },
  ];

  const quickFeatures2 = [
    { id: 'create', icon: <Palette size={22} />, label: '创意制作', color: 'from-teal-500 to-emerald-600', delay: 0.25 },
    { id: 'schedule', icon: <Calendar size={22} />, label: '智能课表', color: 'from-green-400 to-lime-500', delay: 0.3 },
    { id: 'growth_record', icon: <BarChart3 size={22} />, label: '成长记录', color: 'from-emerald-400 to-green-500', delay: 0.35 },
    { id: 'growth_system', icon: <TreePine size={22} />, label: '沫语成长守护', color: 'from-green-600 to-emerald-700', delay: 0.4, featured: true },
    { id: 'badges', icon: <Award size={22} />, label: '勋章殿堂', color: 'from-amber-400 to-yellow-500', delay: 0.45, featured: true },
  ];

  return (
    <div className="relative min-h-screen pb-8">
      {/* Glass Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...springConfig, delay: 0.1 }}
        className="glass-header sticky top-0 z-40 px-4 py-3"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <motion.div
              className="float-logo"
              whileHover={{ rotate: 15, scale: 1.1 }}
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Leaf size={20} className="text-white" />
              </div>
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg text-gray-800" style={{ fontWeight: 600 }}>23°C</span>
                <span className="text-xs text-emerald-600 bg-emerald-50/80 px-2 py-0.5 rounded-full backdrop-blur-sm">适宜室外</span>
              </div>
              <div className="text-xs text-gray-400">3月7日 星期六</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { label: '消息', icon: '📬', page: 'messages', bg: 'emerald' },
              { label: '公益', icon: '❤️', page: 'welfare', bg: 'green' },
              { label: '绘本', icon: '📚', page: 'audiobook', bg: 'teal' },
              { label: '公课', icon: '📖', page: 'public_class', bg: 'cyan' },
            ].map((item) => (
              <motion.button
                key={item.page}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate(item.page)}
                className="px-3 py-1.5 bg-white/40 backdrop-blur-md border border-white/50 text-gray-600 rounded-xl text-xs flex items-center gap-1 hover:bg-white/60 transition-all hover:shadow-md"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-btn px-4 py-1.5 text-xs text-white rounded-xl"
            >
              登录
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left - Character Card */}
          <motion.div
            className="lg:col-span-1"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ ...springConfig, delay: 0.2 }}
          >
            <div className="glass-card glass-green-3 p-0 overflow-hidden">
              {/* Character Image */}
              <div className="relative p-6 pb-2">
                <div className="absolute inset-0 overflow-hidden rounded-t-[20px]">
                  <div className="absolute top-4 left-6 w-16 h-16 rounded-full bg-emerald-300/20 blur-xl animate-pulse" />
                  <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-green-300/20 blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
                  <div className="absolute top-1/3 right-6 w-8 h-8 rounded-full bg-teal-300/15 blur-lg animate-pulse" style={{ animationDelay: '2s' }} />
                </div>
                <motion.div
                  className="relative z-10"
                  whileHover={{ scale: 1.03 }}
                  transition={springConfig}
                >
                  <img
                    src={xiaoyuHomeImage}
                    alt={characterName}
                    className="w-full max-w-[240px] mx-auto drop-shadow-2xl"
                  />
                </motion.div>
                <div className="relative z-10 text-center mt-2">
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ ...springConfig, delay: 0.5 }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/60 backdrop-blur-md rounded-full text-sm text-emerald-700 shadow-sm border border-white/50"
                    style={{ fontWeight: 500 }}
                  >
                    <Sparkles size={14} className="text-emerald-500" />
                    {characterName} · AI成长伙伴
                  </motion.span>
                </div>
              </div>

              {/* Greeting */}
              <div className="px-5 pb-3">
                <div className="glass-card glass-card-subtle p-4 text-center">
                  <p className="text-gray-700 text-sm">
                    <TypewriterText text={`Hi, 云云！今天也一起加油吧！🌿`} />
                  </p>
                </div>
              </div>

              {/* Bottom Banner */}
              <div className="mx-5 mb-5">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl p-5 relative overflow-hidden cursor-pointer"
                  style={{ boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)' }}
                >
                  <div className="absolute inset-0 shimmer pointer-events-none" />
                  <h3 className="relative z-10 text-white" style={{ fontWeight: 600 }}>
                    <Leaf size={18} className="inline mr-2 opacity-80" />
                    快乐学习助手
                  </h3>
                  <p className="text-sm text-emerald-100 relative z-10 mt-1">万卷江开在云端</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right - Features */}
          <div className="lg:col-span-2 space-y-5">

            {/* Classroom Banner */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...springConfig, delay: 0.25 }}
            >
              <div className="glass-card glass-green-1 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <GraduationCap size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-emerald-800" style={{ fontWeight: 600 }}>教室引领</h3>
                      <p className="text-xs text-emerald-600/70">进入专属学习空间</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-1 text-emerald-600 text-sm hover:text-emerald-700"
                    style={{ fontWeight: 500 }}
                  >
                    去教室 <ChevronRight size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Today's Plan */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...springConfig, delay: 0.3 }}
            >
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shadow-md icon-hover-spin">
                    📋
                  </div>
                  <h3 className="text-gray-800" style={{ fontWeight: 600 }}>今日计划</h3>
                </div>
                <div className="glass-card glass-card-subtle p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-emerald-500" />
                      <span className="text-gray-700 text-sm">背诵古诗《静夜思》</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 text-sm" style={{ fontWeight: 500 }}>✓</span>
                      <span className="text-gray-400 text-xs">完成 10/36 日计划</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Homework Center */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ ...springConfig, delay: 0.35 }}
            >
              <div className="glass-card glass-green-5 p-5">
                <h3 className="text-gray-800 mb-2" style={{ fontWeight: 600 }}>作业中心</h3>
                <p className="text-gray-500 text-sm mb-4">云云，保持学习，你能做到!</p>
                <div className="flex gap-2 mb-4">
                  <span className="px-3 py-1 bg-emerald-100/80 text-emerald-700 rounded-full text-xs backdrop-blur-sm" style={{ fontWeight: 500 }}>语文</span>
                  <span className="px-3 py-1 bg-green-100/80 text-green-700 rounded-full text-xs backdrop-blur-sm" style={{ fontWeight: 500 }}>数学</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigate('task')}
                  className="glass-btn w-full py-3 text-white text-sm rounded-2xl"
                  style={{ fontWeight: 500 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    开始作业 <ChevronRight size={16} />
                  </span>
                </motion.button>
              </div>
            </motion.div>

            {/* Quick Features Grid - Row 1 */}
            <div className="grid grid-cols-5 gap-3">
              {quickFeatures.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...springConfig, delay: 0.4 + feature.delay }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(feature.id)}
                  className="glass-card text-center cursor-pointer p-4"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className={`w-11 h-11 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md text-white`}
                  >
                    {feature.icon}
                  </motion.div>
                  <p className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{feature.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Features Grid - Row 2 */}
            <div className="grid grid-cols-5 gap-3">
              {quickFeatures2.map((feature) => (
                <motion.div
                  key={feature.id}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ ...springConfig, delay: 0.4 + feature.delay }}
                  whileHover={{ y: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate(feature.id)}
                  className={`glass-card text-center cursor-pointer p-4 ${feature.featured ? 'glow-border' : ''}`}
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                    className={`w-11 h-11 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md text-white`}
                  >
                    {feature.icon}
                  </motion.div>
                  <p className={`text-xs ${feature.featured ? 'text-gradient-green' : 'text-gray-600'}`} style={{ fontWeight: 500 }}>
                    {feature.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
