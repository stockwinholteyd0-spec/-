
import React, { useState, useEffect } from 'react';
import { X, Mic, Video, PhoneOff, Zap } from 'lucide-react';

interface VideoMatchProps {
  onClose: () => void;
  // Fix: added isMember prop to satisfy App.tsx passing it
  isMember?: boolean;
}

const VideoMatch: React.FC<VideoMatchProps> = ({ onClose, isMember }) => {
  const [phase, setPhase] = useState<'matching' | 'calling'>('matching');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (phase === 'matching') {
      const timer = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(timer);
            setTimeout(() => setPhase('calling'), 500);
            return 100;
          }
          return p + 2;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [phase]);

  if (phase === 'matching') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-stretch justify-center p-12 overflow-hidden">
        {/* 背景矩阵线条 */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative mb-20 flex flex-col items-center">
          <div className="w-48 h-48 border border-white/20 flex items-center justify-center relative">
            <div className="absolute inset-0 border border-yellow-400 animate-pulse"></div>
            <Zap size={64} className="text-yellow-400 fill-yellow-400" />
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white"></div>
          </div>
        </div>
        
        <div className="z-10">
          <h2 className="text-4xl font-black text-white mb-2 tracking-tighter italic uppercase">搜索中.</h2>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.4em] uppercase mb-16">正在初始化灵魂雷达 v2.0</p>
          
          <div className="border border-white/20 p-1 mb-4">
            <div className="h-4 bg-yellow-400 transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between text-[10px] font-black uppercase text-yellow-400 tracking-widest">
            <span>搜索进度: {progress}%</span>
            <span>同步中.</span>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute bottom-20 left-12 right-12 border border-white/40 py-6 text-white text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all"
        >
          取消搜索
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* 远程画面：硬朗边缘 */}
      <div className="flex-1 bg-gray-900 overflow-hidden relative border-b-4 border-yellow-400">
        <img src="https://picsum.photos/seed/matched-user/1080/1920" className="w-full h-full object-cover grayscale opacity-80" />
        <div className="absolute top-8 left-8 border-l-4 border-yellow-400 pl-4">
          <h3 className="text-white text-3xl font-black tracking-tighter uppercase italic">苏菲亚 · 陈</h3>
          <p className="text-yellow-400 text-[10px] font-black tracking-[0.4em] uppercase">已连接 / 00:04</p>
        </div>
        
        {/* 本地画面：方块预览 */}
        <div className="absolute top-8 right-8 w-32 aspect-[3/4] border-2 border-white overflow-hidden shadow-2xl">
          <img src="https://picsum.photos/seed/user-me/200" className="w-full h-full object-cover scale-x-[-1] grayscale" />
        </div>
      </div>

      {/* 控制中心：全屏宽度的方块按钮 */}
      <div className="grid grid-cols-3 h-32 divide-x divide-white/10 bg-black">
        <button className="flex items-center justify-center text-white hover:bg-gray-900">
          <Mic size={24} />
        </button>
        <button onClick={onClose} className="bg-red-600 flex items-center justify-center text-white hover:bg-red-700 active:scale-95 transition-all">
          <PhoneOff size={32} strokeWidth={3} />
        </button>
        <button className="flex items-center justify-center text-white hover:bg-gray-900">
          <Video size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoMatch;
