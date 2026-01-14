
import React from 'react';
import { Home, Compass, MessageSquare, User, Zap } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  onLightningClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onLightningClick }) => {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-black flex items-stretch h-[72px] z-50">
      
      <button 
        onClick={() => onTabChange(AppTab.HOME)}
        className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${activeTab === AppTab.HOME ? 'bg-black text-white' : 'text-black hover:bg-gray-50'}`}
      >
        <Home size={20} strokeWidth={activeTab === AppTab.HOME ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-widest uppercase">首页</span>
      </button>

      <button 
        onClick={() => onTabChange(AppTab.DISCOVER)}
        className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${activeTab === AppTab.DISCOVER ? 'bg-black text-white' : 'text-black hover:bg-gray-50'}`}
      >
        <Compass size={20} strokeWidth={activeTab === AppTab.DISCOVER ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-widest uppercase">发现</span>
      </button>

      <button 
        onClick={onLightningClick}
        className="flex-1 bg-black text-yellow-400 flex items-center justify-center transition-all hover:bg-slate-800"
      >
        <Zap size={24} fill="currentColor" />
      </button>

      <button 
        onClick={() => onTabChange(AppTab.MESSAGES)}
        className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all relative ${activeTab === AppTab.MESSAGES ? 'bg-black text-white' : 'text-black hover:bg-gray-50'}`}
      >
        <MessageSquare size={20} strokeWidth={activeTab === AppTab.MESSAGES ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-widest uppercase">消息</span>
        <div className="absolute top-4 right-6 w-1.5 h-1.5 bg-red-500"></div>
      </button>

      <button 
        onClick={() => onTabChange(AppTab.ME)}
        className={`flex-1 flex flex-col items-center justify-center gap-1 transition-all ${activeTab === AppTab.ME ? 'bg-black text-white' : 'text-black hover:bg-gray-50'}`}
      >
        <User size={20} strokeWidth={activeTab === AppTab.ME ? 2.5 : 2} />
        <span className="text-[9px] font-bold tracking-widest uppercase">我的</span>
      </button>
      
    </div>
  );
};

export default BottomNav;
