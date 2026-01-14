
import React from 'react';
import { ChevronLeft, Crown, Eye, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { Visitor } from '../types';

interface VisitorRecordsViewProps {
  onBack: () => void;
  onUserClick: (id: string) => void;
  isMember?: boolean;
  onPurchaseMember: () => void;
}

const VisitorRecordsView: React.FC<VisitorRecordsViewProps> = ({ onBack, onUserClick, isMember, onPurchaseMember }) => {
  const visitors: Visitor[] = [
    { 
      id: 'v1', 
      user: { id: 'u1', name: '切尔西 · L', avatar: 'https://picsum.photos/seed/lily/200', isOnline: true },
      time: '12分钟前'
    },
    { 
      id: 'v2', 
      user: { id: 'u4', name: '索菲亚', avatar: 'https://picsum.photos/seed/sophia/200', isOnline: false },
      time: '1小时前'
    },
    { 
      id: 'v3', 
      user: { id: 'u5', name: '大卫', avatar: 'https://picsum.photos/seed/david/200', isOnline: true },
      time: '3小时前'
    },
    { 
      id: 'v4', 
      user: { id: 'u6', name: '林', avatar: 'https://picsum.photos/seed/lin/200', isOnline: false },
      time: '昨天'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-20">
        <button onClick={onBack} className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
           <Eye size={18} />
           <h1 className="text-xl font-black uppercase tracking-tighter italic">访客记录.</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {!isMember ? (
          <div className="p-10 flex flex-col items-center justify-center text-center h-[60vh]">
            <div className="w-24 h-24 border-2 border-black flex items-center justify-center bg-gray-50 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
               <Lock size={40} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">谁在关注你？</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed mb-10 max-w-[240px]">
              只有黑金会员才能查看最近 30 天的详细访客记录。解锁特权，发现契合的灵魂。
            </p>
            
            <button 
              onClick={onPurchaseMember}
              className="w-full h-16 bg-black text-white flex items-center justify-center gap-4 font-black text-[10px] uppercase tracking-[0.4em] shadow-[6px_6px_0px_0px_rgba(234,179,8,1)] active:translate-x-1 active:translate-y-1 transition-all"
            >
              <Crown size={18} fill="currentColor" className="text-yellow-400" />
              开通黑金会员解锁
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            <div className="bg-yellow-50 border border-yellow-400 p-6 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(234,179,8,1)]">
               <Sparkles className="text-yellow-600" size={24} />
               <div>
                  <h3 className="text-[12px] font-black uppercase tracking-widest leading-none mb-1">尊享实时访客提醒</h3>
                  <p className="text-[8px] font-bold text-yellow-600 uppercase tracking-widest opacity-80">已有 32 人在过去 30 天内访问了您的主页</p>
               </div>
            </div>

            <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {visitors.map((v) => (
                <div 
                  key={v.id} 
                  className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => onUserClick(v.user.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 border border-black p-0.5 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <img src={v.user.avatar} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={v.user.name} />
                      </div>
                      {v.user.isOnline && (
                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-[13px] font-black uppercase tracking-tight mb-0.5">{v.user.name}</h4>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{v.time} 来过</p>
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
            
            <p className="text-[8px] font-black text-center text-gray-300 uppercase tracking-[0.5em] pt-4">仅显示最近 30 天的访客数据</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisitorRecordsView;
