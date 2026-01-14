
import React, { useState, useRef } from 'react';
import { Search, MapPin, SlidersHorizontal, ArrowUpRight, X, RefreshCw } from 'lucide-react';

interface DiscoverViewProps {
  onUserClick: (userId: string) => void;
}

const DiscoverView: React.FC<DiscoverViewProps> = ({ onUserClick }) => {
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pull to refresh states
  const [pullOffset, setPullOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const threshold = 80;

  const categories = ['全部', '都市', '深夜', '装备', '艺术'];
  
  const people = [
    { id: 'u1', name: '艾娃', age: 22, distance: '1.2公里', img: 'https://picsum.photos/seed/ava/600/800', tag: '艺术' },
    { id: 'u2', name: '卢卡斯', age: 25, distance: '0.8公里', img: 'https://picsum.photos/seed/lucas/600/800', tag: '装备' },
    { id: 'u3', name: '米娅', age: 21, distance: '2.5公里', img: 'https://picsum.photos/seed/mia/600/800', tag: '艺术' },
    { id: 'u4', name: '伊森', age: 24, distance: '3.1公里', img: 'https://picsum.photos/seed/ethan/600/800', tag: '都市' },
  ];

  const filteredPeople = people.filter(p => {
    const matchesCategory = activeCategory === '全部' || p.tag === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].pageY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === 0 || isRefreshing) return;
    
    const currentY = e.touches[0].pageY;
    const diff = currentY - startY.current;
    
    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      const offset = Math.min(diff * 0.4, 120);
      setPullOffset(offset);
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    if (pullOffset > threshold) {
      setIsRefreshing(true);
      setPullOffset(threshold);
      setTimeout(() => {
        setIsRefreshing(false);
        setPullOffset(0);
        startY.current = 0;
      }, 1500);
    } else {
      setPullOffset(0);
      startY.current = 0;
    }
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="flex flex-col min-h-screen bg-white relative overflow-y-auto no-scrollbar"
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute left-0 right-0 flex flex-col items-center justify-center bg-gray-50 border-b border-black overflow-hidden transition-all duration-200 pointer-events-none z-30"
        style={{ height: `${pullOffset}px`, opacity: pullOffset > 0 ? 1 : 0 }}
      >
        <div className={`flex flex-col items-center gap-2 ${isRefreshing ? 'animate-pulse' : ''}`}>
          <div className={`w-8 h-8 border-2 border-black flex items-center justify-center bg-white ${isRefreshing ? 'animate-spin' : ''}`}>
             <RefreshCw size={16} className={pullOffset >= threshold ? 'text-yellow-500' : 'text-black'} />
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.3em]">
            {isRefreshing ? '正在捕获灵魂...' : pullOffset >= threshold ? '释放立即刷新' : '下拉探索未知'}
          </span>
        </div>
      </div>

      {/* Search area */}
      <header className="pt-10 border-b border-black sticky top-0 bg-white z-20">
        <div className="px-5 pb-6">
          <h1 className="text-4xl font-black tracking-tighter mb-6 italic">探索.</h1>
          
          <div className="flex flex-col gap-3">
            <div className="relative border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="寻找有趣的灵魂..." 
                className="w-full bg-transparent py-3.5 pl-10 pr-4 text-xs font-black outline-none uppercase placeholder:text-gray-300"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={14} /></button>
              )}
            </div>
            <div className="flex gap-1.5">
              <button 
                onClick={() => alert(`已根据关键词 ${searchQuery || '推荐'} 进行深度匹配`)}
                className="flex-1 bg-black text-white font-black text-[10px] py-3.5 uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                应用筛选
              </button>
              <button 
                onClick={() => setShowFilters(true)}
                className="w-12 border border-black flex items-center justify-center hover:bg-gray-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                 <SlidersHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex border-t border-black bg-gray-50">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-3 text-[9px] font-black tracking-widest border-r border-black last:border-r-0 transition-colors ${
                activeCategory === cat ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-2 divide-x divide-y divide-black border-b border-black min-h-[400px]">
        {filteredPeople.map((person) => (
          <div 
            key={person.id} 
            className="group relative cursor-pointer overflow-hidden bg-black"
            onClick={() => onUserClick(person.id)}
          >
            <img src={person.img} className="w-full h-[180px] object-cover grayscale opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            
            <div className="absolute inset-0 p-4 flex flex-col justify-between">
              <div className="bg-black text-white text-[7px] font-black px-1.5 py-0.5 w-fit border border-white/20">
                {person.tag}
              </div>
              <div className="bg-white p-2.5 border border-black translate-y-1 group-hover:translate-y-0 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-black text-xs">{person.name}, {person.age}</h4>
                  <ArrowUpRight size={12} />
                </div>
                <div className="flex items-center gap-1 text-gray-400 font-black text-[8px] tracking-widest uppercase">
                  <MapPin size={8} fill="currentColor" />
                  <span>{person.distance}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredPeople.length === 0 && (
          <div className="col-span-2 py-20 text-center font-black text-gray-300 text-xs uppercase tracking-widest">
            暂无匹配用户
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6" onClick={() => setShowFilters(false)}>
          <div className="bg-white border-2 border-black w-full max-w-xs p-8 shadow-[10px_10px_0px_0px_rgba(234,179,8,1)]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black uppercase tracking-tighter italic">筛选设置.</h2>
              <button onClick={() => setShowFilters(false)}><X size={24}/></button>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2">性别偏好</p>
                <div className="grid grid-cols-3 border border-black h-10">
                  <button className="flex-1 text-[8px] font-black border-r border-black hover:bg-black hover:text-white transition-colors">男</button>
                  <button className="flex-1 text-[8px] font-black border-r border-black bg-black text-white transition-colors">女</button>
                  <button className="flex-1 text-[8px] font-black hover:bg-black hover:text-white transition-colors">不限</button>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-2">年龄区间</p>
                <div className="flex items-center justify-between text-[10px] font-black uppercase px-2 mb-1">
                  <span>18</span>
                  <span className="text-yellow-500">25</span>
                  <span>40+</span>
                </div>
                <div className="h-1 bg-gray-100 relative">
                  <div className="absolute left-[10%] right-[40%] h-full bg-black"></div>
                  <div className="absolute left-[10%] top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-black bg-white"></div>
                  <div className="absolute right-[40%] top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-black bg-white"></div>
                </div>
              </div>

              <button 
                onClick={() => setShowFilters(false)}
                className="w-full bg-black text-white py-4 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                保存并搜索
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoverView;
