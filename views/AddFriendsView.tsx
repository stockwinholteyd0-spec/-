
import React, { useState } from 'react';
import { ChevronLeft, Search, UserPlus, QrCode, Contact, ArrowRight } from 'lucide-react';

interface AddFriendsViewProps {
  onBack: () => void;
  onUserClick: (id: string) => void;
}

const AddFriendsView: React.FC<AddFriendsViewProps> = ({ onBack, onUserClick }) => {
  const [query, setQuery] = useState('');
  
  const suggestions = [
    { id: 'u4', name: '索菲亚', bio: '数字牧民 / 极简主义者', avatar: 'https://picsum.photos/seed/sophia/200' },
    { id: 'u5', name: '大卫', bio: '黑胶音乐爱好者', avatar: 'https://picsum.photos/seed/david/200' },
    { id: 'u6', name: '林', bio: '建筑摄影师', avatar: 'https://picsum.photos/seed/lin/200' }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="px-6 py-6 border-b border-black flex items-center justify-between sticky top-0 bg-white z-20">
        <button onClick={onBack} className="w-10 h-10 border border-black flex items-center justify-center active:scale-95 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-black uppercase tracking-tighter italic">加好友.</h1>
        <div className="w-10"></div>
      </header>

      <div className="p-6 space-y-10">
        {/* Search Input */}
        <div className="space-y-4">
          <div className="relative border-2 border-black p-1 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={20} />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索 ID / 手机号 / 昵称"
              className="w-full bg-transparent py-4 pl-12 pr-4 text-xs font-black outline-none uppercase placeholder:text-gray-300"
            />
            {query && (
              <button 
                onClick={() => alert(`正在全域搜索: ${query}`)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 text-[8px] font-black uppercase"
              >
                搜索
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-3 border border-black p-4 hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <QrCode size={18}/>
              <span className="text-[10px] font-black uppercase">扫一扫</span>
            </button>
            <button className="flex items-center justify-center gap-3 border border-black p-4 hover:bg-gray-50 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Contact size={18}/>
              <span className="text-[10px] font-black uppercase">通讯录</span>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-300 tracking-[0.4em] uppercase ml-1">推荐契合灵魂.</h3>
          <div className="border border-black divide-y divide-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {suggestions.map((user) => (
              <div key={user.id} className="p-5 flex items-center justify-between group hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => onUserClick(user.id)}>
                  <div className="w-12 h-12 border border-black p-0.5 bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <img src={user.avatar} className="w-full h-full object-cover grayscale" alt={user.name} />
                  </div>
                  <div>
                    <h4 className="text-[12px] font-black uppercase tracking-tight">{user.name}</h4>
                    <p className="text-[9px] font-bold text-gray-400 uppercase truncate max-w-[150px]">{user.bio}</p>
                  </div>
                </div>
                <button 
                  onClick={() => alert('已发送好友请求')}
                  className="w-10 h-10 border border-black flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(234,179,8,1)] active:shadow-none"
                >
                  <UserPlus size={16} />
                </button>
              </div>
            ))}
          </div>
          <button className="w-full text-center py-4 text-[9px] font-black uppercase text-gray-400 tracking-widest flex items-center justify-center gap-2">
            查看更多推荐 <ArrowRight size={12} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default AddFriendsView;
