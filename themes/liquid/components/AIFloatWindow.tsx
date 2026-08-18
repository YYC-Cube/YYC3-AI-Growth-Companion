import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mic, Sparkles } from 'lucide-react';
import aiFloatButtonImage from 'figma:asset/eefcde44abc5ffeeafd4c29bd11a37e6bb443de7.png';
import xiaoyuAvatarImage from 'figma:asset/756dfe314fb38126716f95a510053d8b3706a450.png';

export interface AIFloatWindowProps {
  initialPosition?: { x: number; y: number };
  size?: { width: number; height: number };
  theme?: 'light' | 'dark';
  onInteraction?: (type: string, data?: Record<string, unknown>) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const springConfig = { type: 'spring' as const, stiffness: 400, damping: 28 };

export const AIFloatWindow: React.FC<AIFloatWindowProps> = ({
  onInteraction,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是小语，你的AI成长伙伴 🌿 有什么我可以帮你的吗？',
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (input: string): string => {
    if (input.includes('洛阳') || input.includes('文化')) {
      return '洛阳是十三朝古都，有着非常丰富的历史文化！🏛️ 你想了解龙门石窟、白马寺，还是牡丹花会呢？';
    }
    if (input.includes('学习') || input.includes('作业')) {
      return '学习是一件快乐的事！📚 我们一步一步来，先从今天的任务开始吧。你想先复习语文还是数学呢？';
    }
    if (input.includes('你好') || input.includes('嗨')) {
      return '你好呀！🌱 今天过得怎么样？有什么想和小语聊聊的吗？';
    }
    return `我听到你说的了！"${input}" 这是个很好的想法 🌿 我们可以一起探索更多哦～`;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsThinking(true);
    onInteraction?.('send-message', { content: inputText });

    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(inputText),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsThinking(false);
    }, 1200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    onInteraction?.('voice-click', { listening: !isListening });
    if (!isListening) {
      setTimeout(() => {
        setInputText('我想要学习关于洛阳的历史');
        setIsListening(false);
      }, 2000);
    }
  };

  const quickReplies = ['讲个故事 📖', '文化探索 🏛️', '今日任务 ✅', '成长记录 📊'];

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={springConfig}
            className="absolute bottom-20 right-0 w-[380px] h-[540px] flex flex-col overflow-hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(30px) saturate(200%)',
              WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.7)',
              boxShadow: '0 20px 60px rgba(16, 185, 129, 0.15), 0 8px 24px rgba(0,0,0,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="p-4 flex justify-between items-center shrink-0 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669, #047857)',
                borderRadius: '24px 24px 0 0',
              }}
            >
              <div className="absolute inset-0 shimmer pointer-events-none opacity-30" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-11 h-11 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-white/10 shrink-0">
                  <img src={xiaoyuAvatarImage} alt="小语" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="text-white text-base" style={{ fontWeight: 600, lineHeight: 1.3 }}>小语AI助手</h3>
                  <p className="text-xs text-emerald-100">
                    {isListening ? '正在聆听...' : isThinking ? '思考中...' : '随时为您服务 🌿'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(false)}
                className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center relative z-10 transition-colors"
              >
                <X size={16} className="text-white" />
              </motion.button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 glass-scroll">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 shadow-sm border border-white/40">
                      <img src={xiaoyuAvatarImage} alt="小语" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] p-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-2xl rounded-tr-lg'
                        : 'text-gray-700 rounded-2xl rounded-tl-lg'
                    }`}
                    style={
                      msg.role === 'user'
                        ? {
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                          }
                        : {
                            background: 'rgba(255, 255, 255, 0.7)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.6)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                          }
                    }
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isThinking && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-end gap-2"
                >
                  <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0">
                    <img src={xiaoyuAvatarImage} alt="小语" className="w-full h-full object-cover" />
                  </div>
                  <div
                    className="p-3 rounded-2xl rounded-tl-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.7)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-2 h-2 rounded-full bg-emerald-400"
                          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 py-2 shrink-0">
              <div className="flex gap-2 overflow-x-auto glass-scroll pb-1">
                {quickReplies.map((reply) => (
                  <motion.button
                    key={reply}
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setInputText(reply.replace(/\s*[📖🏛️✅📊]/g, '').trim());
                      setTimeout(() => {
                        const newMsg: ChatMessage = {
                          id: Date.now().toString(),
                          role: 'user',
                          content: reply.replace(/\s*[📖🏛️✅📊]/g, '').trim(),
                          timestamp: Date.now(),
                        };
                        setMessages((prev) => [...prev, newMsg]);
                        setIsThinking(true);
                        setTimeout(() => {
                          const aiResponse: ChatMessage = {
                            id: (Date.now() + 1).toString(),
                            role: 'assistant',
                            content: getAIResponse(reply),
                            timestamp: Date.now(),
                          };
                          setMessages((prev) => [...prev, aiResponse]);
                          setIsThinking(false);
                        }, 800);
                        setInputText('');
                      }, 100);
                    }}
                    className="px-3 py-1.5 bg-emerald-50/80 text-emerald-600 rounded-xl text-xs whitespace-nowrap hover:bg-emerald-100/80 transition-colors backdrop-blur-sm border border-emerald-100/60"
                    style={{ fontWeight: 500 }}
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.5)' }}>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleListening}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    isListening
                      ? 'bg-red-100/80 text-red-500 border border-red-200/50'
                      : 'bg-white/50 text-gray-500 border border-white/60 hover:bg-white/70'
                  }`}
                  style={{ backdropFilter: 'blur(10px)' }}
                >
                  <Mic size={18} className={isListening ? 'animate-pulse' : ''} />
                </motion.button>
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="输入消息..."
                  className="glass-input flex-1 px-4 py-2.5 text-sm outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="glass-btn w-10 h-10 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
                >
                  <Send size={16} className="text-white relative z-10" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="ai-pulse-btn w-[68px] h-[68px] rounded-2xl flex items-center justify-center relative z-50 overflow-hidden p-0"
        style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
          border: '2px solid rgba(255,255,255,0.5)',
        }}
      >
        <img
          src={aiFloatButtonImage}
          alt="小语AI"
          className="w-full h-full object-cover rounded-xl"
        />
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center"
        >
          <Sparkles size={10} className="text-white" />
        </motion.span>
      </motion.button>
    </div>
  );
};
