
import React from 'react';
import { ChevronLeft, Heart, MessageSquare, MapPin, ArrowRight } from 'lucide-react';

interface MutualFollowsViewProps {
  onBack: () => void;
  onUserClick: (id: string) => void;
  onChatClick: (id: string) => void;
}

const MutualFollowsView: React.FC<MutualFollowsViewProps> = ({ onBack, onUserClick, onChatClick }) => {
  const mutuals = [
    { 
      id: 'u1', 
      name: '切尔西 · L', 
      avatar: 'https://picsum.photos/seed/lily/200', 
      isOnline: true, 
      distance: '1.2km',
      bio: '极简主义者 / 摄影师 / 旅行家',
      member: true
    },
    { 
      id: 'u4', 
      name: '索菲亚', 
      avatar: 'https://picsum.photos/seed/sophia/200', 
      isOnline: false, 
      distance: '3.5km',
      bio: '数字牧民 / 设计师'
    },
    { 
      id: 'u7', 
      name: '克拉拉', 
      avatar: 'https://picsum.photos/seed/clara/200', 
      isOnline: true, 
      distance: '0.8km',
      bio: '艺术策展人 / 猫咪爱好者'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-20">
        <button onClick={onBack} className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
           <Heart size={18} fill="currentColor" className="text-red-500" />
           <h1 className="text-xl font-black uppercase tracking-tighter italic">互相关注.</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-20">
        <div className="bg-gray-50 border border-black p-4 flex flex-col gap-2 mb-2">
           <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">STATUS REPORT</p>
           <h3 className="text-sm font-black italic">您目前拥有 3 位双向契合的朋友。</h3>
        </div>

        <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {mutuals.map((user) => (
            <div key={user.id} className="p-5 flex items-center justify-between group bg-white">
               <div className="flex items-center gap-4 cursor-pointer" onClick={() => onUserClick(user.id)}>
                  <div className={`w-14 h-14 border border-black p-0.5 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] relative transition-all group-hover:grayscale-0 ${user.isOnline ? '' : 'grayscale'}`}>
                     <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                     {user.isOnline && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border border-black"></div>
                     )}
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="text-[13px] font-black uppercase tracking-tight">{user.name}</h4>
                        {user.member && <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>}
                     </div>
                     <div className="flex items-center gap-2 mb-1">
                        <MapPin size={8} className="text-gray-400" />
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{user.distance}</span>
                        <span className="text-[8px] font-black text-gray-200">|</span>
                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">{user.isOnline ? '在线' : '离线'}</span>
                     </div>
                  </div>
               </div>
               <button 
                 onClick={() => onChatClick(user.id)}
                 className="w-12 h-12 bg-black text-white flex items-center justify-center border border-black shadow-[3px_3px_0px_0px_rgba(234,179,8,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
               >
                  <MessageSquare size={18} />
               </button>
            </div>
          ))}
        </div>

        <div className="py-10 text-center flex flex-col items-center gap-4">
           <div className="w-1 h-10 bg-gray-100"></div>
           <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">共鸣从未停止 / ETERNAL SYNC</p>
        </div>
      </div>
    </div>
  );
};

export default MutualFollowsView;
